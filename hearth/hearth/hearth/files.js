// Server icons + file attachments (stored in Postgres, 10MB cap)
const MAX=10*1024*1024,rl=require('express-rate-limit'),express=require('express');
const mime=b=>b.slice(0,4).toString()==='GIF8'?'image/gif':b[0]===0xff&&b[1]===0xd8?'image/jpeg':b.slice(1,4).toString()==='PNG'?'image/png':b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP'?'image/webp':null;
module.exports=({app,q,need,err,X,F,bc})=>{
 const raw=express.raw({type:()=>true,limit:MAX}),lim=rl({windowMs:6e4,max:12});
 const canEdit=async(req,id)=>(await q("select 1 from servers where id=$1 and (owner_id=$2 or exists(select 1 from users where id=$2 and role in ('staff','admin')))",[id,req.u.id]))[0];
 app.put('/api/servers/:id/icon',need,lim,raw,async(req,res)=>{const id=+req.params.id,b=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
  if(!await canEdit(req,id))return err(res,'Owner only',403);if(b.length<100||b.length>MAX||!mime(b))return err(res,'Use a PNG/JPEG/WebP/GIF under 10MB');
  await q('update servers set icon=$1 where id=$2',[b,id]);res.json({})});
 app.delete('/api/servers/:id/icon',need,async(req,res)=>{const id=+req.params.id;if(!await canEdit(req,id))return err(res,'Owner only',403);await q('update servers set icon=null where id=$1',[id]);res.json({})});
 app.get('/api/servers/:id/icon',need,async(req,res)=>{const[s]=await q('select icon from servers where id=$1',[+req.params.id]);if(!s||!s.icon)return res.sendStatus(404);
  res.type(mime(s.icon)).set({'Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'}).send(s.icon)});
 // upload a file as a message: PUT raw bytes, ?channel=..&name=..&text=..
 app.post('/api/upload',need,lim,raw,async(req,res)=>{const ch=String(req.query.channel||''),b=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
  if(!await X.can(req.u.id,ch))return err(res,'No access',403);if(!b.length)return err(res,'Empty file');if(b.length>MAX)return err(res,'File too large (max 10MB)',413);
  const name=String(req.query.name||'file').replace(/[\u0000-\u001f\u007f\\/"<>:*?|]/g,'_').slice(0,100)||'file',text=String(req.query.text||'').trim().slice(0,1000),type=mime(b)||'application/octet-stream';
  const[a]=await q('insert into attachments(data,name,type,channel,size) values($1,$2,$3,$4,$5) returning id',[b,name,type,ch,b.length]);
  const[m]=await q('insert into messages(channel,user_id,body,att_id,att_name,att_type,att_size) values($1,$2,$3,$4,$5,$6,$7) returning id',[ch,req.u.id,text,a.id,name,type,b.length]);
  X.to(await X.ppl(ch),{type:'msg',m:await F.one(m.id)});res.json({})});
 app.get('/api/att/:id',need,async(req,res)=>{const[a]=await q('select * from attachments where id=$1',[+req.params.id]);if(!a||!await X.can(req.u.id,a.channel))return res.sendStatus(404);
  const img=a.type!=='application/octet-stream';
  res.set({'Content-Type':img?a.type:'application/octet-stream','Content-Disposition':(img?'inline':'attachment')+'; filename="'+a.name.replace(/[^\x20-\x7e]/g,'_')+'"','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Cache-Control':'private, max-age=3600'}).send(a.data)});
};
