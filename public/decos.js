// Hearth avatar decorations: original SVG frames drawn around an avatar (viewBox 100x100, avatar fills the centre ~83%).
(function(){
const N=(n,f)=>Array.from({length:n},(_,i)=>f(i,i/n*360)).join('');
const rot=(a,s)=>`<g transform="rotate(${a} 50 50)">${s}</g>`;
const star=(x,y,r,c,cls='')=>`<path class="${cls}" d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z" fill="${c}"/>`;
const heart=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 3C-6-2-3-7 0-3 3-7 6-2 0 3Z" fill="${c}"/>`;
const D={
 halo:`<ellipse cx="50" cy="6" rx="24" ry="6.5" fill="none" stroke="#ffe27a" stroke-width="3.2"/><ellipse cx="50" cy="6" rx="24" ry="6.5" fill="none" stroke="#fff6c9" stroke-width="1" opacity=".8"/>`,
 crown:`<path d="M28 15 31 1 41 9 50-2 59 9 69 1 72 15Z" fill="#ffc933" stroke="#b8790b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="31" cy="1" r="2.2" fill="#ff5c8a"/><circle cx="50" cy="-2" r="2.4" fill="#5cd6ff"/><circle cx="69" cy="1" r="2.2" fill="#ff5c8a"/>`,
 cat:`<path d="M17 30 15 3 40 11Z" fill="#2a2a33" stroke="#ff8fb8" stroke-width="2" stroke-linejoin="round"/><path d="M83 30 85 3 60 11Z" fill="#2a2a33" stroke="#ff8fb8" stroke-width="2" stroke-linejoin="round"/><path d="M21 22 20 10 31 14Z" fill="#ff8fb8"/><path d="M79 22 80 10 69 14Z" fill="#ff8fb8"/>`,
 devil:`<path d="M27 15C18 10 14 2 20-2 20 4 27 7 33 10Z" fill="#e11d48" stroke="#7f1020" stroke-width="1.2"/><path d="M73 15C82 10 86 2 80-2 80 4 73 7 67 10Z" fill="#e11d48" stroke="#7f1020" stroke-width="1.2"/>`,
 neon:`<circle class="dspin" cx="50" cy="50" r="46" fill="none" stroke="url(#dg1)" stroke-width="3.5" stroke-dasharray="40 12" stroke-linecap="round"/><circle cx="50" cy="50" r="43" fill="none" stroke="#22d3ee" stroke-opacity=".5" stroke-width="1"/><defs><linearGradient id="dg1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#f0abfc"/></linearGradient></defs>`,
 ember:`<circle cx="50" cy="50" r="44" fill="none" stroke="#ff7a1a" stroke-opacity=".55" stroke-width="2"/>`+N(14,(i,a)=>rot(a,`<path class="dflick" style="animation-delay:${(i%5)*.2}s" d="M50 -1C54 5 56 9 50 14 44 9 46 5 50-1Z" fill="${i%2?'#ffb02e':'#ff5a1f'}"/>`)),
 sparkle:`<circle cx="50" cy="50" r="45" fill="none" stroke="#ffe08a" stroke-opacity=".7" stroke-width="1.5"/>`+[[50,3,6],[93,34,4],[88,78,5],[18,92,4],[6,40,5],[28,8,3]].map(([x,y,r],i)=>star(x,y,r,i%2?'#fff':'#ffd75e','dtw" style="animation-delay:'+i*.3+'s')).join(''),
 sweat:`<path class="dwob" d="M50 3C70 1 92 18 94 48 96 74 78 94 52 96 26 98 5 78 6 50 7 22 28 5 50 3Z" fill="none" stroke="#ff4fd8" stroke-width="2.4" stroke-dasharray="5 4" stroke-linecap="round"/><path d="M70 4C74 12 77 17 70 23 63 17 66 12 70 4Z" fill="#ff4fd8"/><path d="M84 14C88 22 90 27 84 33 78 27 80 22 84 14Z" fill="#ff8ae9"/>`,
 thorns:`<circle cx="50" cy="50" r="44" fill="none" stroke="#2f7a3f" stroke-width="3"/>`+N(12,(i,a)=>rot(a,`<path d="M50 6C46 -1 40 0 38 4 43 4 47 7 50 6Z" fill="#43b05a"/><path d="M50 6 52 -1 55 6Z" fill="#1f5a2c"/>`))+N(4,(i,a)=>rot(a+22,`<circle cx="50" cy="6" r="3" fill="#ff5c8a"/>`)),
 frost:`<circle cx="50" cy="50" r="44" fill="none" stroke="#bfe9ff" stroke-opacity=".7" stroke-width="2"/>`+N(10,(i,a)=>rot(a,`<path d="M50-2 54 8 50 16 46 8Z" fill="${i%2?'#e8f8ff':'#8fd3ff'}" stroke="#5fb5f0" stroke-width=".8"/>`)),
 glitch:`<path d="M12 28A42 42 0 0 1 60 8" fill="none" stroke="#ff2bd6" stroke-width="3.5" stroke-linecap="round"/><path d="M92 40A42 42 0 0 1 80 80" fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" transform="translate(-1 1)"/><path d="M30 92A42 42 0 0 1 8 62" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><rect class="dtw" x="86" y="12" width="8" height="3" fill="#22d3ee"/><rect class="dtw" x="4" y="76" width="9" height="3" fill="#ff2bd6"/>`,
 hearts:`<circle cx="50" cy="50" r="44" fill="none" stroke="#ff8fb8" stroke-opacity=".5" stroke-width="1.5"/>`+N(9,(i,a)=>rot(a,heart(50,4,i%2?1:.75,i%2?'#ff5c8a':'#ffb3cf')))
};
window.DECO_LIST=[['none','None'],['halo','Halo'],['crown','Crown'],['cat','Cat Ears'],['devil','Horns'],['neon','Neon Ring'],['ember','Embers'],['sparkle','Sparkle'],['sweat','Sweat Drops'],['thorns','Thorns'],['frost','Frost'],['glitch','Glitch'],['hearts','Hearts']];
window.decoEl=k=>{if(!k||!D[k])return null;const s=document.createElement('span');s.className='dec dec-'+k;s.innerHTML=`<svg viewBox="-10 -10 120 120" width="100%" height="100%" aria-hidden="true">${D[k]}</svg>`;return s};
window.DECO={};
const st=document.createElement('style');st.textContent=`
.av.hd{position:relative;overflow:visible}.av.hd .ai{border-radius:50%}.av.hd>.dec{position:absolute;inset:-10%;width:120%;height:120%;margin:0;pointer-events:none;z-index:3;filter:drop-shadow(0 0 3px #0008)}.av.hd>.dec svg{display:block;overflow:visible}
@keyframes dsp{to{transform:rotate(360deg)}}.dspin{transform-origin:50px 50px;animation:dsp 6s linear infinite}
@keyframes dfl{50%{transform:scaleY(1.25) translateY(-1px)}}.dflick{transform-box:fill-box;transform-origin:50% 100%;animation:dfl .9s ease-in-out infinite}
@keyframes dtw{50%{opacity:.25}}.dtw{animation:dtw 1.6s ease-in-out infinite}@keyframes dwb{to{stroke-dashoffset:-18}}.dwob{animation:dwb 1.4s linear infinite}
.pf-reduce .dec *{animation:none!important}
.dgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dtile{display:grid;justify-items:center;gap:6px;padding:14px 4px 8px;background:var(--p1,#1e1f22);border:2px solid transparent;border-radius:8px;color:var(--t2,#dbdee1);font-size:12px;font-weight:700}.dtile:hover{background:#2a2c31}.dtile.on{border-color:var(--ac)}.dtile .av{width:48px;height:48px;font-size:18px;cursor:inherit}
/* whole-card profile theme */
.pcd.pct{background:linear-gradient(180deg,color-mix(in srgb,var(--pa) 78%,#0d0e10) 0,color-mix(in srgb,var(--pb) 70%,#0b0c0e) 100%)}
.pcd.pct .pav{background:transparent;--sb:color-mix(in srgb,var(--pa) 72%,#0d0e10)}.pcd.pct .pav .st{--sb:color-mix(in srgb,var(--pa) 72%,#0d0e10)}
.pcd.pct .pbox{background:color-mix(in srgb,var(--pb) 35%,#000 65%);background:rgba(0,0,0,.38);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(2px)}
.pcd.pct .sbub{background:rgba(0,0,0,.45);border-color:rgba(255,255,255,.12)}.pcd.pct .pun,.pcd.pct .pns{color:#e3e5ea}
`;document.head.append(st)})();
