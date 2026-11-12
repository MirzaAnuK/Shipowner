/* ================= DERİNLİK 2: yeni inşa ve hurda, hava ve mevsimler, liman kuyruğu ve demuraj ================= */

function initDeep2(){S.nb=S.nb||[];if(S.nbIdx===undefined)S.nbIdx=1;if(S.steel===undefined)S.steel=rnd(420,520);S.wx=S.wx||[];S.cong=S.cong||{};S.strike=S.strike||{};
 PORTS.forEach(p=>{if(S.cong[p.id]===undefined)S.cong[p.id]=congBase(p.id)*rnd(0.6,1.2);});}

/* ---------- yeni inşa ---------- */
const YARDS=[
 {k:'tuz',n:['Tuzla tersanesi','Tuzla shipyard','图兹拉船厂'],port:'IST',pf:1.04,mo:15,q:0,lv:1,cls:['koster','gcargo','ctank','feeder','handy']},
 {k:'shg',n:['Şanghay tersanesi','Shanghai shipyard','上海船厂'],port:'SHA',pf:0.9,mo:22,q:-1,lv:3,cls:['gcargo','handy','supra','pmax','ctank','mr','afra','feeder','cbox','pctc']},
 {k:'uls',n:['Ulsan tersanesi','Ulsan shipyard','蔚山船厂'],port:'PUS',pf:1.06,mo:19,q:1,lv:4,cls:['supra','pmax','mr','afra','cbox','pctc','lng']},
 {k:'nag',n:['Nagasaki tersanesi','Nagasaki shipyard','长崎船厂'],port:'YOK',pf:1.14,mo:17,q:2,lv:5,cls:['handy','supra','pmax','pctc','lng']}];
const YARD=k=>YARDS.find(y=>y.k===k);
const NBOPT={eco:0.06,scr:0.03,imo:0.005,lngf:0.12};
function nbPrice(y,cls,o){let f=1;for(const k in NBOPT)if(o&&o[k])f+=NBOPT[k];return Math.round(CLS[cls].base*1.12*y.pf*f*S.nbIdx/10000)*10000;}
function nbDays(y,cls){const big=CLS[cls].base>=30e6?1.12:CLS[cls].base<10e6?0.75:1;return Math.round(y.mo*30*big);}
function nbWhy(y,cls){if(coLv()<y.lv)return L('şirket seviyesi '+y.lv+' gerekli','company level '+y.lv+' required','需要公司等级'+y.lv);if(!licOk(cls))return L('ruhsat yok: ','no licence: ','没有执照：')+licTxt(cls);
 if(S.ships.length+S.nb.length>=shipCap())return L('ofis kapasitesi dolu (siparişler de sayılır)','office capacity is full (orders count too)','办公室容量已满（订单也计入）');return '';}
function nbOrder(yk,cls,o,name){const y=YARD(yk),w=nbWhy(y,cls);if(w){toast(w,'','bad');return null;}S.done.nbDone=1;const price=nbPrice(y,cls,o),dep=Math.round(price*0.2);
 if(!canPay(dep)){toast(L('Peşinat için nakit yetmiyor','Not enough cash for the down payment','现金不足以支付首付'),'','bad');return null;}
 const type=CLS[cls].t,nm=(name||'').replace(/\s+/g,' ').trim().slice(0,22),days=nbDays(y,cls)+ri(-10,25);
 pay(dep,'gemi');const n={id:S.nid++,yard:yk,cls,type,o:{eco:!!(o&&o.eco),scr:!!(o&&o.scr),imo:!!(o&&o.imo&&type==='box'),lngf:!!(o&&o.lngf)},name:nm.length>=2?shipPre(type)+nm:shipName(type),price,paid:dep,t0:Math.floor(S.day),due:Math.floor(S.day)+days,half:0};S.nb.push(n);
 logMsg(()=>L(n.name+' siparişi verildi: '+tx(y.n)+', '+CLS[cls].n+', '+USD(price)+' (peşinat '+USD(dep)+'), teslim '+fmtDate(n.due),'Ordered '+n.name+': '+tx(y.n)+', '+CLS[cls].n+', '+USD(price)+' (down payment '+USD(dep)+'), delivery '+fmtDate(n.due),'订造'+n.name+'：'+tx(y.n)+'，'+CLS[cls].n+'，'+USD(price)+'（首付'+USD(dep)+'），交船'+fmtDate(n.due)));
 toast(L('Sipariş verildi: ','Order placed: ','已下单：')+n.name,'','ok');save();return n;}
