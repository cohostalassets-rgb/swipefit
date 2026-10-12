// Tiny 2-pose stick-figure animator (own work). Side view rig with 2-bone IK; front view rig for frontal-plane moves.
const AL={ua:28,fa:26,th:42,sh:40,to:50};
const r=Math.PI/180;
function ik(A,T,l1,l2,s){let dx=T[0]-A[0],dy=T[1]-A[1],d=Math.hypot(dx,dy),m=l1+l2-.01;if(d>m){T=[A[0]+dx/d*m,A[1]+dy/d*m];d=m}
 const b=Math.atan2(dy,dx),a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))))*s;
 return [[A[0]+l1*Math.cos(b+a),A[1]+l1*Math.sin(b+a)],T]}
// pose helpers
const BB='bb',DB='db',CA='cable',BW='bw';
const AP={
bench:{eq:BB,bench:[45,150,110,8],A:{h:[120,142],t:-90,hd:[72,92],f:[160,185],eb:1},B:{h:[120,142],t:-90,hd:[74,128],f:[160,185],eb:1}},
incline:{eq:BB,benchLine:[[128,152],[64,114]],A:{h:[118,148],t:-62,hd:[76,72],f:[160,185],eb:1},B:{h:[118,148],t:-62,hd:[84,112],f:[160,185],eb:1}},
fly:{eq:DB,fr:1,lying:1,A:{sy:140,hands:[[92,86],[108,86]]},B:{sy:140,hands:[[38,132],[162,132]]}},
crossover:{eq:CA,fr:1,anchors:[[8,25],[192,25]],A:{sy:58,hy:104,hands:[[26,46],[174,46]],feet:[[85,185],[115,185]]},B:{sy:58,hy:104,hands:[[94,116],[106,116]],feet:[[85,185],[115,185]]}},
pushup:{eq:BW,A:{h:[112,150],t:-70,hd:[65,184],f:[186,184],eb:1},B:{h:[112,170],t:-82,hd:[65,184],f:[186,184],eb:1}},
pullup:{eq:BW,bar:[60,46,140],noGround:1,A:{h:[100,152],t:0,hd:[100,48],f:[98,194],eb:1},B:{h:[100,116],t:0,hd:[100,48],f:[88,154],eb:1}},
pulldown:{eq:CA,anchor:[100,8],seat:[70,152,50,8],A:{h:[95,150],t:-10,hd:[95,52],f:[142,185],eb:1},B:{h:[95,150],t:-12,hd:[105,96],f:[142,185],eb:1}},
seatedrow:{eq:CA,anchor:[192,140],seat:[40,152,60,8],A:{h:[70,150],t:18,hd:[146,138],f:[140,150],eb:1,kb:-1},B:{h:[70,150],t:-2,hd:[88,128],f:[140,150],eb:1,kb:-1}},
dbrow:{eq:DB,bench:[30,128,80,8],A:{h:[120,118],t:-82,hd:['r',0,52],f:[128,185],eb:1},B:{h:[120,118],t:-82,hd:['r',28,30],f:[128,185],eb:1}},
bbrow:{eq:BB,A:{h:[90,118],t:62,hd:['r',2,52],f:[100,185]},B:{h:[90,118],t:62,hd:['r',-22,32],f:[100,185]}},
straightpull:{eq:CA,anchor:[178,18],A:{h:[85,106],t:15,hd:[146,44],f:[90,185]},B:{h:[85,106],t:15,hd:[100,118],f:[90,185]}},
facepull:{eq:CA,anchor:[195,54],A:{h:[85,104],t:-5,hd:[134,58],f:[85,185],eb:1},B:{h:[85,104],t:-5,hd:[96,46],f:[85,185],eb:-1}},
ohp:{eq:BB,A:{h:[100,103],t:0,hd:[110,58],f:[100,185]},B:{h:[100,103],t:0,hd:[102,6],f:[100,185]}},
dbpress:{eq:DB,fr:1,seatF:1,A:{sy:80,hy:128,hands:[[62,56],[138,56]],feet:[[70,185],[130,185]]},B:{sy:80,hy:128,hands:[[84,18],[116,18]],feet:[[70,185],[130,185]]}},
lateral:{eq:DB,fr:1,A:{sy:58,hy:104,hands:[[76,110],[124,110]],feet:[[88,185],[112,185]]},B:{sy:58,hy:104,hands:[[28,60],[172,60]],feet:[[88,185],[112,185]]}},
cablelateral:{eq:CA,fr:1,one:1,anchors:[null,[60,185]],A:{sy:58,hy:104,hands:[[76,110],[112,110]],feet:[[88,185],[112,185]]},B:{sy:58,hy:104,hands:[[76,110],[172,60]],feet:[[88,185],[112,185]]}},
revfly:{eq:DB,fr:1,bent:1,A:{sy:96,hy:110,hands:[[94,150],[106,150]],feet:[[80,185],[120,185]]},B:{sy:96,hy:110,hands:[[36,104],[164,104]],feet:[[80,185],[120,185]]}},
shrug:{eq:DB,fr:1,A:{sy:60,hy:104,hands:[[76,112],[124,112]],feet:[[88,185],[112,185]]},B:{sy:50,hy:104,hands:[[76,102],[124,102]],feet:[[88,185],[112,185]]}},
curl:{eq:DB,A:{h:[100,103],t:0,hd:['r',4,53],f:[100,185]},B:{h:[100,103],t:0,hd:['r',12,4],f:[100,185]}},
cablecurl:{eq:CA,anchor:[140,184],A:{h:[100,103],t:0,hd:['r',4,53],f:[100,185]},B:{h:[100,103],t:0,hd:['r',12,4],f:[100,185]}},
pushdown:{eq:CA,anchor:[128,10],A:{h:[95,103],t:8,hd:['r',22,10],f:[95,185]},B:{h:[95,103],t:8,hd:['r',4,53],f:[95,185]}},
ohext:{eq:CA,anchor:[18,70],A:{h:[100,103],t:12,hd:['r',-12,-6],f:[105,185],eb:-1},B:{h:[100,103],t:12,hd:['r',14,-50],f:[105,185],eb:-1}},
skull:{eq:BB,bench:[45,150,110,8],A:{h:[120,142],t:-90,hd:[72,90],f:[160,185],eb:1},B:{h:[120,142],t:-90,hd:[48,112],f:[160,185],eb:1}},
benchdip:{eq:BW,bench:[25,120,55,8],A:{h:[84,118],t:0,hd:[78,120],f:[176,184],eb:1},B:{h:[86,150],t:4,hd:[78,120],f:[176,184],eb:1}},
backsquat:{eq:BB,barAt:'sh',A:{h:[100,103],t:0,hd:['r',-4,4],f:[100,185]},B:{h:[74,140],t:40,hd:['r',-4,4],f:[100,185]}},
goblet:{eq:DB,A:{h:[100,103],t:0,hd:['r',16,22],f:[100,185]},B:{h:[76,140],t:32,hd:['r',16,22],f:[100,185]}},
frontsquat:{eq:BB,barAt:'front',A:{h:[100,103],t:0,hd:['r',12,6],f:[100,185]},B:{h:[80,142],t:22,hd:['r',12,6],f:[100,185]}},
bss:{eq:DB,bench:[18,140,42,8],A:{h:[96,106],t:4,hd:['r',2,52],f:[128,185],f2:[42,139]},B:{h:[92,142],t:10,hd:['r',2,52],f:[128,185],f2:[42,139]}},
lunge:{eq:DB,A:{h:[100,104],t:0,hd:['r',2,52],f:[134,185],f2:[66,185]},B:{h:[98,140],t:0,hd:['r',2,52],f:[134,185],f2:[66,185]}},
stepup:{eq:DB,box:[110,140,55,45],A:{h:[96,112],t:6,hd:['r',2,52],f:[130,140],f2:[82,185]},B:{h:[128,58],t:0,hd:['r',2,52],f:[130,140],f2:[138,140]}},
deadlift:{eq:BB,A:{h:[78,128],t:58,hd:['r',0,53],f:[108,185]},B:{h:[100,103],t:0,hd:['r',2,53],f:[100,185]}},
rdl:{eq:BB,A:{h:[100,103],t:0,hd:['r',2,53],f:[100,185]},B:{h:[84,106],t:72,hd:['r',0,53],f:[104,185]}},
legcurl:{eq:CA,anchor:[190,182],frame:1,A:{h:[100,103],t:8,hd:[140,70],f:[100,185],f2:[104,184],k2:-1},B:{h:[100,103],t:8,hd:[140,70],f:[100,185],f2:[64,140],k2:-1}},
hipthrust:{eq:BB,barAt:'hip',bench:[15,124,45,8],A:{h:[92,168],t:-43,f:[132,185],hd:'hip'},B:{h:[100,128],t:-85,f:[132,185],hd:'hip'}},
kickback:{eq:CA,anchor:[172,182],frame:1,A:{h:[100,103],t:18,hd:[142,72],f:[100,185],f2:[104,184]},B:{h:[100,103],t:22,hd:[142,72],f:[100,185],f2:[38,150]}},
pullthrough:{eq:CA,anchor:[12,182],A:{h:[78,108],t:70,hd:[96,150],f:[106,185]},B:{h:[100,103],t:0,hd:[110,122],f:[100,185]}},
sumo:{eq:DB,fr:1,A:{sy:56,hy:104,hands:[[96,130],[104,130]],feet:[[55,185],[145,185]]},B:{sy:94,hy:142,hands:[[96,166],[104,166]],feet:[[55,185],[145,185]]}},
calf:{eq:DB,A:{h:[100,101],t:0,hd:['r',2,52],f:[100,183],toe:[116,185]},B:{h:[103,88],t:0,hd:['r',2,52],f:[104,170],toe:[116,185]}},
bridge:{eq:BW,A:{h:[96,180],t:-86,hd:'chest',f:[136,184],f2:[176,170]},B:{h:[100,146],t:-118,hd:'chest',f:[136,184],f2:[178,122]}},
woodchop:{eq:CA,fr:1,anchors:[[190,22]],A:{sy:58,hy:104,hands:[[150,40],[156,46]],feet:[[78,185],[122,185]]},B:{sy:62,hy:108,hands:[[56,128],[62,134]],feet:[[78,185],[122,185]]}},
cablecrunch:{eq:CA,anchor:[150,8],kneel:1,A:{h:[100,130],t:6,hd:['r',12,8],f:[52,182]},B:{h:[100,130],t:62,hd:['r',12,8],f:[52,182]}},
situp:{eq:BW,A:{h:[100,178],t:-86,hd:'chest',f:[138,184]},B:{h:[100,176],t:-12,hd:'chest',f:[138,184]}}
};
const lerp=(a,b,k)=>a+(b-a)*k, lp=(a,b,k)=>[lerp(a[0],b[0],k),lerp(a[1],b[1],k)];
function side(p,q,k){const h=lp(p.h,q.h,k),t=lerp(p.t,q.t,k)*r,u=[Math.sin(t),-Math.cos(t)];
 const sh=[h[0]+u[0]*AL.to,h[1]+u[1]*AL.to],hd=[h[0]+u[0]*(AL.to+13),h[1]+u[1]*(AL.to+13)];
 const chest=[h[0]+u[0]*36+(u[1]<0?6:0)*0,h[1]+u[1]*36];
 const res=x=>x==='chest'?[chest[0]-u[1]*-4,chest[1]+u[0]*-4]:x==='hip'?[h[0],h[1]-6]:x[0]==='r'?[sh[0]+x[1],sh[1]+x[2]]:x;
 const hand=lp(res(p.hd),res(q.hd),k),[el,hn]=ik(sh,hand,AL.ua,AL.fa,p.eb||1);
 const f=lp(p.f,q.f,k),[kn,ft]=ik(h,f,AL.th,AL.sh,p.kb||-1);
 let o={h,sh,hd,el,hn,kn,ft,toe:p.toe?lp(p.toe,q.toe,k):[ft[0]+13,ft[1]+1]};
 if(p.f2){const f2=lp(p.f2,q.f2,k);[o.kn2,o.ft2]=ik(h,f2,AL.th,AL.sh,(k<.5?p.k2:q.k2)||-1)}
 return o}
