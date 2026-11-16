// Hearth client features. Loaded after app.js, so it can use app.js globals (me, api, el, rich, draw, ...).
// 1 name styles  2 markdown + mentions  3 composer  4 message actions  5 reactions/replies/pins/typing/unread  6 CSS
Object.assign(IC,{
 smile:'M12 2C6.47 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
 reply:'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',
 edit:'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
 dots:'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
 copy:'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
 pin:'M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z',
 drop:'M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z',
 spark:'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z'});

// ================= 1. display name styles =================
// id: [label, css font stack, weight, size scale]. Free (OFL) fonts, self-hosted in /fonts.
const NF={
 sans:['Default','"Noto Sans","Segoe UI",system-ui,sans-serif',700,1],
 slab:['Slab','"Zilla Slab",Rockwell,serif',700,1.08],
 chunky:['Chunky','Chango,"Arial Black",sans-serif',400,.9],
 script:['Script','Lobster,cursive',400,1.1],
 round:['Rounded','Fredoka,Nunito,sans-serif',600,1.05],
 block:['Block','"Rubik Mono One",Impact,sans-serif',400,.85],
 serif:['Serif','"Playfair Display",Georgia,serif',800,1],
 marker:['Marker','"Permanent Marker","Comic Sans MS",cursive',400,.95],
 tech:['Tech','Orbitron,"Courier New",monospace',700,.9],
 pixel:['Pixel','"Press Start 2P","Courier New",monospace',400,.8],
 gothic:['Gothic','UnifrakturCook,"Old English Text MT",serif',700,1.15],
 cursive:['Cursive','"Dancing Script","Brush Script MT",cursive',700,1.15]};
const FXL=[['solid','Solid'],['gradient','Gradient'],['neon','Neon'],['toon','Toon'],['pop','Pop'],['gummy','Gummy'],['prism','Prism']];
const FXDEMO={solid:['#f2f3f5'],gradient:['#5fb99a','#cfc29a'],neon:['#8b5cf6'],toon:['#ff5aa5'],pop:['#7fe3b8'],gummy:['#c58ab8'],prism:['#a99be0']};
const SWATCH=['#f2f3f5','#23e36c','#1b99ec','#c32aff','#da014b','#f93722','#c6a714'];
const HEXRE=/^#[0-9a-f]{6}$/i;
function toHsl(c){let[r,g,b]=[1,3,5].map(i=>parseInt(c.substr(i,2),16)/255),M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,h=0,s=0;
 if(M!==m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s*100,l*100]}
const hsl=(h,s,l)=>`hsl(${Math.round(((h%360)+360)%360)} ${Math.round(s)}% ${Math.round(l)}%)`;
function fxVars(c1,c2){const[h,s,l]=toHsl(c1),S=Math.max(s,50),L=Math.min(78,Math.max(62,l));
 return{'--c1':c1,'--c1l':hsl(h,s,Math.min(92,l+28)),'--c1d':hsl(h,s,Math.max(16,l-28)),'--c2':c2||hsl(h+70,S,L),'--p1':c1,'--p2':hsl(h+70,S,L),'--p3':hsl(h+150,S,L),'--p4':hsl(h+230,S,L)}}
// Style any name element. u = {nfont, neffect, ncolor, ncolor2, badges}; fb = colour to use when the person never picked one.
function nameFx(n,u,fb){[...n.classList].forEach(c=>/^fx-|^sup$/.test(c)&&n.classList.remove(c));
 ['fontFamily','fontWeight','fontSize'].forEach(p=>n.style[p]='');
 const fx=FXL.some(x=>x[0]===u.neffect)?u.neffect:'solid',c1=HEXRE.test(u.ncolor||'')?u.ncolor:fb,f=NF[u.nfont];
 if(f&&u.nfont!=='sans'){n.style.fontFamily=f[1];n.style.fontWeight=f[2];n.style.fontSize=f[3]+'em'}
 if(fx==='solid'&&!u.ncolor&&(u.badges||[]).includes('supporter')){n.classList.add('sup');return}
 n.classList.add('fx-'+fx);const v=fxVars(HEXRE.test(c1)?c1:'#5865f2',HEXRE.test(u.ncolor2||'')?u.ncolor2:null);for(const k in v)n.style.setProperty(k,v[k])}

