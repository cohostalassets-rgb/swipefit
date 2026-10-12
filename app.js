const $=s=>document.querySelector(s), V=$('#view'), T=$('#top');
const BY=Object.fromEntries(EX.map(e=>[e[0],e]));
// Push/Pull: upper = direction of force; lower: knee-dominant (squat/lunge) = Push, hip-dominant (hinge/thrust/curl) = Pull; core & calves = Other
const PUSH='bench incline dbbench dbfly cablefly pushup ohp dbpress lateral cablelateral pushdown ohext skull dips squat goblet frontsquat bss lunge stepup sumo'.split(' ');
const PULL='pullup latpull cablerow dbrow bbrow straightpull facepull revfly shrug bbcurl dbcurl hammer cablecurl deadlift rdl dbrdl cablecurlleg hipthrust kickback pullthrough glutebridge'.split(' ');
const pp=id=>PUSH.includes(id)?'push':PULL.includes(id)?'pull':'other';
const FILT=[['ul','U','💪','Upper'],['ul','L','🦵','Lower'],['ch','A','⬅️','Front'],['ch','P','➡️','Back'],['pp','push','👐','Push'],['pp','pull','🪢','Pull'],['pp','other','⭕','Other']];
function pass(id,skipUL){const f=S.filt||{},k=KIN[id],e=BY[id];
 if(!skipUL&&f.ul&&f.ul.length&&!f.ul.includes(e[2]))return false;
 if(f.ch&&f.ch.length&&!f.ch.some(c=>k.chain===c||k.chain==='B'))return false;
 if(f.pp&&f.pp.length&&!f.pp.includes(pp(id)))return false;return true}
function filterBar(skipUL){const f=S.filt||(S.filt={ul:[],ch:[],pp:[]}),none=!f.ul.length&&!f.ch.length&&!f.pp.length;
 return `<div class="fbar"><button class="fchip ${none?'on':''}" onclick="fAll()">✨ All</button>${FILT.filter(x=>!(skipUL&&x[0]==='ul')).map(([c,v,i,l])=>`<button class="fchip ${f[c].includes(v)?'on':''}" onclick="fTog('${c}','${v}')">${i} ${l}</button>`).join('')}</div>`}
function fTog(c,v){const a=S.filt[c],i=a.indexOf(v);i<0?a.push(v):a.splice(i,1);save();render()}
function fAll(){S.filt={ul:[],ch:[],pp:[]};save();render()}
const DAY=864e5, WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const iso=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const parse=s=>{const[a,b,c]=s.split('-');return new Date(a,b-1,c)};
const addD=(s,n)=>iso(parse(s).getTime()+n*DAY+3600e3*3);
const today=()=>iso(new Date());
const fresh=()=>({anchor:today(),plan:{},later:{},skips:{},notes:{},exNotes:{},hist:{},lastOpen:0,filt:{ul:[],ch:[],pp:[]}});
let PR=JSON.parse(localStorage.sf_profiles||'null')||{list:[]},S=fresh(),UID=null;
const saveP=()=>localStorage.sf_profiles=JSON.stringify(PR);
const save=()=>{if(UID)localStorage['swipefit:'+UID]=JSON.stringify(S)};
let prevOpen=0;
function loadUser(id){UID=id;PR.cur=id;saveP();S=Object.assign(fresh(),JSON.parse(localStorage['swipefit:'+id]||'null')||{});
 const u=PR.list.find(x=>x.id===id);S.sex=u.sex;prevOpen=S.lastOpen;S.lastOpen=Date.now();save();sel=addD(today(),1);render();if(!S.tour)tour(1)}
function addUser(name,sex){const id='u'+Date.now().toString(36);PR.list.push({id,name,sex});
 if(PR.list.length===1&&localStorage.swipefit){const old=JSON.parse(localStorage.swipefit);old.tour=1;localStorage['swipefit:'+id]=JSON.stringify(old);localStorage.removeItem('swipefit')}
 saveP();loadUser(id)}
