/* Hearth "Wave" — the intro shown when a DM has no messages yet, plus the wave sticker.
   Cinder (the mascot) waves hello. A wave is sent as a normal message whose body is WAVE_TOKEN;
   render() in features.js draws it as the sticker, so no server changes are needed. */
const WAVE_TOKEN=':hearth_wave:';
const waveSVG=still=>{
 const A=(x)=>still?'':x;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 150 130"><defs>
<linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a4d"/><stop offset="1" stop-color="#ff4d6d"/></linearGradient>
<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ff5a36"/></linearGradient></defs>
<ellipse cx="60" cy="123" rx="30" ry="4" fill="#0006"/>
<path d="M60 4C70 20 86 30 81 47 78 56 70 58 60 58 50 58 42 56 39 47 34 30 52 20 60 4Z" fill="url(#t)"/>
<path d="M60 24C67 33 73 37 71 47 70 52 65 54 60 54 55 54 50 52 49 47 47 37 54 33 60 24Z" fill="#ffd166"/>
<ellipse cx="22" cy="86" rx="8" ry="12" fill="#ff6a5c"/>
<ellipse cx="44" cy="118" rx="12" ry="6" fill="#e8454f"/><ellipse cx="76" cy="118" rx="12" ry="6" fill="#e8454f"/>
<ellipse cx="60" cy="80" rx="39" ry="38" fill="url(#a)"/><ellipse cx="60" cy="92" rx="23" ry="21" fill="#ffe0b8"/>
<path d="M39 76Q45 67 51 76M69 76Q75 67 81 76" fill="none" stroke="#2a1630" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="34" cy="88" rx="7" ry="4.5" fill="#ff7b9c" opacity=".7"/><ellipse cx="86" cy="88" rx="7" ry="4.5" fill="#ff7b9c" opacity=".7"/>
<path d="M51 85Q60 100 69 85Z" fill="#2a1630" stroke="#2a1630" stroke-width="2.5" stroke-linejoin="round"/><path d="M55 92Q60 98 65 92Z" fill="#ff7b9c"/>
<g>${A('<animateTransform attributeName="transform" type="rotate" values="-16 94 82;16 94 82;-16 94 82" dur=".7s" repeatCount="indefinite"/>')}
<path d="M94 82L110 46" stroke="#ff6a5c" stroke-width="16" stroke-linecap="round"/>
<circle cx="111" cy="42" r="11" fill="#ff8a78"/><circle cx="111" cy="42" r="5" fill="#ffb3a6" opacity=".7"/></g>
<g fill="none" stroke="#ffd166" stroke-width="3.5" stroke-linecap="round">
<path d="M127 30Q134 40 128 52">${A('<animate attributeName="opacity" values="1;.2;1" dur=".7s" repeatCount="indefinite"/>')}</path>
<path d="M120 22Q131 28 133 40" opacity=".6">${A('<animate attributeName="opacity" values=".2;.8;.2" dur=".7s" repeatCount="indefinite"/>')}</path></g>
<path d="M14 36l2.6 6 6 2.6-6 2.6L14 53l-2.6-5.8L5 44.6l6-2.6z" fill="#ffd166" opacity=".9"/>
</svg>`};
const waveURI=still=>'data:image/svg+xml;utf8,'+encodeURIComponent(waveSVG(still));
function waveImg(w){const i=new Image();i.src=waveURI(!!PREFS.reduce);i.width=w;i.alt='Wave';i.draggable=false;i.className='wavest';return i}

// Intro block at the top of a DM. The Wave button only appears while the DM is empty.
function dmIntro(box,count){
 const m=/^dm(\d+)_(\d+)$/.exec(ch||'');if(!m)return;const oid=+m[1]===me.id?+m[2]:+m[1];if(oid===me.id)return;
 const name=chName.replace(/^@ /,''),u=[...friends,...dmList,...dmReqs].find(x=>x.id===oid)||{},k=ch;
 const w=el('div','dmintro'),p=el('p','mu','This is the beginning of your direct message history with '),b=el('b','',name);p.append(b,'.');
 w.append(av(oid,name,u.theme,u.adeco||null),el('h1','',name),p);
 if(!count&&!isReq(k)){
  const r=el('div','dmwave'),btn=el('button','btn','Wave to '+name+'!');btn.type='button';
  btn.onclick=()=>{if(ch!==k||!ws||ws.readyState!==1)return;btn.disabled=true;ws.send(JSON.stringify({channel:k,body:WAVE_TOKEN}))};
  r.append(waveImg(110),btn);w.append(r);box.classList.add('dmempty')}
 box.append(w)}
