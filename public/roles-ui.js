// Roles on profile cards: shows a member's roles (Discord-style pills) and lets people with Manage Roles hand them out.
(function(){
const DEF='#99aab5',cache=new Map();
const curSrv=()=>typeof cur==='number'?servers.find(s=>s.id===cur):null;
const canManage=()=>{const s=curSrv();return !!s&&window.SPm&&SPm(s,'manage_roles')};
const loadRoles=async(sid)=>{try{cache.set(sid,await api('servers/'+sid+'/roles'))}catch{}return cache.get(sid)||[]};
const memberOf=id=>(typeof memCache!=='undefined'?memCache:[]).find(m=>m.id===id);

window.rolePill=function(r,x){const p=el('span','rpill'),d=el('i');d.style.background=r.color||DEF;p.append(d,el('span','',r.name));if(x){const b=el('button','rx','\u00d7');b.type='button';b.title='Remove role';b.onclick=e=>{e.stopPropagation();x()};p.append(b)}return p};

async function setRoles(m,ids){await api('servers/'+cur+'/members/'+m.id+'/roles','PUT',{ids});m.rids=ids;await loadRoles(cur);if(typeof members==='function')members()}

window.assignRoles=function(u){const m=memberOf(u.id),roles=cache.get(cur)||[];if(!m)return;
 const D=dialog();D.set('Roles for '+dn(u),'Pick which roles this member has.');const sel=new Set(m.rids||[]);
 if(!roles.length)D.body.append(el('p','mu','No roles yet. Create some under Server Settings \u2192 Roles.'));
 roles.forEach(r=>{const row=el('label','v7pk'),cb=el('input'),d=el('i');cb.type='checkbox';cb.checked=sel.has(r.id);cb.onchange=()=>cb.checked?sel.add(r.id):sel.delete(r.id);d.style.background=r.color||DEF;row.append(cb,d,r.name);D.body.append(row)});
 const ok=btn('Save','',async()=>{ok.disabled=true;try{await setRoles(m,[...sel]);D.close();popClose();toast('Roles updated',1)}catch(e){fail(e);ok.disabled=false}});
 D.foot.append(btn('Cancel','lnk',D.close),ok)};

// keep role lists fresh whenever the member list reloads
const _mem=window.members;window.members=async function(){if(typeof cur==='number')await loadRoles(cur);return _mem.apply(this,arguments)};

// roles section on profile cards
const _pc=window.pcard;window.pcard=function(u,o){const c=_pc.apply(this,arguments);
 try{if(typeof cur!=='number'||!u||!u.id||!u.created)return c;const m=memberOf(u.id);if(!m)return c;
  const roles=cache.get(cur)||[],mine=(m.rids||[]).map(i=>roles.find(r=>r.id===i)).filter(Boolean),can=canManage();if(!mine.length&&!can)return c;
  const box=el('div','pbox prl'),row=el('div','rpills');box.append(el('h4','',mine.length===1?'Role':'Roles'),row);
  mine.forEach(r=>row.append(rolePill(r,can?async()=>{try{await setRoles(m,(m.rids||[]).filter(i=>i!==r.id));popClose();toast('Role removed',1)}catch(e){fail(e)}}:null)));
  if(can){const a=el('button','rpill radd','+');a.type='button';a.title='Add or remove roles';a.onclick=e=>{e.stopPropagation();assignRoles(u)};row.append(a)}
  const b=c.querySelector('.pbody'),first=b&&b.querySelector('.pbox');b&&(first?b.insertBefore(box,first):b.append(box))}catch{}
 return c};

// right-click menu entry
let pend=null;const _um=window.userMenu;window.userMenu=function(u){pend=u;try{return _um.apply(this,arguments)}finally{pend=null}};
const _co=window.ctxOpen;window.ctxOpen=function(x,y,items){if(pend&&canManage()&&memberOf(pend.id)){const u=pend;items=items.slice();items.splice(Math.min(2,items.length),0,['Roles',()=>assignRoles(u)])}return _co.call(this,x,y,items)};

const st=document.createElement('style');st.textContent=`
.rpills{display:flex;flex-wrap:wrap;gap:6px}
.rpill{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border-radius:8px;background:var(--p2,#2b2d31);border:1px solid #ffffff1f;color:var(--t2,#dbdee1);font-size:12px;font-weight:600;line-height:1;max-width:100%}
.rpill i{width:12px;height:12px;border-radius:50%;flex:none}.rpill>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rpill .rx{display:none;background:none;border:0;padding:0;margin:0 -2px 0 0;width:14px;height:14px;border-radius:50%;color:var(--t4,#949ba4);font-size:14px;line-height:12px;cursor:pointer}.rpill:hover .rx{display:grid;place-items:center}.rpill .rx:hover{color:#fff;background:#ffffff26}
button.radd{cursor:pointer;color:var(--t4,#949ba4);width:24px;padding:0;justify-content:center;font-size:15px}button.radd:hover{color:#fff;border-color:#ffffff50}
.v7chip{border:1px solid #ffffff1f;border-radius:8px;padding:3px 8px;background:var(--p2,#2b2d31)}
`;document.head.append(st);
})();
