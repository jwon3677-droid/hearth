// User settings: My Account, Appearance, Notifications, Privacy. Preferences live in this browser (localStorage).
const PREFS=(()=>{let p={};try{p=JSON.parse(localStorage.getItem('hearth.prefs')||'{}')||{}}catch{}return Object.assign({fs:'normal',compact:false,t24:false,reduce:false,nofx:false,sound:true,desk:false},p)})();
function savePrefs(){try{localStorage.setItem('hearth.prefs',JSON.stringify(PREFS))}catch{}applyPrefs()}
function applyPrefs(){const c=document.body.classList;c.toggle('pf-small',PREFS.fs==='small');c.toggle('pf-large',PREFS.fs==='large');c.toggle('pf-compact',!!PREFS.compact);c.toggle('pf-reduce',!!PREFS.reduce);c.toggle('pf-nofx',!!PREFS.nofx)}
applyPrefs();
let _ac;function notifyPing(m){try{
 if(PREFS.sound&&!(me&&me.status==='dnd')){_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.type='sine';o.frequency.setValueAtTime(880,_ac.currentTime);o.frequency.exponentialRampToValueAtTime(1320,_ac.currentTime+.09);g.gain.setValueAtTime(.08,_ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,_ac.currentTime+.25);o.connect(g).connect(_ac.destination);o.start();o.stop(_ac.currentTime+.26)}
 if(PREFS.desk&&document.hidden&&window.Notification&&Notification.permission==='granted'&&!(me&&me.status==='dnd'))new Notification(dn(m),{body:String(m.body).slice(0,120),icon:'/favicon.svg',tag:'hearth-'+m.channel})}catch{}}

function userSettings(tab='acct'){const old=$('.ep');old&&old.remove();
 const ov=el('div','ep us'),L=el('div','epl usn'),R=el('div','usr'),pane=el('div','usp'),x=ib(IC.x,'Close (Esc)',()=>kill(),22);x.classList.add('epx');
 const key=e=>{if(e.key==='Escape'&&!$('.ov')&&!popEl)kill()},kill=()=>{ov.remove();removeEventListener('keydown',key)};
 const sw=(label,sub,get,set)=>{const r=el('div','tgl2'),t=el('div'),b=el('button','sw'+(get()?' on':''));b.type='button';t.append(el('b','',label),el('small','mu',sub||''));b.append(el('i'));
  b.onclick=async()=>{const v=!get();try{await set(v);b.classList.toggle('on',get())}catch(e){fail(e)}};r.append(t,b);return r};
 const pref=(k,label,sub,after)=>sw(label,sub,()=>PREFS[k],async v=>{PREFS[k]=v;savePrefs();after&&await after(v)});
 const sec=t=>el('h3','ush',t);
 const T=[['acct','My Account'],['prof','My Profile'],['app','Appearance'],['notif','Notifications'],['priv','Privacy']];
 const nav=()=>{L.replaceChildren(el('div','eph','User Settings'));T.forEach(([k,n])=>{const b=el('button','usb'+(tab===k?' on':''),n);b.type='button';b.onclick=()=>{if(k==='prof'){kill();editProfile();return}tab=k;nav();draw1()};L.append(b)});L.append(el('div','grow'),btn('Log Out','g wide',()=>{kill();logout()}))};
 function draw1(){pane.replaceChildren();
  if(tab==='acct'){pane.append(el('h2','','My Account'));
   const un=el('input');un.value=me.username;un.maxLength=20;const pw=el('input');pw.type='password';pw.placeholder='Current password';pw.autocomplete='current-password';const f1=field('Username',un),f2=field('Current password',pw);
   const b1=btn('Change Username','',async()=>{f1.err();f2.err();try{const r=await api('account/username','PUT',{username:un.value.trim(),password:pw.value});me.username=r.username;pw.value='';draw();members();load().catch(()=>{});toast('Username updated',1)}catch(e){(/password/i.test(e.message)?f2:f1).err(e.message)}});
   {const c=el('div','card2');c.append(sec('Username'),f1,f2,b1);pane.append(c)}
   const c0=el('input'),c1=el('input');c0.type=c1.type='password';c0.placeholder='Current password';c1.placeholder='New password (8+ characters)';c0.autocomplete='current-password';c1.autocomplete='new-password';const fa=field('Current password',c0),fb=field('New password',c1);
   const b2=btn('Change Password','',async()=>{fa.err();fb.err();try{await api('account/password','PUT',{current:c0.value,next:c1.value});c0.value=c1.value='';toast('Password updated',1)}catch(e){(/current/i.test(e.message)?fa:fb).err(e.message)}});
   const cp=el('div','card2');cp.append(sec('Password'),fa,fb,b2);pane.append(cp);
   const id=el('div','card2');id.append(sec('Your user ID'),el('small','mu','Handy if you ever need to report something to staff.'),btn('Copy User ID','g',()=>{copyTxt(String(me.id));toast('User ID copied',1)}));pane.append(id);
   const dz=el('div','card2 dz'),dp=el('input');dp.type='password';dp.placeholder='Password';dz.append(sec('Delete account'),el('small','mu','Permanently deletes your account, messages and any servers you own. This can\'t be undone.'));
   if(me.role==='admin')dz.append(el('small','mu','The admin account can\'t be deleted here.'));
   else{const fd=field('Confirm with your password',dp);dz.append(fd,btn('Delete My Account','dng',async()=>{if(!dp.value)return fd.err('Enter your password');if(!confirm('Really delete your account? This is permanent.'))return;try{await api('account','DELETE',{password:dp.value});kill();logout()}catch(e){fd.err(e.message)}}))}
   pane.append(dz)}
  if(tab==='app'){pane.append(el('h2','','Appearance'));const c=el('div','card2'),fs=el('div','seg');
   [['small','Small'],['normal','Default'],['large','Large']].forEach(([k,n])=>{const b=el('button',PREFS.fs===k?'on':'',n);b.type='button';b.onclick=()=>{PREFS.fs=k;savePrefs();[...fs.children].forEach(z=>z.classList.toggle('on',z===b))};fs.append(b)});
   c.append(sec('Message text size'),fs,pref('compact','Compact messages','Tighter spacing between messages.'),pref('t24','24-hour time','Show timestamps like 14:30.',()=>load().catch(()=>{})),pref('reduce','Reduce motion','Turns off animations, including profile effects.'),pref('nofx','Hide profile effects','Don\'t show animated effects on profile cards.'));
   pane.append(c,el('small','mu','Changes apply instantly and are saved in this browser. Profile looks live under My Profile.'))}
  if(tab==='notif'){pane.append(el('h2','','Notifications'));const c=el('div','card2');
   c.append(pref('sound','Mention sound','Play a short sound when someone pings you. Muted while you\'re on Do Not Disturb.',v=>{if(v)notifyPing({body:'',channel:'x',username:'Hearth'})}),
    pref('desk','Desktop notifications','Show a notification when you\'re pinged and Hearth is in the background.',async v=>{if(!v)return;if(!window.Notification){PREFS.desk=false;savePrefs();throw Error('This browser doesn\'t support notifications.')}
     const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();if(p!=='granted'){PREFS.desk=false;savePrefs();throw Error('Notifications are blocked. Allow them in your browser\'s site settings.')}}));
   pane.append(c,el('small','mu','Set Do Not Disturb from the menu when you click your name at the bottom left.'))}
  if(tab==='priv'){pane.append(el('h2','','Privacy'));const c=el('div','card2');
   c.append(sw('Allow friend requests','When off, people can\'t send you new friend requests. Existing friends aren\'t affected.',()=>me.allow_fr!==false,async v=>{await api('account/privacy','PUT',{allow_fr:v});me.allow_fr=v}));
   pane.append(c,el('small','mu','Want to appear offline? Pick Invisible from the menu when you click your name at the bottom left.'))}}
 nav();draw1();R.append(pane);ov.append(L,R,x);document.body.append(ov);addEventListener('keydown',key)}

