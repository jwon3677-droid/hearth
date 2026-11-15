const $=s=>document.querySelector(s),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const THEMES={midnight:['#5865f2','#1e1f3a'],sunset:['#ff7a59','#5b2a4e'],forest:['#3ddc97','#12332a'],candy:['#ff77c8','#3a2256'],ocean:['#2ec4ff','#0d2b45']};
const BADGES={staff:'🛡️ Staff',og:'👑 OG',early:'🌱 Early',verified:'✔️ Verified',supporter:'💎 Supporter'};
const EMOJI=['😀','😂','🥹','😍','😎','🤔','😭','😡','👍','👎','🙏','🔥','💯','🎉','❤️','💀','👀','✨','🚀','🎮','🍕','🐱','🐶','🌈'];
let me,servers=[],friends=[],cur='home',ch=null,chName='',ws,room=null,stream=null,names={},pcs={},chain=Promise.resolve(),AV=0;
const root=$('#root'),isStaff=()=>['staff','admin'].includes(me.role),dmKey=id=>'dm'+Math.min(me.id,id)+'_'+Math.max(me.id,id);
const api=(p,m='GET',b)=>fetch('/api/'+p,{method:m,headers:{'Content-Type':'application/json'},body:b&&JSON.stringify(b),signal:AbortSignal.timeout(25000)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Error');return j}).catch(e=>{throw e.name==='TimeoutError'?Error('Server is waking up or busy. Try again in a few seconds.'):e});
const fail=e=>alert(e.message),theme=()=>document.documentElement.style.setProperty('--ac',(THEMES[me.theme]||THEMES.midnight)[0]);
function av(id,name,th){const t=THEMES[th]||THEMES.midnight,a=el('div','av',name[0].toUpperCase()),i=new Image();a.style.background=`linear-gradient(135deg,${t[0]},${t[1]})`;i.className='ai';i.onload=()=>a.replaceChildren(i);i.src='/api/avatar/'+id+'?v='+AV;return a}
const MASCOT=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 130"><style>.b{animation:bob 2.4s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-4px)}}.e{animation:bl 4s infinite;transform-box:fill-box;transform-origin:center}@keyframes bl{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}.w{animation:wv .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 90%}@keyframes wv{to{transform:rotate(-28deg)}}.f{animation:fk 1.1s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes fk{to{transform:scale(1.07,.93) rotate(3deg)}}</style><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a4d"/><stop offset="1" stop-color="#ff4d6d"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ff5a36"/></linearGradient></defs><g class="b"><ellipse cx="60" cy="123" rx="30" ry="4" fill="#0006"/><g class="f"><path d="M60 4C70 20 86 30 81 47 78 56 70 58 60 58 50 58 42 56 39 47 34 30 52 20 60 4Z" fill="url(#t)"/><path d="M60 24C67 33 73 37 71 47 70 52 65 54 60 54 55 54 50 52 49 47 47 37 54 33 60 24Z" fill="#ffd166"/></g><ellipse cx="22" cy="86" rx="8" ry="12" fill="#ff6a5c"/><ellipse class="w" cx="98" cy="82" rx="8" ry="13" fill="#ff6a5c"/><ellipse cx="44" cy="118" rx="12" ry="6" fill="#e8454f"/><ellipse cx="76" cy="118" rx="12" ry="6" fill="#e8454f"/><ellipse cx="60" cy="80" rx="39" ry="38" fill="url(#a)"/><ellipse cx="60" cy="92" rx="23" ry="21" fill="#ffe0b8"/><g class="e"><ellipse cx="45" cy="74" rx="6" ry="8.5" fill="#2a1630"/><ellipse cx="75" cy="74" rx="6" ry="8.5" fill="#2a1630"/><circle cx="47" cy="71" r="2.4" fill="#fff"/><circle cx="77" cy="71" r="2.4" fill="#fff"/></g><ellipse cx="34" cy="88" rx="7" ry="4.5" fill="#ff7b9c" opacity=".7"/><ellipse cx="86" cy="88" rx="7" ry="4.5" fill="#ff7b9c" opacity=".7"/><path d="M52 86Q60 95 68 86" fill="none" stroke="#2a1630" stroke-width="3" stroke-linecap="round"/></g></svg>`;
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
#aw .flame{width:112px;height:122px;margin:0 auto;filter:drop-shadow(0 0 18px #ff6b3588)}
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
 const paint=()=>{f.replaceChildren();f.append(Object.assign(new Image(),{className:'flame',alt:'Cinder, the Hearth mascot',src:'data:image/svg+xml;utf8,'+encodeURIComponent(MASCOT)}),el('div','brand','Hearth'),el('h1','',signup?'Create your account':'Welcome back'),el('p','mu',signup?'Join the fire. It only takes a minute.':'Good to see you chatting again.'));
  const u=el('input'),p=el('input'),e=el('div','err'),pw=el('div','pw'),eye=el('button','eye','👁'),b=el('button','go',signup?'Create account':'Log in'),c=el('div','chips');
  u.autocomplete='username';u.placeholder='Your username';p.placeholder='••••••••';p.type='password';p.autocomplete=signup?'new-password':'current-password';eye.type='button';eye.onclick=()=>p.type=p.type==='password'?'text':'password';pw.append(p,eye);
  const run=async()=>{b.disabled=true;b.textContent=signup?'Creating…':'Signing in…';e.textContent='';try{me=await api(signup?'signup':'login','POST',{username:u.value,password:p.value});start()}catch(x){e.textContent=x.message;b.disabled=false;b.textContent=signup?'Create account':'Log in'}};
  b.onclick=run;u.onkeydown=p.onkeydown=ev=>{if(ev.key==='Enter')run()};
  const sw=el('a','',signup?'Log in':'Create an account'),t=el('div','sw');sw.href='#';sw.onclick=ev=>{ev.preventDefault();signup=!signup;paint()};t.append(signup?'Already have an account? ':'New here? ',sw);
  ['💬 Chat','🎙️ Voice','🎨 Themes','🛡️ Safe'].forEach(x=>c.append(el('span','',x)));
  f.append(el('label','','USERNAME'),u,el('label','','PASSWORD'),pw,e,b,t,c);if(signup)f.append(el('small','mu','3-20 letters, numbers, _ or . · password 8+ characters'))};
 paint();w.append(el('div','gr'),bg,f);root.append(w)}
const MURI='data:image/svg+xml;utf8,'+encodeURIComponent(MASCOT);
const IC={hash:'M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.98.32L8.84 16h4.97l-.8 4.84a1 1 0 0 0 1.98.32L15.84 16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.98-.32L15.16 8H10.2l.79-4.84zM9.5 10h4.97l-.67 4H8.83l.67-4z',spk:'M3 9v6h4l5 4V5L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8S18 4.2 14 3.2z',gear:'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',mic:'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z',users:'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z',shield:'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z',plus:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',join:'M5 11h10.2l-3.6-3.6L13 6l6 6-6 6-1.4-1.4 3.6-3.6H5z',trash:'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',x:'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z',check:'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'};
const ic=(d,s=20)=>{const N='http://www.w3.org/2000/svg',v=document.createElementNS(N,'svg'),p=document.createElementNS(N,'path');v.setAttribute('viewBox','0 0 24 24');v.setAttribute('width',s);v.setAttribute('height',s);p.setAttribute('d',d);p.setAttribute('fill','currentColor');v.append(p);return v};
const ib=(d,t,fn,s=20)=>{const b=el('button','ib');b.title=t;b.append(ic(d,s));b.onclick=e=>{e.stopPropagation();fn(e)};return b};
// ---- Twemoji (Discord's emoji set) rendering
const EMO=/(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?)*)/gu;
const tw=s=>{let c=[...s].map(x=>x.codePointAt(0));if(!c.includes(0x200d))c=c.filter(x=>x!==0xfe0f);return 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/'+c.map(x=>x.toString(16)).join('-')+'.svg'};
function rich(t){const f=document.createDocumentFragment();let i=0;t.replace(EMO,(m,o)=>{if(o>i)f.append(t.slice(i,o));const g=new Image();g.className='em';g.alt=m;g.draggable=false;g.loading='lazy';g.src=tw(m);g.onerror=()=>g.replaceWith(m);f.append(g);i=o+m.length;return m});if(i<t.length)f.append(t.slice(i));return f}
const isBig=t=>!!t.trim()&&t.length<60&&!t.replace(EMO,'').trim();
const CATS=[['😀',[[0x1F600,0x1F64F],[0x1F910,0x1F92F],[0x1F970,0x1F97A]],['☺️']],['👋',[[0x1F44A,0x1F450],[0x1F466,0x1F483],[0x1F918,0x1F91F]],['✌️']],['🐶',[[0x1F400,0x1F43E],[0x1F980,0x1F9AE]],[]],['🍕',[[0x1F32D,0x1F32F],[0x1F345,0x1F37F],[0x1F950,0x1F96B]],[]],['⚽',[[0x1F3A0,0x1F3CA],[0x1F680,0x1F6A4],[0x26BD,0x26BE]],[]],['❤️',[[0x1F493,0x1F49F],[0x1F4A2,0x1F4AF],[0x1F4B0,0x1F4FF]],['❤️','✔️','♥️']]];
function pickerFill(emo,i){const tabs=el('div','et'),grid=el('div','eg');emo.append(tabs,grid);
 const show=k=>{grid.replaceChildren();const list=[...CATS[k][2]];CATS[k][1].forEach(([a,b])=>{for(let c=a;c<=b;c++){const s=String.fromCodePoint(c);if(/\p{Emoji_Presentation}/u.test(s))list.push(s)}});
  list.forEach(s=>{const b=el('span');b.append(rich(s));const g=b.firstChild;if(g&&g.tagName==='IMG')g.onerror=()=>b.remove();b.onclick=()=>{i.value+=s;i.focus()};grid.append(b)});[...tabs.children].forEach((t,j)=>t.classList.toggle('on',j===k))};
 CATS.forEach((c,k)=>{const t=el('span');t.append(rich(c[0]));t.onclick=()=>show(k);tabs.append(t)});show(0)}
// ---- messages
const hue=s=>Math.abs([...s].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%360;
const badge=k=>{const s=el('span','bd'+(k==='staff'||k==='og'?' hot':''));s.append(rich(BADGES[k]));return s};
let last=null;
function render(m,grp,isNew){const t=THEMES[m.theme]||THEMES.midnight,d=el('div','m'+(grp?' c':'')+(isNew?' new':'')),b=el('div','mb'),body=el('div','mt'),time=new Date(m.ts).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});d.dataset.id=m.id;body.append(rich(m.body));if(isBig(m.body))body.classList.add('big');
 if(grp){d.append(el('span','ht',time.replace(/ ?[AP]M/,'')));b.append(body)}
 else{const h=el('div','mh2'),n=el('span','nm'+((m.badges||[]).includes('supporter')?' sup':''),m.username),a=av(m.uid,m.username,m.theme);n.style.color=t[0];n.onclick=a.onclick=()=>profile(m.uid);h.append(n);(m.badges||[]).forEach(k=>BADGES[k]&&h.append(badge(k)));h.append(el('span','ts',time));b.append(h,body);d.append(a)}
 if(isStaff()){const x=ib(IC.trash,'Delete message',()=>api('staff/msg/'+m.id,'DELETE'),16);x.classList.add('del');d.append(x)}
 d.append(b);return d}
function add(m,isNew){const box=$('#msgs'),near=box.scrollHeight-box.scrollTop-box.clientHeight<150,d=new Date(m.ts),day=d.toDateString();
 if(!last||last.day!==day){box.append(el('div','dd',day===new Date().toDateString()?'Today':d.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'})));last=null}
 const grp=last&&last.uid===m.uid&&d-last.t<3e5;last={uid:m.uid,t:+d,day};box.append(render(m,grp,isNew));if(near||(isNew&&m.uid===me.id))box.scrollTop=box.scrollHeight}
let showMem=true;
async function load(){const b=$('#msgs'),tp=$('#top');b.replaceChildren();last=null;tp.replaceChildren();$('#bar').style.display=ch?'flex':'none';
 if(!ch){const e=el('div','empty'),i=new Image();i.src=MURI;i.width=150;e.append(i,el('h2','','Nothing here yet'),el('p','mu',cur==='home'?'Add a friend or pick a DM on the left.':'Pick a channel to start chatting.'));b.append(e);return}
 tp.append(ic(IC.hash,22),el('b','',chName.replace(/^[#@] /,'')),el('span','grow'),ib(IC.users,'Toggle member list',()=>{showMem=!showMem;draw()},22));
 $('#in').placeholder='Message '+chName;(await api('messages?channel='+ch)).forEach(m=>add(m));b.scrollTop=1e9}
const open=(k,n)=>{ch=k;chName=n;load().catch(fail);draw()};
async function refresh(){[servers,friends]=await Promise.all([api('servers'),api('friends')]);draw();members()}
function draw(){const rail=$('#rail'),side=$('#side');rail.replaceChildren();side.replaceChildren();
 const rb=(c,tt,on,fn)=>{const b=el('div','rb'+(on?' on':''));typeof c==='string'?b.textContent=c:b.append(c);b.title=tt;b.onclick=fn;rail.append(b)},call=(p,m,b)=>api(p,m,b).then(refresh).catch(fail),home=new Image();home.src=MURI;
 rb(home,'Home & DMs',cur==='home',()=>{cur='home';open(null,'');members()});rail.append(el('div','sep'));
 servers.forEach(s=>rb(s.name[0].toUpperCase(),s.name,cur===s.id,()=>{cur=s.id;const f=s.channels.find(c=>c.kind==='text');open(f?'c'+f.id:null,f?'# '+f.name:'');members()}));
 rb(ic(IC.plus,24),'Create a server',false,()=>{const n=prompt('New server name');n&&call('servers','POST',{name:n})});
 rb(ic(IC.join,24),'Join with invite code',false,()=>{const c=prompt('Invite code');c&&call('join','POST',{code:c})});
 $('#app').classList.toggle('nomem',cur==='home'||!showMem);
 if(cur==='home'){side.append(el('div','sh plain','Friends & DMs'));const ar=el('div','addf'),i=el('input'),b=el('button','','Add');i.placeholder='Add friend by username';b.onclick=()=>call('friends','POST',{username:i.value});ar.append(i,b);side.append(ar);
  friends.filter(f=>f.status==='pending').forEach(f=>{const r=el('div','ch');r.append(av(f.id,f.username),el('span','',f.username+(f.by===me.id?' · sent':' · wants to add you')));if(f.by!==me.id)r.append(ib(IC.check,'Accept',()=>call('friends/accept','POST',{id:f.id}),18));r.append(ib(IC.x,'Remove',()=>call('friends/'+f.id,'DELETE'),18));side.append(r)});
  side.append(el('div','cat','Direct Messages'));friends.filter(f=>f.status==='ok').forEach(f=>{const r=el('div','ch'+(ch===dmKey(f.id)?' on':'')),w=el('div','st on');w.append(av(f.id,f.username));r.append(w,el('span','',f.username));r.onclick=()=>open(dmKey(f.id),'@ '+f.username);side.append(r)})}
 else{const s=servers.find(x=>x.id===cur);if(s){const h=hue(s.name),sh=el('div','sh',s.name),iv=el('small','','Invite: '+s.invite);sh.style.backgroundImage=`linear-gradient(135deg,hsl(${h} 70% 48%),hsl(${(h+70)%360} 70% 28%))`;iv.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(s.invite);iv.textContent='Copied!'};sh.append(iv);side.append(sh);
  [['text','Text Channels',IC.hash],['voice','Voice Channels',IC.spk]].forEach(([k,n,i])=>{const cs=s.channels.filter(c=>c.kind===k);if(!cs.length)return;side.append(el('div','cat',n));cs.forEach(c=>{const r=el('div','ch'+(ch==='c'+c.id?' on':''));r.append(ic(i),el('span','',c.name));r.onclick=()=>k==='voice'?vjoin(c):open('c'+c.id,'# '+c.name);side.append(r)})});
  if(s.owner_id===me.id){const b=el('button','g addc','+ Add channel');b.onclick=()=>{const n=prompt('Channel name (letters, numbers, -)');n&&call('channels','POST',{server_id:s.id,name:n,kind:confirm('OK = voice channel, Cancel = text channel')?'voice':'text'})};side.append(b)}}}
 if(room){const v=el('div','vc'),m=el('button','g','Mute'),l=el('button','','Leave');v.append(el('b','','Voice connected · '+room.name),el('div','mu','In call: '+['You',...Object.values(names)].join(', ')),m,l);
  m.onclick=()=>{const t=stream.getAudioTracks()[0];t.enabled=!t.enabled;m.textContent=t.enabled?'Mute':'Unmute'};l.onclick=vleave;side.append(v)}
 const p=el('div'),w=el('div','mi'),sw=el('div','st on'),nb=el('div','mn');p.id='me';sw.append(av(me.id,me.username,me.theme));sw.onclick=()=>profile(me.id);nb.append(el('b','',me.username),el('small','',room?'In voice':'Online'));w.append(sw,nb);p.append(w);
 p.append(ib(IC.gear,'User settings',settings));if(isStaff())p.append(ib(IC.shield,'Staff panel',staffPanel));side.append(p)}
let memTok=0;
async function members(){const p=$('#mem');if(!p)return;const sid=cur,tok=++memTok;if(sid==='home'){p.replaceChildren();return}
 const l=await api('members/'+sid).catch(()=>null);if(!l||tok!==memTok)return;const seen=new Set(),f=document.createDocumentFragment();
 [['Staff',u=>['admin','staff'].includes(u.role)],['Online',u=>u.online],['Offline',()=>true]].forEach(([n,fn])=>{const us=l.filter(u=>!seen.has(u.id)&&fn(u));us.forEach(u=>seen.add(u.id));if(!us.length)return;f.append(el('div','mh',n+' — '+us.length));
  us.forEach(u=>{const r=el('div','mr'+(u.online?'':' off')),w=el('div','st'+(u.online?' on':'')),t=THEMES[u.theme]||THEMES.midnight,nm=el('span','nm',u.username);nm.style.color=u.online?t[0]:'';w.append(av(u.id,u.username,u.theme));r.append(w,nm);(u.badges||[]).slice(0,1).forEach(k=>BADGES[k]&&r.append(badge(k)));r.onclick=()=>profile(u.id);f.append(r)})});
 p.replaceChildren(f)}
async function profile(id){let u;try{u=await api('user/'+id)}catch(e){return fail(e)}
 const t=THEMES[u.theme]||THEMES.midnight,pop=$('#pop'),c=el('div','pc'),p=el('div','pi'),bn=el('div','bn'),pa=el('div','pa st on'),bx=el('div','pb'),nm=el('div','pnm'),row=el('div','prow'),bio=el('div','mt'),close=()=>{pop.style.display='none'};
 c.style.setProperty('--a',t[0]);c.style.setProperty('--b',t[1]);
 if(u.hb)bn.style.background=`url(/api/banner/${u.id}?v=${AV}) center/cover`;else{bn.style.backgroundImage=`linear-gradient(120deg,${t[0]},${t[1]},${t[0]})`;bn.classList.add('anim')}
 pa.append(av(u.id,u.username,u.theme));nm.append(u.username);(u.badges||[]).forEach(k=>BADGES[k]&&nm.append(badge(k)));bio.append(rich(u.bio||'No bio yet.'));
 bx.append(el('div','mh','About me'),bio,el('div','mh','Member since'),el('div','',new Date(u.created).toLocaleDateString([],{month:'long',day:'numeric',year:'numeric'})));
 const btn=(x,fn,g)=>{const b=el('button',g?'g':'',x);b.onclick=fn;row.append(b)},done=()=>{close();refresh()};
 if(u.id===me.id)btn('Edit profile',()=>{close();settings()});
 else if(!u.friend)btn('Add friend',()=>api('friends','POST',{username:u.username}).then(done).catch(fail));
 else if(u.friend.status==='ok')btn('Message',()=>{close();cur='home';open(dmKey(u.id),'@ '+u.username)});
 else if(u.friend.by!==me.id)btn('Accept request',()=>api('friends/accept','POST',{id:u.id}).then(done));
 else btn('Request sent',()=>{},true);
 p.append(bn,pa,nm,bx,row);c.append(p);pop.replaceChildren(c);pop.style.display='grid';pop.onclick=e=>{if(e.target===pop)close()}}
const APPCSS=`
:root{--bg:#313338;--bg2:#2b2d31;--bg3:#383a40;--tx:#dbdee1;--mu:#949ba4}
body{font:15px/1.4 "gg sans","Segoe UI",Inter,system-ui,sans-serif}.mu{color:#949ba4}.grow{flex:1}
@keyframes gs{to{background-position:300% 0}}@keyframes gs2{50%{background-position:100% 50%}}@keyframes slide{from{opacity:0;transform:translateY(10px)}}@keyframes in2{from{opacity:0;transform:scale(.9) translateY(12px)}}
#app{grid-template-columns:72px 240px 1fr 240px;background:#313338}#app.nomem{grid-template-columns:72px 240px 1fr}#app.nomem #mem{display:none}
#rail{background:#1e1f22;gap:8px;padding:12px 0}.sep{width:32px;height:2px;background:#35363c;border-radius:2px;flex:none}
.rb{width:48px;height:48px;background:#313338;color:#dbdee1;transition:border-radius .2s,background .2s,transform .2s;overflow:hidden}.rb img{width:72%;height:72%}.rb:hover{transform:scale(1.05)}.rb.on,.rb:hover{border-radius:16px;background:var(--ac);color:#fff}
#side{background:#2b2d31;padding:0;display:flex;flex-direction:column;overflow:auto}
.sh{height:120px;flex:none;position:relative;display:flex;align-items:flex-end;padding:12px;font-weight:800;font-size:17px;text-shadow:0 1px 8px #000b;background-size:200% 200%;animation:gs2 10s ease infinite}.sh.plain{height:48px;align-items:center;background:#2b2d31;border-bottom:1px solid #1e1f22;text-shadow:none;font-size:15px;animation:none}
.sh small{position:absolute;top:8px;right:10px;font-size:11px;font-weight:600;background:#0007;padding:3px 9px;border-radius:99px;cursor:pointer}
.cat{font-size:12px;font-weight:700;letter-spacing:.04em;color:#949ba4;margin:18px 8px 4px 14px;text-transform:uppercase}
.ch{display:flex;align-items:center;gap:8px;margin:1px 8px;padding:6px 8px;border-radius:6px;color:#949ba4;font-weight:500;cursor:pointer;transition:background .15s,color .15s,transform .15s}.ch:hover{background:#35373c;color:#dbdee1;transform:translateX(2px)}.ch.on{background:#404249;color:#fff}.ch span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.ch .av{width:28px;height:28px;font-size:12px}
.addf{display:flex;gap:6px;padding:10px 8px}.addf button{padding:6px 12px}.addc{margin:10px 8px}
.vc{background:#232428;border-radius:8px;margin:8px;padding:10px;display:grid;gap:6px;font-size:13px;color:#23a55a}
#me{margin-top:auto;height:56px;flex:none;background:#232428;border-radius:0;padding:0 8px;gap:2px;justify-content:flex-start}.mi{display:flex;gap:8px;align-items:center;flex:1;min-width:0}.mn{display:grid;line-height:1.15;min-width:0}.mn small{color:#949ba4;font-size:11px}
.ib{background:none;color:#b5bac1;padding:6px;border-radius:6px;display:grid;place-items:center}.ib:hover{background:#35373c;color:#fff}
.st{position:relative;flex:none;cursor:pointer}.st::after{content:'';position:absolute;right:-3px;bottom:-3px;width:10px;height:10px;border-radius:50%;background:#80848e;border:3px solid #2b2d31;box-sizing:content-box}.st.on::after{background:#23a55a}#me .st::after{border-color:#232428}
.av{width:40px;height:40px;transition:transform .15s,box-shadow .15s;cursor:pointer}.av:hover{transform:scale(1.06);box-shadow:0 0 0 2px var(--ac)}
#main{background:#313338;height:100vh}#top{display:flex;align-items:center;gap:8px;height:48px;padding:0 12px 0 16px;border-bottom:1px solid #26272b;color:#949ba4}#top b{color:#fff}
#msgs{padding:8px 0 16px}.m{display:flex;gap:16px;padding:2px 48px 2px 16px;margin-top:16px;position:relative}.m.c{margin-top:0;padding-left:72px}.m:hover{background:#2e3035}.m.new{animation:slide .25s ease}
.ht{position:absolute;left:12px;width:48px;text-align:right;font-size:10px;color:#949ba4;display:none;line-height:22px}.m.c:hover .ht{display:block}.mh2{display:flex;align-items:center;flex-wrap:wrap}
.nm{font-weight:600;cursor:pointer}.nm:hover{text-decoration:underline}.nm.sup{background:linear-gradient(90deg,#ff9a4d,#ff3d81,#a855f7,#ff9a4d);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:gs 4s linear infinite}
.ts{font-size:12px;color:#949ba4;margin-left:8px}.mt{white-space:pre-wrap;word-break:break-word;color:#dbdee1}.mb{min-width:0}.em{width:22px;height:22px;vertical-align:-5px;margin:0 1px}.mt.big .em{width:48px;height:48px;vertical-align:-10px}
.bd{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:700;padding:1px 6px;border-radius:5px;background:#1e1f22;margin-left:6px}.bd .em{width:13px;height:13px;vertical-align:0;margin:0}.bd.hot{background:linear-gradient(90deg,#ff6b35,#ff3d81,#a855f7,#ff6b35);background-size:300% 100%;animation:gs 5s linear infinite;color:#fff}
.dd{display:flex;align-items:center;gap:10px;margin:18px 16px 0;color:#949ba4;font-size:12px;font-weight:600}.dd::before,.dd::after{content:'';flex:1;height:1px;background:#3f4147}
.del{position:absolute;right:16px;top:-12px;background:#2b2d31;border:1px solid #1e1f22;color:#f23f43;display:none}.m:hover .del{display:grid}
.empty{display:grid;place-items:center;align-content:center;height:100%;text-align:center;gap:4px;color:#949ba4}.empty h2{margin:6px 0 0;color:#fff}
#bar{padding:0 16px 24px;gap:0}#in{background:#383a40;border:0;border-radius:8px 0 0 8px;padding:12px 16px}#bar>.ib{background:#383a40;border-radius:0 8px 8px 0;width:48px}
#emo{position:absolute;right:16px;bottom:76px;width:352px;height:330px;background:#2b2d31;border:1px solid #1e1f22;border-radius:10px;display:none;flex-direction:column;padding:0;box-shadow:0 10px 40px #000a;overflow:hidden;animation:in2 .18s ease}
.et{display:flex;background:#1e1f22;padding:6px 8px;gap:4px}.et span{padding:6px;border-radius:6px;cursor:pointer;opacity:.6}.et span.on,.et span:hover{background:#35373c;opacity:1}.et .em,.eg .em{width:24px;height:24px;margin:0}
.eg{display:grid;grid-template-columns:repeat(8,1fr);gap:2px;padding:8px;overflow:auto}.eg span{display:grid;place-items:center;padding:5px;border-radius:6px;cursor:pointer;transition:transform .1s}.eg span:hover{background:#383a40;transform:scale(1.25)}
#mem{background:#2b2d31;overflow:auto;padding:4px 8px 20px}.mh{font-size:12px;font-weight:700;color:#949ba4;text-transform:uppercase;margin:16px 6px 4px;letter-spacing:.03em}
.mr{display:flex;gap:10px;align-items:center;padding:5px 8px;border-radius:6px;cursor:pointer;color:#949ba4}.mr:hover{background:#35373c}.mr .av{width:32px;height:32px;font-size:13px}.mr.off{opacity:.45}
#pop{position:fixed;inset:0;z-index:30;display:none;place-items:center;background:#0007}
.pc{--a:#5865f2;--b:#1e1f3a;width:min(340px,94vw);padding:3px;border-radius:14px;background:linear-gradient(135deg,var(--a),var(--b),var(--a));background-size:200% 200%;animation:in2 .25s both,gs2 6s ease infinite;box-shadow:0 20px 60px #000b}
.pi{background:#111214;border-radius:11px;overflow:hidden}.bn{height:110px}.bn.anim{background-size:200% 100%;animation:gs 6s linear infinite}
.pa{margin:-46px 16px 0;width:92px;height:92px}.pa .av{width:100%;height:100%;border:6px solid #111214;font-size:36px;cursor:default;transform:none;box-shadow:none}.pa::after{width:16px;height:16px;border-color:#111214;right:2px;bottom:2px}
.pnm{padding:10px 16px 0;font-size:22px;font-weight:800}.pnm .bd{font-size:12px;vertical-align:4px}.pb{background:#1e1f22;margin:12px;border-radius:8px;padding:4px 12px 12px;font-size:14px}.prow{display:flex;gap:8px;padding:0 12px 12px}
textarea{background:var(--bg);border:1px solid #3a3c44;border-radius:6px;padding:10px;width:100%;min-height:70px;color:inherit;font:inherit;resize:vertical}
.th{background-size:200% 200%;animation:gs2 5s ease infinite}@media(max-width:900px){#app{grid-template-columns:60px 190px 1fr}#mem{display:none}}`;
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
 ws.onmessage=async e=>{const d=JSON.parse(e.data);if(d.type==='presence'){clearTimeout(window.pt);window.pt=setTimeout(members,400)}
  if(d.type==='msg'&&d.m.channel===ch)add(d.m,true);
  if(d.type==='del'){const n=document.querySelector(`.m[data-id="${d.id}"]`);n&&n.remove()}
  if(d.type==='vpeers'&&room)for(const p of d.peers){names[p.id]=p.name;const pc=peer(p.id);await pc.setLocalDescription(await pc.createOffer());sig(p.id,{sdp:pc.localDescription});draw()}
  if(d.type==='vin'&&room){names[d.id]=d.name;draw()}if(d.type==='vout'){vclose(d.id);draw()}if(d.type==='sig')onSig(d)};
 ws.onclose=()=>{if(me){vcleanup();setTimeout(connect,2000)}}}
function modal(fn){const m=$('#modal');m.replaceChildren();const d=el('div');fn(d);const c=el('button','g','Close');c.onclick=()=>m.style.display='none';d.append(c);m.append(d);m.style.display='grid'}
function pickImg(kind){const f=el('input');f.type='file';f.accept='image/png,image/jpeg,image/webp,image/gif';f.onchange=()=>{const file=f.files[0];if(!file)return;const r=new FileReader();
 r.onload=()=>{const send=d=>api(kind,'PUT',{data:d}).then(()=>{AV=Date.now();draw();load();members()}).catch(fail);
  if(file.type==='image/gif')return file.size<(kind==='avatar'?3e5:45e4)?send(r.result.split(',')[1]):alert('GIF too big (avatar max 300KB, banner max 450KB)');
  const img=new Image();img.onload=()=>{const[W,H]=kind==='avatar'?[128,128]:[600,200],c=document.createElement('canvas'),k=Math.max(W/img.width,H/img.height),w=W/k,h=H/k;c.width=W;c.height=H;c.getContext('2d').drawImage(img,(img.width-w)/2,(img.height-h)/2,w,h,0,0,W,H);send(c.toDataURL('image/jpeg',.85).split(',')[1])};img.src=r.result};r.readAsDataURL(file)};f.click()}
async function settings(){let u;try{u=await api('user/'+me.id)}catch(e){return fail(e)}
 modal(d=>{d.append(el('h3','','Edit profile'));const r=el('div'),a=el('button','g','Change avatar'),b=el('button','g','Change banner'),bio=el('textarea'),sv=el('button','','Save bio');r.style.cssText='display:flex;gap:8px;flex-wrap:wrap';a.onclick=()=>pickImg('avatar');b.onclick=()=>pickImg('banner');r.append(a,b);
  bio.value=u.bio||'';bio.maxLength=190;bio.placeholder='About me (190 characters)';sv.onclick=()=>api('bio','PUT',{bio:bio.value}).then(()=>sv.textContent='Saved ✓').catch(fail);
  d.append(r,el('small','mu','PNG, JPEG, WebP or animated GIF. GIF avatars and banners animate everywhere.'),el('h4','','About me'),bio,sv,el('h4','','Profile theme'));const w=el('div');
  Object.entries(THEMES).forEach(([k,t])=>{const s=el('span','th'+(me.theme===k?' on':''));s.style.backgroundImage=`linear-gradient(135deg,${t[0]},${t[1]},${t[0]})`;s.title=k;s.onclick=async()=>{await api('profile','PUT',{theme:k});me.theme=k;theme();draw();settings()};w.append(s)});d.append(w);
  const lo=el('button','g','Log out');lo.onclick=async()=>{await api('logout','POST');const x=ws;me=null;vcleanup();x.close();$('#modal').style.display='none';authView()};d.append(lo)})}
async function staffPanel(){const us=await api('staff/users');modal(d=>{d.append(el('h3','','Staff panel'));us.forEach(u=>{const r=el('div');r.style.cssText='display:flex;gap:6px;flex-wrap:wrap;align-items:center';r.append(el('b','',u.username+(u.role!=='user'?' ('+u.role+')':'')+(u.banned?' 🚫':'')));
  if(u.role==='user'){const b=el('button','g',u.banned?'Unban':'Ban');b.onclick=async()=>{await api('staff/ban','POST',{id:u.id,banned:!u.banned});staffPanel()};r.append(b)}
  Object.keys(BADGES).forEach(k=>{const has=u.badges.includes(k),b=el('button','g',(has?'− ':'+ ')+k);b.onclick=async()=>{await api('staff/badge','POST',{id:u.id,badge:k,on:!has});staffPanel()};r.append(b)});
  if(me.role==='admin'&&u.role!=='admin'){const b=el('button','g',u.role==='staff'?'Demote':'Make staff');b.onclick=async()=>{await api('staff/role','POST',{id:u.id,role:u.role==='staff'?'user':'staff'});staffPanel()};r.append(b)}d.append(r)})})}
function start(){theme();if(!$('#appcss')){const s=el('style');s.id='appcss';s.textContent=APPCSS;document.head.append(s)}root.replaceChildren();const a=el('div');a.id='app';
 const rail=el('div'),side=el('div'),main=el('div'),mem=el('div'),top=el('div'),msgs=el('div'),bar=el('div'),i=el('input'),eb=el('button','ib'),emo=el('div'),md=el('div'),pop=el('div');
 rail.id='rail';side.id='side';main.id='main';mem.id='mem';top.id='top';msgs.id='msgs';bar.id='bar';i.id='in';i.maxLength=1000;emo.id='emo';md.id='modal';pop.id='pop';
 pickerFill(emo,i);eb.append(rich('😀'));eb.onclick=e=>{e.stopPropagation();emo.style.display=emo.style.display==='flex'?'none':'flex'};document.addEventListener('click',e=>{if(!emo.contains(e.target))emo.style.display='none'});
 const send=()=>{if(ch&&i.value.trim()&&ws.readyState===1){ws.send(JSON.stringify({channel:ch,body:i.value}));i.value=''}};i.onkeydown=e=>{if(e.key==='Enter')send()};
 bar.append(i,eb,emo);main.append(top,msgs,bar);a.append(rail,side,main,mem);root.append(a,md,pop);connect();
 refresh().then(()=>{const s=servers[0];if(s){cur=s.id;const f=s.channels.find(c=>c.kind==='text');open(f?'c'+f.id:null,f?'# '+f.name:'');members()}else open(null,'')}).catch(fail);setInterval(()=>me&&refresh().catch(()=>{}),20000)}
api('me').then(u=>{me=u;start()}).catch(authView);