function who(){document.querySelectorAll('.modal').forEach(m=>m.remove());const m=document.createElement('div');m.className='modal full';
 m.innerHTML=`<div class="card prof whoc"><div style="font-size:60px;text-align:center">🏋️</div><h2 style="text-align:center">Who's working out?</h2>
 <div class="who">${PR.list.map(u=>`<button class="pill wb" data-id="${u.id}">${u.sex==='m'?'👨':'👩'} ${u.name.replace(/</g,'')}</button>`).join('')}
 <button class="pill add">➕ Add person</button></div></div>`;
 document.body.appendChild(m);m.querySelectorAll('.wb').forEach(b=>b.onclick=()=>{m.remove();loadUser(b.dataset.id)});
 m.querySelector('.add').onclick=()=>{m.querySelector('.who').innerHTML=`<input class="nm-in" placeholder="Name" maxlength="20"><div class="btns"><button class="pill sx" data-s="f">👩 Woman</button><button class="pill sx" data-s="m">👨 Man</button></div>`;
  const inp=m.querySelector('.nm-in');inp.focus();m.querySelectorAll('.sx').forEach(b=>b.onclick=()=>{const n=inp.value.trim();if(!n){inp.style.borderColor='red';inp.focus();return}m.remove();addUser(n,b.dataset.s)})}}
const type=d=>(Math.round((parse(d)-parse(S.anchor))/DAY)%2+2)%2?'L':'U';
const TN={U:'💪 UPPER',L:'🦵 LOWER'};
let sel=addD(today(),1), tab='swipe', setsN=4;

/* ---------- body SVG ---------- */
const FRONT={shoulders:['<ellipse cx="29" cy="46" rx="9" ry="7"/>','<ellipse cx="71" cy="46" rx="9" ry="7"/>'],
chest:['<ellipse cx="41" cy="55" rx="10" ry="8"/>','<ellipse cx="59" cy="55" rx="10" ry="8"/>'],
biceps:['<ellipse cx="23" cy="66" rx="5" ry="10"/>','<ellipse cx="77" cy="66" rx="5" ry="10"/>'],
abs:['<rect x="41" y="66" width="18" height="30" rx="5"/>'],
quads:['<ellipse cx="40" cy="128" rx="8" ry="20"/>','<ellipse cx="60" cy="128" rx="8" ry="20"/>'],
adductors:['<ellipse cx="46" cy="118" rx="3.5" ry="12"/>','<ellipse cx="54" cy="118" rx="3.5" ry="12"/>'],
calves:['<ellipse cx="40" cy="170" rx="5" ry="12"/>','<ellipse cx="60" cy="170" rx="5" ry="12"/>']};
const BACK={traps:['<path d="M38 38 L50 34 L62 38 L58 50 L42 50Z"/>'],reardelt:['<ellipse cx="29" cy="46" rx="9" ry="7"/>','<ellipse cx="71" cy="46" rx="9" ry="7"/>'],
upperback:['<rect x="38" y="50" width="24" height="14" rx="5"/>'],lats:['<path d="M34 52 L46 60 L46 84 L36 76Z"/>','<path d="M66 52 L54 60 L54 84 L64 76Z"/>'],
triceps:['<ellipse cx="23" cy="66" rx="5" ry="10"/>','<ellipse cx="77" cy="66" rx="5" ry="10"/>'],
glutes:['<ellipse cx="42" cy="104" rx="9" ry="9"/>','<ellipse cx="58" cy="104" rx="9" ry="9"/>'],
hamstrings:['<ellipse cx="40" cy="132" rx="8" ry="17"/>','<ellipse cx="60" cy="132" rx="8" ry="17"/>'],
calves:['<ellipse cx="40" cy="170" rx="6" ry="13"/>','<ellipse cx="60" cy="170" rx="6" ry="13"/>']};
const SIL='<g fill="#c9c4e8"><circle cx="50" cy="20" r="12"/><rect x="32" y="36" width="36" height="62" rx="12"/><rect x="17" y="40" width="12" height="58" rx="6"/><rect x="71" y="40" width="12" height="58" rx="6"/><rect x="33" y="94" width="15" height="92" rx="7"/><rect x="52" y="94" width="15" height="92" rx="7"/></g>';
function fig(map,m,dx,label){let g='<g transform="translate('+dx+',0)">'+SIL+'<g fill="#e0dcf5" stroke="#b5aedb" stroke-width=".8">';
 for(const k in map)if(k!==m)g+=map[k].join('');g+='</g><g fill="#ff3d7f" stroke="#c4004a" stroke-width="1.5">'+(map[m]||[]).join('')+'</g>';
 return g+(label?'<text x="50" y="200" text-anchor="middle" font-size="11" font-weight="700" fill="#555">'+label+'</text>':'')+'</g>'}