(()=>{const s=document.createElement('style');s.textContent=`
.ep.us{grid-template-columns:260px minmax(0,1fr)}.usn{gap:6px}.usb{background:none;color:#b5bac1;text-align:left;padding:9px 12px;border-radius:6px;font-weight:600}.usb:hover{background:#35373c;color:#fff}.usb.on{background:#404249;color:#fff}
.usr{overflow:auto;padding:56px 40px 80px;background:#1a1b1e}.usp{max-width:620px;display:grid;gap:16px}.usp h2{margin:0 0 4px;color:#f2f3f5}.card2{background:#232428;border-radius:8px;padding:14px;display:grid;gap:12px}.card2.dz{box-shadow:inset 0 0 0 1px #f23f4350}
.ush{margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;color:#b5bac1}.card2 input{background:#1e1f22;border:0;border-radius:6px;padding:10px;outline:none;color:#dbdee1;width:100%}.card2 input:focus{box-shadow:0 0 0 2px var(--ac)}
.tgl2{display:flex;align-items:center;justify-content:space-between;gap:16px}.tgl2 b{display:block;color:#f2f3f5}.tgl2 small{display:block}
.sw{width:42px;height:24px;border-radius:12px;background:#4e5058;padding:3px;flex:none;position:relative}.sw i{display:block;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}.sw.on{background:#23a55a}.sw.on i{transform:translateX(18px)}
.seg{display:flex;gap:6px}.seg button{background:#1e1f22;color:#dbdee1;padding:8px 14px;border-radius:6px}.seg button.on{background:var(--ac);color:#fff}
@media(max-width:760px){.ep.us{grid-template-columns:1fr;overflow:auto}.usr{padding:24px 16px}}
/* prefs */
.pf-small .mt{font-size:13px}.pf-large .mt{font-size:17px}.pf-large .nm{font-size:1.05em}.pf-compact .m{margin-top:4px;gap:12px}.pf-compact .m .av{width:32px;height:32px}.pf-compact .m.c{padding-left:60px}
.pf-reduce *,.pf-reduce *::before{animation:none!important;transition:none!important}.pf-nofx .pfx{display:none}
/* server settings + staff panel tabs */
.sstabs{display:flex;gap:4px;margin-bottom:12px;border-bottom:1px solid #3f4147}.sst{background:none;color:#b5bac1;padding:8px 12px;border-radius:6px 6px 0 0;font-weight:600}.sst:hover{color:#fff}.sst.on{color:#fff;box-shadow:inset 0 -2px 0 var(--ac)}
.sspane{display:grid;gap:12px}.modnote{background:#c4491f22;border:1px solid #c4491f66;border-radius:8px;padding:10px 12px;color:#ffd2c2;font-size:13px}
.rb.modrb{position:relative;box-shadow:0 0 0 2px #c4491f}.modmk{position:absolute;right:-4px;bottom:-4px;font-style:normal;font-size:12px;background:#1e1f22;border-radius:50%;width:18px;height:18px;display:grid;place-items:center}
`;document.head.append(s)})();
