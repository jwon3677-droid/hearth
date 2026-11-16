// Server settings + staff moderation + account settings.
// Staff/admin have owner-level control of every server without being members (invisible in member lists).
const crypto=require('crypto');
module.exports=({app,q,need,err,bad,bcrypt,X,wss,BADGES,RL})=>{
 const isStaff=u=>['staff','admin'].includes(u.role);
 const mgr=async(u,sid,perm)=>isStaff(u)||!!(await q('select 1 from servers where id=$1 and owner_id=$2',[+sid,u.id]))[0]||(!!perm&&await RL.has(u,sid,perm));
 const ping=()=>wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));
 const staff=(req,res,next)=>isStaff(req.u)?next():err(res,'Staff only',403);
 const wipe=async sid=>{const ch=await q('select id from channels where server_id=$1',[sid]);
  if(ch.length)await q('delete from messages where channel=any($1)',[ch.map(c=>'c'+c.id)]);
  await q('update users set tag_server=null where tag_server=$1',[sid]);await q('delete from mod_servers where server_id=$1',[sid]);
  await q('delete from channels where server_id=$1',[sid]);await q('delete from members where server_id=$1',[sid]);await q('delete from servers where id=$1',[sid])};
 const isLounge=async sid=>(await q("select 1 from servers where id=$1 and invite='hearth'",[sid]))[0];
 const nm=(res,n,own)=>{n=String(n||'').trim();if(n.length<2||n.length>30){err(res,'Server name: 2-30 characters');return null}if(!own&&bad(n)){err(res,'That name isn\'t allowed.');return null}return n};

 // ---- staff: browse every server, start/stop moderating (admin access without joining)
 app.post('/api/staff/moderate',need,staff,async(req,res)=>{const id=+req.body.id;
  if(!(await q('select 1 from servers where id=$1',[id]))[0])return err(res,'Server not found',404);
  if(req.body.on)await q('insert into mod_servers values($1,$2) on conflict do nothing',[req.u.id,id]);else await q('delete from mod_servers where user_id=$1 and server_id=$2',[req.u.id,id]);res.json({})});

 // ---- server settings (owner or staff)
 app.put('/api/servers/:id',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id,'manage_server'))return err(res,'Owner only',403);
  const n=nm(res,(req.body||{}).name,req.u.owner);if(!n)return;await q('update servers set name=$1 where id=$2',[n,id]);ping();res.json({})});
 const SS={desc:v=>String(v||'').slice(0,300),sysch:v=>/^\d{0,9}$/.test(String(v||''))?String(v||''):'',sysjoin:Boolean,sysboost:Boolean,systips:Boolean,notif:v=>['all','mentions'].includes(v)?v:'all',verif:v=>['none','low','medium','high'].includes(v)?v:'none',filter:v=>['off','nomembers','all'].includes(v)?v:'off',rules:v=>String(v||'').slice(0,1000),lang:v=>String(v||'en').slice(0,10),inv_pause:Boolean,slow:v=>[0,5,10,30,60,300].includes(+v)?+v:0,nsfw:Boolean,community:Boolean,boost_bar:Boolean,afk:v=>[0,60,300,900,1800,3600].includes(+v)?+v:300,color:v=>/^#[0-9a-f]{6}$/i.test(v)?v:'',bcolor:v=>/^[0-9]$/.test(String(v))?+v:0,traits:v=>Array.isArray(v)?v.slice(0,5).map(x=>({e:String((x&&x.e)||'').slice(0,8),t:String((x&&x.t)||'').replace(/[\u0000-\u001f]/g,'').trim().slice(0,24)})).filter(x=>x.t&&!bad(x.t)):[]};
 app.put('/api/servers/:id/settings',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id,'manage_server'))return err(res,'Owner only',403);
  const b=req.body||{},o={};Object.keys(SS).forEach(k=>{if(k in b)o[k]=SS[k](b[k])});
  await q("update servers set settings=coalesce(settings,'{}'::jsonb)||$1::jsonb where id=$2",[JSON.stringify(o),id]);ping();res.json({})});
 app.delete('/api/servers/:id',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  if(await isLounge(id))return err(res,'The default Hearth Lounge can\'t be deleted');await wipe(id);ping();res.json({})});
 app.post('/api/servers/:id/invite',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id,'manage_server'))return err(res,'Owner only',403);
  if(await isLounge(id))return err(res,'The Lounge invite can\'t be changed');const c=crypto.randomBytes(5).toString('hex');await q('update servers set invite=$1 where id=$2',[c,id]);res.json({invite:c})});
 app.put('/api/channels/:id',need,async(req,res)=>{const[c]=await q('select server_id from channels where id=$1',[+req.params.id]);if(!c)return err(res,'Not found',404);if(!await mgr(req.u,c.server_id,'manage_channels'))return err(res,'Owner only',403);
  const n=String((req.body||{}).name||'');if(!/^[A-Za-z0-9-]{1,20}$/.test(n)||(!req.u.owner&&bad(n)))return err(res,'Channel name: 1-20 letters, numbers or -');
  await q('update channels set name=$1 where id=$2',[n,+req.params.id]);ping();res.json({})});
 app.put('/api/servers/:id/channels/order',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id,'manage_channels'))return err(res,'Owner only',403);
  const ids=((req.body||{}).ids||[]).map(Number).filter(Number.isInteger),have=(await q('select id from channels where server_id=$1',[id])).map(r=>r.id);
  if(ids.length!==have.length||!ids.every(i=>have.includes(i)))return err(res,'Bad channel list');
  await q('update channels c set pos=o.p from (select * from unnest($1::int[]) with ordinality as t(id,p)) o where c.id=o.id',[ids]);ping();res.json({})});
 app.delete('/api/channels/:id',need,async(req,res)=>{const id=+req.params.id,[c]=await q('select server_id from channels where id=$1',[id]);if(!c)return err(res,'Not found',404);if(!await mgr(req.u,c.server_id,'manage_channels'))return err(res,'Owner only',403);
  if((await q('select count(*)::int n from channels where server_id=$1',[c.server_id]))[0].n<=1)return err(res,'A server needs at least one channel');
  await q('delete from messages where channel=$1',['c'+id]);await q('delete from channels where id=$1',[id]);ping();res.json({})});
 app.delete('/api/servers/:id/members/:uid',need,async(req,res)=>{const id=+req.params.id,uid=+req.params.uid;if(!await mgr(req.u,id,'kick_members'))return err(res,'You need the Kick Members permission',403);
  {const c=await RL.ctx(req.u,id);if(!c.priv){const t=await q('select max(r.pos) p from roles r join member_roles mr on mr.role_id=r.id where r.server_id=$1 and mr.user_id=$2',[id,uid]);if(t[0]&&t[0].p!=null&&t[0].p>=c.top)return err(res,'That member\'s highest role is above yours',403)}}
  const[t]=await q('select role from users where id=$1',[uid]),[s]=await q('select owner_id from servers where id=$1',[id]);
  if(!t||!s)return err(res,'Not found',404);if(uid===s.owner_id||['staff','admin'].includes(t.role))return err(res,'You can\'t remove the owner or staff');
  await q('delete from members where server_id=$1 and user_id=$2',[id,uid]);await q('update users set tag_server=null where id=$1 and tag_server=$2',[uid,id]);await RL.clear(id,uid);ping();res.json({})});

 // ---- account settings
 const okPw=async(u,p)=>typeof p==='string'&&await bcrypt.compare(p,u.password);
 app.put('/api/account/username',need,async(req,res)=>{const{username:n,password:p}=req.body||{};
  if(!await okPw(req.u,p))return err(res,'Wrong password',403);
  if(!/^[A-Za-z0-9_.]{2,20}$/.test(n||''))return err(res,'Username: 2-20 letters, numbers, _ or .');if(bad(n))return err(res,'That username isn\'t allowed.');
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

 // ================= staff panel v2: paged, searchable, audited =================
 const lim=(v,d=25)=>Math.max(1,Math.min(100,+v||d)),off=v=>Math.max(0,+v||0),like=v=>'%'+String(v||'').replace(/[\\%_]/g,'\\$&').slice(0,40)+'%';
 const log=(req,action,target,detail)=>q('insert into staff_log(actor,actor_name,action,target,detail) values($1,$2,$3,$4,$5)',[req.u.id,req.u.username,action,String(target||'').slice(0,80),String(detail||'').slice(0,200)]).catch(()=>{});
 app.get('/api/staff/overview',need,staff,async(req,res)=>{const on=new Set([...wss().clients].map(c=>c.uid)).size;
  const[r]=await q(`select (select count(*)::int from users) users,(select count(*)::int from users where banned) banned,(select count(*)::int from users where role in ('staff','admin')) staff,(select count(*)::int from users where created>now()-interval '7 days') new7,
   (select count(*)::int from servers) servers,(select count(*)::int from channels) channels,(select count(*)::int from messages) msgs,(select count(*)::int from messages where ts>now()-interval '24 hours') msgs24,(select count(*)::int from friends where status='ok') friends`);
  res.json({...r,online:on})});
 app.get('/api/staff/users',need,staff,async(req,res)=>{const{q:s,filter:f,sort}=req.query,on=[...wss().clients].map(c=>c.uid),w=['true'],p=[];
  if(s){p.push(like(s));w.push(`(u.username ilike $${p.length} or u.dname ilike $${p.length} or u.id::text=trim('%' from $${p.length}))`)}
  if(f==='staff')w.push("u.role in ('staff','admin')");if(f==='banned')w.push('u.banned');if(f==='new')w.push("u.created>now()-interval '7 days'");if(f==='online'){p.push(on.length?on:[0]);w.push(`u.id=any($${p.length}::int[])`)}
  if(f==='nobadge')w.push("coalesce(array_length(u.badges,1),0)=0");
  const ord={new:'u.id desc',old:'u.id asc',name:'lower(u.username)',msgs:'msgs desc'}[sort]||'u.id desc',L=lim(req.query.limit),O=off(req.query.offset);
  const[t]=await q('select count(*)::int n from users u where '+w.join(' and '),p);
  const rows=await q(`select u.id,u.username,u.dname,u.role,u.badges,u.banned,u.created,(select count(*)::int from messages m where m.user_id=u.id) msgs from users u where ${w.join(' and ')} order by ${ord} limit ${L} offset ${O}`,p);
  const set=new Set(on);res.json({total:t.n,rows:rows.map(r=>({...r,online:set.has(r.id)}))})});
 app.get('/api/staff/user/:id',need,staff,async(req,res)=>{const[u]=await q("select id,username,dname,pronouns,bio,cstatus,role,badges,banned,created,tag_server,(avatar is not null) has_av,(banner is not null) has_bn,theme,peffect,adeco from users where id=$1",[+req.params.id]);if(!u)return err(res,'Not found',404);
  const servers=await q('select s.id,s.name,(s.owner_id=$1) owner from servers s join members m on m.server_id=s.id where m.user_id=$1 order by s.id',[u.id]),[c]=await q('select count(*)::int n,max(ts) last from messages where user_id=$1',[u.id]),[f]=await q("select count(*)::int n from friends where (a=$1 or b=$1) and status='ok'",[u.id]);
  res.json({...u,servers,msgs:c.n,last_msg:c.last,friends:f.n,online:[...wss().clients].some(x=>x.uid===u.id)})});
 const target=async(req,res)=>{const[t]=await q('select id,username,role from users where id=$1',[+req.params.id]);if(!t){err(res,'User not found',404);return null}
  if(t.id===req.u.id){err(res,'You can\'t do that to yourself');return null}if(t.role==='admin'){err(res,'Admins can\'t be moderated',403);return null}
  if(t.role==='staff'&&req.u.role!=='admin'){err(res,'Only the admin can moderate staff',403);return null}return t};
 const ACT={
  ban:async(t,b,req)=>{await q('update users set banned=true where id=$1',[t.id])},unban:async t=>{await q('update users set banned=false where id=$1',[t.id])},
  clear_avatar:async t=>{await q('update users set avatar=null where id=$1',[t.id])},clear_banner:async t=>{await q('update users set banner=null where id=$1',[t.id])},
  clear_bio:async t=>{await q("update users set bio='' where id=$1",[t.id])},clear_status:async t=>{await q("update users set cstatus='' where id=$1",[t.id])},
  clear_dname:async t=>{await q('update users set dname=null,pronouns=null where id=$1',[t.id])},clear_tag:async t=>{await q('update users set tag_server=null where id=$1',[t.id])},
  reset_look:async t=>{await q("update users set peffect='none',adeco=null,pc1=null,pc2=null,neffect='solid',ncolor=null,ncolor2=null where id=$1",[t.id])},
  strip_badges:async t=>{await q("update users set badges='{}' where id=$1",[t.id])},
  purge_msgs:async t=>{await q('delete from messages where user_id=$1',[t.id]);wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'))},
  leave_all:async t=>{await q("delete from members where user_id=$1 and server_id not in(select id from servers where invite='hearth')",[t.id])},
  kick_online:async t=>{wss().clients.forEach(c=>c.uid===t.id&&c.close())}};
 app.post('/api/staff/user/:id/act',need,staff,async(req,res)=>{const t=await target(req,res);if(!t)return;const a=String((req.body||{}).action||'');
  if(a==='role'){if(req.u.role!=='admin')return err(res,'Admins only',403);const r=req.body.role;if(!['user','staff'].includes(r))return err(res,'Bad role');await q('update users set role=$1 where id=$2',[r,t.id]);await log(req,'role',t.username,r);ping();return res.json({})}
  if(a==='rename'){const n=String(req.body.name==null?'':req.body.name).replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim().slice(0,32);
   if(!n)return err(res,'Enter a username');const[o]=await q('select id,username from users where lower(username)=lower($1) and id<>$2',[n,t.id]);let moved='';
   if(o){if(!req.u.owner)return err(res,'Username taken',409);if(o.id===req.u.id)return err(res,'That is your own username');do{moved='hearthusernamechanged'+(Math.floor(Math.random()*9e5)+1e5)}while((await q('select 1 from users where lower(username)=$1',[moved]))[0]);await q('update users set username=$1 where id=$2',[moved,o.id]);await log(req,'rename',o.username,'→ '+moved+' (name taken over)')}
   await q('update users set username=$1 where id=$2',[n,t.id]);await log(req,'rename',t.username,'→ '+n+(req.body.reason?' ('+String(req.body.reason).slice(0,80)+')':''));ping();return res.json({})}
  if(a==='badge'){const{badge,on}=req.body;if(!BADGES.includes(badge))return err(res,'Bad badge');await q('update users set badges=case when $3 then array_append(array_remove(badges,$2),$2) else array_remove(badges,$2) end where id=$1',[t.id,badge,!!on]);await log(req,(on?'badge+':'badge-'),t.username,badge);ping();return res.json({})}
  if(!ACT[a])return err(res,'Unknown action');await ACT[a](t,req.body,req);await log(req,a,t.username,String(req.body.reason||''));ping();res.json({})});
 app.post('/api/staff/bulk',need,staff,async(req,res)=>{const ids=((req.body||{}).ids||[]).map(Number).filter(Number.isInteger).slice(0,100),a=(req.body||{}).action;if(!['ban','unban'].includes(a))return err(res,'Bad action');
  const rows=await q("select id,username from users where id=any($1) and id<>$2 and role='user'",[ids,req.u.id]);await q('update users set banned=$1 where id=any($2)',[a==='ban',rows.map(r=>r.id)]);await log(req,'bulk '+a,rows.length+' users',rows.slice(0,5).map(r=>r.username).join(', '));ping();res.json({n:rows.length})});
 app.get('/api/staff/servers',need,staff,async(req,res)=>{const p=[req.u.id],w=['true'],s=req.query.q;if(s){p.push(like(s));w.push(`(s.name ilike $${p.length} or s.tag ilike $${p.length} or u.username ilike $${p.length})`)}
  const ord={new:'s.id desc',old:'s.id asc',name:'lower(s.name)',size:'members desc'}[req.query.sort]||'s.id desc',L=lim(req.query.limit),O=off(req.query.offset);
  const[t]=await q('select count(*)::int n from servers s left join users u on u.id=s.owner_id where '+w.join(' and '),p.slice(1));
  res.json({total:t.n,rows:await q(`select s.id,s.name,s.tag,s.invite,u.username owner,(select count(*)::int from members m where m.server_id=s.id) members,(select count(*)::int from channels c where c.server_id=s.id) channels,
   exists(select 1 from mod_servers d where d.server_id=s.id and d.user_id=$1) moderating,exists(select 1 from members m where m.server_id=s.id and m.user_id=$1) joined from servers s left join users u on u.id=s.owner_id where ${w.join(' and ')} order by ${ord} limit ${L} offset ${O}`,p)})});
 app.post('/api/staff/server/:id/act',need,staff,async(req,res)=>{const id=+req.params.id,[s]=await q('select id,name,invite from servers where id=$1',[id]);if(!s)return err(res,'Not found',404);const a=String((req.body||{}).action||'');
  if(a==='rename'){const n=nm(res,req.body.name,req.u.owner);if(!n)return;await q('update servers set name=$1 where id=$2',[n,id])}
  else if(a==='reset_invite'){if(s.invite==='hearth')return err(res,'The Lounge invite is fixed');await q('update servers set invite=$1 where id=$2',[crypto.randomBytes(5).toString('hex'),id])}
  else if(a==='clear_tag'){await q('update servers set tag=null,tag_icon=null,tag_color=null where id=$1',[id]);await q('update users set tag_server=null where tag_server=$1',[id])}
  else if(a==='clear_desc'){await q("update servers set settings=coalesce(settings,'{}'::jsonb)-'desc'-'rules' where id=$1",[id])}
  else if(a==='delete'){if(req.u.role!=='admin')return err(res,'Admins only',403);if(s.invite==='hearth')return err(res,'The Lounge can\'t be deleted');await wipe(id)}
  else return err(res,'Unknown action');
  await log(req,'server '+a,s.name,String(req.body.name||''));ping();res.json({})});
 app.get('/api/staff/messages',need,staff,async(req,res)=>{const p=[],w=['true'];if(req.query.q){p.push(like(req.query.q));w.push(`m.body ilike $${p.length}`)}if(req.query.user){p.push(like(req.query.user));w.push(`u.username ilike $${p.length}`)}
  const L=lim(req.query.limit,20),O=off(req.query.offset),[t]=await q('select count(*)::int n from messages m join users u on u.id=m.user_id where '+w.join(' and '),p);
  res.json({total:t.n,rows:await q(`select m.id,m.channel,left(m.body,300) body,m.ts,u.username,u.id uid from messages m join users u on u.id=m.user_id where ${w.join(' and ')} order by m.id desc limit ${L} offset ${O}`,p)})});
 app.get('/api/staff/log',need,staff,async(req,res)=>{const L=lim(req.query.limit,20),O=off(req.query.offset),[t]=await q('select count(*)::int n from staff_log');res.json({total:t.n,rows:await q(`select id,actor_name,action,target,detail,ts from staff_log order by id desc limit ${L} offset ${O}`)})});
};
