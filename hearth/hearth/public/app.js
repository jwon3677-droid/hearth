const $=s=>document.querySelector(s),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const THEMES={midnight:['#5865f2','#1e1f3a'],sunset:['#ff7a59','#5b2a4e'],forest:['#3ddc97','#12332a'],candy:['#ff77c8','#3a2256'],ocean:['#2ec4ff','#0d2b45']};
const BADGES={staff:'🛡️ Staff',og:'👑 OG',early:'🌱 Early',verified:'✔️ Verified',supporter:'💎 Supporter'};
const EMOJI=['😀','😂','🥹','😍','😎','🤔','😭','😡','👍','👎','🙏','🔥','💯','🎉','❤️','💀','👀','✨','🚀','🎮','🍕','🐱','🐶','🌈'];
let me,servers=[],friends=[],cur='home',ch=null,chName='',ws,room=null,stream=null,names={},pcs={},chain=Promise.resolve(),AV=0;
const root=$('#root'),isStaff=()=>['staff','admin'].includes(me.role),dmKey=id=>'dm'+Math.min(me.id,id)+'_'+Math.max(me.id,id);
const api=(p,m='GET',b)=>fetch('/api/'+p,{method:m,headers:{'Content-Type':'application/json'},body:b&&JSON.stringify(b)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Error');return j});
const fail=e=>alert(e.message),theme=()=>document.documentElement.style.setProperty('--ac',(THEMES[me.theme]||THEMES.midnight)[0]);
function av(id,name,th){const t=THEMES[th]||THEMES.midnight,a=el('div','av',name[0].toUpperCase()),i=new Image();a.style.background=`linear-gradient(135deg,${t[0]},${t[1]})`;i.className='ai';i.onload=()=>a.replaceChildren(i);i.src='/api/avatar/'+id+'?v='+AV;return a}
function authView(){root.replaceChildren();let signup=false;const w=el('div'),f=el('div');w.id='authwrap';f.id='auth';
 const paint=()=>{f.replaceChildren();
  f.append(el('div','alogo','🔥 Hearth'),el('h1','',signup?'Create your account':'Welcome back'),el('p','mu',signup?'Join the fire. It only takes a minute.':'Good to see you chatting again.'));
  const u=el('input'),p=el('input'),e=el('div','err'),pw=el('div','pw'),eye=el('button','eye','👁'),b=el('button','go',signup?'Create account':'Log in');
  u.autocomplete='username';p.type='password';p.autocomplete=signup?'new-password':'current-password';eye.type='button';eye.onclick=()=>p.type=p.type==='password'?'text':'password';pw.append(p,eye);
  const run=async()=>{b.disabled=true;try{me=await api(signup?'signup':'login','POST',{username:u.value,password:p.value});start()}catch(x){e.textContent=x.message;b.disabled=false}};
  b.onclick=run;u.onkeydown=p.onkeydown=ev=>ev.key==='Enter'&&run();
  const sw=el('a','',signup?'Log in':'Create an account'),t=el('div','sw');sw.href='#';sw.onclick=ev=>{ev.preventDefault();signup=!signup;paint()};t.append(signup?'Already have an account? ':'New here? ',sw);
  f.append(el('label','','USERNAME'),u,el('label','','PASSWORD'),pw,e,b,t);if(signup)f.append(el('small','mu','3-20 letters, numbers, _ or . · password 8+ characters'))};
 paint();w.append(f);root.append(w)}
function render(m){const t=THEMES[m.theme]||THEMES.midnight,d=el('div','m'),b=el('div'),h=el('div'),n=el('span','nm',m.username);d.dataset.id=m.id;n.style.color=t[0];h.append(n);
 (m.badges||[]).forEach(k=>BADGES[k]&&h.append(el('span','bd',BADGES[k])));h.append(el('span','ts',new Date(m.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})));
 if(isStaff()){const x=el('button','x','delete');x.onclick=()=>api('staff/msg/'+m.id,'DELETE');h.append(x)}
 b.append(h,el('div','',m.body));d.append(av(m.uid,m.username,m.theme),b);return d}
function add(m){const box=$('#msgs'),near=box.scrollHeight-box.scrollTop-box.clientHeight<120;box.append(render(m));if(near)box.scrollTop=box.scrollHeight}
async function load(){const b=$('#msgs');b.replaceChildren();$('#bar').style.display=ch?'flex':'none';$('#top').textContent=chName;if(!ch)return;$('#in').placeholder='Message '+chName;(await api('messages?channel='+ch)).forEach(add);b.scrollTop=1e9}
const open=(k,n)=>{ch=k;chName=n;load().catch(fail);draw()};
async function refresh(){[servers,friends]=await Promise.all([api('servers'),api('friends')]);draw()}
function draw(){const rail=$('#rail'),side=$('#side');rail.replaceChildren();side.replaceChildren();
 const rb=(t,tt,on,fn)=>{const b=el('div','rb'+(on?' on':''),t);b.title=tt;b.onclick=fn;rail.append(b)},call=(p,m,b)=>api(p,m,b).then(refresh).catch(fail);
 rb('🏠','Home & DMs',cur==='home',()=>{cur='home';open(null,'')});
 servers.forEach(s=>rb(s.name[0].toUpperCase(),s.name,cur===s.id,()=>{cur=s.id;const f=s.channels.find(c=>c.kind==='text');open(f?'c'+f.id:null,f?'# '+f.name:'')}));
 rb('+','Create a server',false,()=>{const n=prompt('New server name');n&&call('servers','POST',{name:n})});
 rb('↪','Join with invite code',false,()=>{const c=prompt('Invite code');c&&call('join','POST',{code:c})});
 if(cur==='home'){side.append(el('h3','','Friends'));const i=el('input'),b=el('button','g','Add friend');i.placeholder='Username';b.onclick=()=>call('friends','POST',{username:i.value});side.append(i,b);
  friends.filter(f=>f.status==='pending').forEach(f=>{const r=el('div','ch',f.username+(f.by===me.id?' (sent)':' wants to be friends'));
   if(f.by!==me.id){const a=el('button','g','✔');a.onclick=()=>call('friends/accept','POST',{id:f.id});r.append(a)}const x=el('button','g','✖');x.onclick=()=>call('friends/'+f.id,'DELETE');r.append(x);side.append(r)});
  side.append(el('h4','','Direct messages'));friends.filter(f=>f.status==='ok').forEach(f=>{const r=el('div','ch'+(ch===dmKey(f.id)?' on':''),f.username);r.onclick=()=>open(dmKey(f.id),'@ '+f.username);side.append(r)})}
 else{const s=servers.find(x=>x.id===cur);if(s){side.append(el('h3','',s.name),el('small','','Invite code: '+s.invite));
  s.channels.forEach(c=>{const r=el('div','ch'+(ch==='c'+c.id?' on':''),(c.kind==='voice'?'🔊 ':'# ')+c.name);r.onclick=()=>c.kind==='voice'?vjoin(c):open('c'+c.id,'# '+c.name);side.append(r)});
  if(s.owner_id===me.id){const b=el('button','g','+ Channel');b.onclick=()=>{const n=prompt('Channel name (letters, numbers, -)');n&&call('channels','POST',{server_id:s.id,name:n,kind:confirm('OK = voice channel, Cancel = text channel')?'voice':'text'})};side.append(b)}}}
 if(room){const v=el('div','vc'),m=el('button','g','🎤 Mute'),l=el('button','','Leave');v.append(el('b','','🔊 '+room.name),el('div','','In call: '+['You',...Object.values(names)].join(', ')),m,l);
  m.onclick=()=>{const t=stream.getAudioTracks()[0];t.enabled=!t.enabled;m.textContent=t.enabled?'🎤 Mute':'🔇 Unmute'};l.onclick=vleave;side.append(v)}
 const m=el('div');m.id='me';const n=el('div');n.style.cssText='display:flex;gap:8px;align-items:center';n.append(av(me.id,me.username,me.theme),el('b','',me.username));m.append(n);
 const g=el('button','g','⚙');g.onclick=settings;m.append(g);if(isStaff()){const s=el('button','g','🛡️');s.onclick=staffPanel;m.append(s)}side.append(m)}
// ---- voice (WebRTC mesh, signaling over the WebSocket)
const sig=(to,data)=>ws.send(JSON.stringify({type:'sig',to,data}));
function peer(id){if(pcs[id])return pcs[id].pc;const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]}),a=new Audio();a.autoplay=true;document.body.append(a);pcs[id]={pc,a};
 stream.getTracks().forEach(t=>pc.addTrack(t,stream));pc.ontrack=e=>a.srcObject=e.streams[0];pc.onicecandidate=e=>e.candidate&&sig(id,{ice:e.candidate});return pc}
