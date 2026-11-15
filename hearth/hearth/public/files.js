// Server icon upload + file attachments (10MB max)
const MAXF=10*1024*1024,fmtSz=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const putRaw=async(url,m,file)=>{const r=await fetch(url,{method:m,headers:{'Content-Type':'application/octet-stream'},body:file});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Upload failed');return j};
function pickServerIcon(s,done){const f=el('input');f.type='file';f.accept='image/png,image/jpeg,image/webp,image/gif';f.onchange=async()=>{const file=f.files[0];if(!file)return;
 if(file.size>MAXF)return toast('Image too big (max 10MB)');try{await putRaw('/api/servers/'+s.id+'/icon','PUT',file);AV=Date.now();await refresh();toast('Server icon updated',1);done&&done()}catch(e){fail(e)}};f.click()}
function iconRow(s,done){const r=el('div','trow'),im=new Image();im.style.cssText='width:56px;height:56px;border-radius:16px;object-fit:cover;background:#2b2d31';
 if(s.has_icon)im.src='/api/servers/'+s.id+'/icon?v='+AV;else if(s.invite==='hearth')im.src='/server-icon.svg';else{im.remove();r.append(el('span','mu','No icon'))}
 s.has_icon||s.invite==='hearth'?r.append(im):0;r.append(btn(s.has_icon?'Change Icon':'Upload Icon','',()=>pickServerIcon(s,done)));
 s.has_icon&&r.append(btn('Remove','g',async()=>{try{await api('servers/'+s.id+'/icon','DELETE');AV=Date.now();await refresh();done&&done()}catch(e){fail(e)}}));return field('Server icon',r,'PNG, JPEG, WebP or GIF, up to 10MB.')}
async function uploadFile(file,input){if(!ch)return;if(file.size>MAXF)return toast('File too big (max 10MB)');
 const t=input?input.value.trim():'';toast('Uploading '+file.name+'…',1);
 try{await putRaw('/api/upload?channel='+encodeURIComponent(ch)+'&name='+encodeURIComponent(file.name)+(t?'&text='+encodeURIComponent(t):''),'POST',file);if(input&&t)input.value=''}catch(e){fail(e)}}
function attachNode(m){if(!m.att_id)return null;const u='/api/att/'+m.att_id,w=el('div','att'),isImg=m.att_type&&m.att_type.startsWith('image/');
 if(isImg){const a=el('a');a.href=u;a.target='_blank';a.rel='noopener';const im=new Image();im.src=u;im.loading='lazy';im.alt=m.att_name;im.style.cssText='max-width:min(400px,100%);max-height:300px;border-radius:8px;display:block;margin-top:4px';a.append(im);w.append(a)}
 else{const a=el('a','',m.att_name+' · '+fmtSz(m.att_size||0));a.href=u;a.download=m.att_name;a.style.cssText='display:inline-block;margin-top:4px;padding:8px 12px;border-radius:8px;background:#2b2d31;color:#00a8fc;text-decoration:none';w.append(a)}return w}
// In-app replacements for the browser's prompt()/confirm() popups
function askDialog(title,sub,build,okText,danger){return new Promise(res=>{const D=dialog('420px');let done=false;const fin=v=>{if(done)return;done=true;res(v);D.close()},close0=D.close;D.close=()=>{close0();if(!done){done=true;res(null)}};
 D.set(title,sub);const get=build(D,()=>ok.click());const ok=btn(okText||'OK',danger?'dng':'',()=>fin(get()));D.foot.append(btn('Cancel','lnk',()=>fin(null)),ok);return D})}
function askText(title,sub,value,o={}){return askDialog(title,sub,(D,submit)=>{const i=el('input');i.value=value||'';if(o.max)i.maxLength=o.max;if(o.placeholder)i.placeholder=o.placeholder;i.onkeydown=e=>e.key==='Enter'&&submit();D.body.append(field(o.label||'',i));setTimeout(()=>{i.focus();i.select()},30);return()=>i.value},o.ok,o.danger)}
function askConfirm(title,sub,o={}){return askDialog(title,sub,D=>{D.body.style.display='none';return()=>true},o.ok||'Confirm',o.danger).then(v=>!!v)}