const body=m=>'<svg viewBox="0 0 210 205">'+fig(FRONT,m,0,'FRONT')+fig(BACK,m,110,'BACK')+'</svg>';
const thumb=m=>'<svg viewBox="0 0 100 190" class="mini">'+fig(FRONT[m]?FRONT:BACK,m,0)+'</svg>';
const ICON=['🧍','⬇️','⬆️'];
/* ---------- realistic anatomy (CC BY-SA 4.0 OpenStax/Kebe, see CREDITS.md) ---------- */
const WK=[[0,1],[200,1],[250,.9],[330,.88],[420,.86],[520,.84],[580,.98],[640,1.07],[720,1.06],[850,1.02],[950,1],[1256,1]];
function wf(y){for(let i=1;i<WK.length;i++)if(y<=WK[i][0]){const[a,b]=[WK[i-1],WK[i]];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0])}return 1}
function regPts(key){const out=[];(REG[key]||[]).forEach(([v,pts])=>{const c=v==='f'?CF:CB;
 [pts,pts.map(([x,y])=>[2*c-x,y])].forEach(P=>out.push(P.map(([x,y])=>S.sex==='f'?[c+(x-c)*wf(y),y]:[x,y]).map(p=>p.map(Math.round).join(',')).join(' ')))});return out}
let uid=0;
function anatLayers(hp,hs,id){const sx=S.sex==='f'?'f':'m',I=n=>`img/body-${sx}${n}.webp`;
 const mk=(k,suf)=>`<mask id="${id}${suf}" maskUnits="userSpaceOnUse" x="0" y="0" width="1442" height="1256">${k.map(r=>`<image href="img/m/${sx}-${r}.png" width="1442" height="1256"/>`).join('')}</mask>`;
 return `<defs>${mk(hp,'p')}${hs.length?mk(hs,'s'):''}<filter id="${id}g" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="10"/></filter></defs>
 <image href="${I('-dim')}" width="1442" height="1256"/>
 ${hs.length?`<g mask="url(#${id}s)"><image href="${I('')}" width="1442" height="1256"/><rect width="1442" height="1256" fill="#ff9800" opacity=".45"/></g>`:''}
 <g filter="url(#${id}g)" opacity=".9"><rect width="1442" height="1256" fill="#ff1744" mask="url(#${id}p)"/></g>
 <g mask="url(#${id}p)"><image href="${I('')}" width="1442" height="1256"/><rect width="1442" height="1256" fill="#ff1744" opacity=".35"/></g>`}
function anatomy(e){const k=KIN[e[0]],id='c'+(uid++);
 return `<svg viewBox="0 0 1442 1256" class="anat">${anatLayers(k.hp,k.hs,id)}
 <text x="388" y="1245" text-anchor="middle" font-size="44" font-weight="700" fill="#555">FRONT</text><text x="1196" y="1245" text-anchor="middle" font-size="44" font-weight="700" fill="#555">BACK</text></svg>`}
const GIF={dbfly:'dbfly.gif'};
const BACKR=['traps','rdelt','upperback','lats','triceps','erectors','glutes','hams','calves'];
function thumbA(id,st){const k=KIN[id],back=BACKR.includes(k.hp[0]);return `<svg viewBox="${back?'1000 0 392 1256':'190 0 396 1256'}" class="mini" ${st?`style="${st}"`:''}>${anatLayers(k.hp,[],'t'+(uid++))}</svg>`}
const CH={A:['Anterior chain','#2f7bff'],P:['Posterior chain','#7b3fe4'],B:['Anterior + Posterior','linear-gradient(90deg,#2f7bff,#7b3fe4)'],L:['Lateral (side)','#00a3a3']};
function kin(e){const k=KIN[e[0]];return `<div class="chips"><span class="chip" style="background:${CH[k.chain][1]}">⛓ ${CH[k.chain][0]}</span><span class="chip" style="background:#e53935">🎯 Prime: ${k.pm}</span>
 <span class="chip" style="background:#fb8c00">🤝 Helpers: ${k.syn}</span>${k.stab&&k.stab!=='—'?`<span class="chip" style="background:#607d8b">🧱 Stabilize: ${k.stab}</span>`:''}<span class="chip" style="background:#2e7d32">⚙️ ${k.act}</span></div>`}
