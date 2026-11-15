// Hearth profile kit: custom badge icons, display names, pronouns, profile effects/themes, server tags.
(function(){
const S=(p,v='0 0 16 16')=>`<svg viewBox="${v}" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
// ---- badge icons (all custom SVG, drawn here) ----
const BD={
 staff:{n:'Staff',g:'linear-gradient(120deg,#ff9a4d,#ff3d81 50%,#a855f7)',d:'Part of the Hearth staff team.',i:S('<path d="M8 1.6 13.4 3.6v4c0 3.2-2.2 5.6-5.4 6.8C4.8 13.2 2.6 10.800 2.600 7.600v-4z" fill="currentColor" fill-opacity=".25"/><path d="m8 5.200.9 1.800 2 .3-1.450 1.400.35 2L8 9.800 6.200 10.700l.35-2L5.100 7.300l2-.3z" fill="currentColor"/>')},
 verified:{n:'Verified',g:'linear-gradient(120deg,#22d3ee,#3b82f6 50%,#8b5cf6)',d:'A verified account.',i:S('<path d="M8 1.500l1.600 1.200 2-.1.7 1.900 1.700 1.100-.6 1.900.6 1.900-1.700 1.100-.7 1.900-2-.1L8 14.500l-1.600-1.200-2 .1-.7-1.900L2 10.400l.6-1.900L2 6.600l1.700-1.100.7-1.900 2 .1z" fill="currentColor" fill-opacity=".25"/><path d="m5.500 8.100 1.700 1.700 3.300-3.400" stroke-width="2"/>')},
 og:{n:'OG',c:'#c4491f',d:'One of the very first people here.',i:S('<path d="M2 5.500l3 2.700L8 3l3 5.200 3-2.700-1 7H3z" fill="currentColor" fill-opacity=".3"/><path d="M3.200 13.300h9.600"/>')},
 early:{n:'Early',c:'#1f6f4a',d:'Joined during early access.',i:S('<path d="M8 14V7.500"/><path d="M8 8C8 5 6 3.500 3 3.500 3 6.500 4.800 8 8 8Z" fill="currentColor" fill-opacity=".3"/><path d="M8 9.500c0-2.300 1.500-3.800 4.200-3.800 0 2.400-1.500 3.800-4.200 3.800Z" fill="currentColor" fill-opacity=".3"/>')},
 supporter:{n:'Supporter',c:'#0e7490',d:'Helps keep Hearth running.',i:S('<path d="M4.500 2.500h7l2.200 3.300L8 14 2.300 5.800z" fill="currentColor" fill-opacity=".25"/><path d="M2.300 5.800h11.400M6 5.800 8 14l2-8.200M6 2.500 4.800 5.800M10 2.500l1.200 3.300"/>')},
 mgmt:{n:'Hearth Management',g:'linear-gradient(120deg,#f43f5e,#f97316)',d:'Runs and manages Hearth.',i:S('<path d="M8 1.200c.8 2.200 3.800 3.300 3.800 6.500A3.800 3.800 0 0 1 8 11.500 3.800 3.800 0 0 1 4.200 7.700C4.200 6.300 5 5.500 5.600 4.600 6 5.600 6.600 6 7 6 7.400 4.200 7.300 2.700 8 1.200Z" fill="currentColor" fill-opacity=".3"/><path d="M4 14h8"/>')},
 helper:{n:'Hearth Helper',c:'#15803d',d:'Helps people out around Hearth.',i:S('<path d="M8 13.600S2 10 2 6.200A3 3 0 0 1 8 5a3 3 0 0 1 6 1.200C14 10 8 13.600 8 13.600Z" fill="currentColor" fill-opacity=".25"/><path d="M8 6.600v3M6.500 8.100h3" stroke-width="1.800"/>')},
 bugrep:{n:'Bug Reporter',c:'#2563eb',d:'Reported a bug that got fixed.',i:S('<ellipse cx="8" cy="9.500" rx="3" ry="3.800" fill="currentColor" fill-opacity=".25"/><path d="M6.500 5.800C6.500 4.700 7.100 4 8 4s1.500.7 1.500 1.800M5 8.500H2.500M13.500 8.500H11M5.200 11.500 3.200 13M10.800 11.500l2 1.500M5.200 6 3.500 4.500M10.800 6l1.700-1.500M8 6.500v6.600"/>')},
 elitebug:{n:'Elite Bug Reporter',g:'linear-gradient(120deg,#a855f7,#6366f1 55%,#f59e0b)',d:'Reported many important bugs.',i:S('<ellipse cx="8" cy="9.500" rx="3" ry="3.800" fill="currentColor" fill-opacity=".25"/><path d="M6.500 5.800C6.500 4.700 7.100 4 8 4s1.500.7 1.500 1.800M5 8.500H2.500M13.500 8.500H11M5.200 11.500 3.200 13M10.800 11.500l2 1.500M8 6.500v6.600"/><path d="m12.500 1 .6 1.200 1.300.2-.95.9.2 1.300-1.150-.6-1.150.6.2-1.300-.95-.9 1.300-.2z" fill="currentColor" stroke="none"/>')},
 bughunter:{n:'Bug Hunter',c:'#b91c1c',d:'Tracks down the nastiest bugs.',i:S('<circle cx="8" cy="8" r="5.200"/><path d="M8 1.200v3M8 11.800v3M1.200 8h3M11.800 8h3"/><ellipse cx="8" cy="8.300" rx="1.600" ry="2" fill="currentColor"/><path d="M6.700 6.400c0-.7.5-1.200 1.300-1.200s1.300.5 1.300 1.200" stroke-width="1.100"/>')}
};
Object.keys(BD).forEach(k=>{BADGES[k]=BD[k].n});
window.BD=BD;
window.badge=function(k){const full=1;const b=BD[k]||{n:k},s=el('span','bd bi'+(b.g?' bg':'')+(full?'':' ico'));if(b.g)s.style.setProperty('--bgd',b.g);else if(b.c)s.style.background=b.c;
 s.title=b.n+(b.d?' — '+b.d:'');s.setAttribute('aria-label',b.n);if(b.i){const i=el('span','bic');i.innerHTML=b.i;s.append(i)}if(full||!b.i)s.append(el('span','',b.n));return s};
// ---- display name / pronouns ----
window.dn=u=>{if(u&&window.DECO){const id=u.uid||u.id;if(id&&'adeco' in u)DECO[id]=u.adeco||null}return(u&&(u.dname||u.username))||''};
// ---- profile themes (extra presets) ----
Object.assign(THEMES,{rose:['#ff5c8a','#4a1530'],gold:['#f5b942','#3d2a0b'],mint:['#7ee8c0','#0d3a33'],lavender:['#b18cff','#2a1d52'],mono:['#9aa0ab','#17181b']});
window.PEFFECTS=[['none','None'],['bubbles','Bubbles'],['sparkles','Sparkles'],['snow','Snowfall'],['embers','Embers'],['hearts','Hearts'],['stars','Starfield'],['aurora','Aurora'],['rain','Rain']];
const rnd=(a,b)=>a+Math.random()*(b-a);
window.pfx=function(name){const w=el('div','pfx fx-'+name);if(!name||name==='none')return null;
 const n={bubbles:14,sparkles:16,snow:30,embers:18,hearts:12,stars:26,aurora:0,rain:34}[name]||0,ch={hearts:'♥',sparkles:'✦',snow:'•',stars:'★'}[name]||'';
 for(let i=0;i<n;i++){const p=el('i','',ch);p.style.cssText=`left:${rnd(0,100)}%;--s:${rnd(.5,1.4).toFixed(2)};--d:${rnd(4,10).toFixed(1)}s;--dl:${(-rnd(0,10)).toFixed(1)}s;--x:${rnd(-24,24).toFixed(0)}px`;w.append(p)}
 return w};
// ---- server tags ----
// full-colour tag icons (each its own little picture); 'mascot' is reserved for the Hearth Lounge
const P=(d,f,x='')=>`<path d="${d}" fill="${f}" ${x}/>`,L=(d,c,w=1)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const TI={
 flame:P('M8 .8C9 3.500 12.500 5.200 12.500 9.500A4.500 4.500 0 0 1 3.500 9.500C3.500 7.500 4.500 6.500 5.300 5.500 5.600 6.800 6.200 7.300 6.800 7.300 6.800 5 7 3 8 .8Z','#ff7a1a')+P('M8 8.500C9.500 9.800 10.300 10.500 10.300 11.600A2.300 2.300 0 0 1 5.700 11.600C5.700 10.500 6.700 9.800 8 8.500Z','#ffd166'),
 star:P('M8 1.200 9.900 5.200 14.300 5.800 11.100 8.800 11.900 13.200 8 11.100 4.100 13.200 4.900 8.800 1.700 5.800 6.100 5.200Z','#ffc933','stroke="#e09a0a" stroke-width=".8" stroke-linejoin="round"'),
 bolt:P('M9.500 1 3.500 9H7.500L6.500 15 12.500 6.500H8.500Z','#ffd23f','stroke="#e8a000" stroke-width=".8" stroke-linejoin="round"'),
 heart:P('M8 14C2 10 1 6 3 3.800 4.800 2 7 2.600 8 4.400 9 2.600 11.200 2 13 3.800 15 6 14 10 8 14Z','#ff4d6d')+P('M4 5.200C4.300 4.400 5.200 4.100 5.900 4.500 5.200 4.500 4.600 4.900 4.400 5.700Z','#ffb3c0'),
 skull:P('M8 1.500C4.800 1.500 3 3.700 3 6.300 3 8 3.800 9.200 5 9.900V12.500H11V9.900C12.200 9.200 13 8 13 6.300 13 3.700 11.200 1.500 8 1.500Z','#f1f1f4','stroke="#9a9ca8" stroke-width=".7"')+'<circle cx="5.800" cy="6.800" r="1.500" fill="#2a2a33"/><circle cx="10.200" cy="6.800" r="1.500" fill="#2a2a33"/>'+P('M8 8.200 7.300 9.600H8.700Z','#2a2a33')+L('M7 10.800V12.500M9 10.800V12.500','#2a2a33',.8),
 leaf:P('M13.500 2C6 2 2.500 5.500 2.500 9.500 2.500 11 3.300 12.300 4.500 12.800 5 9.500 7.500 7 10 6 7.600 8 6.200 10.200 5.500 13.200 11.500 12.500 14 8 13.500 2Z','#43b05a')+L('M3 14Q5 9.500 9.500 6.500','#1f5a2c',1),
 moon:P('M10.500 1.500A6.500 6.500 0 1 0 14.500 10 5.200 5.200 0 0 1 10.500 1.500Z','#ffd966','stroke="#d9a620" stroke-width=".7" stroke-linejoin="round"')+P('M12.300 2.800 12.800 4 14 4.400 12.800 4.800 12.300 6 11.800 4.800 10.600 4.400 11.800 4Z','#fff3b0'),
 crown:P('M2 12.500 1.500 4.500 5 7.500 8 3 11 7.500 14.500 4.500 14 12.500Z','#ffc933','stroke="#e09a0a" stroke-width=".7" stroke-linejoin="round"')+P('M2 12.500H14V14H2Z','#e09a0a')+'<circle cx="8" cy="10" r="1.100" fill="#e8344f"/><circle cx="4.800" cy="10.300" r=".8" fill="#4cc9f0"/><circle cx="11.200" cy="10.300" r=".8" fill="#4cc9f0"/>',
 gem:P('M4.500 2.500H11.500L14.500 6 8 14.500 1.500 6Z','#5cd6ff')+P('M4.500 2.500H11.500L10.500 6H5.500Z','#a6ecff')+L('M1.500 6H14.500M5.500 6 8 14.500 10.500 6M4.500 2.500 5.500 6M11.500 2.500 10.500 6','#2aa6dd',.7),
 paw:P('M8 8.500C5.500 8.500 3.800 10.800 4.500 12.500 5 13.700 6.500 13.500 8 13 9.500 13.500 11 13.700 11.500 12.500 12.200 10.800 10.500 8.500 8 8.500Z','#ff8fb8')+'<ellipse cx="3.300" cy="7" rx="1.300" ry="1.800" fill="#ff8fb8"/><ellipse cx="6" cy="3.900" rx="1.400" ry="1.900" fill="#ff8fb8"/><ellipse cx="10" cy="3.900" rx="1.400" ry="1.900" fill="#ff8fb8"/><ellipse cx="12.700" cy="7" rx="1.300" ry="1.800" fill="#ff8fb8"/>',
 ghost:P('M8 1.500C4.800 1.500 3 4 3 7V14.200L5 12.800 6.500 14.200 8 12.800 9.500 14.200 11 12.800 13 14.200V7C13 4 11.200 1.500 8 1.500Z','#f4f4ff','stroke="#b9b9d6" stroke-width=".8" stroke-linejoin="round"')+'<ellipse cx="6.200" cy="7" rx=".9" ry="1.300" fill="#2a2a33"/><ellipse cx="9.800" cy="7" rx=".9" ry="1.300" fill="#2a2a33"/><ellipse cx="8" cy="9.500" rx=".8" ry="1" fill="#2a2a33"/><ellipse cx="4.800" cy="9" rx="1" ry=".6" fill="#ffb3cf"/><ellipse cx="11.200" cy="9" rx="1" ry=".6" fill="#ffb3cf"/>',
 music:P('M6 2.800 13 1.500V4.500L6 5.800Z','#a78bfa')+P('M6 3H7.200V11.500H6Z','#7c5cff')+P('M11.800 2H13V10H11.800Z','#7c5cff')+'<ellipse cx="4.800" cy="11.800" rx="2.200" ry="1.700" fill="#7c5cff"/><ellipse cx="10.600" cy="10.300" rx="2.200" ry="1.700" fill="#7c5cff"/>',
 mascot:P('M8 .6C9.200 2.300 11 3 10.600 5.200 10 5.600 9 5.700 8 5.700S6 5.600 5.400 5.200C5 3 6.800 2.300 8 .6Z','#ff8a3d')+'<ellipse cx="8" cy="10.300" rx="5.600" ry="5" fill="#ff6a4d"/><ellipse cx="8" cy="11.800" rx="3.400" ry="2.800" fill="#ffe0b8"/><ellipse cx="6" cy="9.800" rx=".9" ry="1.200" fill="#2a1630"/><ellipse cx="10" cy="9.800" rx=".9" ry="1.200" fill="#2a1630"/><circle cx="2.800" cy="11" r="1" fill="#ff6a5c"/><circle cx="13.200" cy="11" r="1" fill="#ff6a5c"/>'+L('M6.800 11.800Q8 12.800 9.200 11.800','#2a1630',.8)};
window.TAG_ICONS=Object.keys(TI).filter(k=>k!=='mascot');
window.tagIcon=(k,sz=12)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 16 16');s.setAttribute('width',sz);s.setAttribute('height',sz);s.innerHTML=TI[k]||TI.star;return s};
window.tagChip=function(t){if(!t||!t.tag)return null;const c=el('span','stg');c.style.setProperty('--tc',t.tag_color||'#5865f2');c.title='Server tag: '+t.tag;c.append(tagIcon(t.tag_icon),el('b','',t.tag));return c};
// ---- favicon (mascot) ----
(function(){let l=document.querySelector('link[rel=icon]');if(!l){l=document.createElement('link');l.rel='icon';document.head.append(l)}l.type='image/svg+xml';l.href='/favicon.svg'})();
// ---- styles ----
const st=document.createElement('style');st.textContent=`
.bd.bi{gap:4px;padding:2px 8px 2px 5px;color:#fff;background:#2b2d31;box-shadow:inset 0 0 0 1px #ffffff18}.bd.bi .bic{display:grid}.bd.bi svg{display:block}
.bd.bg{background:var(--bgd);background-size:200% 100%;animation:bgs 5s ease-in-out infinite;box-shadow:0 0 10px -2px #ffffff40,inset 0 0 0 1px #ffffff30;text-shadow:0 1px 2px #0005}
@keyframes bgs{50%{background-position:100% 0}}
.stg{display:inline-flex;align-items:center;gap:3px;margin-left:6px;padding:1px 6px 1px 4px;border-radius:5px;font-size:11px;font-weight:700;color:var(--tc);background:color-mix(in srgb,var(--tc) 18%,#1e1f22);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tc) 40%,transparent);vertical-align:1px;letter-spacing:.03em}.stg b{font-weight:800}
.pns{font-size:13px;color:#b5bac1;font-weight:400;margin-top:2px}.pun{font-size:13px;color:#b5bac1;font-weight:500}
.pfx{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2;border-radius:inherit}.pfx i{position:absolute;top:-8%;font-style:normal;color:#fff;font-size:calc(14px*var(--s));animation:pfall var(--d) linear var(--dl) infinite;opacity:.0}
@keyframes pfall{0%{transform:translate(0,0);opacity:0}10%{opacity:.9}90%{opacity:.9}100%{transform:translate(var(--x),115%);opacity:0}}@keyframes prise{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:.85}100%{transform:translate(var(--x),-120%) scale(1.1);opacity:0}}@keyframes ptw{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1)}}
.fx-bubbles i{top:auto;bottom:-6%;width:calc(16px*var(--s));height:calc(16px*var(--s));border-radius:50%;border:1.5px solid #ffffffa0;background:radial-gradient(circle at 30% 30%,#ffffff70,#ffffff10);font-size:0;animation-name:prise}
.fx-embers i{top:auto;bottom:-6%;width:calc(5px*var(--s));height:calc(5px*var(--s));border-radius:50%;background:#ffa24d;box-shadow:0 0 8px 2px #ff6a2b;font-size:0;animation-name:prise}
.fx-hearts i{top:auto;bottom:-6%;color:#ff6b9a;animation-name:prise}
.fx-sparkles i,.fx-stars i{top:calc((var(--s) - .5)*110%);animation:ptw var(--d) ease-in-out var(--dl) infinite;color:#ffe9a8}.fx-stars i{color:#fff}.fx-sparkles i:nth-child(odd){color:#ffd1f3}.fx-sparkles i:nth-child(3n){top:calc((var(--s) - .3)*60%)}.fx-stars i:nth-child(3n){top:calc(var(--s)*40%)}
.fx-snow i{font-size:calc(18px*var(--s))}
.fx-rain i{width:1.5px;height:calc(14px*var(--s));background:linear-gradient(#fff0,#9fd0ffd0);font-size:0;--x:-10px;animation-duration:calc(var(--d)/5)}
.fx-aurora{background:linear-gradient(115deg,transparent 10%,#34d39955 30%,#6366f155 50%,#e879f955 70%,transparent 90%);background-size:250% 100%;animation:gs2 7s ease-in-out infinite;mix-blend-mode:screen}
.pcd{--pg:none}
@media(prefers-reduced-motion:reduce){.pfx i,.pfx,.bd.bg{animation:none}}
/* edit-profile extras */
.fld{display:grid;gap:4px}.fld label{font-size:12px;font-weight:700;color:#b5bac1}.fld input{background:#1e1f22;border:0;border-radius:6px;padding:10px;outline:none;color:#dbdee1}.fld input:focus{box-shadow:0 0 0 2px var(--ac)}
.efg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.efb{position:relative;overflow:hidden;height:54px;border-radius:8px;background:#1e1f22;border:2px solid transparent;color:#dbdee1;font-size:12px;font-weight:700;display:grid;place-items:end center;padding:0 0 5px}.efb:hover{background:#2a2c31}.efb.on{border-color:var(--ac)}.efb .pfx{background-color:#0003}.efb span{position:relative;z-index:3;text-shadow:0 1px 2px #000}
.cr{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.cr input[type=color]{width:38px;height:30px;padding:0;border:0;background:none;cursor:pointer}.cr span{font-size:12px;color:#949ba4}
.tgl{display:grid;gap:6px}.tgr{display:flex;align-items:center;gap:10px;padding:8px 10px;background:#1e1f22;border-radius:8px;cursor:pointer;border:2px solid transparent;color:#dbdee1}.tgr.on{border-color:var(--ac)}.tgr:hover{background:#2a2c31}.tgr .grow{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tgi{display:flex;gap:5px;flex-wrap:wrap}.tgi button{padding:6px;background:#1e1f22;border-radius:6px;color:#dbdee1;border:2px solid transparent}.tgi button.on{border-color:var(--ac)}
.pcard-ft{}
`;document.head.append(st);
})();