function nameStyleModal(){
 const th=(THEMES[me.theme]||THEMES.midnight)[0],st={font:NF[me.nfont]?me.nfont:'sans',effect:FXL.some(x=>x[0]===me.neffect)?me.neffect:'solid',color:me.ncolor||null,color2:me.ncolor2||null};
 const ov=el('div','nsw'),box=el('div','nsbox'),p=el('div','nsp'),pv=el('div','nspv'),esc=e=>{if(e.key==='Escape')close()},close=()=>{ov.remove();removeEventListener('keydown',esc)};
 addEventListener('keydown',esc);ov.onmousedown=e=>{if(e.target===ov)close()};
 const sec=t=>{const h=el('h3','nsh',t);h.append(ic(IC.spark,14));return h};
 const ft={},gf=el('div','nsg');
 Object.keys(NF).forEach((k,i)=>{const b=el('button','nt'),g=el('span','ngg','Gg');b.type='button';b.dataset.tip=NF[k][0];g.style.fontFamily=NF[k][1];g.style.fontWeight=NF[k][2];g.style.fontSize=Math.round(21*Math.min(NF[k][3],1.06))+'px';b.append(g);
  if(i>=8&&i<=10)b.append(el('i','nd'));b.onclick=()=>{st.font=k;sync()};ft[k]=b;gf.append(b)});
 const et={},ge=el('div','nsg');
 FXL.forEach(([k,l])=>{const b=el('button','nt'),s=el('span','nfx',l);b.type='button';nameFx(s,{neffect:k,ncolor:FXDEMO[k][0],ncolor2:FXDEMO[k][1]},'#fff');b.append(s);
  if(k==='gummy'||k==='prism')b.append(el('i','nd'));b.onclick=()=>{st.effect=k;sync()};et[k]=b;ge.append(b)});
 const crow=key=>{const w=el('div','nsc'),eye=el('label','cw eye'),inp=el('input'),sw=[];inp.type='color';inp.title='Pick a custom color';inp.value=st[key]||(key==='color'?th:'#ffffff');
  inp.oninput=()=>{st[key]=inp.value;sync()};eye.append(ic(IC.drop,20),inp);w.append(eye);
  SWATCH.forEach(c=>{const b=el('button','cw');b.type='button';b.style.background=c;b.title=c;b.onclick=()=>{st[key]=c;inp.value=c;sync()};sw.push([c,b]);w.append(b)});
  return{w,upd(){const v=st[key],custom=!!v&&!SWATCH.includes(v);eye.classList.toggle('on',custom);eye.style.background=custom?v:'';sw.forEach(([c,b])=>b.classList.toggle('on',c===v))}}};
 const r1=crow('color'),r2=crow('color2'),h2=sec('Choose Second Color');
 // live preview card (profile-style) beside the picker
 const bn=el('div','pvb'),pa=el('div','pva'),pn=el('div','pvn',me.username),cap=el('div','pvc','This is how your name looks.'),row=el('div','pvm'),mn=el('span','nm',me.username),mt=el('div','mt','Hello from Hearth!');
 bn.style.backgroundImage=`linear-gradient(120deg,${THEMES[me.theme]?THEMES[me.theme][0]:th},${(THEMES[me.theme]||THEMES.midnight)[1]})`;pa.append(av(me.id,me.username,me.theme));
 const mh=el('div','mh2');mh.append(mn,el('span','ts','Today'));const mb=el('div','mb');mb.append(mh,mt);row.append(av(me.id,me.username,me.theme),mb);
 const cancel=el('button','g','Cancel'),save=el('button','','Save Changes'),reset=el('button','g lnk','Reset');
 cancel.onclick=close;reset.onclick=()=>{Object.assign(st,{font:'sans',effect:'solid',color:null,color2:null});sync()};
 save.onclick=async()=>{save.disabled=true;try{await api('namestyle','PUT',{font:st.font,effect:st.effect,color:st.color,color2:st.color2});Object.assign(me,{nfont:st.font,neffect:st.effect,ncolor:st.color,ncolor2:st.color2});close();draw();members();load().catch(()=>{});window.onNameStyle&&onNameStyle()}catch(e){save.disabled=false;fail(e)}};
 const sync=()=>{Object.keys(ft).forEach(k=>ft[k].classList.toggle('on',k===st.font));Object.keys(et).forEach(k=>et[k].classList.toggle('on',k===st.effect));r1.upd();r2.upd();
  h2.style.display=r2.w.style.display=st.effect==='gradient'?'':'none';[pn,mn].forEach(n=>nameFx(n,{nfont:st.font,neffect:st.effect,ncolor:st.color,ncolor2:st.color2,badges:me.badges},th))};
 p.append(el('h2','nst','Change Display Name Style'),sec('Choose Font'),gf,sec('Choose Effect'),ge,sec('Choose Color'),r1.w,h2,r2.w);
 const ft2=el('div','nsf');ft2.append(reset,el('span','grow'),cancel,save);
 pv.append(bn,pa,pn,cap,el('div','pvh','In chat'),row,ft2);box.append(p,pv);ov.append(box);document.body.append(ov);sync()}

