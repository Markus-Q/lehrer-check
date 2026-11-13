/* ============================================================
   KONFIGURATION
   Optional: Firebase-Config hier fest eintragen, z. B.
   const FIREBASE_CONFIG = { apiKey:"…", authDomain:"…", projectId:"…", appId:"…" };
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCG91gVFcNerMhDUbiCyQh8VBxN1tnljnA",
  authDomain: "lehererschrck.firebaseapp.com",
  projectId: "lehererschrck",
  storageBucket: "lehererschrck.firebasestorage.app",
  messagingSenderId: "355339313897",
  appId: "1:355339313897:web:5f02ddd2546f7d65bb8678"
};
const FB_VERSION = '10.12.2';
const LESSON_W = 0.10;   // Anteil der Stunden-Punkte an der Gesamtnote (10 %)
const MIN_N = 3;         // Mindestanzahl Bewertungen (bzw. Schüler bei Stunden), bevor Ergebnisse gezeigt werden
// Farben als CSS-Variablen, damit sie im Dunkelmodus mitwechseln
const INK = 'var(--ink)', RED = 'var(--red)', GRAPH = 'var(--gr)';

/* ---------- Kriterien (Reihenfolge = Reihenfolge im Radar) ---------- */
const CRIT = [
  {key:'f', no:1, name:'Freundlichkeit',          short:'Freundlich',  hint:'Wie nett und respektvoll ist er/sie zu euch?'},
  {key:'h', no:2, name:'Hilfsbereitschaft',       short:'Hilfsbereit', hint:'Wie geht er/sie mit Fragen und Problemen um, auch mit „dummen“?'},
  {key:'b', no:3, name:'Beibringungskraft',       short:'Erklärt',     hint:'Wie gut versteht man den Stoff nach dem Unterricht?'},
  {key:'u', no:4, name:'Unterrichtsgestaltung',   short:'Gestaltung',  hint:'Ist der Unterricht abwechslungsreich und interessant?'},
  {key:'a', no:5, name:'Anpassung an die Klasse', short:'Anpassung',   hint:'Geht er/sie auf Tempo und Niveau der Klasse ein?'},
  {key:'p', no:6, name:'Prüfungen & Benotung',    short:'Prüfungen',   hint:'Passen die Tests zum Stoff und sind die Noten nachvollziehbar?'},
  {key:'g', no:7, name:'Gerechtigkeit',           short:'Fairness',    hint:'Fair bei Strafen und im Umgang mit allen?'}
];
const LABELS = ['','Katastrophal','Schwach','Okay','Gut','Mega'];
const TAGS = [
  {id:'humor',label:'humorvoll'},{id:'streng',label:'streng'},{id:'chaos',label:'chaotisch'},
  {id:'anschaulich',label:'erklärt anschaulich'},{id:'hausi',label:'viele Hausaufgaben'},{id:'locker',label:'lockerer Unterricht'},
  {id:'schlaf',label:'einschläfernd'},{id:'puenktlich',label:'pünktlich'},{id:'zeit',label:'nimmt sich Zeit'},
  {id:'fordernd',label:'fordernd'},{id:'buch',label:'nur Buch & Folien'},{id:'laut',label:'laut'}
];
const TAG_MAX = 4;
const SUGGEST = ['Mathe','Deutsch','Englisch','Physik','Chemie','Biologie','Geschichte','Geographie','Sport','Kunst','Musik','Informatik','Religion','Ethik','Französisch','Latein','Spanisch','Sozialkunde','Wirtschaft'];
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Handgezeichnete Formen ---------- */
const CROWN = '<svg class="crown" viewBox="0 0 22 14" aria-hidden="true"><path d="M1.5 12.5 3 3.2 8 8 11 1.5 14 8 19 3.2 20.5 12.5Z"/></svg>';
const RING  = '<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d="M52 5C78 3 96 24 95 51 94 77 74 96 47 95 21 94 4 75 6 48 8 22 29 7 57 9 64 10 69 12 73 16"/></svg>';
const UL    = '<svg class="ul" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 9C40 3 80 12 120 7 170 2 220 11 298 5"/></svg>';

/* ---------- Helfer ---------- */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mean = a=>a.length? a.reduce((x,y)=>x+y,0)/a.length : null;
const stdev = a=>{ if(a.length<2) return 0; const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)**2))); };
const fmt = (n,d=1)=> (n==null||isNaN(n)) ? '–' : Number(n).toFixed(d).replace('.',',');
const fmtPts = (v,d=0)=>{
  if(v==null||isNaN(v)) return '–';
  const r = d ? Number(v.toFixed(d)) : Math.round(v);
  const s = Math.abs(r).toFixed(d).replace('.',',');
  return r>0 ? '+'+s : r<0 ? '−'+s : '0';
};
const clamp = (n,a,b)=>Math.min(b,Math.max(a,n));
const critVals = r=>CRIT.map(c=>Number(r[c.key])).filter(v=>v>0);
const ovr = r=>mean(critVals(r))??0;
const ts = r=>r.updatedAt||r.createdAt||0;
const fmtDate = t=>new Date(t).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit'});
const fmtDay = d=>`${d.slice(8)}.${d.slice(5,7)}.${d.slice(2,4)}`;
// Tag als UTC-Datum: die Firestore-Regeln lassen nur den heutigen UTC-Tag zu (1 Stunden-Eintrag pro Tag und Lehrer)
const dayKey = (d=new Date())=>d.toISOString().slice(0,10);
const rid = ()=>'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const byName = (x,y)=>x.t.name.localeCompare(y.t.name,'de');
const tagLabel = id=>TAGS.find(t=>t.id===id)?.label||id;
const lessonColor = v=>v>0?INK:v<0?RED:GRAPH;
const lessonLabel = v=> v<=-8?'Albtraum' : v<=-5?'Zäh' : v<=-2?'Naja' : v<=1?'Neutral' : v<=4?'Ganz gut' : v<=7?'Gute Stunde' : 'Mega-Stunde';
const errMsg = e=>{ const c=String(e?.code||e?.message||'Fehler'); return c.includes('permission') ? 'Keine Berechtigung' : c; };
const ls = {
  get(k,d=null){ try{ const v=localStorage.getItem(k); return v===null?d:v; }catch{ return d; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch{} },
  del(k){ try{ localStorage.removeItem(k); }catch{} }
};
/* Dunkelmodus: nur lokal im Browser gespeichert (lc_theme), folgt bewusst nicht der Geräteeinstellung */
const isDark = ()=>ls.get('lc_theme')==='dark';
/* Glas-Design (Beta): ersetzt den Papier-Look komplett (glass.css), ebenfalls nur lokal gespeichert (lc_design) */
const isGlass = ()=>ls.get('lc_design')==='glass';
function applyTheme(){
  const d=isDark(), g=isGlass();
  document.documentElement.dataset.theme=d?'dark':'light';
  document.documentElement.dataset.design=g?'glass':'paper';
  $('meta[name=theme-color]')?.setAttribute('content',g?(d?'#0b1516':'#e6efed'):(d?'#1c1b17':'#efe8d6'));
  $('meta[name=color-scheme]')?.setAttribute('content',d?'dark':'light');
}
const withTimeout = (p,ms=10000)=>Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error('Zeitüberschreitung – bist du online?')),ms))]);

/* ---------- Identität (lokal pro Gerät; in der Cloud = Firebase-Anonym-ID) ---------- */
let UID = ls.get('lc_uid');
if(!UID){
  UID = (typeof crypto!=='undefined' && typeof crypto.randomUUID==='function') ? crypto.randomUUID() : 'u'+Math.random().toString(36).slice(2)+Date.now().toString(36);
  ls.set('lc_uid',UID);
}
let UNAME = ls.get('lc_name','') || '';
let NAME_MSG = '';

/* ---------- State ---------- */
const S = {
  teachers:[], ratings:[], lessons:[], A:new Map(),
  tab:'teachers', q:'', subj:'Alle', sort:'overall', cmp:[],
  cloud:false, mode:'local', ready:false, authed:false, err:'', boss:null, bossDev:false, me:null, members:[], askedName:false,
  _got:{t:false,r:false,l:false,b:false,m:false,d:false}
};
const unsubs = {data:[], members:null};
let SHEET = null, FORM = null, FORM_T = null, FORM_L = null, fb = null, NEWCODE = '';

// BOSS ist, wer das BOSS-Dokument angelegt hat oder sich mit einem gültigen BOSS-Code angemeldet hat (S.bossDev)
const isBoss = ()=>S.cloud && ((!!S.boss && S.boss.uid===UID) || S.bossDev);
const canManage = ()=>!S.cloud || isBoss();
const hasAccess = ()=>!S.cloud || isBoss() || S.me?.status==='approved';
const nameLocked = ()=>!!SHEET && SHEET.type==='name' && !S.cloud && !UNAME;
const pendingCount = ()=>isBoss()?S.members.filter(m=>m.status==='pending').length:0;

/* ---------- Auswertung ---------- */
function computeAll(){
  const rby=new Map(), lby=new Map();
  S.teachers.forEach(t=>{ rby.set(t.id,[]); lby.set(t.id,[]); });
  S.ratings.forEach(r=>{ if(rby.has(r.teacherId)) rby.get(r.teacherId).push(r); });
  S.lessons.forEach(l=>{ if(lby.has(l.teacherId)) lby.get(l.teacherId).push(l); });
  const A=new Map();
  for(const t of S.teachers){
    const rs=rby.get(t.id), n=rs.length, lsn=lby.get(t.id), ln=lsn.length;
    // Ergebnisse erst ab MIN_N Bewertungen (Stunden: ab MIN_N verschiedenen Schülern), damit niemand einzeln erkennbar ist
    const ok=n>=MIN_N, lu=new Set(lsn.map(l=>l.userId)).size, lok=lu>=MIN_N;
    const shown=ok?rs:[];
    const avg={};
    CRIT.forEach(c=>{ const v=shown.map(r=>Number(r[c.key])).filter(x=>x>0); avg[c.key]=v.length?mean(v):null; });
    const cv=CRIT.map(c=>avg[c.key]).filter(v=>v!=null);
    const crit=cv.length?mean(cv):null;
    const lavg=lok?mean(lsn.map(l=>Number(l.points)||0)):null;
    const lstars=lavg==null?null:(lavg+10)/20*4+1;
    const overall=(ok&&crit!=null)?(lstars!=null?crit*(1-LESSON_W)+lstars*LESSON_W:crit):null;
    const per=shown.map(ovr);
    const dist=[0,0,0,0,0]; per.forEach(p=>{ dist[clamp(Math.round(p),1,5)-1]++; });
    const rv=shown.filter(r=>typeof r.rec==='boolean');
    const recN=rv.length, recYes=rv.filter(r=>r.rec).length;
    const tags=new Map(); shown.forEach(r=>(r.tags||[]).forEach(id=>tags.set(id,(tags.get(id)||0)+1)));
    A.set(t.id,{t,rs,n,ok,lok,lu,avg,crit,overall,dist,std:stdev(per),ls:lsn,ln,lavg,lstars,recN,recPct:recN>=MIN_N?recYes/recN*100:null,tags});
  }
  S.A=A;
}
function badgesFor(a){
  if(a.n<3) return [];
  const o=[], v=k=>a.avg[k];
  if(v('f')>=4.3) o.push('Sonnenschein');
  if(v('h')>=4.3) o.push('Immer da');
  if(v('b')>=4.3) o.push('Erklärbär');
  if(v('u')>=4.3) o.push('Show-Talent');
  if(v('a')>=4.3) o.push('Klassen-Versteher');
  if(v('p')>=4.3) o.push('Faire Tests');
  if(v('g')>=4.3) o.push('Fairness-Champion');
  if(a.overall>=4.3) o.push('Allrounder');
  if(a.std>=1.1) o.push('Polarisierend');
  return o;
}
const myRating = tid=>S.ratings.find(r=>r.teacherId===tid && r.userId===UID);
const myLessonToday = tid=>S.lessons.find(l=>l.id===`${tid}_${UID}_${dayKey()}`);
const allSubjects = ()=>[...new Set(S.teachers.flatMap(t=>t.subjects||[]))].sort((a,b)=>a.localeCompare(b,'de'));
function subjectStats(){
  const m=new Map();
  for(const r of S.ratings){
    const a=S.A.get(r.teacherId); if(!a||!a.ok) continue;
    const subs=r.subject?[r.subject]:(a.t.subjects||[]);
    subs.forEach(s=>{ if(!m.has(s)) m.set(s,[]); m.get(s).push(r); });
  }
  return [...m].filter(([,rs])=>rs.length>=MIN_N).map(([s,rs])=>({
    s, n:rs.length, overall:mean(rs.map(ovr)),
    avg:Object.fromEntries(CRIT.map(c=>[c.key,mean(rs.map(r=>Number(r[c.key])).filter(x=>x>0))]))
  })).sort((a,b)=>b.overall-a.overall);
}

