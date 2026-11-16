/* Hearth emoji picker: the full Unicode set (see emoji-data.js), search, categories, skin tones and recents.
   Replaces the old small picker; used by the composer button and by message reactions. */
const ECATS=[['recent','🕒','Frequently Used'],['people','😀','People'],['nature','🐶','Nature'],['food','🍔','Food & Drink'],['activity','⚽','Activities'],['travel','🚗','Travel & Places'],['objects','💡','Objects'],['symbols','🔣','Symbols'],['flags','🏁','Flags']];
const TONES=['','\u{1F3FB}','\u{1F3FC}','\u{1F3FD}','\u{1F3FE}','\u{1F3FF}'];
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}},lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let RGI=null;try{RGI=new RegExp('^\\p{RGI_Emoji}$','v')}catch{}
// apply the chosen skin tone where an emoji supports it (checked against the RGI list when the browser can)
function toned(s,t){if(!t)return s;const cp=[...s],f=cp[0];if(!/\p{Emoji_Modifier_Base}/u.test(f))return s;
 const rest=cp.slice(1);if(rest[0]==='️')rest.shift();const c=f+t+rest.join('');return !RGI||RGI.test(c)?c:s}
function pickerFill(emo,pk){
 emo.replaceChildren();let tone=lsGet('hearth.tone',0),recent=lsGet('hearth.recent',[]);
 const hd=el('div','ehd'),inp=el('input'),tb=el('button','etone'),tp=el('div','etones'),tabs=el('div','etb'),sc=el('div','egs');
 inp.placeholder='Find the perfect emoji';inp.maxLength=40;inp.type='search';inp.autocomplete='off';tb.type='button';tb.title='Skin tone';
 const paintTone=()=>{tb.replaceChildren(rich(toned('👋',TONES[tone])))};paintTone();
 TONES.forEach((t,i)=>{const b=el('button','');b.type='button';b.append(rich(toned('👋',t)));b.onclick=e=>{e.stopPropagation();tone=i;lsSet('hearth.tone',i);paintTone();tp.classList.remove('on');build()};tp.append(b)});
 tb.onclick=e=>{e.stopPropagation();tp.classList.toggle('on')};
 hd.append(inp,tb);emo.append(hd,tp,tabs,sc);
 const cell=(s,name)=>{const b=el('span');b.title=name||'';const v=toned(s,TONES[tone]);b.append(rich(v));const g=b.firstChild;if(g&&g.tagName==='IMG')g.onerror=()=>b.remove();
  b.onclick=()=>{recent=[v,...recent.filter(x=>x!==v)].slice(0,32);lsSet('hearth.recent',recent);pk(v)};return b};
 const names={};EMOJI_DATA.forEach(([,l])=>l.forEach(([s,n])=>names[s]=n));
 const section=(id,title,cells)=>{const h=el('div','esh',title);h.dataset.c=id;const g=el('div','eg2');cells.forEach(c=>g.append(c));sc.append(h,g);return h};
 let heads=[];
 const build=()=>{sc.replaceChildren();heads=[];const q=inp.value.trim().toLowerCase();
  if(q){const hit=[];EMOJI_DATA.forEach(([,l])=>l.forEach(([s,n])=>{if(hit.length<240&&n.includes(q))hit.push(cell(s,n.split(' ')[0]))}));
   if(!hit.length)sc.append(el('div','eno','No emoji found'));else section('s','Search results',hit);tabs.style.display='none';return}
  tabs.style.display='';
  if(recent.length)heads.push(section('recent','Frequently Used',recent.map(s=>cell(s,names[s]||''))));
  EMOJI_DATA.forEach(([id,l])=>heads.push(section(id,ECATS.find(c=>c[0]===id)[2],l.map(([s,n])=>cell(s,n)))));
  [...tabs.children].forEach(t=>{if(t.dataset.c==='recent')t.style.display=recent.length?'':'none'});sc.scrollTop=0;mark()};
 const mark=()=>{let cur=heads[0];heads.forEach(h=>{if(h.offsetTop<=sc.scrollTop+8)cur=h});[...tabs.children].forEach(t=>t.classList.toggle('on',!!cur&&t.dataset.c===cur.dataset.c))};
 ECATS.forEach(([id,ic0,t])=>{const b=el('span');b.dataset.c=id;b.title=t;b.append(rich(ic0));b.onclick=()=>{const h=heads.find(x=>x.dataset.c===id);if(h)sc.scrollTop=h.offsetTop};tabs.append(b)});
 sc.addEventListener('scroll',mark,{passive:true});inp.oninput=build;inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Escape'&&inp.value){inp.value='';build()}};
 emo.addEventListener('click',e=>{if(!tp.contains(e.target)&&e.target!==tb)tp.classList.remove('on')});
 // refresh "Frequently Used" and focus the search box whenever the picker is shown
 new MutationObserver(()=>{if(getComputedStyle(emo).display!=='none'){recent=lsGet('hearth.recent',[]);if(!inp.value)build();if(!matchMedia('(pointer:coarse)').matches)inp.focus()}}).observe(emo,{attributes:true,attributeFilter:['style']});
 build()}
