// Roles: per-server roles with permissions, colors, hierarchy and member assignment.
const ALL=['administrator','manage_server','manage_roles','manage_channels','manage_messages','kick_members','mention_everyone'];
module.exports=({app,q,need,err,bad,wss})=>{
 const HEX=/^#[0-9a-f]{6}$/i,staff=u=>['staff','admin'].includes(u.role);
 const ping=()=>wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));
 const isOwner=async(u,sid)=>!!(await q('select 1 from servers where id=$1 and owner_id=$2',[+sid,u.id]))[0];
 const isMember=async(uid,sid)=>!!(await q('select 1 from members where server_id=$1 and user_id=$2',[+sid,uid]))[0];
 // what can this user do in this server? priv = owner/site staff (ignore hierarchy)
 const ctx=async(u,sid)=>{if(staff(u)||await isOwner(u,sid))return{priv:true,top:1e9,perms:new Set(ALL)};
  const rs=await q('select r.pos,r.perms from roles r join member_roles mr on mr.role_id=r.id join members m on m.server_id=r.server_id and m.user_id=mr.user_id where r.server_id=$1 and mr.user_id=$2',[+sid,u.id]),p=new Set();let top=-1e9;
  rs.forEach(r=>{top=Math.max(top,r.pos);Object.keys(r.perms||{}).forEach(k=>r.perms[k]&&p.add(k))});return{priv:false,top,perms:p.has('administrator')?new Set(ALL):p}};
 const has=async(u,sid,perm)=>(await ctx(u,sid)).perms.has(perm);
 const below=(c,pos)=>c.priv||pos<c.top;
 const forServers=async(u,list)=>{const m=new Map(),sp=staff(u),by=new Map();
  if(!sp)(await q('select r.server_id sid,r.perms from roles r join member_roles mr on mr.role_id=r.id join members mm on mm.server_id=r.server_id and mm.user_id=mr.user_id where mr.user_id=$1',[u.id])).forEach(r=>{const s=by.get(r.sid)||new Set();Object.keys(r.perms||{}).forEach(k=>r.perms[k]&&s.add(k));by.set(r.sid,s)});
  list.forEach(x=>{if(sp||x.owner_id===u.id)m.set(x.id,ALL.slice());else{const s=by.get(x.id)||new Set();m.set(x.id,s.has('administrator')?ALL.slice():[...s])}});return m};
 const annotate=async(sid,rows)=>{const rs=await q('select mr.user_id uid,r.id,r.name,r.color,r.pos,r.hoist from member_roles mr join roles r on r.id=mr.role_id join members m on m.server_id=r.server_id and m.user_id=mr.user_id where r.server_id=$1 order by r.pos desc,r.id',[+sid]),by={};
  rs.forEach(r=>(by[r.uid]=by[r.uid]||[]).push(r));
  return rows.map(u=>{const l=by[u.id]||[],c=l.find(r=>r.color),h=l.find(r=>r.hoist);return{...u,rids:l.map(r=>r.id),rc:c?c.color:null,hr:h?{id:h.id,name:h.name,pos:h.pos}:null}})};
 const clear=(sid,uid)=>q('delete from member_roles using roles where member_roles.role_id=roles.id and roles.server_id=$1 and member_roles.user_id=$2',[+sid,uid]);
 const list=async sid=>q('select r.id,r.name,r.color,r.perms,r.pos,r.hoist,(select count(*)::int from member_roles mr join members m on m.server_id=r.server_id and m.user_id=mr.user_id where mr.role_id=r.id) count from roles r where r.server_id=$1 order by r.pos desc,r.id',[+sid]);
 const cleanPerms=(b,c,keep)=>{const o={...keep};ALL.forEach(k=>{if(b&&k in b){if(b[k]===true&&c.perms.has(k))o[k]=true;else if(b[k]!==true)delete o[k]}});return o};
 const cleanName=(v,u)=>{const n=String(v==null?'':v).replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e]/g,'').replace(/\s+/g,' ').trim();return n.length<1||n.length>30?null:(!staff(u)&&bad(n)?null:n)};
 app.get('/api/servers/:id/roles',need,async(req,res)=>{const sid=+req.params.id;if(!staff(req.u)&&!await isMember(req.u.id,sid))return err(res,'No access',403);res.json(await list(sid))});
 app.post('/api/servers/:id/roles',need,async(req,res)=>{const sid=+req.params.id,c=await ctx(req.u,sid);if(!c.perms.has('manage_roles'))return err(res,'You need the Manage Roles permission',403);
  const b=req.body||{},n=cleanName(b.name,req.u);if(!n)return err(res,'Role name: 1-30 characters (and nothing that isn\'t allowed)');
  if((await q('select count(*)::int n from roles where server_id=$1',[sid]))[0].n>=25)return err(res,'Max 25 roles per server');
  const[r]=await q('insert into roles(server_id,name,color,perms,pos,hoist) values($1,$2,$3,$4,(select coalesce(min(pos),1)-1 from roles where server_id=$1),$5) returning id',[sid,n,HEX.test(b.color||'')?b.color.toLowerCase():null,JSON.stringify(cleanPerms(b.perms,c,{})),!!b.hoist]);ping();res.json({id:r.id})});
 app.put('/api/roles/:id',need,async(req,res)=>{const[r]=await q('select * from roles where id=$1',[+req.params.id]);if(!r)return err(res,'Role not found',404);const c=await ctx(req.u,r.server_id);
  if(!c.perms.has('manage_roles'))return err(res,'You need the Manage Roles permission',403);if(!below(c,r.pos))return err(res,'That role is above your highest role',403);
  const b=req.body||{};let n=r.name,col=r.color,h=r.hoist,p=r.perms||{};
  if('name' in b){n=cleanName(b.name,req.u);if(!n)return err(res,'Role name: 1-30 characters (and nothing that isn\'t allowed)')}
  if('color' in b){if(b.color&&!HEX.test(b.color))return err(res,'Bad color');col=b.color?b.color.toLowerCase():null}
  if('hoist' in b)h=!!b.hoist;
  if('perms' in b){const keep={};Object.keys(p).forEach(k=>{if(p[k]&&!c.perms.has(k))keep[k]=true});p=cleanPerms(b.perms,c,keep)}
  await q('update roles set name=$1,color=$2,hoist=$3,perms=$4 where id=$5',[n,col,h,JSON.stringify(p),r.id]);ping();res.json({})});
 app.delete('/api/roles/:id',need,async(req,res)=>{const[r]=await q('select * from roles where id=$1',[+req.params.id]);if(!r)return err(res,'Role not found',404);const c=await ctx(req.u,r.server_id);
  if(!c.perms.has('manage_roles')||!below(c,r.pos))return err(res,'You can\'t delete that role',403);await q('delete from roles where id=$1',[r.id]);ping();res.json({})});
 // new order, highest role first
 app.put('/api/servers/:id/roles/order',need,async(req,res)=>{const sid=+req.params.id,c=await ctx(req.u,sid);if(!c.perms.has('manage_roles'))return err(res,'You need the Manage Roles permission',403);
  const ids=((req.body||{}).ids||[]).map(Number),old=await list(sid);if(ids.length!==old.length||!old.every(r=>ids.includes(r.id)))return err(res,'Bad role list');
  if(!c.priv)for(let i=0;i<old.length;i++)if(old[i].pos>=c.top&&ids[i]!==old[i].id)return err(res,'You can\'t move roles at or above your own',403);
  await q('update roles r set pos=o.p from (select * from unnest($1::int[]) with ordinality as t(id,p)) o where r.id=o.id',[ids.slice().reverse()]);ping();res.json({})});
 // give / take roles
 app.put('/api/servers/:sid/members/:uid/roles',need,async(req,res)=>{const sid=+req.params.sid,uid=+req.params.uid,c=await ctx(req.u,sid);if(!c.perms.has('manage_roles'))return err(res,'You need the Manage Roles permission',403);
  if(!await isMember(uid,sid))return err(res,'Not a member',404);const all=await q('select id,pos from roles where server_id=$1',[sid]),want=new Set(((req.body||{}).ids||[]).map(Number)),
   have=new Set((await q('select role_id from member_roles where user_id=$1 and role_id=any($2)',[uid,all.map(r=>r.id)])).map(r=>r.role_id));
  if(!c.priv&&uid!==req.u.id){const tops=all.filter(r=>have.has(r.id)).map(r=>r.pos);if(tops.length&&Math.max(...tops)>=c.top)return err(res,'That member\'s highest role is above yours',403)}
  const add=all.filter(r=>want.has(r.id)&&!have.has(r.id)),rem=all.filter(r=>!want.has(r.id)&&have.has(r.id));
  if(add.concat(rem).some(r=>!below(c,r.pos)))return err(res,'You can only change roles below your highest role',403);
  if(rem.length)await q('delete from member_roles where user_id=$1 and role_id=any($2)',[uid,rem.map(r=>r.id)]);
  for(const r of add)await q('insert into member_roles values($1,$2) on conflict do nothing',[r.id,uid]);ping();res.json({})});
 return{has,ctx,forServers,annotate,clear,ALL,staff};
};