/* ---------- Mini-Komponenten ---------- */
function initials(name){
  const n=name.replace(/^(herr|frau|hr|fr|dr|prof)\.?\s+/i,'').trim();
  const p=n.split(/\s+/).filter(Boolean);
  if(!p.length) return '?';
  return (p.length>1 ? p[0][0]+p[1][0] : p[0].slice(0,2)).toUpperCase();
}
const avatar = (name,size='')=>`<span class="av ${size}">${esc(initials(name))}</span>`;
function boxes(v,cls=''){
  const s=cls==='lg'?22:cls==='xs'?9:12, g=cls==='lg'?6:cls==='xs'?3:4;
  const val=v==null?0:clamp(v,0,5);
  const w=Math.floor(val)*(s+g)+(val-Math.floor(val))*s;
  return `<span class="boxes ${cls}" style="--w:${w.toFixed(1)}px" role="img" aria-label="${fmt(v)} von 5"></span>`;
}
const title = (a,b)=>`<h2 class="vt">${a}${b?`<span class="l2">${b}</span>`:''}</h2>`;
const emptyBlock = (t,x,b='')=>`<div class="empty"><h3>${t}</h3><p>${x}</p>${b}</div>`;
function heatStyle(v){
  if(v==null) return '';
  if(v>=3) return `background:rgba(var(--ink-rgb),${(0.05+(v-3)/2*0.33).toFixed(2)})`;
  return `background:rgba(var(--red-rgb),${(0.08+(3-v)/2*0.30).toFixed(2)})`;
}
const critLabel = c=>`<span class="hno">${c.no}</span>${esc(c.name)}`;
const hbar = (label,value,max,right)=>`<div class="hrow"><div class="hl">${label}</div><div class="hb"><i style="--w:${value==null?0:(value/max*100).toFixed(1)}%"></i></div><div class="hv">${right}</div></div>`;
const crown = uid=>(S.boss&&S.boss.uid===uid)?CROWN:'';
function columns(items,opts={}){
  const m=Math.max(1,...items.map(i=>i.value));
  return `<div class="cols ${opts.cls||''}">${items.map((i,k)=>`<div class="col"><div class="cb"><i style="--h:${(i.value/m*100).toFixed(1)}%;animation-delay:${k*.05}s"><b>${i.value}</b></i></div><div class="cl">${esc(i.label)}</div></div>`).join('')}</div>`;
}
function diverge(items){
  return `<div class="dv">${items.map((i,k)=>`<div class="dvc"><div class="dvb ${i.value>=0?'up':'down'}" style="height:${(Math.abs(i.value)/10*50).toFixed(1)}%;background:${lessonColor(i.value)};animation-delay:${k*.04}s"></div></div>`).join('')}</div>
  <div class="dvl">${items.map(i=>`<span>${fmtPts(i.value,1)}<br>${esc(i.label)}</span>`).join('')}</div>`;
}
function heat(rows){
  return `<div class="heatwrap"><table class="heat"><thead><tr><th></th>${CRIT.map(c=>`<th>${c.no}<span>${c.short}</span></th>`).join('')}<th>Ø<span>Gesamt</span></th></tr></thead><tbody>${
    rows.map(r=>`<tr><td class="hn">${esc(r.label)}<small>${r.n}</small></td>${r.vals.map(v=>`<td><span class="hc" style="${heatStyle(v)}">${fmt(v)}</span></td>`).join('')}<td><span class="hc strong" style="${heatStyle(r.overall)}">${fmt(r.overall)}</span></td></tr>`).join('')
  }</tbody></table></div>`;
}
function radarSVG(series){
  const N=CRIT.length, cx=190, cy=158, R=92;
  const ang=CRIT.map((_,i)=>(-90+i*360/N)*Math.PI/180);
  const pt=(i,v)=>[cx+Math.cos(ang[i])*R*(v/5), cy+Math.sin(ang[i])*R*(v/5)];
  const P=a=>a.map(n=>n.toFixed(1)).join(',');
  let s='<svg class="radar" viewBox="0 0 380 320" role="img" aria-label="Radar-Diagramm">';
  for(let lv=1;lv<=5;lv++) s+=`<polygon points="${ang.map((_,i)=>P(pt(i,lv))).join(' ')}" class="rgrid"/>`;
  ang.forEach((_,i)=>{ const [x,y]=pt(i,5); s+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="raxis"/>`; });
  series.forEach((se,si)=>{
    if(se.vals.every(v=>v==null)) return;
    const vals=se.vals.map(v=>v==null?0:v);
    s+=`<polygon points="${vals.map((v,i)=>P(pt(i,v))).join(' ')}" class="rpoly" style="fill:${se.color};fill-opacity:.13;stroke:${se.color};${se.dash?'stroke-dasharray:7 5;':''}animation-delay:${si*.1}s"/>`;
    vals.forEach((v,i)=>{ const [x,y]=pt(i,v); s+=`<rect x="${(x-3.5).toFixed(1)}" y="${(y-3.5).toFixed(1)}" width="7" height="7" fill="${se.color}"/>`; });
  });
  CRIT.forEach((c,i)=>{
    const co=Math.cos(ang[i]), si=Math.sin(ang[i]);
    const lx=cx+co*(R+14), ly=cy+si*(R+14)+(si>.3?10:si<-.3?-2:4);
    const an=co>.3?'start':co<-.3?'end':'middle';
    s+=`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${an}" class="rlab">${c.no} ${c.short}</text>`;
  });
  return s+'</svg>';
}
function trendSVG(rs){
  const sorted=[...rs].sort((a,b)=>ts(a)-ts(b));
  let sum=0; const pts=sorted.map((r,i)=>{ sum+=ovr(r); return sum/(i+1); });
  if(pts.length<2) return '';
  const W=300,H=80,pad=8;
  const x=i=>pad+(W-2*pad)*(i/(pts.length-1));
  const y=v=>H-pad-(H-2*pad)*((v-1)/4);
  const d=pts.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" class="trend" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
}
function pointsLine(vals){
  const W=300,H=110,pad=12,n=vals.length;
  const x=i=>pad+(W-2*pad)*(i/(n-1));
  const y=v=>pad+(H-2*pad)*(1-(v+10)/20);
  let d='', pen=false, dots='';
  vals.forEach((v,i)=>{
    if(v==null){ pen=false; return; }
    d+=`${pen?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `; pen=true;
    dots+=`<rect x="${(x(i)-4.5).toFixed(1)}" y="${(y(v)-4.5).toFixed(1)}" width="9" height="9" fill="${lessonColor(v)}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="trend" style="height:auto;max-height:170px"><line x1="${pad}" x2="${W-pad}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}" stroke="${GRAPH}" stroke-opacity=".45" stroke-dasharray="4 4"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}
function toast(msg){
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg;
  $('#toast').appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); },2800);
}
function stampPop(text){
  const d=document.createElement('div'); d.className='stampPop'; d.innerHTML=`<span>${esc(text)}</span>`;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1400);
}

/* ---------- Speicher: lokal ---------- */
function lsLoad(){
  try{
    const d=JSON.parse(ls.get('lc_local_v1','null'));
    if(d&&Array.isArray(d.teachers)&&Array.isArray(d.ratings)) return {teachers:d.teachers,ratings:d.ratings,lessons:Array.isArray(d.lessons)?d.lessons:[]};
  }catch{}
  return {teachers:[],ratings:[],lessons:[]};
}
const lsSave=()=>ls.set('lc_local_v1',JSON.stringify({teachers:S.teachers,ratings:S.ratings,lessons:S.lessons}));

/* ---------- Speicher: Firebase ---------- */
function parseCfg(txt){
  if(!txt) return null;
  try{ const j=JSON.parse(txt); if(j&&j.apiKey&&j.projectId) return j; }catch{}
  const o={}; const re=/["']?([A-Za-z]+)["']?\s*:\s*["'`]([^"'`]+)["'`]/g; let m;
  while((m=re.exec(txt))) o[m[1]]=m[2];
  return (o.apiKey&&o.projectId)?o:null;
}
const getCfg=()=>FIREBASE_CONFIG||parseCfg(ls.get('lc_fbcfg'));

function cloudErr(e){
  const c=e&&(e.code||e.message)||'Unbekannter Fehler';
  const cs=String(c);
  if(cs.includes('operation-not-allowed')) return 'Anonyme Anmeldung ist in Firebase noch nicht aktiviert (Authentication → Sign-in method → Anonymous).';
  if(cs.includes('unauthorized-domain')) return 'Diese Domain ist in Firebase nicht freigegeben (Authentication → Settings → Authorized domains).';
  if(cs.includes('permission')) return 'Keine Berechtigung. Die Firestore-Regeln sind vermutlich nicht aktuell.';
  return 'Verbindungsproblem: '+cs;
}
const cloudFail = e=>{ S.mode='error'; S.err=cloudErr(e); S.ready=true; onData(); };
const failData = e=>{ if(hasAccess()) cloudFail(e); };
function recomputeReady(){
  if(S.mode==='error') return;
  const acc=hasAccess();
  S.ready = !!(S._got.b && S._got.m && S._got.d && (!acc || (S._got.t && S._got.r && S._got.l)));
}
function stopData(){
  unsubs.data.forEach(f=>{ try{ f(); }catch{} }); unsubs.data=[];
  S.teachers=[]; S.ratings=[]; S.lessons=[]; S._got.t=false; S._got.r=false; S._got.l=false;
}
function startData(){
  const db=fb.db;
  unsubs.data=[
    fb.onSnapshot(fb.collection(db,'teachers'),snap=>{ S.teachers=snap.docs.map(d=>({id:d.id,...d.data()})); S._got.t=true; recomputeReady(); onData(); },failData),
    fb.onSnapshot(fb.collection(db,'ratings'),snap=>{ S.ratings=snap.docs.map(d=>({id:d.id,...d.data()})); S._got.r=true; recomputeReady(); onData(); },failData),
    fb.onSnapshot(fb.collection(db,'lessons'),snap=>{ S.lessons=snap.docs.map(d=>({id:d.id,...d.data()})); S._got.l=true; recomputeReady(); onData(); },failData)
  ];
}
function syncAccess(){
  const acc=isBoss()||S.me?.status==='approved';
  if(acc&&!unsubs.data.length) startData();
  if(!acc&&unsubs.data.length) stopData();
  if(isBoss()&&!unsubs.members){
    unsubs.members=fb.onSnapshot(fb.collection(fb.db,'members'),snap=>{ S.members=snap.docs.map(d=>({id:d.id,...d.data()})); onData(); },failData);
  } else if(!isBoss()&&unsubs.members){
    unsubs.members(); unsubs.members=null; S.members=[];
  }
}
async function startCloud(cfg){
  S.mode='cloud'; S.ready=false; S.authed=false; S._got={t:false,r:false,l:false,b:false,m:false,d:false};
  onData();
  setTimeout(()=>{ if(!S.ready && S.cloud){ S.mode='error'; S.err='Keine Antwort von Firebase. Offline oder Konfiguration falsch?'; S.ready=true; onData(); } },12000);
  try{
    const base=`https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [appM,fsM,authM]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-firestore.js'),import(base+'firebase-auth.js')]);
    const app=appM.initializeApp(cfg);
    const auth=authM.getAuth(app);
    const cred=await authM.signInAnonymously(auth);
    UID=cred.user.uid; S.authed=true;
    const db=fsM.initializeFirestore(app,{experimentalAutoDetectLongPolling:true});
    fb={db,...fsM};
    const bossChanged=()=>{
      if(isBoss()&&UNAME!=='BOSS'){ UNAME='BOSS'; ls.set('lc_name','BOSS'); }
      syncAccess(); recomputeReady(); onData();
    };
    fsM.onSnapshot(fsM.doc(db,'meta','boss'),snap=>{
      S.boss=snap.exists()?snap.data():null; S._got.b=true; bossChanged();
    },cloudFail);
    // BOSS-Code: Dieses Gerät ist BOSS, solange sein eingelöster Code noch existiert
    // Fehler hier (z. B. Regeln noch nicht aktualisiert) legen nicht die ganze Seite lahm: dann gilt „kein Code-BOSS“
    let codeUnsub=null;
    const noCode=()=>{ S.bossDev=false; S._got.d=true; bossChanged(); };
    fsM.onSnapshot(fsM.doc(db,'bossDevices',UID),snap=>{
      const code=snap.exists()?snap.data().code:null;
      if(codeUnsub){ codeUnsub(); codeUnsub=null; }
      if(!code){ noCode(); return; }
      codeUnsub=fsM.onSnapshot(fsM.doc(db,'bossCodes',code),s2=>{ S.bossDev=s2.exists(); S._got.d=true; bossChanged(); },noCode);
    },noCode);
    fsM.onSnapshot(fsM.doc(db,'members',UID),snap=>{
      S.me=snap.exists()?snap.data():null; S._got.m=true;
      if(S.me&&S.me.name&&!isBoss()&&UNAME!==S.me.name){ UNAME=S.me.name; ls.set('lc_name',UNAME); }
      syncAccess(); recomputeReady(); onData();
    },cloudFail);
  }catch(e){
    S.mode='error'; S.err=cloudErr(e); S.ready=true; onData();
  }
}
function startLocal(){
  const d=lsLoad(); S.teachers=d.teachers; S.ratings=d.ratings; S.lessons=d.lessons; S.mode='local'; S.ready=true; onData();
}
async function claimBoss(){
  if(!fb) throw new Error('Keine Verbindung zu Firebase');
  await withTimeout(fb.setDoc(fb.doc(fb.db,'meta','boss'),{uid:UID,name:'BOSS',createdAt:Date.now()}));
}

/* BOSS-Code: 40 Zeichen (A–Z, 2–7) = 200 Bit Zufall, nicht erratbar. Der Code ist die ID eines Dokuments in bossCodes. */
const CODE_RE=/^[A-Z2-7]{40}$/;
const normCode = v=>String(v||'').toUpperCase().replace(/[^A-Z2-7]/g,'');
const fmtCode = c=>c.match(/.{1,5}/g).join('-');
function genCode(){
  const b=new Uint8Array(40); crypto.getRandomValues(b);
  return Array.from(b,x=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[x&31]).join('');
}
// Neuen Code anlegen und alle alten ungültig machen. Der aktuelle Browser bleibt BOSS.
async function rotateBossCode(){
  needFb();
  const code=genCode(), db=fb.db;
  await withTimeout(fb.setDoc(fb.doc(db,'bossCodes',code),{createdAt:Date.now(),createdBy:UID}));
  if(!(S.boss&&S.boss.uid===UID)) await withTimeout(fb.setDoc(fb.doc(db,'bossDevices',UID),{uid:UID,code,createdAt:Date.now()}));
  const old=await withTimeout(fb.getDocs(fb.collection(db,'bossCodes')));
  await Promise.all(old.docs.filter(d=>d.id!==code).map(d=>withTimeout(fb.deleteDoc(d.ref))));
  return code;
}

/* Einmalige Bereinigung: Alte Bewertungen und Stunden enthalten noch das Feld userName (Klarname). Der BOSS entfernt es,
   damit Mitglieder nicht mehr sehen können, wer was bewertet hat. Läuft höchstens einmal pro Seitenaufruf, still im Hintergrund. */
let stripTried=false;
async function stripOldNames(){
  if(stripTried||!fb||!S.cloud||!S.ready||S.mode==='error'||!isBoss()) return;
  const refs=[
    ...S.ratings.filter(r=>'userName' in r).map(r=>fb.doc(fb.db,'ratings',r.id)),
    ...S.lessons.filter(l=>'userName' in l).map(l=>fb.doc(fb.db,'lessons',l.id))
  ];
  if(!refs.length) return;
  stripTried=true;
  try{
    for(let i=0;i<refs.length;i+=400){
      const b=fb.writeBatch(fb.db);
      refs.slice(i,i+400).forEach(r=>b.update(r,{userName:fb.deleteField()}));
      await withTimeout(b.commit(),20000);
    }
    toast('Alte Namen aus Bewertungen entfernt');
  }catch{ /* z. B. Regeln noch nicht aktualisiert: beim nächsten Aufruf wieder */ }
}

/* ---------- API ---------- */
const needFb=()=>{ if(!fb) throw new Error('Keine Verbindung zu Firebase'); };
const api={
  async requestAccess(name){
    needFb(); await withTimeout(fb.setDoc(fb.doc(fb.db,'members',UID),{uid:UID,name,status:'pending',createdAt:Date.now()}));
  },
  async withdrawAccess(){ needFb(); await withTimeout(fb.deleteDoc(fb.doc(fb.db,'members',UID))); },
  async setMember(uid,status){ needFb(); await withTimeout(fb.updateDoc(fb.doc(fb.db,'members',uid),{status,decidedAt:Date.now()})); },
  async deleteMember(uid){ needFb(); await withTimeout(fb.deleteDoc(fb.doc(fb.db,'members',uid))); },
  async addTeacher(d){
    const t={name:d.name,subjects:d.subjects,createdAt:Date.now(),createdBy:UID};
    if(S.cloud){ needFb(); const ref=await withTimeout(fb.addDoc(fb.collection(fb.db,'teachers'),t)); return ref.id; }
    t.id=rid(); S.teachers.push(t); lsSave(); onData(); return t.id;
  },
  async updateTeacher(id,d){
    if(S.cloud){ needFb(); await withTimeout(fb.updateDoc(fb.doc(fb.db,'teachers',id),d)); return; }
    const t=S.teachers.find(x=>x.id===id); if(t) Object.assign(t,d); lsSave(); onData();
  },
  async deleteTeacher(id){
    if(S.cloud){
      needFb();
      const refs=[
        ...S.ratings.filter(r=>r.teacherId===id).map(r=>fb.doc(fb.db,'ratings',r.id)),
        ...S.lessons.filter(l=>l.teacherId===id).map(l=>fb.doc(fb.db,'lessons',l.id))
      ];
      for(let i=0;i<refs.length;i+=400){
        const b=fb.writeBatch(fb.db);
        refs.slice(i,i+400).forEach(r=>b.delete(r));
        await withTimeout(b.commit(),20000);
      }
      await withTimeout(fb.deleteDoc(fb.doc(fb.db,'teachers',id)));
      return;
    }
    S.teachers=S.teachers.filter(t=>t.id!==id);
    S.ratings=S.ratings.filter(r=>r.teacherId!==id);
    S.lessons=S.lessons.filter(l=>l.teacherId!==id);
    lsSave(); onData();
  },
  async saveRating(tid,d){
    const id=tid+'_'+UID, prev=S.ratings.find(r=>r.id===id), now=Date.now();
    const r={teacherId:tid,userId:UID,tags:d.tags||[],rec:(typeof d.rec==='boolean')?d.rec:null,subject:d.subject||'',createdAt:prev?.createdAt||now,updatedAt:now};
    CRIT.forEach(c=>{ r[c.key]=d[c.key]; });
    if(S.cloud){ needFb(); await withTimeout(fb.setDoc(fb.doc(fb.db,'ratings',id),r)); return; }
    const i=S.ratings.findIndex(x=>x.id===id); const row={id,...r};
    if(i>=0) S.ratings[i]=row; else S.ratings.push(row);
    lsSave(); onData();
  },
  async deleteRating(id){
    if(S.cloud){ needFb(); await withTimeout(fb.deleteDoc(fb.doc(fb.db,'ratings',id))); return; }
    S.ratings=S.ratings.filter(r=>r.id!==id); lsSave(); onData();
  },
  async saveLesson(tid,points){
    const day=dayKey(), id=`${tid}_${UID}_${day}`, prev=S.lessons.find(l=>l.id===id), now=Date.now();
    const l={teacherId:tid,userId:UID,points:clamp(Math.round(points),-10,10),day,createdAt:prev?.createdAt||now,updatedAt:now};
    if(S.cloud){ needFb(); await withTimeout(fb.setDoc(fb.doc(fb.db,'lessons',id),l)); return; }
    const i=S.lessons.findIndex(x=>x.id===id); const row={id,...l};
    if(i>=0) S.lessons[i]=row; else S.lessons.push(row);
    lsSave(); onData();
  },
  async deleteLesson(id){
    if(S.cloud){ needFb(); await withTimeout(fb.deleteDoc(fb.doc(fb.db,'lessons',id))); return; }
    S.lessons=S.lessons.filter(l=>l.id!==id); lsSave(); onData();
  }
};

/* ---------- Demo-Daten (nur lokal) ---------- */
function mulberry32(a){ return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function loadDemo(){
  const rnd=mulberry32(42);
  // Werte in Reihenfolge von CRIT: f, h, b, u, a, p, g
  const T=[
    {n:'Herr Müller',s:['Mathe','Physik'],p:[3.2,3.6,4.5,3.4,3.4,4.0,4.2],v:2.2,tg:['streng','fordernd','anschaulich']},
    {n:'Frau Schneider',s:['Deutsch','Geschichte'],p:[4.6,4.4,3.9,4.3,4.2,4.1,4.4],v:2.0,tg:['humor','zeit','anschaulich']},
    {n:'Herr Weber',s:['Englisch'],p:[4.2,4.3,4.7,4.6,4.5,3.9,3.8],v:2.0,tg:['humor','locker','anschaulich']},
    {n:'Frau Fischer',s:['Chemie','Biologie'],p:[3.8,3.0,3.3,2.8,2.9,3.2,3.1],v:2.4,tg:['hausi','buch','schlaf']},
    {n:'Herr Becker',s:['Sport'],p:[4.8,4.5,3.6,4.7,4.6,4.4,4.9],v:1.6,tg:['locker','humor','puenktlich']},
    {n:'Frau Hoffmann',s:['Kunst','Musik'],p:[4.4,4.0,3.2,3.5,3.7,2.8,2.6],v:3.4,tg:['chaos','laut','humor']},
    {n:'Herr Wagner',s:['Informatik'],p:[3.0,3.4,4.1,3.2,3.2,3.8,3.6],v:2.2,tg:['streng','fordernd','puenktlich']}
  ];
  const names=['LM','JS','AK','TB','NH','PW','SK','MR','EF','DL','CB','FG','OH','VK'];
  const now=Date.now(), day=864e5;
  T.forEach(def=>{
    const id=rid();
    S.teachers.push({id,name:def.n,subjects:def.s,createdAt:now-60*day,createdBy:'demo',demo:true});
    const cnt=7+Math.floor(rnd()*7);
    const pool=[...names].sort(()=>rnd()-.5).slice(0,cnt);
    pool.forEach(u=>{
      const val=p=>clamp(Math.round(p+(rnd()-.5)*def.v),1,5);
      const r={id:id+'_demo-'+u,teacherId:id,userId:'demo-'+u,demo:true};
      CRIT.forEach((c,i)=>{ r[c.key]=val(def.p[i]); });
      const o=ovr(r);
      r.subject=(def.s.length>1&&rnd()>.4)?def.s[Math.floor(rnd()*def.s.length)]:'';
      const tgs=[]; def.tg.forEach(t=>{ if(rnd()<.4) tgs.push(t); }); r.tags=tgs.slice(0,TAG_MAX);
      r.rec=rnd()<.85?(rnd()<(o-1.5)/3.2):null;
      const t=now-rnd()*55*day; r.createdAt=t; r.updatedAt=t;
      S.ratings.push(r);
      const mood=(mean(def.p)-3)*5, days=3+Math.floor(rnd()*6), used=new Set();
      for(let k=0;k<days;k++){
        const off=Math.floor(rnd()*28); if(used.has(off)) continue; used.add(off);
        const dt=new Date(now-off*day), dk=dayKey(dt);
        const pts=clamp(Math.round(mood+(rnd()-.5)*(def.v*3.2)),-10,10);
        S.lessons.push({id:`${id}_demo-${u}_${dk}`,teacherId:id,userId:'demo-'+u,points:pts,day:dk,createdAt:dt.getTime(),updatedAt:dt.getTime(),demo:true});
      }
    });
  });
  lsSave(); onData();
}
function clearDemo(){
  S.teachers=S.teachers.filter(t=>!t.demo); S.ratings=S.ratings.filter(r=>!r.demo); S.lessons=S.lessons.filter(l=>!l.demo);
  lsSave(); onData();
}

/* ---------- Views ---------- */
function teacherCard(a,i){
  const t=a.t, mine=myRating(t.id);
  const meta=[];
  if(a.recPct!=null) meta.push(`<span class="mt">Empfehlung <b>${Math.round(a.recPct)} %</b></span>`);
  if(a.lok) meta.push(`<span class="mt">Stunden <b style="color:${lessonColor(a.lavg)}">${fmtPts(a.lavg,1)}</b></span>`);
  const bd=badgesFor(a).slice(0,3);
  return `<article class="trow" data-act="open" data-id="${esc(t.id)}" style="--i:${Math.min(i,14)}">
    <div class="tr-info"><span class="nr">Nr. ${String(i+1).padStart(2,'0')}</span><h3 class="tr-name"><span>${esc(t.name)}</span></h3><div class="tr-sub">${esc((t.subjects||[]).join(' · '))}</div></div>
    <div class="grade" style="--v:${a.ok?a.overall.toFixed(2):0}">${a.ok?`${RING}<b>${fmt(a.overall)}</b><small>von 5</small>`:`<b class="none">–</b><small>${a.n?`${a.n}/${MIN_N}`:'offen'}</small>`}</div>
    <div class="tr-bars">${CRIT.map(c=>`<div class="ar"><i>${c.no}</i><span>${c.short}</span>${boxes(a.avg[c.key],'xs')}<em>${fmt(a.avg[c.key])}</em></div>`).join('')}</div>
    <div class="tr-meta">${meta.join('')}${bd.map((b,k)=>`<span class="stamp s${k%3}">${esc(b)}</span>`).join('')}</div>
    <div class="tr-foot"><span class="cnt">${a.n} Bewertung${a.n===1?'':'en'}</span><span class="${mine?'done':'cta'}">${mine?'bewertet':'Bewerten'}</span><button class="qbtn" data-act="lesson" data-id="${esc(t.id)}">Stunde</button></div>
  </article>`;
}
function viewTeachers(){
  const opts=[['overall','Beste Gesamtnote'],...CRIT.map(c=>[c.key,`${c.no} ${c.name}`]),['rec','Weiterempfehlung'],['lessons','Stunden-Punkte'],['n','Meiste Bewertungen'],['name','A bis Z']];
  return `<h2 class="vt">Zeugnis<span class="l2">für <em>Lehrer${UL}</em></span></h2>
  <p class="lede">Sieben Aufgaben pro Lehrer: Kästchen ankreuzen, fertig. Pro Schultag gibt es zusätzlich Stunden-Punkte von −10 bis +10. Ergebnisse erscheinen ab ${MIN_N} Bewertungen, damit niemand einzeln erkennbar ist.</p>
  <div class="toolbar">
    <label class="search"><span class="lab">Suche</span><input id="q" type="search" placeholder="Name oder Fach" value="${esc(S.q)}" autocomplete="off"></label>
    <select id="sort" class="sel" aria-label="Sortierung">${opts.map(([v,l])=>`<option value="${v}" ${S.sort===v?'selected':''}>${l}</option>`).join('')}</select>
  </div>
  <div class="chips scroll" id="chips"></div>
  <div id="list"></div>`;
}
function renderChips(){
  const el=$('#chips'); if(!el) return;
  const subs=['Alle',...allSubjects()];
  if(!subs.includes(S.subj)) S.subj='Alle';
  el.innerHTML=subs.map(s=>`<button class="chip ${S.subj===s?'on':''}" data-act="subj" data-s="${esc(s)}">${esc(s)}</button>`).join('');
}
function renderList(anim=true){
  const el=$('#list'); if(!el) return;
  if(!S.ready){ el.className=''; el.innerHTML=emptyBlock('Moment …','Die Klassen-Datenbank wird verbunden.'); return; }
  let arr=[...S.A.values()];
  const q=S.q.trim().toLowerCase();
  if(q) arr=arr.filter(a=>a.t.name.toLowerCase().includes(q)||(a.t.subjects||[]).some(s=>s.toLowerCase().includes(q)));
  if(S.subj!=='Alle') arr=arr.filter(a=>(a.t.subjects||[]).includes(S.subj));
  const key=S.sort;
  const val=a=>key==='overall'?a.overall:key==='rec'?a.recPct:key==='lessons'?a.lavg:a.avg[key];
  arr.sort((x,y)=>{
    if(key==='name') return byName(x,y);
    if(key==='n') return (y.n-x.n)||byName(x,y);
    const vx=val(x), vy=val(y);
    if(vx==null&&vy==null) return byName(x,y);
    if(vx==null) return 1;
    if(vy==null) return -1;
    return (vy-vx)||(y.n-x.n);
  });
  if(!arr.length){
    el.className='';
    if(!S.teachers.length){
      if(canManage()){
        el.innerHTML=emptyBlock('Noch leer.','Der erste Lehrer fehlt noch. Danach kann die Klasse ankreuzen.',
          `<div class="row2"><button class="btn primary" data-act="add-teacher">+ Lehrer hinzufügen</button>${!S.cloud?'<button class="btn" data-act="demo-load">Demo-Daten laden</button>':''}</div>`);
      } else {
        el.innerHTML=emptyBlock('Noch leer.', S.boss?'Der BOSS legt die Lehrer an. Schau später noch mal vorbei.':'Es gibt noch keinen BOSS. Wer sich als Erster „BOSS“ nennt, legt die Lehrer an.');
      }
    } else {
      el.innerHTML=emptyBlock('Nichts gefunden.','Probier eine andere Suche oder einen anderen Fach-Filter.');
    }
    return;
  }
  el.className='list'+(anim?'':' still');
  el.innerHTML=arr.map((a,i)=>teacherCard(a,i)).join('');
}

function viewStats(){
  const rsAll=S.ratings.filter(r=>S.A.has(r.teacherId));
  const rs=rsAll.filter(r=>S.A.get(r.teacherId).ok);   // nur Lehrer mit genug Bewertungen fließen in die Auswertung ein
  if(!rs.length) return title('Auswertung')+emptyBlock('Noch nichts da.',rsAll.length?`Die Auswertung erscheint, sobald ein Lehrer mindestens ${MIN_N} Bewertungen hat. So bleibt niemand einzeln erkennbar.`:'Sobald die ersten Bewertungen eingegangen sind, erscheinen hier Diagramme, Bestenlisten und Randnotizen.',
    '<button class="btn primary" data-act="tab" data-tab="teachers">Zu den Lehrern</button>');
  const all=[...S.A.values()], rated=all.filter(a=>a.ok);
  const lessonsAll=S.lessons.filter(l=>S.A.get(l.teacherId)?.lok);
  const overall=mean(rs.map(ovr));
  const users=new Set(rsAll.map(r=>r.userId)).size;
  const critAvg=CRIT.map(c=>({c,v:mean(rs.map(r=>Number(r[c.key])).filter(x=>x>0))}));
  const ca=critAvg.filter(x=>x.v!=null);
  const dist=[0,0,0,0,0]; rs.forEach(r=>{ dist[clamp(Math.round(ovr(r)),1,5)-1]++; });
  const pool=rated;
  const boards=CRIT.map(c=>{
    const top=[...pool].filter(a=>a.avg[c.key]!=null).sort((x,y)=>(y.avg[c.key]-x.avg[c.key])||(y.n-x.n)).slice(0,3);
    return `<div class="sec"><h3>${c.no} ${esc(c.name)}</h3>${top.map((a,i)=>`<div class="lb" data-act="open" data-id="${esc(a.t.id)}"><span class="medal">${i+1}</span><span class="lbn">${esc(a.t.name)}</span><span class="lbv">${fmt(a.avg[c.key])}</span></div>`).join('')||'<p class="note">Noch keine Daten.</p>'}</div>`;
  }).join('');
  const recPool=rated.filter(a=>a.recPct!=null);
  const recBoard=recPool.length?`<div class="sec"><h3>Weiterempfehlung</h3>${[...recPool].sort((x,y)=>(y.recPct-x.recPct)||(y.recN-x.recN)).slice(0,3).map((a,i)=>`<div class="lb" data-act="open" data-id="${esc(a.t.id)}"><span class="medal">${i+1}</span><span class="lbn">${esc(a.t.name)}</span><span class="lbv">${Math.round(a.recPct)} %</span></div>`).join('')}</div>`:'';
  const subj=subjectStats();
  const now=Date.now(), WK=7*864e5;
  const weeks=Array(8).fill(0); rsAll.forEach(r=>{ const k=Math.floor((now-ts(r))/WK); if(k>=0&&k<8) weeks[k]++; });
  const wk=weeks.map((v,i)=>({label:i===0?'jetzt':`-${i}W`,value:v})).reverse();

  const wsum=Array(8).fill(0), wn=Array(8).fill(0);
  lessonsAll.forEach(l=>{ const t=new Date(l.day+'T12:00:00').getTime(); const k=Math.floor((now-t)/WK); if(k>=0&&k<8){ wsum[k]+=Number(l.points)||0; wn[k]++; } });
  const wavg=wsum.map((s,i)=>wn[i]?s/wn[i]:null).reverse();
  const lAvgAll=mean(lessonsAll.map(l=>Number(l.points)||0));
  const lpool=all.filter(a=>a.lok);
  const lboard=[...lpool].sort((x,y)=>y.lavg-x.lavg).slice(0,3);
  const lessonSec=lessonsAll.length?`<section class="blk"><h3>Stunden-Punkte</h3>
  <div class="sgrid rev">
    <div class="sec"><h3>Ø Punkte pro Woche</h3>${pointsLine(wavg)}<p class="note" style="margin-top:8px">${lessonsAll.length} Stunden-Bewertungen, Ø ${fmtPts(lAvgAll,1)} auf der Skala −10 bis +10.</p></div>
    <div class="sec"><h3>Beste Stimmung im Unterricht</h3>${lboard.map((a,i)=>`<div class="lb" data-act="open" data-id="${esc(a.t.id)}"><span class="medal">${i+1}</span><span class="lbn">${esc(a.t.name)} <small>${a.ln} Std.</small></span><span class="lbv" style="color:${lessonColor(a.lavg)}">${fmtPts(a.lavg,1)}</span></div>`).join('')}</div>
  </div></section>`:'';

  const tc=new Map(); rs.forEach(r=>(r.tags||[]).forEach(id=>tc.set(id,(tc.get(id)||0)+1)));
  const tagList=[...tc].sort((a,b)=>b[1]-a[1]).slice(0,12);
  const tagSec=tagList.length?`<section class="blk"><h3>Beliebteste Tags</h3><div class="chips">${tagList.map(([id,n])=>`<span class="chip sm" style="color:var(--gr)">${esc(tagLabel(id))} · ${n}×</span>`).join('')}</div></section>`:'';

  const facts=[];
  const most=[...rated].sort((a,b)=>b.n-a.n)[0];
  if(most) facts.push(['Meistbewertet',`${esc(most.t.name)} mit ${most.n} Bewertung${most.n===1?'':'en'}`]);
  const pol=rated.filter(a=>a.n>=3).sort((a,b)=>b.std-a.std)[0];
  if(pol&&pol.std>=0.6) facts.push(['Polarisierend',`Bei ${esc(pol.t.name)} gehen die Meinungen am weitesten auseinander`]);
  const gap=rated.filter(a=>a.n>=2).map(a=>{
    const v=CRIT.map(c=>({c,v:a.avg[c.key]})).filter(x=>x.v!=null).sort((x,y)=>y.v-x.v);
    return v.length>1?{a,hi:v[0],lo:v[v.length-1],d:v[0].v-v[v.length-1].v}:null;
  }).filter(Boolean).sort((x,y)=>y.d-x.d)[0];
  if(gap&&gap.d>=0.5) facts.push(['Größtes Gefälle',`${esc(gap.a.t.name)}: ${gap.hi.c.short} ${fmt(gap.hi.v)}, aber ${gap.lo.c.short} ${fmt(gap.lo.v)}`]);
  if(ca.length>1){
    const cs=[...ca].sort((a,b)=>a.v-b.v);
    facts.push(['Größte Baustelle',`Am kritischsten bewertet: ${cs[0].c.name} (Ø ${fmt(cs[0].v)})`]);
    facts.push(['Größte Stärke',`Am besten bewertet: ${cs[cs.length-1].c.name} (Ø ${fmt(cs[cs.length-1].v)})`]);
  }
  if(subj.length) facts.push(['Bester Fach-Schnitt',`${esc(subj[0].s)} (Ø ${fmt(subj[0].overall)})`]);
  const since=now-30*864e5, mm=new Map();
  rs.filter(r=>ts(r)>=since).forEach(r=>{ if(!mm.has(r.teacherId)) mm.set(r.teacherId,[]); mm.get(r.teacherId).push(ovr(r)); });
  const mbest=[...mm].filter(([,v])=>v.length>=MIN_N).map(([id,v])=>({t:S.A.get(id).t,v:mean(v),n:v.length})).sort((a,b)=>b.v-a.v)[0];
  if(mbest) facts.push(['Lehrer des Monats',`${esc(mbest.t.name)} (Ø ${fmt(mbest.v)} in den letzten 30 Tagen)`]);
  const mood=all.filter(a=>a.lok).sort((a,b)=>b.lavg-a.lavg)[0];
  if(mood) facts.push(['Stimmungsmacher',`${esc(mood.t.name)} (Ø ${fmtPts(mood.lavg,1)} Stunden-Punkte)`]);
  if(tagList[0]) facts.push(['Meistvergebener Tag',`${esc(tagLabel(tagList[0][0]))} (${tagList[0][1]}×)`]);

  return `${title('Auswertung')}
  <p class="lede">Alles, was die Klasse bisher angekreuzt hat.</p>
  <div class="kpis">
    <div class="kpi lead"><b>${fmt(overall)}</b><span>Ø Sterne über alle Kriterien</span></div>
    <div class="kpi3">
      <div class="kpi"><b>${S.teachers.length}</b><span>Lehrer</span></div>
      <div class="kpi"><b>${rsAll.length}</b><span>Bewertungen</span></div>
      <div class="kpi"><b>${users}</b><span>Bewerter</span></div>
    </div>
  </div>
  <section class="blk"><div class="sgrid">
    <div class="sec"><h3>Kriterien im Schnitt</h3>${critAvg.map(x=>hbar(critLabel(x.c),x.v,5,fmt(x.v))).join('')}</div>
    <div class="sec"><h3>Verteilung der Gesamtnoten</h3>${columns(dist.map((v,i)=>({label:(i+1)+' von 5',value:v})))}</div>
  </div></section>
  <section class="blk"><h3>Bestenlisten</h3><div class="boards">${boards}${recBoard}</div></section>
  ${lessonSec}
  ${tagSec}
  <section class="blk"><h3>Randnotizen</h3><div class="facts">${facts.map(f=>`<div class="fact"><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div></section>
  <section class="blk"><h3>Fächer im Vergleich</h3>${subj.length?heat(subj.map(s=>({label:s.s,n:s.n,vals:CRIT.map(c=>s.avg[c.key]),overall:s.overall}))):'<p class="note">Noch keine Fach-Daten.</p>'}</section>
  <section class="blk"><h3>Alle Lehrer im Überblick</h3>${heat([...rated].sort((a,b)=>b.overall-a.overall).map(a=>({label:a.t.name,n:a.n,vals:CRIT.map(c=>a.avg[c.key]),overall:a.overall})))}</section>
  <section class="blk"><h3>Aktivität der letzten 8 Wochen</h3>${columns(wk,{cls:'sm'})}</section>`;
}

function viewCompare(){
  S.cmp=S.cmp.filter(id=>S.A.has(id));
  const list=[...S.A.values()].sort(byName);
  if(!list.length) return title('Vergleich')+emptyBlock('Noch nichts zu vergleichen.','Sobald Lehrer angelegt sind und ein paar Bewertungen vorliegen, kannst du sie hier gegeneinander antreten lassen.',
    canManage()?'<button class="btn primary" data-act="add-teacher">+ Lehrer hinzufügen</button>':'');
  const COL=[INK,RED,GRAPH];
  const chips=list.map(a=>`<button class="chip ${S.cmp.includes(a.t.id)?'on':''}" data-act="cmp-toggle" data-id="${esc(a.t.id)}">${esc(a.t.name)}</button>`).join('');
  const sel=S.cmp.map(id=>S.A.get(id));
  let body='';
  if(!sel.length){
    body=emptyBlock('Wähle bis zu drei.','Tippe oben auf Namen. Radar und Tabelle zeigen sie dann nebeneinander.');
  } else {
    const legend=`<div class="legend">${sel.map((a,i)=>`<span><i style="border-top-color:${COL[i]};${i===2?'border-top-style:dashed':''}"></i>${esc(a.t.name)}</span>`).join('')}</div>`;
    const getv=(a,key)=>key==='overall'?a.overall:key==='rec'?a.recPct:key==='lessons'?a.lavg:a.avg[key];
    const best=key=>{ const vs=sel.map(a=>getv(a,key)).filter(v=>v!=null); return vs.length?Math.max(...vs):null; };
    const row=(label,key,f=v=>fmt(v))=>{ const b=best(key); return `<tr><td>${label}</td>${sel.map(a=>{ const v=getv(a,key); return `<td class="${sel.length>1&&v!=null&&v===b?'best':''}">${v==null?'–':f(v)}</td>`; }).join('')}</tr>`; };
    const winner=sel.length>1?[...sel].filter(a=>a.ok).sort((x,y)=>y.overall-x.overall)[0]:null;
    body=`<div class="sec" style="margin-top:8px">${radarSVG(sel.map((a,i)=>({vals:CRIT.map(c=>a.avg[c.key]),color:COL[i],dash:i===2})))}${legend}
      ${winner?`<div class="winner">${esc(winner.t.name)} liegt vorn, Ø ${fmt(winner.overall)}.</div>`:''}
      <table class="cmpt"><thead><tr><th></th>${sel.map(a=>`<th>${esc(a.t.name)}</th>`).join('')}</tr></thead><tbody>
        ${CRIT.map(c=>row(`${c.no} ${c.short}`,c.key)).join('')}
        ${row('Gesamt','overall')}
        ${row('Empfehlung','rec',v=>Math.round(v)+' %')}
        ${row('Stunden','lessons',v=>fmtPts(v,1))}
        <tr><td>Bewertungen</td>${sel.map(a=>`<td>${a.n}</td>`).join('')}</tr>
      </tbody></table></div>`;
  }
  return `${title('Vergleich')}<div class="chips" style="margin:16px 0 8px">${chips}</div>${body}`;
}

function memberSection(){
  if(!isBoss()) return '';
  const ms=[...S.members];
  const pend=ms.filter(m=>m.status==='pending').sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  const appr=ms.filter(m=>m.status==='approved').sort((a,b)=>String(a.name).localeCompare(String(b.name),'de'));
  const rej=ms.filter(m=>m.status==='rejected').sort((a,b)=>String(a.name).localeCompare(String(b.name),'de'));
  const cnt=new Map(); ms.forEach(m=>{ const k=String(m.name||'').toLowerCase(); cnt.set(k,(cnt.get(k)||0)+1); });
  const row=(m,btns)=>`<div class="lrow static">${avatar(m.name||'?')}<div class="grow"><b>${esc(m.name)}${cnt.get(String(m.name||'').toLowerCase())>1?' <span class="tag">doppelter Name</span>':''}</b><small>${fmtDate(m.createdAt||0)}</small></div><span class="mbtns">${btns}</span></div>`;
  const b=(act,id,l)=>`<button class="qbtn" data-act="${act}" data-id="${esc(id)}">${l}</button>`;
  return `<section class="blk"><h3>Zugangsanfragen (${pend.length})</h3>${pend.length?pend.map(m=>row(m,b('mem-ok',m.id,'Zulassen')+b('mem-no',m.id,'Ablehnen'))).join(''):'<p class="note">Keine offenen Anfragen.</p>'}</section>
  ${appr.length?`<section class="blk"><h3>Zugelassen (${appr.length})</h3>${appr.map(m=>row(m,b('mem-revoke',m.id,'Entziehen'))).join('')}</section>`:''}
  ${rej.length?`<section class="blk"><h3>Abgelehnt (${rej.length})</h3>${rej.map(m=>row(m,b('mem-ok',m.id,'Zulassen')+b('mem-del',m.id,'Löschen'))).join('')}</section>`:''}`;
}
function viewMe(){
  const mine=S.ratings.filter(r=>r.userId===UID&&S.A.has(r.teacherId)).sort((x,y)=>ts(y)-ts(x));
  const done=new Set(mine.map(r=>r.teacherId));
  const todo=[...S.A.values()].filter(a=>!done.has(a.t.id)).sort(byName);
  const others=S.ratings.filter(r=>r.userId!==UID&&S.A.has(r.teacherId));
  const myAvg=mean(mine.map(ovr)), clsAvg=mean(others.map(ovr));
  const myLessons=S.lessons.filter(l=>l.userId===UID&&S.A.has(l.teacherId)).sort((x,y)=>y.day>x.day?1:y.day<x.day?-1:0);
  let tag='';
  if(mine.length>=2&&clsAvg!=null){ const d=myAvg-clsAvg; tag=d>=.4?'Du bewertest eher gnädig.':d<=-.4?'Du bewertest eher streng.':'Du bewertest ausgewogen.'; }
  return `${title('Mein Heft')}
  <div class="namefield"><span class="lab">Name</span><div class="nf-v">${esc(UNAME||'unbekannt')}${isBoss()?CROWN:''}</div>${!S.cloud?'<button class="btn sm" data-act="rename">Ändern</button>':''}</div>
  <p class="lede">${isBoss()?'Du bist BOSS und verwaltest die Lehrerliste.':(tag||'Bewerte mindestens zwei Lehrer, dann steht hier, ob du eher streng oder gnädig bist.')}</p>
  <div class="kpi3 top">
    <div class="kpi"><b>${mine.length}</b><span>Bewertungen</span></div>
    <div class="kpi"><b>${myLessons.length}</b><span>Stunden</span></div>
    <div class="kpi"><b>${fmt(myAvg)}</b><span>Ø von dir</span></div>
  </div>
  ${memberSection()}
  ${isBoss()?`<section class="blk"><h3>BOSS-Code</h3><p class="note">Mit einem langen Geheimcode kannst du dich auf einem neuen Gerät als BOSS anmelden. Er wird nur einmal angezeigt. Ein neuer Code macht den alten ungültig.</p><button class="btn" data-act="boss-newkey">Neuen BOSS-Code erzeugen</button></section>`:''}
  ${todo.length?`<section class="blk"><h3>Noch nicht bewertet (${todo.length})</h3>${todo.map(a=>`<div class="lrow" data-act="rate" data-id="${esc(a.t.id)}">${avatar(a.t.name)}<div class="grow"><b>${esc(a.t.name)}</b><small>${esc((a.t.subjects||[]).join(', '))}</small></div><span class="cta">Bewerten</span></div>`).join('')}</section>`:''}
  ${mine.length?`<section class="blk"><h3>Meine Bewertungen</h3>${mine.map(r=>{ const a=S.A.get(r.teacherId); return `<div class="lrow" data-act="rate" data-id="${esc(a.t.id)}">${avatar(a.t.name)}<div class="grow"><b>${esc(a.t.name)}</b><small>${fmtDate(ts(r))}${r.subject?' · '+esc(r.subject):''}</small></div>${boxes(ovr(r),'xs')}<span class="pts" style="font-size:20px">${fmt(ovr(r))}</span></div>`; }).join('')}</section>`:''}
  ${myLessons.length?`<section class="blk"><h3>Meine Stunden (zuletzt)</h3>${myLessons.slice(0,8).map(l=>{ const a=S.A.get(l.teacherId); return `<div class="lrow static">${avatar(a.t.name)}<div class="grow"><b>${esc(a.t.name)}</b><small>${fmtDay(l.day)}</small></div><span class="pts" style="color:${lessonColor(l.points)}">${fmtPts(l.points)}</span></div>`; }).join('')}</section>`:''}
  <section class="blk"><h3>Werkzeuge</h3><div class="tools">
    <button class="btn" data-act="theme">${isDark()?'Hellmodus':'Dunkelmodus'}</button>
    <button class="btn" data-act="design">${isGlass()?'Papier-Design':'Glas-Design (Beta)'}</button>
    <button class="btn" data-act="export">Bewertungen als CSV</button>
    <button class="btn" data-act="export-lessons">Stunden als CSV</button>
    <button class="btn" data-act="share">Link teilen</button>
    ${isBoss()?'<button class="btn" data-act="copy-rules">Firestore-Regeln kopieren</button>':''}
    ${!S.cloud?(S.teachers.some(t=>t.demo)?'<button class="btn danger" data-act="demo-clear">Demo-Daten entfernen</button>':'<button class="btn" data-act="demo-load">Demo-Daten laden</button>'):''}
  </div></section>`;
}

/* ---------- Sheets ---------- */
const sheetHead=(t,act='close')=>`<div class="sh">${t?`<h2>${t}</h2>`:''}<button class="x" data-act="${act}">Schließen</button></div>`;

function detailHTML(tid){
  const a=S.A.get(tid); if(!a) return sheetHead('Nicht gefunden');
  const t=a.t, mine=myRating(tid), manage=canManage();
  const bd=badgesFor(a);
  const subs=(t.subjects||[]).map(s=>{ const rs=a.rs.filter(r=>r.subject===s); return rs.length>=MIN_N?{s,n:rs.length,v:mean(rs.map(ovr))}:null; }).filter(Boolean);
  const tagList=[...a.tags].sort((x,y)=>y[1]-x[1]).slice(0,8);
  const byDay=new Map(); a.ls.forEach(l=>{ if(!byDay.has(l.day)) byDay.set(l.day,[]); byDay.get(l.day).push(Number(l.points)||0); });
  const dayItems=[...byDay].sort((x,y)=>x[0]>y[0]?1:-1).slice(-14).map(([d,v])=>({label:d.slice(8)+'.'+d.slice(5,7),value:mean(v)}));
  const lUsers=new Set(a.ls.map(l=>l.userId)).size;
  const lessonBlock=a.lok?`<div class="d-sec"><h4>Stunden-Punkte</h4>
      <p class="note">Ø <b style="color:${lessonColor(a.lavg)}">${fmtPts(a.lavg,1)}</b> aus ${a.ln} Stunden-Bewertung${a.ln===1?'':'en'} von ${lUsers} Schüler${lUsers===1?'':'n'}. Zählt ${Math.round(LESSON_W*100)} % der Gesamtnote.</p>
      ${diverge(dayItems)}</div>`
    :a.ln?`<div class="d-sec"><h4>Stunden-Punkte</h4><p class="note">Stunden-Punkte werden ab ${MIN_N} verschiedenen Schülern gezeigt (bisher ${a.lu}).</p></div>`
    :`<div class="d-sec"><h4>Stunden-Punkte</h4><p class="note">Noch keine Stunde bewertet. Unten auf „Stunde“ tippen und der heutigen Stunde −10 bis +10 Punkte geben.</p></div>`;
  let body;
  if(!a.n){
    body=`<div class="empty" style="margin-top:6px"><h3>Noch leer.</h3><p>Sei der Erste und bewerte ${esc(t.name)}.</p></div>${lessonBlock}`;
  } else if(!a.ok){
    body=`<div class="empty" style="margin-top:6px"><h3>Noch zu wenig.</h3><p>${a.n} von ${MIN_N} Bewertungen. Ergebnisse zeigt die Seite erst ab ${MIN_N}, damit niemand einzeln erkennbar ist.</p></div>${lessonBlock}`;
  } else {
    body=`<div class="d-score"><div class="grade big" style="--v:${a.overall.toFixed(2)}">${RING}<b>${fmt(a.overall)}</b><small>von 5</small></div><div class="ds-r">${boxes(a.overall,'lg')}<div class="cnt" style="margin:0">${a.n} Bewertung${a.n===1?'':'en'}</div></div></div>
    ${(bd.length||a.recPct!=null)?`<div class="badges-row">${a.recPct!=null?`<span class="stamp s1">${Math.round(a.recPct)} % empfehlen (${a.recN})</span>`:''}${bd.map((b,k)=>`<span class="stamp s${k%3===1?2:k%3}">${esc(b)}</span>`).join('')}</div>`:''}
    ${tagList.length?`<div class="d-sec"><h4>Tags</h4><div class="chips">${tagList.map(([id,n])=>`<span class="chip sm" style="color:var(--gr)">${esc(tagLabel(id))} · ${n}×</span>`).join('')}</div></div>`:''}
    <div class="d-sec"><h4>Profil</h4>${radarSVG([{vals:CRIT.map(c=>a.avg[c.key]),color:INK}])}</div>
    <div class="d-sec"><h4>Aufgaben im Einzelnen</h4>${CRIT.map(c=>hbar(critLabel(c),a.avg[c.key],5,fmt(a.avg[c.key]))).join('')}</div>
    ${lessonBlock}
    <div class="d-sec"><h4>Verteilung der Gesamtnoten</h4>${columns(a.dist.map((v,i)=>({label:(i+1)+'/5',value:v})),{cls:'sm'})}</div>
    ${a.n>=3?`<div class="d-sec"><h4>Entwicklung (laufender Schnitt)</h4>${trendSVG(a.rs)}</div>`:''}
    ${subs.length>1?`<div class="d-sec"><h4>Nach Fach</h4>${subs.map(s=>hbar(esc(s.s),s.v,5,fmt(s.v))).join('')}</div>`:''}
    `;
  }
  return `${sheetHead('')}
  <div class="d-hero">${avatar(t.name,'lg')}<div><h2 class="d-name">${esc(t.name)}</h2><div class="chips">${(t.subjects||[]).map(s=>`<span class="chip sm">${esc(s)}</span>`).join('')}</div></div></div>
  ${body}
  ${manage?`<div class="mgmt"><button class="lnk" style="margin:0" data-act="edit-teacher" data-id="${esc(t.id)}">Bearbeiten</button><button class="lnk danger" style="margin:0" data-act="del-teacher" data-id="${esc(t.id)}">Lehrer löschen</button></div>`:''}
  <div class="d-actions"><button class="btn primary" data-act="rate" data-id="${esc(t.id)}">${mine?'Bewertung ändern':'Jetzt bewerten'}</button><button class="btn ic" data-act="lesson" data-id="${esc(t.id)}">Stunde</button><button class="btn ic" data-act="cmp-add" data-id="${esc(t.id)}">Vergleich</button></div>`;
}

function rateHTML(tid){
  const a=S.A.get(tid); if(!a) return sheetHead('Nicht gefunden');
  const t=a.t, F=FORM, mine=myRating(tid);
  const subs=t.subjects||[];
  return `${sheetHead(`${esc(t.name)} bewerten`,'rate-cancel')}
  <p class="sub">Tippe pro Aufgabe auf das Kästchen. Deine Bewertung ist für die Klasse anonym. Nur der BOSS kann sie dir zuordnen.</p>
  ${CRIT.map(c=>`<div class="rate-row">
    <div class="rr-head"><b><span class="no">${c.no}</span>${esc(c.name)}</b><span class="rr-txt" id="rt-${c.key}">${LABELS[F[c.key]]||'offen'}</span></div>
    <p class="hint">${esc(c.hint)}</p>
    <div class="starsel">${[1,2,3,4,5].map(v=>`<button type="button" class="st ${F[c.key]>=v?'on':''}" data-act="star" data-k="${c.key}" data-v="${v}" aria-label="${v} von 5">${v}</button>`).join('')}</div>
  </div>`).join('')}
  <label class="lbl">Weiterempfehlen? (optional)</label>
  <div class="recrow"><button type="button" class="btn ${F.rec===true?'on':''}" data-act="rec" data-v="yes">Ja</button><button type="button" class="btn no ${F.rec===false?'on':''}" data-act="rec" data-v="no">Nein</button></div>
  <label class="lbl">Tags (optional, höchstens ${TAG_MAX})</label>
  <div class="chips wrapc">${TAGS.map(tg=>`<button type="button" class="chip ${F.tags.includes(tg.id)?'on':''}" data-act="tag" data-id="${tg.id}">${esc(tg.label)}</button>`).join('')}</div>
  ${subs.length>1?`<label class="lbl">Für welches Fach? (optional)</label><select id="subjectSel" class="inp"><option value="">Allgemein</option>${subs.map(s=>`<option value="${esc(s)}" ${F.subject===s?'selected':''}>${esc(s)}</option>`).join('')}</select>`:''}
  ${mine?'<div class="mgmt"><button class="lnk danger" style="margin:0" data-act="del-rating">Meine Bewertung löschen</button></div>':''}
  <div class="d-actions"><button class="btn primary" id="saveBtn" data-act="save-rating" ${CRIT.every(c=>F[c.key])?'':'disabled'}>Speichern</button></div>`;
}

function lessonHTML(){
  const a=S.A.get(FORM_L.tid); if(!a) return sheetHead('Nicht gefunden');
  const ex=myLessonToday(a.t.id), v=FORM_L.points;
  const mineAll=a.ls.filter(l=>l.userId===UID);
  return `${sheetHead('Stunde bewerten','lesson-back')}
  <p class="sub">Wie war die heutige Stunde bei <b>${esc(a.t.name)}</b>? −10 ist furchtbar, +10 ist grandios. Einmal pro Tag und Lehrer, bis Tagesende änderbar. Die Stunden-Punkte zählen ${Math.round(LESSON_W*100)} % der Gesamtnote.</p>
  <div class="lesson-val" id="lVal" style="color:${lessonColor(v)}">${fmtPts(v)}</div>
  <div class="lesson-lab" id="lLab">${lessonLabel(v)}</div>
  <div class="rw"><div class="rticks">${Array.from({length:21},(_,i)=>`<i class="${i===10?'z':''}"></i>`).join('')}</div><input type="range" class="range" id="lRange" min="-10" max="10" step="1" value="${v}" aria-label="Stunden-Punkte"></div>
  <div class="ticks"><span>−10</span><span>0</span><span>+10</span></div>
  <div class="chips presets">${[-10,-5,0,5,10].map(x=>`<button class="chip" data-act="lpreset" data-v="${x}">${fmtPts(x)}</button>`).join('')}</div>
  ${mineAll.length?`<p class="sub" style="text-align:center;margin:16px 0 0">Bisher ${mineAll.length} Stunde${mineAll.length===1?'':'n'} von dir, Ø ${fmtPts(mean(mineAll.map(l=>Number(l.points)||0)),1)}</p>`:''}
  ${ex?'<div class="mgmt" style="justify-content:center"><button class="lnk danger" style="margin:0" data-act="del-lesson">Heutige Stunde löschen</button></div>':''}
  <div class="d-actions"><button class="btn primary" data-act="save-lesson">${ex?'Änderung speichern':'Stunde speichern'}</button></div>`;
}
function updateLessonUI(){
  const v=FORM_L.points;
  const e=$('#lVal'); if(e){ e.textContent=fmtPts(v); e.style.color=lessonColor(v); }
  const l=$('#lLab'); if(l) l.textContent=lessonLabel(v);
  const r=$('#lRange'); if(r&&parseInt(r.value,10)!==v) r.value=v;
}
function lessonBack(){
  if(FORM_L&&FORM_L.from==='detail'&&S.A.has(FORM_L.tid)) openSheet('detail',FORM_L.tid); else closeSheet();
}

function teacherFormHTML(){
  const e=!!FORM_T.id;
  return `${sheetHead(e?'Lehrer bearbeiten':'Neuer Lehrer')}
  <label class="lbl">Name (nur Herr/Frau und Nachname)</label>
  <input id="tName" class="inp" maxlength="60" placeholder="z. B. Herr Müller" value="${esc(FORM_T.name)}" autocomplete="off">
  <label class="lbl">Fächer</label>
  <div class="row"><input id="tSubj" class="inp" maxlength="30" placeholder="Fach eingeben, dann Enter" autocomplete="off"><button class="btn" data-act="subj-add">+</button></div>
  <div id="tChips" class="chips" style="margin-top:12px"></div>
  <div class="actions"><button class="btn ghost" data-act="close">Abbrechen</button><button class="btn primary" data-act="save-teacher">${e?'Speichern':'Hinzufügen'}</button></div>`;
}
function renderTChips(){
  const el=$('#tChips'); if(!el) return;
  const sel=FORM_T.subjects;
  const sug=SUGGEST.filter(s=>!sel.some(x=>x.toLowerCase()===s.toLowerCase()));
  el.innerHTML=sel.map(s=>`<button class="chip on" data-act="subj-del" data-s="${esc(s)}">${esc(s)} ×</button>`).join('')
    +(sug.length?'<div class="sug-label">Vorschläge</div>':'')
    +sug.map(s=>`<button class="chip" data-act="subj-sug" data-s="${esc(s)}">${esc(s)}</button>`).join('');
}
function addSubject(raw){
  raw.split(',').map(s=>s.trim()).filter(Boolean).forEach(s=>{
    const v=s.charAt(0).toUpperCase()+s.slice(1);
    if(!FORM_T.subjects.some(x=>x.toLowerCase()===v.toLowerCase())) FORM_T.subjects.push(v);
  });
  renderTChips();
}

function requestHTML(){
  return `<h2 class="sh" style="font-family:var(--disp);font-weight:400;font-size:clamp(34px,10vw,52px);line-height:1;color:var(--ink);margin-bottom:8px;display:block">Zugang anfragen.</h2>
  <p class="sub">Diese Seite ist nur für unsere Klasse. Gib deinen Namen oder dein Kürzel ein (z. B. „LM“) und schick die Anfrage ab. Sobald der BOSS dich zulässt, kannst du loslegen. <b>Der Name lässt sich danach nicht mehr ändern.</b>${S.boss?'':' Der Name „BOSS“ ist für den Verwalter reserviert: Wer ihn zuerst nimmt, wird BOSS.'}</p>
  ${NAME_MSG?`<p class="sub" style="color:var(--red);font-weight:700">${esc(NAME_MSG)}</p>`:''}
  <input id="nameIn" class="inp" maxlength="20" placeholder="Name oder Kürzel" value="${esc(UNAME)}" autocomplete="off">
  <div class="actions"><button class="btn ghost" data-act="close">Später</button><button class="btn primary" data-act="save-name">Anfrage senden</button></div>
  <p class="sub" style="margin-top:18px">Du bist der BOSS und hast ein neues Gerät? <button class="lnk" data-act="boss-login-open">BOSS-Code eingeben</button></p>`;
}
function bossCodeHTML(){
  return `${sheetHead('BOSS-Code','close')}
  <p class="sub">Gib deinen BOSS-Code ein (40 Zeichen, Buchstaben und Ziffern, Striche und Leerzeichen sind egal). Dieses Gerät wird dann BOSS.</p>
  <textarea id="codeIn" class="inp" rows="3" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" style="font-size:14px;letter-spacing:.04em"></textarea>
  <div class="actions"><button class="btn ghost" data-act="close">Abbrechen</button><button class="btn primary" data-act="boss-login">Als BOSS anmelden</button></div>`;
}
function bossKeyHTML(){
  return `${sheetHead('Neuer BOSS-Code','close')}
  <p class="sub"><b>Speichere den Code jetzt</b> (z. B. im Passwort-Manager). Er wird nur dieses eine Mal angezeigt. Wer ihn kennt, kann BOSS werden: nicht weitergeben. Alle älteren Codes sind ab jetzt ungültig.</p>
  <pre class="code" style="white-space:pre-wrap;word-break:break-all;font-size:16px;font-weight:700;user-select:all">${esc(fmtCode(NEWCODE))}</pre>
  <div class="actions"><button class="btn ghost" data-act="close">Fertig</button><button class="btn primary" data-act="copy-bosskey">Code kopieren</button></div>`;
}
function nameHTML(){
  if(S.cloud) return requestHTML();
  const can=!!UNAME;
  return `${can?sheetHead('Anzeigename'):'<h2 class="sh" style="font-family:var(--disp);font-weight:400;font-size:clamp(36px,11vw,56px);line-height:1;color:var(--ink);margin-bottom:8px;display:block">Willkommen.</h2>'}
  <p class="sub">Wie sollen deine Bewertungen gespeichert werden? Nimm deinen Namen oder ein Kürzel, z. B. „LM“.</p>
  <input id="nameIn" class="inp" maxlength="20" placeholder="Name oder Kürzel" value="${esc(UNAME)}" autocomplete="off">
  <div class="actions">${can?'<button class="btn ghost" data-act="close">Abbrechen</button>':''}<button class="btn primary" data-act="save-name">${can?'Speichern':'Los geht’s'}</button></div>`;
}

const RULES=`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function bossPath() { return /databases/$(database)/documents/meta/boss; }
    function memberPath(uid) { return /databases/$(database)/documents/members/$(uid); }
    function devicePath(uid) { return /databases/$(database)/documents/bossDevices/$(uid); }
    function codePath(code) { return /databases/$(database)/documents/bossCodes/$(code); }
    // BOSS = Ersteller des BOSS-Dokuments ...
    function isOwnerBoss() {
      return signedIn() && exists(bossPath())
             && get(bossPath()).data.uid == request.auth.uid;
    }
    // ... oder ein Gerät, das einen noch gültigen BOSS-Code eingelöst hat
    function isCodeBoss() {
      return signedIn() && exists(devicePath(request.auth.uid))
             && exists(codePath(get(devicePath(request.auth.uid)).data.code));
    }
    function isBoss() { return isOwnerBoss() || isCodeBoss(); }
    function isApproved() {
      return signedIn() && exists(memberPath(request.auth.uid))
             && get(memberPath(request.auth.uid)).data.status == 'approved';
    }
    function isMember() { return isBoss() || isApproved(); }
    function teacherPath(id) { return /databases/$(database)/documents/teachers/$(id); }
    function stars(v) { return v is number && v >= 1 && v <= 5; }
    // Zeitstempel (Millisekunden): eine Zahl, nicht in der Zukunft; "jetzt" höchstens 2 Tage neben der Serverzeit
    function pastOk(v) { return v is number && v > 0 && v <= request.time.toMillis() + 172800000; }
    function nowOk(v) { return pastOk(v) && v >= request.time.toMillis() - 172800000; }
    // Heutiger Tag (UTC) als YYYY-MM-DD: pro Person und Lehrer nur 1 Stunden-Eintrag pro Tag möglich
    function pad(n) { return n < 10 ? '0' + string(n) : string(n); }
    function today() { return string(request.time.year()) + '-' + pad(request.time.month()) + '-' + pad(request.time.day()); }
    // Der BOSS darf an fremden Bewertungen nur das alte Feld userName entfernen
    function onlyStripsName() {
      return isBoss() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['userName']);
    }

    // Wer zuerst "BOSS" claimt, bleibt BOSS (nur einmal anlegbar)
    match /meta/boss {
      allow read: if signedIn();
      allow create: if signedIn()
                    && request.resource.data.uid == request.auth.uid
                    && request.resource.data.keys().hasOnly(['uid','name','createdAt']);
      allow update, delete: if false;
    }

    // BOSS-Codes: Der Code ist die Dokument-ID. Nur wer ihn kennt, kann ihn abrufen.
    // Auflisten und Anlegen darf nur der BOSS, ändern niemand.
    match /bossCodes/{code} {
      allow get: if signedIn();
      allow list: if isBoss();
      allow create: if isBoss()
                    && code.matches('^[A-Z2-7]{40}$')
                    && request.resource.data.keys().hasOnly(['createdAt','createdBy']);
      allow update: if false;
      allow delete: if isBoss();
    }

    // Geräte, die sich mit einem BOSS-Code angemeldet haben (nur das eigene Dokument ist lesbar)
    match /bossDevices/{uid} {
      allow get: if signedIn() && request.auth.uid == uid;
      allow list: if false;
      allow create, update: if signedIn() && request.auth.uid == uid
                    && request.resource.data.uid == uid
                    && request.resource.data.code is string
                    && request.resource.data.code.matches('^[A-Z2-7]{40}$')
                    && exists(codePath(request.resource.data.code))
                    && request.resource.data.keys().hasOnly(['uid','code','createdAt']);
      allow delete: if signedIn() && request.auth.uid == uid;
    }

    // Zugangsanfragen: jeder darf eine eigene stellen, nur der BOSS entscheidet
    match /members/{uid} {
      allow get: if signedIn() && (request.auth.uid == uid || isBoss());
      allow list: if isBoss();
      allow create: if signedIn() && request.auth.uid == uid
                    && request.resource.data.uid == uid
                    && request.resource.data.status == 'pending'
                    && request.resource.data.name is string
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.name.size() <= 20
                    && request.resource.data.name.lower() != 'boss'
                    && request.resource.data.createdAt is number
                    && request.resource.data.keys().hasOnly(['uid','name','status','createdAt']);
      allow update: if isBoss();
      allow delete: if isBoss()
                    || (signedIn() && request.auth.uid == uid && resource.data.status == 'pending');
    }

    // Lehrer: nur der BOSS darf anlegen, ändern, löschen
    match /teachers/{id} {
      allow read: if isMember();
      allow create, update: if isBoss()
                    && request.resource.data.name is string
                    && request.resource.data.name.size() <= 60
                    && request.resource.data.subjects is list
                    && request.resource.data.subjects.size() <= 10
                    && request.resource.data.keys().hasOnly(['name','subjects','createdAt','createdBy']);
      allow delete: if isBoss();
    }

    // Bewertungen: nur zugelassene Konten, jeder nur seine eigene, nur für existierende Lehrer.
    // Kein Name im Dokument: Mitglieder sehen nicht, wer was bewertet hat (nur der BOSS kann es über die Nutzer-ID zuordnen).
    match /ratings/{id} {
      allow read: if isMember();
      allow create, update: if isMember()
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.teacherId is string
                    && request.resource.data.teacherId.size() <= 40
                    && exists(teacherPath(request.resource.data.teacherId))
                    && id == request.resource.data.teacherId + '_' + request.auth.uid
                    && pastOk(request.resource.data.createdAt)
                    && nowOk(request.resource.data.updatedAt)
                    && stars(request.resource.data.f) && stars(request.resource.data.h)
                    && stars(request.resource.data.b) && stars(request.resource.data.u)
                    && stars(request.resource.data.a) && stars(request.resource.data.p)
                    && stars(request.resource.data.g)
                    && request.resource.data.tags is list
                    && request.resource.data.tags.size() <= 4
                    && request.resource.data.tags.hasOnly(['humor','streng','chaos','anschaulich','hausi','locker','schlaf','puenktlich','zeit','fordernd','buch','laut'])
                    && (request.resource.data.rec == null || request.resource.data.rec is bool)
                    && request.resource.data.subject is string
                    && request.resource.data.subject.size() <= 30
                    && request.resource.data.keys().hasOnly(['teacherId','userId','tags','rec','subject','createdAt','updatedAt','f','h','b','u','a','p','g']);
      allow update: if onlyStripsName();
      allow delete: if isMember() && (resource.data.userId == request.auth.uid || isBoss());
    }

    // Stunden-Punkte: 1 Dokument pro Tag, Lehrer und Person. Der Tag muss der heutige (UTC) sein.
    match /lessons/{id} {
      allow read: if isMember();
      allow create, update: if isMember()
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.teacherId is string
                    && request.resource.data.teacherId.size() <= 40
                    && exists(teacherPath(request.resource.data.teacherId))
                    && request.resource.data.day is string
                    && request.resource.data.day == today()
                    && id == request.resource.data.teacherId + '_' + request.auth.uid + '_' + request.resource.data.day
                    && request.resource.data.points is number
                    && request.resource.data.points >= -10 && request.resource.data.points <= 10
                    && pastOk(request.resource.data.createdAt)
                    && nowOk(request.resource.data.updatedAt)
                    && request.resource.data.keys().hasOnly(['teacherId','userId','points','day','createdAt','updatedAt']);
      allow update: if onlyStripsName();
      allow delete: if isMember() && (resource.data.userId == request.auth.uid || isBoss());
    }
  }
}`;
/* >>> HIER AUSFÜLLEN: Angaben für Impressum und Datenschutz <<< */
const LEGAL={
  name:'Maximilian Zeren',                 // dein Vor- und Nachname
  address:'',                            // optional: Straße, PLZ Ort (leer lassen, wenn du sie nicht veröffentlichen willst)
  email:'zerenmax@gmail.com'         // eine Mailadresse, über die man dich erreicht
};
function legalHTML(doc){
  const who=`${esc(LEGAL.name)}${LEGAL.address?`<br>${esc(LEGAL.address)}`:''}<br>E-Mail: ${esc(LEGAL.email)}`;
  if(doc==='impressum') return `${sheetHead('Impressum')}<div class="legal">
  <p>Diese Seite ist ein privates, nicht kommerzielles Projekt für eine geschlossene Schulklasse.</p>
  <h3>Verantwortlich</h3><p>${who}</p></div>`;
  return `${sheetHead('Datenschutz')}<div class="legal">
  <h3>Verantwortlicher</h3><p>${who}</p>
  <h3>Wer darf die Seite nutzen?</h3><p>Nur Mitglieder unserer Klasse. Jeder muss eine Zugangsanfrage stellen, der BOSS lässt Personen einzeln zu. Ohne Freigabe sind keine Bewertungen sichtbar.</p>
  <h3>Welche Daten werden verarbeitet?</h3>
  <p><b>Schüler:</b> der gewählte Name oder das Kürzel, eine anonyme Nutzer-ID (Firebase Anonymous Auth), Zeitpunkt der Anfrage und der Zulassung, deine Bewertungen und Stundenpunkte. Echte Namen sind nicht nötig, ein Kürzel reicht. Bewertungen und Stundenpunkte enthalten keinen Namen, nur die anonyme Nutzer-ID. Andere Mitglieder sehen daher nicht, von wem sie stammen. Der BOSS kann sie über die Nutzer-ID und die Mitgliederliste einer Person zuordnen.</p>
  <p><b>Lehrkräfte:</b> Anrede und Nachname (z. B. „Frau Müller“), Fächer und die Bewertungen durch die Klasse (Sterne, Stichworte, Punkte pro Stunde). Es gibt keine Freitext-Kommentare.</p>
  <h3>Zweck und Rechtsgrundlage</h3>
  <p>Die Klasse tauscht sich über den Unterricht aus und gibt anonymisiert-sachliche Rückmeldungen. Rechtsgrundlage ist unser berechtigtes Interesse an dieser Rückmeldung (Art. 6 Abs. 1 lit. f DSGVO) und bei Schülern die Anfrage selbst (Art. 6 Abs. 1 lit. b bzw. a DSGVO).</p>
  <h3>Wo liegen die Daten?</h3>
  <p>Bei Google Firebase (Firestore und Authentication), Google Ireland Ltd. bzw. Google LLC. Dabei kann eine Übermittlung in die USA stattfinden. Die Seite selbst wird über GitHub Pages ausgeliefert. Die Seite setzt keine Tracking- oder Werbe-Cookies. Dein Name wird zusätzlich lokal im Browser (localStorage) gespeichert.</p>
  <h3>Weitergabe und Dauer</h3>
  <p>Eine Weitergabe an Dritte außerhalb der Klasse und der genannten Dienstleister findet nicht statt. Die Daten bleiben gespeichert, bis die Seite abgeschaltet oder auf Wunsch gelöscht wird.</p>
  <h3>Deine Rechte</h3>
  <p>Du kannst Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch verlangen (Art. 15–21 DSGVO). Lehrkräfte können jederzeit verlangen, dass ihr Eintrag samt Bewertungen gelöscht wird. Schreib dafür an die E-Mail oben. Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</p></div>`;
}
/* Android: eigenes Überziehen für jeden Scrollbereich (Hauptseite und Fenster), kritisch gedämpfte Feder.
   iOS macht das nativ. */
(function(){
  if(!/Android/i.test(navigator.userAgent)) return;
  document.body.classList.add('android');
  const W=13;                                           // Rückfeder-Tempo, kein Nachschwingen
  let sc=null, el=null;                                 // aktueller Scrollbereich und sein Inhalt
  let x=0,v=0,anim=null,sp=null;                        // anim = laufende Feder-Animation (läuft auf dem Compositor), sp = ihre Parameter
  let y0=0,dir=0,active=false,touching=false;
  let mT=0,mV=0;
  let xs=[];                                             // letzte Verschiebungen mit Zeitstempel (für das Loslass-Tempo)
  let pinDir=0,pinMax=0;                                // Rand, an dem gerade gezogen/gefedert wird (+1 oben, -1 unten) und seine scrollTop-Grenze
  let lastTop=0,lastV=0,lastSc=null; const hist=[];
  const DIM=()=>Math.max(300,sc.clientHeight*0.8);
  const rubber=d=>{ const m=DIM(); return (1-1/((d*0.6/m)+1))*m; };
  // Auf ganze Geräte-Pixel gerundet: bei Bruchteil-Pixeln rendert der Browser Text unscharf/flimmernd, besonders im langsamen Ausklang der Feder,
  // und beim Entfernen der Verschiebung am Ende rastet das Bild sichtbar ein.
  const tr=v=>{ const r=window.devicePixelRatio||1; return v?`translate3d(0,${(Math.round(v*r)/r).toFixed(3)}px,0)`:''; };
  const draw=()=>{ if(el) el.style.transform=tr(x); };
  // Aktueller Stand der laufenden Feder (geschlossene Lösung, gleiche Formel wie die Animation)
  const cur=()=>{ if(!sp) return {x,v}; const t=Math.max(0,(performance.now()-sp.t0)/1000), e=Math.exp(-W*t); return {x:(sp.A+sp.B*t)*e, v:(sp.B-W*(sp.A+sp.B*t))*e}; };
  // Feder anhalten und den aktuellen Stand fest übernehmen (z. B. wenn der Finger sie wieder greift)
  const stop=()=>{ if(!anim) return; const c=cur(), tg=sp.target; x=c.x; v=c.v; anim.onfinish=null; anim.cancel(); anim=null; sp=null; if(tg) tg.style.transform=tr(x); };
  const reset=()=>{ stop(); x=0; v=0; draw(); };
  const findSc=t=>{ const n=t&&t.closest?t.closest('.sheet,#scroller'):null; return n; };
  const contentOf=n=>n.id==='scroller'?document.getElementById('app'):n.firstElementChild;
  const finish=()=>{ const an=anim, tg=sp&&sp.target; anim=null; sp=null; x=0; v=0; pinDir=0; if(an) an.cancel(); if(tg) tg.style.transform=''; };
  /* Das Zurückfedern läuft als Web-Animation auf dem Compositor statt per Bild-für-Bild-Schleife im Hauptthread: Es ruckelt nicht mehr,
     wenn der Hauptthread gerade beschäftigt ist (Garbage Collection, Firestore-Updates, Layout). Die Kurve ist die exakte Feder-Lösung,
     abgetastet in Schritten von 1/120 s (auf ganze Geräte-Pixel gerundet). */
  function spring(){
    stop();
    const target=el, A=x, B=v+W*x;
    if(!target||!target.animate){ x=0; v=0; pinDir=0; if(target) target.style.transform=''; return; }
    const kf=[]; let t=0;
    for(;;){
      const e=Math.exp(-W*t), xx=(A+B*t)*e, vv=(B-W*(A+B*t))*e;
      kf.push({transform:tr(xx)||'translate3d(0,0,0)'});
      if(t>=1.4||(t>0.05&&Math.abs(xx)<0.15&&Math.abs(vv)<4)) break;
      t+=1/120;
    }
    kf[kf.length-1]={transform:'translate3d(0,0,0)'};
    sp={A,B,t0:performance.now(),target};
    anim=target.animate(kf,{duration:Math.max(16,(kf.length-1)*1000/120),easing:'linear',fill:'forwards'});
    anim.onfinish=finish;
  }
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1) return;
    const n=findSc(e.target);
    if(!n||(document.body.classList.contains('lock')&&n.id==='scroller')){ touching=false; return; }
    if(el&&el!==contentOf(n)){ const o=el; reset(); o.style.transform=''; }
    sc=n; el=contentOf(n); if(!el){ touching=false; return; }
    // Eine noch laufende Feder wird nicht mehr hart auf 0 gesetzt (das war ein sichtbarer Sprung beim erneuten Antippen),
    // sie läuft weiter bzw. wird beim erneuten Ziehen nahtlos übernommen.
    touching=true; active=false; pinDir=0;
    y0=e.touches[0].clientY; mT=e.timeStamp; mV=0;
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!touching||!sc||e.touches.length!==1) return;
    const y=e.touches[0].clientY, dy=y-y0, top=sc.scrollTop, max=sc.scrollHeight-sc.clientHeight;
    if(!active){
      if((dy>0&&top<=0)||(dy<0&&top>=max-1)){
        active=true; dir=dy>0?1:-1; mT=e.timeStamp; mV=0; xs=[]; pinDir=dir; pinMax=max;
        const wasSpringing=!!anim; if(wasSpringing) x=cur().x;
        if(wasSpringing&&x*dir>0){
          // Die Feder läuft noch in dieselbe Richtung: Finger greift sie dort, wo sie gerade ist (Umkehrung der Gummiband-Kurve)
          stop(); const m=DIM(), r=Math.min(Math.abs(x)/m,0.97); y0=y-dir*(r/(1-r))*m/0.6; v=0;
        } else { stop(); y0=y; x=0; v=0; draw(); }
      }
      return;
    }
    const d=(y-y0)*dir;
    // Beim Zurückziehen würde der Browser sofort wieder nativ scrollen und die Gummiband-Bewegung verdoppeln: am Rand festhalten
    { const edge=pinDir>0?0:pinMax; if(Math.abs(sc.scrollTop-edge)>0.5) sc.scrollTop=edge; }
    if(d<=0){ active=false; pinDir=0; x=0; v=0; draw(); return; }
    const nx=dir*rubber(d), dt=Math.max(1,e.timeStamp-mT);
    mV=0.6*mV+0.4*((nx-x)/dt*1000); mT=e.timeStamp;
    x=nx; draw();
    xs.push({t:e.timeStamp,x:nx}); while(xs.length>2&&e.timeStamp-xs[0].t>120) xs.shift();
  },{passive:true});   // passiv: blockiert das native Scrollen nicht (am Rand gibt es nichts zu scrollen)
  const end=e=>{
    if(!touching) return;
    touching=false;
    if(active){
      active=false;
      // Tempo = Weg über die letzten ca. 80 ms; war der Finger vor dem Loslassen schon still (>80 ms), ist das Tempo 0
      const L=xs[xs.length-1]; v=0;
      if(L&&e.timeStamp-L.t<80){ const F=xs.find(s=>L.t-s.t<=80)||L; if(L.t-F.t>=16) v=Math.max(-4000,Math.min(4000,(L.x-F.x)/(L.t-F.t)*1000)); } if(v*x<0&&Math.abs(v)>W*Math.abs(x)) v=-W*x*0.95; spring(); }
  };
  document.addEventListener('touchend',end,{passive:true});
  document.addEventListener('touchcancel',end,{passive:true});
  document.addEventListener('scroll',e=>{
    const n=e.target;
    if(!n||!n.classList||!(n.id==='scroller'||n.classList.contains('sheet'))) return;
    const now=performance.now(), top=n.scrollTop, max=n.scrollHeight-n.clientHeight;
    if(anim&&pinDir&&!touching&&n===sc){ const edge=pinDir>0?0:pinMax; if(Math.abs(top-edge)>0.5){ n.scrollTop=edge; lastTop=edge; return; } }
    if(n!==lastSc){ lastSc=n; hist.length=0; lastTop=top; lastV=0; }
    hist.push({top,t:now}); while(hist.length>2&&now-hist[0].t>110) hist.shift();
    const h0=hist[0], vel=(top-h0.top)/Math.max(1,now-h0.t);
    const atEdge=top<=0||top>=max-1, wasEdge=lastTop<=0||lastTop>=max-1;
    if(!touching&&max>0&&atEdge&&!wasEdge&&Math.abs(lastV)>0.25){
      stop(); if(el&&el!==contentOf(n)) el.style.transform='';
      sc=n; el=contentOf(n);
      if(el){ const cap=n.clientHeight*0.12*W*Math.E; x=0; v=Math.max(-cap,Math.min(cap,-lastV*1000*0.6)); pinDir=lastV<0?1:-1; pinMax=max; spring(); }
    }
    if(hist.length>1&&Math.abs(vel)>0.02) lastV=vel;
    lastTop=top;
  },{passive:true,capture:true});
})();
function openSheet(type,id){
  if((type==='detail'||type==='rate'||type==='lesson')&&!S.A.has(id)){ toast('Lehrer nicht gefunden'); return; }
  const had=!!$('.sheet',$('#sheet-root'));
  SHEET={type,id};
  renderSheet(!had,false);
  if(had) $('.sheet',$('#sheet-root')).scrollTop=0;
}
function renderSheet(first,still){
  if(!SHEET) return;
  const root=$('#sheet-root');
  let inner='';
  switch(SHEET.type){
    case 'detail': inner=detailHTML(SHEET.id); break;
    case 'rate': inner=rateHTML(SHEET.id); break;
    case 'lesson': inner=lessonHTML(); break;
    case 'teacher': inner=teacherFormHTML(); break;
    case 'name': inner=nameHTML(); break;
    case 'legal': inner=legalHTML(SHEET.id); break;
    case 'bosscode': inner=bossCodeHTML(); break;
    case 'bosskey': inner=bossKeyHTML(); break;
  }
  const html=`<div class="si ${still?'still':''}">${inner}</div>`;
  if(first||!$('.sheet',root)){
    root.innerHTML=`<div class="backdrop" data-act="backdrop"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
    document.body.classList.add('lock');
  } else {
    $('.sheet',root).innerHTML=html;
  }
  if(SHEET.type==='teacher'){ renderTChips(); if(first) setTimeout(()=>$('#tName')?.focus(),350); }
  if(SHEET.type==='name'&&first) setTimeout(()=>$('#nameIn')?.focus(),350);
}
function closeSheet(){
  NEWCODE='';
  SHEET=null; $('#sheet-root').innerHTML=''; document.body.classList.remove('lock');
}

/* ---------- Render ---------- */
function updateMode(){
  const ab=$('#addBtn'); if(ab) ab.hidden=!canManage();
}
function renderBanner(){
  const b=$('#banner');
  const pn=pendingCount();
  const meTab=$('#tabbar [data-tab="me"]'); if(meTab){ meTab.innerHTML=`<i>4</i>Ich${pn?`<span class="bdg" aria-label="${pn} offene Anfrage${pn===1?'':'n'}">${pn}</span>`:''}`; }
  document.title=pn?`(${pn}) Lehrer-Check`:'Lehrer-Check';
  if(S.mode==='error'){ b.hidden=false; b.className='banner err'; b.innerHTML=`${esc(S.err||'Verbindungsproblem')}`; }
  else if(!S.cloud){ b.hidden=false; b.className='banner'; b.innerHTML='Lokaler Modus: Bewertungen bleiben nur auf diesem Gerät.'; }
  else if(S.ready&&!S.boss){ b.hidden=false; b.className='banner'; b.innerHTML='Noch kein BOSS. Wer sich als Erster „BOSS“ nennt, wird BOSS.'; }
  else if(pn>0){ b.hidden=false; b.className='banner'; b.innerHTML=`${pn} neue Zugangsanfrage${pn===1?'':'n'}. <button class="lnk" data-act="tab" data-tab="me">Ansehen</button>`; }
  else b.hidden=true;
}
function gateHTML(){
  const me=S.me;
  const bossLnk='<p class="sub" style="margin-top:22px">Du bist der BOSS? <button class="lnk" data-act="boss-login-open">BOSS-Code eingeben</button></p>';
  if(!me) return `${title('Zugang')}<p class="lede">Diese Seite ist nur für unsere Klasse. Schick eine Anfrage an den BOSS.</p><div class="row2" style="margin-top:16px"><button class="btn primary" data-act="open-request">Zugang anfragen</button></div>${bossLnk}`;
  if(me.status==='pending') return `${title('Warte auf','Freigabe.')}<p class="lede">Deine Anfrage als „${esc(me.name)}“ liegt beim BOSS. Sobald er dich zulässt, öffnet sich die Seite von selbst.</p><div class="row2" style="margin-top:16px"><button class="btn" data-act="withdraw">Anfrage zurückziehen</button></div>${bossLnk}`;
  return `${title('Kein','Zugang.')}<p class="lede">Der BOSS hat deine Anfrage abgelehnt oder den Zugang entzogen. Sprich ihn direkt an, wenn das ein Fehler ist.</p>${bossLnk}`;
}
function maybeOpenRequest(){
  if(S.cloud&&S.ready&&S.mode!=='error'&&!hasAccess()&&!S.me&&!S.askedName&&!SHEET){ S.askedName=true; openSheet('name'); }
}
function renderMain(anim=true){
  const v=$('#view');
  const gated=S.cloud&&S.ready&&S.mode!=='error'&&!hasAccess();
  document.body.classList.toggle('gated',gated);
  $$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.tab===S.tab));
  v.className='view'+(anim?'':' still');
  if(!S.ready){ v.innerHTML=title('Moment …')+emptyBlock('Verbinde.','Die Klassen-Datenbank wird geladen.'); return; }
  if(gated){ v.innerHTML=gateHTML(); return; }
  const fn={teachers:viewTeachers,stats:viewStats,compare:viewCompare,me:viewMe}[S.tab];
  v.innerHTML=fn();
  if(S.tab==='teachers'){ renderChips(); renderList(anim); }
}
function refreshMain(){
  if(S.tab==='teachers'&&S.ready&&$('#list')){ renderChips(); renderList(false); }
  else renderMain(false);
}
function onData(){
  computeAll(); updateMode(); renderBanner(); refreshMain();
  if(SHEET&&SHEET.type==='detail'){ if(S.A.has(SHEET.id)) renderSheet(false,true); else closeSheet(); }
  maybeOpenRequest();
  stripOldNames();
}

/* ---------- Aktionen ---------- */
const H={
  tab(el){ S.tab=el.dataset.tab; renderMain(true); $('#scroller').scrollTo({top:0,behavior:'smooth'}); },
  open(el){ openSheet('detail',el.dataset.id); },
  close(){ closeSheet(); },
  backdrop(el,e){ if(e.target!==el) return; if(nameLocked()||SHEET?.type==='bosskey') return; closeSheet(); },
  legal(el){ openSheet('legal',el.dataset.doc); },
  subj(el){ S.subj=el.dataset.s; renderChips(); renderList(true); },

  'add-teacher'(){
    if(!canManage()) return toast('Nur der BOSS darf Lehrer hinzufügen');
    FORM_T={id:null,name:'',subjects:[]}; openSheet('teacher');
  },
  'edit-teacher'(el){
    if(!canManage()) return toast('Nur der BOSS darf Lehrer bearbeiten');
    const t=S.A.get(el.dataset.id)?.t; if(!t) return;
    FORM_T={id:t.id,name:t.name,subjects:[...(t.subjects||[])]}; openSheet('teacher');
  },
  async 'del-teacher'(el){
    if(!canManage()) return toast('Nur der BOSS darf Lehrer entfernen');
    const a=S.A.get(el.dataset.id); if(!a) return;
    if(!confirm(`„${a.t.name}“ mit allen ${a.n} Bewertungen und ${a.ln} Stunden-Punkten unwiderruflich löschen?`)) return;
    try{ await api.deleteTeacher(a.t.id); closeSheet(); toast('Lehrer gelöscht'); }
    catch(err){ toast('Löschen fehlgeschlagen: '+errMsg(err)); }
  },
  'subj-add'(){ const i=$('#tSubj'); if(i&&i.value.trim()){ addSubject(i.value); i.value=''; i.focus(); } },
  'subj-sug'(el){ addSubject(el.dataset.s); },
  'subj-del'(el){ FORM_T.subjects=FORM_T.subjects.filter(x=>x!==el.dataset.s); renderTChips(); },
  async 'save-teacher'(el){
    if(!canManage()) return toast('Nur der BOSS darf Lehrer verwalten');
    const pending=$('#tSubj'); if(pending&&pending.value.trim()){ addSubject(pending.value); pending.value=''; }
    const name=($('#tName').value||'').trim().replace(/\s+/g,' ');
    if(name.length<2) return toast('Bitte einen Namen eingeben');
    if(!FORM_T.subjects.length) return toast('Bitte mindestens ein Fach hinzufügen');
    if(S.teachers.some(t=>t.id!==FORM_T.id&&t.name.toLowerCase()===name.toLowerCase())) return toast('Den Lehrer gibt es schon');
    el.disabled=true;
    try{
      if(FORM_T.id) await api.updateTeacher(FORM_T.id,{name,subjects:FORM_T.subjects});
      else await api.addTeacher({name,subjects:FORM_T.subjects});
      closeSheet(); toast(FORM_T.id?'Gespeichert':'Lehrer hinzugefügt');
    }catch(err){ el.disabled=false; toast('Speichern fehlgeschlagen: '+errMsg(err)); }
  },

  rate(el){
    const tid=el.dataset.id, m=myRating(tid);
    FORM={tid,tags:Array.isArray(m?.tags)?[...m.tags]:[],rec:typeof m?.rec==='boolean'?m.rec:null,subject:m?.subject||''};
    CRIT.forEach(c=>{ FORM[c.key]=Number(m?.[c.key])||0; });
    openSheet('rate',tid);
  },
  'rate-cancel'(){ if(FORM&&S.A.has(FORM.tid)) openSheet('detail',FORM.tid); else closeSheet(); },
  star(el){
    const k=el.dataset.k, v=parseInt(el.dataset.v,10);
    FORM[k]=v;
    $$('.st',el.parentElement).forEach(b=>b.classList.toggle('on',parseInt(b.dataset.v,10)<=v));
    const lab=$('#rt-'+k); if(lab) lab.textContent=LABELS[v];
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    const sb=$('#saveBtn'); if(sb) sb.disabled=!CRIT.every(c=>FORM[c.key]);
  },
  rec(el){
    const v=el.dataset.v==='yes';
    FORM.rec=FORM.rec===v?null:v;
    $$('.recrow .btn').forEach(b=>b.classList.toggle('on',FORM.rec!==null&&((b.dataset.v==='yes')===FORM.rec)));
  },
  tag(el){
    const id=el.dataset.id, i=FORM.tags.indexOf(id);
    if(i>=0) FORM.tags.splice(i,1);
    else { if(FORM.tags.length>=TAG_MAX) return toast(`Höchstens ${TAG_MAX} Tags`); FORM.tags.push(id); }
    el.classList.toggle('on',FORM.tags.includes(id));
  },
  async 'save-rating'(el){
    if(!CRIT.every(c=>FORM[c.key])) return toast('Bitte alle Aufgaben ankreuzen');
    FORM.subject=$('#subjectSel')?$('#subjectSel').value:(FORM.subject||'');
    el.disabled=true;
    try{
      const d={tags:FORM.tags,rec:FORM.rec,subject:FORM.subject};
      CRIT.forEach(c=>{ d[c.key]=FORM[c.key]; });
      await api.saveRating(FORM.tid,d);
      stampPop('Bewertet');
      openSheet('detail',FORM.tid);
    }catch(err){ el.disabled=false; toast('Speichern fehlgeschlagen: '+errMsg(err)); }
  },
  async 'del-rating'(){
    const m=myRating(FORM.tid); if(!m) return;
    if(!confirm('Deine Bewertung löschen?')) return;
    try{ await api.deleteRating(m.id); toast('Bewertung gelöscht'); openSheet('detail',FORM.tid); }
    catch(err){ toast('Löschen fehlgeschlagen: '+errMsg(err)); }
  },

  lesson(el){
    const tid=el.dataset.id; if(!S.A.has(tid)) return;
    const ex=myLessonToday(tid);
    FORM_L={tid,points:ex?Number(ex.points)||0:0,from:(SHEET&&SHEET.type==='detail')?'detail':'list'};
    openSheet('lesson',tid);
  },
  lpreset(el){ FORM_L.points=parseInt(el.dataset.v,10); updateLessonUI(); },
  'lesson-back'(){ lessonBack(); },
  async 'save-lesson'(el){
    el.disabled=true;
    try{
      await api.saveLesson(FORM_L.tid,FORM_L.points);
      toast(`Stunde gespeichert: ${fmtPts(FORM_L.points)}`);
      lessonBack();
    }catch(err){ el.disabled=false; toast('Speichern fehlgeschlagen: '+errMsg(err)); }
  },
  async 'del-lesson'(){
    const ex=myLessonToday(FORM_L.tid); if(!ex) return;
    try{ await api.deleteLesson(ex.id); toast('Heutige Stunde gelöscht'); lessonBack(); }
    catch(err){ toast('Löschen fehlgeschlagen: '+errMsg(err)); }
  },

  'cmp-add'(el){
    const id=el.dataset.id;
    if(!S.cmp.includes(id)){ if(S.cmp.length>=3) S.cmp.shift(); S.cmp.push(id); }
    closeSheet(); S.tab='compare'; renderMain(true); $('#scroller').scrollTo({top:0});
  },
  'cmp-toggle'(el){
    const id=el.dataset.id;
    if(S.cmp.includes(id)) S.cmp=S.cmp.filter(x=>x!==id);
    else { if(S.cmp.length>=3) return toast('Höchstens 3 Lehrer gleichzeitig'); S.cmp.push(id); }
    renderMain(true);
  },

  rename(){ if(S.cloud) return toast('Dein Name ist fest.'); NAME_MSG=''; openSheet('name'); },
  'open-request'(){ NAME_MSG=''; openSheet('name'); },
  async 'save-name'(el){
    const v=(($('#nameIn')?.value)||'').trim().replace(/\s+/g,' ');
    if(v.length<2) return toast('Mindestens 2 Zeichen bitte');
    if(!S.cloud){
      UNAME=v; ls.set('lc_name',v); NAME_MSG=''; closeSheet(); toast('Hallo '+v);
      if(S.tab==='me') renderMain(false);
      return;
    }
    if(!S.ready||!S.authed||S.mode==='error') return toast('Verbindung wird aufgebaut. Gleich noch mal versuchen.');
    if(isBoss()||S.me){ closeSheet(); return; }
    const isBossName=v.toLowerCase()==='boss';
    if(isBossName&&S.boss) return toast('Der Name BOSS ist schon vergeben');
    if(el) el.disabled=true;
    try{
      if(isBossName){ await claimBoss(); UNAME='BOSS'; ls.set('lc_name','BOSS'); closeSheet(); toast('Du bist jetzt BOSS'); }
      else { await api.requestAccess(v); UNAME=v; ls.set('lc_name',v); closeSheet(); toast('Anfrage gesendet'); }
    }catch(err){ if(el) el.disabled=false; toast('Das hat nicht geklappt: '+errMsg(err)); }
  },
  'boss-login-open'(){ openSheet('bosscode'); },
  async 'boss-login'(el){
    if(!S.cloud||!fb||!S.authed||S.mode==='error') return toast('Verbindung wird aufgebaut. Gleich noch mal versuchen.');
    const code=normCode($('#codeIn')?.value);
    if(!CODE_RE.test(code)) return toast('Der Code hat 40 Zeichen (Buchstaben A–Z, Ziffern 2–7).');
    el.disabled=true;
    try{
      await withTimeout(fb.setDoc(fb.doc(fb.db,'bossDevices',UID),{uid:UID,code,createdAt:Date.now()}));
      closeSheet(); toast('Du bist jetzt BOSS');
    }catch(err){
      el.disabled=false;
      toast(String(err?.code||err?.message||'').includes('permission')?'Code falsch oder nicht mehr gültig':'Das hat nicht geklappt: '+errMsg(err));
    }
  },
  async 'boss-newkey'(el){
    if(!isBoss()) return;
    if(!confirm('Neuen BOSS-Code erzeugen? Alle bisherigen Codes werden ungültig. Geräte, die damit angemeldet sind, verlieren den BOSS-Status.')) return;
    el.disabled=true;
    try{ NEWCODE=await rotateBossCode(); openSheet('bosskey'); }
    catch(err){ el.disabled=false; toast('Das hat nicht geklappt: '+errMsg(err)+(String(err?.code||'').includes('permission')?' (Firestore-Regeln schon aktualisiert?)':'')); }
  },
  async 'copy-bosskey'(){ try{ await navigator.clipboard.writeText(fmtCode(NEWCODE)); toast('Code kopiert'); }catch{ toast('Kopieren nicht möglich. Bitte manuell markieren.'); } },
  async withdraw(){
    if(!confirm('Anfrage zurückziehen?')) return;
    try{ await api.withdrawAccess(); S.askedName=false; toast('Anfrage zurückgezogen'); }
    catch(err){ toast('Das hat nicht geklappt: '+errMsg(err)); }
  },
  async 'mem-ok'(el){ try{ await api.setMember(el.dataset.id,'approved'); toast('Zugelassen'); }catch(err){ toast('Das hat nicht geklappt: '+errMsg(err)); } },
  async 'mem-no'(el){ try{ await api.setMember(el.dataset.id,'rejected'); toast('Abgelehnt'); }catch(err){ toast('Das hat nicht geklappt: '+errMsg(err)); } },
  async 'mem-revoke'(el){
    if(!confirm('Zugang wirklich entziehen?')) return;
    try{ await api.setMember(el.dataset.id,'rejected'); toast('Zugang entzogen'); }catch(err){ toast('Das hat nicht geklappt: '+errMsg(err)); }
  },
  async 'mem-del'(el){
    if(!confirm('Eintrag löschen? Die Person kann dann neu anfragen.')) return;
    try{ await api.deleteMember(el.dataset.id); toast('Eintrag gelöscht'); }catch(err){ toast('Das hat nicht geklappt: '+errMsg(err)); }
  },

  async 'copy-rules'(){ try{ await navigator.clipboard.writeText(RULES); toast('Regeln kopiert'); }catch{ toast('Kopieren nicht möglich. Bitte manuell markieren.'); } },

  export(){
    const who=whoMap();
    const rows=[['Lehrer','Fach',...CRIT.map(c=>c.name),'Gesamt','Tags','Weiterempfehlung',...(isBoss()?['Von']:[]),'Datum']];
    S.ratings.forEach(r=>{
      const a=S.A.get(r.teacherId); if(!a||!a.ok) return;
      const d=new Date(ts(r));
      rows.push([a.t.name,r.subject||'',...CRIT.map(c=>r[c.key]??''),fmt(ovr(r),2),(r.tags||[]).map(tagLabel).join(' | '),typeof r.rec==='boolean'?(r.rec?'ja':'nein'):'',...(isBoss()?[who(r.userId)]:[]),isNaN(d)?'':d.toISOString().slice(0,10)]);
    });
    if(rows.length<2) return toast('Noch keine Bewertungen zum Exportieren');
    download('lehrer-bewertungen.csv',rows);
  },
  'export-lessons'(){
    const who=whoMap();
    const rows=[['Lehrer','Datum','Punkte',...(isBoss()?['Von']:[])]];
    S.lessons.forEach(l=>{ const a=S.A.get(l.teacherId); if(!a||!a.lok) return; rows.push([a.t.name,l.day,l.points,...(isBoss()?[who(l.userId)]:[])]); });
    if(rows.length<2) return toast('Noch keine Stunden zum Exportieren');
    download('lehrer-stunden.csv',rows);
  },
  async share(){
    const url=location.href.split('#')[0];
    try{
      if(navigator.share) await navigator.share({title:'Lehrer-Check',url});
      else { await navigator.clipboard.writeText(url); toast('Link kopiert'); }
    }catch{}
  },
  theme(){ ls.set('lc_theme',isDark()?'light':'dark'); applyTheme(); renderMain(false); },
  design(){ ls.set('lc_design',isGlass()?'paper':'glass'); applyTheme(); renderMain(false); },
  'demo-load'(){ loadDemo(); toast('Demo-Daten geladen'); },
  'demo-clear'(){ clearDemo(); toast('Demo-Daten entfernt'); }
};
// Nutzer-ID \u2192 Name, nur f\u00fcr den BOSS (Mitgliederliste). Bewertungen selbst enthalten keinen Namen mehr.
function whoMap(){
  const m=new Map(S.members.map(x=>[x.id,x.name]));
  return uid=>(uid===UID&&isBoss())||(S.boss&&S.boss.uid===uid)?'BOSS':(m.get(uid)||'');
}
// CSV-Zelle: Texte, die mit = + - @ beginnen, w\u00fcrde Excel als Formel ausf\u00fchren. Ein vorangestelltes ' verhindert das.
function csvCell(v){
  let s=String(v??'');
  if(typeof v==='string'&&/^[=+\-@\t\r]/.test(s)) s="'"+s;
  return `"${s.replace(/"/g,'""')}"`;
}
function download(name,rows){
  const csv='\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]'); if(!el) return;
  const f=H[el.dataset.act]; if(f) f(el,e);
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='q'){ S.q=t.value; renderList(false); }
  else if(t.id==='lRange'&&FORM_L){ FORM_L.points=parseInt(t.value,10)||0; updateLessonUI(); }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='sort'){ S.sort=t.value; renderList(true); }
  else if(t.id==='subjectSel'&&FORM){ FORM.subject=t.value; }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&SHEET&&!nameLocked()&&SHEET.type!=='bosskey'){ closeSheet(); return; }
  if(e.key==='Enter'&&e.target.id==='nameIn'){ e.preventDefault(); H['save-name'](null); }
  if(e.target.id==='tSubj'&&(e.key==='Enter'||e.key===',')){ e.preventDefault(); H['subj-add'](); }
});

/* ---------- Start ---------- */
/* Glas-Design: Randdicke = genau 1 Geräte-Pixel (1 / Pixeldichte), also das Dünnste, was die Anzeige zeichnen kann.
   Wird bei Zoom oder Fenstergröße neu berechnet. Ohne dieses Skript gilt der Wert --g-line aus glass.css. */
function setHairline(){ document.documentElement.style.setProperty('--g-line',(1/(window.devicePixelRatio||1)).toFixed(3)+'px'); }
window.addEventListener('resize',setHairline);

(function init(){
  applyTheme(); setHairline();
  const cfg=getCfg();
  S.cloud=!!cfg; S.mode=cfg?'cloud':'local';
  computeAll(); updateMode(); renderBanner(); renderMain(true);
  if(cfg) startCloud(cfg); else startLocal();
  if(!S.cloud&&!UNAME) openSheet('name');
})();