function profileBody(e){const k=KIN[e[0]];return `<h2 class="ttl">${e[1]}</h2><div class="meta"><span class="tag ${e[2]}">${e[4]}</span> ${e[5]}</div>
 <div class="anatwrap">${anatomy(e)}${GIF[e[0]]?`<img class="gif" src="img/anim/${GIF[e[0]]}" alt="motion">`:''}</div>
 <div class="prow"><span class="chip pm">🎯 ${k.pm}</span><button class="morebtn" onclick="event.stopPropagation();openKin('${e[0]}')">ℹ️ More</button></div>
 <div class="steps">${e[6].map((s,i)=>`<div class="step"><b>${i+1}</b><span>${s}</span></div>`).join('')}</div>
 <a class="vid" href="${vidLink(e)}" target="_blank" rel="noopener">▶ Watch how</a>`}
function openKin(id){const e=BY[id],m=document.createElement('div');m.className='modal full';
 m.innerHTML=`<div class="card prof"><h2 class="ttl">${e[1]}</h2><div class="legend"><span style="color:#e53935">■ Prime</span> <span style="color:#fb8c00">■ Helpers</span></div>${kin(e)}<div class="btns"><button class="pill keep">✔ Got it</button></div></div>`;
 document.body.appendChild(m);m.querySelector('.keep').onclick=()=>m.remove()}
const vidLink=e=>e[7]?'https://www.youtube.com/watch?v='+e[7]:'https://www.youtube.com/results?search_query='+encodeURIComponent(e[1]+' form short');

/* ---------- helpers ---------- */
const plan=d=>S.plan[d]||(S.plan[d]=[]);
function deck(d){const t=type(d),used=new Set(plan(d).map(x=>x.id)),sk=new Set(S.skips[d]||[]);
 let L=EX.filter(e=>(S.mix?true:e[2]===t)&&!used.has(e[0])&&pass(e[0],!S.mix));
 const seed=parse(d).getDate();L.sort((a,b)=>((a[0].charCodeAt(1)*seed)%17)-((b[0].charCodeAt(1)*seed)%17));
 const later=L.filter(e=>S.later[e[0]]&&!sk.has(e[0])),fresh=L.filter(e=>!S.later[e[0]]&&!sk.has(e[0])),skipped=L.filter(e=>sk.has(e[0]));
 return [...later,...fresh,...skipped];}
const dlabel=d=>d===today()?'Today':d===addD(today(),1)?'Tomorrow':WD[parse(d).getDay()]+' '+parse(d).getDate();

/* ---------- header / nudges ---------- */
function header(){
 const p=plan(sel).length;let h='';const u=PR.list.find(x=>x.id===UID);
 const tp=S.plan[today()]||[],unfinished=tp.length&&tp.some(x=>x.done.filter(Boolean).length<x.sets);
 const nudge=unfinished?'<div class="nudge" onclick="go(\'train\')">⏰ Workout not done → 💪</div>':(prevOpen&&Date.now()-prevOpen>DAY)?'<div class="nudge">👋 Welcome back!</div>':'';
 h+=`<div class="row top1">${tab==='swipe'?`<button class="pill ${sel===today()?'on':''}" onclick="pick(0)">Today</button><button class="pill ${sel===addD(today(),1)?'on':''}" onclick="pick(1)">Tmrw</button><button class="pill ${S.mix?'':'on'} ${type(sel)}" onclick="S.mix=0;save();render()">${type(sel)==='U'?'💪 Up':'🦵 Low'}</button><button class="pill ${S.mix?'on':''}" onclick="S.mix=1;save();render()">🌈 All</button>`:`<span style="flex:1"></span>`}<button class="pill usr" onclick="who()">👤${u?u.name.replace(/</g,'').slice(0,1).toUpperCase():''}</button><button class="pill" onclick="chooseSex()" aria-label="Settings">⚙️</button></div>${nudge}`;
 if(tab==='swipe')h+=`<div class="addto">➕ <b>${dlabel(sel)}</b> ${S.mix?'🌈':TN[type(sel)].split(' ')[0]} <span class="dots">${[0,1,2,3,4].map(i=>`<i class="dot ${i<p?'f':''}"></i>`).join('')}</span> <b>${p}/5</b>${p<3?' ⚠️':''}</div>`;
 T.innerHTML=h;}
