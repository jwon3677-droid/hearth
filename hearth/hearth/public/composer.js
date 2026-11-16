/* Hearth "+" menu: Upload a File, Create Poll, Record Voice Message, Send Voice Message.
   Polls are ordinary messages (body = POLL_TOKEN + JSON); votes are reactions, so no server changes are needed. */
const POLL_TOKEN=':poll:',NUMK=['1','2','3','4','5','6','7','8','9'].map(n=>n+'️⃣').concat(['\u{1F51F}']);
const parsePoll=b=>{if(typeof b!=='string'||!b.startsWith(POLL_TOKEN))return null;try{const p=JSON.parse(b.slice(POLL_TOKEN.length));return p&&typeof p.q==='string'&&Array.isArray(p.o)&&p.o.length>1?p:null}catch{return null}};
// plain-text stand-in for special messages (reply previews, notifications)
const tokText=b=>b===WAVE_TOKEN?'👋 Wave':parsePoll(b)?'📊 Poll: '+parsePoll(b).q:b;
const IM={up:'M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z',poll:'M3 3h2v18H3V3zm4 10h10v4H7v-4zm0-8h14v4H7V5z',mic:'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z',aud:'M3 9v6h4l5 4V5L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8S18 4.2 14 3.2z'};

function closeUpm(){const m=$('#upm');m&&m.remove();document.removeEventListener('mousedown',upmOut,true);document.removeEventListener('keydown',upmKey,true)}
const upmOut=e=>{if(!e.target.closest('#upm,.upbtn'))closeUpm()},upmKey=e=>{if(e.key==='Escape')closeUpm()};
function uploadMenu(anchor,fileInput){
 if($('#upm'))return closeUpm();if(!ch)return;
 const m=el('div','upm');m.id='upm';
 const audioPick=()=>{const f=el('input');f.type='file';f.accept='audio/*,.mp3,.m4a,.ogg,.opus,.wav,.webm,.flac,.aac';f.onchange=()=>{const x=f.files[0];x&&uploadFile(x,null)};f.click()};
 [['Upload a File',IM.up,()=>fileInput.click()],['Create Poll',IM.poll,createPoll],['Record Voice Message',IM.mic,recordVoice],['Send Voice Message',IM.aud,audioPick]].forEach(([t,p,fn])=>{
  const r=el('div','upi');r.append(ic(p,20),el('span','',t));r.onclick=()=>{closeUpm();fn()};m.append(r)});
 document.body.append(m);const r=anchor.getBoundingClientRect();
 m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';m.style.top=Math.max(8,r.top-m.offsetHeight-10)+'px';
 setTimeout(()=>{document.addEventListener('mousedown',upmOut,true);document.addEventListener('keydown',upmKey,true)},0)}

// ---- polls
async function createPoll(){const k=ch;if(!k)return;
 const r=await askDialog('Create a poll','Everyone in this chat can vote. Votes are reactions.',(D,submit)=>{
  const q=el('input');q.placeholder='What question do you want to ask?';q.maxLength=150;const box=el('div','pollopts'),opts=[];
  const add=()=>{if(opts.length>=10)return;const i=el('input');i.placeholder='Answer '+(opts.length+1);i.maxLength=50;opts.push(i);box.append(i);addB.style.display=opts.length>=10?'none':''};
  const addB=btn('Add another answer','sec sm',()=>{add();opts[opts.length-1].focus()}),mw=el('label','pollmulti'),mc=el('input');mc.type='checkbox';mw.append(mc,' Allow multiple answers');
  D.body.append(field('Question',q),field('Answers',box),addB,mw);add();add();
  return()=>({q:q.value.trim(),o:opts.map(i=>i.value.trim()).filter(Boolean),m:mc.checked?1:0})},'Post poll');
 if(!r)return;if(!r.q||r.o.length<2)return toast('A poll needs a question and at least two answers');
 const body=POLL_TOKEN+JSON.stringify(r.m?r:{q:r.q,o:r.o});if(body.length>980)return toast('That poll is too long. Shorten the question or answers.');
 if(ch!==k||!ws||ws.readyState!==1)return;ws.send(JSON.stringify({channel:k,body}))}

async function vote(m,i,multi){const mine=n=>((m.rx||[]).find(x=>x.e===NUMK[n])||{u:[]}).u.includes(me.id);
 if(!multi)for(let n=0;n<NUMK.length;n++)if(n!==i&&mine(n))await reactMsg(m.id,NUMK[n]);
 await reactMsg(m.id,NUMK[i])}
function pollNode(m,p){const w=el('div','poll'),cnt=p.o.map((_,i)=>((m.rx||[]).find(x=>x.e===NUMK[i])||{u:[]}).u),voters=new Set(cnt.flat()),max=Math.max(1,...cnt.map(c=>c.length));
 w.append(el('div','pq',p.q),el('div','pm',p.m?'Select one or more answers':'Select one answer'));
 p.o.slice(0,10).forEach((t,i)=>{const mine=cnt[i].includes(me.id),b=el('button','po'+(mine?' on':'')),bar=el('i'),l=el('span','pl'),n=el('span','pn',cnt[i].length+(cnt[i].length===1?' vote':' votes'));
  b.type='button';bar.style.width=(cnt[i].length/Math.max(1,voters.size)*100)+'%';l.append(mine?el('b','pk','✓'):'',t);b.append(bar,l,n);b.onclick=e=>{e.stopPropagation();vote(m,i,!!p.m).catch(fail)};w.append(b)});
 w.append(el('div','pf',voters.size+(voters.size===1?' voter':' voters')));return w}

// ---- voice messages
async function recordVoice(){const k=ch;if(!k)return;
 if(!navigator.mediaDevices||!window.MediaRecorder)return toast('Voice recording isn\'t supported in this browser');
 let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch{return toast('Microphone access was blocked')}
 const type=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t))||'',mr=new MediaRecorder(stream,type?{mimeType:type}:undefined),chunks=[];
 let blob=null,t0=Date.now(),tm=null;
 const res=await askDialog('Voice message','',(D)=>{
  const st=el('div','vrec'),dot=el('i','rd'),tx=el('span','vt','0:00'),stop=btn('Stop','dng sm'),pv=el('audio');pv.controls=true;pv.style.display='none';
  st.append(dot,tx,stop);D.body.append(st,pv);
  mr.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  const fin=()=>{clearInterval(tm);stream.getTracks().forEach(t=>t.stop());blob=new Blob(chunks,{type:mr.mimeType||type||'audio/webm'});st.classList.add('done');dot.remove();stop.remove();pv.src=URL.createObjectURL(blob);pv.style.display='block';const ok=D.foot.lastElementChild;ok&&(ok.disabled=false)};
  mr.onstop=fin;stop.onclick=()=>mr.state!=='inactive'&&mr.stop();
  const tick=()=>{const s=Math.floor((Date.now()-t0)/1e3);tx.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(s>=300&&mr.state!=='inactive')mr.stop()};
  mr.start();tm=setInterval(tick,250);queueMicrotask(()=>{const ok=D.foot.lastElementChild;ok&&(ok.disabled=!blob)});
  return()=>blob},'Send');
 clearInterval(tm);try{mr.state!=='inactive'&&mr.stop()}catch{}stream.getTracks().forEach(t=>t.stop());
 if(!res||ch!==k)return;const ext=/mp4/.test(res.type)?'m4a':/ogg/.test(res.type)?'ogg':'webm';
 await uploadFile(new File([res],'voice-message.'+ext,{type:res.type}),null)}
