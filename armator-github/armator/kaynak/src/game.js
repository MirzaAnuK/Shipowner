/* ================= OYUN MANTIĞI ================= */
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>v<a?a:v>b?b:v;
function wpick(arr,w){let t=0;for(const x of w)t+=x;let r=Math.random()*t;for(let i=0;i<arr.length;i++){r-=w[i];if(r<=0)return arr[i];}return arr[arr.length-1];}
const N=n=>Math.round(n).toLocaleString(LOC[LI]);
const USD=n=>(n<0?'−':'')+'$'+N(Math.abs(n));
const MUSD=n=>{const a=Math.abs(n),s=n<0?'−':'';
 if(LI===2)return a>=1e8?s+'$'+(a/1e8).toFixed(2)+'亿':a>=1e5?s+'$'+(a>=1e6?Math.round(a/1e4):(a/1e4).toFixed(1))+'万':s+'$'+N(a);
 const dc=LI===0?',':'.';return a>=1e6?s+'$'+(a/1e6).toFixed(2).replace('.',dc)+(LI===0?' Mn':'M'):a>=1e5?s+'$'+Math.round(a/1e3)+(LI===0?' B':'K'):s+'$'+N(a);};
const D1=n=>{const t=(Math.round(n*10)/10).toFixed(1);return LI===0?t.replace('.',','):t;};
const PC=n=>LI===0?'%'+n:n+'%';
const LJ=a=>a.join(LI===2?'、':', ');
function fmtDate(day){const d=new Date(Date.UTC(2027,0,1)+Math.floor(day)*864e5),y=d.getUTCFullYear(),m=d.getUTCMonth(),dd=d.getUTCDate();return LI===2?y+'年'+(m+1)+'月'+dd+'日':dd+' '+MONS[LI][m]+' '+y;}
const SPD=[0,0.45,1.5,5];

const ROLES=[{k:'kap',n:'Kaptan',base:9000,d:''},{k:'zab',n:'2. Kaptan',base:6000,d:''},{k:'cb',n:'Çarkçıbaşı',base:8500,d:''},{k:'c2',n:'2. Çarkçı',base:6000,d:''},{k:'asc',n:'Aşçı',base:2200,d:''}];
const ROLE={};ROLES.forEach(r=>ROLE[r.k]=r);
const WMUL=[0,0.5,0.72,1,1.4,1.95];
const NATS=['TR','PH','UA','IN','GE','AZ','ID','CN'],NATW=[35,18,10,12,6,6,7,6];
const NAMES={
 TR:[['Ahmet','Mehmet','Hasan','Murat','Emre','Serkan','Burak','Kemal','Orhan','Tolga','Cem','Yusuf','Onur','Volkan'],['Yılmaz','Kaya','Demir','Şahin','Çelik','Aydın','Öztürk','Arslan','Koç','Kurt','Polat','Güneş','Erdem','Aksoy']],
 PH:[['Jose','Mark','Ramon','Jun','Rico','Danilo','Noel','Arnel'],['Santos','Reyes','Cruz','Bautista','Garcia','Mendoza','Ramos','Aquino']],
 UA:[['Oleksandr','Dmytro','Andriy','Serhiy','Mykola','Viktor'],['Kovalenko','Shevchenko','Bondarenko','Tkachenko','Melnyk','Boyko']],
 IN:[['Rajesh','Arjun','Vikram','Sanjay','Anil','Deepak'],['Kumar','Nair','Singh','Sharma','Menon','Patel']],
 GE:[['Giorgi','Levan','Davit','Irakli','Zurab'],['Beridze','Kapanadze','Gelashvili','Lomidze','Tsiklauri']],
 AZ:[['Elvin','Rashad','Tural','Kamran','Orkhan'],['Mammadov','Aliyev','Huseynov','Hasanov','Guliyev']],
 ID:[['Agus','Budi','Dedi','Eko','Hendra'],['Setiawan','Santoso','Wijaya','Pratama','Hidayat']],
 CN:[['Wei','Hao','Jun','Lei','Ming'],['Li','Zhang','Wang','Chen','Liu']]};
const SHIPN=['Poyraz','Lodos','Meltem','Karayel','Yıldız','Marmara','Yakamoz','Fırtına','Martı','Derya','Mavi Ufuk','Kuzey Yıldızı','Anadolu','Boğaziçi','Karadeniz','Ege','Akdeniz','Pusula','Çapa','Dalga','Rüzgâr','Sahil','Fener','Körfez','Barbaros','Piri Reis','Turgut Reis','Seydi Ali','Hızır','Umut','Zafer','Cesur','Gülnihal','Selin','Defne','Nilüfer','İnci','Mercan','Yunus','Albatros','Kılıç Ali','Çaka Bey','Gökova','Sarayburnu','Haliç'];
const CLS={
 koster:{n:'Koster',t:'dry',dwt:[2400,4200],spd:[9.5,11],cons:[5,7],rat:5,base:3.0e6,age:[18,32]},
 gcargo:{n:'Genel kargo',t:'dry',dwt:[5200,9500],spd:[11,12.5],cons:[8,12],rat:8,base:11e6,age:[14,30]},
 handy:{n:'Handysize dökme',t:'dry',dwt:[24000,38000],spd:[12.5,14],cons:[19,25],rat:13,base:16e6,age:[8,24]},
 supra:{n:'Supramax dökme',t:'dry',dwt:[50000,60000],spd:[13,14.2],cons:[26,31],rat:14,base:24e6,age:[6,20]},
 pmax:{n:'Panamax dökme',t:'dry',dwt:[72000,82000],spd:[13,14.5],cons:[30,36],rat:15,base:29e6,age:[5,18]},
 ctank:{n:'Küçük ürün tankeri',t:'tank',dwt:[3500,7500],spd:[10.5,12.5],cons:[7,11],rat:8,base:8e6,age:[14,28]},
 mr:{n:'MR tanker',t:'tank',dwt:[40000,50000],spd:[13,14.5],cons:[24,29],rat:15,base:40e6,age:[6,20]},
 afra:{n:'Aframax tanker',t:'tank',dwt:[100000,115000],spd:[13.5,15],cons:[38,46],rat:17,base:54e6,age:[5,18]}};
const KINDS={dryX:['Genel kargo','Çelik rulo','Çimento','Kereste','Hurda','Mermer','Gübre','Tahıl','Proje yükü'],dryS:['Genel kargo','Çelik rulo','Çimento','Kereste','Hurda','Mermer','Gübre','Tahıl','Proje yükü'],dryM:['Tahıl','Kömür','Gübre','Klinker','Şeker','Çelik'],dryL:['Demir cevheri','Kömür','Tahıl','Boksit'],tankS:['Motorin','Benzin','Bitkisel yağ','Kimyasal'],tankM:['Motorin','Jet yakıtı','Nafta','Benzin'],tankL:['Ham petrol','Fuel oil']};
const SZ={X:{dry:[1200,4000]},S:{dry:[4200,9500],tank:[2000,6500]},M:{dry:[18000,58000],tank:[30000,48000]},L:{dry:[62000,80000],tank:[80000,110000]}};
const REPREQ={dryX:0,dryS:0,dryM:10,dryL:30,tankS:0,tankM:30,tankL:50};
const DESTF=[0.85,0.92,1,1.12,1.25],PSC_P=[.06,.15,.3,.5,.7],PSC_T=[30,42,54,64,72];
const HOME=['IST','IZM','MER','PIR','CND','ALX'],HUBS=['IST','PIR','RTM','SIN','SHA','DXB','HOU','ALC'];