function nextOpen(d){for(let n=1;n<=14;n++){const t=addD(d,n);if(plan(t).length<5)return t}return null}
function toast(t){const el=document.createElement('div');el.className='toast';el.innerHTML=t;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}
function advance(){const n=nextOpen(sel);if(!n)return false;sel=n;toast(`🏆 Day full!<br>Next up: <b>${dlabel(n)}</b> ${TN[type(n)]}`);return true}
function pick(n){sel=addD(today(),n);render()}
function flipType(){if(confirm('Switch Upper/Lower pattern?')){S.anchor=addD(S.anchor,1);save();render()}}

/* ---------- swipe ---------- */
function swipeView(){
 const p=plan(sel);
 if(p.length>=5&&advance())return swipeView();if(p.length>=5){V.innerHTML=`<div class="done"><div class="e">🏆</div><h2>${dlabel(sel)} is FULL!</h2><p>5 exercises. You're set! 🎉</p><button class="pill on" onclick="go('matches')">See matches 💚</button></div>`;return}
 const D=deck(sel);if(!D.length){V.innerHTML=filterBar(!S.mix)+`<div class="done"><div class="e">🃏</div><h2>No cards</h2><button class="pill on" onclick="fAll()">✨ Show all</button> ${S.last?'<button class="pill" onclick="undo()">↩️ Undo</button>':''}</div>`;return}
 const e=D[0],nx=D[1];
 V.innerHTML=filterBar(!S.mix)+`<div id="deck">${nx?card(nx,'nx'):''}${card(e,'top')}</div>
 <div class="ctl"><button class="big n" onclick="decide(false)" aria-label="Skip">✖</button><button class="big u" onclick="undo()" ${S.last?'':'disabled'} aria-label="Undo">↩️</button><div class="sets"><button onclick="setS(-1)">−</button><span>${'●'.repeat(setsN)}</span><button onclick="setS(1)">+</button></div><button class="big y" onclick="decide(true)" aria-label="Like">💚</button></div>
 `;
 if(nx)$('#deck .nx').style.transform='scale(.95) translateY(10px)';
 drag($('#deck .top'));}
function card(e,c){return `<div class="card ${c}" data-id="${e[0]}"><div class="stamp y">YES</div><div class="stamp n">NOPE</div>${c==='top'?profileBody(e):`<h2>${e[1]}</h2>`}</div>`}
function setS(d){setsN=Math.max(3,Math.min(5,setsN+d));render()}
function drag(el){let x0=0,dx=0,on=false;
 el.addEventListener('pointerdown',ev=>{if(ev.target.closest('a'))return;on=true;x0=ev.clientX;el.style.transition='none'});
 el.addEventListener('pointermove',ev=>{if(!on)return;dx=ev.clientX-x0;el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
  el.querySelector('.y').style.opacity=Math.max(0,dx/100);el.querySelector('.n').style.opacity=Math.max(0,-dx/100)});
 const end=()=>{if(!on)return;if(Math.abs(dx)<4){on=false;dx=0;return}on=false;el.style.transition='transform .3s';if(Math.abs(dx)>90)decide(dx>0);else{el.style.transform='';el.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0)}dx=0};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);}
function decide(yes){const el=$('#deck .top');if(!el)return;const id=el.dataset.id;
 el.style.transition='transform .3s';el.style.transform=`translateX(${yes?600:-600}px) rotate(${yes?30:-30}deg)`;
 if(yes){plan(sel).push({id,sets:setsN,done:[]});delete S.later[id];boom(plan(sel).length>=5?250:90);navigator.vibrate&&navigator.vibrate(40)}
 else{(S.skips[sel]=S.skips[sel]||[]).push(id);S.later[id]=1}
 S.last={d:sel,id,yes};
 save();if(yes&&plan(sel).length>=5)setTimeout(()=>{advance();render()},700);else setTimeout(render,280)}

function undo(){const l=S.last;if(!l)return;if(l.yes){const i=plan(l.d).findIndex(x=>x.id===l.id);if(i>=0)plan(l.d).splice(i,1)}else{const a=S.skips[l.d]||[];a.splice(a.lastIndexOf(l.id),1);delete S.later[l.id]}
 S.last=null;sel=l.d;save();render()}
