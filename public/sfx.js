// Hearth sound effects: every sound is synthesised here with the Web Audio API (no audio files, nothing borrowed).
(function(){
const AC=window.AudioContext||window.webkitAudioContext;let ctx,mg,last={};
const get=()=>{if(!AC)return null;if(!ctx){ctx=new AC();mg=ctx.createGain();const cp=ctx.createDynamicsCompressor();mg.connect(cp);cp.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx};
['pointerdown','keydown'].forEach(e=>addEventListener(e,()=>get(),{once:true,capture:true}));
// one soft synth voice: pitch f, start offset t, length d; o.to glides the pitch, o.bell adds a glassy overtone
const note=(c,f,t,d,o={})=>{const s=c.currentTime+t,g=c.createGain(),x=c.createOscillator(),lp=c.createBiquadFilter(),pk=o.g||.4;
 lp.type='lowpass';lp.frequency.value=o.lp||5200;x.type=o.type||'sine';x.frequency.setValueAtTime(f,s);if(o.to)x.frequency.exponentialRampToValueAtTime(o.to,s+d*.9);
 g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(pk,s+.006);g.gain.exponentialRampToValueAtTime(.0001,s+d);x.connect(lp);lp.connect(g);g.connect(mg);x.start(s);x.stop(s+d+.03);
 if(o.bell){const h=c.createGain(),y=c.createOscillator();y.type='sine';y.frequency.setValueAtTime(f*2.76,s);h.gain.setValueAtTime(.0001,s);h.gain.exponentialRampToValueAtTime(pk*.22,s+.004);h.gain.exponentialRampToValueAtTime(.0001,s+d*.5);y.connect(h);h.connect(mg);y.start(s);y.stop(s+d*.5+.03)}};
const T={type:'triangle'};
const S={
 ping:c=>{note(c,987.8,0,.34,{...T,bell:1,g:.42});note(c,1318.5,.11,.5,{...T,bell:1,g:.42})},
 send:c=>note(c,520,0,.09,{to:790,g:.2}),
 join:c=>[523.25,659.25,783.99].forEach((f,i)=>note(c,f,i*.08,.3,{...T,bell:1,g:.38})),
 leave:c=>[783.99,659.25,523.25].forEach((f,i)=>note(c,f,i*.08,.28,{...T,g:.32})),
 peerjoin:c=>{note(c,587.3,0,.16,{...T,g:.32});note(c,880,.09,.26,{...T,bell:1,g:.32})},
 peerleave:c=>{note(c,880,0,.16,{...T,g:.28});note(c,587.3,.09,.26,{...T,g:.28})},
 mute:c=>note(c,520,0,.15,{to:330,g:.28}),
 unmute:c=>note(c,330,0,.15,{to:520,g:.28}),
 deafen:c=>{note(c,440,0,.12,{to:300,g:.28});note(c,330,.1,.17,{to:220,g:.28})},
 undeafen:c=>{note(c,300,0,.12,{to:440,g:.28});note(c,330,.1,.17,{to:494,g:.28})},
 error:c=>{note(c,233,0,.16,{type:'sawtooth',g:.12,lp:900});note(c,185,.13,.26,{type:'sawtooth',g:.12,lp:800})},
 ok:c=>{note(c,880,0,.1,{...T,g:.16});note(c,1318.5,.07,.22,{...T,bell:1,g:.16})}
};
const G={ping:'msg',send:'ui',ok:'ui',error:'ui',join:'call',leave:'call',peerjoin:'call',peerleave:'call',mute:'deaf',unmute:'deaf',deafen:'deaf',undeafen:'deaf'};
const P=()=>window.PREFS||{};
const allowed=k=>{const p=P(),g=G[k];if(p.streamer&&p.sNoSound)return false;if(typeof me!=='undefined'&&me&&me.status==='dnd')return false;
 return g==='msg'?!!(p.sound&&p.msgsound):g==='call'?p.callsound!==false:g==='deaf'?p.deafsound!==false:p.uisound!==false};
const run=k=>{try{const c=get();if(!c||!S[k])return;mg.gain.value=((P().sfxvol==null?70:P().sfxvol)/100)*.6;S[k](c)}catch{}};
window.SFX={list:[['ping','Ping'],['send','Send'],['join','You join'],['leave','You leave'],['peerjoin','Someone joins'],['peerleave','Someone leaves'],['mute','Mute'],['unmute','Unmute'],['deafen','Deafen'],['undeafen','Undeafen'],['ok','Success'],['error','Error']],
 play(k){const n=Date.now();if(last[k]&&n-last[k]<120)return;if(!allowed(k))return;last[k]=n;run(k)},test:run};

// ---- hook the app's own actions (wrapping the existing globals, so nothing else has to change) ----
const wrap=(n,f)=>{const o=window[n];if(typeof o==='function')window[n]=f(o)};
wrap('vjoin',o=>async function(c){const was=!!(typeof room!=='undefined'&&room&&room.id===c.id),r=await o.apply(this,arguments);if(!was&&typeof room!=='undefined'&&room&&room.id===c.id)SFX.play('join');return r});
wrap('vleave',o=>function(){const had=typeof room!=='undefined'&&room,r=o.apply(this,arguments);had&&SFX.play('leave');return r});
wrap('toggleMute',o=>function(){const d=selfDeaf,r=o.apply(this,arguments);SFX.play(d&&!selfDeaf?'undeafen':selfMute?'mute':'unmute');return r});
wrap('toggleDeaf',o=>function(){const r=o.apply(this,arguments);SFX.play(selfDeaf?'deafen':'undeafen');return r});
wrap('onMsg',o=>function(m){try{if(m&&me&&m.uid===me.id)SFX.play('send')}catch{}return o.apply(this,arguments)});
wrap('toast',o=>function(m,ok){SFX.play(ok?'ok':'error');return o.apply(this,arguments)});
// people joining / leaving the voice room you're in
wrap('connect',o=>function(){const r=o.apply(this,arguments);try{const h=ws.onmessage;ws.onmessage=e=>{try{const d=JSON.parse(e.data);if(typeof room!=='undefined'&&room){if(d.type==='vin')SFX.play('peerjoin');if(d.type==='vout'&&pcs[d.id])SFX.play('peerleave')}}catch{}return h.call(ws,e)}}catch{}return r});
})();
