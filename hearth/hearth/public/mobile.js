/* Hearth mobile layout (phones / narrow windows, <=720px).
   Desktop is untouched. On narrow screens the server rail + channel list become a slide-in drawer
   (hamburger button in the header), the member list becomes a right-hand drawer, and messages use the full width. */
const MQ=matchMedia('(max-width:720px)');
const navBtn=()=>{const b=el('button','ib navbtn');b.type='button';b.title='Menu';b.setAttribute('aria-label','Open menu');b.append(ic('M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z',22));b.onclick=e=>{e.stopPropagation();mNav(!document.body.classList.contains('m-nav'))};return b};
function mNav(on){document.body.classList.toggle('m-nav',!!on);if(on&&MQ.matches&&typeof showMem!=='undefined'&&showMem){showMem=false;draw()}}
function mClose(){document.body.classList.remove('m-nav');if(MQ.matches&&typeof showMem!=='undefined'&&showMem&&document.querySelector('#app:not(.nomem)')){showMem=false;draw()}}
(()=>{
 const css=`
.navbtn{display:none}
@media(max-width:720px){
 html,body{overflow:hidden;overscroll-behavior:none}
 #app,#main{height:100vh;height:100dvh!important}
 #app,#app.nomem{grid-template-columns:minmax(0,1fr)!important}
 #main{width:100%}
 .navbtn{display:grid}
 #top{padding:0 8px!important;gap:6px!important}#top b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
 /* drawers */
 #rail,#side,#mem{position:fixed!important;top:0;bottom:0;z-index:60;transition:transform .22s ease;will-change:transform}
 #rail{left:0;width:68px;transform:translateX(-110%);padding-top:max(12px,env(safe-area-inset-top))}
 #side{left:68px;width:min(272px,calc(100vw - 68px - 44px));transform:translateX(calc(-100% - 80px));border-top-left-radius:0}
 body.m-nav #rail,body.m-nav #side{transform:none}
 #mem{right:0;left:auto;width:min(300px,88vw);display:block!important;transform:translateX(110%)}
 #app:not(.nomem) #mem{transform:none;box-shadow:-8px 0 24px #0008}
 #main::after{content:'';position:fixed;inset:0;z-index:50;background:#0009;opacity:0;pointer-events:none;transition:opacity .2s}
 body.m-nav #main::after,body.m-mem #main::after{opacity:1;pointer-events:auto}
 /* messages use the full width */
 #msgs{padding:4px 0 12px!important}
 .m{padding:2px 10px!important;gap:10px!important;margin-top:12px!important}
 .m.c{padding-left:58px!important;margin-top:0!important}
 .m .av{width:36px!important;height:36px!important;font-size:14px}
 .ht{left:8px!important;width:44px!important}
 .mh2{gap:2px 0}
 .mh2 .bd{padding:2px 5px!important;margin-left:4px!important}.mh2 .bd>span:not(.bic){display:none}
 .mt{max-width:100%}.mt img,.mt video,.att img,.att video{max-width:100%!important;height:auto}
 .dmintro{padding-left:10px;padding-right:10px}.dmintro h1{font-size:26px}
 /* composer: 16px stops iOS zooming in on focus */
 #bar{padding:0 8px max(12px,env(safe-area-inset-bottom))!important}#in,#bar textarea,#bar input{font-size:16px!important}
 /* popups fit the screen */
 .dlg,.modal,.pop{max-width:calc(100vw - 16px)!important}
}`;
 const s=document.createElement('style');s.id='mobcss';s.textContent=css;document.head.append(s);
 // tapping the dimmed area closes whichever drawer is open
 addEventListener('click',e=>{if(!MQ.matches)return;const b=document.body.classList;if((b.contains('m-nav')||b.contains('m-mem'))&&e.target.closest('#main')&&!e.target.closest('.navbtn,#top .ib')){e.stopPropagation();e.preventDefault();mClose()}},true);
 // keep the backdrop in sync with the member drawer; close the nav drawer when moving to a wider window
 const sync=()=>{const a=document.querySelector('#app');document.body.classList.toggle('m-mem',!!(a&&MQ.matches&&!a.classList.contains('nomem')))};
 new MutationObserver(()=>{const a=document.querySelector('#app');if(a&&!a._mo){a._mo=1;new MutationObserver(sync).observe(a,{attributes:true,attributeFilter:['class']})}sync()}).observe(document.body,{childList:true,subtree:true});
 MQ.addEventListener('change',()=>{document.body.classList.remove('m-nav');if(MQ.matches&&typeof showMem!=='undefined'){showMem=false}sync()});
 if(MQ.matches)showMem=false;
 // swipe from the left edge opens the menu, swipe left closes it
 let x0=null,y0=0;addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
 addEventListener('touchend',e=>{if(x0===null||!MQ.matches)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=Math.abs(t.clientY-y0);
  if(dy<50&&dx>70&&x0<28)mNav(true);else if(dy<50&&dx<-70&&document.body.classList.contains('m-nav'))mClose();x0=null},{passive:true});
})();