/* ---------- matches ---------- */
function matchesView(){const all=[];Object.keys(S.plan).filter(d=>d>=today()).sort().forEach(d=>S.plan[d].forEach((x,i)=>all.push({d,i,x})));
 const L=all.filter(o=>pass(o.x.id));
 const PPN={push:['👐','Push','#00897b'],pull:['🪢','Pull','#6d4c41'],other:['⭕','Other','#757575']};
 V.innerHTML='<div class="sticky">'+filterBar()+'</div><h2 style="margin:6px 0">💚 Matches <small>('+L.length+'/'+all.length+')</small></h2>'+
 (!all.length?'<div class="done"><div class="e">💔</div><h2>No matches yet</h2><button class="pill on" onclick="go(\'swipe\')">🔥 Swipe</button></div>':
  !L.length?'<div class="done"><div class="e">🔍</div><h2>None match</h2><button class="pill on" onclick="fAll()">✨ Show all</button></div>':
  L.map(({d,i,x})=>{const e=BY[x.id],k=KIN[x.id],q=PPN[pp(x.id)],c=CH[k.chain];
  return `<div class="item"><span onclick="openProf('${d}',${i})" style="display:contents">${thumbA(x.id)}<span class="nm">${e[1]}<div class="bdg"><b class="${e[2]}">${e[2]==='U'?'💪 Upper':'🦵 Lower'}</b><b style="background:${c[1]}">${{A:'⬅️ Front',P:'➡️ Back',B:'↔️ Both',L:'↕️ Side'}[k.chain]}</b><b style="background:${q[2]}">${q[0]} ${q[1]}</b><b style="background:#fff;color:#1a1a2e;border:2px solid #1a1a2e">📅 ${dlabel(d)}</b></div></span></span>
  <button onclick="unmatch('${d}',${i})" aria-label="Unmatch">💔</button></div>`}).join(''))}
function unmatch(d,i){const[x]=S.plan[d].splice(i,1);S.later[x.id]=1;save();render()}
function pin(d,i,w){if(w==='')return;let t=today();while(parse(t).getDay()!=w)t=addD(t,1);
 if(t===d)return;if(plan(t).length>=5){alert('That day is full (5) 🏆');return render()}
 const[x]=S.plan[d].splice(i,1);plan(t).push(x);save();render()}

/* ---------- profile view ---------- */
function openProf(d,i){const x=plan(d)[i];if(!x)return;const e=BY[x.id];let m=document.createElement('div');m.className='modal full';
 m.innerHTML=`<div class="card prof pv">${profileBody(e)}
 <div class="pctl"><div class="sets"><button data-a="-1">−</button><span>${'●'.repeat(x.sets)}</span><button data-a="1">+</button></div>
 <select class="mv2"><option value="">📅 ${dlabel(d)}</option>${[1,2,3,4,5,6,0].map(w=>`<option value="${w}">➡️ ${WD[w]}</option>`).join('')}</select></div>
 <input class="exnote" placeholder="📝 note" value="${(S.exNotes[x.id]||'').replace(/"/g,'&quot;')}">
 <div class="btns"><button class="pill keep">Keep it 💚</button><button class="pill unm">Unmatch 💔</button></div></div>`;
 document.body.appendChild(m);const close=()=>{m.remove();render()};
 m.querySelectorAll('.sets button').forEach(b=>b.onclick=()=>{x.sets=Math.max(3,Math.min(5,x.sets+ +b.dataset.a));save();m.querySelector('.sets span').textContent='●'.repeat(x.sets)});
 m.querySelector('.exnote').onchange=ev=>{S.exNotes[x.id]=ev.target.value;save()};
 m.querySelector('.mv2').onchange=ev=>{m.remove();pin(d,i,ev.target.value)};
 m.querySelector('.keep').onclick=()=>{boom(40);close()};m.querySelector('.unm').onclick=()=>{unmatch(d,i);m.remove()}}
function tour(n){document.querySelectorAll('.modal').forEach(m=>m.remove());if(n===0)n=1;
 const T=[null,['👉💚 👈✖','Swipe','Right = add 💚<br>Left = skip ✖<br>↩️ = undo'],['💚📅','Matches','Tap a match to see it.<br>Plan your 📅 week.']][n];
 if(!T){S.tour=1;save();return render()}
 const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="card prof" style="text-align:center"><div style="font-size:15px">${n} / 2</div><div style="font-size:64px">${T[0]}</div><h2>${T[1]}</h2><p style="font-size:22px">${T[2]}</p><div class="btns"><button class="pill keep">Next ➡️</button></div></div>`;
 document.body.appendChild(m);m.querySelector('.keep').onclick=()=>tour(n+1)}
function chooseSex(next){let m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div class="card prof" style="text-align:center"><h2>Muscle pictures</h2><p>Show me as:</p><div class="btns"><button class="pill sexb" data-s="f" style="font-size:26px">👩 Woman</button><button class="pill sexb" data-s="m" style="font-size:26px">👨 Man</button></div><p><a href="CREDITS.md" target="_blank">ⓒ Art credits</a></p></div>`;
 document.body.appendChild(m);m.querySelectorAll('.sexb').forEach(b=>b.onclick=()=>{S.sex=b.dataset.s;const u=PR.list.find(x=>x.id===UID);if(u){u.sex=S.sex;saveP()}save();m.remove();next?next():render()})}
