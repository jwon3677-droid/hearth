// v7: server cards (tag popout), server banners, custom invite links (/invite/<code>)
const express=require('express'),path=require('path');
module.exports=({app,q,need,err,wss,RL})=>{
 const isStaff=u=>['staff','admin'].includes(u.role);
 const mgr=async(u,sid)=>isStaff(u)||!!(await q('select 1 from servers where id=$1 and owner_id=$2',[+sid,u.id]))[0]||await RL.has(u,sid,'manage_server');
 const ping=()=>wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));
 const mime=b=>b.slice(0,4).toString()==='GIF8'?'image/gif':b[0]===0xff&&b[1]===0xd8?'image/jpeg':b.slice(1,4).toString()==='PNG'?'image/png':b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP'?'image/webp':null;
 const RESERVED=['api','invite','admin','login','signup','staff','hearth','public','static','ws','new','null','undefined'];
 // ---- card: what the tag popout / invite page shows about a server
 const card=async(sid,uid)=>{const[s]=await q("select s.id,s.name,s.invite,s.tag,s.tag_icon,s.tag_color,s.created,(s.icon is not null) has_icon,(s.banner is not null) has_banner,coalesce(s.settings,'{}'::jsonb) st from servers s where s.id=$1",[+sid]);if(!s)return null;
  const rows=await q('select u.id,u.status from members m join users u on u.id=m.user_id where m.server_id=$1 and not u.banned',[s.id]),on=new Set([...wss().clients].filter(c=>c.readyState===1).map(c=>c.uid)),
   [me]=await q('select tag_server from users where id=$1',[uid]);
  return{id:s.id,name:s.name,tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color,has_icon:s.has_icon,default_icon:s.invite==='hearth',has_banner:s.has_banner,bcolor:Number.isInteger(+s.st.bcolor)?+s.st.bcolor:0,
   desc:s.st.desc||'',traits:Array.isArray(s.st.traits)?s.st.traits:[],members:rows.length,online:rows.filter(r=>on.has(r.id)&&r.status!=='invisible').length,created:s.created,
   is_member:rows.some(r=>r.id===uid),wearing:!!me&&me.tag_server===s.id,paused:!!s.st.inv_pause,invite:s.invite}};
 app.get('/api/servers/:id/card',need,async(req,res)=>{const c=await card(req.params.id,req.u.id);if(!c)return err(res,'Server not found',404);
  if(!c.is_member&&!isStaff(req.u))delete c.invite;if(c.is_member&&!(await mgr(req.u,c.id)))delete c.invite;res.json(c)});
 app.get('/api/invite/:code',need,async(req,res)=>{const[s]=await q('select id from servers where lower(invite)=lower($1)',[String(req.params.code||'').slice(0,40)]);if(!s)return err(res,'This invite is invalid or has expired.',404);
  const c=await card(s.id,req.u.id);delete c.invite;res.json(c)});
 // join from the tag popout (only when invites aren't paused)
 app.post('/api/servers/:id/join',need,async(req,res)=>{const c=await card(req.params.id,req.u.id);if(!c)return err(res,'Server not found',404);if(c.is_member)return res.json({id:c.id});
  if(c.paused)return err(res,'Invites to this server are paused right now.',403);await q('insert into members values($1,$2) on conflict do nothing',[c.id,req.u.id]);ping();res.json({id:c.id})});
 // custom invite link
 app.put('/api/servers/:id/invite',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);
  if((await q("select 1 from servers where id=$1 and invite='hearth'",[id]))[0])return err(res,'The Lounge invite can\'t be changed');
  const c=String((req.body||{}).code||'').trim().toLowerCase();if(!/^[a-z0-9][a-z0-9_-]{2,23}$/.test(c))return err(res,'Link: 3-24 letters, numbers, - or _');if(RESERVED.includes(c))return err(res,'That link is reserved');
  try{await q('update servers set invite=$1 where id=$2',[c,id])}catch(e){if(e.code==='23505')return err(res,'That link is already taken');throw e}res.json({invite:c})});
 app.get('/invite/:code',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
 // banner image (up to 5MB)
 const raw=express.raw({type:'*/*',limit:'5mb'});
 app.put('/api/servers/:id/banner',need,raw,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);const b=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
  if(b.length<100||!mime(b))return err(res,'Use a PNG/JPEG/WebP/GIF under 5MB');await q('update servers set banner=$1 where id=$2',[b,id]);ping();res.json({})});
 app.delete('/api/servers/:id/banner',need,async(req,res)=>{const id=+req.params.id;if(!await mgr(req.u,id))return err(res,'Owner only',403);await q('update servers set banner=null where id=$1',[id]);ping();res.json({})});
 app.get('/api/servers/:id/banner',need,async(req,res)=>{const[s]=await q('select banner from servers where id=$1',[+req.params.id]);if(!s||!s.banner)return res.sendStatus(404);
  res.type(mime(s.banner)).set({'Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'}).send(s.banner)});
};
