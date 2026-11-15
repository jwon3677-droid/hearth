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
window.badge=function(k){const b=BD[k]||{n:k},s=el('span','bd bi'+(b.g?' bg':''));if(b.g)s.style.setProperty('--bgd',b.g);else if(b.c)s.style.background=b.c;
 s.title=b.n;if(b.i){const i=el('span','bic');i.innerHTML=b.i;s.append(i)}s.append(el('span','',b.n));return s};
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
// mascot-style tag icons: the Hearth flame-buddy, each wearing something different
const BODY='M2.7 10.2a5.3 4.8 0 1 0 10.6 0 5.3 4.8 0 1 0-10.6 0Z',EYES='M5.45 9.6a.75 1.1 0 1 0 1.5 0 .75 1.1 0 1 0-1.5 0ZM9.05 9.6a.75 1.1 0 1 0 1.5 0 .75 1.1 0 1 0-1.5 0Z',SMILE='M6.4 11.7Q8 13.1 9.6 11.7Q8 12.3 6.4 11.7Z';
const mas=(top,o={})=>`<path fill-rule="evenodd" d="${o.body||BODY}${o.eyes===undefined?EYES:o.eyes}${o.mouth===undefined?SMILE:o.mouth}"/>`+top;
const TI={
 flame:mas('<path d="M8 .6C9.300 2.300 10.800 3.200 10.300 5.300 9.700 5.700 8.800 5.800 8 5.800S6.300 5.700 5.700 5.300C5.200 3.200 6.700 2.300 8 .6Z"/>'),
 star:mas('<path d="m8 .4 1.100 2.200 2.400.3-1.800 1.600.5 2.400L8 5.700 5.800 6.900l.5-2.400L4.500 2.900l2.400-.3z"/>'),
 bolt:mas('<path d="M9 .4 5.600 3.800h1.800L6.600 6l3.800-3.600H8.600z"/>'),
 heart:mas('<path d="M8 6C4.800 3.700 6 .8 8 2.400 10 .8 11.200 3.700 8 6Z"/>',{eyes:'M5.2 9.100 6.200 8.200 7.200 9.100 6.200 10.400ZM8.800 9.100 9.800 8.200 10.800 9.100 9.800 10.400Z'}),
 skull:mas('<path d="M8 1C9.800 1 10.900 2.200 10.900 3.700 10.900 4.800 10.400 5.400 9.800 5.800V6.300H6.200V5.800C5.600 5.400 5.100 4.800 5.100 3.700 5.100 2.200 6.200 1 8 1Z"/>',{eyes:'M5.300 8.800 6.100 8.100 6.900 8.800 7.700 8.100 8.500 8.800 7.700 9.500 8.500 10.200 7.700 10.900 6.900 10.200 6.100 10.900 5.300 10.200 6.100 9.500Z',mouth:'M6.500 12.300H9.500V12.900H6.500Z'}),
 leaf:mas('<path d="M8 6C4.900 5.700 3.600 3.400 4.100 1.200 6.700 1.200 8.100 2.900 8 6ZM8 6C8.100 3.300 9.700 1.800 12 2.100 12.100 4.400 10.600 5.900 8 6Z"/>'),
 moon:mas('<path d="M9.800 1.300A3.600 3.600 0 1 0 11.400 6C9.100 6 7.700 3.400 9.800 1.300Z"/>',{eyes:'M5.300 9.800H7.100V10.400H5.300ZM8.900 9.800H10.700V10.400H8.900Z'}),
 crown:mas('<path d="M4.600 5.700 4.200 1.700 6.200 3.200 8 .6 9.800 3.200 11.800 1.700 11.400 5.700Z"/>'),
 gem:mas('<path d="M5.800.9H10.200L11.800 2.800 8 6 4.200 2.800ZM4.200 2.800H11.800" />'),
 paw:mas('<path d="M3.200 6.200 3.100 1.100 7 3.300ZM12.800 6.200 12.900 1.100 9 3.300Z"/>'),
 ghost:mas('<path d="M8 1.500C9.800 1.500 10.500 3 10.500 4.200V6H5.500V4.200C5.500 3 6.200 1.500 8 1.500Z"/>',{body:'M2.700 14.800V10C2.700 7.300 4.900 5.400 8 5.400S13.300 7.300 13.300 10V14.800L11.600 13.500 9.800 14.800 8 13.500 6.200 14.800 4.400 13.500Z',mouth:'M7.300 11.300a.7.9 0 1 0 1.400 0 .7.9 0 1 0-1.400 0Z'}),
 music:mas('<path d="M6.600 5.800V1.300L11.200.5V4.700A1.200 1 0 1 1 10 5.400V2.300L7.800 2.700V5.800A1.200 1 0 1 1 6.600 5.800Z"/>')};
window.TAG_ICONS=Object.keys(TI);
window.tagIcon=(k,sz=12)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 16 16');s.setAttribute('width',sz);s.setAttribute('height',sz);s.setAttribute('fill','currentColor');s.innerHTML=TI[k]||TI.star;return s};
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