/* ---------- week grid with touch drag & drop ---------- */
function weekView(){let mon=today();while(parse(mon).getDay()!==1)mon=addD(mon,-1);
 V.innerHTML='<h2>📅 Week menu</h2><p style="font-size:15px">Hold & drag pictures to move ✋</p><div class="wk">'+[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(n=>{const d=addD(mon,n),p=plan(d);if(n==7)return '<h3 style="margin:8px 0 0">➡️ Next week</h3>'+wd(d,p);return wd(d,p)}).join('')+'</div>';
 V.querySelectorAll('.dg').forEach(dnd)}
function wd(d,p){{
 return `<div class="wd ${type(d)} ${d===today()?'today':''}" data-d="${d}"><b>${WD[parse(d).getDay()]} ${parse(d).getDate()}</b> <span class="tag ${type(d)}">${TN[type(d)]}</span> ${S.hist[d]?'✅':''}
 <div class="th" style="display:flex;flex-wrap:wrap;gap:6px;min-height:64px;margin-top:4px">${p.map((x,i)=>`<div class="dg" data-d="${d}" data-i="${i}" style="background:#fff;border-radius:10px;padding:3px;touch-action:none;width:58px;text-align:center;color:#1a1a2e;font-size:11px;font-weight:700;line-height:1.1">${thumbA(x.id,'width:40px;height:72px')}<div>${BY[x.id][1].split(' ').slice(-2).join(' ')}</div></div>`).join('')}</div></div>`}}
function dnd(el){let g=null;
 let sx0,sy0;el.addEventListener('pointerdown',ev=>{sx0=ev.clientX;sy0=ev.clientY;el.setPointerCapture(ev.pointerId);g=el.cloneNode(true);Object.assign(g.style,{position:'fixed',zIndex:99,pointerEvents:'none',opacity:.85,transform:'scale(1.15)'});document.body.appendChild(g);mv(ev);el.style.opacity=.3});
 const mv=ev=>{if(g){g.style.left=ev.clientX-30+'px';g.style.top=ev.clientY-40+'px'}};
 el.addEventListener('pointermove',mv);
 el.addEventListener('pointerup',ev=>{if(!g)return;g.remove();g=null;el.style.opacity=1;if(Math.hypot(ev.clientX-sx0,ev.clientY-sy0)<8)return openProf(el.dataset.d,+el.dataset.i);
  const t=document.elementFromPoint(ev.clientX,ev.clientY),day=t&&t.closest('.wd');if(!day)return;
  const fd=el.dataset.d,fi=+el.dataset.i,td=day.dataset.d,over=t.closest('.dg');
  if(fd!==td&&plan(td).length>=5){alert('Full (5) 🏆');return}
  const[x]=S.plan[fd].splice(fi,1);let ti=over?+over.dataset.i:plan(td).length;if(fd===td&&over&&fi<ti)ti--;
  plan(td).splice(ti,0,x);save();boom(30);render()});
 el.addEventListener('pointercancel',()=>{if(g){g.remove();g=null;el.style.opacity=1}})}

/* ---------- train / tracking ---------- */
function streak(){let n=0,d=today();if(!S.hist[d])d=addD(d,-1);while(S.hist[d]){n++;d=addD(d,-1)}return n}
function trainView(){const d=today(),p=plan(d);
 V.innerHTML=`<h2>🏋️ Today <span class="tag ${type(d)}">${TN[type(d)]}</span></h2><div class="box" style="font-size:24px;text-align:center">🔥 ${streak()} day streak · ✅ ${Object.keys(S.hist).length} total</div>`+
 (p.length?p.map((x,i)=>{const e=BY[x.id];return `<div class="item" style="flex-wrap:wrap">${thumbA(x.id)}<span class="nm">${e[1]}</span><a href="${vidLink(e)}" target="_blank">▶</a>
 <div style="display:flex;gap:8px;width:100%">${Array.from({length:x.sets},(_,k)=>`<button onclick="tick(${i},${k})" style="flex:1;height:60px;font-size:32px;border-radius:14px;border:0;background:${x.done[k]?'#1fc46b':'#eee'}">${x.done[k]?'✔':k+1}</button>`).join('')}</div>
 ${S.exNotes[x.id]?`<small>📝 ${S.exNotes[x.id]}</small>`:''}</div>`}).join('')+`<textarea placeholder="📝 How did it feel?" onchange="S.notes['${d}']=this.value;save()" style="width:100%;font:inherit;font-size:16px;border-radius:10px">${S.notes[d]||''}</textarea>`
 :'<p>No workout today. Swipe some! 🔥</p>')+
 `<button class="pill" style="margin-top:12px" onclick="askNotify()">🔔 Reminders ${('Notification' in window)?Notification.permission:'n/a'}</button>`}
function tick(i,k){const d=today(),x=plan(d)[i];x.done[k]=!x.done[k];navigator.vibrate&&navigator.vibrate(30);
 const all=plan(d).every(y=>y.done.filter(Boolean).length>=y.sets);
 if(all&&!S.hist[d]){S.hist[d]=1;boom(300)}else if(!all)delete S.hist[d];else if(x.done[k])boom(20);save();render()}

/* ---------- notifications ---------- */
async function askNotify(){if(!('Notification' in window))return alert('Add to Home Screen first, then try again 📲');await Notification.requestPermission();render();remind()}
function remind(){if(!('Notification' in window)||Notification.permission!=='granted'||!navigator.serviceWorker)return;
 const tp=S.plan[today()]||[];const unfinished=tp.length&&!S.hist[today()];
 navigator.serviceWorker.ready.then(r=>{
  if(unfinished)r.showNotification('SwipeFit 💪',{body:'Workout waiting! Tap to train.',tag:'sf',icon:'icon-192.png'});
  else if(!(S.plan[addD(today(),1)]||[]).length)r.showNotification('SwipeFit 🔥',{body:'Swipe tomorrow\'s moves before bed 😴',tag:'sf',icon:'icon-192.png'});
  if(r.periodicSync)r.periodicSync.register('sf-remind',{minInterval:DAY}).catch(()=>{})})}
document.addEventListener('visibilitychange',()=>{if(document.hidden)setTimeout(remind,1000);else{S.lastOpen=Date.now();save()}});

/* ---------- confetti ---------- */
const cv=$('#confetti'),cx=cv.getContext('2d');let P=[];
function boom(n){cv.width=innerWidth;cv.height=innerHeight;for(let i=0;i<n;i++)P.push({x:innerWidth/2,y:innerHeight*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,c:`hsl(${Math.random()*360},90%,60%)`,r:Math.random()*6+4,l:90});if(P.length===n)loop()}
function loop(){cx.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.5;p.l--;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.r,p.r*.6)});P=P.filter(p=>p.l>0);if(P.length)requestAnimationFrame(loop);else cx.clearRect(0,0,cv.width,cv.height)}