// ================= 2. markdown + mentions =================
const MDRE=/(`[^`\n]+`)|(\|\|[\s\S]+?\|\|)|(\*\*\*[^\n]+?\*\*\*)|(\*\*[\s\S]+?\*\*)|(__[\s\S]+?__)|(~~[\s\S]+?~~)|(\*[^\s*][^*\n]*\*)|(\b_[^\s_][^_\n]*_\b)|(https?:\/\/[^\s<>"']+)|((?<![\w@])@[A-Za-z0-9_.]{2,20})/g;
function mentionEl(x,m){let n=x.slice(1);
 for(;;){const l=n.toLowerCase();
  if((l==='everyone'||l==='here')&&m&&m.ev)return[el('span','mention','@'+n),n.length+1];
  const u=m&&(m.mn||[]).find(z=>z.username.toLowerCase()===l||(z.at||[]).includes(l));   // still matches after the person renames
  if(u){const e=el('span','mention'+(u.id===me.id?' me':''),'@'+u.username);e.onclick=ev=>{ev.stopPropagation();profile(u.id,ev)};return[e,n.length+1]}
  if(n.endsWith('.'))n=n.slice(0,-1);else return[null,0]}}
function inl(s,m,dp=0){const f=document.createDocumentFragment();let i=0;if(dp>3){f.append(rich(s));return f}
 s.replace(MDRE,(...a)=>{const x=a[0],o=a[11],g=a.slice(1,11).findIndex(v=>v!==undefined);
  if(o>i)f.append(rich(s.slice(i,o)));i=o+x.length;
  const wrap=(t,n)=>{const e=el(t);e.append(inl(x.slice(n,-n),m,dp+1));return e};
  if(g===0)f.append(el('code','',x.slice(1,-1)));
  else if(g===1){const e=wrap('span',2);e.className='sp';e.onclick=ev=>{ev.stopPropagation();e.classList.toggle('on')};f.append(e)}
  else if(g===2){const e=el('strong'),n=el('em');n.append(inl(x.slice(3,-3),m,dp+1));e.append(n);f.append(e)}
  else if(g===3)f.append(wrap('strong',2));else if(g===4)f.append(wrap('u',2));else if(g===5)f.append(wrap('s',2));else if(g===6||g===7)f.append(wrap('em',1));
  else if(g===8){let u=x.replace(/[.,!?;:]+$/,'');while(u.endsWith(')')&&(u.match(/\(/g)||[]).length<(u.match(/\)/g)||[]).length)u=u.slice(0,-1);
   const ln=el('a','',u);ln.href=u;ln.target='_blank';ln.rel='noopener noreferrer nofollow';f.append(ln);if(u.length<x.length)f.append(rich(x.slice(u.length)))}
  else{const[e,n]=mentionEl(x,m);if(e){f.append(e);if(n<x.length)f.append(rich(x.slice(n)))}else f.append(rich(x))}
  return x});
 if(i<s.length)f.append(rich(s.slice(i)));return f}
// block level: ```code blocks```, > quotes, everything else inline. Built with DOM nodes only (no innerHTML).
function md(t,m){const f=document.createDocumentFragment();
 t.split(/(```[\s\S]+?```)/g).forEach((s,k)=>{
  if(k%2){const pre=el('pre'),c=el('code','',s.slice(3,-3).replace(/^[\w+#-]*\n/,'').replace(/^\n+|\n+$/g,''));pre.append(c);f.append(pre);return}
  s=s.replace(/^\n/,'').replace(/\n$/,'');if(!s)return;
  let grp=[],q=false;const out=()=>{if(!grp.length)return;if(q){const b=el('blockquote');b.append(inl(grp.map(l=>l.replace(/^>>? /,'')).join('\n'),m));f.append(b)}else f.append(inl(grp.join('\n'),m));grp=[]};
  s.split('\n').forEach(l=>{const isq=/^>>? /.test(l);if(isq!==q){out();q=isq}grp.push(l)});out()});
 return f}

// ================= 3. composer: @autocomplete, typing, reply bar =================
let memCache=[],replyTo=null,tabN=0;const typers=new Map(),unread={},pings={};
const ownerOf=c=>{const s=servers.find(x=>x.id===cur);return!!s&&/^c\d+$/.test(c||'')&&s.owner_id===me.id};
const canEveryone=()=>isStaff()||ownerOf(ch);
function acList(q){let pool=[];
 if(cur==='home'){const f=friends.find(x=>ch&&dmKey(x.id)===ch);if(f)pool=[{id:f.id,username:f.username,theme:'midnight',online:true}]}else pool=memCache;
 const r=pool.filter(u=>u.id!==me.id&&u.username.toLowerCase().includes(q)).sort((a,b)=>(a.username.toLowerCase().indexOf(q)-b.username.toLowerCase().indexOf(q))||(b.online-a.online)||a.username.localeCompare(b.username)).slice(0,8);
 if(canEveryone()&&cur!=='home')[['everyone','Notify all members'],['here','Notify all members']].forEach(([n,d])=>n.startsWith(q)&&r.push({special:n,username:n,desc:d}));
 return r}
function setReply(m){replyTo=m;const b=$('#rbar');if(!b)return;b.replaceChildren();if(!m){b.style.display='none';return}
 const n=el('b','',m.username);nameFx(n,m,'#fff');b.append(el('span','','Replying to '),n,el('span','grow'),ib(IC.x,'Cancel reply',()=>setReply(null),16));b.style.display='flex';$('#in').focus()}
function composer(i,bar,send){const ac=el('div'),rb=el('div'),ty=el('div');ac.id='ac';rb.id='rbar';ty.id='typ';bar.append(ac,rb,ty);
 let sel=0,items=[],tok=null,lastT=0;
 const grow=()=>{i.style.height='auto';i.style.height=Math.min(i.scrollHeight+(i.offsetHeight-i.clientHeight),Math.round(innerHeight*.4))+'px'};
 const hide=()=>{ac.style.display='none';items=[];tok=null};
 const draw2=()=>{ac.replaceChildren(el('div','ah','Members'));items.forEach((u,k)=>{const r=el('div','ar'+(k===sel?' on':''));
   if(u.special){r.append(el('span','ai0','@'),el('b','',u.special),el('span','mu',u.desc))}
   else{const w=el('div','st'+(u.online?' on':'')),n=el('b','',dn(u));w.append(av(u.id,u.username,u.theme));nameFx(n,u,(THEMES[u.theme]||THEMES.midnight)[0]);r.append(w,n)}
   r.onmousedown=e=>{e.preventDefault();pick(k)};r.onmouseenter=()=>{sel=k;[...ac.querySelectorAll('.ar')].forEach((x,j)=>x.classList.toggle('on',j===k))};ac.append(r)});ac.style.display='block'};
 const upd=()=>{const pos=i.selectionStart,m=/(?:^|[\s(])@([A-Za-z0-9_.]*)$/.exec(i.value.slice(0,pos));if(!m||!ch)return hide();
  tok={start:pos-m[1].length-1,end:pos};items=acList(m[1].toLowerCase());if(!items.length)return hide();sel=Math.min(sel,items.length-1);draw2()};
 const pick=k=>{const u=items[k],nm=u.special||u.username,v=i.value,p=tok.start+nm.length+2;i.value=v.slice(0,tok.start)+'@'+nm+' '+v.slice(tok.end);i.setSelectionRange(p,p);hide();grow();i.focus()};
 const typing=()=>{if(!ch||!i.value.trim()||Date.now()-lastT<3000||ws.readyState!==1)return;lastT=Date.now();ws.send(JSON.stringify({type:'typing',channel:ch}))};
 i.addEventListener('keydown',e=>{
  if(ac.style.display==='block'){
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;draw2();return}
   if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();pick(sel);return}
   if(e.key==='Escape'){e.preventDefault();hide();return}}
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send();grow();hide();return}
  if(e.key==='Escape'&&replyTo){setReply(null);return}
  if(e.key==='ArrowUp'&&!i.value){const mine=[...document.querySelectorAll('#msgs .m')].filter(n=>+n.dataset.uid===me.id).pop();if(mine){e.preventDefault();editMsg(mine)}}});
 i.addEventListener('input',()=>{grow();upd();typing()});i.addEventListener('click',upd);
 i.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key))upd()});i.addEventListener('blur',()=>setTimeout(hide,120))}

// ================= 4. message actions: hover bar, Shift quick actions, right-click menu =================
const copyTxt=s=>{if(navigator.clipboard)return navigator.clipboard.writeText(s).catch(()=>{});const t=el('textarea');t.value=s;document.body.append(t);t.select();document.execCommand('copy');t.remove()};
const canPin=m=>m.channel.startsWith('dm')||isStaff()||ownerOf(m.channel),canDel=m=>m.uid===me.id||isStaff()||ownerOf(m.channel);
const hasPing=m=>m.uid!==me.id&&(m.ev||(m.mentions||[]).includes(me.id));
const dmKnown=k=>[...friends.filter(f=>f.status==='ok'),...dmList,...dmReqs].some(f=>dmKey(f.id)===k),isReq=k=>dmReqs.some(f=>dmKey(f.id)===k);
const isPing=m=>m.uid!==me.id&&(m.channel.startsWith('dm')?!isReq(m.channel):hasPing(m));
addEventListener('keydown',e=>document.body.classList.toggle('shift',e.shiftKey));addEventListener('keyup',e=>document.body.classList.toggle('shift',e.shiftKey));addEventListener('blur',()=>document.body.classList.remove('shift'));
const ctxClose=()=>{const c=$('#ctx');c&&c.remove();document.removeEventListener('mousedown',ctxOut,true);document.removeEventListener('keydown',ctxKey,true);removeEventListener('resize',ctxClose);removeEventListener('blur',ctxClose)};
const ctxOut=e=>{if(!e.target.closest('#ctx'))ctxClose()},ctxKey=e=>{if(e.key==='Escape')ctxClose()};
function ctxOpen(x,y,items){ctxClose();const c=el('div','ctx');c.id='ctx';
 items.forEach(it=>{if(it==='sep')return c.append(el('div','cs'));if(it.node)return c.append(it.node);const[l,fn,o]=it,b=el('div','ci'+(o&&o.danger?' dg':''));{const sp=el('span','',l);if(o&&o.sub){sp.style.display='grid';sp.append(el('small','',o.sub))}b.append(sp)}if(o&&o.ic)b.append(ic(o.ic,16));b.onclick=e=>{ctxClose();fn(e)};c.append(b)});
 document.body.append(c);c.style.left=Math.max(8,Math.min(x,innerWidth-c.offsetWidth-8))+'px';c.style.top=Math.max(8,Math.min(y,innerHeight-c.offsetHeight-8))+'px';
 setTimeout(()=>{document.addEventListener('mousedown',ctxOut,true);document.addEventListener('keydown',ctxKey,true);addEventListener('resize',ctxClose);addEventListener('blur',ctxClose)},0)}
function msgMenu(m,d,x,y,target){const it=[],sel=String(getSelection()||'').trim(),a=target&&target.closest&&target.closest('a');
 if(a){it.push(['Open Link',()=>window.open(a.href,'_blank','noopener')],['Copy Link',()=>copyTxt(a.href)],'sep')}
 if(sel)it.push(['Copy',()=>copyTxt(sel)],'sep');
 it.push(['Add Reaction',()=>reactPick(d),{ic:IC.smile}]);
 if(m.uid===me.id&&!parsePoll(m.body)&&m.body!==WAVE_TOKEN)it.push(['Edit Message',()=>editMsg(d),{ic:IC.edit}]);
 if(canPin(m))it.push([m.pinned?'Unpin Message':'Pin Message',()=>pinMsg(m),{ic:IC.pin}]);
 it.push(['Reply',()=>setReply(m),{ic:IC.reply}],['Copy Text',()=>copyTxt(tokText(m.body)),{ic:IC.copy}],'sep',['Copy Message ID',()=>copyTxt(String(m.id))]);
 if(canDel(m))it.push(['Delete Message',e=>delMsg(m,e&&e.shiftKey),{danger:1,ic:IC.trash}]);
 ctxOpen(x,y,it)}
function toolbar(m,d){const t=el('div','tb'),mk=(ico,title,fn,cls)=>{const b=ib(ico,title,fn,18);if(cls)b.className+=' '+cls;return b};
 t.append(mk(IC.smile,'Add Reaction',()=>reactPick(d)),mk(IC.reply,'Reply',()=>setReply(m)));
 if(m.uid===me.id)t.append(mk(IC.edit,'Edit',()=>editMsg(d)));
 t.append(mk(IC.copy,'Copy Text',()=>copyTxt(tokText(m.body)),'xs'));      // xs = only while Shift is held
 if(canPin(m))t.append(mk(IC.pin,m.pinned?'Unpin Message':'Pin Message',()=>pinMsg(m),'xs'));
 if(canDel(m))t.append(mk(IC.trash,'Delete Message (Shift+click skips the prompt)',e=>delMsg(m,e.shiftKey),'xs dng'));
 t.append(mk(IC.dots,'More',e=>{const r=e.currentTarget.getBoundingClientRect();msgMenu(m,d,r.left,r.bottom+4)}));return t}
function delMsg(m,instant){const go=()=>api('msg/'+m.id,'DELETE').catch(fail);if(instant)return go();
 const ov=el('div','dlg'),c=el('div','dc'),pv=el('div','dpv'),no=el('button','g','Cancel'),yes=el('button','dgb','Delete'),bt=el('div','dbt'),esc=e=>{if(e.key==='Escape')off();if(e.key==='Enter'){off();go()}},off=()=>{ov.remove();removeEventListener('keydown',esc)};
 pv.append(render(m,false,false));bt.append(no,yes);c.append(el('h3','','Delete Message'),el('div','mu','Are you sure you want to delete this message?'),pv,el('div','dtip','Tip: hold Shift while clicking Delete to skip this prompt.'),bt);
 no.onclick=off;yes.onclick=()=>{off();go()};ov.onmousedown=e=>{if(e.target===ov)off()};addEventListener('keydown',esc);ov.append(c);document.body.append(ov);yes.focus()}
function editMsg(d){const m=d._m;if(!m||m.uid!==me.id||parsePoll(m.body)||m.body===WAVE_TOKEN||d.classList.contains('editing'))return;d.classList.add('editing');
 const mt=d.querySelector('.mt'),bx=el('div','eb'),ta=el('textarea'),hint=el('div','eh'),cx=el('a','','cancel'),sv=el('a','','save');
 const done=()=>{d.classList.remove('editing');bx.replaceWith(mt)},save=async()=>{const v=ta.value.trim();if(!v){done();return delMsg(m,false)}if(v===m.body)return done();try{await api('msg/'+m.id,'PUT',{body:v});done()}catch(e){fail(e)}};
 ta.value=m.body;ta.maxLength=1000;ta.rows=1;cx.onclick=done;sv.onclick=save;cx.href=sv.href='#';hint.append('escape to ',cx,' • enter to ',sv);
 const grow=()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight+2,260)+'px'};
 ta.onkeydown=e=>{if(e.key==='Escape')done();else if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();save()}};ta.oninput=grow;
 [cx,sv].forEach(a=>{const f=a.onclick;a.onclick=e=>{e.preventDefault();f()}});
 mt.replaceWith(bx);bx.append(ta,hint);grow();ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length)}

// ================= 5. reactions, replies, pins, typing, unread =================
function render(m,grp,isNew){
 const t=THEMES[m.theme]||THEMES.midnight,d=el('div','m'+(grp?' c':'')+(isNew?' new':'')+(hasPing(m)?' ping':'')),b=el('div','mb'),body=el('div','mt'),
  time=new Date(m.ts).toLocaleTimeString([],{hour:'numeric',minute:'2-digit',hour12:PREFS.t24?false:undefined});
 d.dataset.id=m.id;d.dataset.uid=m.uid;d._m=m;const pl=parsePoll(m.body);if(pl){d.classList.add('ispoll');body.append(pollNode(m,pl))}else if(m.body===WAVE_TOKEN)body.append(waveImg(120));else if(m.body)body.append(md(m.body,m));{const an=attachNode(m);an&&body.append(an)}if(isBig(m.body))body.classList.add('big');
 if(m.edited){const e=el('span','ed','(edited)');e.title='Edited '+new Date(m.edited).toLocaleString();body.append(e)}
 if(m.rp){d.classList.add('hasrp');d.append(replyRef(m.rp))}
 if(grp){d.append(el('span','ht',time.replace(/ ?[AP]M/,'')));b.append(body)}
 else{const h=el('div','mh2'),n=el('span','nm',dn(m)),a=av(m.uid,m.username,m.theme);nameFx(n,m,t[0]);n.onclick=a.onclick=e=>profile(m.uid,e);h.append(n);{const tc=tagChip(m.tg);tc&&h.append(tc)}
  (m.badges||[]).forEach(k=>BADGES[k]&&h.append(badge(k)));h.append(el('span','ts',time));
  b.append(h,body);d.append(a)}
 if(m.pinned){const pp=ic(IC.pin,12);pp.classList.add('pinned');pp.setAttribute('aria-label','Pinned');(grp?body:b.querySelector('.mh2')).append(pp)}
 b.append(rxBar(m));d.append(b,toolbar(m,d));
 d.oncontextmenu=e=>{if(e.target.closest('input,textarea,.eb'))return;e.preventDefault();if(m.uid&&e.target.closest('.mh2 .nm,.mh2 .av,.av')&&!e.target.closest('.att,.rx'))return userMenu({id:m.uid,username:m.username},e.clientX,e.clientY);msgMenu(m,d,e.clientX,e.clientY,e.target)};return d}
function replyRef(p){const r=el('div','rp');if(p.gone){r.append(el('i','','Original message was deleted'));return r}
 const n=el('span','nm',dn(p)),t=el('span','rt');nameFx(n,p,(THEMES[p.theme]||THEMES.midnight)[0]);t.append(rich(tokText(p.body).replace(/\s+/g,' ')));
 r.append(av(p.uid,p.username,p.theme),n,t);r.onclick=()=>jumpTo(p.id);return r}
function jumpTo(id){const n=document.querySelector(`#msgs .m[data-id="${id}"]`);if(!n)return;n.scrollIntoView({block:'center',behavior:'smooth'});n.classList.remove('hl');void n.offsetWidth;n.classList.add('hl');setTimeout(()=>n.classList.remove('hl'),2200)}
function rxBar(m){const r=el('div','rx');
 (m.rx||[]).forEach(x=>{const c=el('button','rc'+(x.u.includes(me.id)?' on':''));c.type='button';c.append(rich(x.e),el('span','',String(x.u.length)));c.title=x.u.length+(x.u.length>1?' reactions':' reaction');c.onclick=e=>{e.stopPropagation();reactMsg(m.id,x.e)};r.append(c)});
 if((m.rx||[]).length){const a=el('button','rc add');a.type='button';a.append(ic(IC.smile,16));a.title='Add Reaction';a.onclick=e=>{e.stopPropagation();reactPick(r.closest('.m'))};r.append(a)}return r}