let S=null;
const SAVE_KEY='armator_v1';
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function loadSave(){try{const t=localStorage.getItem(SAVE_KEY);if(!t)return null;const o=JSON.parse(t);return o&&o.v===1&&Array.isArray(o.ships)?o:null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

/* ---------- gemi hesapları ---------- */
function shipValue(s){return CLS[s.cls].base*(ECO.dfl+(1-ECO.dfl)*Math.pow(Math.max(0,1-s.age/30),1.4))*(0.7+0.3*s.cond/100)+upgVal(s);}
function maxCond(s){return clamp(100-s.age*0.9,60,97);}
function ppCost(s){return 14*Math.pow(s.dwt,0.55);}
function sk(s,k){const p=s.crew[k];return p?Math.max(1,p.skill-(s.morale<30?1:0)):0;}
function missingRoles(s){return ROLES.filter(r=>!s.crew[r.k]).map(r=>r.n);}
function seaSpeed(s){return s.spd*(0.92+0.03*sk(s,'kap'))*(s.cond<50?0.92:1)*(up(s,'coat')?1.03:1);}
function consSea(s){return s.cons*(1.10-0.03*sk(s,'cb'))*(s.cond<70?1+(70-s.cond)/150:1)*(up(s,'prop')?0.92:1)*(up(s,'coat')?0.96:1);}
function opsDays(s,tons){return (0.8+tons/12000)*(1.4-0.12*sk(s,'zab'))*(s.type==='tank'?0.6:1)*opsMul(s);}
function wageDay(s){let t=0;for(const r of ROLES)if(s.crew[r.k])t+=s.crew[r.k].wage;return t/30;}
const ECO={fr:1.08,opx:1,szA:5.87,szE:0.25,dfl:0.22};
const szF=t=>clamp(ECO.szA*Math.pow(t,-ECO.szE),0.3,1);
function opexDay(s){return (CLS[s.cls].rat*55+150+s.dwt*0.02)*ECO.opx;}
function crewN(s){return CLS[s.cls].rat+ROLES.filter(r=>s.crew[r.k]).length;}
function fuelPrice(pid){return Math.round(620*PORT[pid].bf*S.fuelIdx);}
function fuelPx(s,pid){return Math.round(fuelPrice(pid)*(up(s,'scr')?0.9:1));}
function provRate(s){return crewN(s)*9*(0.85+PORT[s.port].st*0.06);}
function portFee(s,pid){return Math.round((1500+0.25*s.dwt)*[0.7,0.85,1,1.2,1.4][PORT[pid].st-1]*relFee(pid)/10)*10;}
function tollAmt(n,s){return Math.round((n==='Süveyş Kanalı'?8000+2.2*s.dwt:10000+2.6*s.dwt)/100)*100;}
function pscRisk(s,pid){const st=PORT[pid].st,pI=Math.min(0.92,(PSC_P[st-1]+(s.age>20?0.12:0))*relPsc(pid)),thr=PSC_T[st-1]+(s.type==='tank'?6:0),base=s.cond+(sk(s,'kap')+sk(s,'cb')-6)*3+pscB(s);
 const pDet=pI*clamp((thr-10-base+7)/14,0,1),pFail=pI*clamp((thr-base+7)/14,0,1);return {pDet,pFail,lvl:pDet>=0.25?2:(pDet>=0.05||pFail>=0.3)?1:0};}
function estimate(s,to,o){const r=route(s.port,to),sea=r.nm/(seaSpeed(s)*24),ops=o?opsDays(s,o.tons)*2:0,days=sea+ops,fuel=consSea(s)*sea+s.cons*0.08*ops;let toll=0;
 for(let i=1;i<r.path.length;i++){const tk=TOLL[r.path[i-1]+'-'+r.path[i]];if(tk)toll+=tollAmt(tk,s);}
 const fee=portFee(s,to),run=(wageDay(s)+opexDay(s)+provRate(s))*days,fuelCost=fuel*fuelPx(s,s.port),fr=o?Math.round(o.freight*frMul(s)):0,profit=fr-fuelCost-toll-fee-run;
 return {nm:r.nm,sea,ops,days,fuel,fuelCost,toll,fee,run,fr,profit,ppd:profit/Math.max(days,0.5),risk:pscRisk(s,to),path:r.path};}
function planTrip(s,to,o){const e=estimate(s,to,o);e.needFuel=e.fuel*1.12+2;e.range=e.needFuel<=s.fuelCap;e.needProv=Math.ceil(e.days+3);
 e.fuelShort=Math.max(0,Math.ceil(Math.min(s.fuelCap,e.needFuel)-s.fuel));e.provShort=Math.max(0,Math.ceil(e.needProv-s.prov));
 e.topCost=e.fuelShort*fuelPx(s,s.port)+e.provShort*provRate(s);e.miss=missingRoles(s);return e;}

/* ---------- para ---------- */
function fin(cat,x){S.fin.cur[cat]=(S.fin.cur[cat]||0)+x;}
function pay(x,cat,s){if(!(x>0))return;S.cash-=x;fin(cat,-x);if(s&&cat!=='bakım')s.vc=(s.vc||0)+x;}
function earn(x,cat){S.cash+=x;fin(cat,x);}
function fleetValue(){let t=0;for(const s of S.ships)t+=shipValue(s);return t;}
function creditLimit(){return 150000+0.25*fleetValue()+400000*((S.hq||1)-1);}
function canPay(x){return S.cash-x>=-creditLimit();}
function netWorth(){return S.cash+fleetValue();}
function level(){const w=netWorth(),i=w<3e6?0:w<10e6?1:w<30e6?2:w<80e6?3:4;return [L('Tek gemili armatör','Single-ship owner','单船船东'),L('Küçük filo sahibi','Small fleet owner','小型船队船东'),L('Büyüyen şirket','Growing company','成长中的公司'),L('Büyük armatör','Major shipowner','大型船东'),L('Denizcilik devi','Shipping giant','航运巨头')][i];}
function addRep(x){S.rep=clamp(S.rep+x,((S.hq||1)-1)*4,100);}
/* kayıt defteri: metin ya da üç dilde metin üreten kapanış */
function logMsg(t){S.log.unshift({d:Math.floor(S.day),t:LX(t)});if(S.log.length>80)S.log.length=80;}

/* ---------- yeni oyun, pazar, personel ---------- */
function newGame(name){
 S={v:1,name:(name||'').trim()||L('Yeni Denizcilik A.Ş.','New Shipping Co.','新航运公司'),cash:1.3e6,day:0,speed:0,rep:10,ships:[],market:[],mktDay:0,pool:[],poolDay:0,offers:{},fuelIdx:1,fuelDay:0,ev:[],log:[],fin:{m:0,cur:{},prev:{}},opt:{autoPause:true},nid:1,negDays:0,over:false,names:[],stat:{voy:0,cargo:0,tons:0}};
 initCorp();genMarket(true);refreshPool(true);PORTS.forEach(p=>{S.offers[p.id]=[];fillOffers(p.id);});logFounded();
}
function logFounded(){logMsg(()=>L(S.name+' kuruldu. Sermaye: '+USD(S.cash),S.name+' founded. Capital: '+USD(S.cash),S.name+'成立。资本：'+USD(S.cash)));}
function shipName(type){let n,i=0;do{n=pick(SHIPN);i++;}while(S.names.includes(n)&&i<80);S.names.push(n);return (type==='tank'?'M/T ':'M/V ')+n;}
function mkListing(ck,ports,old){ports=ports.filter(p=>portUnl(p));if(!ports.length)ports=['IST'];const c=CLS[ck],age=old?ri(Math.max(c.age[0],c.age[1]-8),c.age[1]):ri(c.age[0],c.age[1]);
 const m={id:S.nid++,cls:ck,type:c.t,dwt:Math.round(rnd(c.dwt[0],c.dwt[1])/100)*100,age,spd:Math.round(rnd(c.spd[0],c.spd[1])*10)/10,cons:Math.round(rnd(c.cons[0],c.cons[1])*2)/2,at:pick(ports)};
 m.cond=Math.round(clamp(maxCond(m)-rnd(3,16),38,96));m.name=shipName(c.t);m.price=Math.round(shipValue(m)*rnd(0.97,1.12)/1000)*1000;return m;}
function mkStarter(){const m=mkListing('koster',['IST'],false);m.age=ri(21,24);m.cond=Math.round(clamp(maxCond(m)-rnd(4,9),50,90));m.price=Math.round(shipValue(m)*1.02/1000)*1000;return m;}
function genMarket(first){S.mktDay=Math.floor(S.day);S.names=S.ships.map(s=>s.name.slice(4));const A=[];
 A.push(first?mkStarter():mkListing('koster',HOME,true),mkListing('koster',HOME),mkListing('gcargo',HOME,true),mkListing('gcargo',HOME),mkListing('ctank',HOME,true),mkListing('handy',HUBS));
 const ks=['supra','pmax','mr','afra','handy','ctank'];for(let i=0;i<3;i++)A.push(mkListing(pick(ks),HUBS));
 A.sort((a,b)=>a.price-b.price);S.market=A;}
function buyBlock(m){if(!licOk(m.cls))return 'lic';if(S.ships.length>=shipCap())return 'cap';if(!canPay(m.price))return 'cash';return '';}
function buyWhy(m){const k=buyBlock(m);return k==='lic'?L('Ruhsat yok: '+licTxt(m.cls)+' gerekli','No licence: requires '+licTxt(m.cls),'没有执照：需要'+licTxt(m.cls)):k==='cap'?L('Ofisin en fazla '+shipCap()+' gemi yönetebilir. Daha büyük binaya taşın','Your office can manage at most '+shipCap()+' ships. Move to a bigger building','你的办公室最多只能管理'+shipCap()+'艘船。请搬到更大的办公楼'):k==='cash'?L('Nakit ve kredi limitin yetmiyor','Not enough cash and credit','现金和信用额度不足'):'';}
function buyShip(lid){const i=S.market.findIndex(m=>m.id===lid);if(i<0)return null;const m=S.market[i],k=buyBlock(m);if(k){toast(k==='cash'?L('Bu gemi için nakit yetmiyor','Not enough cash for this ship','现金不足，买不起这艘船'):buyWhy(m),'','bad');return null;}
 pay(m.price,'gemi');S.market.splice(i,1);const cap=Math.round(m.cons*40/10)*10;
 const s={id:m.id,cls:m.cls,type:m.type,name:m.name,dwt:m.dwt,age:m.age,spd:m.spd,cons:m.cons,cond:m.cond,port:m.at,state:'idle',op:0,hold:0,fuel:Math.round(cap*0.15),fuelCap:cap,prov:7,crew:{},morale:70,cargo:null,voy:null,flags:{},up:{}};
 S.ships.push(s);logMsg(()=>L(s.name+' satın alındı: '+USD(m.price),s.name+' bought: '+USD(m.price),'购入'+s.name+'：'+USD(m.price)));save();return s;}
function sellShip(sid){const i=S.ships.findIndex(s=>s.id===sid);if(i<0)return;const s=S.ships[i];if(s.state!=='idle'||s.cargo)return;const v=Math.round(shipValue(s)*0.85/1000)*1000;earn(v,'gemi');S.ships.splice(i,1);
 const t=()=>L(s.name+' satıldı: '+USD(v),s.name+' sold: '+USD(v),s.name+'已售出：'+USD(v));logMsg(t);toast(t());save();}
function mkPerson(role,skill){const nat=wpick(NATS,NATW),[f,l]=NAMES[nat],fn=pick(f),ln=pick(l);
 return {id:S.nid++,role,skill,nat,name:nat==='CN'?ln+' '+fn:fn+' '+ln,exp:Math.max(0,skill*4-3+ri(0,4)),wage:Math.round(ROLE[role].base*WMUL[skill]*rnd(0.92,1.08)/50)*50,xp:0};}
const rndSkill=()=>wpick([1,2,3,4,5],[22,28,25,17,8]);
function refreshPool(first){S.poolDay=Math.floor(S.day);for(const r of ROLES){if(first){for(let k=1;k<=5;k++)S.pool.push(mkPerson(r.k,k));continue;}
  let A=S.pool.filter(p=>p.role===r.k).slice(2);const rest=S.pool.filter(p=>p.role!==r.k);while(A.length<5)A.push(mkPerson(r.k,rndSkill()));S.pool=rest.concat(A);}}
function fire(s,role){const p=s.crew[role];if(!p)return;pay(Math.round(p.wage/2),'personel');delete s.crew[role];}
function hire(s,role,pid){if(!s.port){toast(L('Personel değişimi limanda yapılır','Crew changes are made in port','只能在港口更换船员'),'','bad');return false;}const i=S.pool.findIndex(p=>p.id===pid);if(i<0)return false;
 if(s.crew[role])fire(s,role);const p=S.pool.splice(i,1)[0];s.crew[role]=p;pay(1500,'personel',s);
 if(S.pool.filter(x=>x.role===role).length<3)S.pool.push(mkPerson(role,rndSkill()));return true;}
function autoCrew(s,mode){for(const r of ROLES){if(s.crew[r.k])continue;const c=S.pool.filter(p=>p.role===r.k);if(!c.length)continue;c.sort(mode==='best'?(a,b)=>b.skill-a.skill||a.wage-b.wage:(a,b)=>a.wage-b.wage);hire(s,r.k,c[0].id);}}

/* ---------- ikmal ve bakım ---------- */
function buyFuel(s,t){t=Math.min(t,s.fuelCap-s.fuel);if(t<0.5)return 0;const c=t*fuelPx(s,s.port);if(!canPay(c)){toast(L('Yakıt için nakit yetmiyor','Not enough cash for fuel','现金不足，无法加油'),'','bad');return 0;}pay(c,'yakıt',s);s.fuel+=t;return t;}
function buyProv(s,days){days=Math.min(days,120-s.prov);if(days<=0)return 0;const c=days*provRate(s);if(!canPay(c)){toast(L('Kumanya için nakit yetmiyor','Not enough cash for provisions','现金不足，无法购买伙食'),'','bad');return 0;}pay(c,'kumanya',s);s.prov+=days;return days;}
function repairInfo(s){const lim=Math.min(80,maxCond(s)),to=Math.min(lim,s.cond+10);return {to,cost:Math.max(0,to-s.cond)*ppCost(s)*inspCf(),days:2,ok:to-s.cond>=1};}
function dockInfo(s){const P=PORT[s.port];if(!P||!P.yard)return null;const to=maxCond(s),dl=to-s.cond;return {to,cost:(Math.max(0,dl)*ppCost(s)*1.15+8000+s.dwt*0.4)*P.yard*inspCf(),days:6+Math.max(0,dl)/4,ok:dl>=2};}
function doRepair(s,dock){if(s.state!=='idle')return;const inf=dock?dockInfo(s):repairInfo(s);if(!inf||!inf.ok)return;if(!canPay(inf.cost)){toast(L('Bakım için nakit yetmiyor','Not enough cash for maintenance','现金不足，无法维修'),'','bad');return;}
 pay(inf.cost,'bakım',s);s.state='maint';s.op=inf.days;s.maintTo=inf.to;
 logMsg(()=>dock?L(s.name+' havuza alındı: '+USD(inf.cost),s.name+' entered drydock: '+USD(inf.cost),s.name+'进坞：'+USD(inf.cost)):L(s.name+' bakıma alındı: '+USD(inf.cost),s.name+' under maintenance: '+USD(inf.cost),s.name+'开始维修：'+USD(inf.cost)));s.ack=false;resume();}

/* ---------- yük teklifleri ---------- */
function mkOffer(from,type,sz){const [a,b]=SZ[sz][type],tons=Math.round(rnd(a,b)/100)*100;let cands=PORTS.filter(p=>p.id!==from&&portOpen(p.id)).map(p=>({p,d:RTc[from].dist[p.id]}));
 if(sz==='X'||sz==='S'){const near=cands.filter(c=>c.d<=(sz==='X'?2600:5500));cands=near.length>=3?near:cands.sort((x,y)=>x.d-y.d).slice(0,4);}
 const w=cands.map(c=>sz==='X'||sz==='S'?1/Math.pow(c.d+(sz==='X'?250:400),1.2):(c.d<600?0.2:1)/Math.pow(c.d+1500,0.6)),pk=wpick(cands,w),to=pk.p.id,nm=pk.d;
 const per=ECO.fr*(8+0.013*Math.min(nm,1500)+0.008*Math.max(0,nm-1500))*szF(tons)*DESTF[PORT[to].st-1]*(type==='tank'?1.3:1)*rnd(0.85,1.2)*(0.95+S.rep/600)*(0.55+0.45*S.fuelIdx)*offerMul(from,to);
 return {id:S.nid++,type,sz,kind:pick(KINDS[type+sz]),tons,from,to,nm:Math.round(nm),freight:Math.round(tons*per/100)*100,days:Math.ceil(nm/240*1.5+(0.8+tons/12000)*2.6+4),exp:S.day+rnd(8,22),rep:REPREQ[type+sz]};}
function fillOffers(pid){if(!portOpen(pid)){S.offers[pid]=[];return;}const A=S.offers[pid]=(S.offers[pid]||[]).filter(o=>o.exp>S.day),cnt=(t,z)=>A.filter(o=>o.type===t&&o.sz===z).length;
 while(cnt('dry','X')<3)A.push(mkOffer(pid,'dry','X'));while(cnt('dry','S')<2)A.push(mkOffer(pid,'dry','S'));while(cnt('tank','S')<2)A.push(mkOffer(pid,'tank','S'));
 while(A.length<10){const k=wpick(['dryX','dryS','dryM','dryL','tankS','tankM','tankL'],[14,14,24,14,10,14,10]);A.push(mkOffer(pid,k.slice(0,-1),k.slice(-1)));}}
function fits(s,o){return s.type===o.type&&o.tons<=s.dwt&&S.rep>=o.rep&&portOpen(o.to);}

/* ---------- sefer ---------- */
function depart(s,to,oid,top,by){if(s.state!=='idle'||to===s.port||!PORT[to])return false;if(!portOpen(to)){if(!by)toast(PORT[to].n+': '+portWhy(to),'','bad');return false;}let o=null;
 if(oid){o=(S.offers[s.port]||[]).find(x=>x.id===oid);if(!o){toast(L('Bu yük artık piyasada yok','This cargo is no longer on the market','这批货已不在市场上'),'','bad');return false;}}
 const p=planTrip(s,to,o);if(p.miss.length){toast(L('Personel eksik: ','Crew missing: ','缺少船员：')+LJ(p.miss),s.id,'bad');return false;}
 if(!p.range){toast(L('Bu geminin yakıt menzili bu sefere yetmiyor','This ship’s fuel range is not enough for this voyage','这艘船的燃油续航不足以完成此航次'),'','bad');return false;}
 if(top){if(!canPay(p.topCost)){toast(L('İkmal için nakit yetmiyor','Not enough cash for supplies','现金不足，无法补给'),'','bad');return false;}if(p.fuelShort>0)buyFuel(s,p.fuelShort);if(p.provShort>0)buyProv(s,p.provShort);}
 const r=route(s.port,to),cum=legs(r.path),trig=[];
 for(let i=1;i<r.path.length;i++){const tk=TOLL[r.path[i-1]+'-'+r.path[i]];if(tk)trig.push({k:'toll',at:(cum[i-1]+cum[i])/2,amt:tollAmt(tk,s),n:tk});if(r.path[i]==='GA1'&&Math.random()<0.35)trig.push({k:'pir',at:cum[i]});if(r.path[i]==='HOR'&&S.pol.cr.hormuz)trig.push({k:'war',at:cum[i]});if(r.path[i]==='BAB'&&S.pol.cr.redsea&&S.pol.cr.redsea.mode>0)trig.push({k:'red',at:cum[i],mode:S.pol.cr.redsea.mode});}
 s.voy={from:s.port,to,path:r.path,cum,nm:r.nm,done:0,trig,lastEv:S.day,t0:S.day};
 if(o){S.offers[s.port]=S.offers[s.port].filter(x=>x.id!==oid);s.cargo={kind:o.kind,tons:o.tons,freight:Math.round(o.freight*frMul(s)*(by?MNEG[by.skill-1]:1)/100)*100,by:by?by.id:0,sz:o.sz,to:o.to,from:o.from,due:S.day+o.days,claim:0,t0:S.day};s.state='load';s.op=opsDays(s,o.tons);
  const c=s.cargo;logMsg(()=>L(s.name+': '+kindN(c.kind)+' '+N(c.tons)+' t, '+PORT[c.from].n+' → '+PORT[c.to].n+', navlun '+USD(c.freight),s.name+': '+kindN(c.kind)+' '+N(c.tons)+' t, '+PORT[c.from].n+' → '+PORT[c.to].n+', freight '+USD(c.freight),s.name+'：'+kindN(c.kind)+' '+N(c.tons)+'吨，'+PORT[c.from].n+' → '+PORT[c.to].n+'，运费'+USD(c.freight)));}
 else{s.cargo=null;s.state='sea';s.port=null;logMsg(()=>L(s.name+' boş olarak '+PORT[to].n+' limanına gidiyor',s.name+' sailing in ballast to '+PORT[to].n,s.name+'空载驶往'+PORT[to].n));}
 S.stat.voy++;s.ack=false;resume();save();return true;}
function idleList(){return S.ships.filter(s=>s.state==='idle'&&!s.ack&&!managed(s));}
function resume(){if(S.speed>0)return;if(S.opt.autoPause&&idleList().length)return;S.speed=S.lastSpd||1;}
function goIdle(s,why){s.state='idle';s.op=0;s.ack=false;s.idleAt=S.day;if(managed(s)){R();return;}maintCheck(s);
 toast(L(s.name+': '+PORT[s.port].n+' limanında emir bekliyor',s.name+': awaiting orders at '+PORT[s.port].n,s.name+'：在'+PORT[s.port].n+'等待指令')+(why?L(' ('+why+')',' ('+why+')','（'+why+'）'):''),s.id,'warn');if(S.opt.autoPause)S.speed=0;R();save();}
function psc(s,P){const st=P.st;
 if(s.flags.dump){s.flags.dump=0;if(Math.random()<[.05,.1,.2,.4,.6][st-1]){const fine=Math.round((60000+s.dwt*3)/1000)*1000;pay(fine,'ceza',s);addRep(-15);addRel(P.c,-10);s.state='held';s.op=5;
   pushInfo(()=>L('MARPOL ihlali: ','MARPOL violation: ','违反MARPOL公约：')+s.name,()=>L(P.n+' liman devleti kontrolü yağ kayıt defterindeki tutarsızlığı fark etti. Ceza '+USD(fine)+', gemi 5 gün tutuldu ve şirketin itibarı ağır yara aldı.','Port State Control at '+P.n+' found inconsistencies in the oil record book. Fine '+USD(fine)+'; the ship is detained for 5 days and the company’s reputation has taken a heavy blow.',P.n+'的港口国监督检查发现油类记录簿有出入。罚款'+USD(fine)+'，船舶被滞留5天，公司声誉严重受损。'));
   logMsg(()=>L(s.name+' MARPOL ihlalinden tutuldu, ceza '+USD(fine),s.name+' detained for a MARPOL violation, fine '+USD(fine),s.name+'因违反MARPOL被滞留，罚款'+USD(fine)));return 'held';}}
 const pI=Math.min(0.92,(PSC_P[st-1]+(s.age>20?0.12:0))*relPsc(P.id));if(Math.random()>pI)return 'none';
 const thr=PSC_T[st-1]+(s.type==='tank'?6:0),score=s.cond+(sk(s,'kap')+sk(s,'cb')-6)*3+pscB(s)+rnd(-7,7);
 if(score>=thr){if(st>=4)addRep(1);if(!managed(s))toast(L(s.name+': liman devleti denetimi temiz geçti',s.name+': passed the Port State Control inspection',s.name+'：顺利通过港口国监督检查'),s.id,'ok');return 'ok';}
 if(score>=thr-10){const fine=Math.round((3000+s.dwt*0.3)*(st/3)/100)*100;pay(fine,'ceza',s);toast(L(s.name+': denetimde eksiklik bulundu, ceza '+USD(fine),s.name+': deficiencies found in inspection, fine '+USD(fine),s.name+'：检查发现缺陷，罚款'+USD(fine)),s.id,'bad');
  logMsg(()=>L(s.name+': '+P.n+' denetiminde eksiklik, ceza '+USD(fine),s.name+': deficiencies in the '+P.n+' inspection, fine '+USD(fine),s.name+'：'+P.n+'检查发现缺陷，罚款'+USD(fine)));return 'def';}
 const days=Math.round(rnd(3,8)),fine=Math.round((8000+s.dwt*0.8)*(st/3)/100)*100,to=Math.min(maxCond(s),thr);let fix=0;if(to>s.cond){fix=Math.round((to-s.cond)*ppCost(s)*1.5/100)*100;s.cond=to;}
 pay(fine,'ceza',s);pay(fix,'bakım',s);addRep(-5);addRel(P.c,-3);if(s.cargo&&s.cargo.by){const m=S.staff.find(x=>x.id===s.cargo.by);if(m)m.stat.det++;}s.state='held';s.op=days;
 pushInfo(()=>L('Gemi tutuldu: ','Ship detained: ','船舶被滞留：')+s.name,()=>L(P.n+' liman devleti kontrolü ciddi eksiklikler buldu. Gemi '+days+' gün tutulacak. Ceza '+USD(fine)+(fix?', zorunlu onarım '+USD(fix):'')+'. Bu durumdaki bir gemiyle denetimi sıkı limanlara gitmek pahalıya patlar: bakım yaptırın ya da denetimi gevşek limanlara çalışın.',
  'Port State Control at '+P.n+' found serious deficiencies. The ship will be detained for '+days+' days. Fine '+USD(fine)+(fix?', mandatory repairs '+USD(fix):'')+'. Taking a ship in this condition to strictly inspected ports is expensive: get it maintained or trade to laxer ports.',
  P.n+'的港口国监督检查发现严重缺陷。船舶将被滞留'+days+'天。罚款'+USD(fine)+(fix?'，强制修理'+USD(fix):'')+'。以这种船况前往检查严格的港口代价高昂：请先维修，或改跑检查宽松的港口。'));
 logMsg(()=>L(s.name+' '+P.n+' limanında tutuldu ('+days+' gün)',s.name+' detained at '+P.n+' ('+days+' days)',s.name+'在'+P.n+'被滞留（'+days+'天）'));return 'held';}
function arrive(s){const P=PORT[s.voy.to];s.port=P.id;s.voy=null;s.hold=0;pay(portFee(s,P.id),'liman',s);logMsg(()=>L(s.name+' '+P.n+' limanına vardı',s.name+' arrived at '+P.n,s.name+'抵达'+P.n));
 if(S.ets&&EU.includes(P.c)&&s.age>15&&!s.eco&&!up(s,'scr'))pay(Math.round(s.dwt*0.35/10)*10,'liman',s);
 if(P.c==='IR'&&S.pol.cr.hormuz)addRel('US',-2);
 if(s.morale<30&&Math.random()<0.4){const rs=ROLES.filter(r=>s.crew[r.k]);if(rs.length){const r=pick(rs),p=s.crew[r.k];delete s.crew[r.k];
  toast(L(p.name+' ('+r.n+') moral bozukluğundan istifa etti',p.name+' ('+r.n+') resigned over low morale',p.name+'（'+r.n+'）因士气低落辞职'),s.id,'bad');logMsg(()=>L(s.name+': '+r.n+' '+p.name+' istifa etti',s.name+': '+r.n+' '+p.name+' resigned',s.name+'：'+r.n+p.name+'辞职'));}}
 const res=psc(s,P);
 if(res!=='held'){if(s.cargo){s.state='disch';s.op=opsDays(s,s.cargo.tons)+(res==='def'?1:0);}else goIdle(s);}
 if(res!=='held'&&P.st===1&&Math.random()<0.06)evBribe(s,P);
 R();}
function completeCargo(s){const c=s.cargo,late=Math.max(0,S.day-c.due);let pen=0;if(late>0.5)pen=Math.min(0.4,0.02*Math.ceil(late))*c.freight;
 const cr=(c.claim||0)+(Math.random()<Math.max(0.02,0.14-0.028*sk(s,'zab'))?rnd(0.03,0.08):0),claim=cr*c.freight,net=Math.round(c.freight-pen-claim);
 earn(net,'navlun');const prof=Math.round(net-(s.vc||0));s.vc=0;addRel(PORT[c.to].c,late>0.5?-1:0.6);addRel(PORT[c.from].c,0.3);
 if(c.by){const m=S.staff.find(x=>x.id===c.by);if(m){m.stat.voy++;m.stat.profit+=prof;if(late>0.5)m.stat.late++;m.stat.hist.unshift({n:s.name,k:c.kind,f:c.from,t:c.to,p:prof});if(m.stat.hist.length>8)m.stat.hist.length=8;}}
 S.stat.cargo++;S.stat.tons+=c.tons;addRep(late>0.5?-2:({X:0.5,S:0.6,M:1,L:1.5}[c.sz]+(PORT[c.to].st>=4?0.5:0)));const gx=voyXP(c,late>0.5);c.xp=gx;
 const t=()=>L(s.name+': '+kindN(c.kind)+' teslim edildi, navlun '+USD(net)+', sefer kârı '+USD(prof)+', +'+gx+' tecrübe'+(pen>0?' (gecikme cezası '+USD(pen)+')':'')+(claim>0?' (yük hasarı '+USD(claim)+')':''),
  s.name+': '+kindN(c.kind)+' delivered, freight '+USD(net)+', voyage profit '+USD(prof)+', +'+gx+' XP'+(pen>0?' (late penalty '+USD(pen)+')':'')+(claim>0?' (cargo damage '+USD(claim)+')':''),
  s.name+'：'+kindN(c.kind)+'已交付，运费'+USD(net)+'，航次利润'+USD(prof)+'，经验+'+gx+(pen>0?'（延误罚款'+USD(pen)+'）':'')+(claim>0?'（货损'+USD(claim)+'）':''));
 if(!managed(s))toast(t(),s.id,pen>0||claim>0?'warn':'ok');logMsg(t);s.cargo=null;addXP(FLEETOF[s.cls],gx);goIdle(s);}

/* ---------- olaylar ----------
   başlık, metin ve seçenekler kapanış olarak verilir; olay kaydedilmeden önce üç dile çevrilir */
const OK3=()=>L('Tamam','OK','好的');
function evText(ev){ev.title=LX(ev.title);ev.body=LX(ev.body);ev.opts=ev.opts.map(o=>({l:LX(o.l),s:LX(o.s)}));return ev;}
function pushEv(ev){evText(ev);const a=S.auto[ev.k];
 if(a!==undefined&&ev.k!=='over'&&ev.k!=='pol'){const i=Math.min(a,ev.opts.length-1);
  if(ev.k==='info'||ev.k==='lvl'){toast(tx(ev.title),ev.sid,ev.k==='lvl'?'ok':'bad');logMsg(()=>tx(ev.title)+'. '+tx(ev.body));}
  else toast(tx(ev.title)+': '+tx(ev.opts[i].l)+L(' (otomatik)',' (automatic)','（自动）'),ev.sid);applyEv(ev,i);return;}
 S.ev.push(ev);R();}
function pushInfo(title,body){pushEv({k:'info',title,body,opts:[{l:OK3}]});}
function evBribe(s,P){const amt=Math.round((1200+s.dwt*0.05)/100)*100;pushEv({k:'bribe',sid:s.id,title:()=>L('Limanda ek ödeme talebi: ','Request for an extra payment in port: ','港口索要额外费用：')+s.name,
 body:()=>L(P.n+' limanında bir görevli, evrak işlerini “hızlandırmak” için '+USD(amt)+' istiyor. Ödenmezse işlemler ağırdan alınacak.','An official at '+P.n+' wants '+USD(amt)+' to “speed up” the paperwork. If you don’t pay, things will move slowly.',P.n+'的一名官员索要'+USD(amt)+'来“加快”办理手续。不付的话，手续会被拖延。'),d:{amt},
 opts:[{l:()=>L('Öde, iş yürüsün','Pay and keep things moving','付钱，让事情顺利进行'),s:()=>USD(amt)+L(' · gecikme olmaz · duyulursa itibar zedelenir',' · no delay · reputation suffers if it gets out',' · 不会延误 · 若传出去会损害声誉')},{l:()=>L('Reddet','Refuse','拒绝'),s:()=>L('2 gün gecikme · itibar artar','2-day delay · reputation improves','延误2天 · 声誉提升')}]});}
function evBreakdown(s){const major=Math.random()<0.15+Math.max(0,70-s.cond)/200,sev=major?2.5:1,avg=(sk(s,'cb')+sk(s,'c2'))/2,pOk=clamp(0.22+0.14*avg-(major?0.2:0),0.1,0.95),
 svc=Math.round((9000+s.dwt*0.9)*sev/100)*100,parts=Math.round((1500+s.dwt*0.1)*sev/100)*100,v=s.voy,bi=ri(0,BD3.length-1),pct=Math.floor(v.done/v.nm*100);
 s.state='broken';s.op=99;s.cond=Math.max(15,s.cond-0.5);v.lastEv=S.day;
 pushEv({k:'bd',sid:s.id,title:()=>(major?L('Ciddi arıza: ','Major breakdown: ','严重故障：'):L('Arıza: ','Breakdown: ','故障：'))+s.name,
  body:()=>BD3[bi][LI]+L('. Gemi '+PORT[v.from].n+' – '+PORT[v.to].n+' seferinde, yolun %'+pct+' noktasında sürükleniyor.','. The ship is drifting '+pct+'% of the way through the '+PORT[v.from].n+'–'+PORT[v.to].n+' voyage.','。船舶在'+PORT[v.from].n+'至'+PORT[v.to].n+'航次中、航程'+pct+'%处漂航。'),d:{pOk,svc,parts,sev,avg},
  opts:[{l:()=>L('Kendi mürettebatım tamir etsin','Let my crew fix it','让我的船员自己修'),s:()=>L('Parça ','Parts ','零件')+USD(parts)+L(' · başarı ihtimali ',' · chance of success ',' · 成功率')+PC(Math.round(pOk*100))},
   {l:()=>L('Servis çağır','Call a service team','叫维修服务'),s:()=>USD(svc)+' · '+D1(1.5*sev)+L(' gün · garantili',' days · guaranteed','天 · 保证修好')}]});}
function evStorm(s){const v=s.voy;v.lastStorm=S.day;v.lastEv=S.day;const pOk=clamp(0.3+0.13*sk(s,'kap')+(up(s,'nav')?0.2:0),0.2,0.97),delay=Math.round(rnd(0.8,2)*10)/10,kn=s.crew.kap?s.crew.kap.name:'';
 pushEv({k:'storm',sid:s.id,title:()=>L('Fırtına uyarısı: ','Storm warning: ','风暴预警：')+s.name,body:()=>L('Rota üzerinde 9 bofor fırtına bekleniyor. Kaptan '+(kn?kn+' ':'')+'talimat bekliyor.','A force 9 gale is forecast on the route. '+(kn?'Captain '+kn:'The captain')+' is waiting for instructions.','航线上预计有9级大风。船长'+kn+'正在等待指示。'),d:{pOk,delay},
  opts:[{l:()=>L('Rotayı değiştir','Change course','改变航线'),s:()=>L('+'+D1(delay)+' gün gecikme · güvenli','+'+D1(delay)+' days delay · safe','延误'+D1(delay)+'天 · 安全')},{l:()=>L('Rotada kal','Stay on course','保持航线'),s:()=>L('%'+Math.round(pOk*100)+' ihtimalle sorunsuz · aksi halde hasar',Math.round(pOk*100)+'% chance of no trouble · otherwise damage',Math.round(pOk*100)+'%的概率平安无事 · 否则会受损')}]});}
function evBilge(s){s.voy.lastEv=S.day;const slop=Math.round((2500+s.dwt*0.15)/100)*100,pFix=clamp(0.2+0.15*sk(s,'c2'),0.2,0.95);
 pushEv({k:'bilge',sid:s.id,title:()=>L('Sintine tankı dolu: ','Bilge tank full: ','舱底水舱已满：')+s.name,body:()=>L('Yağlı su ayırıcı (OWS) 15 ppm alarmı veriyor, deşarj yapılamıyor. Çarkçıbaşı ne yapılacağını soruyor.','The oily water separator (OWS) is giving a 15 ppm alarm, so nothing can be discharged. The chief engineer asks what to do.','油水分离器（OWS）发出15 ppm报警，无法排放。轮机长询问该怎么办。'),d:{slop,pFix},
  opts:[{l:()=>L('Limanda slop tesisine ver','Hand it to a port slop facility','在港口交给污油接收设施'),s:()=>USD(slop)+L(' · sorunsuz',' · no trouble',' · 没有问题')},{l:()=>L('2. Çarkçı OWS’yi onarsın','Have the second engineer repair the OWS','让大管轮修理油水分离器'),s:()=>L('%'+Math.round(pFix*100)+' başarı · olmazsa slop ücreti ve gecikme',Math.round(pFix*100)+'% success · if not, slop fee and delay','成功率'+Math.round(pFix*100)+'% · 失败则需付污油费并延误')},{l:()=>L('Gece denize bastır','Pump it overboard at night','夜里偷排入海'),s:()=>L('Bedava · yakalanırsan ağır ceza ve tutulma','Free · if caught: heavy fine and detention','免费 · 一旦被抓：重罚并滞留')}]});}
function evPirate(s){s.voy.lastEv=S.day;const cost=Math.round((22000+s.dwt*0.15)/1000)*1000,sec=up(s,'sec');
 pushEv({k:'pir',sid:s.id,title:()=>L('Aden Körfezi: ','Gulf of Aden: ','亚丁湾：')+s.name,body:()=>L('Gemi yüksek riskli bölgeye giriyor. Son haftalarda şüpheli tekneler rapor edildi.','The ship is entering a high-risk area. Suspicious boats have been reported in recent weeks.','船舶正在进入高风险海域。最近几周有可疑小艇的报告。'),d:{cost},
  opts:[{l:()=>L('Silahlı güvenlik ekibi al','Hire an armed security team','雇用武装安保队'),s:()=>USD(cost)+L(' · güvenli geçiş',' · safe passage',' · 安全通过')},{l:()=>L('Korumasız geç','Go through unprotected','不设防通过'),s:()=>sec?L('Güvenlik paketi var · saldırı ihtimali çok düşük','Security package fitted · an attack is very unlikely','已加装安保设施 · 遇袭概率很低'):L('Saldırı ihtimali düşük ama sonucu ağır','An attack is unlikely, but costly if it happens','遇袭概率低，但后果严重')}]});}
function evNoFuel(s){const q=Math.round(s.fuelCap*0.25),cost=Math.round(q*620*S.fuelIdx*3/100)*100;
 pushEv({k:'nofuel',sid:s.id,title:()=>L('Yakıt bitti: ','Out of fuel: ','燃油耗尽：')+s.name,body:()=>L('Gemi açık denizde yakıtsız kaldı ve sürükleniyor. Tek çare denizde acil ikmal.','The ship has run out of fuel at sea and is drifting. The only option is an emergency bunker delivery at sea.','船舶在海上燃油耗尽，正在漂航。唯一的办法是海上紧急加油。'),d:{q,cost},
  opts:[{l:()=>L('Acil yakıt ikmali iste','Request emergency bunkers','申请紧急加油'),s:()=>USD(cost)+' · '+q+L(' t · 2 gün kayıp',' t · 2 days lost','吨 · 损失2天')}]});}
function resolveEv(i){const ev=S.ev.shift();if(!ev)return;if(applyEv(ev,i))return;R();save();}
function applyEv(ev,i){const s=S.ships.find(x=>x.id===ev.sid),d=ev.d||{};
 switch(ev.k){
 case 'bd':if(i===0){pay(d.parts,'bakım',s);if(Math.random()<d.pOk){s.op=(2.4-0.3*d.avg)*(d.sev>1?1.6:1);toast(L(s.name+': mürettebat arızayı kendi giderdi, '+D1(s.op)+' gün',s.name+': the crew fixed the breakdown themselves, '+D1(s.op)+' days',s.name+'：船员自行排除了故障，用时'+D1(s.op)+'天'),s.id,'ok');}
   else{s.op=1.5+1.5*d.sev;const c=Math.round(d.svc*1.3),op=s.op;pay(c,'bakım',s);s.cond=Math.max(15,s.cond-2);
    pushInfo(()=>L('Tamir başarısız: ','Repair failed: ','修理失败：')+s.name,()=>L('Mürettebat arızayı gideremedi ve servis çağırmak zorunda kaldı. Servis '+USD(c)+', toplam '+D1(op)+' gün kayıp. Daha tecrübeli çarkçılar bu işi gemide çözebilirdi.','The crew could not fix the breakdown and a service team had to be called. Service '+USD(c)+', '+D1(op)+' days lost in total. More experienced engineers could have solved it on board.','船员未能排除故障，只好叫来维修服务。服务费'+USD(c)+'，共损失'+D1(op)+'天。更有经验的轮机员本可以在船上解决。'));}}
  else{pay(d.svc,'bakım',s);s.op=1.5*d.sev;}logMsg(()=>L(s.name+' seyirde arıza yaptı',s.name+' broke down at sea',s.name+'在航行中发生故障'));break;
 case 'storm':if(i===0){s.hold=d.delay;}else if(Math.random()<d.pOk){toast(L(s.name+' fırtınayı sorunsuz atlattı',s.name+' rode out the storm without trouble',s.name+'平安度过了风暴'),s.id,'ok');}
  else{const dm=ri(3,7),cg=!!s.cargo;s.cond=Math.max(15,s.cond-dm);s.morale=Math.max(0,s.morale-10);s.hold=0.5;if(cg)s.cargo.claim+=0.04;
   toast(L(s.name+' fırtınada hasar aldı'+(cg?', yük de zarar gördü':''),s.name+' was damaged in the storm'+(cg?', and so was the cargo':''),s.name+'在风暴中受损'+(cg?'，货物也受损':'')),s.id,'bad');logMsg(()=>L(s.name+' fırtınada hasar aldı',s.name+' was damaged in a storm',s.name+'在风暴中受损'));}break;
 case 'bilge':if(i===0){pay(d.slop,'liman',s);}else if(i===1){if(Math.random()<d.pFix){toast(L(s.name+': 2. Çarkçı OWS’yi onardı',s.name+': the second engineer repaired the OWS',s.name+'：大管轮修好了油水分离器'),s.id,'ok');}
  else{pay(d.slop,'liman',s);s.hold=0.3;toast(L(s.name+': OWS onarılamadı, slop limana verilecek ('+USD(d.slop)+')',s.name+': the OWS could not be repaired, the slop goes ashore ('+USD(d.slop)+')',s.name+'：油水分离器没修好，污油将交给港口（'+USD(d.slop)+'）'),s.id,'warn');}}
  else{s.flags.dump=1;s.morale=Math.max(0,s.morale-5);}break;
 case 'pir':if(i===0){pay(d.cost,'işletme',s);toast(L(s.name+' Aden Körfezi’ni korumayla geçti',s.name+' crossed the Gulf of Aden under guard',s.name+'在护卫下通过了亚丁湾'),s.id,'ok');}
  else if(Math.random()<0.12*(up(s,'sec')?0.3:1)){if(Math.random()<0.3+0.12*sk(s,'kap')){toast(L(s.name+': korsan teknesi yaklaştı, kaptan manevrayla kurtardı',s.name+': a pirate skiff approached, the captain manoeuvred away',s.name+'：海盗小艇逼近，船长机动摆脱'),s.id,'warn');}
   else{const r=Math.round(clamp(shipValue(s)*0.08,40000,400000)/1000)*1000;pay(r,'ceza',s);s.hold=6;s.morale=Math.max(0,s.morale-25);addRep(-1);
    pushInfo(()=>L('Korsan saldırısı: ','Pirate attack: ','海盗袭击：')+s.name,()=>L('Gemi korsanların eline geçti. Fidye '+USD(r)+' ödendi, gemi 6 gün kaybetti ve mürettebatın morali çöktü.','Pirates seized the ship. A ransom of '+USD(r)+' was paid, the ship lost 6 days and crew morale collapsed.','船舶被海盗劫持。支付了'+USD(r)+'赎金，船舶损失6天，船员士气崩溃。'));
    logMsg(()=>L(s.name+' korsan saldırısına uğradı',s.name+' was attacked by pirates',s.name+'遭到海盗袭击'));}}
  else toast(L(s.name+' bölgeyi olaysız geçti',s.name+' crossed the area without incident',s.name+'平安通过该海域'),s.id);break;
 case 'nofuel':pay(d.cost,'yakıt',s);s.fuel+=d.q;s.hold=2;addRep(-2);logMsg(()=>L(s.name+' denizde yakıtsız kaldı',s.name+' ran out of fuel at sea',s.name+'在海上燃油耗尽'));break;
 case 'lvl':break;
 case 'over':S=null;clearSave();showIntro();return true;
 case 'maint':if(s){s.askMaint=0;if(i===0)doRepair(s,d.dock);else s.maintSkip=S.day+25;}break;
 case 'bribe':if(i===0){pay(d.amt,'liman',s);if(Math.random()<0.05){addRep(-4);toast(L('Ödeme basına sızdı, şirketin itibarı zedelendi','The payment leaked to the press and damaged the company’s reputation','这笔付款被媒体曝光，公司声誉受损'),s.id,'bad');}}else{if(s.state==='disch')s.op+=2;addRep(0.5);}break;
 case 'pol':POL[ev.id].run(i,ev.c);logMsg(()=>tx(ev.title)+': '+tx(ev.opts[i].l));break;
 }
 return false;}

/* ---------- zaman ---------- */
function pBreak(s){return (0.0015+0.0007*Math.pow(Math.max(0,85-s.cond),1.15))*(1.6-0.22*sk(s,'cb'))*(inspector()?IBF[inspector().skill-1]:1)*(up(s,'eng')?0.65:1);}
function seaStep(s,d){const v=s.voy;
 if(s.fuel<=0){evNoFuel(s);return;}
 if(s.hold>0){s.hold-=d;s.fuel=Math.max(0,s.fuel-consSea(s)*0.5*d);return;}
 v.done+=seaSpeed(s)*24*d;s.fuel=Math.max(0,s.fuel-consSea(s)*d);
 const c0=s.cond;s.cond=Math.max(15,s.cond-0.08*(1+s.age/20)*(1.3-0.1*sk(s,'c2'))*(up(s,'eng')?0.8:1)*d);
 if(c0>=50&&s.cond<50&&!managed(s))toast(L(s.name+' yıpranıyor: durum %50 altına indi, ilk limanda bakım yaptır',s.name+' is wearing out: condition is below 50%, get maintenance at the next port',s.name+'磨损加剧：船况低于50%，请在下一个港口维修'),s.id,'warn');
 for(const r of ROLES){const p=s.crew[r.k];if(!p)continue;p.xp=(p.xp||0)+d;if(p.skill<5&&p.xp>=120*p.skill){p.xp=0;p.skill++;p.wage=Math.round(p.wage*1.15/50)*50;toast(L(p.name+' ('+r.n+') tecrübe kazandı',p.name+' ('+r.n+') gained experience',p.name+'（'+r.n+'）经验提升'),s.id,'ok');R();}}
 for(const t of v.trig){if(t.x||v.done<t.at)continue;t.x=1;
  if(t.k==='toll'){pay(t.amt,'kanal',s);logMsg(()=>L(s.name+': '+tollN(t.n)+' geçişi '+USD(t.amt),s.name+': '+tollN(t.n)+' transit '+USD(t.amt),s.name+'：'+tollN(t.n)+'通行费'+USD(t.amt)));}
  else if(t.k==='war'){const a=Math.round((5000+0.6*s.dwt)/100)*100;pay(a,'kanal',s);logMsg(()=>L(s.name+': Hürmüz savaş riski primi '+USD(a),s.name+': Hormuz war-risk premium '+USD(a),s.name+'：霍尔木兹战争险附加费'+USD(a)));
   if(rel('IR')<30&&Math.random()<0.08){s.hold=4;toast(L(s.name+' Hürmüz’de denetim için durduruldu, 4 gün kayıp',s.name+' was stopped for inspection in Hormuz, 4 days lost',s.name+'在霍尔木兹被拦下检查，损失4天'),s.id,'bad');logMsg(()=>L(s.name+' Hürmüz’de durduruldu',s.name+' was stopped in Hormuz',s.name+'在霍尔木兹被拦截'));}}
  else if(t.k==='red'){if(t.mode===1){const a=Math.round((18000+0.2*s.dwt)/100)*100;pay(a,'kanal',s);logMsg(()=>L(s.name+': Kızıldeniz koruma ve sigorta '+USD(a),s.name+': Red Sea escort and insurance '+USD(a),s.name+'：红海护航和保险'+USD(a)));}
   else if(Math.random()<0.1*(up(s,'sec')?0.5:1)){const c=Math.round((30000+s.dwt*0.8)/1000)*1000;pay(c,'bakım',s);s.cond=Math.max(15,s.cond-12);s.hold=4;s.morale=Math.max(0,s.morale-20);
    pushInfo(()=>L('Saldırı: ','Attack: ','遇袭：')+s.name,()=>L('Gemi Kızıldeniz’in güneyinde saldırıya uğradı. Hasar onarımı '+USD(c)+', 4 gün kayıp. Mürettebat sarsıldı.','The ship was attacked in the southern Red Sea. Damage repairs '+USD(c)+', 4 days lost. The crew is shaken.','船舶在红海南部遭到袭击。损坏修理'+USD(c)+'，损失4天。船员受到惊吓。'));
    logMsg(()=>L(s.name+' Kızıldeniz’de saldırıya uğradı',s.name+' was attacked in the Red Sea',s.name+'在红海遭到袭击'));}}
  else{evPirate(s);return;}}
 if(v.done>=v.nm){arrive(s);return;}
 if(S.day-v.lastEv<1.5)return;
 if(Math.random()<pBreak(s)*d){evBreakdown(s);return;}
 if(S.day-(v.lastStorm||-99)>6&&Math.random()<0.012*d){evStorm(s);return;}
 if(!v.bilge&&Math.random()<0.004*(s.age>20?2:1)*d){v.bilge=1;evBilge(s);}
}
function tickShip(s,d){
 pay(wageDay(s)*d,'personel',s);pay(opexDay(s)*d,'işletme',s);s.age+=d/365;s.prov=Math.max(0,s.prov-d);
 const tgt=clamp(35+13*(s.crew.asc?s.crew.asc.skill:0)+(up(s,'hab')?12:0)-(s.prov<=0?45:0),5,100);s.morale+=clamp(tgt-s.morale,-6*d,4*d);
 switch(s.state){
  case 'idle':s.fuel=Math.max(0,s.fuel-s.cons*0.03*d);s.cond=Math.max(15,s.cond-0.015*d);break;
  case 'load':s.fuel=Math.max(0,s.fuel-s.cons*0.08*d);s.op-=d;if(s.op<=0){s.state='sea';s.port=null;s.voy.lastEv=S.day;R();}break;
  case 'disch':s.fuel=Math.max(0,s.fuel-s.cons*0.08*d);s.op-=d;if(s.op<=0)completeCargo(s);break;
  case 'maint':s.op-=d;if(s.op<=0){s.cond=Math.max(s.cond,s.maintTo);s.vc=0;const w=finishWork(s);goIdle(s,w||L('bakım bitti','maintenance done','维修完成'));}break;
  case 'held':s.op-=d;if(s.op<=0){if(s.cargo){s.state='disch';s.op=opsDays(s,s.cargo.tons);toast(L(s.name+' serbest bırakıldı, tahliye başladı',s.name+' released, discharge started',s.name+'已获释放，开始卸货'),s.id);R();}else goIdle(s,L('serbest bırakıldı','released','已获释放'));}break;
  case 'broken':s.fuel=Math.max(0,s.fuel-s.cons*0.1*d);s.op-=d;if(s.op<=0){s.state='sea';s.voy.lastEv=S.day;if(!managed(s))toast(L(s.name+' tamir edildi, yola devam ediyor',s.name+' repaired, continuing the voyage',s.name+'已修好，继续航行'),s.id,'ok');R();}break;
  case 'sea':seaStep(s,d);break;
 }}
function newDay(){const day=Math.floor(S.day);
 PORTS.forEach(p=>fillOffers(p.id));corpDay(day);
 if(day-S.fuelDay>=10){S.fuelDay=day;S.fuelIdx=clamp(S.fuelIdx*rnd(0.93,1.08),0.75,1.35);}
 if(day-S.mktDay>=45){genMarket();toast(L('Gemi pazarına yeni ilanlar geldi','New listings in the ship market','船舶市场有新挂牌'));R();}
 if(day-S.poolDay>=30)refreshPool();
 const m=Math.floor(day/30);if(m!==S.fin.m){S.fin.prev=S.fin.cur;S.fin.cur={};S.fin.m=m;}
 if(S.cash<-creditLimit()){S.negDays++;if(S.negDays===1)toast(L('Kredi limiti aşıldı. 20 gün içinde toparlanamazsan şirket batar.','Credit limit exceeded. If you can’t recover within 20 days, the company goes bankrupt.','已超出信用额度。如果20天内无法扭转，公司将破产。'),'','bad');
  if(S.negDays>=20){S.over=true;S.speed=0;const nm=S.name,dy=S.day,cg=S.stat.cargo,tn=S.stat.tons;
   pushEv({k:'over',title:()=>L('Şirket battı','The company went bankrupt','公司破产'),body:()=>L(nm+' borçlarını ödeyemedi ve '+fmtDate(dy)+' tarihinde iflas etti. '+cg+' yük taşıdın, '+N(tn)+' ton.',nm+' could not pay its debts and went bankrupt on '+fmtDate(dy)+'. You carried '+cg+' cargoes, '+N(tn)+' tonnes.',nm+'无力偿还债务，于'+fmtDate(dy)+'破产。你共运输了'+cg+'批货物，'+N(tn)+'吨。'),opts:[{l:()=>L('Yeni şirket kur','Start a new company','创办新公司')}]});}}
 else S.negDays=0;
 if(day%5===0)save();
}
function tick(d){const d0=Math.floor(S.day);S.day+=d;for(const s of S.ships.slice())tickShip(s,d);if(!S.ev.length)autoRun();if(S.cash<0)S.cash+=S.cash*0.12/365*d;if(Math.floor(S.day)!==d0)newDay();}