function vclose(id){if(!pcs[id])return;pcs[id].pc.close();pcs[id].a.remove();delete pcs[id];delete names[id]}
function vcleanup(){Object.keys(pcs).forEach(vclose);stream&&stream.getTracks().forEach(t=>t.stop());stream=null;room=null;names={}}
async function vjoin(c){if(room)vleave();try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch{return alert('Microphone access is needed for voice')}room=c;names={};ws.send(JSON.stringify({type:'vjoin',ch:'c'+c.id}));draw()}
function vleave(){ws.send(JSON.stringify({type:'vleave'}));vcleanup();draw()}
function onSig(d){chain=chain.then(async()=>{if(!stream)return;const pc=peer(d.from),x=d.data;
 if(x.sdp){await pc.setRemoteDescription(x.sdp);if(x.sdp.type==='offer'){await pc.setLocalDescription(await pc.createAnswer());sig(d.from,{sdp:pc.localDescription})}}else if(x.ice)await pc.addIceCandidate(x.ice)}).catch(()=>{})}
function connect(){ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws');
 ws.onmessage=async e=>{const d=JSON.parse(e.data);
  if(d.type==='msg'&&d.m.channel===ch)add(d.m);
  if(d.type==='del'){const n=document.querySelector(`.m[data-id="${d.id}"]`);n&&n.remove()}
  if(d.type==='vpeers'&&room)for(const p of d.peers){names[p.id]=p.name;const pc=peer(p.id);await pc.setLocalDescription(await pc.createOffer());sig(p.id,{sdp:pc.localDescription});draw()}
  if(d.type==='vin'&&room){names[d.id]=d.name;draw()}if(d.type==='vout'){vclose(d.id);draw()}if(d.type==='sig')onSig(d)};
 ws.onclose=()=>{if(me){vcleanup();setTimeout(connect,2000)}}}