const reactMsg=(id,e)=>api('msg/'+id+'/react','PUT',{emoji:e}).catch(fail),pinMsg=m=>api('msg/'+m.id+'/pin','PUT',{on:!m.pinned}).catch(fail);
function reactPick(d){let p=$('#rpick');if(!p){p=el('div');p.id='rpick';pickerFill(p,s=>{const f=p._cb;p.style.display='none';f&&f(s)});document.body.append(p);
  document.addEventListener('mousedown',e=>{if(!p.contains(e.target)&&Date.now()-p._t>200)p.style.display='none'},true);addEventListener('blur',()=>p.style.display='none')}
 const r=d.getBoundingClientRect(),w=352,h=330;let top=r.top-h-8;if(top<8)top=Math.max(8,Math.min(r.bottom+8,innerHeight-h-8));
 p._cb=s=>reactMsg(d._m.id,s);p._t=Date.now();p.style.left=Math.max(8,Math.min(r.right-w-16,innerWidth-w-8))+'px';p.style.top=top+'px';p.style.display='flex'}
async function showPins(){if(!ch)return;const old=$('#pinp');if(old){old.remove();return}let l;try{l=await api('pins?channel='+ch)}catch(e){return fail(e)}
 const p=el('div');p.id='pinp';p.append(el('div','ph','Pinned Messages'));
 if(!l.length)p.append(el('div','pe','No pinned messages in this channel yet.'));
 l.forEach(m=>{const r=el('div','pr'),hd=el('div','mh2'),n=el('span','nm',dn(m)),b=el('div','mt'),j=el('button','g','Jump');nameFx(n,m,(THEMES[m.theme]||THEMES.midnight)[0]);b.append(md(m.body,m));
  hd.append(n,el('span','ts',new Date(m.ts).toLocaleString([],{dateStyle:'medium',timeStyle:'short'})));j.onclick=()=>{p.remove();jumpTo(m.id)};r.append(hd,b,j);p.append(r)});
 $('#main').append(p);const out=e=>{if(!p.contains(e.target)&&!e.target.closest('.ib')){p.remove();document.removeEventListener('mousedown',out,true)}};setTimeout(()=>document.addEventListener('mousedown',out,true),0)}