function nbCancel(id){const i=S.nb.findIndex(n=>n.id===id);if(i<0)return;const n=S.nb[i];S.nb.splice(i,1);addRep(-2);const p=n.paid;
 logMsg(()=>L(n.name+' siparişi iptal edildi, ödenen '+USD(p)+' yandı',n.name+' order cancelled; the '+USD(p)+' already paid is lost',n.name+'订单已取消，已付的'+USD(p)+'无法退还'));save();}
function nbDay(day){for(const n of S.nb.slice()){const y=YARD(n.yard),tot=n.due-n.t0;
 if(!n.half&&day>=n.t0+tot/2){n.half=1;const a=Math.round(n.price*0.3);pay(a,'gemi');n.paid+=a;
  logMsg(()=>L(n.name+' denize indirildi; ikinci taksit '+USD(a),n.name+' has been launched; second instalment '+USD(a),n.name+'已下水；支付第二期'+USD(a)));toast(L(n.name+' denize indirildi',n.name+' launched',n.name+'已下水'),'','ok');
  if(Math.random()<0.25){const dl=ri(20,60);n.due+=dl;pushInfo(()=>L('Tersane gecikmesi: ','Shipyard delay: ','船厂延误：')+n.name,()=>L(tx(y.n)+' ana makine tedarikindeki sorun yüzünden teslimin '+dl+' gün gecikeceğini bildirdi. Yeni teslim tarihi '+fmtDate(n.due)+'.',tx(y.n)+' reports that a problem with the main engine supply will delay delivery by '+dl+' days. New delivery date '+fmtDate(n.due)+'.',tx(y.n)+'通知，由于主机供货问题，交船将推迟'+dl+'天。新的交船日期为'+fmtDate(n.due)+'。'));}}
 if(day>=n.due)nbDeliver(n);}}
function nbDeliver(n){const y=YARD(n.yard),c=CLS[n.cls],rest=n.price-n.paid,q=y.q;
 const m={id:n.id,cls:n.cls,type:n.type,name:n.name,dwt:Math.round(rnd(c.dwt[0]+(c.dwt[1]-c.dwt[0])*0.6,c.dwt[1])/100)*100,age:0,spd:Math.round(c.spd[1]*(1+0.01*q)*10)/10,cons:Math.round(c.cons[0]*(1-0.025*q)*(n.o.eco?0.88:1)*2)/2,cond:97,at:y.port};
 S.nb.splice(S.nb.indexOf(n),1);const s=shipFrom(m);s.up=s.up||{};if(n.o.scr)s.up.scr=1;if(n.o.imo)s.up.imo=1;if(n.o.eco)s.eco=1;if(n.o.lngf)s.lngf=1;s.prov=20;s.fuel=Math.round(s.fuelCap*0.5);
 let loan=0;if(!canPay(rest)){const lim=Math.max(0,Math.floor((bankLimit()+0.5*shipValue(s))/1000)*1000);loan=Math.min(rest,lim);if(loan>=50000){const l=takeLoan(loan,60,'ship',s.id);if(!l)loan=0;}else loan=0;}
 pay(rest,'gemi');addRep(1);
 logMsg(()=>L(s.name+' '+tx(y.n)+' tersanesinden teslim alındı. Son taksit '+USD(rest)+(loan?', bunun '+USD(loan)+' kadarı gemi kredisiyle':''),s.name+' delivered by '+tx(y.n)+'. Final instalment '+USD(rest)+(loan?', of which '+USD(loan)+' financed by a ship mortgage':''),s.name+'由'+tx(y.n)+'交付。尾款'+USD(rest)+(loan?'，其中'+USD(loan)+'由船舶抵押贷款支付':'')));
 pushInfo(()=>L('Yeni gemi: ','New ship: ','新船：')+s.name,()=>L(s.name+' '+PORT[y.port].n+' limanında teslim alındı. Sıfır gemi: durum %97, '+D1(s.spd)+' knot. Personel atayıp ilk seferine çıkarabilirsin.',s.name+' has been delivered at '+PORT[y.port].n+'. Brand new: condition 97%, '+D1(s.spd)+' knots. Hire a crew and send her on her maiden voyage.',s.name+'已在'+PORT[y.port].n+'交付。全新船舶：船况97%，航速'+D1(s.spd)+'节。招募船员后即可开始首航。'));}

