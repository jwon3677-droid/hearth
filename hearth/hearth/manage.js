// Server settings + staff moderation + account settings.
// Staff/admin have owner-level control of every server without being members (invisible in member lists).
const crypto=require('crypto');
module.exports=({app,q,need,err,bad,bcrypt,X,wss})=>{
 const isStaff=u=>['staff','admin'].includes(u.role);
 const mgr=async(u,sid)=>isStaff(u)||!!(await q('select 1 from servers where id=$1 and owner_id=$2',[+sid,u.id]))[0];
 const ping=()=>wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));
 const staff=(req,res,next)=>isStaff(req.u)?next():err(res,'Staff only',403);
 const wipe=async sid=>{const ch=await q('select id from channels where server_id=$1',[sid]);
  if(ch.length)await q('delete from messages where channel=any($1)',[ch.map(c=>'c'+c.id)]);
  await q('update users set tag_server=null where tag_server=$1',[sid]);await q('delete from mod_servers where server_id=$1',[sid]);
  await q('delete from channels where server_id=$1',[sid]);await q('delete from members where server_id=$1',[sid]);await q('delete from servers where id=$1',[sid])};
 const isLounge=async sid=>(await q("select 1 from servers where id=$1 and invite='lounge'",[sid]))[0];
 const nm=(res,n)=>{n=String(n||'').trim();if(n.length<2||n.length>30){err(res,'Server name: 2-30 characters');return null}if(bad(n)){err(res,'That name isn\'t allowed.');return null}return n};

 // ---- staff: browse every server, start/stop moderating (admin access without joining)
 app.get('/api/staff/servers',need,staff,async(req,res)=>res.json(await q(`select s.id,s.name,s.tag,u.username owner,(select count(*)::int from members m where m.server_id=s.id) members,(select count(*)::int from channels c where c.server_id=s.id) channels,
  exists(select 1 from mod_servers d where d.server_id=s.id and d.user_id=$1) moderating,exists(select 1 from members m where m.server_id=s.id and m.user_id=$1) joined
  from servers s left join users u on u.id=s.owner_id order by s.id desc limit 300`,[req.u.id])));
 app.post('/api/staff/moderate',need,staff,async(req,res)=>{const id=+req.body.id;
  if(!(await q('select 1 from servers where id=$1',[id]))[0])return err(res,'Server not found',404);
  if(req.body.on)await q('insert into mod_servers values($1,$2) on conflict do nothing',[req.u.id,id]);else await q('delete from mod_servers where user_id=$1 and server_id=$2',[req.u.id,id]);res.json({})});

 // ---- server settings (owner or staff)
 app.put('/api/servers/:id',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  const n=nm(res,(req.body||{}).name);if(!n)return;await q('update servers set name=$1 where id=$2',[n,id]);ping();res.json({})});
 const SS={desc:v=>String(v||'').slice(0,300),sysch:v=>/^\d{0,9}$/.test(String(v||''))?String(v||''):'',sysjoin:Boolean,sysboost:Boolean,systips:Boolean,notif:v=>['all','mentions'].includes(v)?v:'all',verif:v=>['none','low','medium','high'].includes(v)?v:'none',filter:v=>['off','nomembers','all'].includes(v)?v:'off',rules:v=>String(v||'').slice(0,1000),lang:v=>String(v||'en').slice(0,10),inv_pause:Boolean,slow:v=>[0,5,10,30,60,300].includes(+v)?+v:0,nsfw:Boolean,community:Boolean,boost_bar:Boolean,afk:v=>[0,60,300,900,1800,3600].includes(+v)?+v:300,color:v=>/^#[0-9a-f]{6}$/i.test(v)?v:''};
 app.put('/api/servers/:id/settings',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  const b=req.body||{},o={};Object.keys(SS).forEach(k=>{if(k in b)o[k]=SS[k](b[k])});
  await q("update servers set settings=coalesce(settings,'{}'::jsonb)||$1::jsonb where id=$2",[JSON.stringify(o),id]);ping();res.json({})});
 app.delete('/api/servers/:id',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  if(await isLounge(id))return err(res,'The default Hearth Lounge can\'t be deleted');await wipe(id);ping();res.json({})});
 app.post('/api/servers/:id/invite',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  if(await isLounge(id))return err(res,'The Lounge invite can\'t be changed');const c=crypto.randomBytes(5).toString('hex');await q('update servers set invite=$1 where id=$2',[c,id]);res.json({invite:c})});
 app.put('/api/channels/:id',need,async(req,res)=>{const[c]=await q('select server_id from channels where id=$1',[+req.params.id]);if(!c)return err(res,'Not found',404);if(!await mgr(req.u,c.server_id))return err(res,'Owner only',403);
  const n=String((req.body||{}).name||'');if(!/^[A-Za-z0-9-]{1,20}$/.test(n)||bad(n))return err(res,'Channel name: 1-20 letters, numbers or -');
  await q('update channels set name=$1 where id=$2',[n,+req.params.id]);ping();res.json({})});
 app.put('/api/servers/:id/channels/order',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  const ids=((req.body||{}).ids||[]).map(Number).filter(Number.isInteger),have=(await q('select id from channels where server_id=$1',[id])).map(r=>r.id);
  if(ids.length!==have.length||!ids.every(i=>have.includes(i)))return err(res,'Bad channel list');
  await q('update channels c set pos=o.p from (select * from unnest($1::int[]) with ordinality as t(id,p)) o where c.id=o.id',[ids]);ping();res.json({})});
 app.delete('/api/channels/:id',need,async(req,res)=>{const id=+req.params.id,[c]=await q('select server_id from channels where id=$1',[id]);if(!c)return err(res,'Not found',404);if(!await mgr(req.u,c.server_id))return err(res,'Owner only',403);
  if((await q('select count(*)::int n from channels where server_id=$1',[c.server_id]))[0].n<=1)return err(res,'A server needs at least one channel');
  await q('delete from messages where channel=$1',['c'+id]);await q('delete from channels where id=$1',[id]);ping();res.json({})});
 app.delete('/api/servers/:id/members/:uid',need,async(req,res)=>{const id=+req.params.id,uid=+req.params.uid;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  const[t]=await q('select role from users where id=$1',[uid]),[s]=await q('select owner_id from servers where id=$1',[id]);
  if(!t||!s)return err(res,'Not found',404);if(uid===s.owner_id||['staff','admin'].includes(t.role))return err(res,'You can\'t remove the owner or staff');
  await q('delete from members where server_id=$1 and user_id=$2',[id,uid]);await q('update users set tag_server=null where id=$1 and tag_server=$2',[uid,id]);ping();res.json({})});

 // ---- account settings
 const okPw=async(u,p)=>typeof p==='string'&&await bcrypt.compare(p,u.password);
 app.put('/api/account/username',need,async(req,res)=>{const{username:n,password:p}=req.body||{};
  if(!await okPw(req.u,p))return err(res,'Wrong password',403);
  if(!/^[A-Za-z0-9_.]{3,20}$/.test(n||''))return err(res,'Username: 3-20 letters, numbers, _ or .');if(bad(n))return err(res,'That username isn\'t allowed.');
  if((await q('select 1 from users where lower(username)=lower($1) and id<>$2',[n,req.u.id]))[0])return err(res,'Username taken',409);
  await q('update users set username=$1 where id=$2',[n,req.u.id]);ping();res.json({username:n})});
 app.put('/api/account/password',need,async(req,res)=>{const{current:c,next:n}=req.body||{};
  if(!await okPw(req.u,c))return err(res,'Current password is wrong',403);if(typeof n!=='string'||n.length<8||n.length>72)return err(res,'Password must be 8-72 characters');
  await q('update users set password=$1 where id=$2',[await bcrypt.hash(n,12),req.u.id]);res.json({})});
 app.put('/api/account/privacy',need,async(req,res)=>{await q('update users set allow_fr=$1 where id=$2',[(req.body||{}).allow_fr!==false,req.u.id]);res.json({})});
 app.delete('/api/account',need,async(req,res)=>{if(!await okPw(req.u,(req.body||{}).password))return err(res,'Wrong password',403);
  if(req.u.role==='admin')return err(res,'The admin account can\'t be deleted here');
  for(const s of await q('select id from servers where owner_id=$1',[req.u.id]))await wipe(s.id);
  await q('delete from friends where a=$1 or b=$1',[req.u.id]);await q('delete from users where id=$1',[req.u.id]);res.clearCookie('t');ping();res.json({})});
};
