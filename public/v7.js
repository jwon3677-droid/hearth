// Hearth v7: themes, badge hover cards, server-tag popout, server settings (Discord-style), invite links, mobile reply fix.
(()=>{
const $$=(s,r=document)=>r.querySelector(s);
// ================= colour helpers =================
const hx=h=>{h=String(h).replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');return[0,2,4].map(i=>parseInt(h.substr(i,2),16)||0)};
const rg=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{a=hx(a);b=hx(b);return rg(a.map((v,i)=>v+(b[i]-v)*t))};
const lum=h=>{const[r,g,b]=hx(h);return(.299*r+.587*g+.114*b)/255};
const hsl=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return rg([f(0)*255,f(8)*255,f(4)*255])};
// ================= 1. THEMES =================
const KEYS=['p0','p1','p1b','p2a','p2','p3a','p3','p3b','p4','p5','p6','t1','t2','t3','t4','t5'];
function pal(bg,tx,light){const L=light?{p0:-.22,p1b:-.13,p1:-.10,p2a:-.07,p2:-.05,p3a:-.02,p3:0,p3b:-.04,p4:-.06,p5:-.13,p6:-.22}:{p0:-.65,p1b:-.47,p1:-.39,p2a:-.29,p2:-.12,p3a:-.06,p3:0,p3b:.02,p4:.035,p5:.07,p6:.14},o={};
 for(const k in L){const t=L[k];o[k]=t<0?mix(bg,'#000000',-t):mix(bg,'#ffffff',t)}
 const T={t1:0,t2:.12,t3:.27,t4:.42,t5:.52};for(const k in T)o[k]=mix(tx,bg,T[k]);return o}
// [id, name, background, text, accent, isLight]
const HT=[['dark','Hearth Dark'],['amoled','AMOLED','#0a0a0c','#f2f3f5','#5865f2'],['light','Light','#ffffff','#2e3338','#5865f2',1],
 ['midnight','Midnight Blue','#1b2338','#e6ecff','#5aa0ff'],['ember','Ember','#2b1d1b','#ffe9df','#ff6a3d'],['forest','Forest','#1c2a22','#e4f4e9','#3ddc84'],
 ['sakura','Sakura','#3a2832','#ffe8f1','#ff7aa8'],['ocean','Ocean','#12303a','#def6ff','#22c7e0'],['dracula','Dracula','#282a36','#f8f8f2','#bd93f9'],
 ['nord','Nord','#2e3440','#eceff4','#88c0d0'],['mocha','Mocha','#2a211d','#f0e4d8','#d19a66'],['synth','Synthwave','#241b3a','#f6e8ff','#ff4fd8'],
 ['paper','Paper','#f6f1e7','#2b2620','#c4491f',1],['lavender','Lavender Light','#f3effc','#2a2340','#7c5cff',1]];
const CUSTOM0={bg:'#262b3a',tx:'#eef0f6',ac:'#5865f2'};
const cur_=()=>{const id=PREFS.theme||'dark';if(id==='custom'){const c=Object.assign({},CUSTOM0,PREFS.custom||{});return['custom','Custom',c.bg,c.tx,c.ac,lum(c.bg)>.6?1:0]}return HT.find(x=>x[0]===id)||HT[0]};
window.applyHT=function(){const b=document.body,t=cur_();[...KEYS,'bg','bg2','bg3','tx','mu','ac'].forEach(k=>b.style.removeProperty('--'+k));
 b.dataset.hth=t[0];b.classList.toggle('hth-light',!!t[5]);b.style.colorScheme=t[5]?'light':'dark';if(!t[2])return;
 const o=pal(t[2],t[3],t[5]);for(const k in o)b.style.setProperty('--'+k,o[k]);
 b.style.setProperty('--bg',o.p3);b.style.setProperty('--bg2',o.p2);b.style.setProperty('--bg3',o.p4);b.style.setProperty('--tx',o.t2);b.style.setProperty('--mu',o.t4);
 if(PREFS.themeAc!==false&&t[4])b.style.setProperty('--ac',t[4])};
window.themePicker=function(){const w=el('div','htw');
 const draw=()=>{w.replaceChildren();const g=el('div','htg'),sel=PREFS.theme||'dark';
  [...HT,['custom','Custom']].forEach(t=>{const id=t[0],c=Object.assign({},CUSTOM0,PREFS.custom||{}),bg=id==='custom'?c.bg:t[2]||'#313338',tx=id==='custom'?c.tx:t[3]||'#f2f3f5',ac=id==='custom'?c.ac:t[4]||'#5865f2',lt=id==='custom'?lum(c.bg)>.6:t[5],
    p=t[2]||id==='custom'?pal(bg,tx,lt):{p2:'#2b2d31',p3:'#313338',t4:'#949ba4'};
   const b=el('button','hti'+(sel===id?' on':'')),pv=el('span','hpv'),sd=el('i'),l1=el('b'),l2=el('b'),l3=el('b');b.type='button';pv.style.background=p.p3;sd.style.background=p.p2;l1.style.background=ac;l2.style.background=p.t4;l3.style.background=p.t4;
   pv.append(sd,l1,l2,l3);b.append(pv,el('span','htn',t[1]));b.onclick=()=>{PREFS.theme=id;savePrefs();draw()};g.append(b)});
  w.append(g);
  if(sel==='custom'){const c=Object.assign({},CUSTOM0,PREFS.custom||{}),row=el('div','htc'),set=(k,v)=>{PREFS.custom=Object.assign({},CUSTOM0,PREFS.custom||{},{[k]:v});savePrefs()};
   [['bg','Background'],['tx','Text'],['ac','Accent']].forEach(([k,l])=>{const i=el('input');i.type='color';i.value=c[k];i.oninput=()=>set(k,i.value);const lb=el('label','htcl');lb.append(i,el('span','',l));row.append(lb)});
   row.append(btn('Surprise me','g sm',()=>{const h=Math.random()*360,l=Math.random()<.2;PREFS.custom=l?{bg:hsl(h,40,94),tx:hsl(h,35,14),ac:hsl(h,75,50)}:{bg:hsl(h,28,17),tx:hsl(h,30,93),ac:hsl(h,85,64)};savePrefs();draw()}));w.append(row)}
  const r=el('div','tgl2'),t=el('div'),sw=el('button','sw'+(PREFS.themeAc!==false?' on':''));sw.type='button';t.append(el('b','','Use the theme\u2019s accent color'),el('small','mu','Buttons and highlights follow the theme. Turn off to keep your profile color.'));sw.append(el('i'));
  sw.onclick=()=>{PREFS.themeAc=PREFS.themeAc===false;savePrefs();draw()};r.append(t,sw);w.append(r)};
 draw();return w};
// ================= 2. BADGE HOVER CARDS =================
const _badge=window.badge;let bcard=null,btimer=0;
const bcol=b=>b.c||((String(b.g||'').match(/#[0-9a-f]{6}/i)||['#5865f2'])[0]);
function hideBC(now){clearTimeout(btimer);if(!bcard)return;const c=bcard;bcard=null;if(now){c.remove();return}c.classList.add('out');setTimeout(()=>c.remove(),160)}
function showBC(anchor,k){hideBC(1);const b=(window.BD||{})[k]||{n:k},col=bcol(b),c=el('div','bcard'+(b.g?' bg':''));c.style.setProperty('--bc',col);if(b.g)c.style.setProperty('--bgd',b.g);
 const top=el('div','bct'),ico=el('div','bci');if(b.i)ico.innerHTML=b.i;else ico.textContent='\u2605';top.append(ico);
 for(let i=0;i<7;i++){const s=el('s');s.style.cssText=`left:${8+Math.random()*84}%;animation-delay:${(Math.random()*1.6).toFixed(2)}s;animation-duration:${(1.6+Math.random()*1.4).toFixed(2)}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px`;top.append(s)}
 const bd=el('div','bcb');bd.append(el('b','bcn',b.n),el('div','bcd',b.d||'A Hearth badge.'),el('div','bcf','Hearth badge'));c.append(top,bd);document.body.append(c);bcard=c;
 const r=anchor.getBoundingClientRect(),w=c.offsetWidth,h=c.offsetHeight;let x=r.left+r.width/2-w/2,y=r.top-h-10,below=false;if(y<8){y=r.bottom+10;below=true}x=Math.max(8,Math.min(innerWidth-w-8,x));
 c.style.left=x+'px';c.style.top=y+'px';c.classList.toggle('below',below);c.style.setProperty('--ax',(r.left+r.width/2-x)+'px')}
window.badge=function(k,full){const s=_badge.call(this,k,full),b=(window.BD||{})[k]||{};s.removeAttribute('title');s.style.setProperty('--bglow',bcol(b)+'99');
 s.addEventListener('mouseenter',()=>{clearTimeout(btimer);showBC(s,k)});s.addEventListener('mouseleave',()=>{btimer=setTimeout(()=>hideBC(),60)});
 s.addEventListener('click',e=>{if(matchMedia('(hover:none)').matches){e.stopPropagation();bcard?hideBC(1):showBC(s,k)}});return s};
document.addEventListener('scroll',()=>hideBC(1),true);document.addEventListener('touchstart',e=>{if(bcard&&!e.target.closest('.bd'))hideBC(1)},{passive:true});
// ================= 3. SERVER CARD (tag popout / profile / invite) =================
const BANNERS=[['#0b0b0d','#3a3b40'],['#ff1493','#ff80c0'],['#e11919','#ff5a5a'],['#e8761a','#ffa24d'],['#e8c21f','#fbe46a'],['#7a38a8','#c780f0'],['#0891e8','#33c4ff'],['#3fd6c0','#a0f5ea'],['#3f6f0f','#74a823'],['#2a2b2e','#6a6c72']];
window.SBANNERS=BANNERS;
const _tagChip=window.tagChip,fmtD=d=>{try{return new Date(d).toLocaleDateString('en',{month:'short',year:'numeric'})}catch{return''}},nf=n=>(+n||0).toLocaleString();
window.tagChip=function(t){const c=_tagChip(t);if(!c)return c;c.removeAttribute('title');if(t&&t.id){c.classList.add('click');c.setAttribute('role','button');c.tabIndex=0;c.onclick=e=>{e.stopPropagation();e.preventDefault();showServerCard(t.id,c)};c.onkeydown=e=>{if(e.key==='Enter')c.click()}}return c};
function srvIcon(c,sz){const w=el('div','v7i');if(c.has_icon||c.default_icon){const m=new Image();m.src=c.has_icon?'/api/servers/'+c.id+'/icon?v='+AV:'/server-icon.svg';m.alt='';w.append(m)}else w.textContent=String(c.name||'?').trim().split(/\s+/).map(x=>[...x][0]||'').join('').slice(0,2).toLowerCase();return w}
window.renderServerCard=function(c,o={}){const w=el('div','v7c');
 const bn=el('div','v7b'),g=BANNERS[c.bcolor]||BANNERS[0];bn.style.background=c.has_banner?`center/cover url(/api/servers/${c.id}/banner?v=${AV})`:`linear-gradient(180deg,${g[0]},${g[1]})`;
 const ic2=srvIcon(c),nm=el('div','v7n'),nn=el('b','',c.name);nm.append(nn);if(c.tag){const t=_tagChip({tag:c.tag,tag_icon:c.tag_icon,tag_color:c.tag_color});t&&nm.append(t)}
 const st=el('div','v7s'),on=el('span','v7on'),mm=el('span','v7mm');on.textContent=nf(c.online)+' Online';mm.textContent=nf(c.members)+(c.members===1?' Member':' Members');st.append(on,mm);
 w.append(bn,ic2,nm,st);if(c.created)w.append(el('div','v7e','Est. '+fmtD(c.created)));if(c.desc)w.append(el('div','v7d',c.desc));
 const tr=(c.traits||[]).filter(t=>t&&t.t);if(tr.length){const r=el('div','v7t');tr.forEach(t=>{const p=el('span','v7tp');if(t.e)p.append(el('em','',t.e));p.append(t.t);r.append(p)});w.append(r)}
 if(o.foot){const f=el('div','v7f');o.foot(f,w);w.append(f)}return w};
function placeCard(wrap,anchor){const card=wrap.firstChild;if(!anchor||matchMedia('(max-width:720px)').matches){wrap.classList.add('center');return}
 const r=anchor.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight;let x=Math.max(8,Math.min(innerWidth-w-8,r.left)),y=r.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-8);card.style.left=x+'px';card.style.top=y+'px';card.style.position='fixed'}
window.showCard=function(c,{anchor,head,foot}={}){document.querySelectorAll('.v7bk').forEach(x=>x.remove());const bk=el('div','v7bk'),wrap=el('div','v7wrap');bk.append(wrap);
 const close=()=>{bk.remove();document.removeEventListener('keydown',key,true)},key=e=>{if(e.key==='Escape')close()};
 const draw=()=>{wrap.replaceChildren();if(head)wrap.append(el('div','v7h',head));wrap.append(renderServerCard(c,{foot:(f)=>foot(f,c,{close,redraw:draw})}));placeCard(wrap,anchor)};
 bk.addEventListener('mousedown',e=>{if(!e.target.closest('.v7c,.v7h'))close()});document.addEventListener('keydown',key,true);document.body.append(bk);draw();
 if(head){/* modal */wrap.classList.add('center')}return{close,redraw:draw}};
window.showServerCard=async function(id,anchor){let c;try{c=await api('servers/'+id+'/card')}catch(e){return fail(e)}
 showCard(c,{anchor,foot:(f,c,h)=>{const b=el('button','v7btn');b.type='button';
  if(!c.is_member){b.textContent=c.paused?'Invites paused':'Join';b.disabled=!!c.paused;b.onclick=async()=>{b.disabled=true;try{await api('servers/'+c.id+'/join','POST');await refresh();c.is_member=true;toast('Joined '+c.name,1);h.redraw()}catch(e){fail(e);b.disabled=false}};f.append(b)}
  else if(c.tag&&!c.wearing){b.textContent='Adopt Tag';b.onclick=async()=>{b.disabled=true;try{await api('me/tag','PUT',{server_id:c.id});me.tag_server=c.id;c.wearing=true;toast('Tag adopted',1);h.redraw()}catch(e){fail(e);b.disabled=false}};f.append(b)}
  else if(c.tag){b.textContent='\u2713 Tag Adopted';b.disabled=true;b.classList.add('done');f.append(b,btn('Remove Tag','lnk',async()=>{try{await api('me/tag','PUT',{server_id:null});me.tag_server=null;c.wearing=false;h.redraw()}catch(e){fail(e)}}))}
  else{b.textContent='Open Server';b.onclick=()=>{h.close();goServer(c.id)};f.append(b)}}})};
// ================= 4. INVITES =================
const SPm=(s,k)=>s.owner_id===me.id||isStaff()||(s.perms||[]).includes('administrator')||(s.perms||[]).includes(k);window.SPm=SPm;
const inviteURL=code=>location.origin+'/invite/'+code;
window.inviteDialog=function(s){const D=dialog();D.set('Invite friends to '+s.name,'Share this link. Anyone who opens it can join.');
 const i=el('input'),row=el('div','copyrow'),b=btn('Copy','',()=>{copyTxt(inviteURL(s.invite));b.textContent='Copied';b.classList.add('ok');setTimeout(()=>{b.textContent='Copy';b.classList.remove('ok')},1800)});
 i.value=inviteURL(s.invite);i.readOnly=true;i.onfocus=()=>i.select();row.append(i,b);D.body.append(field('Server invite link',row));
 if(SPm(s,'manage_server'))D.body.append(btn('Customize link\u2026','g sm',()=>{D.close();serverSettings(s.id,'iv')}));D.foot.style.display='none'};
let invDone=false;
async function handleInvite(){if(invDone)return;const m=/^\/invite\/([^/?#]+)/.exec(location.pathname);if(!m)return;invDone=true;const code=decodeURIComponent(m[1]);
 const clean=()=>{try{history.replaceState(null,'','/')}catch{}};let c;try{c=await api('invite/'+encodeURIComponent(code))}catch(e){clean();return toast(e.message||'Invalid invite')}
 showCard(c,{head:'You\u2019ve been invited to join',foot:(f,c,h)=>{const b=el('button','v7btn');b.type='button';
  if(c.is_member){b.textContent='Open Server';b.onclick=async()=>{h.close();clean();await refresh();goServer(c.id)}}
  else{b.textContent=c.paused?'Invites paused':'Accept Invite';b.disabled=!!c.paused;b.onclick=async()=>{b.disabled=true;try{const r=await api('join','POST',{code});await refresh();h.close();clean();goServer(r.id)}catch(e){fail(e);b.disabled=false}}}
  f.append(b,btn('No thanks','lnk',()=>{h.close();clean()}))}})}
// ================= 5. SERVER MENU + SETTINGS SCREEN =================
window.serverMenu=function(s,anchor){const r=anchor.getBoundingClientRect(),P=k=>SPm(s,k),it=[['Invite People',()=>inviteDialog(s),{ic:IC.addp}]];
 if(['manage_server','manage_channels','manage_roles','kick_members'].some(P))it.push(['Server Settings',()=>serverSettings(s.id),{ic:IC.gear}]);if(P('manage_channels'))it.push(['Create Channel',()=>channelDialog(s),{ic:IC.plus}]);if(P('manage_server'))it.push(['Server Profile',()=>serverSettings(s.id,'sp'),{ic:IC.users}],['Server Tag',()=>serverSettings(s.id,'st'),{ic:IC.shield}]);if(P('manage_roles'))it.push(['Roles',()=>serverSettings(s.id,'rl'),{ic:IC.shield}]);
 it.push('sep',['Notification Settings',()=>serverSettings(s.id,'nt'),{ic:IC.gear}],['View Server Profile',()=>showServerCard(s.id,null),{ic:IC.users}],['Copy Invite Link',()=>{copyTxt(inviteURL(s.invite));toast('Invite link copied',1)},{ic:IC.copy}]);
 if(s.is_mod)it.push('sep',['Stop Moderating',()=>stopMod(s),{danger:1,ic:IC.out}]);else if(s.owner_id!==me.id)it.push('sep',['Leave Server',()=>leaveDialog(s),{danger:1,ic:IC.out}]);
 ctxOpen(r.left+8,r.bottom+2,it)};
const EMO=['😀','😎','🎮','🎵','🎨','📚','💬','🔥','⭐','💜','🌸','🐱','🐶','🦊','🌙','☕','🍕','⚔️','🚀','🏆','🧪','🎬','⚽','🌍','🛠️','💻','🎲','👻','🌈','🍃','🎤','🧩'];
function pickEmoji(anchor,cb){document.querySelectorAll('.v7ep').forEach(x=>x.remove());const p=el('div','v7ep');EMO.forEach(e=>{const b=el('button','',e);b.type='button';b.onclick=()=>{cb(e);p.remove()};p.append(b)});p.append(btn('None','g sm',()=>{cb('');p.remove()}));
 document.body.append(p);const r=anchor.getBoundingClientRect();p.style.left=Math.max(8,Math.min(innerWidth-p.offsetWidth-8,r.left))+'px';p.style.top=Math.min(innerHeight-p.offsetHeight-8,r.bottom+6)+'px';
 const off=e=>{if(!p.contains(e.target)){p.remove();document.removeEventListener('mousedown',off,true)}};setTimeout(()=>document.addEventListener('mousedown',off,true),0)}
window.serverSettings=function(sid,tab){const S=()=>servers.find(x=>x.id===sid);if(!S())return;const SP=k=>SPm(S(),k),own=S().owner_id===me.id||isStaff();
 $$('.v7ss')&&$$('.v7ss').remove();const ov=el('div','v7ss'),nav=el('div','v7nav'),main=el('div','v7main'),host=el('div','v7host'),prev=el('div','v7prev'),state={};
 const closeAll=()=>{ov.remove();document.removeEventListener('keydown',esc,true)},esc=e=>{if(e.key==='Escape'&&!$$('.ov')&&!$$('.v7ep'))closeAll()};document.addEventListener('keydown',esc,true);
 const gA=[],gB=[],gC=[],gD=[];if(SP('manage_server'))gA.push(['sp','Server Profile'],['st','Server Tag'],['iv','Invites']);if(SP('manage_server'))gB.push(['ov','General']);gB.push(['nt','Notifications']);
 if(SP('manage_roles'))gC.push(['rl','Roles']);if(SP('manage_roles')||SP('kick_members'))gC.push(['mb','Members']);if(SP('manage_channels'))gC.push(['ch','Channels']);if(SP('manage_server'))gD.push(['md','Safety Setup'],['cm','Community']);
 const G=[[S().name,gA],['Server',gB],['People',gC],['Moderation',gD],['',own?[['dz','Delete Server']]:[]]].filter(g=>g[1].length),valid=G.flatMap(g=>g[1].map(x=>x[0]));if(!valid.includes(tab))tab=valid[0];
 const TT={sp:['Server Profile','Customize how your server appears in invite links and when someone clicks your server tag.'],st:['Server Tag','A short tag members can wear next to their name.'],iv:['Invites','Share your server with a link.'],rl:['Roles','Roles group your members and decide what they\u2019re allowed to do. Roles higher in the list outrank the ones below.'],mb:['Members','Give members roles or remove them from the server.']};
 const paint=()=>{nav.replaceChildren();G.forEach(([h,items])=>{if(h)nav.append(el('div','v7nh',h));items.forEach(([k,n])=>{const b=el('button','v7ni'+(tab===k?' on':'')+(k==='dz'?' dng':''),n);b.type='button';b.onclick=()=>{tab=k;render()};nav.append(b)})})};
 async function render(){paint();host.replaceChildren();prev.replaceChildren();prev.style.display='none';main.scrollTop=0;
  if(TT[tab]){host.append(el('h2','v7t1',TT[tab][0]),el('p','v7sub',TT[tab][1]))}
  if(tab==='sp')await paneSP();else if(tab==='st')paneST();else if(tab==='iv')paneIV();else if(tab==='rl')await paneRL();else if(tab==='mb')await paneMB();
  else{const n={ov:'General',nt:'Notifications',mb:'Members',ch:'Channels',md:'Safety Setup',cm:'Community',dz:'Delete Server'}[tab]||'';host.append(el('h2','v7t1',n));window.__ssHost={box:el('div'),body:host,foot:el('div'),set(){},close:closeAll};try{serverSettingsOld(sid,tab)}finally{window.__ssHost=null}}}
 const again=()=>{if(!S())return closeAll();render()};
 function paneST(){const s=S(),row=el('div','v7card'),ch=tagChip(s.tag?{tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color}:null);
  row.append(ch||el('span','mu','This server doesn\u2019t have a tag yet.'),btn(s.tag?'Edit Tag':'Create Tag','',()=>tagDialog(s,again)));host.append(row,el('p','v7sub','Members adopt the tag from your server\u2019s profile card (click the tag next to a name) or in Edit Profile. Tags are 2\u20134 letters or numbers with an icon and a color.'))}
 function paneIV(){const s=S(),lounge=s.invite==='hearth',ST=s.settings||{};
  const code=el('input');code.value=inviteURL(s.invite);code.readOnly=true;code.onfocus=()=>code.select();const row=el('div','copyrow');row.append(code,btn('Copy','',()=>{copyTxt(inviteURL(s.invite));toast('Invite link copied',1)}));host.append(field('Invite link',row));
  if(lounge){host.append(el('p','v7sub','The default Hearth Lounge link is fixed.'))}
  else{const pre=el('div','v7vr'),ci=el('input');ci.placeholder='cool';ci.maxLength=24;ci.value=/^[0-9a-f]{10}$/.test(s.invite)?'':s.invite;pre.append(el('span','',location.origin+'/invite/'),ci);const f=field('Custom link',pre,'3\u201324 letters, numbers, - or _. First come, first served.');
   const sv=btn('Save Link','',async()=>{f.err&&f.err();try{await api('servers/'+sid+'/invite','PUT',{code:ci.value});await refresh();toast('Invite link updated',1);again()}catch(e){f.err?f.err(e.message):fail(e)}});
   host.append(f,el('div','v7acts'));host.lastChild.append(sv,btn('Random link','g',async()=>{try{await api('servers/'+sid+'/invite','POST');await refresh();toast('New link created \u2014 the old one no longer works',1);again()}catch(e){fail(e)}}));
   const r=el('div','tgl2'),t=el('div'),sw=el('button','sw'+(ST.inv_pause?' on':''));sw.type='button';t.append(el('b','','Pause invites'),el('small','mu','Stop new members from joining with the link or the tag popout.'));sw.append(el('i'));
   sw.onclick=async()=>{const v=!sw.classList.contains('on');try{await api('servers/'+sid+'/settings','PUT',{inv_pause:v});sw.classList.toggle('on',v);S().settings=Object.assign(S().settings||{},{inv_pause:v});await refresh()}catch(e){fail(e)}};r.append(t,sw);host.append(r)}}
 async function paneSP(){const s=S();let c;try{c=await api('servers/'+sid+'/card')}catch(e){return fail(e)}const ST=s.settings||{};
  const d=state.sp||(state.sp={name:s.name,desc:ST.desc||'',traits:(Array.isArray(ST.traits)?ST.traits:[]).map(x=>({e:x.e||'',t:x.t||''})),bcolor:Number.isInteger(+ST.bcolor)?+ST.bcolor:0});
  while(d.traits.length<5)d.traits.push({e:'',t:''});
  const pv=()=>{prev.style.display='';prev.replaceChildren(el('div','v7pl','Preview'),renderServerCard(Object.assign({},c,{name:d.name||s.name,desc:d.desc,traits:d.traits,bcolor:d.bcolor,tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color,has_icon:s.has_icon,default_icon:s.invite==='hearth'})))};
  const ni=el('input');ni.maxLength=30;ni.value=d.name;ni.oninput=()=>{d.name=ni.value;pv();bar.classList.add('show')};
  const di=el('textarea','sta');di.maxLength=300;di.rows=4;di.placeholder='How did your server get started? Why should people join?';di.value=d.desc;di.oninput=()=>{d.desc=di.value;pv();bar.classList.add('show')};
  const bg=el('div','v7bg');BANNERS.forEach((g,i)=>{const b=el('button','v7sw'+(d.bcolor===i&&!c.has_banner?' on':''));b.type='button';b.style.background=`linear-gradient(180deg,${g[0]},${g[1]})`;b.onclick=()=>{d.bcolor=i;bar.classList.add('show');if(c.has_banner){api('servers/'+sid+'/banner','DELETE').then(()=>{c.has_banner=false;AV=Date.now();paintSw();pv()}).catch(fail)}else{paintSw();pv()}};bg.append(b)});
  const paintSw=()=>[...bg.children].forEach((b,i)=>b.classList.toggle('on',d.bcolor===i&&!c.has_banner));
  const up=el('div','v7acts'),fi=el('input');fi.type='file';fi.accept='image/png,image/jpeg,image/webp,image/gif';fi.hidden=true;
  fi.onchange=async()=>{const f=fi.files[0];if(!f)return;if(f.size>5*1024*1024)return toast('Banner too big (max 5MB)');try{await putRaw('/api/servers/'+sid+'/banner','PUT',f);AV=Date.now();c.has_banner=true;paintSw();pv();toast('Banner updated',1)}catch(e){fail(e)}};
  up.append(fi,btn('Upload banner image','g sm',()=>fi.click()),btn('Remove image','g sm',async()=>{try{await api('servers/'+sid+'/banner','DELETE');c.has_banner=false;AV=Date.now();paintSw();pv()}catch(e){fail(e)}}));
  const tw=el('div','v7tr');d.traits.slice(0,5).forEach((t,i)=>{const r=el('div','v7trr'),eb=el('button','v7eb',t.e||'\u263A');eb.type='button';eb.onclick=()=>pickEmoji(eb,e=>{t.e=e;eb.textContent=e||'\u263A';pv();bar.classList.add('show')});
   const ti=el('input');ti.maxLength=24;ti.placeholder='Trait '+(i+1)+' (e.g. Minecraft)';ti.value=t.t;ti.oninput=()=>{t.t=ti.value;pv();bar.classList.add('show')};r.append(eb,ti);tw.append(r)});
  const bar=el('div','v7bar'),save=btn('Save Changes','',async()=>{save.disabled=true;try{if(d.name.trim()!==s.name)await api('servers/'+sid,'PUT',{name:d.name});await api('servers/'+sid+'/settings','PUT',{desc:d.desc,bcolor:d.bcolor,traits:d.traits.filter(t=>t.t.trim()).map(t=>({e:t.e,t:t.t.trim()}))});delete state.sp;await refresh();toast('Server profile saved',1);again()}catch(e){fail(e)}save.disabled=false});
  bar.append(el('span','','Careful \u2014 you have unsaved changes!'),btn('Reset','lnk',()=>{delete state.sp;again()}),save);
  host.append(field('Name',ni),iconRow(s,()=>again()),field('Banner',bg),up,el('div','v7lb','Traits'),el('p','v7sub','Add up to 5 traits to show off your server\u2019s interests and personality.'),tw,field('Description',di),bar);pv()}

 const PERMS=[['administrator','Administrator','Every permission, including everything below.'],['manage_server','Manage Server','Edit the server profile, tag, invites and settings.'],['manage_roles','Manage Roles','Create, edit and hand out roles below their own highest role.'],['manage_channels','Manage Channels','Create, rename, reorder and delete channels.'],['manage_messages','Manage Messages','Delete other people\u2019s messages and pin messages.'],['kick_members','Kick Members','Remove members from the server.'],['mention_everyone','Mention @everyone and @here','Ping the whole server.']];
 const sw=(on,fn)=>{const b=el('button','sw'+(on?' on':''));b.type='button';b.append(el('i'));b.onclick=()=>{const v=!b.classList.contains('on');b.classList.toggle('on',v);fn(v)};return b};
 const trow=(t,sub,on,fn)=>{const r=el('div','tgl2'),d=el('div');d.append(el('b','',t),el('small','mu',sub||''));r.append(d,sw(on,fn));return r};
 async function paneRL(){let roles;try{roles=await api('servers/'+sid+'/roles')}catch(e){return fail(e)}
  const list=el('div','v7rl'),top=el('div','v7acts');
  const draw=()=>{list.replaceChildren();roles.forEach((r,i)=>{const row=el('div','v7rr'),dot=el('span','v7dot');dot.style.background=r.color||'#99aab5';row.append(dot,el('b','',r.name),el('small','mu',r.count+(r.count===1?' member':' members')),el('span','grow'),btn('\u2191','g sm',()=>move(i,-1)),btn('\u2193','g sm',()=>move(i,1)),btn('Edit','g sm',()=>edit(r)));list.append(row)});
   if(!roles.length)list.append(el('p','v7sub','No roles yet. Create one to get started.'))};
  const move=async(i,d)=>{const j=i+d;if(j<0||j>=roles.length)return;const a=roles.slice();[a[i],a[j]]=[a[j],a[i]];try{await api('servers/'+sid+'/roles/order','PUT',{ids:a.map(x=>x.id)});roles=await api('servers/'+sid+'/roles');draw()}catch(e){fail(e)}};
  top.append(btn('Create Role','',async()=>{try{const r=await api('servers/'+sid+'/roles','POST',{name:'new role',color:'#99aab5',perms:{}});roles=await api('servers/'+sid+'/roles');edit(roles.find(x=>x.id===r.id))}catch(e){fail(e)}}));
  const edit=r=>{const d={name:r.name,color:r.color||'#99aab5',hoist:!!r.hoist,perms:Object.assign({},r.perms||{})};host.replaceChildren(el('h2','v7t1','Edit Role'),el('p','v7sub','Changes apply to everyone who has this role.'));
   const ni=el('input');ni.maxLength=30;ni.value=d.name;ni.oninput=()=>{d.name=ni.value};const cw=el('div','v7bg v7cs'),ci=el('input');ci.type='color';ci.value=d.color;
   const pc=()=>[...cw.querySelectorAll('.v7sw')].forEach(b=>b.classList.toggle('on',b.dataset.c===d.color));
   ['#99aab5','#1abc9c','#2ecc71','#3498db','#9b59b6','#e91e63','#f1c40f','#e67e22','#e74c3c','#95a5a6','#ff7aa8','#5865f2'].forEach(c=>{const b=el('button','v7sw');b.type='button';b.dataset.c=c;b.style.background=c;b.onclick=()=>{d.color=c;ci.value=c;pc()};cw.append(b)});
   ci.oninput=()=>{d.color=ci.value;pc()};cw.append(ci);pc();
   const pl=el('div','card2');PERMS.forEach(([k,n,sub])=>pl.append(trow(n,sub,!!d.perms[k],v=>{if(v)d.perms[k]=true;else delete d.perms[k]})));
   const acts=el('div','v7acts'),sv=btn('Save Changes','',async()=>{sv.disabled=true;try{await api('roles/'+r.id,'PUT',{name:d.name,color:d.color,hoist:d.hoist,perms:d.perms});await refresh();toast('Role saved',1);render()}catch(e){fail(e);sv.disabled=false}});
   acts.append(btn('Back','lnk',()=>render()),sv,btn('Delete Role','dng',async()=>{if(await askConfirm('Delete '+r.name+'?','Everyone with this role loses it.',{ok:'Delete Role',danger:1})){try{await api('roles/'+r.id,'DELETE');await refresh();toast('Role deleted',1);render()}catch(e){fail(e)}}}));
   host.append(field('Role name',ni),field('Role color',cw),trow('Display role members separately','Show this role as its own group in the member list.',d.hoist,v=>{d.hoist=v}),el('div','v7lb','Permissions'),pl,acts)};
  host.append(top,list);draw()}
 async function paneMB(){let roles,ml;try{[roles,ml]=await Promise.all([api('servers/'+sid+'/roles'),api('members/'+sid)])}catch(e){return fail(e)}
  const s=S(),canR=SP('manage_roles'),canK=SP('kick_members'),qi=el('input','sbar'),list=el('div','v7rl'),rb=new Map(roles.map(r=>[r.id,r]));qi.placeholder='Search members';host.append(qi,list);
  const draw=()=>{list.replaceChildren();const f=qi.value.trim().toLowerCase();ml.filter(m=>!f||(dn(m)+' '+m.username).toLowerCase().includes(f)).forEach(m=>{const row=el('div','v7rr'),n=el('div','v7mn'),ch=el('div','v7chips');
    n.append(el('b','',dn(m)),el('small','mu',m.username+(m.id===s.owner_id?' \u00b7 owner':['staff','admin'].includes(m.role)?' \u00b7 staff':'')));
    (m.rids||[]).map(i=>rb.get(i)).filter(Boolean).forEach(r=>{const c=el('span','v7chip'),d=el('i');d.style.background=r.color||'#99aab5';c.append(d,r.name);ch.append(c)});row.append(n,ch,el('span','grow'));
    if(canR)row.append(btn('Roles','g sm',()=>assign(m)));
    if(canK&&m.id!==s.owner_id&&!['staff','admin'].includes(m.role)&&m.id!==me.id)row.append(btn('Remove','dng sm',async()=>{if(await askConfirm('Remove '+m.username+'?','They can rejoin with an invite.',{ok:'Remove',danger:1})){try{await api('servers/'+sid+'/members/'+m.id,'DELETE');ml=ml.filter(x=>x.id!==m.id);draw();toast(m.username+' removed',1)}catch(e){fail(e)}}}));
    list.append(row)})};
  qi.oninput=draw;
  const assign=m=>{const D=dialog();D.set('Roles for '+dn(m),'Pick which roles this member has.');const sel=new Set(m.rids||[]);if(!roles.length)D.body.append(el('p','mu','No roles yet. Create some under Roles.'));
   roles.forEach(r=>{const row=el('label','v7pk'),cb=el('input'),d=el('i');cb.type='checkbox';cb.checked=sel.has(r.id);cb.onchange=()=>cb.checked?sel.add(r.id):sel.delete(r.id);d.style.background=r.color||'#99aab5';row.append(cb,d,r.name);D.body.append(row)});
   const ok=btn('Save','',async()=>{ok.disabled=true;try{await api('servers/'+sid+'/members/'+m.id+'/roles','PUT',{ids:[...sel]});m.rids=[...sel];D.close();draw();toast('Roles updated',1)}catch(e){fail(e);ok.disabled=false}});D.foot.append(btn('Cancel','lnk',D.close),ok)};
  draw()}
 const x=el('button','v7x');x.type='button';x.innerHTML='<span>\u2715</span><small>ESC</small>';x.onclick=closeAll;
 main.append(host,prev);ov.append(nav,main,x);document.body.append(ov);render()};
// ---- roles: colored names + hoisted member groups
const _nfx=window.nameFx;window.nameFx=function(n,u,fb){let rc=u&&u.rc;if(!rc&&u&&typeof cur==='number'&&typeof memCache!=='undefined'){const id=u.uid||u.id,m=id&&memCache.find(x=>x.id===id);rc=m&&m.rc}return _nfx.call(this,n,u,rc||fb)};
window.hoistGroups=l=>{const m=new Map();l.forEach(u=>{if(u.hr&&u.online)m.set(u.hr.id,u.hr)});return[...m.values()].sort((a,b)=>b.pos-a.pos).map(h=>[h.name,u=>u.online&&u.hr&&u.hr.id===h.id])};
// ================= 6. CSS =================
const css=`
.htg{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;margin:8px 0 14px}.hti{background:var(--p1,#1e1f22);border:2px solid transparent;border-radius:10px;padding:8px;display:grid;gap:6px;cursor:pointer;color:var(--t2,#dbdee1);text-align:left}.hti:hover{border-color:var(--p5,#3f4147)}.hti.on{border-color:var(--ac)}
.hpv{display:grid;grid-template-columns:22px 1fr;grid-template-rows:6px 6px 6px;gap:4px;height:48px;border-radius:6px;padding:6px;overflow:hidden}.hpv i{grid-row:1/4;border-radius:3px}.hpv b{border-radius:3px;opacity:.85}.hpv b:nth-child(3),.hpv b:nth-child(4){opacity:.45;width:70%}.htn{font-size:12px;font-weight:700}
.htc{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 14px}.htcl{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--t3,#b5bac1)}.htcl input{width:38px;height:30px;padding:0;border:0;background:none;cursor:pointer}
body.hth-light .ov{background:#0007}
/* badges */
.bd.bi{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s;cursor:default}.bd.bi:hover{transform:translateY(-2px) scale(1.1);box-shadow:0 4px 14px var(--bglow,#0006),inset 0 0 0 1px #ffffff30}
.bd.bi:hover .bic{animation:bwig .55s ease}.bd.bi.bg:hover{background-size:220% 100%;animation:bshim 1.2s linear infinite}
@keyframes bwig{0%{transform:rotate(0)}25%{transform:rotate(-16deg) scale(1.2)}55%{transform:rotate(12deg) scale(1.2)}100%{transform:rotate(0)}}@keyframes bshim{from{background-position:0 0}to{background-position:220% 0}}
.bcard{position:fixed;z-index:90;width:236px;border-radius:14px;background:var(--p1b,#1a1b1e);box-shadow:0 12px 40px #000a,0 0 0 1px #ffffff14,0 0 28px -6px var(--bc);overflow:hidden;pointer-events:none;transform-origin:var(--ax,50%) 100%;animation:bin .26s cubic-bezier(.34,1.56,.64,1)}.bcard.below{transform-origin:var(--ax,50%) 0}.bcard.out{animation:bout .16s ease-in forwards}
@keyframes bin{from{opacity:0;transform:translateY(8px) scale(.82)}to{opacity:1;transform:none}}@keyframes bout{to{opacity:0;transform:translateY(4px) scale(.94)}}
.bct{position:relative;height:84px;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 120%,var(--bc),transparent 70%),linear-gradient(160deg,color-mix(in srgb,var(--bc) 55%,#000),color-mix(in srgb,var(--bc) 22%,#000))}.bcard.bg .bct{background:var(--bgd);background-size:200% 200%;animation:bgsh 4s ease infinite}
@keyframes bgsh{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.bci{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;color:#fff;background:#00000040;box-shadow:inset 0 0 0 1px #ffffff40,0 6px 18px #0006;animation:bfl 2.4s ease-in-out infinite;position:relative;overflow:hidden}.bci svg{width:30px;height:30px}
.bci::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,#fff7 50%,transparent 65%);transform:translateX(-120%);animation:bsw 2.2s ease-in-out .3s infinite}
@keyframes bfl{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-4px) rotate(3deg)}}@keyframes bsw{to{transform:translateX(120%)}}
.bct s{position:absolute;bottom:-6px;border-radius:50%;background:#fff;opacity:0;animation:bsp 2s ease-in infinite}@keyframes bsp{0%{opacity:0;transform:translateY(0)}20%{opacity:.9}100%{opacity:0;transform:translateY(-84px)}}
.bcb{padding:12px 14px 13px;display:grid;gap:4px}.bcn{font-size:15px;color:var(--t1,#f2f3f5)}.bcd{font-size:13px;line-height:1.35;color:var(--t3,#b5bac1)}.bcf{margin-top:6px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--bc)}
/* server tag chip + card */
.stg.click{cursor:pointer;transition:transform .15s,filter .15s}.stg.click:hover{transform:translateY(-1px);filter:brightness(1.25)}
.v7bk{position:fixed;inset:0;z-index:70}.v7wrap.center{position:absolute;inset:0;display:grid;place-content:center;gap:10px;background:#000a;animation:fade .12s ease-out}.v7wrap.center .v7c{position:static!important}.v7h{text-align:center;font-weight:800;color:#fff;font-size:15px}
.v7c{width:min(320px,calc(100vw - 24px));border-radius:14px;background:var(--p1b,#1a1b1e);color:var(--t2,#dbdee1);box-shadow:0 12px 40px #000a,0 0 0 1px #ffffff14;overflow:hidden;position:relative;padding-bottom:14px;animation:v7in .2s cubic-bezier(.34,1.56,.64,1)}
@keyframes v7in{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
.v7b{height:96px;background-size:cover}.v7i{width:64px;height:64px;border-radius:18px;margin:-34px 0 0 16px;border:5px solid var(--p1b,#1a1b1e);background:var(--p2,#2b2d31);display:grid;place-items:center;font-weight:800;color:var(--t1,#f2f3f5);overflow:hidden;position:relative;box-sizing:content-box;width:54px;height:54px}.v7i img{width:100%;height:100%;object-fit:cover}
.v7n{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 16px 0;font-size:17px;color:var(--t1,#f2f3f5)}.v7n .stg{margin:0}.v7s{display:flex;gap:12px;padding:4px 16px 0;font-size:12px;color:var(--t4,#949ba4)}.v7s span::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;background:var(--t5,#80848e)}.v7s .v7on::before{background:#23a55a}
.v7e{padding:2px 16px 0;font-size:12px;color:var(--t4,#949ba4)}.v7d{padding:10px 16px 0;font-size:13px;line-height:1.4;color:var(--t3,#b5bac1);white-space:pre-wrap;word-break:break-word}.v7t{display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px 0}.v7tp{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:8px;background:var(--p2,#2b2d31);font-size:12px;font-weight:700;color:var(--t2,#dbdee1)}.v7tp em{font-style:normal}
.v7f{padding:14px 16px 0;display:grid;gap:6px}.v7btn{background:#248046;color:#fff;border:0;border-radius:6px;padding:10px;font-weight:700;cursor:pointer;width:100%}.v7btn:hover{background:#1a6334}.v7btn:disabled{opacity:.6;cursor:default}.v7btn.done{background:var(--p2,#2b2d31);color:var(--t3,#b5bac1)}
.v7rl{display:grid;gap:6px}.v7rr{display:flex;align-items:center;gap:10px;background:var(--p1,#1e1f22);padding:10px 12px;border-radius:8px;flex-wrap:wrap}.v7dot,.v7chip i,.v7pk i{width:12px;height:12px;border-radius:50%;display:inline-block;flex:none}.v7chips{display:flex;flex-wrap:wrap;gap:4px}.v7chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;background:var(--p2,#2b2d31);padding:2px 8px;border-radius:10px}.v7pk{display:flex;align-items:center;gap:10px;padding:8px;border-radius:6px;cursor:pointer}.v7pk input{width:auto}.v7mn{display:grid;min-width:0}.v7cs{grid-template-columns:repeat(6,1fr)}.v7cs .v7sw{height:34px}.v7cs input{grid-column:span 2;height:34px;padding:0;border:0;background:none}
/* server settings screen */
.v7ss{position:fixed;inset:0;z-index:55;background:var(--p3,#313338);display:flex;color:var(--t2,#dbdee1);animation:fade .12s ease-out}
.v7nav{width:min(300px,34vw);padding:60px 10px 20px 20px;background:var(--p2,#2b2d31);overflow:auto;display:flex;flex-direction:column;align-items:stretch;gap:2px;flex:none}.v7nh{font-size:12px;font-weight:700;color:var(--t4,#949ba4);padding:16px 10px 6px;text-transform:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v7nh:first-child{padding-top:0}
.v7ni{background:none;border:0;border-radius:6px;padding:8px 10px;text-align:left;color:var(--t3,#b5bac1);font-weight:600;cursor:pointer;font-size:15px}.v7ni:hover{background:var(--p3b,#35373c);color:var(--t1,#f2f3f5)}.v7ni.on{background:var(--p4,#383a40);color:var(--t1,#f2f3f5)}.v7ni.dng{color:#f23f43;margin-top:14px}
.v7main{flex:1;min-width:0;overflow:auto;padding:60px 40px 60px;display:flex;gap:32px;align-items:flex-start}.v7host{flex:1;min-width:0;max-width:600px;display:grid;gap:16px;align-content:start}.v7prev{width:320px;flex:none;position:sticky;top:0;display:none}.v7pl{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--t4,#949ba4);margin-bottom:8px}
.v7t1{margin:0;font-size:22px;color:var(--t1,#f2f3f5)}.v7sub{margin:-8px 0 0;color:var(--t4,#949ba4);font-size:13px}.v7lb{font-weight:700;color:var(--t1,#f2f3f5);margin-bottom:-8px}.v7card{display:flex;align-items:center;gap:12px;background:var(--p1,#1e1f22);padding:14px;border-radius:10px}.v7acts{display:flex;gap:8px;flex-wrap:wrap}
.v7vr{display:flex;align-items:center;background:var(--p1,#1e1f22);border-radius:6px;padding-left:10px;color:var(--t4,#949ba4);font-size:14px}.v7vr input{border:0;background:none}
.v7bg{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.v7sw{height:56px;border-radius:8px;border:2px solid transparent;cursor:pointer;padding:0}.v7sw.on{outline:2px solid var(--t1,#f2f3f5);outline-offset:2px}
.v7tr{display:grid;gap:8px}.v7trr{display:flex;gap:8px}.v7eb{width:44px;flex:none;background:var(--p1,#1e1f22);border:0;border-radius:6px;font-size:18px;padding:0;cursor:pointer;color:var(--t3,#b5bac1)}.v7ep{position:fixed;z-index:90;background:var(--p1b,#1a1b1e);border-radius:10px;padding:8px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;box-shadow:0 8px 30px #000a}.v7ep button{background:none;padding:4px;font-size:20px}.v7ep button:hover{background:var(--p3b,#35373c)}
.v7bar{position:sticky;bottom:-40px;display:none;align-items:center;gap:10px;background:var(--p0,#111214);padding:10px 12px;border-radius:8px;box-shadow:0 4px 18px #0007}.v7bar.show{display:flex}.v7bar span{flex:1;font-size:14px;color:var(--t1,#f2f3f5)}
.v7x{position:fixed;top:44px;right:44px;background:none;border:2px solid var(--t4,#949ba4);color:var(--t4,#949ba4);border-radius:50%;width:36px;height:36px;padding:0;display:grid;place-items:center;cursor:pointer;z-index:2}.v7x small{position:absolute;top:44px;font-size:11px;font-weight:700}.v7x:hover{color:var(--t1,#f2f3f5);border-color:var(--t1,#f2f3f5)}
.v7host .sstabs{display:none}.v7host .sspane{max-width:100%}.v7host .dg-b{max-height:none}
@media(max-width:860px){.v7main{flex-direction:column;padding:16px 14px 80px;gap:20px}.v7prev{width:100%;position:static}.v7host{max-width:100%;width:100%}}
@media(max-width:720px){.v7ss{flex-direction:column}.v7nav{width:100%;flex-direction:row;overflow-x:auto;padding:max(10px,env(safe-area-inset-top)) 56px 8px 10px;gap:4px}.v7nh{display:none}.v7ni{white-space:nowrap;padding:8px 12px;flex:none}.v7ni.dng{margin-top:0}.v7x{top:max(10px,env(safe-area-inset-top));right:10px;width:32px;height:32px}.v7x small{display:none}.v7bg{grid-template-columns:repeat(5,1fr)}
 /* reply preview was overlapping the message header on phones (the mobile padding override removed the room it needs) */
 .m.hasrp{padding-top:26px!important}.rp{left:28px!important;right:12px!important;overflow:hidden}}
`;
const st=document.createElement('style');st.id='v7css';st.textContent=css;document.head.append(st);
// ================= 7. boot =================
try{applyHT()}catch{}
new MutationObserver(()=>{if(!invDone&&document.getElementById('app')&&typeof me!=='undefined'&&me&&/^\/invite\//.test(location.pathname))handleInvite()}).observe(document.getElementById('root')||document.body,{childList:true});
})();