function modal(fn){const m=$('#modal');m.replaceChildren();const d=el('div');fn(d);const c=el('button','g','Close');c.onclick=()=>m.style.display='none';d.append(c);m.append(d);m.style.display='grid'}
function pickAvatar(){const f=el('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';f.onchange=()=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas'),s=Math.min(img.width,img.height);c.width=c.height=128;
  c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,128,128);api('avatar','PUT',{data:c.toDataURL('image/jpeg',.85).split(',')[1]}).then(()=>{AV=Date.now();draw();load()}).catch(fail)};img.src=r.result};r.readAsDataURL(f.files[0])};f.click()}
function settings(){modal(d=>{d.append(el('h3','','Profile'));const a=el('button','g','Upload avatar');a.onclick=pickAvatar;d.append(a,el('h4','','Theme'));const w=el('div');
  Object.entries(THEMES).forEach(([k,t])=>{const s=el('span','th'+(me.theme===k?' on':''));s.style.background=`linear-gradient(135deg,${t[0]},${t[1]})`;s.title=k;s.onclick=async()=>{await api('profile','PUT',{theme:k});me.theme=k;theme();draw();settings()};w.append(s)});d.append(w);
  const lo=el('button','g','Log out');lo.onclick=async()=>{await api('logout','POST');const w=ws;me=null;vcleanup();w.close();$('#modal').style.display='none';authView()};d.append(lo)})}
async function staffPanel(){const us=await api('staff/users');modal(d=>{d.append(el('h3','','Staff panel'));us.forEach(u=>{const r=el('div');r.style.cssText='display:flex;gap:6px;flex-wrap:wrap;align-items:center';r.append(el('b','',u.username+(u.role!=='user'?' ('+u.role+')':'')+(u.banned?' 🚫':'')));
  if(u.role==='user'){const b=el('button','g',u.banned?'Unban':'Ban');b.onclick=async()=>{await api('staff/ban','POST',{id:u.id,banned:!u.banned});staffPanel()};r.append(b)}
  Object.keys(BADGES).forEach(k=>{const has=u.badges.includes(k),b=el('button','g',(has?'− ':'+ ')+k);b.onclick=async()=>{await api('staff/badge','POST',{id:u.id,badge:k,on:!has});staffPanel()};r.append(b)});
  if(me.role==='admin'&&u.role!=='admin'){const b=el('button','g',u.role==='staff'?'Demote':'Make staff');b.onclick=async()=>{await api('staff/role','POST',{id:u.id,role:u.role==='staff'?'user':'staff'});staffPanel()};r.append(b)}d.append(r)})})}
function start(){theme();root.replaceChildren();const a=el('div');a.id='app';const rail=el('div'),side=el('div'),main=el('div'),top=el('div'),msgs=el('div'),bar=el('div'),i=el('input'),eb=el('button','g','😀'),emo=el('div'),md=el('div');
 rail.id='rail';side.id='side';main.id='main';top.id='top';msgs.id='msgs';bar.id='bar';i.id='in';i.maxLength=1000;emo.id='emo';md.id='modal';
 EMOJI.forEach(x=>{const s=el('span','',x);s.onclick=()=>{i.value+=x;i.focus()};emo.append(s)});eb.onclick=()=>emo.style.display=emo.style.display==='grid'?'none':'grid';
 const send=()=>{if(ch&&i.value.trim()&&ws.readyState===1){ws.send(JSON.stringify({channel:ch,body:i.value}));i.value=''}};i.onkeydown=e=>e.key==='Enter'&&send();
 bar.append(i,eb,emo);main.append(top,msgs,bar);a.append(rail,side,main);root.append(a,md);connect();
 refresh().then(()=>{const s=servers[0];if(s){cur=s.id;const f=s.channels.find(c=>c.kind==='text');f&&open('c'+f.id,'# '+f.name)}}).catch(fail);setInterval(()=>me&&refresh().catch(()=>{}),20000)}
api('me').then(u=>{me=u;start()}).catch(authView);
