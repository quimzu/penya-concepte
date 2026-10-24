
/* =========================================================
   Dades d'exemple (alineades amb la home del concepte)
   ========================================================= */
const ZONES=[
 {id:'pista',name:'Pista',desc:'Seients a peu de pista, laterals',price:60,season:690,color:'#5fae96',txt:'#000'},
 {id:'latbaix',name:'Lateral baix',desc:'Anell inferior, vista central',price:38,season:470,color:'#2f8a70',txt:'#fff'},
 {id:'baix',name:'Fons i córner baix',desc:'Anell inferior, darrere les cistelles',price:26,season:390,color:'#00664f',txt:'#EBEDEC'},
 {id:'latalt',name:'Lateral alt',desc:'Anell superior, vista central',price:20,season:340,color:'#1f4a40',txt:'#EBEDEC'},
 {id:'alt',name:'Fons alt',desc:'Anell superior, el preu més assequible',price:14,season:290,color:'#2a3633',txt:'#cfd8d5'}
];
const TYPES=[{id:'adult',name:'Adult',f:1},{id:'jove',name:'Jove (14–25)',f:.7},{id:'infantil',name:'Infantil (<14)',f:.4}];
const MATCHES=[
 {id:'u22-ucam',team:'U22',date:'2026-10-30T20:15',rival:'UCAM Murcia Juver',comp:'Lliga U · J6',seated:false,ga:{adult:6,jove:4,infantil:0},gaCap:1500},
 {id:'fem-zamora',team:'Femení',date:'2026-10-31T19:00',rival:'Recoletas Zamora',comp:'LF Challenge · J8',seated:false,ga:{adult:8,jove:5,infantil:0},gaCap:2500},
 {id:'masc-bilbao',team:'Primer equip',date:'2026-11-01T12:00',rival:'Surne Bilbao',comp:'Lliga Endesa · J6',seated:true,tier:1,tag:'Matchday'}
];
const PACK={id:'pack',name:'Pack cap de setmana',price:39,match:'masc-bilbao',extra:['u22-ucam','fem-zamora'],zones:['latbaix','latalt']};
const PLANS=[
 {id:'soci',name:'Soci CJB',desc:'El teu seient a l\'Olímpic',perks:['Els 17 partits de Lliga Endesa i tota la BCL a casa','Seient fix i carnet digital al mòbil','Prioritat per a Copa i play-off','15% de descompte a la botiga'],f:1,persons:1,feat:true},
 {id:'jove',name:'Soci jove',desc:'De 14 a 25 anys',perks:['Tot el que inclou el Soci CJB','Preu reduït fins als 25 anys'],f:.6,persons:1},
 {id:'infantil',name:'Soci infantil',desc:'Menors de 14 anys',perks:['Tot el que inclou el Soci CJB','Kit de benvinguda'],f:95/290,persons:1},
 {id:'familiar',name:'Pack familiar',desc:'2 adults + 2 infants menors de 14',perks:['4 carnets amb seients junts','Un sol pagament'],f:2.4,persons:4},
 {id:'solidari',name:'Aficionat solidari',desc:'Penya Arreu · per als penyistes que viuen lluny',perks:['5 partits a l\'Olímpic a triar','Carnet digital i contingut exclusiu','10 € van a la Fundació Joventut'],flat:59,persons:1,noSeat:true}
];

/* =========================================================
   Sectors del Palau Olímpic (0° = dalt, sentit horari)
   ========================================================= */
const SECTORS=[];
function ring(ids,r0,r1,step,kind,cap){ids.forEach((id,i)=>SECTORS.push({id:String(id),r0,r1,a0:i*step,a1:(i+1)*step,ring:kind,cap}))}
ring([57,58,59,60,61,62,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56],.77,.97,15,'outer',220);
ring([20,21,22,23,24,1,0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],.55,.74,14.4,'middle',230);
[['37',0,40,200],['25',55,72.5,90],['26',72.5,90,90],['27',90,107.5,90],['28',107.5,125,90],['29',140,180,200],['30',180,220,200],
 ['32',235,252.5,90],['33',252.5,270,90],['34',270,287.5,90],['35',287.5,305,90],['36',320,360,200]]
 .forEach(([id,a0,a1,cap])=>SECTORS.push({id,r0:.40,r1:.52,a0,a1,ring:'inner',cap}));
SECTORS.forEach(s=>{const c=(s.a0+s.a1)/2,lat=(c>45&&c<135)||(c>225&&c<315);
  s.zone=s.ring==='inner'?(lat?'pista':'baix'):s.ring==='middle'?(lat?'latbaix':'baix'):(lat?'latalt':'alt')});
const SEC=id=>SECTORS.find(s=>s.id===id);
function layout(s){if(s._lay)return s._lay;
  const R=s.ring==='inner'?(s.zone==='pista'?6:10):14,base=Math.round(s.cap/R),rows=[];
  for(let i=0;i<R;i++)rows.push(base-2+Math.round(i*4/(R-1)));return s._lay=rows}
SECTORS.forEach(s=>{s.cap=layout(s).reduce((a,b)=>a+b,0)});
const isAcc=(s,row,seat)=>s.ring==='middle'&&row===1&&seat<=2;
const CAP=SECTORS.reduce((a,s)=>a+s.cap,0);

/* =========================================================
   Estat i persistència (només en aquest navegador)
   ========================================================= */
