// Server icons + file attachments (stored in Postgres, 10MB cap)
const MAX=10*1024*1024,rl=require('express-rate-limit'),express=require('express');
const mime=b=>b.slice(0,4).toString()==='GIF8'?'image/gif':b[0]===0xff&&b[1]===0xd8?'image/jpeg':b.slice(1,4).toString()==='PNG'?'image/png':b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP'?'image/webp':null;
// audio attachments (voice messages): recognised by file signature AND extension, served inline so <audio> can play them
const amime=(b,name)=>{const x=(/\.([a-z0-9]+)$/i.exec(name)||[])[1]||'',e=x.toLowerCase(),h=b.slice(0,4).toString('latin1');
 if(h==='OggS'&&['ogg','oga','opus'].includes(e))return'audio/ogg';
 if((h.slice(0,3)==='ID3'||(b[0]===0xff&&(b[1]&0xe0)===0xe0))&&['mp3','mpga'].includes(e))return'audio/mpeg';
 if(h==='RIFF'&&b.slice(8,12).toString('latin1')==='WAVE'&&e==='wav')return'audio/wav';
 if(h==='fLaC'&&e==='flac')return'audio/flac';
 if(b[0]===0x1a&&b[1]===0x45&&b[2]===0xdf&&b[3]===0xa3&&['webm','weba'].includes(e))return'audio/webm';
 if(b.slice(4,8).toString('latin1')==='ftyp'&&['m4a','mp4','aac'].includes(e))return'audio/mp4';
 return null};
module.exports=({app,q,need,err,X,F,bc,RL})=>{
 const raw=express.raw({type:()=>true,limit:MAX}),lim=rl({windowMs:6e4,max:12});
 const canEdit=async(req,id)=>(await q("select 1 from servers where id=$1 and (owner_id=$2 or exists(select 1 from users where id=$2 and role in ('staff','admin')))",[id,req.u.id]))[0]||await RL.has(req.u,id,'manage_server');
 app.put('/api/servers/:id/icon',need,lim,raw,async(req,res)=>{const id=+req.params.id,b=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
  if(!await canEdit(req,id))return err(res,'Owner only',403);if(b.length<100||b.length>MAX||!mime(b))return err(res,'Use a PNG/JPEG/WebP/GIF under 10MB');
  await q('update servers set icon=$1 where id=$2',[b,id]);res.json({})});
 app.delete('/api/servers/:id/icon',need,async(req,res)=>{const id=+req.params.id;if(!await canEdit(req,id))return err(res,'Owner only',403);await q('update servers set icon=null where id=$1',[id]);res.json({})});
 app.get('/api/servers/:id/icon',need,async(req,res)=>{if(await require('./imgcache')(q,req,res,'select md5(icon) h from servers where id=$1',[+req.params.id]))return;const[s]=await q('select icon from servers where id=$1',[+req.params.id]);if(!s||!s.icon)return res.sendStatus(404);
  res.type(mime(s.icon)).set({'Cache-Control':'private, max-age=3600, stale-while-revalidate=86400','X-Content-Type-Options':'nosniff'}).send(s.icon)});
 // upload a file as a message: PUT raw bytes, ?channel=..&name=..&text=..
 app.post('/api/upload',need,lim,raw,async(req,res)=>{const ch=String(req.query.channel||''),b=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
  if(!await X.can(req.u.id,ch))return err(res,'No access',403);if(!b.length)return err(res,'Empty file');if(b.length>MAX)return err(res,'File too large (max 10MB)',413);
  const name=String(req.query.name||'file').replace(/[\u0000-\u001f\u007f\\/"<>:*?|]/g,'_').slice(0,100)||'file',text=String(req.query.text||'').trim().slice(0,1000),type=mime(b)||amime(b,name)||'application/octet-stream';
  const[a]=await q('insert into attachments(data,name,type,channel,size) values($1,$2,$3,$4,$5) returning id',[b,name,type,ch,b.length]);
  const[m]=await q('insert into messages(channel,user_id,body,att_id,att_name,att_type,att_size) values($1,$2,$3,$4,$5,$6,$7) returning id',[ch,req.u.id,text,a.id,name,type,b.length]);
  X.to(await X.ppl(ch),{type:'msg',m:await F.one(m.id)});res.json({})});
 app.get('/api/att/:id',need,async(req,res)=>{const[a]=await q('select id,name,type,channel,octet_length(data) total from attachments where id=$1',[+req.params.id]);if(!a||!await X.can(req.u.id,a.channel))return res.sendStatus(404);
  const img=a.type!=='application/octet-stream';
  const total=a.total,rg=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');let part=null;
  if(rg&&(rg[1]||rg[2])&&img){let s=rg[1]===''?Math.max(0,total-(+rg[2])):+rg[1],e=rg[1]===''||rg[2]===''?total-1:Math.min(+rg[2],total-1);
   if(s>e||s>=total)return res.status(416).set('Content-Range','bytes */'+total).end();part=[s,e]}
  res.set({'Accept-Ranges':'bytes'});if(part)res.status(206).set({'Content-Range':'bytes '+part[0]+'-'+part[1]+'/'+total});
  res.set({'Content-Type':img?a.type:'application/octet-stream','Content-Disposition':(img?'inline':'attachment')+'; filename="'+a.name.replace(/[^\x20-\x7e]/g,'_')+'"','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Cache-Control':'private, max-age=31536000, immutable'}).send((await q('select substring(data from $2 for $3) b from attachments where id=$1',[a.id,part?part[0]+1:1,part?part[1]-part[0]+1:total]))[0].b)});
};
