/* Hearth emoji picker: the full Unicode set (see emoji-data.js), search, categories, skin tones and recents.
   Replaces the old small picker; used by the composer button and by message reactions. */
const ECATS=[['recent','🕒','Frequently Used'],['people','😀','People'],['nature','🐶','Nature'],['food','🍔','Food & Drink'],['activity','⚽','Activities'],['travel','🚗','Travel & Places'],['objects','💡','Objects'],['symbols','🔣','Symbols'],['flags','🏁','Flags']];
const TONES=['','\u{1F3FB}','\u{1F3FC}','\u{1F3FD}','\u{1F3FE}','\u{1F3FF}'];
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}},lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let RGI=null;try{RGI=new RegExp('^\\p{RGI_Emoji}$','v')}catch{}
// apply the chosen skin tone where an emoji supports it (checked against the RGI list when the browser can)
function toned(s,t){if(!t)return s;const cp=[...s],f=cp[0];if(!/\p{Emoji_Modifier_Base}/u.test(f))return s;
 const rest=cp.slice(1);if(rest[0]==='️')rest.shift();const c=f+t+rest.join('');return !RGI||RGI.test(c)?c:s}
let NAMES=null;
function pickerFill(emo,pk){
 emo.replaceChildren();let tone=lsGet('hearth.tone',0),recent=lsGet('hearth.recent',[]);
 const hd=el('div','ehd'),inp=el('input'),tb=el('button','etone'),tp=el('div','etones'),tabs=el('div','etb'),sc=el('div','egs');
 inp.placeholder='Find the perfect emoji';inp.maxLength=40;inp.type='search';inp.autocomplete='off';tb.type='button';tb.title='Skin tone';
 const paintTone=()=>{tb.replaceChildren(rich(toned('👋',TONES[tone])))};paintTone();
 TONES.forEach((t,i)=>{const b=el('button','');b.type='button';b.append(rich(toned('👋',t)));b.onclick=e=>{e.stopPropagation();tone=i;lsSet('hearth.tone',i);paintTone();tp.classList.remove('on');build()};tp.append(b)});
 tb.onclick=e=>{e.stopPropagation();tp.classList.toggle('on')};
 hd.append(inp,tb);emo.append(hd,tp,tabs,sc);
 // cells are plain spans; one delegated click handler (below) instead of a closure + listener per emoji
 const cell=(s,name,raw)=>{const b=el('span');b.title=name||'';b.dataset.e=raw?s:toned(s,TONES[tone]);return b};
 const fillCell=b=>{if(b.firstChild)return;const g=rich(b.dataset.e);const im=g.firstChild;if(im&&im.tagName==='IMG'){im.decoding='async';im.onerror=()=>b.remove()}b.append(g)};
 if(!NAMES){NAMES={};EMOJI_DATA.forEach(([,l])=>l.forEach(([s,n])=>NAMES[s]=n))}
 const names=NAMES,ROW=40,COLS=8;
 // each section reserves its final height up-front but only creates its emoji images once it is near the viewport
 let secs=[];
 const section=(id,title,cells)=>{const h=el('div','esh',title);h.dataset.c=id;const g=el('div','eg2');g.style.minHeight=Math.ceil(cells.length/COLS)*ROW+'px';g._cells=cells;g.append(...cells);sc.append(h,g);secs.push(g);return h};
 let heads=[],raf=0,rsig=JSON.stringify(recent);
 const paintVisible=()=>{raf=0;if(!sc.clientHeight)return; // picker hidden: build nothing yet
  const top=sc.scrollTop-500,bot=sc.scrollTop+sc.clientHeight+500;
  for(const g of secs){const y=g.offsetTop;if(y+g.offsetHeight<top||y>bot)continue;const n=g._cells.length,a=Math.max(0,Math.floor((top-y)/ROW))*COLS,z=Math.min(n,Math.ceil((bot-y)/ROW)*COLS);for(let i=a;i<z;i++)fillCell(g._cells[i])}};
 const build=()=>{sc.replaceChildren();heads=[];secs=[];const q=inp.value.trim().toLowerCase();
  if(q){const hit=[];EMOJI_DATA.forEach(([,l])=>l.forEach(([s,n,x])=>{if(hit.length<240&&(n.toLowerCase().includes(q)||x.includes(q)))hit.push(cell(s,n))}));
   if(!hit.length)sc.append(el('div','eno','No emoji found'));else section('s','Search results',hit);tabs.style.display='none';paintVisible();return}
  tabs.style.display='';
  if(recent.length)heads.push(section('recent','Frequently Used',recent.map(s=>cell(s,names[s]||'',1))));
  EMOJI_DATA.forEach(([id,l])=>heads.push(section(id,ECATS.find(c=>c[0]===id)[2],l.map(([s,n])=>cell(s,n)))));
  [...tabs.children].forEach(t=>{if(t.dataset.c==='recent')t.style.display=recent.length?'':'none'});sc.scrollTop=0;mark();paintVisible()};
 const mark=()=>{let cur=heads[0];heads.forEach(h=>{if(h.offsetTop<=sc.scrollTop+8)cur=h});[...tabs.children].forEach(t=>t.classList.toggle('on',!!cur&&t.dataset.c===cur.dataset.c))};
 const onScroll=()=>{mark();raf||(raf=requestAnimationFrame(paintVisible))};
 sc.addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(!c||!sc.contains(c))return;const v=c.dataset.e;recent=[v,...recent.filter(x=>x!==v)].slice(0,32);lsSet('hearth.recent',recent);rsig=JSON.stringify(recent);pk(v)});
 ECATS.forEach(([id,ic0,t])=>{const b=el('span');b.dataset.c=id;b.title=t;b.append(rich(ic0));b.onclick=()=>{const h=heads.find(x=>x.dataset.c===id);if(h){sc.scrollTop=h.offsetTop;paintVisible()}};tabs.append(b)});
 sc.addEventListener('scroll',onScroll,{passive:true});inp.oninput=build;inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Escape'&&inp.value){inp.value='';build()}};
 emo.addEventListener('click',e=>{if(!tp.contains(e.target)&&e.target!==tb)tp.classList.remove('on')});
 // refresh "Frequently Used" and focus the search box whenever the picker is shown
 new MutationObserver(()=>{if(getComputedStyle(emo).display!=='none'){const nr=lsGet('hearth.recent',[]),sg=JSON.stringify(nr);if(sg!==rsig){recent=nr;rsig=sg;if(!inp.value)build()}else paintVisible();if(!matchMedia('(pointer:coarse)').matches)inp.focus()}}).observe(emo,{attributes:true,attributeFilter:['style']});
 build()}