const KEY='penya_entrades_v1';
let db={orders:[]};
try{const s=localStorage.getItem(KEY);if(s)db=JSON.parse(s)}catch(e){}
let TK={};
const save=()=>{TK={};try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
let S={tab:'matches',view:'matches'};

/* ---------- Utilitats ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>n===0?'Gratuït':n.toLocaleString('ca-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2,minimumFractionDigits:0});
const D=s=>new Date(s);
const fDay=s=>D(s).getDate()+' '+D(s).toLocaleDateString('ca-ES',{month:'short'}).replace('.','').replace(/^de /,'');
const fWk=s=>D(s).toLocaleDateString('ca-ES',{weekday:'short'}).replace('.','')+' · '+fTime(s);
const fTime=s=>D(s).toLocaleTimeString('ca-ES',{hour:'2-digit',minute:'2-digit'});
const fLong=s=>{const t=D(s).toLocaleDateString('ca-ES',{weekday:'long',day:'numeric',month:'long'});return t.charAt(0).toUpperCase()+t.slice(1)+' · '+fTime(s)};
function hash(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return h>>>0}
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const M=id=>MATCHES.find(m=>m.id===id), Z=id=>ZONES.find(z=>z.id===id), P=id=>PLANS.find(p=>p.id===id), T=id=>TYPES.find(t=>t.id===id);
const zonePrice=(m,z)=>Math.round(z.price*(m.tier||1));
const typePrice=(m,z,t)=>Math.round(zonePrice(m,z)*t.f);
const code=()=>'JB-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
const title=m=>(m.team==='Primer equip'?'Joventut':m.team)+' vs '+m.rival;

/* ---------- Disponibilitat ---------- */
const SEASON={id:'season',tier:.85};
function takenSet(m,s){const k=m.id+'|'+s.id;if(TK[k])return TK[k];
  const set=new Set(),frac=Math.min(1,(.25+rng(hash(m.id+'/'+s.id))()*.6)*(m.tier||1));
  layout(s).forEach((n,ri)=>{for(let j=1;j<=n;j++)if(rng(hash(m.id+s.id+'r'+ri+'s'+j))()<frac)set.add((ri+1)+'-'+j)});
  db.orders.forEach(o=>{if(o.sector===s.id&&(o.kind==='season'||o.matchId===m.id))o.tickets.forEach(t=>{if(t.row)set.add(t.row+'-'+t.seat)})});
  return TK[k]=set}
const availS=(m,s)=>Math.max(0,s.cap-takenSet(m,s).size);
const availZ=(m,z)=>SECTORS.filter(s=>s.zone===z.id).reduce((a,s)=>a+availS(m,s),0);
function availGA(m){const base=Math.floor(m.gaCap*(.35+rng(hash(m.id))()*.3));
  const local=db.orders.reduce((a,o)=>a+o.tickets.filter(t=>t.matchId===m.id&&!t.row).length,0);return Math.max(0,m.gaCap-base-local)}
const availM=m=>m.seated?SECTORS.reduce((a,s)=>a+availS(m,s),0):availGA(m);
const capM=m=>m.seated?CAP:m.gaCap;

function qr(c){
  const n=25,r=rng(hash(c));let s='';
  const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#000"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#000"/>`;
  const inF=(x,y)=>(x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!inF(x,y)&&r()>.52)s+=`<rect x="${x}" y="${y}" width="1" height="1"/>`;
  return `<svg viewBox="-1 -1 ${n+2} ${n+2}" shape-rendering="crispEdges" aria-label="Codi QR de demostració"><rect x="-1" y="-1" width="${n+2}" height="${n+2}" fill="#fff"/>${s}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</svg>`;
}

/* =========================================================
   Plànol de sectors
   ========================================================= */
const CX=180,CY=218,RX=170,RY=206;
const pt=(r,a)=>{const t=a*Math.PI/180;return[CX+r*RX*Math.sin(t),CY-r*RY*Math.cos(t)]};
function arc(s){const g=s.ring==='inner'?1.2:.9,a0=s.a0+g,a1=s.a1-g,n=10,p=[];
  for(let i=0;i<=n;i++)p.push(pt(s.r1,a0+(a1-a0)*i/n));
  for(let i=n;i>=0;i--)p.push(pt(s.r0-.004,a0+(a1-a0)*i/n));
  return'M'+p.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L')+'Z'}
function mapSVG(sel,isOff){
  const secs=SECTORS.map(s=>{const z=Z(s.zone),off=isOff&&isOff(s),[lx,ly]=pt((s.r0+s.r1)/2,(s.a0+s.a1)/2);
    const fs=s.ring==='outer'?10:s.ring==='middle'?9.5:9;
    return `<path class="sec${off?' off':''}" d="${arc(s)}" fill="${off?'#151a19':z.color}" stroke="${sel===s.id?'#EBEDEC':'#000'}" stroke-width="${sel===s.id?3:1}" opacity="${sel&&sel!==s.id&&!off?.5:1}" ${off?'aria-disabled="true"':`tabindex="0" role="button" aria-label="Sector ${s.id}, ${z.name}" onclick="pickSector('${s.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();pickSector('${s.id}')}"`}><title>Sector ${s.id} · ${z.name}${off?' · no disponible':''}</title></path>
    <text class="lbl" x="${lx.toFixed(1)}" y="${(ly+3.3).toFixed(1)}" text-anchor="middle" font-size="${fs}" fill="${off?'#3a4441':z.txt}">${s.id}</text>`}).join('');
  return `<svg class="map" viewBox="0 0 360 462" role="img" aria-label="Plànol de sectors del Palau Olímpic de Badalona">
   <ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="#0a0e0d" stroke="#26302d" stroke-width="1.5"/>
   ${secs}
   <g pointer-events="none">
    <rect x="${CX-34}" y="${CY-64}" width="68" height="128" fill="#c9a173" stroke="#fff" stroke-width="1.2"/>
    <line x1="${CX-34}" y1="${CY}" x2="${CX+34}" y2="${CY}" stroke="#fff" stroke-width="1.2"/>
    <circle cx="${CX}" cy="${CY}" r="9" fill="none" stroke="#fff" stroke-width="1.2"/>
    <path d="M${CX-22} ${CY-64}a22 24 0 0 0 44 0M${CX-22} ${CY+64}a22 24 0 0 1 44 0" fill="none" stroke="#fff" stroke-width="1.2"/>
    <circle cx="${CX}" cy="${CY-56}" r="3" fill="none" stroke="#e05a3a" stroke-width="1.2"/>
    <circle cx="${CX}" cy="${CY+56}" r="3" fill="none" stroke="#e05a3a" stroke-width="1.2"/>
    <rect x="${CX-52}" y="${CY-52}" width="10" height="46" fill="#EBEDEC"/>
    <rect x="${CX-52}" y="${CY+6}" width="10" height="46" fill="#EBEDEC"/>
    <text x="${CX-45}" y="${CY-29}" transform="rotate(-90 ${CX-45} ${CY-29})" text-anchor="middle" font-family="Montserrat" font-size="6.5" font-weight="700" fill="#000">VISITANT</text>
    <text x="${CX-45}" y="${CY+29}" transform="rotate(-90 ${CX-45} ${CY+29})" text-anchor="middle" font-family="Montserrat" font-size="6.5" font-weight="700" fill="#000">LOCAL</text>
    <path d="M${CX} 430l-14 14h8v12h12v-12h8z" fill="#5fae96"/>
    <text x="${CX+26}" y="450" font-family="Montserrat" font-size="9" font-weight="700" fill="#9aa8a3">ENTRADA</text>
   </g></svg>`;
}

/* ---------- Selecció de sector i seients ---------- */
const curM=()=>S.view==='plan'?SEASON:M(S.view==='pack'?PACK.match:S.matchId);
const zoneAllowed=z=>S.view!=='pack'||PACK.zones.includes(z);
function maxSeats(){return S.view==='plan'?P(S.planId).persons:S.view==='pack'?1:8}
function pickSector(id){if(S.sector!==id){S.sector=id;S.seats=[];S.sl=null}render();
  if(innerWidth<980)setTimeout(()=>{const el=$('#seatcard');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},30)}
function pickZone(zid){const m=curM();
  const best=SECTORS.filter(s=>s.zone===zid).sort((a,b)=>availS(m,b)-availS(m,a))[0];if(best)pickSector(best.id)}
function toggleSeat(r,j){
  const i=S.seats.findIndex(x=>x.row===r&&x.seat===j);
  if(i>=0)S.seats.splice(i,1);
  else if(S.seats.length<maxSeats())S.seats.push({row:r,seat:j,type:'adult'});
  else if(maxSeats()===1)S.seats=[{row:r,seat:j,type:'adult'}];
  render();
}
function setType(i,t){S.seats[i].type=t;render()}
function sectorPicker(m,priceOf){
  const s=S.sector&&SEC(S.sector),z=s&&Z(s.zone);
  return `${mapSVG(S.sector,x=>!zoneAllowed(x.zone)||availS(m,x)===0)}
   <div class="hint">Toca un sector al plànol o tria una zona</div>
   ${s?`<div class="selinfo"><div class="num">${s.id}</div><div><small>Sector</small><b>${z.name}</b><div style="font-size:12px;opacity:.85">${availS(m,s)} seients lliures</div></div><span class="p">${priceOf(z)}</span></div>`:''}
   <div class="zlist">${ZONES.map(zz=>{const ok=zoneAllowed(zz.id),a=availZ(m,zz);return `<button class="zbtn ${z&&z.id===zz.id?'on':''}" ${ok&&a?'':'disabled'} onclick="pickZone('${zz.id}')">
     <div><b><span class="dot" style="background:${zz.color}"></span>${zz.name}</b><small>${!ok?'No inclòs al pack':a?`${a.toLocaleString('ca-ES')} disponibles · ${zz.desc}`:'Exhaurit'}</small></div><span class="p">${priceOf(zz)}</span></button>`}).join('')}</div>`;
}
function seatGrid(m,s){
  const tk=takenSet(m,s),sel=new Set(S.seats.map(x=>x.row+'-'+x.seat));
  return `<div class="court">▼ PISTA</div><div class="seats" id="seats">`+
   layout(s).map((n,ri)=>{const r=ri+1;let h=`<div class="srow"><span class="rn">${r}</span>`;
    for(let j=1;j<=n;j++){const k=r+'-'+j,t=tk.has(k),acc=isAcc(s,r,j);
     h+=`<button class="st${t?' tk':''}${acc?' acc':''}${sel.has(k)?' on':''}" ${t?'disabled':''} aria-label="Fila ${r}, seient ${j}${acc?', plaça adaptada':''}${t?', ocupat':''}" aria-pressed="${sel.has(k)}" onclick="toggleSeat(${r},${j})">${acc&&!t?'♿':j}</button>`}
    return h+`<span class="rn">${r}</span></div>`}).join('')+
  `</div><div class="legend"><span><i></i>Lliure</span><span><i style="background:var(--acc)"></i>Triat</span><span><i style="background:#1b211f;border-color:#1b211f"></i>Ocupat</span><span><i style="border-color:var(--blue)"></i>Adaptada</span></div>`;
}

/* =========================================================
   Navegació
   ========================================================= */
const ICONS={
 matches:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8"/></svg>',
 season:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
 mine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/></svg>',
 admin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'
};
const TABS=[['matches','Partits'],['season','Abonaments'],['mine','Les meves entrades'],['admin','Panell del club']];
const SHORT={matches:'Partits',season:'Abonaments',mine:'Les meves',admin:'Club'};
function go(tab,push=true){S={tab,view:tab};if(push)setHash(tab==='matches'?'':tab==='season'?'abonaments':tab==='mine'?'les-meves':'panell');render();topOfApp()}
function topOfApp(){const y=$('#sub').getBoundingClientRect().top+scrollY;if(scrollY>y)scrollTo({top:y,behavior:'smooth'})}
function setHash(h){try{history.replaceState(null,'',h?'#'+h:location.pathname+location.search)}catch(e){}}
function renderTabs(){const n=db.orders.length;
  $('#subin').innerHTML=TABS.map(([id,l])=>`<button class="${S.tab===id?'on':''}" aria-current="${S.tab===id?'page':'false'}" onclick="go('${id}')"><span>${l}</span>${id==='mine'&&n?`<span class="badge">${n}</span>`:''}</button>`).join('')}

/* =========================================================
   Vistes
   ========================================================= */
function minPrice(m){return m.seated?Math.min(...ZONES.map(z=>typePrice(m,z,TYPES[2]))):m.ga.adult}
function vMatches(){
  return `<div class="sec-title"><h2>Pròxims partits a casa</h2><span>Primer equip, femení i U22</span></div>
  <div class="list">${MATCHES.map(m=>{const a=availM(m);
   return `<button class="mrow" onclick="openMatch('${m.id}')">
    <div class="d"><b>${fDay(m.date)}</b><i>${fWk(m.date)}</i></div>
    <div class="who"><small>${esc(m.team)} · ${esc(m.comp)}</small><b>${esc(title(m))}</b>
      <em>${m.seated?'Seient numerat · tria sector i seient':'Accés general a la grada baixa'}${a/capM(m)<.2?' · <span style="color:var(--acc)">últimes entrades</span>':''}</em></div>
    <div class="pr">des de<b>${m.seated?eur(minPrice(m)):eur(m.ga.adult)}</b></div>
    <span class="btn">Entrades</span></button>`}).join('')}</div>
  <div class="pack">
   <div class="txt"><span class="kicker" style="color:#EBEDEC;opacity:.85">Cap de setmana a l'Olímpic</span>
    <h3>3 partits,<br>un sol preu</h3>
    <p style="opacity:.9">Seient lateral per al Joventut vs Surne Bilbao i entrada per al femení i l'U22.</p>
    <ul><li>✓ Divendres 30 · U22 vs UCAM Murcia Juver</li><li>✓ Dissabte 31 · Femení vs Recoletas Zamora</li><li>✓ Diumenge 1 · Joventut vs Surne Bilbao</li></ul>
    <button class="btn acc" onclick="openPack()">Pack cap de setmana · ${eur(PACK.price)}</button></div>
   <img src="assets/grada.jpg" alt="L'afició de la Penya a la grada de l'Olímpic" loading="lazy">
  </div>`;
}
function openMatch(id,push=true){S={tab:'matches',view:'match',matchId:id,sector:null,seats:[],qty:{adult:0,jove:0,infantil:0}};if(push)setHash('partit-'+id);render();topOfApp()}
function vMatch(){
  const m=M(S.matchId);
  const head=`<button class="back" onclick="go('matches')">← Tots els partits</button>
   <div class="hero"><span class="kicker">${esc(m.team)} · ${esc(m.comp)}</span><h2>${esc(title(m))}</h2><div class="meta">${fLong(m.date)} · Palau Olímpic de Badalona</div></div>`;
  if(!m.seated){
   return head+`<div class="cols"><div class="card"><h3>Quantes entrades?</h3>
    ${TYPES.map(t=>{const q=S.qty[t.id];return `<div class="row"><div><b>${t.name}</b><div class="muted">${eur(m.ga[t.id])}</div></div>
     <div class="step"><button aria-label="Treure ${t.name}" ${q?'':'disabled'} onclick="chg('${t.id}',-1)">−</button><span>${q}</span><button aria-label="Afegir ${t.name}" ${count()>=8?'disabled':''} onclick="chg('${t.id}',1)">+</button></div></div>`}).join('')}
    <p class="muted" style="margin-top:10px">Accés general a la grada baixa, sense seient numerat. Màxim 8 per compra.</p></div>
    <div class="card side"><h3>Grada oberta</h3><p class="muted">Per als partits del femení i de l'U22 s'obre la grada baixa de l'Olímpic. Els socis CJB hi entren amb el seu carnet.</p>
    <p style="margin-top:12px"><b>${availGA(m).toLocaleString('ca-ES')}</b> <span class="muted">entrades disponibles</span></p></div></div>`;
  }
  const s=S.sector&&SEC(S.sector);
  return head+`<div class="cols">
   <div class="card"><h3>1 · Tria el sector</h3>${sectorPicker(m,z=>eur(zonePrice(m,z)))}</div>
   <div class="side">
    <div class="card" id="seatcard">${s?`<h3>2 · Tria els seients <small>Sector ${s.id} · ${Z(s.zone).name}</small></h3>${seatGrid(m,s)}`:`<h3>2 · Tria els seients</h3><p class="muted">Primer tria un sector al plànol.</p>`}</div>
    ${s?`<div class="card"><h3>3 · Seients triats (${S.seats.length})</h3>
     ${S.seats.length?S.seats.map((x,i)=>`<div class="row"><div><b>Fila ${x.row} · Seient ${x.seat}</b>${isAcc(s,x.row,x.seat)?'<div class="muted">Plaça adaptada</div>':''}</div>
      <div style="display:flex;gap:8px;align-items:center"><select class="mini" aria-label="Tarifa del seient" onchange="setType(${i},this.value)">${TYPES.map(t=>`<option value="${t.id}" ${x.type===t.id?'selected':''}>${t.name}</option>`).join('')}</select>
      <b class="bb" style="font-size:22px;min-width:44px;text-align:right">${eur(typePrice(m,Z(s.zone),T(x.type)))}</b><button class="x" aria-label="Treure el seient" onclick="toggleSeat(${x.row},${x.seat})">✕</button></div></div>`).join('')
     :`<p class="muted">Toca els seients lliures. Màxim 8 per compra.</p>`}
     ${S.seats.length?`<p class="muted" style="margin-top:8px">Cal acreditar l'edat de les tarifes reduïdes a l'accés.</p>`:''}</div>`:''}
   </div></div>`;
}
const count=()=>S.view==='match'&&!M(S.matchId).seated?Object.values(S.qty).reduce((a,b)=>a+b,0):(S.seats||[]).length;
function chg(t,d){S.qty[t]=Math.max(0,S.qty[t]+d);render()}
function matchTotal(){const m=M(S.matchId);
  if(!m.seated)return TYPES.reduce((a,t)=>a+S.qty[t.id]*m.ga[t.id],0);
  const z=Z(SEC(S.sector).zone);return S.seats.reduce((a,x)=>a+typePrice(m,z,T(x.type)),0)}

function openPack(push=true){S={tab:'matches',view:'pack',sector:null,seats:[]};if(push)setHash('pack');render();topOfApp()}
function vPack(){
  const m=M(PACK.match),s=S.sector&&SEC(S.sector);
  return `<button class="back" onclick="go('matches')">← Tots els partits</button>
  <div class="hero"><span class="kicker">Cap de setmana a l'Olímpic</span><h2>Pack cap de setmana</h2><div class="meta">U22 · Femení · Primer equip — ${eur(PACK.price)} per persona</div></div>
  <div class="cols"><div class="card"><h3>Tria el teu seient per al Bilbao</h3>${sectorPicker(m,z=>zoneAllowed(z.id)?'Inclòs':'—')}</div>
  <div class="side"><div class="card" id="seatcard">${s?`<h3>Seient <small>Sector ${s.id} · ${Z(s.zone).name}</small></h3>${seatGrid(m,s)}`:`<h3>Seient</h3><p class="muted">El pack inclou seient al lateral baix o al lateral alt. Tria un sector.</p>`}</div>
   <div class="card"><h3>Inclou</h3>${[PACK.match,...PACK.extra].map(id=>{const mm=M(id);return `<div class="row"><div><b>${esc(title(mm))}</b><div class="muted">${fLong(mm.date)}</div></div><span class="muted">${mm.seated?(S.seats[0]?`Fila ${S.seats[0].row} · ${S.seats[0].seat}`:'Seient numerat'):'Accés general'}</span></div>`}).join('')}</div></div></div>`;
}

function vSeason(){
  return `<div class="sec-title"><h2>Fes-te de la Penya</h2><span>Temporada 2026/27</span></div>
  <div class="plans">${PLANS.map(p=>`<button class="plan${p.feat?' feat':''}" onclick="openPlan('${p.id}')">
    <span class="kicker" style="${p.feat?'color:#EBEDEC;opacity:.85':''}">${p.feat?'El més triat':p.noSeat?'Nou':'Temporada'}</span>
    <h3>${p.name}</h3><div style="font-size:13px;opacity:.85">${p.desc}</div>
    <ul class="perks">${p.perks.map(x=>`<li>✓ ${x}</li>`).join('')}</ul>
    <div class="from">${p.noSeat?'':'<span>des de</span>'}<b>${eur(p.flat||Math.round(ZONES[4].season*p.f))}</b><span>${p.noSeat?'/ any':'/ temporada'}</span></div></button>`).join('')}</div>`;
}
function openPlan(id,push=true){S={tab:'season',view:'plan',planId:id,sector:null,seats:[]};if(push)setHash('abonament-'+id);
  if(P(id).noSeat)return startCheckout();render();topOfApp()}
function vPlan(){
  const p=P(S.planId),s=S.sector&&SEC(S.sector);
  return `<button class="back" onclick="go('season')">← Abonaments</button>
  <div class="hero"><span class="kicker">Temporada 2026/27</span><h2>${p.name}</h2><div class="meta">${p.desc}</div></div>
  <div class="cols"><div class="card"><h3>1 · Tria el sector</h3>${sectorPicker(SEASON,z=>eur(Math.round(z.season*p.f)))}</div>
  <div class="side"><div class="card" id="seatcard">${s?`<h3>2 · Tria ${p.persons>1?`${p.persons} seients`:'el teu seient'} <small>Sector ${s.id}</small></h3>${seatGrid(SEASON,s)}
   <p class="muted" style="margin-top:12px">${S.seats.length?S.seats.map(x=>`Fila ${x.row} · Seient ${x.seat}`).join(' · '):'Serà el teu seient fix tota la temporada.'}</p>`:`<h3>2 · Tria el seient</h3><p class="muted">Primer tria un sector al plànol.</p>`}</div></div></div>`;
}
const planTotal=()=>{const p=P(S.planId);return p.flat||Math.round(Z(SEC(S.sector).zone).season*p.f)};

/* =========================================================
   Compra · checkout simulat
   Dades → Pagament (passarel·la de prova) → Verificació del banc → Entrades
   Cap camp accepta dades de pagament reals: la targeta és de prova i no editable.
   ========================================================= */
const HOLD_MIN=10;
let holdTimer=null;
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const hasSeats=c=>!!(c.seats&&c.seats.length);
function startCheckout(){
  let c;
  if(S.view==='match'){const m=M(S.matchId);
    c=m.seated?{kind:'match',matchId:m.id,sector:S.sector,zone:SEC(S.sector).zone,seats:S.seats.map(x=>({...x})),total:matchTotal()}
             :{kind:'match',matchId:m.id,qty:{...S.qty},total:matchTotal()};}
  else if(S.view==='pack')c={kind:'pack',matchId:PACK.match,sector:S.sector,zone:SEC(S.sector).zone,seats:S.seats.map(x=>({...x})),total:PACK.price};
  else{const p=P(S.planId);c=p.noSeat?{kind:'season',planId:p.id,seats:[],total:p.flat}
    :{kind:'season',planId:p.id,sector:S.sector,zone:SEC(S.sector).zone,seats:S.seats.map(x=>({...x})),total:planTotal()}}
  S={tab:S.tab,view:'checkout',step:'dades',cart:c,prev:{...S},form:{name:'',email:'',terms:false},method:'card',err:'',overlay:null,holdUntil:Date.now()+HOLD_MIN*60000};
  render();topOfApp();startHold();
}
function startHold(){clearInterval(holdTimer);holdTimer=setInterval(()=>{
  if(S.view!=='checkout'){clearInterval(holdTimer);return}
  const left=S.holdUntil-Date.now();
  if(left<=0&&!S.overlay){clearInterval(holdTimer);S.step='expired';render();return}
  const el=$('#hold');if(el)el.textContent=mmss(left);
},1000)}
function leaveCheckout(){clearInterval(holdTimer);S=S.prev;render();topOfApp()}
function stepper(n){return `<ol class="steps" aria-label="Passos de la compra">${['Dades','Pagament','Entrades'].map((l,i)=>`<li class="${i<n?'done':i===n?'on':''}" ${i===n?'aria-current="step"':''}><span>${i<n?'✓':i+1}</span>${l}</li>`).join('')}</ol>`}
function summary(c){
  if(c.kind==='pack')return `<b>Pack cap de setmana</b><div class="muted">3 partits · Seient per al Bilbao: sector ${c.sector}, fila ${c.seats[0].row}, seient ${c.seats[0].seat}</div><div class="row"><span>1 × Pack adult</span><span>${eur(PACK.price)}</span></div>`;
  if(c.kind==='match'){const m=M(c.matchId);
   const lines=m.seated?c.seats.map(x=>{const t=T(x.type);return `<div class="row"><span>Fila ${x.row} · Seient ${x.seat} <span class="muted">· ${t.name}</span></span><span>${eur(typePrice(m,Z(c.zone),t))}</span></div>`}).join('')
     :TYPES.filter(t=>c.qty[t.id]).map(t=>`<div class="row"><span>${c.qty[t.id]} × ${t.name}</span><span>${eur(c.qty[t.id]*m.ga[t.id])}</span></div>`).join('');
   return `<b>${esc(title(m))}</b><div class="muted">${fLong(m.date)}${m.seated?`<br>Sector ${c.sector} · ${Z(c.zone).name}`:'<br>Accés general'}</div>`+lines;}
  const p=P(c.planId);
  return `<b>${p.name}</b><div class="muted">Temporada 2026/27${c.sector?` · Sector ${c.sector} · ${Z(c.zone).name}<br>${c.seats.map(x=>`Fila ${x.row} · Seient ${x.seat}`).join(' · ')}`:' · sense seient fix'}</div>`;
}
const totals=c=>`<div class="row"><span>Subtotal</span><span>${eur(c.total)}</span></div><div class="row"><span>Despeses de gestió</span><span>0 €</span></div><div class="row" style="border:0"><b>Total</b><b class="bb" style="font-size:34px">${c.total?eur(c.total):'0 €'}</b></div>`;
function sidebar(c){return `<div class="card side"><h3>Resum</h3>${summary(c)}<div style="margin-top:10px">${totals(c)}</div>
  ${S.step!=='expired'?`<div class="hold"><span>${hasSeats(c)?'Seients reservats per a tu':'Comanda reservada'}</span><b id="hold" aria-live="off">${mmss(S.holdUntil-Date.now())}</b></div>`:''}</div>`}
function vCheckout(){
  const c=S.cart,f=S.form,err=S.err?`<div class="err" role="alert">${S.err}</div>`:'';
  if(S.step==='expired')return `<div class="hero"><span class="kicker">Finalitza la compra</span><h2>S'ha acabat el temps</h2></div>${stepper(0)}
   <div class="card"><p>Han passat ${HOLD_MIN} minuts i hem alliberat ${hasSeats(c)?'els seients':'la reserva'} perquè altres penyistes els puguin comprar. No s'ha fet cap càrrec.</p>
   <button class="btn" style="margin-top:18px" onclick="S=S.prev;if(S.seats)S.seats=[];render();topOfApp()">Torna a triar</button></div>`;
  if(S.step==='dades')return `<button class="back" onclick="leaveCheckout()">← Enrere</button>
   <div class="hero"><span class="kicker">Finalitza la compra</span><h2>Les teves dades</h2></div>${stepper(0)}
   <div class="cols"><div class="card"><h3>Qui ve a l'Olímpic?</h3>
    <label for="n">Nom i cognoms${c.kind==='season'?' del titular':''}</label><input class="field" id="n" value="${esc(f.name)}" oninput="S.form.name=this.value" autocomplete="name">
    <label for="e">Correu electrònic</label><input class="field" id="e" type="email" inputmode="email" value="${esc(f.email)}" oninput="S.form.email=this.value" autocomplete="email">
    <p class="muted" style="margin-top:6px">Hi enviarem ${c.kind==='season'?'el carnet':'les entrades'} i el rebut.</p>
    <label class="check"><input type="checkbox" id="t" ${f.terms?'checked':''} onchange="S.form.terms=this.checked"> Accepto les condicions de compra i la política de privacitat.</label>
    ${err}
    <button class="btn full" style="margin-top:18px" onclick="toPay()">${c.total?'Continuar al pagament':'Confirmar entrades gratuïtes'}</button></div>
   ${sidebar(c)}</div>`;
  // pas de pagament
  const methods=[['card','Targeta'],['bizum','Bizum'],['apple','Apple Pay'],['google','Google Pay']];
  return `<button class="back" onclick="S.step='dades';S.err='';render()">← Les teves dades</button>
  <div class="hero"><span class="kicker">Finalitza la compra</span><h2>Pagament</h2></div>${stepper(1)}
  <div class="cols"><div>
   <div class="gw">
    <div class="gw-h"><span>🔒 Pagament segur</span><span class="gw-sim">Simulació</span></div>
    <div class="gw-m" role="radiogroup" aria-label="Mètode de pagament">${methods.map(([id,l])=>`<button role="radio" aria-checked="${S.method===id}" class="${S.method===id?'on':''}" onclick="S.method='${id}';S.err='';render()">${l}</button>`).join('')}</div>
    <div class="gw-b">${gwBody(c)}</div>
    <div class="gw-f"><span>Comerç: Club Joventut Badalona</span><span>Import <b>${eur(c.total)}</b></span></div>
   </div>
   ${err}
   <p class="muted" style="margin-top:12px">Passarel·la de demostració: no es cobra res i no es demanen dades de pagament reals.</p>
  </div>${sidebar(c)}</div>${S.overlay?overlayHTML(c):''}`;
}
function gwBody(c){
  const amt=eur(c.total);
  if(S.method==='card')return `<span class="gw-test">Targeta de prova</span>
    <label>Número de targeta</label><div class="gw-in">4242 4242 4242 4242<span>VISA</span></div>
    <div class="gw-2"><div><label>Caducitat</label><div class="gw-in">12 / 28</div></div><div><label>CVC</label><div class="gw-in">•••</div></div></div>
    <button class="gw-pay" onclick="startPay()">Pagar ${amt}</button>`;
  if(S.method==='bizum')return `<p class="gw-p">T'enviarem una sol·licitud de pagament a l'app del teu banc. L'hauràs d'acceptar des del mòbil.</p>
    <button class="gw-pay" onclick="startPay()">Pagar ${amt} amb Bizum</button>`;
  const n=S.method==='apple'?'Apple Pay':'Google Pay';
  return `<p class="gw-p">S'obrirà la finestra de pagament del teu dispositiu amb la targeta que hi tinguis desada.</p>
    <button class="gw-pay dark" onclick="startPay()">Pagar amb ${n}</button>`;
}
function overlayHTML(c){
  const amt=eur(c.total),wallet=S.method==='apple'||S.method==='google',wn=S.method==='apple'?'Apple Pay':'Google Pay';
  let box='';
  if(S.overlay==='connect')box=`<div class="ov-spin"></div><h4>Connectant amb ${S.method==='bizum'?'Bizum':wallet?wn:'el teu banc'}…</h4><p>No tanquis aquesta finestra.</p>`;
  if(S.overlay==='verify')box=wallet
   ?`<span class="bank">${wn} · simulació</span><h4>Club Joventut Badalona</h4><div class="ov-amt">${amt}</div><p>Targeta desada acabada en 4242</p>
     <div class="ov-btns"><button class="ov-ok dark" data-autofocus onclick="confirmPay()">Confirmar amb ${S.method==='apple'?'Face ID':'empremta'}</button><button class="ov-no" onclick="cancelPay()">Cancel·lar</button></div>`
   :`<span class="bank">${S.method==='bizum'?'Bizum':'Banc de prova · 3D Secure'} · simulació</span><h4>${S.method==='bizum'?'Accepta la sol·licitud':'Verifica el pagament'}</h4>
     <p>${S.method==='bizum'?'Club Joventut Badalona et demana':'Pagament a Club Joventut Badalona amb la targeta ···· 4242 per'}</p><div class="ov-amt">${amt}</div>
     <p style="font-size:12px">En un pagament real ho confirmaries a l'app del teu banc.</p>
     <div class="ov-btns"><button class="ov-ok" data-autofocus onclick="confirmPay()">Confirmar</button><button class="ov-no" onclick="cancelPay()">Cancel·lar</button></div>`;
  if(S.overlay==='ok')box=`<div class="ov-tick">✓</div><h4>Pagament acceptat</h4><p>Generant ${c.kind==='season'?'el carnet':'les entrades'}…</p>`;
  return `<div class="ov" role="dialog" aria-modal="true" aria-label="Pagament"><div class="ov-box">${box}</div></div>`;
}
function toPay(){
  const f=S.form;S.err='';
  if(!f.name.trim()){S.err='Escriu el nom i cognoms.';render();$('#n').focus();return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())){S.err='El correu no sembla vàlid.';render();$('#e').focus();return}
  if(!f.terms){S.err='Cal acceptar les condicions de compra.';render();$('#t').focus();return}
  if(!S.cart.total)return finalize('free');
  S.step='pagament';render();topOfApp();
}
function startPay(){S.err='';S.overlay='connect';render();setTimeout(()=>{if(S.overlay==='connect'){S.overlay='verify';render()}},1300)}
function cancelPay(){S.overlay=null;S.err='Has cancel·lat el pagament. No s\'ha fet cap càrrec.';render()}
function confirmPay(){S.overlay='ok';render();setTimeout(()=>finalize(S.method),1100)}
addEventListener('keydown',e=>{if(e.key==='Escape'&&S.view==='checkout'&&S.overlay==='verify')cancelPay()});
const METHOD={card:'Targeta ···· 4242',bizum:'Bizum',apple:'Apple Pay',google:'Google Pay',free:'Sense cost'};
function finalize(method){
  clearInterval(holdTimer);
  const c=S.cart,f=S.form;let tickets=[];
  if(c.kind==='match'){const m=M(c.matchId);
    if(m.seated)tickets=c.seats.map(x=>({code:code(),label:T(x.type).name,matchId:m.id,row:x.row,seat:x.seat}));
    else TYPES.forEach(t=>{for(let i=0;i<c.qty[t.id];i++)tickets.push({code:code(),label:t.name,matchId:m.id})});}
  else if(c.kind==='pack'){tickets=[{code:code(),label:'Pack · Adult',matchId:PACK.match,row:c.seats[0].row,seat:c.seats[0].seat},
    ...PACK.extra.map(id=>({code:code(),label:'Pack · Adult',matchId:id}))];}
  else{const p=P(c.planId);
    const labels=p.id==='familiar'?['Adult','Adult','Infantil','Infantil']:[p.id==='jove'?'Jove':p.id==='infantil'?'Infantil':'Adult'];
    tickets=p.noSeat?[{code:code(),label:'Aficionat'}]:c.seats.map((x,i)=>({code:code(),label:labels[i],row:x.row,seat:x.seat}));}
  const o={id:'CJB-'+Date.now().toString(36).toUpperCase().slice(-6),...c,name:f.name.trim(),email:f.email.trim(),at:new Date().toISOString(),method,tickets};
  db.orders.unshift(o);save();
  S={tab:'mine',view:'done',orderId:o.id};setHash('les-meves');render();topOfApp();
}
function toast(t){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2800)}
function ticketsHTML(o){
  return `<div class="tickets">`+o.tickets.map(t=>{
    const m=t.matchId&&M(t.matchId);
    const head=m?title(m):P(o.planId).name, sub=m?fLong(m.date):'Temporada 2026/27';
    const kind=m?(o.kind==='pack'?'Entrada · Pack cap de setmana':'Entrada'):(P(o.planId).noSeat?'Carnet d\'aficionat':'Carnet de soci');
    const where=t.row?`<div class="seat"><div>Sector<b>${o.sector}</b></div><div>Fila<b>${t.row}</b></div><div>Seient<b>${t.seat}</b></div></div>`
      :`<div class="seat"><div>Accés<b>${m?'General':'5 partits'}</b></div></div>`;
    return `<div class="ticket"><div class="top"><div><small>${kind} · ${t.label}</small><h4>${esc(head)}</h4><div style="font-size:12px">${sub}</div></div><img src="assets/escut.png" alt=""></div>
     <div class="body">${qr(t.code)}<div><div style="font-size:10px;color:#5d6663;text-transform:uppercase;letter-spacing:.06em">Titular</div><b>${esc(o.name)}</b>${where}<div class="code">${t.code}</div></div></div></div>`}).join('')+`</div>`;
}
function walletActs(){return `<div class="acts">
  <button class="btn" onclick="toast('Concepte: aquí s\\'afegirien les entrades a Apple Wallet.')">Afegir a Apple Wallet</button>
  <button class="btn" onclick="toast('Concepte: aquí s\\'afegirien les entrades a Google Wallet.')">Afegir a Google Wallet</button>
  <button class="btn ghost" onclick="toast('Concepte: aquí es descarregaria el PDF de les entrades.')">Descarregar PDF</button></div>`}