function typShow(){const t=$('#typ');if(!t)return;const now=Date.now();[...typers].forEach(([k,v])=>v.t<now&&typers.delete(k));t.replaceChildren();const n=[...typers.values()].map(v=>v.name);if(!n.length)return;
 const dots=el('span','td');dots.append(el('i'),el('i'),el('i'));const b=el('span');
 b.append(...(n.length===1?[el('b','',n[0]),' is typing…']:n.length===2?[el('b','',n[0]),' and ',el('b','',n[1]),' are typing…']:['Several people are typing…']));t.append(dots,b)}
setInterval(typShow,1000);
const tabPing=()=>{tabN++;document.title='('+tabN+') Hearth'};document.addEventListener('visibilitychange',()=>{if(!document.hidden){tabN=0;document.title='Hearth'}});
function onMsg(m){typers.delete(m.uid);typShow();
 if(m.channel.startsWith('dm')&&!dmKnown(m.channel)){if(m.uid!==me.id&&m.channel!==ch)unread[m.channel]=1;refresh().catch(()=>{});if(m.channel!==ch)return}   // new conversation (stranger = message request)
 if(m.channel===ch){add(m,true);if(document.hidden&&isPing(m))tabPing();return}
 if(m.uid===me.id)return;unread[m.channel]=1;if(isPing(m)){pings[m.channel]=(pings[m.channel]||0)+1;tabPing();notifyPing(m)}draw()}
