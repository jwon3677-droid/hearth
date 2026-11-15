const $=s=>document.querySelector(s),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const THEMES={midnight:['#5865f2','#1e1f3a'],sunset:['#ff7a59','#5b2a4e'],forest:['#3ddc97','#12332a'],candy:['#ff77c8','#3a2256'],ocean:['#2ec4ff','#0d2b45']};
const BADGES={staff:'🛡️ Staff',og:'👑 OG',early:'🌱 Early',verified:'✔️ Verified',supporter:'💎 Supporter'};
const EMOJI=['😀','😂','🥹','😍','😎','🤔','😭','😡','👍','👎','🙏','🔥','💯','🎉','❤️','💀','👀','✨','🚀','🎮','🍕','🐱','🐶','🌈'];
let me,servers=[],friends=[],cur='home',ch=null,chName='',ws,room=null,stream=null,names={},pcs={},chain=Promise.resolve(),AV=0;
const root=$('#root'),isStaff=()=>['staff','admin'].includes(me.role),dmKey=id=>'dm'+Math.min(me.id,id)+'_'+Math.max(me.id,id);
const api=(p,m='GET',b)=>fetch('/api/'+p,{method:m,headers:{'Content-Type':'application/json'},body:b&&JSON.stringify(b),signal:AbortSignal.timeout(25000)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Error');return j}).catch(e=>{throw e.name==='TimeoutError'?Error('Server is waking up or busy. Try again in a few seconds.'):e});
const fail=e=>alert(e.message),theme=()=>document.documentElement.style.setProperty('--ac',(THEMES[me.theme]||THEMES.midnight)[0]);
function av(id,name,th){const t=THEMES[th]||THEMES.midnight,a=el('div','av',name[0].toUpperCase()),i=new Image();a.style.background=`linear-gradient(135deg,${t[0]},${t[1]})`;i.className='ai';i.onload=()=>a.replaceChildren(i);i.src='/api/avatar/'+id+'?v='+AV;return a}
const AUTHCSS=`
#aw{--ac:#ff6b35;position:relative;min-height:100vh;display:grid;place-items:center;padding:20px;background:#0a0a0f;overflow:hidden}
#aw .gr{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff09 0 1px,transparent 1px 56px),repeating-linear-gradient(90deg,#ffffff09 0 1px,transparent 1px 56px);-webkit-mask-image:radial-gradient(circle,#000 25%,transparent 75%);mask-image:radial-gradient(circle,#000 25%,transparent 75%)}
#aw .orbs{position:absolute;inset:0;overflow:hidden}
#aw .orbs b{position:absolute;border-radius:50%;filter:blur(90px);opacity:.5;animation:fl 14s ease-in-out infinite alternate}
#aw .o1{width:420px;height:420px;background:#ff6b35;top:-120px;left:-80px}#aw .o2{width:380px;height:380px;background:#c026d3;bottom:-140px;right:-60px;animation-delay:-5s}#aw .o3{width:300px;height:300px;background:#3b82f6;top:40%;left:55%;opacity:.28;animation-delay:-9s}
@keyframes fl{to{transform:translate(60px,-40px) scale(1.15)}}
#aw .orbs i{position:absolute;bottom:-10px;border-radius:50%;background:#ffb27a;box-shadow:0 0 8px #ff8a4c;animation:up linear infinite}
@keyframes up{from{transform:translateY(0);opacity:0}10%{opacity:1}to{transform:translateY(-105vh) translateX(30px);opacity:0}}
#aw .card{position:relative;width:min(400px,100%);padding:34px 30px;border-radius:22px;background:#14141bcc;-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid #ffffff18;box-shadow:0 30px 80px #000a,0 0 60px #ff6b351f;display:grid;gap:8px;text-align:center;animation:in .6s cubic-bezier(.2,.8,.2,1)}
@keyframes in{from{opacity:0;transform:translateY(20px) scale(.97)}}
#aw .flame{font-size:44px;animation:pulse 2s ease-in-out infinite;filter:drop-shadow(0 0 14px #ff6b35)}@keyframes pulse{50%{transform:scale(1.12) rotate(-4deg)}}
#aw .brand{font-size:14px;font-weight:800;letter-spacing:.35em;text-transform:uppercase;color:#ffb27a}
#aw h1{margin:8px 0 0;font-size:30px;background:linear-gradient(90deg,#fff,#ffb27a);-webkit-background-clip:text;background-clip:text;color:transparent}
#aw .mu{color:#9a9ca8;margin:0 0 10px}#aw label{text-align:left;font-size:11px;font-weight:700;letter-spacing:.08em;color:#b9bac4;margin-top:6px}
#aw input{background:#0c0c11;border:1px solid #2c2c36;border-radius:10px;padding:13px;transition:.2s;color:#fff}#aw input:focus{outline:0;border-color:#ff6b35;box-shadow:0 0 0 3px #ff6b3533}
#aw .pw{position:relative}#aw .eye{position:absolute;right:4px;top:4px;background:none;padding:9px}
#aw .go{margin-top:12px;padding:14px;font-weight:700;border-radius:10px;background:linear-gradient(90deg,#ff6b35,#ff3d81);box-shadow:0 10px 30px #ff6b3555;transition:.2s}
#aw .go:hover{transform:translateY(-2px);box-shadow:0 14px 36px #ff6b3588}#aw .go:disabled{opacity:.6;transform:none}
#aw .err{color:#ff7a8a;font-size:13px}#aw .sw{margin-top:6px;color:#9a9ca8}#aw .sw a{color:#ff8a4c;font-weight:700;text-decoration:none}
#aw .chips{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:12px}#aw .chips span{font-size:12px;padding:4px 10px;border-radius:99px;background:#ffffff0d;border:1px solid #ffffff14;color:#c9c9d1}`;
function authView(){root.replaceChildren();if(!$('#authcss')){const s=el('style');s.id='authcss';s.textContent=AUTHCSS;document.head.append(s)}
 let signup=false;const w=el('div'),f=el('div','card'),bg=el('div','orbs');w.id='aw';bg.append(el('b','o1'),el('b','o2'),el('b','o3'));
 for(let k=0;k<18;k++){const e=el('i'),z=2+Math.random()*3;e.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-delay:${-Math.random()*12}s;animation-duration:${8+Math.random()*8}s`;bg.append(e)}
 const paint=()=>{f.replaceChildren();f.append(el('div','flame','🔥'),el('div','brand','Hearth'),el('h1','',signup?'Create your account':'Welcome back'),el('p','mu',signup?'Join the fire. It only takes a minute.':'Good to see you chatting again.'));
  const u=el('input'),p=el('input'),e=el('div','err'),pw=el('div','pw'),eye=el('button','eye','👁'),b=el('button','go',signup?'Create account':'Log in'),c=el('div','chips');
  u.autocomplete='username';u.placeholder='Your username';p.placeholder='••••••••';p.type='password';p.autocomplete=signup?'new-password':'current-password';eye.type='button';eye.onclick=()=>p.type=p.type==='password'?'text':'password';pw.append(p,eye);
  const run=async()=>{b.disabled=true;b.textContent=signup?'Creating…':'Signing in…';e.textContent='';try{me=await api(signup?'signup':'login','POST',{username:u.value,password:p.value});start()}catch(x){e.textContent=x.message;b.disabled=false;b.textContent=signup?'Create account':'Log in'}};
  b.onclick=run;u.onkeydown=p.onkeydown=ev=>ev.key==='Enter'&&run();
  const sw=el('a','',signup?'Log in':'Create an account'),t=el('div','sw');sw.href='#';sw.onclick=ev=>{ev.preventDefault();signup=!signup;paint()};t.append(signup?'Already have an account? ':'New here? ',sw);
  ['💬 Chat','🎙️ Voice','🎨 Themes','🛡️ Safe'].forEach(x=>c.append(el('span','',x)));
  f.append(el('label','','USERNAME'),u,el('label','','PASSWORD'),pw,e,b,t,c);if(signup)f.append(el('small','mu','3-20 letters, numbers, _ or . · password 8+ characters'))};
 paint();w.append(el('div','gr'),bg,f);root.append(w)}
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
