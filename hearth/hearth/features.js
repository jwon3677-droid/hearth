// Hearth features: display-name styles, @mentions, replies, edit/delete, reactions, pins.
// Everything the client shows (mention pills, reaction counts, name styles) is validated or resolved here.
const UX=require('./ux');
module.exports=({app,q,need,err,X,MSG})=>{
 const FONTS=['sans','slab','chunky','script','round','block','serif','marker','tech','pixel','gothic','cursive'],
  FX=['solid','gradient','neon','toon','pop','gummy','prism'],HEX=/^#[0-9a-f]{6}$/i,
  // one emoji: flag, keycap, or pictographic (+skin tone / ZWJ sequence)
  EMO=/^(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?)*)$/u;
 const staffy=u=>['staff','admin'].includes(u.role);
 // staff/admin, or the owner of the server this channel belongs to
 const owns=async(u,ch)=>staffy(u)||(/^c\d+$/.test(ch)&&!!(await q('select 1 from channels c join servers s on s.id=c.server_id where c.id=$1 and s.owner_id=$2',[+ch.slice(1),u.id]))[0]);

 // ---- mentions: resolved server-side so nobody can fake a ping
 const parse=async(body,ch,u)=>{const names=new Set();let ev=false;
  for(const m of body.matchAll(/(?<![\w@])@([A-Za-z0-9_.]{3,20})/g)){let t=m[1];
   for(;;){const l=t.toLowerCase();if(l==='everyone'||l==='here'){ev=true;break}names.add(l);if(t.endsWith('.'))t=t.slice(0,-1);else break}}
  const ids=names.size?(await q('select id from users where id=any($1) and lower(username)=any($2) and not banned',[await X.ppl(ch),[...names]])).map(r=>r.id).filter(i=>i!==u.id):[];
  return{ids,ev:ev&&await owns(u,ch)}};

 // ---- attach mention names, reply preview and reactions to message rows
 const rxOf=async ids=>{const out={};if(!ids.length)return out;
  (await q('select msg_id,emoji,array_agg(user_id order by ts) u from reactions where msg_id=any($1) group by msg_id,emoji order by min(ts),emoji',[ids])).forEach(r=>(out[r.msg_id]||(out[r.msg_id]=[])).push({e:r.emoji,u:r.u}));return out};
 const enrich=async rows=>{if(!rows.length)return rows;
  const mi=[...new Set(rows.flatMap(r=>r.mentions||[]))],ri=[...new Set(rows.map(r=>r.reply_to).filter(Boolean))];
  const[un,rr,rx]=await Promise.all([
   mi.length?q('select id,username from users where id=any($1)',[mi]):[],
   ri.length?q('select m.id,m.body,u.id uid,u.username,u.theme,u.badges,u.nfont,u.neffect,u.ncolor,u.ncolor2,'+UX+' from messages m join users u on u.id=m.user_id where m.id=any($1)',[ri]):[],
   rxOf(rows.map(r=>r.id))]);
  return rows.map(r=>{const{reply_to,...o}=r,p=rr.find(x=>x.id===reply_to);
   return{...o,mn:un.filter(x=>(r.mentions||[]).includes(x.id)),rp:reply_to?(p?{...p,body:p.body.slice(0,140)}:{id:reply_to,gone:true}):null,rx:rx[r.id]||[]}})};
 const one=async id=>(await enrich(await q(MSG+' where m.id=$1',[id])))[0];
 const get=async(req,res)=>{const[m]=await q('select * from messages where id=$1',[+req.params.id]);
  if(!m){err(res,'Message not found',404);return}if(!await X.can(req.u.id,m.channel)){err(res,'No access',403);return}return m};

 // ---- display name style (font / effect / colors). Only whitelisted ids and #rrggbb reach the DB.
 app.put('/api/namestyle',need,async(req,res)=>{const{font,effect,color,color2}=req.body||{};
  if(!FONTS.includes(font)||!FX.includes(effect))return err(res,'Bad style');
  for(const c of[color,color2])if(c!=null&&!HEX.test(c))return err(res,'Bad color');
  await q('update users set nfont=$1,neffect=$2,ncolor=$3,ncolor2=$4 where id=$5',[font,effect,color?color.toLowerCase():null,color2?color2.toLowerCase():null,req.u.id]);res.json({})});

 // ---- edit / delete
 app.put('/api/msg/:id',need,async(req,res)=>{const m=await get(req,res);if(!m)return;
  const b=String((req.body||{}).body||'').trim().slice(0,1000);
  if(m.user_id!==req.u.id)return err(res,'You can only edit your own messages',403);if(!b)return err(res,'Message can\'t be empty');
  const pm=await parse(b,m.channel,req.u);
  if(m.reply_to){const[r]=await q('select user_id from messages where id=$1',[m.reply_to]);if(r&&r.user_id!==req.u.id&&!pm.ids.includes(r.user_id))pm.ids.push(r.user_id)}
  await q('update messages set body=$1,edited=now(),mentions=$2,ev=$3 where id=$4',[b,pm.ids,pm.ev,m.id]);
  X.to(await X.ppl(m.channel),{type:'edit',m:await one(m.id)});res.json({})});
 app.delete('/api/msg/:id',need,async(req,res)=>{const m=await get(req,res);if(!m)return;
  if(m.user_id!==req.u.id&&!await owns(req.u,m.channel))return err(res,'You can\'t delete this message',403);
  await q('delete from messages where id=$1',[m.id]);X.to(await X.ppl(m.channel),{type:'del',id:m.id,channel:m.channel});res.json({})});

 // ---- reactions (toggle)
 app.put('/api/msg/:id/react',need,async(req,res)=>{const m=await get(req,res);if(!m)return;const e=String((req.body||{}).emoji||'');
  if(e.length>32||!EMO.test(e))return err(res,'Not an emoji');
  const had=(await q('delete from reactions where msg_id=$1 and user_id=$2 and emoji=$3 returning 1',[m.id,req.u.id,e]))[0];
  if(!had){if(!req.u.owner&&(await q('select count(distinct emoji)::int n from reactions where msg_id=$1',[m.id]))[0].n>=20)return err(res,'Max 20 different reactions');
   await q('insert into reactions(msg_id,user_id,emoji) values($1,$2,$3) on conflict do nothing',[m.id,req.u.id,e])}
  X.to(await X.ppl(m.channel),{type:'react',id:m.id,channel:m.channel,rx:(await rxOf([m.id]))[m.id]||[]});res.json({})});

 // ---- pins: DM participants, or server owner / staff in servers
 app.put('/api/msg/:id/pin',need,async(req,res)=>{const m=await get(req,res);if(!m)return;const on=!!(req.body||{}).on;
  if(!m.channel.startsWith('dm')&&!await owns(req.u,m.channel))return err(res,'Only the server owner or staff can pin',403);
  if(on&&!req.u.owner&&(await q('select count(*)::int n from messages where channel=$1 and pinned',[m.channel]))[0].n>=50)return err(res,'Max 50 pinned messages');
  await q('update messages set pinned=$1 where id=$2',[on,m.id]);X.to(await X.ppl(m.channel),{type:'pin',id:m.id,channel:m.channel,pinned:on});res.json({})});
 app.get('/api/pins',need,async(req,res)=>{const ch=String(req.query.channel||'');if(!await X.can(req.u.id,ch))return err(res,'No access',403);
  res.json(await enrich(await q(MSG+' where m.channel=$1 and m.pinned order by m.id desc',[ch])))});

 return{parse,enrich,one,owns}};