/* ---------- router ---------- */
function go(t){tab=t;render()}
function render(){header();V.className=tab==='swipe'?'swipe':'';({swipe:swipeView,matches:matchesView,week:weekView,train:trainView})[tab]();
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab))}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
if(location.hash&&location.hash!=='#prof')tab=location.hash.slice(1);
{const q=new URLSearchParams(location.search).get('u');if(q&&PR.list[+q-1]){loadUser(PR.list[+q-1].id);if(location.hash==='#prof')openProf(today(),0);if(location.hash==='#prof2')openProf(addD(today(),1),0)}else{render();who()}}
if(location.search.includes('check'))setTimeout(function chk(){document.querySelectorAll('.chk').forEach(x=>x.remove());const se=document.scrollingElement,c=document.querySelector('.modal .card')||document.querySelector('#deck .top'),
 ok=se.scrollHeight<=innerHeight&&se.scrollWidth<=innerWidth&&(!c||c.scrollHeight<=c.clientHeight+1)&&document.body.scrollHeight<=innerHeight;
 const d=document.createElement('div');d.className='chk';d.textContent=(ok?'FIT ✅ ':'OVERFLOW ❌ ')+se.scrollHeight+'/'+innerHeight+(c?' card '+c.scrollHeight+'/'+c.clientHeight:'');document.body.appendChild(d)},50);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