/* ---------- hurda ---------- */
const SCRAP={IZM:1,BOM:1.15,CGP:1.18};
const LDTF={dry:0.22,tank:0.2,box:0.3,roro:0.55,lng:0.42};
const ldt=s=>Math.round(s.dwt*(LDTF[s.type]||0.22));
function scrapVal(s,pid){return Math.round(ldt(s)*S.steel*(SCRAP[pid]||1)/1000)*1000;}
function scrapShip(sid){const i=S.ships.findIndex(s=>s.id===sid);if(i<0)return;const s=S.ships[i];if(s.state!=='idle'||s.cargo||!SCRAP[s.port])return;const v=scrapVal(s,s.port);
 earn(v,'gemi');S.ships.splice(i,1);payoffShip(s);ROLES.forEach(r=>{const p=s.crew[r.k];if(p){p.since=undefined;S.pool.push(p);}});
 const t=()=>L(s.name+' '+PORT[s.port].n+' söküm tesisinde hurdaya satıldı: '+N(ldt(s))+' LDT, '+USD(v),s.name+' sold for scrap at '+PORT[s.port].n+': '+N(ldt(s))+' LDT, '+USD(v),s.name+'在'+PORT[s.port].n+'拆船厂作为废钢出售：'+N(ldt(s))+'轻吨，'+USD(v));logMsg(t);toast(t(),'','ok');save();}

/* ---------- hava ve mevsimler ---------- */
const WXN=['Ada','Bora','Ceren','Defne','Ece','Elif','Gaye','Hazal','Irmak','Kaan','Lale','Mert','Nehir','Oya','Pelin','Selin','Tuna','Umay','Vera','Yaman','Zeynep'];
const WXK={hur:{n:['Kasırga','Hurricane','飓风'],r:4.5,life:[10,14]},typ:{n:['Tayfun','Typhoon','台风'],r:4.5,life:[9,13]},win:{n:['Kış fırtınası','Winter storm','冬季风暴'],r:6.5,life:[6,9]},gal:{n:['Poyraz','Poyraz gale','爱琴海东北大风'],r:3.2,life:[3,5]},cyc:{n:['Siklon','Cyclone','气旋'],r:4,life:[7,10]}};
const MONZ=[{lon:63,lat:14,r:9},{lon:88,lat:15,r:6}];
const monthOf=day=>Math.floor((((day%365)+365)%365)/30.42);
function monsoon(day){const m=monthOf(day);return m>=5&&m<=8;}
function wxSpawn(day){const m=monthOf(day),A=[];
 if(m>=5&&m<=10)A.push(['hur',0.035,[-52,-38],[11,18],[-2.6,0.5]]);if(m>=6&&m<=9)A.push(['typ',0.035,[138,150],[10,17],[-2.2,1.1]]);
 if(m>=10||m<=2)A.push(['win',0.04,[-48,-30],[45,56],[3.6,0.3]]);if(m>=11||m<=1)A.push(['gal',0.03,[24,36],[38.5,44],[0.4,-0.3]]);if(m===4||m===5||m===9||m===10)A.push(['cyc',0.02,[84,90],[11,16],[-1.3,1.0]]);
 for(const [k,p,lo,la,v] of A){if(S.wx.filter(w=>w.k===k).length>=2||Math.random()>p)continue;const K=WXK[k];
  S.wx.push({id:S.nid++,k,nm:k==='gal'?'':WXN[(S.wxN=(S.wxN||0)+1)%WXN.length],lon:rnd(lo[0],lo[1]),lat:rnd(la[0],la[1]),vx:v[0]*rnd(0.8,1.2),vy:v[1]*rnd(0.7,1.3),r:K.r*rnd(0.85,1.15),str:rnd(0.65,1),age:0,life:rnd(K.life[0],K.life[1])});}}
