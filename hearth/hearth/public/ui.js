// Hearth UI layer. Loaded last; defines the sidebar, dialogs, popouts, profiles, edit-profile and voice.
// Uses globals from app.js / features.js (me, servers, friends, cur, ch, api, el, ic, IC, av, open, refresh, ...).
const SLASH='M2.4 3.8 3.8 2.4 21.6 20.2 20.2 21.6z';
Object.assign(IC,{
 hp:'M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H5v-1a7 7 0 0 1 14 0v1h-2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z',
 hangup:'M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1A15.9 15.9 0 0 0 12 9z',
 down:'M7 10l5 5 5-5z',right:'M10 6 8.6 7.4l4.6 4.6-4.6 4.6L10 18l6-6z',
 addp:'M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
 out:'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
 home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
 at:'M12 2a10 10 0 1 0 5 18.66l-1-1.73A8 8 0 1 1 20 12v1.5a1.5 1.5 0 0 1-3 0V12a5 5 0 1 0-1.46 3.54A3.5 3.5 0 0 0 22 13.5V12A10 10 0 0 0 12 2zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
 id:'M3 5v14h18V5H3zm7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 8H6v-1c0-1.3 2.7-2 4-2s4 .7 4 2v1zm5-2h-4v-2h4v2zm0-3h-4V9h4v2z'});
IC.micoff=IC.mic+SLASH;IC.hpoff=IC.hp+SLASH;

const STAT={online:'Online',idle:'Idle',dnd:'Do Not Disturb',invisible:'Invisible'};
const stc=s=>s==='online'?' on':s==='idle'?' idle':s==='dnd'?' dnd':'';
const myPs=()=>me.status==='invisible'?'offline':(me.status||'online');
const BDESC={staff:'Part of the Hearth staff team.',og:'One of the very first people here.',early:'Joined during early access.',verified:'A verified account.',supporter:'Helps keep Hearth running.'};
Object.keys(BD).forEach(k=>{BDESC[k]=BD[k].d});
const btn=(t,cls,fn)=>{const b=el('button','btn'+(cls?' '+cls:''),t);b.type='button';if(fn)b.onclick=fn;return b};
const initials=n=>[...n.trim()][0].toUpperCase();
const goHome=()=>{cur='home';open(null,'');members()};
function goServer(id){const s=servers.find(x=>x.id===id);if(!s)return;cur=id;const f=s.channels.find(c=>c.kind==='text');open(f?'c'+f.id:null,f?'# '+f.name:'');members()}
const memberSince=d=>new Date(d).toLocaleDateString([],{month:'long',day:'numeric',year:'numeric'});

// ---------- toasts ----------
function toast(m,ok){let h=$('#toasts');if(!h){h=el('div');h.id='toasts';document.body.append(h)}const t=el('div','toast'+(ok?' ok':''),m);h.append(t);setTimeout(()=>t.remove(),4200)}

// ---------- dialogs ----------
function dialog(width){const ov=el('div','ov'),box=el('div','dg'),h=el('div','dg-h'),b=el('div','dg-b'),f=el('div','dg-f'),x=ib(IC.x,'Close',()=>D.close(),20);
 x.classList.add('dg-x');if(width)box.style.width=width;
 const esc=e=>{if(e.key==='Escape'&&ov===[...document.querySelectorAll('.ov')].pop())D.close()};
 const under=[...document.querySelectorAll('.ov,.ep,.nsw')].filter(n=>!n.inert);under.forEach(n=>n.inert=true);
 const D={ov,box,body:b,foot:f,set(t,s){h.replaceChildren(el('h2','',t));if(s)h.append(el('p','',s));b.replaceChildren();f.replaceChildren();f.style.display=''},close(){if(!ov.isConnected)return;ov.remove();under.forEach(n=>n.inert=false);removeEventListener('keydown',esc)}};
 addEventListener('keydown',esc);ov.onmousedown=e=>{if(e.target===ov)D.close()};box.append(x,h,b,f);ov.append(box);document.body.append(ov);return D}
function field(label,input,hint){const w=el('div','fld'),l=el('label','',label),e=el('div','er');w.append(l,input);if(hint)w.append(el('small','mu',hint));w.append(e);w.err=m=>{e.textContent=m||''};return w}
const opt=(icon,title,sub,fn)=>{const r=el('button','opt'),i=el('span','oi'),t=el('span','ot');r.type='button';i.append(ic(icon,22));t.append(el('b','',title));if(sub)t.append(el('small','',sub));r.append(i,t,ic(IC.right,18));r.onclick=fn;return r};

function addServerDialog(){const D=dialog();
 const start=()=>{D.set('Create a server','Your server is where you and your friends hang out. Make yours and start talking.');
  const j=btn('Join a Server','sec wide',joinStep);D.body.append(opt(IC.home,'Create My Own','Start fresh with a text and a voice channel',create),el('div','dsep','Have an invite already?'),j);D.foot.style.display='none'};
 const create=()=>{D.set('Customize your server','Give your new server a name. You can always invite people after.');
  const i=el('input');i.value=(me.username+"'s server").slice(0,30);i.maxLength=30;const f=field('Server name',i);D.body.append(f);
  const go=btn('Create','',async()=>{go.disabled=true;f.err();try{const r=await api('servers','POST',{name:i.value});await refresh();D.close();goServer(r.id)}catch(e){f.err(e.message);go.disabled=false}});
  i.onkeydown=e=>{if(e.key==='Enter')go.click()};D.foot.append(btn('Back','lnk',start),go);i.focus();i.select()};
 const joinStep=()=>{D.set('Join a server','Enter an invite code below to join an existing server.');
  const i=el('input');i.placeholder='e.g. 4f9a1c2b7d';const f=field('Invite code',i);D.body.append(f);
  const go=btn('Join Server','',async()=>{const code=i.value.trim().split('/').pop();if(!code)return f.err('Enter an invite code');go.disabled=true;f.err();
   try{const r=await api('join','POST',{code});await refresh();D.close();goServer(r.id)}catch(e){f.err(e.message);go.disabled=false}});
  i.onkeydown=e=>{if(e.key==='Enter')go.click()};D.foot.append(btn('Back','lnk',start),go);i.focus()};
 start()}

function channelDialog(s,kind='text'){const D=dialog();D.set('Create channel','in '+s.name);let k=kind;
 const rows=el('div','radios'),mk=(key,icon,t,sub)=>{const r=el('button','opt rad'+(k===key?' on':''));r.type='button';const i=el('span','oi'),x=el('span','ot');i.append(ic(icon,22));x.append(el('b','',t),el('small','',sub));
  const dot=el('span','rdot');r.append(i,x,dot);r.onclick=()=>{k=key;[...rows.children].forEach(c=>c.classList.toggle('on',c===r))};rows.append(r)};
 mk('text',IC.hash,'Text','Send messages, emoji and reactions');mk('voice',IC.spk,'Voice','Hang out together with voice');
 const i=el('input');i.placeholder='new-channel';i.maxLength=20;const f=field('Channel name',i);D.body.append(rows,f);
 const go=btn('Create Channel','',async()=>{go.disabled=true;f.err();try{await api('channels','POST',{server_id:s.id,name:i.value.trim().replace(/\s+/g,'-'),kind:k});await refresh();D.close()}catch(e){f.err(e.message);go.disabled=false}});
 i.onkeydown=e=>{if(e.key==='Enter')go.click()};D.foot.append(btn('Cancel','lnk',D.close),go);i.focus()}

function inviteDialog(s){const D=dialog();D.set('Invite friends to '+s.name,'Share this code. Friends can paste it under Add a Server → Join a Server.');
 const i=el('input'),row=el('div','copyrow'),b=btn('Copy','',()=>{copyTxt(s.invite);b.textContent='Copied';b.classList.add('ok');setTimeout(()=>{b.textContent='Copy';b.classList.remove('ok')},1800)});
 i.value=s.invite;i.readOnly=true;i.onfocus=()=>i.select();row.append(i,b);D.body.append(field('Server invite code',row));D.foot.style.display='none'}

function addFriendDialog(){const D=dialog();D.set('Add friend','You can add friends with their Hearth username.');
 const i=el('input');i.placeholder='Enter a username';const f=field('Username',i),ok=el('div','okm');D.body.append(f,ok);
 const go=btn('Send Friend Request','',async()=>{const n=i.value.trim();if(!n)return;go.disabled=true;f.err();ok.textContent='';
  try{await api('friends','POST',{username:n});ok.textContent='Success! Your friend request to '+n+' was sent.';i.value='';await refresh()}catch(e){f.err(e.message)}go.disabled=false});
 i.onkeydown=e=>{if(e.key==='Enter')go.click()};D.foot.append(btn('Close','lnk',D.close),go);i.focus()}

function serverMenu(s,anchor){const r=anchor.getBoundingClientRect(),it=[['Invite People',()=>inviteDialog(s),{ic:IC.addp}]],mg=s.owner_id===me.id||isStaff();
 if(mg)it.push(['Server Settings',()=>serverSettings(s.id),{ic:IC.gear}],['Create Channel',()=>channelDialog(s),{ic:IC.plus}],['Server Tag',()=>tagDialog(s),{ic:IC.shield}]);
 if(s.is_mod)it.push('sep',['Stop Moderating',()=>stopMod(s),{danger:1,ic:IC.out}]);
 else if(s.owner_id!==me.id)it.push('sep',['Leave Server',()=>leaveDialog(s),{danger:1,ic:IC.out}]);
 ctxOpen(r.left+8,r.bottom+2,it)}
async function stopMod(s){try{if(room&&room.server_id===s.id)vleave();await api('staff/moderate','POST',{id:s.id,on:false});await refresh();if(cur===s.id)goHome()}catch(e){fail(e)}}