function front(p,q,k,def){const sy=lerp(p.sy,q.sy,k),hy=lerp(p.hy||sy+48,q.hy||sy+48,k),o={sy,hy};
 o.sL=[82,sy];o.sR=[118,sy];o.hL=[90,hy];o.hR=[110,hy];o.head=def.bent?[100,sy+4]:def.lying?[100,sy-4]:[100,sy-17];
 const H=[lp(p.hands[0],q.hands[0],k),lp(p.hands[1],q.hands[1],k)];
 [o.eL,o.nL]=ik(o.sL,H[0],AL.ua,AL.fa,1);[o.eR,o.nR]=ik(o.sR,H[1],AL.ua,AL.fa,-1);
 if(p.feet){const F=[lp(p.feet[0],q.feet[0],k),lp(p.feet[1],q.feet[1],k)];[o.kL,o.fL]=ik(o.hL,F[0],AL.th,AL.sh,1);[o.kR,o.fR]=ik(o.hR,F[1],AL.th,AL.sh,-1)}
 return o}
const L=(a,b,c='#1a1a2e',w=7)=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const C=(a,rr,c)=>`<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="${rr}" fill="${c}"/>`;
function gear(eq,hn,def,o){if(eq===BB){const y=hn[1];return L([hn[0]-3,y],[hn[0]+3,y],'#555',4)+`<rect x="${hn[0]-5}" y="${y-17}" width="10" height="34" rx="3" fill="#2f7bff"/>`}
 if(eq===DB)return L([hn[0]-6,hn[1]],[hn[0]+6,hn[1]],'#444',4)+`<rect x="${hn[0]-10}" y="${hn[1]-6}" width="5" height="12" rx="1.5" fill="#ff8a1f"/><rect x="${hn[0]+5}" y="${hn[1]-6}" width="5" height="12" rx="1.5" fill="#ff8a1f"/>`;return ''}