function vDone(){
  const o=db.orders.find(x=>x.id===S.orderId);
  if(!o){setTimeout(()=>go('mine'));return ''}
  const d=new Date(o.at);
  return `${stepper(3)}<div class="ok" aria-hidden="true">✓</div><div class="center"><span class="kicker">Compra confirmada</span><h2 style="font-size:clamp(48px,7vw,80px)">Ens veiem a l'Olímpic!</h2>
   <p class="muted" style="margin-top:10px">Hem enviat ${o.kind==='season'?'el carnet':'les entrades'} i el rebut a <b style="color:var(--ink)">${esc(o.email)}</b> <span>(simulat)</span>.</p></div>
   <div class="receipt"><div><small>Comanda</small><b>${o.id}</b></div><div><small>Data</small><b>${d.toLocaleDateString('ca-ES')} · ${d.toLocaleTimeString('ca-ES',{hour:'2-digit',minute:'2-digit'})}</b></div>
    <div><small>Pagament</small><b>${METHOD[o.method]||'Targeta'}</b></div><div><small>Total</small><b>${o.total?eur(o.total):'0 €'}</b></div></div>
   ${walletActs()}
   ${ticketsHTML(o)}
   <div class="center" style="margin-top:28px"><button class="btn ghost" onclick="go('matches')">Tornar als partits</button></div>`;
}
function orderTitle(o){if(o.kind==='pack')return 'Pack cap de setmana';if(o.kind==='match')return title(M(o.matchId));return P(o.planId).name}
function vMine(){
  if(!db.orders.length)return `<div class="sec-title"><h2>Les meves entrades</h2></div><div class="empty">Encara no tens cap entrada ni abonament.<br><br><button class="btn" onclick="go('matches')">Veure partits</button></div>`;
  return `<div class="sec-title"><h2>Les meves entrades</h2><span>${db.orders.length} comandes · guardades en aquest navegador</span></div>`+
   db.orders.map(o=>`<div class="card"><button style="width:100%;text-align:left" aria-expanded="${S.open===o.id}" onclick="S.open=S.open==='${o.id}'?null:'${o.id}';render()">
    <div class="row" style="border:0;padding:0"><div><b class="bb" style="font-size:28px">${esc(orderTitle(o))}</b>
    <div class="muted">${o.tickets.length} ${o.kind==='season'?(o.tickets.length>1?'carnets':'carnet'):'entrades'}${o.sector?` · Sector ${o.sector}`:''} · ${eur(o.total)}</div></div><span>${S.open===o.id?'▲':'▼'}</span></div></button>
    ${S.open===o.id?`<div style="margin-top:16px">${ticketsHTML(o)}</div>`:''}</div>`).join('');
}
function vAdmin(){
  const rev=db.orders.reduce((a,o)=>a+o.total,0);
  const ent=db.orders.filter(o=>o.kind!=='season').reduce((a,o)=>a+o.tickets.length,0);
  const ab=db.orders.filter(o=>o.kind==='season').reduce((a,o)=>a+o.tickets.length,0);
  return `<div class="sec-title"><h2>Panell del club</h2><span>Vista interna d'exemple · vendes d'aquesta demo</span></div>
  <div class="kpis"><div class="kpi"><b>${eur(rev)}</b><span>Ingressos</span></div><div class="kpi"><b>${db.orders.length}</b><span>Comandes</span></div>
   <div class="kpi"><b>${ent}</b><span>Entrades venudes</span></div><div class="kpi"><b>${ab}</b><span>Socis nous</span></div></div>
  <div class="card"><h3>Ocupació per partit</h3>
   ${MATCHES.map(m=>{const cap=capM(m),pc=Math.round((cap-availM(m))/cap*100);
    return `<div style="margin:14px 0"><div class="row" style="border:0;padding:0"><span><b>${esc(title(m))}</b> <span class="muted">· ${fDay(m.date)}</span></span><span class="muted">${pc}% · ${(cap-availM(m)).toLocaleString('ca-ES')} / ${cap.toLocaleString('ca-ES')}</span></div><div class="occ"><i style="width:${pc}%"></i></div></div>`}).join('')}
   <p class="muted">Inclou una venda base simulada. ${SECTORS.length} sectors · ${CAP.toLocaleString('ca-ES')} seients numerats.</p></div>
  <button class="btn ghost" onclick="if(confirm('Esborrar totes les comandes de la demo?')){db={orders:[]};save();render()}">Reiniciar dades de la demo</button>`;
}

