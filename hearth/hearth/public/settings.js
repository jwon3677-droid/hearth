// User settings: My Account, Appearance, Notifications, Privacy. Preferences live in this browser (localStorage).
const PREFS=(()=>{let p={};try{p=JSON.parse(localStorage.getItem('hearth.prefs')||'{}')||{}}catch{}return Object.assign({fs:'normal',compact:false,t24:false,reduce:false,nofx:false,sound:true,desk:false,theme:'dark',zoom:100,fpx:16,gap:16,sat:100,hc:false,roleclr:true,sticky:'off',sync:true,motionEmoji:true,motionGif:true,dyslexic:false,underline:false,tts:'off',link_prev:true,embed:true,imgprev:true,emoji_conv:true,emoji_hov:true,spoiler:'click',showtyping:true,sendBtn:false,sugg:true,dmpriv:'all',readrec:true,activity:true,nsfwfilter:'all',dnsfw:false,mutedm:false,suppress_ev:false,msgsound:true,callsound:true,deafsound:true,vol:100,inDev:'',outDev:'',camDev:'',mode:'vad',sens:50,echo:true,noise:true,agc:true,streamer:false,sHideInv:true,sHideInfo:true,sNoSound:true,sNoNotif:true,lang:'en-US',tz:'auto',hw:true,debug:false,devmode:false,confirmLink:true,startMin:false,launchCh:'last',spell:true,autoplay:true,overlay:false,hideSidebar:false,showTabPing:true,unreadBadge:true,flashTaskbar:true,dmnotif:true,friendnotif:true,inviteDM:true,mentionAll:true,srvdef:'mentions'},p)})();
function savePrefs(){try{localStorage.setItem('hearth.prefs',JSON.stringify(PREFS))}catch{}applyPrefs()}
function applyPrefs(){const c=document.body.classList;c.toggle('pf-small',PREFS.fs==='small');c.toggle('pf-large',PREFS.fs==='large');c.toggle('pf-compact',!!PREFS.compact);c.toggle('pf-reduce',!!PREFS.reduce);c.toggle('pf-nofx',!!PREFS.nofx);c.toggle('pf-hc',!!PREFS.hc);c.toggle('pf-amoled',PREFS.theme==='amoled');c.toggle('pf-light',PREFS.theme==='light');c.toggle('pf-dys',!!PREFS.dyslexic);c.toggle('pf-ul',!!PREFS.underline);c.toggle('pf-nolink',!PREFS.link_prev);c.toggle('pf-noimg',!PREFS.imgprev);c.toggle('pf-stream',!!PREFS.streamer&&!!PREFS.sHideInv);c.toggle('pf-streaminfo',!!PREFS.streamer&&!!PREFS.sHideInfo);c.toggle('pf-nosticky',PREFS.sticky==='off');const r=document.documentElement.style;r.setProperty('--fpx',PREFS.fpx+'px');r.setProperty('--gap',PREFS.gap+'px');r.setProperty('--sat',PREFS.sat+'%');document.body.style.zoom=PREFS.zoom/100}
applyPrefs();
let _ac;function notifyPing(m){try{
 if(PREFS.sound&&PREFS.msgsound&&!(me&&me.status==='dnd')&&!(PREFS.streamer&&PREFS.sNoSound)){_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.type='sine';o.frequency.setValueAtTime(880,_ac.currentTime);o.frequency.exponentialRampToValueAtTime(1320,_ac.currentTime+.09);g.gain.setValueAtTime(.08,_ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,_ac.currentTime+.25);o.connect(g).connect(_ac.destination);o.start();o.stop(_ac.currentTime+.26)}
 if(PREFS.desk&&!(PREFS.streamer&&PREFS.sNoNotif)&&document.hidden&&window.Notification&&Notification.permission==='granted'&&!(me&&me.status==='dnd'))new Notification(dn(m),{body:(m.body===WAVE_TOKEN?'👋 Waved at you':String(m.body)).slice(0,120),icon:'/favicon.svg',tag:'hearth-'+m.channel})}catch{}}