// ---------- server settings (owner, or staff with admin access) ----------
function serverSettings(sid,tab='ov'){const D=dialog('640px');D.box.classList.add('wide');D.foot.style.display='none';const S=()=>servers.find(x=>x.id===sid);if(!S())return D.close();
 const tabs=el('div','sstabs'),pane=el('div','sspane');D.body.append(tabs,pane);
 const T=[['ov','Overview'],['nt','Notifications'],['md','Moderation'],['cm','Community'],['ch','Channels'],['mb','Members'],['dz','Danger Zone']],go=k=>{tab=k;draw1()};
 const run=async(fn,msg)=>{try{await fn();await refresh();msg&&toast(msg,1);draw1()}catch(e){fail(e)}};
 function draw1(){const s=S();if(!s){D.close();return}D.set('Server Settings',s.name);D.body.append(tabs,pane);D.foot.style.display='none';tabs.replaceChildren();T.forEach(([k,n])=>{const b=el('button','sst'+(tab===k?' on':''),n);b.type='button';b.onclick=()=>go(k);tabs.append(b)});pane.replaceChildren();
  if(s.is_mod||(s.owner_id!==me.id&&isStaff()))pane.append(el('div','modnote','🛡 Staff access — you have full admin control here. Members can\'t see you in the member list.'));
  if(['ov','nt','md','cm'].includes(tab)){const ST=s.settings||{},save=async(o,m)=>{try{await api('servers/'+s.id+'/settings','PUT',o);Object.assign(s.settings=s.settings||{},o);m&&toast(m,1)}catch(e){fail(e)}},
    tg2=(k,l,sub,def)=>{const r=el('div','tgl2'),t=el('div'),b=el('button','sw'+((k in ST?ST[k]:def)?' on':''));b.type='button';t.append(el('b','',l),el('small','mu',sub||''));b.append(el('i'));b.onclick=()=>{const v=!b.classList.contains('on');b.classList.toggle('on',v);save({[k]:v})};r.append(t,b);return r},
    sl=(k,l,sub,opts,def)=>{const r=el('div','tgl2'),t=el('div'),S=el('select','sel2');t.append(el('b','',l),el('small','mu',sub||''));opts.forEach(([v,n])=>{const o=el('option','',n);o.value=v;S.append(o)});S.value=String(k in ST?ST[k]:def);S.onchange=()=>save({[k]:S.value});r.append(t,S);return r},
    tx=(k,l,max,area)=>{const i=el(area?'textarea':'input','sta');i.value=ST[k]||'';i.maxLength=max;i.onchange=()=>save({[k]:i.value},'Saved');return field(l,i)},
    card=(...n)=>{const c=el('div','card2');c.append(...n);return c},nv=k=>PREFS[k];
   if(tab==='nt'){const key='hearth.sn.'+s.id;let sn={};try{sn=JSON.parse(localStorage.getItem(key)||'{}')}catch{}const ss=(o)=>{Object.assign(sn,o);try{localStorage.setItem(key,JSON.stringify(sn))}catch{}},
     lt=(k,l,sub)=>{const r=el('div','tgl2'),t=el('div'),b=el('button','sw'+(sn[k]?' on':''));b.type='button';t.append(el('b','',l),el('small','mu',sub||''));b.append(el('i'));b.onclick=()=>{const v=!b.classList.contains('on');b.classList.toggle('on',v);ss({[k]:v})};r.append(t,b);return r},
     ls=(k,l,sub,opts)=>{const r=el('div','tgl2'),t=el('div'),S=el('select','sel2');t.append(el('b','',l),el('small','mu',sub||''));opts.forEach(([v,n])=>{const o=el('option','',n);o.value=v;S.append(o)});S.value=sn[k]||opts[0][0];S.onchange=()=>ss({[k]:S.value});r.append(t,S);return r};
    pane.append(el('small','mu','These are your own notification settings for this server and are saved in this browser.'),
     card(el('h3','ush','Server notification settings'),ls('lvl','Notify me for','',[['all','All messages'],['mentions','Only @mentions'],['none','Nothing']]),lt('muted','Mute server','Silences all notifications from this server.'),lt('noeveryone','Suppress @everyone and @here',''),lt('noroles','Suppress all role @mentions',''),lt('nohigh','Suppress highlights',''),lt('mobile','Mobile push notifications','')),
     card(el('h3','ush','Hide'),lt('hidemuted','Hide muted channels','Muted channels disappear from the channel list.')))}
   if(tab==='ov'){const i=el('input');i.value=s.name;i.maxLength=30;const f=field('Server name',i),sv=btn('Save Name','',async()=>{f.err();try{await api('servers/'+s.id,'PUT',{name:i.value});await refresh();toast('Server renamed',1);draw1()}catch(e){f.err(e.message)}});
    const code=el('input');code.value=s.invite;code.readOnly=true;code.onfocus=()=>code.select();const row=el('div','copyrow');row.append(code,btn('Copy','',()=>{copyTxt(s.invite);toast('Invite copied',1)}),btn('New code','g',()=>run(async()=>{await api('servers/'+s.id+'/invite','POST')},'Invite code reset — the old one no longer works')));
    const tg=el('div','trow');tg.append(tagChip(s.tag?{tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color}:null)||el('span','mu','No tag set'),btn(s.tag?'Edit Tag':'Create Tag','g',()=>tagDialog(s,draw1)));
    const sc=el('input');sc.type='color';sc.value=ST.color||'#5865f2';sc.onchange=()=>save({color:sc.value},'Saved');
    pane.append(f,sv,iconRow(s,draw1),field('Invite code',row),field('Server tag',tg),tx('desc','Server description',300,1),field('Accent color',sc),
     card(el('h3','ush','System messages channel'),sl('sysch','Send system messages to','',[['','No system messages'],...s.channels.filter(c=>c.kind!=='voice').map(c=>[String(c.id),'#'+c.name])],''),tg2('sysjoin','Send a welcome message when someone joins','',true),tg2('sysboost','Send a message when someone boosts','',true),tg2('systips','Send helpful tips for server setup','',true)),
     card(el('h3','ush','Inactive'),sl('afk','Inactive timeout','Move idle voice users after this long.',[[60,'1 minute'],[300,'5 minutes'],[900,'15 minutes'],[1800,'30 minutes'],[3600,'1 hour']],300)),
     card(el('h3','ush','Preferred locale'),sl('lang','Server language','',[['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['ja','日本語']],'en')),
     card(tg2('boost_bar','Show boost progress bar','',false)))}
   if(tab==='md'){pane.append(card(el('h3','ush','Verification level'),sl('verif','Members must meet this before they can chat','',[['none','None — unrestricted'],['low','Low — verified account'],['medium','Medium — registered 5+ minutes'],['high','High — member for 10+ minutes']],'none')),
     card(el('h3','ush','Explicit media content filter'),sl('filter','Scan media sent in this server','',[['off','Don\'t scan any media'],['nomembers','Scan media from members without roles'],['all','Scan media from all members']],'off')),
     card(el('h3','ush','Channel safety'),sl('slow','Default slowmode','Seconds between messages per member.',[[0,'Off'],[5,'5 seconds'],[10,'10 seconds'],[30,'30 seconds'],[60,'1 minute'],[300,'5 minutes']],0),tg2('nsfw','Age-restricted server','Mark this server as 18+.',false),tg2('inv_pause','Pause invites','Stop new members joining with the invite code.',false)))}
   if(tab==='cm'){pane.append(card(el('h3','ush','Community'),tg2('community','Enable Community','Unlock discovery-style features: rules, welcome, announcements.',false),sl('notif','Default notification settings','For new members.',[['all','All messages'],['mentions','Only @mentions']],'all')),tx('rules','Server rules',1000,1),el('small','mu','Server settings above are saved for the whole server. Enforcement of verification, filters and slowmode needs server-side hooks; the values are stored and ready for them.'))}
  }
  if(tab==='ch'){pane.append(btn('+ Create Channel','',()=>channelDialog(s)));s.channels.forEach(c=>{const r=el('div','srow'),n=el('div','sn');n.append(ic(c.kind==='voice'?IC.spk:IC.hash,18),el('b','',c.name));const a=el('div','sa');
    a.append(btn('Rename','g sm',()=>{const D2=dialog();D2.set('Rename channel',c.name);const i=el('input');i.value=c.name;i.maxLength=20;const f=field('Channel name',i);D2.body.append(f);
      const ok=btn('Save','',async()=>{f.err();try{await api('channels/'+c.id,'PUT',{name:i.value.trim().replace(/\s+/g,'-')});await refresh();D2.close();draw1()}catch(e){f.err(e.message)}});i.onkeydown=e=>{if(e.key==='Enter')ok.click()};D2.foot.append(btn('Cancel','lnk',D2.close),ok);i.focus()}),
     btn('Delete','dng sm',async()=>{if(await askConfirm('Delete #'+c.name+'?','The channel and all its messages will be gone for good.',{ok:'Delete Channel',danger:1}))run(async()=>{await api('channels/'+c.id,'DELETE');if(ch==='c'+c.id)open(null,'')},'Channel deleted')}));r.append(n,a);pane.append(r)})}
  if(tab==='mb'){pane.append(el('small','mu','Loading…'));api('members/'+s.id).then(l=>{if(tab!=='mb')return;pane.replaceChildren();l.forEach(m=>{const r=el('div','srow'),n=el('div','sn');n.append(el('b','',dn(m)),el('small','mu',m.username+(m.id===s.owner_id?' · owner':['staff','admin'].includes(m.role)?' · staff':'')));const a=el('div','sa');
     if(m.id!==s.owner_id&&!['staff','admin'].includes(m.role)&&m.id!==me.id)a.append(btn('Remove','dng sm',async()=>{if(await askConfirm('Remove '+m.username+'?','They can rejoin with an invite.',{ok:'Remove',danger:1}))run(()=>api('servers/'+s.id+'/members/'+m.id,'DELETE'),m.username+' removed')}));r.append(n,a);pane.append(r)})}).catch(fail)}
  if(tab==='dz'){pane.append(el('p','mu','Deleting a server permanently removes all of its channels and messages. This can\'t be undone.'));
   if(s.invite==='hearth')pane.append(el('p','mu','The default Hearth Lounge can\'t be deleted.'));
   else pane.append(btn('Delete Server','dng',async()=>{const t=await askText('Delete '+s.name,'This can\'t be undone. Type the server name to confirm.','',{label:'Server name',ok:'Delete Server',danger:1});if(t===s.name)run(async()=>{await api('servers/'+s.id,'DELETE');if(cur===s.id)goHome()},'Server deleted');else if(t!=null)toast('Name didn\'t match — nothing was deleted')}))}}
 draw1()}

function leaveDialog(s){const D=dialog();D.set('Leave '+s.name,'Are you sure you want to leave? You\'ll need a new invite code to rejoin.');D.body.style.display='none';
 const go=btn('Leave Server','dng',async()=>{go.disabled=true;try{if(room&&room.server_id===s.id)vleave();await api('servers/'+s.id+'/leave','DELETE');D.close();await refresh();if(cur===s.id)goHome()}catch(e){go.disabled=false;fail(e)}});
 D.foot.append(btn('Cancel','lnk',D.close),go)}

// ---------- popouts ----------
let popEl=null;
function popClose(){if(popEl){popEl.remove();popEl=null;document.removeEventListener('mousedown',popOut,true);document.removeEventListener('keydown',popKey,true)}}
const popOut=e=>{if(popEl&&!popEl.contains(e.target)&&!e.target.closest('#ctx,.ov'))popClose()},popKey=e=>{if(e.key==='Escape')popClose()};
function popout(rect,mode,node){popClose();const p=el('div','po');p.append(node);document.body.append(p);popEl=p;const w=p.offsetWidth,h=p.offsetHeight;let x,y;
 if(mode==='top'){x=rect.left;p.style.bottom=Math.max(8,innerHeight-rect.top+8)+'px'}
 else{x=rect.right+8;if(x+w>innerWidth-8)x=rect.left-w-8;y=Math.max(8,Math.min(rect.top,innerHeight-h-8));p.style.top=y+'px'}
 p.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+'px';
 setTimeout(()=>{document.addEventListener('mousedown',popOut,true);document.addEventListener('keydown',popKey,true)},0);return p}

// ---------- profile card (popout, full profile and the edit-profile preview all share this) ----------
const sdot=s=>{const k=s||'offline',e=el('i','sd sdi '+k),P={online:'<circle cx="8" cy="8" r="6" fill="#23a55a"/>',idle:'<path d="M13.3 9.6A5.6 5.6 0 0 1 6.4 2.7a5.6 5.6 0 1 0 6.9 6.9z" fill="#f0b232"/>',dnd:'<circle cx="8" cy="8" r="6.5" fill="#f23f43"/><rect x="4.2" y="6.7" width="7.6" height="2.6" rx="1.3" fill="#1e1f22"/>',invisible:'<circle cx="8" cy="8" r="5" fill="none" stroke="#80848e" stroke-width="2.6"/>'};
 e.innerHTML='<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">'+(P[k]||P.invisible)+'</svg>';return e};
function pcard(u,o={}){const t=THEMES[u.theme]||THEMES.midnight,c=el('div','pcd'+(o.big?' big':'')),bh=o.big?(u.hb?140:96):(u.hb?105:60),bn=el('div','pbn'),pav=el('div','pav'),w=el('div','st'+stc(u.ps));
 const g1=u.pc1||t[0],g2=u.pc2||t[1];c.style.setProperty('--bh',bh+'px');c.style.setProperty('--pa',g1);c.classList.add('pct');c.style.overflow='hidden';bn.style.height=bh+'px';c.style.setProperty('--pb',g2);bn.style.background=u.hb?`url(/api/banner/${u.id}?v=${AV}) center/cover`:'transparent';
 w.append(av(u.id,u.username,u.theme,u.adeco||'none'));pav.append(w);c.append(bn,pav);
 if(u.cstatus){const b=el('div','sbub');b.append(rich(u.cstatus));c.append(b)}
 const body=el('div','pbody'),nm=el('div','pnm'),nn=el('span','',dn(u));nameFx(nn,u,'#f2f3f5');nm.append(nn);const tg=tagChip(u.tg);tg&&nm.append(tg);body.append(nm);
 const sub=[u.dname&&u.dname!==u.username?u.username:'',u.pronouns||''].filter(Boolean);if(sub.length){const s=el('div','pun');s.textContent=sub.join(' • ');body.append(s)}
 if((u.badges||[]).length){const bs=el('div','pbs');u.badges.forEach(k=>BADGES[k]&&bs.append(badge(k)));body.append(bs)}
 const box=el('div','pbox');
 if(u.bio||o.big){box.append(el('h4','','About Me'));const b=el('div','pbio');b.append(rich(u.bio||'This user hasn\'t written a bio yet.'));if(!u.bio)b.classList.add('mu');box.append(b)}
 box.append(el('h4','','Member Since'),el('div','pms',u.created?memberSince(u.created):'—'));body.append(box);c.append(body);const fx=pfx(u.peffect);fx&&c.append(fx);return c}

function profActions(u,box,o={}){const add=(t,cls,fn)=>{const b=btn(t,cls,fn);box.append(b);return b},done=()=>o.reload?o.reload():(popClose(),refresh());
 if(u.id===me.id){add('Edit Profile','',()=>{popClose();closeFull();editProfile()});if(o.pop)add('View Full Profile','g',()=>{popClose();fullProfile(u.id)});return}
 const f=u.friend;
 add('Message','',()=>{popClose();closeFull();openDM(u)});
 if(f&&f.status==='ok'){}
 else if(!f)add('Add Friend','',()=>api('friends','POST',{username:u.username}).then(()=>{toast('Friend request sent to '+u.username,1);done()}).catch(fail));
 else if(f.by!==me.id)add('Accept Request','',()=>api('friends/accept','POST',{id:u.id}).then(done).catch(fail));
 else add('Request Sent','g').disabled=true;
 if(o.pop)add('View Full Profile','g',()=>{popClose();fullProfile(u.id)});
 else if(f)add(f.status==='ok'?'Remove Friend':'Cancel Request','g',()=>api('friends/'+u.id,'DELETE').then(done).catch(fail))}

async function profile(id,ev){const src=ev&&ev.currentTarget,rect=src&&src.getBoundingClientRect?src.getBoundingClientRect():null;let u;
 try{u=await api('user/'+id)}catch(e){return fail(e)}
 if(!rect)return fullProfile(id,u);
 const card=pcard(u),act=el('div','pact');profActions(u,act,{pop:true});card.append(act);popout(rect,'side',card)}

let fullKey=null;
function closeFull(){const o=$('.fpov');if(o)o.remove();if(fullKey){removeEventListener('keydown',fullKey);fullKey=null}}
async function fullProfile(id,u){try{u=u||await api('user/'+id)}catch(e){return fail(e)}
 let mu={servers:[],friends:[]};try{mu=await api('user/'+id+'/mutual')}catch{}
 closeFull();popClose();const ov=el('div','ov fpov'),box=el('div','fp'),L=el('div','fpl'),R=el('div','fpr'),x=ib(IC.x,'Close',closeFull,20),own=id===me.id;x.classList.add('dg-x');
 const card=pcard(u,{big:true}),act=el('div','pact');profActions(u,act,{reload:()=>fullProfile(id)});card.append(act);L.append(card);
 const tabs=el('div','fpt'),list=el('div','fpb'),T=[[own?'Your Servers':'Mutual Servers',mu.servers],[own?'Your Friends':'Mutual Friends',mu.friends]];
 const show=k=>{[...tabs.children].forEach((b,j)=>b.classList.toggle('on',j===k));list.replaceChildren();const a=T[k][1];
  if(!a.length){list.append(el('div','fpe',k?(own?'You haven\'t added any friends yet.':'No friends in common.'):(own?'You haven\'t joined any servers.':'No servers in common.')));return}
  a.forEach(i=>{const r=el('div','fpr2');if(k){const w=el('div','st');w.append(av(i.id,i.username,i.theme));r.append(w,el('span','',i.username));r.onclick=()=>fullProfile(i.id)}
   else{const g=el('div','sic',initials(i.name));r.append(g,el('span','',i.name));r.onclick=()=>{closeFull();goServer(i.id)}}list.append(r)})};
 T.forEach(([n,a],k)=>{const b=el('button','fpt1');b.type='button';b.append(n,el('span','cnt',String(a.length)));b.onclick=()=>show(k);tabs.append(b)});show(0);
 R.append(tabs,list);box.append(L,R,x);ov.append(box);ov.onmousedown=e=>{if(e.target===ov)closeFull()};document.body.append(ov);
 fullKey=e=>{if(e.key==='Escape'&&ov===[...document.querySelectorAll('.ov')].pop())closeFull()};addEventListener('keydown',fullKey)}

// ---------- your own menu (click yourself, bottom left) ----------
async function selfPop(anchor){let u;try{u=await api('user/'+me.id)}catch(e){return fail(e)}const rect=anchor.getBoundingClientRect();
 const wrap=el('div'),menu=el('div','pmenu'),card=pcard({...u,ps:myPs()});wrap.append(card,menu);
 const row=(icon,label,fn,o={})=>{const r=el('div','pmi'+(o.dng?' dng':'')),l=el('span','pml');if(typeof icon==='string')r.append(ic(icon,18));else r.append(icon);l.append(label);r.append(l);if(o.chev){const c=ic(IC.right,16);c.classList.add('pch');r.append(c)}r.onclick=fn;return r};
 const setS=(s,t)=>api('status','PUT',{status:s,text:t}).then(()=>{me.status=s;me.cstatus=t;popClose();draw()}).catch(fail);
 // status picker
 const sr=row(sdot(me.status||'online'),STAT[me.status||'online'],()=>{sl.classList.toggle('open');sr.classList.toggle('open')},{chev:1}),sl=el('div','psub');
 Object.entries(STAT).forEach(([k,n])=>{const r=row(sdot(k),n,()=>setS(k,me.cstatus||''));r.classList.add('so');if(k===(me.status||'online'))r.classList.add('cur');sl.append(r)});
 // custom status
 const cr=row(IC.smile,me.cstatus?'Edit Custom Status':'Set Custom Status',()=>{cs.classList.toggle('open');cs.querySelector('input').focus()}),cs=el('div','psub cstat'),inp=el('input'),sv=btn('Save','sm',()=>setS(me.status||'online',inp.value.trim())),cl=btn('Clear','g sm',()=>setS(me.status||'online',''));
 inp.maxLength=60;inp.value=me.cstatus||'';inp.placeholder='What\'s on your mind?';inp.onkeydown=e=>{if(e.key==='Enter')sv.click()};cs.append(inp,sv,cl);
 menu.append(row(IC.edit,'Edit Profile',()=>{popClose();editProfile()}),row(IC.gear,'User Settings',()=>{popClose();settings()}),el('div','psep'),sr,sl,cr,cs,el('div','psep'),
  row(IC.shield,'Badges',()=>{popClose();badgesDialog()}),...(isStaff()?[row(IC.users,'Staff Panel',()=>{popClose();staffPanel()})]:[]),row(IC.id,'Copy User ID',()=>{copyTxt(String(me.id));toast('User ID copied',1);popClose()}),el('div','psep'),
  row(IC.out,'Log Out',()=>{popClose();logout()},{dng:1}));
 popout(rect,'top',wrap)}
function badgesDialog(){const D=dialog();D.set('Your badges');D.foot.style.display='none';const l=el('div','blist');
 if(!(me.badges||[]).length)l.append(el('div','fpe','You don\'t have any badges yet.'));
 (me.badges||[]).forEach(k=>{if(!BADGES[k])return;const r=el('div','bl');r.append(badge(k,1),el('span','mu',(BD[k]||{}).d||''));l.append(r)});D.body.append(l)}
async function logout(){await api('logout','POST').catch(()=>{});const x=ws;me=null;vcleanup();vrooms={};x&&x.close();popClose();closeFull();const e=$('.ep');e&&e.remove();authView()}

// ---------- edit profile (full screen, live preview) ----------
function settings(t){return userSettings(t)}
async function editProfile(){let u;try{u=await api('user/'+me.id)}catch(e){return fail(e)}popClose();const old=$('.ep');old&&old.remove();
 const d={bio:u.bio||'',theme:me.theme,dname:u.dname||'',pronouns:u.pronouns||'',peffect:u.peffect||'none',pc1:u.pc1||null,pc2:u.pc2||null,adeco:u.adeco||'none',tag:u.tg?u.tg.id:null},orig={...d},dirty=()=>Object.keys(d).some(k=>d[k]!==orig[k]);
 const ov=el('div','ep'),L=el('div','epl'),R=el('div','epr'),prev=el('div','epp'),bar=el('div','ubar'),x=ib(IC.x,'Close (Esc)',()=>tryClose(),22);x.classList.add('epx');
 const tile=(t,...kids)=>{const w=el('section','tile'),c=el('div','tilec');c.append(...kids);w.append(el('h3','',t),c);return w};
 const fld=(lab,inp)=>{const w=el('div','fld'),l=el('label','',lab);w.append(l,inp);return w};
 // avatar
 const ap=el('div','tav'),apaint=()=>{ap.replaceChildren(av(me.id,me.username,d.theme,d.adeco))};
 const rowA=el('div','trow');rowA.append(ap,btn('Change Avatar','',()=>pickImg('avatar')),btn('Remove','g',async()=>{try{await api('avatar','DELETE');AV=Date.now();draw();load();members();apaint();paint()}catch(e){fail(e)}}));
 // display name + pronouns
 const dni=el('input'),pri=el('input'),dc=el('div','cnt2');dni.maxLength=32;dni.placeholder=me.username;dni.value=d.dname;pri.maxLength=30;pri.placeholder='e.g. she/her, they/them';pri.value=d.pronouns;
 const dcnt=()=>dc.textContent='Pronouns: '+(30-d.pronouns.length)+' characters left';dcnt();
 dni.oninput=()=>{d.dname=dni.value;paint()};pri.oninput=()=>{d.pronouns=pri.value;dcnt();paint()};
 // name style
 const ns=el('button','nsb'),nspaint=()=>{ns.replaceChildren();const n=el('span','',d.dname||me.username);nameFx(n,me,'#f2f3f5');ns.append(n,ic(IC.right,18))};ns.type='button';ns.onclick=nameStyleModal;
 // theme presets + custom colors + banner
 const th=el('div','tsw'),tpaint=()=>{th.replaceChildren();Object.entries(THEMES).forEach(([k,t])=>{const s=el('button','th'+(d.theme===k&&!d.pc1?' on':''));s.type='button';s.style.background=`linear-gradient(135deg,${t[0]},${t[1]})`;s.title=k[0].toUpperCase()+k.slice(1);s.onclick=()=>{d.theme=k;d.pc1=d.pc2=null;c1.value=t[0];c2.value=t[1];tpaint();apaint();paint()};th.append(s)})};
 const c1=el('input'),c2=el('input'),cr=el('div','cr');c1.type=c2.type='color';c1.value=d.pc1||(THEMES[d.theme]||THEMES.midnight)[0];c2.value=d.pc2||(THEMES[d.theme]||THEMES.midnight)[1];
 const cset=()=>{d.pc1=c1.value;d.pc2=c2.value;tpaint();paint()};c1.oninput=c2.oninput=cset;cr.append(c1,c2,el('span','','Custom profile colors'),btn('Reset','g sm',()=>{d.pc1=d.pc2=null;c1.value=(THEMES[d.theme]||THEMES.midnight)[0];c2.value=(THEMES[d.theme]||THEMES.midnight)[1];tpaint();paint()}));
 const rowB=el('div','trow');rowB.append(btn('Change Banner','',()=>pickImg('banner')),btn('Remove','g',async()=>{try{await api('banner','DELETE');u.hb=false;AV=Date.now();paint();load();members()}catch(e){fail(e)}}));
 // profile effects
 const eg=el('div','efg'),epaint=()=>{eg.replaceChildren();PEFFECTS.forEach(([k,l])=>{const b=el('button','efb'+(d.peffect===k?' on':''));b.type='button';const f=pfx(k);f&&b.append(f);b.append(el('span','',l));b.onclick=()=>{d.peffect=k;epaint();paint()};eg.append(b)})};
 // server tag
 const tg=el('div','tgl'),tpick=()=>{tg.replaceChildren();const row=(id,lab,tgd,own)=>{const r=el('div','tgr'+(d.tag===id?' on':''));r.append(tagChip(tgd)||el('span','mu','—'),el('span','grow',lab));r.onclick=()=>{d.tag=id;tpick();paint()};tg.append(r)};
  row(null,'No server tag',null);servers.filter(s=>s.tag).forEach(s=>row(s.id,s.name,{tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color}));
  servers.filter(s=>s.owner_id===me.id).forEach(s=>tg.append(btn((s.tag?'Edit tag for ':'Create a tag for ')+s.name,'g sm',()=>tagDialog(s,()=>{tpick();paint()}))));
  if(!servers.some(s=>s.tag))tg.append(el('div','cnt2','None of your servers have a tag yet. Server owners can create one.'))};
 // avatar decorations
 const dg=el('div','dgrid'),dpaint=()=>{dg.replaceChildren();DECO_LIST.forEach(([k,l])=>{const b=el('button','dtile'+(d.adeco===k?' on':''));b.type='button';b.title=l;const a=av(me.id,me.username,d.theme,k);b.append(a,el('span','',l));b.onclick=()=>{d.adeco=k;dpaint();apaint();paint()};dg.append(b)})};
 // bio
 const ta=el('textarea'),cnt=el('div','cnt2');ta.value=d.bio;ta.maxLength=190;ta.placeholder='Tell people a little about yourself';ta.rows=4;
 ta.oninput=()=>{d.bio=ta.value;cnt.textContent=(190-d.bio.length)+' characters left';paint()};cnt.textContent=(190-d.bio.length)+' characters left';
 L.append(el('div','eph','Main Profile'),tile('Avatar',rowA),tile('Avatar Decoration',dg),tile('Display Name & Pronouns',fld('Display name',dni),fld('Pronouns (max 30)',pri),dc),tile('Display Name Style',ns),tile('Profile Theme & Banner',th,cr,rowB),tile('Profile Effect',eg),tile('Server Tag',tg),tile('About Me',ta,cnt));
 const lo=btn('Log Out','g wide',logout);L.append(lo);
 const rs=btn('Reset','lnk',()=>{Object.assign(d,orig);ta.value=d.bio;dni.value=d.dname;pri.value=d.pronouns;c1.value=d.pc1||(THEMES[d.theme]||THEMES.midnight)[0];c2.value=d.pc2||(THEMES[d.theme]||THEMES.midnight)[1];ta.oninput();dcnt();tpaint();epaint();tpick();dpaint();apaint();paint()}),
 sv=btn('Save Changes','ok',async()=>{sv.disabled=true;
  try{if(d.bio!==orig.bio)await api('bio','PUT',{bio:d.bio});
   await api('profile2','PUT',{dname:d.dname,pronouns:d.pronouns,theme:d.theme,peffect:d.peffect,pc1:d.pc1,pc2:d.pc2,adeco:d.adeco});
   if(d.tag!==orig.tag)await api('me/tag','PUT',{server_id:d.tag});
   Object.assign(me,{dname:d.dname.trim()||null,pronouns:d.pronouns.trim()||null,theme:d.theme,peffect:d.peffect,pc1:d.pc1,pc2:d.pc2,adeco:d.adeco==='none'?null:d.adeco,tag_server:d.tag});theme();
   Object.assign(orig,d);draw();members();load().catch(()=>{});paint();toast('Profile saved',1)}catch(e){fail(e)}sv.disabled=false});
 bar.append(el('span','','Careful — you have unsaved changes!'),el('span','grow'),rs,sv);
 const paint=()=>{const s=servers.find(z=>z.id===d.tag&&z.tag);nspaint();prev.replaceChildren(el('div','eplabel','Preview'),pcard({id:me.id,username:me.username,dname:d.dname.trim(),pronouns:d.pronouns.trim(),peffect:d.peffect,pc1:d.pc1,pc2:d.pc2,adeco:d.adeco,tg:s?{tag:s.tag,tag_icon:s.tag_icon,tag_color:s.tag_color}:null,bio:d.bio,theme:d.theme,badges:me.badges,created:u.created,hb:u.hb,nfont:me.nfont,neffect:me.neffect,ncolor:me.ncolor,ncolor2:me.ncolor2,ps:myPs(),cstatus:me.cstatus},{big:true}));
  R.style.setProperty('--g',d.pc1||(THEMES[d.theme]||THEMES.midnight)[0]);bar.classList.toggle('show',dirty())};
 const key=e=>{if(e.key==='Escape'&&!$('.nsw')&&!$('.ov')&&!popEl)tryClose()},kill=()=>{ov.remove();removeEventListener('keydown',key);window.onImg=window.onNameStyle=null};
 const tryClose=()=>{if(dirty()){bar.classList.remove('shake');void bar.offsetWidth;bar.classList.add('shake');return}kill()};
 window.onImg=k=>{if(k==='banner')u.hb=true;apaint();paint()};window.onNameStyle=()=>{nspaint();paint()};
 R.append(prev,bar);ov.append(L,R,x);document.body.append(ov);addEventListener('key'+'down',key);apaint();nspaint();tpaint();epaint();tpick();dpaint();paint()}

// ---------- server tag editor (owner) ----------
function tagDialog(s,done){const D=dialog();D.set('Server tag','Members can wear this tag next to their name. 2-4 letters or numbers.');
 const IL=s.invite==='hearth'?['mascot',...TAG_ICONS]:TAG_ICONS;let ico=s.tag_icon||IL[0],col=s.tag_color||'#5865f2';const i=el('input');i.maxLength=4;i.placeholder='TAG';i.value=s.tag||'';const f=field('Tag',i),pv=el('div','tgl'),ig=el('div','tgi'),cp=el('input');cp.type='color';cp.value=col;
 const draw1=()=>{pv.replaceChildren(tagChip({tag:(i.value||'TAG').toUpperCase(),tag_icon:ico,tag_color:col}));[...ig.children].forEach((b,k)=>b.classList.toggle('on',IL[k]===ico))};
 IL.forEach(k=>{const b=el('button');b.type='button';b.append(tagIcon(k,18));b.onclick=()=>{ico=k;draw1()};ig.append(b)});
 i.oninput=()=>{i.value=i.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase();draw1()};cp.oninput=()=>{col=cp.value;draw1()};
 D.body.append(f,field('Icon',ig),field('Color',cp),field('Preview',pv));draw1();
 const save=async b=>{b.disabled=true;f.err();try{await api('servers/'+s.id+'/tag','PUT',b.rm?{tag:''}:{tag:i.value,icon:ico,color:col});await refresh();const n=servers.find(z=>z.id===s.id);if(n)Object.assign(s,n);D.close();done&&done()}catch(e){f.err(e.message);b.disabled=false}};
 const go=btn('Save Tag','',()=>save(go));D.foot.append(...(s.tag?[Object.assign(btn('Remove Tag','dng',()=>save(rm)),{})]:[]),btn('Cancel','lnk',D.close),go);const rm=D.foot.querySelector('.dng');rm&&(rm.rm=1);i.focus()}

// ---------- staff panel (search + pages, built for lots of people) ----------
async function staffPanel(tab='ov'){const D=dialog('860px');D.box.classList.add('wide','staffw');D.foot.style.display='none';
 const TABS=[['ov','Overview'],['users','Users'],['servers','Servers'],['msgs','Messages'],['log','Audit Log']],tb=el('div','sstabs'),pane=el('div','sspane');
 let st={users:{q:'',filter:'all',sort:'new',off:0,sel:new Set(),open:null},servers:{q:'',sort:'new',off:0},msgs:{q:'',user:'',off:0},log:{off:0}},tmr=0;
 const PG=20,qs=o=>Object.entries(o).filter(([k,v])=>v!==''&&v!=null&&typeof v!=='object').map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
 const ago=d=>{const s=(Date.now()-new Date(d))/1e3;return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':Math.floor(s/86400)+'d ago'};
 const search=(ph,val,on)=>{const i=el('input','sbar');i.placeholder=ph;i.value=val;i.oninput=()=>{clearTimeout(tmr);tmr=setTimeout(()=>on(i.value.trim()),300)};return i};
 const pick=(opts,val,on)=>{const s=el('select','sel2');opts.forEach(([v,n])=>{const o=el('option','',n);o.value=v;s.append(o)});s.value=val;s.onchange=()=>on(s.value);return s};
 const pager=(S,total,go)=>{const w=el('div','pgr'),a=Math.min(S.off+1,total),z=Math.min(S.off+PG,total);w.append(btn('‹ Prev','g sm',()=>{S.off=Math.max(0,S.off-PG);go()}),el('span','mu',total?a+'–'+z+' of '+total:'No results'),btn('Next ›','g sm',()=>{if(S.off+PG<total){S.off+=PG;go()}}));w.children[0].disabled=S.off===0;w.children[2].disabled=S.off+PG>=total;return w};
 const act=async(path,body,msg,after)=>{try{await api(path,'POST',body);msg&&toast(msg,1);after&&await after()}catch(e){fail(e)}};
 const draw1=async()=>{tb.replaceChildren();TABS.forEach(([k,n])=>{const b=el('button','sst'+(tab===k?' on':''),n);b.type='button';b.onclick=()=>{tab=k;draw1()};tb.append(b)});
  D.set('Staff panel',{ov:'Server health at a glance.',users:'Search, filter and moderate accounts.',servers:'Admin access to every server — invisible to members.',msgs:'Find and delete messages anywhere.',log:'Everything staff have done.'}[tab]);D.body.append(tb,pane);pane.replaceChildren(el('small','mu','Loading…'));
  try{await T[tab]()}catch(e){fail(e)}};
 const T={
 async ov(){const o=await api('staff/overview'),g=el('div','sgrid');[['Users',o.users],['Online now',o.online],['New this week',o.new7],['Banned',o.banned],['Staff',o.staff],['Servers',o.servers],['Channels',o.channels],['Messages',o.msgs],['Messages (24h)',o.msgs24],['Friendships',o.friends]].forEach(([l,v])=>{const c=el('div','scard');c.append(el('b','',Number(v).toLocaleString()),el('small','mu',l));g.append(c)});pane.replaceChildren(g)},
 async users(){const S=st.users,r=await api('staff/users?'+qs({q:S.q,filter:S.filter,sort:S.sort,offset:S.off,limit:PG})),bar=el('div','sfilters');
  bar.append(search('Search username, display name or ID…',S.q,v=>{S.q=v;S.off=0;T.users()}),pick([['all','Everyone'],['online','Online'],['new','New (7 days)'],['staff','Staff'],['banned','Banned'],['nobadge','No badges']],S.filter,v=>{S.filter=v;S.off=0;T.users()}),pick([['new','Newest'],['old','Oldest'],['name','Name A–Z'],['msgs','Most messages']],S.sort,v=>{S.sort=v;S.off=0;T.users()}));
  const bulk=el('div','sbulk'),upd=()=>{bulk.replaceChildren();if(!S.sel.size)return;bulk.append(el('span','',S.sel.size+' selected'),btn('Ban','dng sm',async()=>{if(await askConfirm('Ban '+S.sel.size+' users?','They won\'t be able to log in.',{ok:'Ban',danger:1}))act('staff/bulk',{ids:[...S.sel],action:'ban'},'Banned',()=>{S.sel.clear();T.users()})}),btn('Unban','g sm',()=>act('staff/bulk',{ids:[...S.sel],action:'unban'},'Unbanned',()=>{S.sel.clear();T.users()})),btn('Clear','lnk sm',()=>{S.sel.clear();T.users()}))};upd();
  const list=el('div','slist');
  r.rows.forEach(x=>{const row=el('div','srow2'),cb=el('input');cb.type='checkbox';cb.checked=S.sel.has(x.id);cb.disabled=x.role!=='user';cb.onclick=e=>{e.stopPropagation();cb.checked?S.sel.add(x.id):S.sel.delete(x.id);upd()};
   const n=el('div','sn');n.append(el('b','',x.username+(x.dname&&x.dname!==x.username?'  · '+x.dname:'')),el('small','mu','#'+x.id+' · joined '+ago(x.created)+' · '+x.msgs+' msgs'));
   const chips=el('div','schips');if(x.online)chips.append(el('span','chip on','online'));if(x.role!=='user')chips.append(el('span','chip stf',x.role));if(x.banned)chips.append(el('span','chip bn','banned'));
   row.append(cb,n,chips);row.onclick=()=>{S.open=S.open===x.id?null:x.id;T.users()};list.append(row);
   if(S.open===x.id){const dt=el('div','sdetail');dt.append(el('small','mu','Loading…'));list.append(dt);userDetail(x,dt,()=>T.users())}});
  pane.replaceChildren(bar,bulk,list,pager(S,r.total,()=>T.users()))},
 async servers(){const S=st.servers,r=await api('staff/servers?'+qs({q:S.q,sort:S.sort,offset:S.off,limit:PG})),bar=el('div','sfilters');
  bar.append(search('Search server, tag or owner…',S.q,v=>{S.q=v;S.off=0;T.servers()}),pick([['new','Newest'],['old','Oldest'],['name','Name A–Z'],['size','Most members']],S.sort,v=>{S.sort=v;S.off=0;T.servers()}));const list=el('div','slist');
  r.rows.forEach(s=>{const row=el('div','srow2'),n=el('div','sn'),a=el('div','sa');n.append(el('b','',s.name+(s.tag?'  ['+s.tag+']':'')),el('small','mu','owner '+(s.owner||'—')+' · '+s.members+' members · '+s.channels+' channels'));
   a.append(btn(s.moderating?'Open':'Moderate','sm',async()=>{try{if(!s.moderating)await api('staff/moderate','POST',{id:s.id,on:true});await refresh();D.close();goServer(s.id)}catch(e){fail(e)}}));
   if(s.moderating)a.append(btn('Stop','g sm',()=>act('staff/moderate',{id:s.id,on:false},null,T.servers)));
   const more=btn('More ▾','g sm',e=>{const b=e.currentTarget.getBoundingClientRect();ctxOpen(b.left,b.bottom+4,[['Rename…',async()=>{const n=await askText('Rename server','',s.name,{label:'Server name',max:30});n&&act('staff/server/'+s.id+'/act',{action:'rename',name:n},'Renamed',T.servers)}],['Reset invite code',()=>act('staff/server/'+s.id+'/act',{action:'reset_invite'},'Invite reset',T.servers)],['Remove server tag',()=>act('staff/server/'+s.id+'/act',{action:'clear_tag'},'Tag removed',T.servers)],['Clear description & rules',()=>act('staff/server/'+s.id+'/act',{action:'clear_desc'},'Cleared',T.servers)],...(me.role==='admin'&&s.invite!=='hearth'?['sep',['Delete server…',async()=>{if(await askText('Delete '+s.name,'This can\'t be undone. Type the server name to confirm.','',{label:'Server name',ok:'Delete Server',danger:1})===s.name)act('staff/server/'+s.id+'/act',{action:'delete'},'Server deleted',()=>{refresh();T.servers()})},{danger:1}]]:[])])});a.append(more);row.append(n,a);list.append(row)});
  pane.replaceChildren(bar,list,pager(S,r.total,()=>T.servers()))},
 async msgs(){const S=st.msgs,r=await api('staff/messages?'+qs({q:S.q,user:S.user,offset:S.off,limit:PG})),bar=el('div','sfilters');
  bar.append(search('Search message text…',S.q,v=>{S.q=v;S.off=0;T.msgs()}),search('From user…',S.user,v=>{S.user=v;S.off=0;T.msgs()}));const list=el('div','slist');
  r.rows.forEach(m=>{const row=el('div','srow2'),n=el('div','sn');n.append(el('b','',m.username),el('small','mu',ago(m.ts)+' · '+m.channel),el('span','smsg',m.body));row.append(n,btn('Delete','dng sm',async()=>{if(await askConfirm('Delete message','Delete this message permanently?',{ok:'Delete',danger:1}))api('staff/msg/'+m.id,'DELETE').then(()=>{toast('Deleted',1);T.msgs()}).catch(fail)}));list.append(row)});
  pane.replaceChildren(bar,list,pager(S,r.total,()=>T.msgs()))},
 async log(){const S=st.log,r=await api('staff/log?'+qs({offset:S.off,limit:PG})),list=el('div','slist');
  r.rows.forEach(l=>{const row=el('div','srow2'),n=el('div','sn');n.append(el('b','',l.actor_name+' · '+l.action),el('small','mu',(l.target||'')+(l.detail?' — '+l.detail:'')+' · '+ago(l.ts)));row.append(n);list.append(row)});if(!r.rows.length)list.append(el('small','mu','Nothing logged yet.'));
  pane.replaceChildren(list,pager(S,r.total,()=>T.log()))}};
 function userDetail(x,dt,reload){api('staff/user/'+x.id).then(d=>{dt.replaceChildren();const info=el('div','sinfo');[['ID',d.id],['Joined',new Date(d.created).toLocaleDateString()],['Messages',d.msgs],['Last message',d.last_msg?ago(d.last_msg):'—'],['Friends',d.friends],['Servers',d.servers.map(s=>s.name+(s.owner?' (owner)':'')).join(', ')||'—'],['Bio',d.bio||'—'],['Status',d.cstatus||'—']].forEach(([k,v])=>{const r=el('div');r.append(el('b','',k+': '),el('span','',String(v)));info.append(r)});dt.append(info);
  const can=me.owner||x.role==='user'||(me.role==='admin'&&x.role==='staff'),A=(l,a,cls,msg,conf,extra)=>btn(l,cls||'g sm',async()=>{if(conf&&!await askConfirm('Are you sure?',conf,{ok:'Confirm',danger:1}))return;act('staff/user/'+x.id+'/act',{action:a,...(extra||{})},msg||'Done',reload)}),box=el('div','sacts');
  if(!can){dt.append(el('small','mu','You can\'t moderate this account.'));return}
  box.append(d.banned?A('Unban','unban','ok sm','Unbanned'):A('Ban','ban','dng sm','Banned','Ban '+d.username+'?'),A('Disconnect','kick_online','g sm','Disconnected'),A('Clear avatar','clear_avatar'),A('Clear banner','clear_banner'),A('Clear bio','clear_bio'),A('Clear status','clear_status'),btn('Change username','g sm',async()=>{const v=await askText('Change username','Changing '+d.username+'. Any text, up to 32 characters.',d.username,{label:'New username',max:32,ok:'Change'});if(v===null||!v.trim())return;act('staff/user/'+x.id+'/act',{action:'rename',name:v},'Username changed',reload)}),A('Clear display name','clear_dname'),A('Remove server tag','clear_tag'),A('Reset profile look','reset_look'),A('Remove all badges','strip_badges','g sm',null,'Remove every badge?'),A('Leave all servers','leave_all','g sm',null,'Remove from every server except the Lounge?'),A('Delete all messages','purge_msgs','dng sm','Messages deleted','Permanently delete ALL of '+d.username+'\'s messages?'));
  if(me.role==='admin')box.append(A(x.role==='staff'?'Demote to member':'Make staff','role','g sm','Role changed',null,{role:x.role==='staff'?'user':'staff'}));dt.append(box);
  const bd=el('div','sacts');bd.append(el('small','mu','Badges:'));Object.keys(BADGES).forEach(k=>{const has=d.badges.includes(k);bd.append(btn((has?'− ':'+ ')+BADGES[k],'g sm'+(has?' on':''),()=>act('staff/user/'+x.id+'/act',{action:'badge',badge:k,on:!has},null,reload)))});dt.append(bd)}).catch(e=>{dt.replaceChildren(el('small','err',e.message))})}
 draw1()}

// ---------- members list ----------
async function members(){const p=$('#mem');if(!p)return;const sid=cur,tok=++memTok;if(sid==='home'){p.replaceChildren();return}
 const l=await api('members/'+sid).catch(()=>null);if(!l||tok!==memTok)return;memCache=l;const seen=new Set(),f=document.createDocumentFragment();
 [['Staff',u=>['admin','staff'].includes(u.role)],['Online',u=>u.online],['Offline',()=>true]].forEach(([n,fn])=>{const us=l.filter(u=>!seen.has(u.id)&&fn(u));us.forEach(u=>seen.add(u.id));if(!us.length)return;f.append(el('div','mh',n+' — '+us.length));
  us.forEach(u=>{const r=el('div','mr'+(u.online?'':' off')),w=el('div','st'+stc(u.ps)),t=THEMES[u.theme]||THEMES.midnight,nm=el('span','nm',u.username),tx=el('div','mtx');
   (u.online||u.ncolor||(u.neffect&&u.neffect!=='solid'))&&nameFx(nm,u,t[0]);w.append(av(u.id,u.username,u.theme,u.adeco||null));const top=el('div','mtop');top.append(nm);{const tc=tagChip(u.tg);tc&&top.append(tc)}(u.badges||[]).slice(0,1).forEach(k=>BADGES[k]&&top.append(badge(k)));tx.append(top);
   if(u.cstatus&&u.online){const s=el('div','mst');s.append(rich(u.cstatus));tx.append(s)}
   r.append(w,tx);r.onclick=e=>profile(u.id,e);r.oncontextmenu=e=>{e.preventDefault();userMenu(u,e.clientX,e.clientY)};f.append(r)})});
 p.replaceChildren(f)}
const pollFriends=()=>api('friends').then(f=>{friends=f;if(cur==='home')draw()}).catch(()=>{});

// ---------- sidebar ----------
let hideV=false;try{hideV=localStorage.getItem('hvc')==='1'}catch{}
const fmtT=ms=>{const s=Math.max(0,Math.floor(ms/1e3)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=n=>String(n).padStart(2,'0');return h?`${h}:${p(m)}:${p(x)}`:`${p(m)}:${p(x)}`};
function draw(){const rail=$('#rail'),side=$('#side');if(!rail||!side||!me)return;const sc=side.querySelector('.sbody'),top=sc?sc.scrollTop:0;rail.replaceChildren();side.replaceChildren();
 const rb=(c,tt,on,fn,cls)=>{const b=el('div','rb'+(on?' on':'')+(cls?' '+cls:''));typeof c==='string'?b.textContent=c:b.append(c);b.title=tt;b.onclick=fn;rail.append(b);return b},home=new Image();home.src=MURI;
 railBadge(rb(home,'Home & DMs',cur==='home',goHome),[...friends.filter(f=>f.status==='ok'),...dmList,...dmReqs].map(f=>dmKey(f.id)));rail.append(el('div','sep'));
 servers.forEach(s=>{const b=rb(s.has_icon||s.invite==='hearth'?(()=>{const m=new Image();m.src=s.has_icon?'/api/servers/'+s.id+'/icon?v='+AV:'/server-icon.svg';m.style.cssText='width:100%;height:100%;border-radius:inherit;object-fit:cover';return m})():initials(s.name),s.name+(s.is_mod?' (moderating)':''),cur===s.id,()=>goServer(s.id));if(s.is_mod){b.classList.add('modrb');b.append(el('i','modmk','🛡'))}railBadge(b,s.channels.map(c=>'c'+c.id))});
 rb(ic(IC.plus,22),'Add a Server',false,addServerDialog,'add');
 $('#app').classList.toggle('nomem',cur==='home'||!showMem);
 const hdr=el('div','sh'),body=el('div','sbody');
 if(cur==='home'){hdr.classList.add('plain');hdr.append(el('span','','Home'));
  const af=el('div','ch');af.append(ic(IC.addp,20),el('span','','Add Friend'));af.onclick=addFriendDialog;body.append(af);
  const pend=friends.filter(f=>f.status==='pending');
  if(pend.length){body.append(el('div','cat','Pending — '+pend.length));pend.forEach(f=>{const r=el('div','ch'),w=el('div','st');w.append(av(f.id,f.username,f.theme));r.append(w,el('span','',f.username+(f.by===me.id?' · sent':' · wants to add you')));
   if(f.by!==me.id)r.append(ib(IC.check,'Accept',()=>api('friends/accept','POST',{id:f.id}).then(refresh).catch(fail),18));r.append(ib(IC.x,f.by===me.id?'Cancel':'Decline',()=>api('friends/'+f.id,'DELETE').then(refresh).catch(fail),18));r.onclick=e=>profile(f.id,e);body.append(r)})}
  if(dmReqs.length){body.append(el('div','cat','Message Requests — '+dmReqs.length));dmReqs.forEach(f=>{const k=dmKey(f.id),r=el('div','ch'+(ch===k?' on':'')+(unread[k]?' unr':'')),w=el('div','st');w.append(av(f.id,f.username,f.theme,f.adeco||null));r.append(w,el('span','',f.username));
   r.append(ib(IC.check,'Accept',()=>api('dm/accept','POST',{id:f.id}).then(refresh).catch(fail),18),ib(IC.x,'Decline',()=>{api('dm/decline','POST',{id:f.id}).then(()=>{if(ch===k)open(null,'');return refresh()}).catch(fail)},18));r.onclick=()=>open(k,'@ '+f.username);body.append(r)})}
  const c=el('div','cat');c.append(el('span','','Direct Messages'),ib(IC.plus,'Add Friend',addFriendDialog,16));body.append(c);
  const fo=friends.filter(f=>f.status==='ok'),dms=[...fo,...dmList.filter(d=>!fo.some(f=>f.id===d.id))];if(!dms.length)body.append(el('div','sempty','No conversations yet. Right-click someone to message them.'));
  dms.forEach(f=>{const k=dmKey(f.id),r=el('div','ch'+(ch===k?' on':'')+(unread[k]?' unr':'')),w=el('div','st'+stc(f.ps));w.append(av(f.id,f.username,f.theme,f.adeco||null));r.append(w,el('span','',f.username));pingBadge(r,k);r.onclick=()=>open(k,'@ '+f.username);body.append(r)})}
 else{const s=servers.find(x=>x.id===cur);if(s){hdr.append(el('span','',s.name),ic(IC.down,18));hdr.onclick=()=>serverMenu(s,hdr);const own=s.owner_id===me.id||isStaff();let hasV=false;
  [['text','Text Channels',IC.hash],['voice','Voice Channels',IC.spk]].forEach(([k,n,i])=>{const cs=s.channels.filter(c=>c.kind===k);if(k==='voice')hasV=cs.length>0;if(!cs.length||(k==='voice'&&hideV))return;
   const c=el('div','cat');c.append(el('span','',n));own&&c.append(ib(IC.plus,'Create Channel',()=>channelDialog(s,k),16));body.append(c);
   cs.forEach(c=>{if(k==='text'){const r=el('div','ch'+(ch==='c'+c.id?' on':'')+(unread['c'+c.id]?' unr':''));r.dataset.cid=c.id;r.dataset.k=k;r.append(ic(i,20),el('span','',c.name));pingBadge(r,'c'+c.id);r.onclick=()=>open('c'+c.id,'# '+c.name);body.append(r);return}
    const live=vrooms['c'+c.id],mine=room&&room.id===c.id,r=el('div','ch vch'+(live?' live':'')+(mine?' on':''));r.dataset.cid=c.id;r.dataset.k=k;r.append(ic(i,20),el('span','',c.name));
    if(live){const t=el('span','vt',fmtT(Date.now()-live.since));t.dataset.s=live.since;r.append(t)}r.onclick=()=>vjoin(c);body.append(r);
    if(live)live.peers.forEach(p=>{const row=el('div','vp'+(speaking.has(p.id)?' speak':'')),nm=el('span','nmv',p.name);row.dataset.uid=p.id;
     const th=(memCache.find(m=>m.id===p.id)||{}).theme||(p.id===me.id?me.theme:'midnight');row.append(av(p.id,p.name,th),nm);
     if(p.deaf)row.append(vicon(IC.hpoff));else if(p.muted)row.append(vicon(IC.micoff));
     row.onclick=e=>profile(p.id,e);body.append(row)})})});
  if(hasV){const hb=el('button','hvc');hb.type='button';hb.append(ic(IC.spk,18),el('span','',hideV?'Show Voice Channels':'Hide Voice Channels'));hb.onclick=()=>{hideV=!hideV;try{localStorage.setItem('hvc',hideV?'1':'0')}catch{}draw()};body.append(hb)}}}
 if(cur!=='home'){const s=servers.find(x=>x.id===cur);if(s&&(s.owner_id===me.id||isStaff())){chanDrag(body,s);body.oncontextmenu=e=>{if(e.target.closest('.ch,.vp,.cat,.hvc'))return;e.preventDefault();ctxOpen(e.clientX,e.clientY,[['Create Text Channel',()=>channelDialog(s,'text')],['Create Voice Channel',()=>channelDialog(s,'voice')]])}}}
 side.append(hdr,body);body.scrollTop=top;
 if(room){const v=el('div','vcp'),t=el('div','t'),srv=servers.find(x=>x.id===room.server_id);t.append(el('b','','Voice Connected'),el('small','',room.name+(srv?' / '+srv.name:'')));v.append(ic(IC.spk,20),t,ib(IC.hangup,'Disconnect',vleave,20));v.firstChild.classList.add('vcg');side.append(v)}
 const p=el('div'),mi=el('div','mi'),w=el('div','st'+stc(myPs())),nb=el('div','mn'),nn=el('b','',dn(me)),off=selfMute||selfDeaf;p.id='me';w.append(av(me.id,me.username,me.theme));nameFx(nn,me,'#f2f3f5');
 nb.append(nn,el('small','',room?'In voice':(me.cstatus||STAT[me.status||'online'])));mi.append(w,nb);mi.onclick=()=>selfPop(p);p.append(mi);
 const mb=ib(off?IC.micoff:IC.mic,selfMute?'Unmute':'Mute',toggleMute,20),db=ib(selfDeaf?IC.hpoff:IC.hp,selfDeaf?'Undeafen':'Deafen',toggleDeaf,20);if(off)mb.classList.add('bad');if(selfDeaf)db.classList.add('bad');
 p.append(mb,db,ib(IC.gear,'User settings',settings,20));side.append(p)}
const vicon=d=>{const s=el('span','vi');s.append(ic(d,16));return s};
setInterval(()=>document.querySelectorAll('.vt[data-s]').forEach(n=>n.textContent=fmtT(Date.now()-n.dataset.s)),1000);

// ---------- voice (WebRTC mesh; signalling and room state over the WebSocket) ----------
let ICE=[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478']}];let vrooms={},selfMute=false,selfDeaf=false,speaking=new Set(),actx=null;const mon={};
const sig=(to,data)=>ws.send(JSON.stringify({type:'sig',to,data}));
function watch(id,s){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const an=actx.createAnalyser();an.fftSize=512;actx.createMediaStreamSource(s).connect(an);mon[id]={an,buf:new Uint8Array(an.fftSize)}}catch{}}
setInterval(()=>{if(!Object.keys(mon).length&&!speaking.size)return;const now=new Set();
 for(const id in mon){const m=mon[id];m.an.getByteTimeDomainData(m.buf);let x=0;for(const v of m.buf){const t=(v-128)/128;x+=t*t}if(Math.sqrt(x/m.buf.length)>.035&&!(+id===me.id&&(selfMute||selfDeaf)))now.add(+id)}
 if(now.size===speaking.size&&[...now].every(i=>speaking.has(i)))return;speaking=now;document.querySelectorAll('.vp').forEach(n=>n.classList.toggle('speak',now.has(+n.dataset.uid)))},120);
function peer(id){if(pcs[id])return pcs[id].pc;const pc=new RTCPeerConnection({iceServers:ICE}),a=new Audio();a.autoplay=true;a.volume=userVol(id);a.muted=selfDeaf;document.body.append(a);pcs[id]={pc,a};
 stream.getTracks().forEach(t=>pc.addTrack(t,stream));pc.ontrack=e=>{a.srcObject=e.streams[0];watch(id,e.streams[0])};pc.onicecandidate=e=>e.candidate&&sig(id,{ice:e.candidate});return pc}
function vclose(id){delete mon[id];if(!pcs[id])return;pcs[id].pc.close();pcs[id].a.remove();delete pcs[id];delete names[id]}
function vcleanup(){Object.keys(pcs).forEach(vclose);delete mon[me&&me.id];stream&&stream.getTracks().forEach(t=>t.stop());stream=null;room=null;names={};speaking=new Set()}
function applyAudio(){if(stream)stream.getAudioTracks().forEach(t=>t.enabled=!(selfMute||selfDeaf));Object.values(pcs).forEach(p=>p.a.muted=selfDeaf);
 if(ws&&ws.readyState===1&&room)ws.send(JSON.stringify({type:'vstate',muted:selfMute||selfDeaf,deaf:selfDeaf}))}
function toggleMute(){if(selfDeaf){selfDeaf=false;selfMute=false}else selfMute=!selfMute;applyAudio();draw()}
function toggleDeaf(){selfDeaf=!selfDeaf;applyAudio();draw()}
async function vjoin(c){if(room&&room.id===c.id)return;if(room)vleave();
 try{const x=await api('ice');Array.isArray(x)&&x.length&&(ICE=x)}catch{}
 try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch{return toast('Hearth needs microphone access to join voice. Check your browser\'s site permissions.')}
 room=c;names={};ws.send(JSON.stringify({type:'vjoin',ch:'c'+c.id,muted:selfMute||selfDeaf,deaf:selfDeaf}));watch(me.id,stream);applyAudio();draw()}
function vleave(){ws.send(JSON.stringify({type:'vleave'}));vcleanup();draw()}
function onSig(d){chain=chain.then(async()=>{if(!stream)return;const pc=peer(d.from),x=d.data;
 const P=pcs[d.from];if(x.sdp){await pc.setRemoteDescription(x.sdp);const qd=P.q||[];P.q=[];for(const c of qd)await pc.addIceCandidate(c).catch(()=>{});if(x.sdp.type==='offer'){await pc.setLocalDescription(await pc.createAnswer());sig(d.from,{sdp:pc.localDescription})}}
 else if(x.ice){if(pc.remoteDescription)await pc.addIceCandidate(x.ice).catch(()=>{});else(P.q=P.q||[]).push(x.ice)}}).catch(()=>{})}
function connect(){ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws');
 ws.onmessage=async e=>{const d=JSON.parse(e.data);if(d.type==='presence'){clearTimeout(window.pt);window.pt=setTimeout(()=>{members();pollFriends()},400)}
  if(d.type==='msg')onMsg(d.m);if(['edit','react','pin','typing'].includes(d.type))onEvt(d);
  if(d.type==='del')onDel(d.id);
  if(d.type==='vroom'){if(d.peers.length)vrooms[d.ch]={peers:d.peers,since:Date.now()-d.dur};else delete vrooms[d.ch];draw()}
  if(d.type==='vpeers'&&room)for(const p of d.peers){names[p.id]=p.name;const pc=peer(p.id);await pc.setLocalDescription(await pc.createOffer());sig(p.id,{sdp:pc.localDescription})}
  if(d.type==='vin'&&room)names[d.id]=d.name;if(d.type==='vout')vclose(d.id);if(d.type==='sig')onSig(d)};
 ws.onclose=()=>{if(me){vcleanup();vrooms={};setTimeout(connect,2000)}}}


// ---------- channel reordering: hold a channel, then drag it ----------
function chanDrag(body,s){let t=null,d=null,sx=0,sy=0;
 const rows=()=>[...body.querySelectorAll('.ch[data-cid]')];
 const cancel=()=>{clearTimeout(t);t=null};
 const end=async(commit)=>{if(!d)return;const{row,grp,k}=d;d=null;row.classList.remove('dragging');body.classList.remove('dragmode');
  document.removeEventListener('pointermove',mv,true);document.removeEventListener('touchmove',tm,{capture:true});
  {const kc=e=>{e.stopPropagation();e.preventDefault()};addEventListener('click',kc,true);setTimeout(()=>removeEventListener('click',kc,true),80)}
  if(!commit)return;const order=rows().map(r=>+r.dataset.cid),texts=order.filter(i=>s.channels.find(c=>c.id===i&&c.kind==='text')),voices=order.filter(i=>s.channels.find(c=>c.id===i&&c.kind!=='text'));
  s.channels.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));draw();
  try{await api('servers/'+s.id+'/channels/order','PUT',{ids:[...texts,...voices]});await refresh()}catch(e){fail(e);refresh()}};
 const tm=e=>{if(d)e.preventDefault()};
 const mv=e=>{if(!d){if(t&&Math.hypot(e.clientX-sx,e.clientY-sy)>8)cancel();return}
  e.preventDefault();const{row,grp}=d,r=document.elementFromPoint(e.clientX,e.clientY),o=r&&r.closest('.ch[data-cid]');
  if(o&&o!==row&&o.dataset.k===d.k){const b=o.getBoundingClientRect(),after=e.clientY>b.top+b.height/2,og=[o];let n=o.nextElementSibling;while(n&&n.classList.contains('vp')){og.push(n);n=n.nextElementSibling}
   if(after)(og[og.length-1]).after(...grp);else o.before(...grp)}};
 body.addEventListener('pointerdown',e=>{const row=e.target.closest('.ch[data-cid]');if(!row||e.button>0||e.target.closest('button'))return;sx=e.clientX;sy=e.clientY;cancel();
  t=setTimeout(()=>{t=null;const grp=[row];let n=row.nextElementSibling;while(n&&n.classList.contains('vp')){grp.push(n);n=n.nextElementSibling}
   d={row,grp,k:row.dataset.k};row.classList.add('dragging');body.classList.add('dragmode');if(navigator.vibrate)try{navigator.vibrate(15)}catch{}
   document.addEventListener('pointermove',mv,true);document.addEventListener('touchmove',tm,{capture:true,passive:false})},380)});
 const up=()=>{cancel();end(true)};body.addEventListener('pointerup',up);body.addEventListener('pointercancel',()=>{cancel();end(false)});
 body.addEventListener('contextmenu',e=>{if(d||(e.pointerType==='touch'&&e.target.closest('.ch[data-cid]')))e.preventDefault()});
}
(()=>{const s=document.createElement('style');s.textContent='.ch[data-cid]{-webkit-touch-callout:none;user-select:none}.ch.dragging{background:#404249!important;box-shadow:0 4px 14px #0009;opacity:.9;cursor:grabbing}.dragmode{cursor:grabbing}.dragmode .ch{pointer-events:auto}';document.head.append(s)})();

// ---------- right-click user menu (member list + chat names/avatars) ----------
const noteKey=id=>'hearth.note.'+id,volKey=id=>'hearth.vol.'+id;
function userVol(id){try{const v=localStorage.getItem(volKey(id));return v==null||isNaN(+v)?1:Math.max(0,Math.min(1,+v/100))}catch{return 1}}
function userMenu(u,x,y){
 const id=u.id,name=u.username,mine=id===me.id,f=friends.find(z=>z.id===id),it=[];let note='';
 try{note=localStorage.getItem(noteKey(id))||''}catch{}
 it.push(['Profile',()=>profile(id)],['Mention',()=>{const i=$('#in');if(!i)return;i.value+=(i.value&&!/\s$/.test(i.value)?' ':'')+'@'+name+' ';i.focus();i.dispatchEvent(new Event('input'))}]);
 if(!mine)it.push(['Message',()=>{closeFull();openDM(u)}]);
 it.push([note?'Edit Note':'Add Note',async()=>{const t=await askText('Note for '+name,'Only visible to you.',note,{label:'Note',max:256,ok:'Save'});if(t==null)return;const v=t.trim();try{v?localStorage.setItem(noteKey(id),v):localStorage.removeItem(noteKey(id))}catch{}toast(v?'Note saved':'Note removed',1)},{sub:note?(note.length>34?note.slice(0,34)+'…':note):'Only visible to you'}]);
 if(!mine){
  const w=el('div','cvol'),r=el('input');r.type='range';r.min=0;r.max=100;r.value=Math.round(userVol(id)*100);
  r.oninput=()=>{try{localStorage.setItem(volKey(id),r.value)}catch{}pcs[id]&&pcs[id].a&&(pcs[id].a.volume=r.value/100)};
  w.append(el('div','','User Volume'),r);it.push('sep',{node:w},'sep');
  const aft=p=>p.then(()=>refresh()).catch(fail);
  if(!f)it.push(['Add Friend',()=>aft(api('friends','POST',{username:name}).then(()=>toast('Friend request sent to '+name,1)))]);
  else if(f.status==='ok')it.push(['Remove Friend',()=>aft(api('friends/'+id,'DELETE'))]);
  else if(f.by!==me.id)it.push(['Accept Friend Request',()=>aft(api('friends/accept','POST',{id}))]);
  else it.push(['Cancel Friend Request',()=>aft(api('friends/'+id,'DELETE'))]);
  it.push('sep');
 }else it.push('sep');
 it.push(['Copy User ID',()=>{copyTxt(String(id));toast('User ID copied',1)}]);
 ctxOpen(x,y,it)}
(()=>{const s=document.createElement('style');s.textContent='#ctx{min-width:210px}.ci small{font-size:12px;font-weight:400;color:#949ba4;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ci:hover small{color:#ffffffcc}.cvol{padding:6px 8px 8px;color:#b5bac1;font-weight:600}.cvol input{outline:none;box-shadow:none;padding:0;border:0;background:none;height:20px;margin:4px 0 0;accent-color:#5865f2;cursor:pointer}.mtop .stg{flex:none}';document.head.append(s)})();

// open a DM with anyone; strangers' first message goes to their Message Requests
function openDM(u){const k=dmKey(u.id);if(u.id!==me.id&&!dmKnown(k))dmList.push({id:u.id,username:u.username,theme:u.theme||'midnight',adeco:u.adeco||null,ps:'offline',tmp:1});cur='home';open(k,'@ '+u.username);members()}