function onDel(id){const n=document.querySelector(`#msgs .m[data-id="${id}"]`);if(!n)return;const nx=n.nextElementSibling,head=!n.classList.contains('c');n.remove();
 if(head&&nx&&nx.classList.contains('m')&&nx.classList.contains('c')&&nx._m)nx.replaceWith(render(nx._m,false,false))}
function redo(n,m){const nn=render(m,n.classList.contains('c'),false);n.replaceWith(nn)}
function onEvt(d){
 if(d.type==='typing'){if(d.channel!==ch)return;typers.set(d.id,{name:d.name,t:Date.now()+6000});typShow();return}
 const id=d.type==='edit'?d.m.id:d.id,n=document.querySelector(`#msgs .m[data-id="${id}"]`);if(!n)return;
 if(d.type==='edit')redo(n,d.m);
 else if(d.type==='react'){n._m.rx=d.rx;if(n.classList.contains('ispoll'))redo(n,n._m);else{const old=n.querySelector('.rx');old&&old.replaceWith(rxBar(n._m))}}
 else if(d.type==='pin'){n._m.pinned=d.pinned;redo(n,n._m)}}
function pingBadge(r,key){if(pings[key])r.append(el('span','nb',pings[key]>99?'99+':String(pings[key])))}
function railBadge(b,keys){const n=keys.reduce((a,k)=>a+(pings[k]||0),0);if(n)b.append(el('span','nb',n>99?'99+':String(n)));if(n||keys.some(k=>unread[k]))b.append(el('i','pip'))}