/* =========================================================
   Render
   ========================================================= */
function render(){
  const v={matches:vMatches,match:vMatch,pack:vPack,season:vSeason,plan:vPlan,checkout:vCheckout,done:vDone,mine:vMine,admin:vAdmin}[S.view];
  const old=$('#seats');if(old)S.sl=old.scrollLeft;
  const key=S.view+'|'+(S.step||'')+'|'+(S.matchId||S.planId||'');
  $('#app').classList.toggle('anim',key!==render.last);render.last=key;
  $('#app').innerHTML=v();
  const af=$('[data-autofocus]');if(af)af.focus();
  const g=$('#seats');if(g)g.scrollLeft=S.sl!=null?S.sl:(g.scrollWidth-g.clientWidth)/2;
  let bar='';
  if(S.view==='match'){const m=M(S.matchId);
    if(!m.seated||S.sector)bar=`<div class="tot">${count()} ${count()===1?'entrada':'entrades'}${m.seated?` · sector ${S.sector}`:''}<b>${eur(matchTotal())}</b></div><button class="btn" ${count()?'':'disabled'} onclick="startCheckout()">Continuar</button>`;}
  if(S.view==='pack'&&S.sector)bar=`<div class="tot">${S.seats[0]?`Sector ${S.sector} · Fila ${S.seats[0].row} · Seient ${S.seats[0].seat}`:'Tria el teu seient'}<b>${eur(PACK.price)}</b></div><button class="btn" ${S.seats.length?'':'disabled'} onclick="startCheckout()">Continuar</button>`;
  if(S.view==='plan'&&S.sector){const need=P(S.planId).persons,ok=S.seats.length===need;
    bar=`<div class="tot">${ok?`Sector ${S.sector} · ${Z(SEC(S.sector).zone).name}`:`Tria ${need-S.seats.length} seient${need-S.seats.length>1?'s':''} més`}<b>${eur(planTotal())}</b></div><button class="btn" ${ok?'':'disabled'} onclick="startCheckout()">Continuar</button>`}
  $('#bar').innerHTML=bar?`<div class="in"><div class="wrap">${bar}</div></div>`:'';
  document.body.style.paddingBottom=bar?'96px':'';
  placeBar();
  renderTabs();
}
/* Enllaços directes des de la home: #partit-<id>, #pack, #abonaments, #abonament-<id>, #les-meves */
function route(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(h.startsWith('partit-')&&M(h.slice(7)))return openMatch(h.slice(7),false);
  if(h==='pack')return openPack(false);
  if(h.startsWith('abonament-')&&P(h.slice(10))){openPlan(h.slice(10),false);return}
  if(h==='abonaments')return go('season',false);
  if(h==='les-meves')return go('mine',false);
  if(h==='panell')return go('admin',false);
  S={tab:'matches',view:'matches'};render();
}
// Si hi ha barra del total, el bàner de cookies s'aixeca per sobre i no la tapa
function placeBar(){const ck=$('#ck'),b=$('#bar .in');if(ck)ck.style.bottom=b?(b.offsetHeight+16)+'px':''}
addEventListener('resize',placeBar);
addEventListener('load',placeBar);
addEventListener('hashchange',route);
route();