function wxDay(day){for(const w of S.wx){w.age++;w.lon+=w.vx;w.lat+=w.vy;if((w.k==='hur'&&w.lon<-78)||(w.k==='typ'&&w.lat>24)){w.vx=Math.abs(w.vx)*0.8+0.8;w.vy=Math.abs(w.vy)+0.6;}}
 S.wx=S.wx.filter(w=>w.age<w.life&&w.lat<70&&w.lat>-60);wxSpawn(day);}
function wxPower(w){const a=w.age/w.life;return w.str*(a<0.2?0.5+a*2.5:a>0.8?(1-a)*5:1);}
function wxAt(lon,lat){let best=0,who=null;const c=Math.cos(lat*Math.PI/180);
 for(const w of S.wx||[]){let dl=lon-w.lon;if(dl>180)dl-=360;if(dl<-180)dl+=360;const d=Math.hypot(dl*c,lat-w.lat);if(d<w.r){const v=wxPower(w)*(1-d/w.r*0.7);if(v>best){best=v;who=w;}}}
 if(monsoon(S.day))for(const z of MONZ){const d=Math.hypot((lon-z.lon)*c,lat-z.lat);if(d<z.r&&0.45>best){best=0.45;who={k:'mon'};}}
 return {sev:best,w:who};}
const wxName=w=>!w?'':w.k==='mon'?L('Güneybatı musonu','Southwest monsoon','西南季风'):tx(WXK[w.k].n)+(w.nm?' '+w.nm:'');
/* seyirdeki gemiye etkisi: yavaşlatır, yıpratır, kaptana karar sorar */
function wxSea(s,d,quiet){if(!s.voy)return 1;const p=posOn(s.voy),x=wxAt(p.lon,p.lat);s.wxs=x.sev;if(x.sev<0.15)return 1;
 s.cond=Math.max(15,s.cond-0.35*x.sev*d*(up(s,'nav')?0.6:1));
 if(!quiet&&x.sev>0.45&&s.state==='sea'&&!S.ev.some(e=>e.sid===s.id)&&S.day-(s.voy.lastStorm||-99)>5&&Math.random()<0.25*d){s.voy.wxn=wxName(x.w);evStorm(s);}
 return 1-0.45*x.sev;}
function portWx(pid){const P=PORT[pid];return P?wxAt(P.lon,P.lat).sev:0;}
function routeWx(path){let best=0,who=null;for(const k of path){const n=NODE[k];if(!n)continue;const x=wxAt(n[0],n[1]);if(x.sev>best){best=x.sev;who=x.w;}}return {sev:best,w:who};}

