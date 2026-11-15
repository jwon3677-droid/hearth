// Profile customisation: display name, pronouns, profile effects/themes/colours, server tags.
const HEX=/^#[0-9a-f]{6}$/i,DECOS=['none','halo','crown','cat','devil','neon','ember','sparkle','sweat','thorns','frost','glitch','hearts'],EFFECTS=['none','bubbles','sparkles','snow','embers','hearts','stars','aurora','rain'],
 ICONS=['flame','star','bolt','heart','skull','leaf','moon','crown','gem','paw','ghost','music'];
module.exports=({app,q,need,err,bad,THEMES,wss})=>{
 const clean=(v,max)=>String(v==null?'':v).replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim().slice(0,max);
 const ping=()=>wss().clients.forEach(c=>c.readyState===1&&c.send('{"type":"presence"}'));
 // one save for everything on the Edit Profile screen
 app.put('/api/profile2',need,async(req,res)=>{const b=req.body||{},dname=clean(b.dname,32),pronouns=clean(b.pronouns,30);
  if(dname&&bad(dname))return err(res,'That display name isn\'t allowed.');if(pronouns&&bad(pronouns))return err(res,'Those pronouns aren\'t allowed.');
  if(!THEMES.includes(b.theme))return err(res,'Bad theme');if(!EFFECTS.includes(b.peffect))return err(res,'Bad effect');
  if(b.adeco!=null&&!DECOS.includes(b.adeco))return err(res,'Bad decoration');
  for(const c of[b.pc1,b.pc2])if(c!=null&&!HEX.test(c))return err(res,'Bad color');
  await q('update users set dname=$1,pronouns=$2,theme=$3,peffect=$4,pc1=$5,pc2=$6,adeco=$8 where id=$7',[dname||null,pronouns||null,b.theme,b.peffect,b.pc1?b.pc1.toLowerCase():null,b.pc2?b.pc2.toLowerCase():null,req.u.id,b.adeco&&b.adeco!=='none'?b.adeco:null]);
  ping();res.json({})});
 // server owner defines the tag (2-4 letters/numbers + icon + colour)
 app.put('/api/servers/:id/tag',need,async(req,res)=>{const id=+req.params.id,b=req.body||{};
  if(!(await q("select 1 from servers where id=$1 and (owner_id=$2 or exists(select 1 from users where id=$2 and role in ('staff','admin')))",[id,req.u.id]))[0])return err(res,'Only the server owner or staff can set the tag',403);
  if(b.tag===''||b.tag==null){await q('update servers set tag=null,tag_icon=null,tag_color=null where id=$1',[id]);await q('update users set tag_server=null where tag_server=$1',[id]);ping();return res.json({})}
  const t=String(b.tag).trim().toUpperCase();
  if(!/^[A-Z0-9]{2,4}$/.test(t))return err(res,'Tag: 2-4 letters or numbers');if(bad(t))return err(res,'That tag isn\'t allowed.');
  if(!ICONS.includes(b.icon))return err(res,'Bad icon');if(!HEX.test(b.color||''))return err(res,'Bad color');
  await q('update servers set tag=$1,tag_icon=$2,tag_color=$3 where id=$4',[t,b.icon,b.color.toLowerCase(),id]);ping();res.json({})});
 // each person picks which of their servers' tags to wear
 app.put('/api/me/tag',need,async(req,res)=>{const sid=req.body&&req.body.server_id;
  if(sid==null){await q('update users set tag_server=null where id=$1',[req.u.id]);ping();return res.json({})}
  if(!(await q('select 1 from servers s join members m on m.server_id=s.id where s.id=$1 and m.user_id=$2 and s.tag is not null',[+sid,req.u.id]))[0])return err(res,'That server has no tag, or you aren\'t in it');
  await q('update users set tag_server=$1 where id=$2',[+sid,req.u.id]);ping();res.json({})});
};