// ================= 6. styles (injected after app.js's own CSS) =================
function featCss(){if($('#featcss'))return;const s=el('style');s.id='featcss';s.textContent=`
.fx-solid{color:var(--c1)}
.fx-gradient{background:linear-gradient(90deg,var(--c1),var(--c2));-webkit-background-clip:text;background-clip:text;color:transparent}
.fx-neon{color:var(--c1l);text-shadow:0 0 2px var(--c1),0 0 6px var(--c1),0 0 14px var(--c1)}
.fx-toon{color:var(--c1);text-shadow:-1px -1px 0 #17101f,1px -1px 0 #17101f,-1px 1px 0 #17101f,1px 1px 0 #17101f,2px 2px 0 #17101f}
.fx-pop{color:var(--c1l);text-shadow:1px 1px 0 var(--c1d),2px 2px 0 var(--c1d)}
.fx-gummy{background:linear-gradient(180deg,var(--c1l) 0,var(--c1) 50%,var(--c1d) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 1px 0 var(--c1d)) drop-shadow(0 2px 2px #0005)}
.fx-prism{background:linear-gradient(100deg,var(--p1),var(--p2),var(--p3),var(--p4),var(--p1));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gs 6s linear infinite}
@media(prefers-reduced-motion:reduce){.fx-prism,.nm.sup,.bd.hot{animation:none}}
/* ---- name style editor ---- */
.nsw{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:#000b;padding:12px}
.nsbox{display:flex;max-height:94vh;max-width:100%;background:#242328;border-radius:12px;overflow:hidden;box-shadow:0 24px 80px #000c}
.nsp{width:413px;max-width:100%;flex:none;overflow:auto;padding:11px 22px 20px 13px;font-family:"gg sans","Noto Sans","Segoe UI",system-ui,sans-serif}
.nst{margin:0;font-size:20px;line-height:24px;font-weight:700;color:#fff}
.nsh{margin:23px 0 9px;font-size:16px;line-height:20px;font-weight:700;color:#fff;display:flex;align-items:center;gap:6px}.nsh svg{color:#b5bac1;flex:none}
.nsg{display:grid;grid-template-columns:repeat(4,90px);gap:8px 6px}
.nt{position:relative;width:90px;height:68px;padding:0;background:#2d2d31;border:1px solid #3a393e;border-radius:8px;color:#fff;cursor:pointer;display:grid;place-items:center;transition:background .12s,border-color .12s}
.nt:hover{background:#333338;border-color:#47464c}.nt.on,.nt.on:hover{border-color:#5865f2;background:#2d2d31}.nt:focus-visible,.cw:focus-visible{outline:2px solid #5865f2;outline-offset:2px}
.nt .nd{position:absolute;top:2px;right:4px;width:6px;height:6px;border-radius:50%;background:#5865f2}
.ngg{line-height:1;color:#f2f3f5}.nfx{font-size:15px;font-weight:500;line-height:1.3}.nfx.fx-neon{font-weight:700}.nfx.fx-gummy{font-weight:600}
.nt[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#111214;color:#dbdee1;font:600 14px/16px "gg sans","Noto Sans","Segoe UI",system-ui,sans-serif;padding:8px 12px;border-radius:5px;white-space:nowrap;pointer-events:none;z-index:6;box-shadow:0 8px 16px #0006}
.nt[data-tip]:hover::before{content:'';position:absolute;bottom:calc(100% + 3px);left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#111214;border-bottom:0;pointer-events:none;z-index:6}
.nsc{display:flex;gap:8px}
.cw{position:relative;width:40px;height:40px;padding:0;flex:none;border:0;border-radius:8px;cursor:pointer;display:grid;place-items:center;transition:transform .1s}.cw:hover{transform:scale(1.04)}
.cw.on{box-shadow:inset 0 0 0 2px #5865f2,inset 0 0 0 4px #242328}
.cw.eye{background:#323136;border:1px solid #3a393e;color:#fff;overflow:hidden}.cw.eye.on{box-shadow:inset 0 0 0 2px #5865f2,inset 0 0 0 4px #242328}
.cw.eye input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;padding:0;border:0}
.nspv{width:340px;flex:none;background:#1e1f22;padding:20px;display:flex;flex-direction:column;gap:6px;overflow:auto;font-family:"gg sans","Noto Sans","Segoe UI",system-ui,sans-serif}
.pvb{height:84px;border-radius:10px 10px 0 0;margin:-2px -2px 0}.pva{margin:-34px 0 0 14px;width:72px;height:72px;border-radius:50%;border:6px solid #1e1f22;overflow:hidden;background:#1e1f22}.pva .av{width:100%;height:100%;cursor:default;transform:none;box-shadow:none;font-size:28px}
.pvn{font-size:24px;line-height:1.25;font-weight:700;padding:4px 2px 0;word-break:break-all;min-height:34px}.pvc{color:#949ba4;font-size:13px;padding:0 2px 10px}
.pvh{font-size:12px;font-weight:700;color:#b5bac1;text-transform:uppercase;letter-spacing:.03em;margin-top:6px}
.pvm{display:flex;gap:12px;padding:8px;background:#2b2d31;border-radius:8px}.pvm .av{width:36px;height:36px;font-size:14px}
.nsf{display:flex;gap:8px;align-items:center;margin-top:auto;padding-top:20px}.nsf button{white-space:nowrap}.lnk{background:none!important;color:#b5bac1;padding:8px 4px}.lnk:hover{text-decoration:underline}
@media(max-width:800px){.nsbox{flex-direction:column;overflow:auto}.nspv{width:auto;order:-1}.nsp{overflow:visible}}
/* ---- messages ---- */
#main{position:relative}.rb{overflow:visible;position:relative}
.m.ping{background:#f0b13214;box-shadow:inset 2px 0 0 #f0b132}.m.ping:hover{background:#f0b13220}
.m.hl{animation:hl 2.2s ease}@keyframes hl{0%,55%{background:#5865f240}}
.mention{background:#5865f24d;color:#c9cdfb;border-radius:3px;padding:0 2px;font-weight:500;cursor:pointer}.mention:hover{background:#5865f2;color:#fff}.mention.me{background:#f0b1324d;color:#ffe4a8}.mention.me:hover{background:#f0b132;color:#1e1f22}
.mt a{color:#00a8fc;text-decoration:none}.mt a:hover{text-decoration:underline}.mt strong{font-weight:700}.mt u{text-decoration:underline}
.mt code{background:#1e1f22;border-radius:4px;padding:.1em .35em;font:.85em/1.4 Consolas,Menlo,"Courier New",monospace}
.mt pre{background:#2b2d31;border:1px solid #1e1f22;border-radius:6px;padding:8px 10px;margin:4px 0;overflow:auto;white-space:pre;max-width:min(560px,100%)}.mt pre code{background:none;padding:0;font-size:13px}
.mt blockquote{margin:2px 0;padding:0 8px 0 12px;border-left:4px solid #4e5058;border-radius:2px;white-space:pre-wrap}
.sp{background:#1e1f22;border-radius:3px;padding:0 2px;cursor:pointer;color:transparent}.sp:not(.on) *{visibility:hidden}.sp.on{background:#ffffff1a;color:inherit}
.ed{font-size:10px;color:#949ba4;margin-left:4px;user-select:none}.pinned{color:#949ba4;margin-left:6px;vertical-align:-2px}
.m.hasrp{padding-top:24px}
.rp{position:absolute;left:36px;right:48px;top:2px;height:20px;display:flex;align-items:center;gap:4px;padding-left:34px;font-size:14px;color:#b5bac1;white-space:nowrap;cursor:pointer}
.rp::before{content:'';position:absolute;left:0;top:10px;width:28px;height:12px;border-left:2px solid #4e5058;border-top:2px solid #4e5058;border-top-left-radius:6px}
.rp .av{width:16px;height:16px;font-size:9px;flex:none}.rp .nm{flex:none;font-size:14px}.rp .rt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.rp:hover .rt{color:#fff}.rp i{color:#949ba4}
.tb{position:absolute;right:16px;top:-16px;display:none;background:#313338;border:1px solid #26272b;border-radius:8px;padding:2px;box-shadow:0 2px 10px #0006;z-index:3}
.m:hover .tb,.m.editing .tb{display:flex}.tb .ib{padding:6px 7px}.tb .xs{display:none}body.shift .m:hover .tb .xs{display:grid}.tb .dng{color:#f23f43}.tb .dng:hover{background:#f23f43;color:#fff}
.rx{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.rx:empty{display:none}
.rc{display:flex;align-items:center;gap:6px;height:26px;padding:0 6px;background:#2b2d31;border:1px solid transparent;border-radius:8px;color:#b5bac1;font-size:14px;font-weight:600}.rc:hover{border-color:#4e5058;background:#2b2d31}
.rc.on{background:#5865f233;border-color:#5865f2;color:#c9cdfb}.rc .em{width:16px;height:16px;margin:0;vertical-align:0}.rc.add{opacity:0}.m:hover .rc.add{opacity:1}
.eb{margin-top:2px}.eb textarea{width:100%;min-height:44px;max-height:260px;background:#383a40;border:0;border-radius:8px;padding:11px 16px;resize:none;line-height:20px;display:block}.eh{font-size:12px;color:#b5bac1;margin-top:4px}.eh a{color:#00a8fc;text-decoration:none}.eh a:hover{text-decoration:underline}
.m.editing{background:#2e3035}
#rpick{position:fixed;z-index:60;width:352px;height:330px;background:#2b2d31;border:1px solid #1e1f22;border-radius:10px;display:none;flex-direction:column;box-shadow:0 10px 40px #000a;overflow:hidden}
/* ---- composer ---- */
#in:focus{outline:none}#bar{align-items:flex-end}#bar>.ib{height:44px}
#in{display:block;min-height:44px;height:44px;max-height:40vh;resize:none;line-height:20px;width:100%;overflow-y:auto}
#ac{display:none;position:absolute;left:16px;right:16px;bottom:calc(100% - 4px);max-height:320px;overflow:auto;background:#2b2d31;border:1px solid #1e1f22;border-radius:8px;padding:8px;box-shadow:0 8px 24px #0009;z-index:20}
.ah{font-size:12px;font-weight:700;color:#b5bac1;text-transform:uppercase;padding:4px 8px 6px}.ar{display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:4px;cursor:pointer}.ar.on{background:#404249}
.ar .av{width:24px;height:24px;font-size:11px}.ar .st::after{width:7px;height:7px;border-width:2px;right:-3px;bottom:-3px}.ar .mu{margin:0;font-size:13px}.ai0{width:24px;text-align:center;font-weight:700;color:#b5bac1}
#rbar{display:none;position:absolute;left:16px;right:16px;bottom:100%;align-items:center;gap:6px;padding:8px 12px;background:#2b2d31;border-radius:8px 8px 0 0;font-size:14px;color:#b5bac1;margin-bottom:-1px}
#typ{position:absolute;left:18px;bottom:3px;font-size:13px;color:#dbdee1;height:20px;display:flex;align-items:center;gap:6px}
.td{display:inline-flex;gap:2px}.td i{width:5px;height:5px;border-radius:50%;background:#dbdee1;animation:tdp 1.2s ease-in-out infinite}.td i:nth-child(2){animation-delay:.15s}.td i:nth-child(3){animation-delay:.3s}@keyframes tdp{0%,60%,100%{opacity:.35;transform:none}30%{opacity:1;transform:translateY(-2px)}}
/* ---- context menu, dialogs, pins ---- */
#ctx{position:fixed;z-index:80;min-width:188px;background:#111214;border-radius:6px;padding:6px 8px;box-shadow:0 8px 16px #0006,0 0 0 1px #0004;font-size:14px}
.ci{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:6px 8px;margin:2px 0;border-radius:3px;color:#b5bac1;cursor:pointer;font-weight:500}.ci:hover{background:#5865f2;color:#fff}.ci.dg{color:#f23f43}.ci.dg:hover{background:#da373c;color:#fff}.cs{height:1px;background:#2b2d31;margin:4px -2px}
.dlg{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:#000a}.dc{width:min(440px,94vw);background:#313338;border-radius:8px;padding:16px;display:grid;gap:12px;box-shadow:0 12px 48px #000a}.dc h3{margin:0;font-size:20px;color:#fff}
.dpv{pointer-events:none;border:1px solid #1e1f22;border-radius:6px;padding:4px 0;max-height:200px;overflow:hidden;background:#2b2d31}.dpv .m{margin-top:0}.dpv .tb{display:none!important}.dtip{font-size:12px;color:#949ba4}
.dbt{display:flex;justify-content:flex-end;gap:8px}.dgb{background:#da373c}.dgb:hover{background:#a12828}
#pinp{position:absolute;top:52px;right:16px;width:min(420px,calc(100% - 32px));max-height:70vh;overflow:auto;background:#2b2d31;border:1px solid #1e1f22;border-radius:8px;box-shadow:0 8px 24px #0009;z-index:15}
.ph{padding:12px 16px;font-weight:700;color:#fff;border-bottom:1px solid #1e1f22}.pe{padding:24px 16px;color:#949ba4;text-align:center}.pr{padding:10px 16px;border-bottom:1px solid #1e1f22;display:grid;gap:4px;justify-items:start}.pr .mt{max-height:120px;overflow:hidden}.pr button{padding:4px 10px;font-size:13px}
/* ---- unread + ping badges ---- */
.ch.unr{color:#fff;font-weight:700}.nb{background:#f23f43;color:#fff;border-radius:8px;min-width:16px;height:16px;padding:0 4px;font-size:12px;font-weight:700;line-height:16px;text-align:center;flex:none}
.rb .nb{position:absolute;right:-4px;bottom:-4px;box-sizing:content-box;border:4px solid #1e1f22;height:16px;min-width:16px;padding:0 3px;z-index:2}
.rb .pip{position:absolute;left:-12px;top:50%;margin-top:-4px;width:4px;height:8px;border-radius:0 4px 4px 0;background:#fff}
`;document.head.append(s)}