function frame(name,k){const d=AP[name],p=d.A,q=d.B;let s='';
 if(!d.noGround)s+=L([0,188],[200,188],'#cfc9ef',4);
 if(d.bench)s+=`<rect x="${d.bench[0]}" y="${d.bench[1]}" width="${d.bench[2]}" height="${d.bench[3]}" rx="3" fill="#8a5a3c"/>`+L([d.bench[0]+8,d.bench[1]+8],[d.bench[0]+8,188],'#8a5a3c',4)+L([d.bench[0]+d.bench[2]-8,d.bench[1]+8],[d.bench[0]+d.bench[2]-8,188],'#8a5a3c',4);
 if(d.benchLine)s+=L(d.benchLine[0],d.benchLine[1],'#8a5a3c',8)+L([d.benchLine[0][0],d.benchLine[0][1]],[d.benchLine[0][0],188],'#8a5a3c',4);
 if(d.seat)s+=`<rect x="${d.seat[0]}" y="${d.seat[1]}" width="${d.seat[2]}" height="${d.seat[3]}" rx="3" fill="#8a5a3c"/>`+L([d.seat[0]+d.seat[2]/2,d.seat[1]],[d.seat[0]+d.seat[2]/2,188],'#8a5a3c',4);
 if(d.box)s+=`<rect x="${d.box[0]}" y="${d.box[1]}" width="${d.box[2]}" height="${d.box[3]}" rx="3" fill="#8a5a3c"/>`;
 if(d.bar)s+=L([d.bar[0],d.bar[1]],[d.bar[2],d.bar[1]],'#555',5);
 if(d.frame)s+=L([150,188],[150,60],'#888',5)+L([140,70],[160,70],'#888',5);
 if(d.anchor||d.anchors)s+=(d.anchors||[d.anchor]).filter(Boolean).map(a=>`<rect x="${a[0]-6}" y="${a[1]-6}" width="12" height="12" rx="2" fill="#888"/>`).join('');
 if(d.fr){const o=front(p,q,k,d);
  if(d.lying)s+=`<rect x="70" y="${o.sy+6}" width="60" height="10" rx="3" fill="#8a5a3c"/>`+L([100,o.sy+16],[100,188],'#8a5a3c',5)+`<ellipse cx="100" cy="${o.sy}" rx="22" ry="9" fill="#1a1a2e"/>`;
  else{s+=L([100,o.sy+(d.bent?0:0)],[100,o.hy],'#1a1a2e',14)+L(o.sL,o.sR)+L(o.hL,o.hR);
   if(o.fL)s+=L(o.hL,o.kL)+L(o.kL,o.fL)+L(o.hR,o.kR)+L(o.kR,o.fR)}
  if(d.seatF)s+=`<rect x="70" y="${o.hy}" width="60" height="8" rx="3" fill="#8a5a3c"/>`;
  s+=L(o.sL,o.eL)+L(o.eL,o.nL)+L(o.sR,o.eR)+L(o.eR,o.nR)+C(o.head,11,'#1a1a2e');
  if(d.eq===CA){const an=d.anchors||[];if(d.anchors&&d.anchors.length===1)s=L(an[0],o.nR,'#ff8a1f',2.5)+s;else{if(an[0])s=L(an[0],o.nL,'#ff8a1f',2.5)+s;if(an[1])s=L(an[1],o.nR,'#ff8a1f',2.5)+s}}
  if(d.eq===DB){s+=gear(DB,o.nL)+(d.one?'':gear(DB,o.nR))}
  return s}
 const o=side(p,q,k);
 if(d.eq===CA&&(d.anchor)){const tgt=name==='legcurl'||name==='kickback'?o.ft2:o.hn;s+=L(d.anchor,tgt,'#ff8a1f',2.5)}
 // back limbs (lighter)
 if(o.ft2)s+=L(o.h,o.kn2,'#6b6790')+L(o.kn2,o.ft2,'#6b6790');
 s+=L(o.h,o.sh,'#1a1a2e',12)+C(o.hd,11,'#1a1a2e');
 s+=L(o.h,o.kn)+L(o.kn,o.ft)+L(o.ft,o.toe,'#1a1a2e',6);
 s+=L(o.sh,o.el)+L(o.el,o.hn);
 if(d.barAt==='sh')s+=gear(BB,[o.sh[0]-4,o.sh[1]+3]);else if(d.barAt==='front')s+=gear(BB,[o.sh[0]+9,o.sh[1]+3]);else if(d.barAt==='hip')s+=gear(BB,[o.h[0],o.h[1]-9]);else s+=gear(d.eq,o.hn);
 return s}
const ease=t=>.5-.5*Math.cos(t*Math.PI*2);
function animSVG(name){return `<svg viewBox="0 0 200 200" class="anim" data-an="${name}">${frame(name,0)}</svg>`}
(function tick(ts){if(location.search.includes('still'))return;document.querySelectorAll('svg.anim').forEach(el=>{if(AP[el.dataset.an])el.innerHTML=frame(el.dataset.an,ease((ts||0)/2600%1))});requestAnimationFrame(tick)})();