/* ---------- liman kuyruğu, laytime, demuraj ---------- */
const CONGB={LOS:4,CGP:3.5,KHI:2.5,BOM:2.5,MBA:3,DKR:2,ALX:2,JED:2,SSZ:2.5,BUE:2,TRP:1.6,ALG:1.6,SHA:2,DXB:1.2,IST:1.5,MER:1.4,NOV:1.6,BND:2,DUR:1.6,CAS:1.4,HOU:1.2,NYC:1,LAX:1.4};
const congBase=pid=>CONGB[pid]||0.8;
const cong=pid=>S.cong?Math.max(0,S.cong[pid]||0):0;
function congDay(day){for(const p of PORTS){const st=S.strike[p.id]>day?5:0,t=congBase(p.id)*(monsoon(day)&&['BOM','KHI','CGP'].includes(p.id)?1.5:1)+st;S.cong[p.id]=clamp((S.cong[p.id]||0)+(t-(S.cong[p.id]||0))*0.12+rnd(-0.35,0.35),0,12);}
 if(Math.random()<0.012){const p=pick(PORTS.filter(x=>portUnl(x.id)));S.strike[p.id]=day+ri(8,16);toast(L(p.n+' limanında grev: gemiler kuyrukta bekliyor',p.n+': port strike, ships are queuing',p.n+'港口罢工：船舶排队等候'),'','warn');
  logMsg(()=>L(p.n+' limanında liman işçileri greve çıktı',p.n+': dock workers have gone on strike',p.n+'：码头工人罢工'));}}
function layOps(type,tons){return (0.8+tons/12000)*(TOPS[type]||1);}
function layTime(o){return Math.round((layOps(o.type,o.tons)*2*1.2+1.5)*10)/10;}
function demRate(cls){return Math.round((TCH[cls]||5000)*1.1/100)*100;}
function waitAt(pid){if(hasTerm(pid))return 0;return Math.round(cong(pid)*rnd(0.5,1.2)*10)/10;}
function layCalc(c){const dif=c.lt-(c.used||0);return dif<0?-dif*c.dr:-dif*c.dr*0.5;}
function laySettle(s){const c=s.cargo;if(!c||c.lt===undefined)return 0;const v=Math.round(layCalc(c)/100)*100,u=c.used||0,lt=c.lt;if(!v)return 0;tip('lay');
 if(v>40000&&Math.random()<0.25){const Pn=PORT[c.to].n;lawOpen('dem',s,v,0.62,()=>L(s.name+' '+Pn+' limanında laytime’ı aştı ama kiracı demurajı ödemeyi reddediyor; gecikmenin gemiden kaynaklandığını iddia ediyor.',s.name+' went over laytime at '+Pn+', but the charterer refuses to pay demurrage, claiming the delay was the ship’s fault.',s.name+'在'+Pn+'超出装卸时间，但租船人拒付滞期费，声称延误是船方造成的。'));return 0;}
 if(v>0)earn(v,'demuraj');else pay(-v,'demuraj',s);
 logMsg(()=>v>0?L(s.name+': demuraj '+USD(v)+' (laytime '+D1(lt)+' gün, kullanılan '+D1(u)+')',s.name+': demurrage '+USD(v)+' (laytime '+D1(lt)+' days, used '+D1(u)+')',s.name+'：滞期费'+USD(v)+'（装卸时间'+D1(lt)+'天，实用'+D1(u)+'天）'):L(s.name+': dispeç '+USD(-v)+' ödendi (laytime '+D1(lt)+' gün, kullanılan '+D1(u)+')',s.name+': despatch of '+USD(-v)+' paid (laytime '+D1(lt)+' days, used '+D1(u)+')',s.name+'：支付速遣费'+USD(-v)+'（装卸时间'+D1(lt)+'天，实用'+D1(u)+'天）'));return v;}

/* ---------- günlük ---------- */
function deep2Day(day){nbDay(day);wxDay(day);congDay(day);
 if(Math.floor(day/30)!==S.nbM){S.nbM=Math.floor(day/30);S.nbIdx=clamp(S.nbIdx*rnd(0.97,1.035),0.85,1.2);S.steel=clamp(S.steel*rnd(0.94,1.07),330,680);}}
