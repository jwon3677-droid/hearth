const crypto=require('crypto');
const UX=require('./ux');
module.exports=({app,q,need,err,bad,wss})=>{
 const rooms={},vstart={};
 const can=async(uid,k)=>{let m;
  if(m=/^dm(\d+)_(\d+)$/.exec(k))return+m[1]<+m[2]&&(+m[1]===uid||+m[2]===uid)&&(await q("select 1 from friends where status='ok' and a=$1 and b=$2",[+m[1],+m[2]]))[0];
  if(m=/^c(\d+)$/.exec(k))return(await q('select 1 from channels c where c.id=$1 and (exists(select 1 from members s where s.server_id=c.server_id and s.user_id=$2) or exists(select 1 from users where id=$2 and role in (\'staff\',\'admin\')))',[+m[1],uid]))[0]};
 const ppl=async k=>{const m=/^dm(\d+)_(\d+)$/.exec(k);return m?[+m[1],+m[2]]:(await q("select s.user_id from members s join channels c on c.server_id=s.server_id where c.id=$1 union select id from users where role in ('staff','admin')",[+k.slice(1)])).map(r=>r.user_id)};
 const to=(ids,o)=>wss().clients.forEach(c=>c.readyState===1&&ids.includes(c.uid)&&c.send(JSON.stringify(o)));
 const vpeers=k=>[...(rooms[k]||[])].map(c=>({id:c.uid,name:c.name,muted:!!c.muted,deaf:!!c.deaf}));
 const vmsg=k=>{const p=vpeers(k);return{type:'vroom',ch:k,peers:p,dur:p.length&&vstart[k]?Date.now()-vstart[k]:0}};
 const vbc=async k=>{try{to(await ppl(k),vmsg(k))}catch{}};
 // send a newly connected socket the voice rooms it is allowed to see
 const snap=async ws=>{try{for(const k of Object.keys(rooms))if(rooms[k].size&&await can(ws.uid,k))ws.send(JSON.stringify(vmsg(k)))}catch{}};
 const leave=ws=>{const k=ws.room,r=rooms[k];if(!r)return;r.delete(ws);r.forEach(c=>c.send(JSON.stringify({type:'vout',id:ws.uid})));ws.room=null;
  if(!r.size){delete rooms[k];delete vstart[k]}vbc(k)};
 // servers & channels
 app.get('/api/servers',need,async(req,res)=>{const ids="(select server_id from members where user_id=$1 union select server_id from mod_servers where user_id=$1 and exists(select 1 from users where id=$1 and role in (\'staff\',\'admin\')))";
  const s=await q('select s.id,s.name,s.owner_id,s.invite,s.tag,s.tag_icon,s.tag_color,coalesce(s.settings,\'{}\'::jsonb) settings,(not exists(select 1 from members mm where mm.server_id=s.id and mm.user_id=$1)) is_mod from servers s where s.id in '+ids+' order by s.id',[req.u.id]);
  const c=await q('select c.id,c.server_id,c.name,c.kind from channels c where c.server_id in '+ids+' order by c.pos,c.id',[req.u.id]);
  res.json(s.map(x=>({...x,channels:c.filter(y=>y.server_id===x.id)})))});
 app.post('/api/servers',need,async(req,res)=>{const n=String(req.body.name||'').trim();
  if(n.length<2||n.length>30)return err(res,'Server name: 2-30 characters');if(bad(n))return err(res,'That name isn\'t allowed.');
  if((await q('select count(*)::int n from servers where owner_id=$1',[req.u.id]))[0].n>=5)return err(res,'Max 5 servers per user');
  const[s]=await q('insert into servers(name,owner_id,invite) values($1,$2,$3) returning id',[n,req.u.id,crypto.randomBytes(5).toString('hex')]);
  await q('insert into members values($1,$2)',[s.id,req.u.id]);await q("insert into channels(server_id,name,kind) values($1,'general','text'),($1,'Voice','voice')",[s.id]);res.json({id:s.id})});
 app.post('/api/join',need,async(req,res)=>{const[s]=await q('select id from servers where invite=$1',[String(req.body.code||'').trim()]);if(!s)return err(res,'Invalid invite code',404);
  await q('insert into members values($1,$2) on conflict do nothing',[s.id,req.u.id]);res.json({id:s.id})});
 app.delete('/api/servers/:id/leave',need,async(req,res)=>{const id=+req.params.id,[s]=await q('select owner_id from servers where id=$1',[id]);
  if(!s)return err(res,'Server not found',404);if(s.owner_id===req.u.id)return err(res,'Owners can\'t leave their own server');
  await q('delete from members where server_id=$1 and user_id=$2',[id,req.u.id]);res.json({})});
 app.post('/api/channels',need,async(req,res)=>{const{server_id:sid,name:n,kind}=req.body;
  if(!(await q('select 1 from servers where id=$1 and (owner_id=$2 or exists(select 1 from users where id=$2 and role in (\'staff\',\'admin\')))',[+sid,req.u.id]))[0])return err(res,'Owner only',403);
  if(!/^[A-Za-z0-9-]{1,20}$/.test(n||'')||bad(n))return err(res,'Channel name: 1-20 letters, numbers or -');if(!['text','voice'].includes(kind))return err(res,'Bad kind');
  if((await q('select count(*)::int n from channels where server_id=$1',[+sid]))[0].n>=30)return err(res,'Too many channels');
  await q('insert into channels(server_id,name,kind) values($1,$2,$3)',[+sid,n,kind]);res.json({})});
 // friends (a<b normalized)
 app.get('/api/friends',need,async(req,res)=>{const on=new Set([...wss().clients].map(c=>c.uid));
  res.json((await q('select u.id,u.username,u.theme,u.adeco,u.status pst,u.cstatus,f.status,f.by from friends f join users u on u.id=case when f.a=$1 then f.b else f.a end where f.a=$1 or f.b=$1',[req.u.id]))
   .map(({pst,...r})=>({...r,ps:on.has(r.id)&&pst!=='invisible'?pst||'online':'offline'})))});
 app.post('/api/friends',need,async(req,res)=>{const[o]=await q('select id,allow_fr from users where lower(username)=lower($1) and not banned',[String(req.body.username||'')]);
  if(!o||o.id===req.u.id)return err(res,'User not found',404);if(o.allow_fr===false)return err(res,'This user isn\'t accepting friend requests.',403);const a=Math.min(o.id,req.u.id),b=Math.max(o.id,req.u.id);
  await q("insert into friends values($1,$2,'pending',$3) on conflict(a,b) do update set status='ok' where friends.status='pending' and friends.by<>$3",[a,b,req.u.id]);res.json({})});
 app.post('/api/friends/accept',need,async(req,res)=>{const o=+req.body.id;await q("update friends set status='ok' where a=$1 and b=$2 and by<>$3",[Math.min(o,req.u.id),Math.max(o,req.u.id),req.u.id]);res.json({})});
 app.delete('/api/friends/:id',need,async(req,res)=>{const o=+req.params.id;await q('delete from friends where a=$1 and b=$2',[Math.min(o,req.u.id),Math.max(o,req.u.id)]);res.json({})});
 // avatars: client re-encodes to 128px JPEG; server verifies magic bytes + size, serves with fixed type
 const mime=b=>b.slice(0,4).toString()==='GIF8'?'image/gif':b[0]===0xff&&b[1]===0xd8?'image/jpeg':b.slice(1,4).toString()==='PNG'?'image/png':b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP'?'image/webp':null;
 app.put('/api/avatar',need,async(req,res)=>{const b=Buffer.from(String(req.body.data||''),'base64');if(b.length<100||b.length>300000||!mime(b))return err(res,'Use a PNG/JPEG/WebP/GIF under 300KB');
  await q('update users set avatar=$1 where id=$2',[b,req.u.id]);res.json({})});
 app.delete('/api/avatar',need,async(req,res)=>{await q('update users set avatar=null where id=$1',[req.u.id]);res.json({})});
 app.delete('/api/banner',need,async(req,res)=>{await q('update users set banner=null where id=$1',[req.u.id]);res.json({})});
 app.get('/api/avatar/:id',need,async(req,res)=>{const[u]=await q('select avatar from users where id=$1',[+req.params.id]);if(!u||!u.avatar)return res.sendStatus(404);
  res.type(mime(u.avatar)).set('Cache-Control','private, max-age=300').send(u.avatar)});

 app.put('/api/banner',need,async(req,res)=>{const b=Buffer.from(String(req.body.data||''),'base64');if(b.length<100||b.length>450000||!mime(b))return err(res,'Use a PNG/JPEG/WebP/GIF under 450KB');await q('update users set banner=$1 where id=$2',[b,req.u.id]);res.json({})});
 app.get('/api/banner/:id',need,async(req,res)=>{const[u]=await q('select banner from users where id=$1',[+req.params.id]);if(!u||!u.banner)return res.sendStatus(404);res.type(mime(u.banner)).set('Cache-Control','private, max-age=300').send(u.banner)});
 app.put('/api/bio',need,async(req,res)=>{await q('update users set bio=$1 where id=$2',[String(req.body.bio||'').slice(0,190),req.u.id]);res.json({})});
 app.put('/api/status',need,async(req,res)=>{const s=String(req.body.status||'online'),t=String(req.body.text||'').trim().slice(0,60);
  if(!['online','idle','dnd','invisible'].includes(s))return err(res,'Bad status');if(t&&bad(t))return err(res,'That status isn\'t allowed.');
  await q('update users set status=$1,cstatus=$2 where id=$3',[s,t,req.u.id]);wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));res.json({})});
 app.get('/api/user/:id/mutual',need,async(req,res)=>{const a=req.u.id,b=+req.params.id||0;
  const servers=await q('select s.id,s.name from servers s join members x on x.server_id=s.id and x.user_id=$1 join members y on y.server_id=s.id and y.user_id=$2 order by s.id',[a,b]);
  const fr='select case when a=$1 then b else a end id from friends where status=\'ok\' and (a=$1 or b=$1)';
  const friends=await q('select u.id,u.username,u.theme from users u where not u.banned and u.id in ('+fr+') and u.id in ('+fr.replace(/\$1/g,'$2')+') order by lower(u.username)',[a,b]);
  res.json({servers,friends})});
 app.get('/api/user/:id',need,async(req,res)=>{const[u]=await q('select u.id,u.username,u.bio,u.theme,u.badges,u.role,u.created,u.nfont,u.neffect,u.ncolor,u.ncolor2,'+UX+',u.status,u.cstatus,(u.banner is not null) hb from users u where u.id=$1 and not u.banned',[+req.params.id]);if(!u)return res.sendStatus(404);
  const on=[...wss().clients].some(c=>c.uid===u.id),{status:pst,...pu}=u;u.ps=on&&pst!=='invisible'?pst||'online':'offline';if(u.id===req.u.id)u.status=pst;else delete u.status;
  const[f]=await q('select status,by from friends where a=$1 and b=$2',[Math.min(u.id,req.u.id),Math.max(u.id,req.u.id)]);res.json({...u,friend:f||null})});
 app.get('/api/members/:sid',need,async(req,res)=>{if(!(await q('select 1 where exists(select 1 from members where server_id=$1 and user_id=$2) or exists(select 1 from users where id=$2 and role in (\'staff\',\'admin\'))',[+req.params.sid,req.u.id]))[0])return err(res,'No access',403);
  const on=new Set([...wss().clients].map(c=>c.uid));res.json((await q('select u.id,u.username,u.role,u.theme,u.badges,u.nfont,u.neffect,u.ncolor,u.ncolor2,'+UX+',u.status,u.cstatus from users u join members m on m.user_id=u.id where m.server_id=$1 and not u.banned order by lower(u.username) limit 500',[+req.params.sid])).map(({status,...u})=>{const o=on.has(u.id)&&status!=='invisible';return{...u,online:o,ps:o?status||'online':'offline'}}))});
 return{can,ppl,to,leave,rooms,vstart,vbc,snap}};