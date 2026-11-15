const crypto=require('crypto');
module.exports=({app,q,need,err,bad,wss})=>{
 const rooms={};
 const can=async(uid,k)=>{let m;
  if(m=/^dm(\d+)_(\d+)$/.exec(k))return+m[1]<+m[2]&&(+m[1]===uid||+m[2]===uid)&&(await q("select 1 from friends where status='ok' and a=$1 and b=$2",[+m[1],+m[2]]))[0];
  if(m=/^c(\d+)$/.exec(k))return(await q('select 1 from channels c join members s on s.server_id=c.server_id where c.id=$1 and s.user_id=$2',[+m[1],uid]))[0]};
 const ppl=async k=>{const m=/^dm(\d+)_(\d+)$/.exec(k);return m?[+m[1],+m[2]]:(await q('select s.user_id from members s join channels c on c.server_id=s.server_id where c.id=$1',[+k.slice(1)])).map(r=>r.user_id)};
 const to=(ids,o)=>wss().clients.forEach(c=>c.readyState===1&&ids.includes(c.uid)&&c.send(JSON.stringify(o)));
 const leave=ws=>{const r=rooms[ws.room];if(!r)return;r.delete(ws);r.forEach(c=>c.send(JSON.stringify({type:'vout',id:ws.uid})));ws.room=null};
 // servers & channels
 app.get('/api/servers',need,async(req,res)=>{const s=await q('select s.id,s.name,s.owner_id,s.invite from servers s join members m on m.server_id=s.id where m.user_id=$1 order by s.id',[req.u.id]);
  const c=await q('select c.id,c.server_id,c.name,c.kind from channels c join members m on m.server_id=c.server_id where m.user_id=$1 order by c.id',[req.u.id]);
  res.json(s.map(x=>({...x,channels:c.filter(y=>y.server_id===x.id)})))});
 app.post('/api/servers',need,async(req,res)=>{const n=String(req.body.name||'').trim();
  if(n.length<2||n.length>30)return err(res,'Server name: 2-30 characters');if(bad(n))return err(res,'That name isn\'t allowed.');
  if((await q('select count(*)::int n from servers where owner_id=$1',[req.u.id]))[0].n>=5)return err(res,'Max 5 servers per user');
  const[s]=await q('insert into servers(name,owner_id,invite) values($1,$2,$3) returning id',[n,req.u.id,crypto.randomBytes(5).toString('hex')]);
  await q('insert into members values($1,$2)',[s.id,req.u.id]);await q("insert into channels(server_id,name,kind) values($1,'general','text'),($1,'Voice','voice')",[s.id]);res.json({})});
 app.post('/api/join',need,async(req,res)=>{const[s]=await q('select id from servers where invite=$1',[String(req.body.code||'').trim()]);if(!s)return err(res,'Invalid invite code',404);
  await q('insert into members values($1,$2) on conflict do nothing',[s.id,req.u.id]);res.json({})});
 app.post('/api/channels',need,async(req,res)=>{const{server_id:sid,name:n,kind}=req.body;
  if(!(await q('select 1 from servers where id=$1 and owner_id=$2',[+sid,req.u.id]))[0])return err(res,'Owner only',403);
  if(!/^[A-Za-z0-9-]{1,20}$/.test(n||'')||bad(n))return err(res,'Channel name: 1-20 letters, numbers or -');if(!['text','voice'].includes(kind))return err(res,'Bad kind');
  if((await q('select count(*)::int n from channels where server_id=$1',[+sid]))[0].n>=30)return err(res,'Too many channels');
  await q('insert into channels(server_id,name,kind) values($1,$2,$3)',[+sid,n,kind]);res.json({})});
 // friends (a<b normalized)
 app.get('/api/friends',need,async(req,res)=>res.json(await q('select u.id,u.username,f.status,f.by from friends f join users u on u.id=case when f.a=$1 then f.b else f.a end where f.a=$1 or f.b=$1',[req.u.id])));
 app.post('/api/friends',need,async(req,res)=>{const[o]=await q('select id from users where lower(username)=lower($1) and not banned',[String(req.body.username||'')]);
  if(!o||o.id===req.u.id)return err(res,'User not found',404);const a=Math.min(o.id,req.u.id),b=Math.max(o.id,req.u.id);
  await q("insert into friends values($1,$2,'pending',$3) on conflict(a,b) do update set status='ok' where friends.status='pending' and friends.by<>$3",[a,b,req.u.id]);res.json({})});
 app.post('/api/friends/accept',need,async(req,res)=>{const o=+req.body.id;await q("update friends set status='ok' where a=$1 and b=$2 and by<>$3",[Math.min(o,req.u.id),Math.max(o,req.u.id),req.u.id]);res.json({})});
 app.delete('/api/friends/:id',need,async(req,res)=>{const o=+req.params.id;await q('delete from friends where a=$1 and b=$2',[Math.min(o,req.u.id),Math.max(o,req.u.id)]);res.json({})});
 // avatars: client re-encodes to 128px JPEG; server verifies magic bytes + size, serves with fixed type
 const mime=b=>b[0]===0xff&&b[1]===0xd8?'image/jpeg':b.slice(1,4).toString()==='PNG'?'image/png':b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP'?'image/webp':null;
 app.put('/api/avatar',need,async(req,res)=>{const b=Buffer.from(String(req.body.data||''),'base64');if(b.length<100||b.length>150000||!mime(b))return err(res,'Use a PNG/JPEG/WebP under 150KB');
  await q('update users set avatar=$1 where id=$2',[b,req.u.id]);res.json({})});
 app.get('/api/avatar/:id',need,async(req,res)=>{const[u]=await q('select avatar from users where id=$1',[+req.params.id]);if(!u||!u.avatar)return res.sendStatus(404);
  res.type(mime(u.avatar)).set('Cache-Control','private, max-age=300').send(u.avatar)});
 return{can,ppl,to,leave,rooms}};