function userSettings(tab='acct'){const old=$('.ep');old&&old.remove();
 const ov=el('div','ep us'),L=el('div','epl usn'),R=el('div','usr'),pane=el('div','usp'),x=ib(IC.x,'Close (Esc)',()=>kill(),22);x.classList.add('epx');
 const key=e=>{if(e.key==='Escape'&&!$('.ov')&&!popEl)kill()},kill=()=>{ov.remove();removeEventListener('keydown',key)};
 const sw=(label,sub,get,set)=>{const r=el('div','tgl2'),t=el('div'),b=el('button','sw'+(get()?' on':''));b.type='button';t.append(el('b','',label),el('small','mu',sub||''));b.append(el('i'));
  b.onclick=async()=>{const v=!get();try{await set(v);b.classList.toggle('on',get())}catch(e){fail(e)}};r.append(t,b);return r};
 const pref=(k,label,sub,after)=>sw(label,sub,()=>PREFS[k],async v=>{PREFS[k]=v;savePrefs();after&&await after(v)});
 const sec=t=>el('h3','ush',t);
 const sel=(k,label,sub,opts,after)=>{const r=el('div','tgl2'),t=el('div'),S=el('select','sel2');t.append(el('b','',label),el('small','mu',sub||''));opts.forEach(([v,n])=>{const o=el('option','',n);o.value=v;S.append(o)});S.value=PREFS[k];S.onchange=()=>{PREFS[k]=S.value;savePrefs();after&&after(S.value)};r.append(t,S);return r};
 const rng=(k,label,sub,min,max,step,fmt)=>{const w=el('div','rng'),h=el('div','rh'),v=el('span','mu',(fmt||(x=>x))(PREFS[k])),i=el('input');i.type='range';i.min=min;i.max=max;i.step=step||1;i.value=PREFS[k];h.append(el('b','',label),v);i.oninput=()=>{PREFS[k]=+i.value;v.textContent=(fmt||(x=>x))(PREFS[k]);savePrefs()};w.append(h);if(sub)w.append(el('small','mu',sub));w.append(i);return w};
 const card=(...n)=>{const c=el('div','card2');c.append(...n);return c};
 const T=[['acct','My Account'],['prof','My Profile'],['priv','Privacy & Safety'],['app','Appearance'],['acc','Accessibility'],['chat','Chat'],['notif','Notifications'],['voice','Voice & Video'],['keys','Keybinds'],['lang','Language & Time'],['stream','Streamer Mode'],['adv','Advanced']];
 const nav=()=>{L.replaceChildren(el('div','eph','User Settings'));T.forEach(([k,n])=>{const b=el('button','usb'+(tab===k?' on':''),n);b.type='button';b.onclick=()=>{if(k==='prof'){kill();editProfile();return}tab=k;nav();draw1()};L.append(b)});L.append(el('div','grow'),btn('Log Out','g wide',()=>{kill();logout()}))};
 const accountPane=()=>{pane.append(el('h2','','My Account'));
   const un=el('input');un.value=me.username;un.maxLength=20;const pw=el('input');pw.type='password';pw.placeholder='Current password';pw.autocomplete='current-password';const f1=field('Username',un),f2=field('Current password',pw);
   const b1=btn('Change Username','',async()=>{f1.err();f2.err();try{const r=await api('account/username','PUT',{username:un.value.trim(),password:pw.value});me.username=r.username;pw.value='';draw();members();load().catch(()=>{});toast('Username updated',1)}catch(e){(/password/i.test(e.message)?f2:f1).err(e.message)}});
   {const c=el('div','card2');c.append(sec('Username'),f1,f2,b1);pane.append(c)}
   const c0=el('input'),c1=el('input');c0.type=c1.type='password';c0.placeholder='Current password';c1.placeholder='New password (8+ characters)';c0.autocomplete='current-password';c1.autocomplete='new-password';const fa=field('Current password',c0),fb=field('New password',c1);
   const b2=btn('Change Password','',async()=>{fa.err();fb.err();try{await api('account/password','PUT',{current:c0.value,next:c1.value});c0.value=c1.value='';toast('Password updated',1)}catch(e){(/current/i.test(e.message)?fa:fb).err(e.message)}});
   const cp=el('div','card2');cp.append(sec('Password'),fa,fb,b2);pane.append(cp);
   const id=el('div','card2');id.append(sec('Your user ID'),el('small','mu','Handy if you ever need to report something to staff.'),btn('Copy User ID','g',()=>{copyTxt(String(me.id));toast('User ID copied',1)}));pane.append(id);
   const dz=el('div','card2 dz'),dp=el('input');dp.type='password';dp.placeholder='Password';dz.append(sec('Delete account'),el('small','mu','Permanently deletes your account, messages and any servers you own. This can\'t be undone.'));
   if(me.role==='admin')dz.append(el('small','mu','The admin account can\'t be deleted here.'));
   else{const fd=field('Confirm with your password',dp);dz.append(fd,btn('Delete My Account','dng',async()=>{if(!dp.value)return fd.err('Enter your password');if(!await askConfirm('Delete your account?','This is permanent and can\'t be undone.',{ok:'Delete Account',danger:1}))return;try{await api('account','DELETE',{password:dp.value});kill();logout()}catch(e){fd.err(e.message)}}))}
   pane.append(dz)};
 const P={
 acct:accountPane,
 priv:()=>{pane.append(el('h2','','Privacy & Safety'));
  pane.append(card(sec('Safe direct messaging'),sel('dmpriv','Scan direct messages','Choose how Hearth filters media in DMs.',[['all','Keep me safe — scan all DMs'],['friends','Scan DMs from non-friends'],['off','Do not scan']]),sel('nsfwfilter','Sensitive media filter','Blur media that may be sensitive.',[['all','Filter all media'],['friends','Filter from non-friends'],['off','Don\'t filter']])),
   card(sec('Social permissions'),sw('Allow friend requests','When off, people can\'t send you new friend requests. Existing friends aren\'t affected.',()=>me.allow_fr!==false,async v=>{await api('account/privacy','PUT',{allow_fr:v});me.allow_fr=v}),
    pref('inviteDM','Allow DMs from server members','Let people in shared servers message you directly.'),
    pref('readrec','Send read receipts','Let others see when you\'ve read their DMs.'),
    pref('showtyping','Show typing indicator','Let others see when you are typing.'),
    pref('activity','Display current activity','Share what you\'re doing as your status.')),
   card(sec('Data'),sel('srvdef','Default notifications for new servers','Applied to servers you join later.',[['all','All messages'],['mentions','Only @mentions']])),
   el('small','mu','Want to appear offline? Pick Invisible from the menu when you click your name at the bottom left.'))},
 app:()=>{pane.append(el('h2','','Appearance'));const fs=el('div','seg');
   [['small','Small'],['normal','Default'],['large','Large']].forEach(([k,n])=>{const b=el('button',PREFS.fs===k?'on':'',n);b.type='button';b.onclick=()=>{PREFS.fs=k;savePrefs();[...fs.children].forEach(z=>z.classList.toggle('on',z===b))};fs.append(b)});
   pane.append(card(sec('Theme'),sel('theme','Color theme','',[['dark','Dark'],['amoled','Darker (AMOLED)'],['light','Light']])),
    card(sec('Message display'),fs,pref('compact','Compact messages','Tighter spacing between messages.'),rng('gap','Space between message groups','',0,32,4,x=>x+'px'),rng('fpx','Chat font scaling','',12,24,1,x=>x+'px'),pref('roleclr','Show role colors in names','Colour display names with their effect colour.')),
    card(sec('Zoom & display'),rng('zoom','Zoom level','Scales the whole app.',75,150,5,x=>x+'%'),rng('sat','Saturation','Lower to reduce colour intensity.',0,100,5,x=>x+'%'),pref('hideSidebar','Compact sidebar','Hide channel list descriptions.')),
    card(sec('Effects'),pref('nofx','Hide profile effects','Don\'t show animated effects on profile cards.'),pref('reduce','Reduce motion','Turns off animations, including profile effects.')),
    el('small','mu','Changes apply instantly and are saved in this browser. Profile looks live under My Profile.'))},
 acc:()=>{pane.append(el('h2','','Accessibility'));
   pane.append(card(sec('Visual'),pref('hc','High contrast','Stronger borders and text contrast.'),pref('underline','Always underline links',''),pref('dyslexic','Dyslexia-friendly spacing','Wider letter and word spacing.'),pref('reduce','Reduce motion','Turns off animations.'),sel('sticky','Play animated emoji, stickers & GIFs','',[['off','Never'],['hover','On hover'],['always','Always']])),
    card(sec('Text-to-speech'),sel('tts','Allow playback and /tts command','',[['off','Never'],['all','For all channels'],['current','For current channel only']])),
    card(sec('Interaction'),pref('confirmLink','Ask before opening external links',''),pref('sendBtn','Show a send button','Adds a send button next to the message box (helpful on touch).')))},
 chat:()=>{pane.append(el('h2','','Chat'));
   pane.append(card(sec('Display'),pref('link_prev','Show website previews','Show a preview for links posted in chat.'),pref('embed','Show embeds & rich links',''),pref('imgprev','Display images from links','Show images that are linked or attached.'),pref('emoji_conv','Convert emoticons',':) becomes 🙂 as you type.'),pref('emoji_hov','Show emoji reactions on hover',''),sel('spoiler','Show spoiler content','',[['click','On click'],['mod','On servers I moderate'],['always','Always']])),
    card(sec('Input'),pref('spell','Spellcheck',''),pref('sugg','Emoji autocomplete',''),pref('autoplay','Play videos and GIFs automatically',''),pref('t24','24-hour time','Show timestamps like 14:30.',()=>load().catch(()=>{}))))},
 notif:()=>{pane.append(el('h2','','Notifications'));
   pane.append(card(sec('Messages'),pref('msgsound','Message sounds','Play a sound for new pings.'),pref('mentionAll','Notify for @everyone and @here',''),pref('dmnotif','Direct message notifications',''),pref('friendnotif','Friend request notifications',''),pref('mutedm','Mute all direct messages','')),
    card(sec('Desktop & taskbar'),pref('sound','Mention sound','Play a short sound when someone pings you. Muted while you\'re on Do Not Disturb.',v=>{if(v)notifyPing({body:'',channel:'x',username:'Hearth'})}),
     pref('desk','Desktop notifications','Show a notification when you\'re pinged and Hearth is in the background.',async v=>{if(!v)return;if(!window.Notification){PREFS.desk=false;savePrefs();throw Error('This browser doesn\'t support notifications.')}
      const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();if(p!=='granted'){PREFS.desk=false;savePrefs();throw Error('Notifications are blocked. Allow them in your browser\'s site settings.')}}),
     pref('showTabPing','Show ping count in the tab title',''),pref('unreadBadge','Show unread indicators',''),pref('flashTaskbar','Flash the tab on pings','')),
    card(sec('Sounds'),pref('callsound','Call & voice join/leave sounds',''),pref('deafsound','Mute/deafen sounds','')),
    el('small','mu','Set Do Not Disturb from the menu when you click your name at the bottom left.'))},
 voice:()=>{pane.append(el('h2','','Voice & Video'));const ins=el('select','sel2'),outs=el('select','sel2'),cams=el('select','sel2');
   const fill=async()=>{try{const d=await navigator.mediaDevices.enumerateDevices();[[ins,'audioinput','inDev'],[outs,'audiooutput','outDev'],[cams,'videoinput','camDev']].forEach(([S,kind,k])=>{S.replaceChildren();const o0=el('option','','Default');o0.value='';S.append(o0);d.filter(x=>x.kind===kind).forEach(x=>{const o=el('option','',x.label||kind);o.value=x.deviceId;S.append(o)});S.value=PREFS[k];S.onchange=()=>{PREFS[k]=S.value;savePrefs()}})}catch{}};fill();
   const dev=(l,S)=>{const r=el('div','tgl2'),t=el('div');t.append(el('b','',l));r.append(t,S);return r};
   pane.append(card(sec('Devices'),dev('Input device',ins),dev('Output device',outs),rng('vol','Output volume','',0,200,5,x=>x+'%'),dev('Camera',cams),btn('Refresh devices','g sm',async()=>{try{(await navigator.mediaDevices.getUserMedia({audio:true})).getTracks().forEach(t=>t.stop())}catch{}fill()})),
    card(sec('Input mode'),sel('mode','Mode','',[['vad','Voice activity'],['ptt','Push to talk']]),rng('sens','Input sensitivity','',0,100,1,x=>x+'%')),
    card(sec('Audio processing'),pref('echo','Echo cancellation',''),pref('noise','Noise suppression',''),pref('agc','Automatic gain control','')))},
 keys:()=>{pane.append(el('h2','','Keybinds'));const K=[['Esc','Close dialogs & menus'],['Enter','Send message'],['Shift + Enter','New line'],['↑','Edit your last message'],['Ctrl/⌘ + K','Quick switcher (if available)'],['@','Mention someone'],[':','Emoji autocomplete'],['/','Slash commands']];
   const c=card(sec('Built-in shortcuts'));K.forEach(([k,d])=>{const r=el('div','tgl2');r.append(el('span','',d),el('kbd','kbd',k));c.append(r)});pane.append(c,card(sec('Push to talk'),pref('pttOn','Enable push-to-talk key','Hold the key to transmit.'),el('small','mu','Push-to-talk key: Space (while in a voice channel).')))},
 lang:()=>{pane.append(el('h2','','Language & Time'));
   pane.append(card(sec('Language'),sel('lang','Language','',[['en-US','English (US)'],['en-GB','English (UK)'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt-BR','Português (Brasil)'],['ja','日本語']])),
    card(sec('Time'),pref('t24','Use 24-hour time','',()=>load().catch(()=>{})),sel('tz','Time zone','',[['auto','Automatic'],['UTC','UTC'],['America/Los_Angeles','Pacific'],['America/New_York','Eastern'],['Europe/London','London'],['Europe/Berlin','Berlin'],['Asia/Tokyo','Tokyo']])))},
 stream:()=>{pane.append(el('h2','','Streamer Mode'));
   pane.append(card(pref('streamer','Enable streamer mode','Hide sensitive info while you\'re streaming or recording.'),sec('When enabled'),pref('sHideInv','Hide invite links & codes',''),pref('sHideInfo','Hide personal information','Hides your user ID and account details.'),pref('sNoSound','Disable sounds',''),pref('sNoNotif','Disable desktop notifications','')))},
 adv:()=>{pane.append(el('h2','','Advanced'));
   pane.append(card(sec('Advanced'),pref('devmode','Developer mode','Shows IDs in context menus.'),pref('hw','Hardware acceleration',''),pref('startMin','Start minimized',''),sel('launchCh','On launch open','',[['last','Last channel'],['home','Home']]),pref('overlay','In-game overlay',''),pref('debug','Show debug logging','')),
    card(sec('Data'),btn('Reset all preferences','dng',async()=>{if(await askConfirm('Reset all preferences?','Every setting in this browser goes back to its default.',{ok:'Reset',danger:1})){try{localStorage.removeItem('hearth.prefs')}catch{}location.reload()}})))}};
 function draw1(){pane.replaceChildren();(P[tab]||P.acct)()}
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
.staffw .dg-b{max-height:70vh;overflow:auto}.sfilters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.sbar{flex:1;min-width:180px;background:#1e1f22;border:0;border-radius:6px;padding:9px 10px;color:#dbdee1;outline:none}.sbar:focus{box-shadow:0 0 0 2px var(--ac)}
.srow2 input[type=checkbox]{width:16px;height:16px;padding:0;flex:none}.slist{display:grid}.srow2{display:flex;align-items:center;gap:10px;padding:9px 6px;border-bottom:1px solid #3f4147;cursor:pointer;justify-content:space-between}.srow2:hover{background:#26272b}.srow2 .sn{flex:1;min-width:0}.srow2 .sn b,.smsg{overflow:hidden;text-overflow:ellipsis}.smsg{display:block;color:#dbdee1;font-size:13px;margin-top:2px;white-space:pre-wrap;word-break:break-word;max-height:3.6em}
.schips{display:flex;gap:4px}.chip{font-size:11px;font-weight:700;padding:1px 7px;border-radius:10px;background:#3f4147}.chip.on{background:#23a55a40;color:#5fdc8c}.chip.stf{background:#5865f240;color:#a5b0ff}.chip.bn{background:#f23f4340;color:#ff8a8d}
.sdetail{background:#1e1f22;border-radius:8px;padding:12px;margin:4px 0 8px;display:grid;gap:10px}.sinfo{display:grid;gap:3px;font-size:13px;color:#b5bac1}.sinfo b{color:#f2f3f5}.sacts{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.pgr{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px}.sbulk{display:flex;gap:8px;align-items:center;margin-bottom:8px}.sbulk:empty{display:none}
.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.scard{background:#1e1f22;border-radius:8px;padding:14px;display:grid;gap:4px}.scard b{font-size:24px;color:#f2f3f5}

.sta{background:#1e1f22;border:0;border-radius:6px;padding:10px;color:#dbdee1;width:100%;min-height:42px;font:inherit}textarea.sta{min-height:90px;resize:vertical}
.sel2{background:#1e1f22;color:#dbdee1;border:0;border-radius:6px;padding:8px 10px;max-width:220px}.rng{display:grid;gap:4px}.rh{display:flex;justify-content:space-between}.rng input{padding:0;height:20px}.kbd{background:#1e1f22;border-radius:4px;padding:3px 8px;font:12px monospace;color:#dbdee1}
.pf-amoled{--bg:#000;--bg2:#000;--bg3:#0b0b0d}.pf-amoled #app,.pf-amoled #rail,.pf-amoled #side{background:#000}.pf-light{filter:invert(1) hue-rotate(180deg)}.pf-light img,.pf-light video,.pf-light .av{filter:invert(1) hue-rotate(180deg)}
.pf-hc *{border-color:#fff8!important}.pf-hc .mu,.pf-hc small{color:#d7d9de!important}.pf-dys .mt,.pf-dys .m{letter-spacing:.06em;word-spacing:.18em;line-height:1.7}.pf-ul .mt a{text-decoration:underline!important}.pf-nolink .emb,.pf-nolink .lp{display:none}.pf-noimg .mt img,.pf-noimg .att{display:none}
.pf-stream .copyrow{filter:blur(6px)}.pf-stream .copyrow:hover{filter:none}#root{filter:saturate(var(--sat,100%))}.mt{font-size:var(--fpx,16px)}.m{margin-top:calc(var(--gap,16px)/2)}

.pf-small .mt{font-size:13px}.pf-large .mt{font-size:17px}.pf-large .nm{font-size:1.05em}.pf-compact .m{margin-top:4px;gap:12px}.pf-compact .m .av{width:32px;height:32px}.pf-compact .m.c{padding-left:60px}
.pf-reduce *,.pf-reduce *::before{animation:none!important;transition:none!important}.pf-nofx .pfx{display:none}
/* server settings + staff panel tabs */
.sstabs{display:flex;gap:4px;margin-bottom:12px;border-bottom:1px solid #3f4147}.sst{background:none;color:#b5bac1;padding:8px 12px;border-radius:6px 6px 0 0;font-weight:600}.sst:hover{color:#fff}.sst.on{color:#fff;box-shadow:inset 0 -2px 0 var(--ac)}
.sspane{display:grid;gap:12px}.modnote{background:#c4491f22;border:1px solid #c4491f66;border-radius:8px;padding:10px 12px;color:#ffd2c2;font-size:13px}
.rb.modrb{position:relative;box-shadow:0 0 0 2px #c4491f}.modmk{position:absolute;right:-4px;bottom:-4px;font-style:normal;font-size:12px;background:#1e1f22;border-radius:50%;width:18px;height:18px;display:grid;place-items:center}
`;document.head.append(s)})();
