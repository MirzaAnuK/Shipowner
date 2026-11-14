/* ================= DERİNLİK: banka, zaman çarteri, klas sörveyleri, rakipler, personel hikâyeleri ================= */

/* ---------- kurulum ve eski kayıtlar ---------- */
function initDeep(){S.xp=S.xp||{};FLEETS.forEach(f=>{if(S.xp[f.k]===undefined)S.xp[f.k]=0;});S.loans=S.loans||[];S.tco=S.tco||[];if(S.tcIdx===undefined)S.tcIdx=1;S.rnews=S.rnews||[];S.pw=S.pw||null;
 if(!S.riv){S.riv=RIVS.map((r,i)=>({id:i+1,n:r.n,c:r.c,home:r.home,f:r.f,v:r.v*rnd(0.9,1.1),pk:0,rep:r.rep,tr:0,st:'ok',t:0}));S.riv.forEach(r=>{r.pk=r.v;r.sh=rivShips(r);});}
 if(S.rivNext===undefined)S.rivNext=Math.floor(S.day)+ri(70,110);if(S.crewNext===undefined)S.crewNext=Math.floor(S.day)+ri(40,70);
 const ppl=[];S.ships.forEach(s=>{svInit(s);ROLES.forEach(r=>{const p=s.crew[r.k];if(p){ppl.push(p);if(p.since===undefined)p.since=Math.floor(S.day);}});});
 ppl.concat(S.pool||[]).forEach(personInit);fillTC();}
function personInit(p){if(p.age===undefined)p.age=22+(p.exp||0)+ri(0,6);if(p.loy===undefined)p.loy=ri(40,60);return p;}

/* ---------- banka ---------- */
function debt(){let t=0;for(const l of S.loans||[])t+=l.bal;return t;}
function debtPay(){let t=0;for(const l of S.loans||[])t+=l.pay;return t;}
function loanRate(kind){return Math.round((0.05+(100-S.rep)*0.0006+(kind==='biz'?0.015:0))*1000)/1000;}
function bankLimit(){return Math.max(0,Math.floor((0.5*fleetValue()+250000*(S.hq||1)+15000*S.rep-debt())/50000)*50000);}
function annuity(P,rate,n){const r=rate/12;return r>0?P*r/(1-Math.pow(1+r,-n)):P/n;}
const PCT1=r=>PC(D1(r*100));
function takeLoan(amt,months,kind,sid){amt=Math.round(amt/1000)*1000;if(amt<=0)return null;const rate=loanRate(kind),l={id:S.nid++,kind,amt,bal:amt,rate,n:months,pay:Math.round(annuity(amt,rate,months)),next:Math.floor(S.day)+30,sid:sid||0,t0:Math.floor(S.day)};S.loans.push(l);earn(amt,'kredi');return l;}
function borrow(frac){const lim=bankLimit(),amt=Math.max(50000,Math.floor(lim*frac/50000)*50000);if(amt>lim||lim<50000){toast(L('Banka bu tutarı vermiyor','The bank won’t lend that much','银行不肯贷这么多'),'','bad');return;}
 const l=takeLoan(amt,24,'biz');logMsg(()=>L('İşletme kredisi çekildi: '+USD(l.amt)+', 24 ay, faiz '+PCT1(l.rate)+', aylık taksit '+USD(l.pay),'Business loan taken: '+USD(l.amt)+', 24 months, interest '+PCT1(l.rate)+', monthly instalment '+USD(l.pay),'借入经营贷款：'+USD(l.amt)+'，24个月，利率'+PCT1(l.rate)+'，每月还款'+USD(l.pay)));
 toast(L('Kredi hesabına geçti: ','Loan paid out: ','贷款已到账：')+USD(l.amt),'','ok');save();}
function repayLoan(id){const i=S.loans.findIndex(l=>l.id===id);if(i<0)return;const l=S.loans[i],fee=Math.round(l.bal*0.01);if(!canPay(l.bal+fee)){toast(L('Krediyi kapatmaya nakit yetmiyor','Not enough cash to repay the loan','现金不足，无法还清贷款'),'','bad');return;}
 pay(l.bal,'kredi');pay(fee,'faiz');S.loans.splice(i,1);const b=l.bal;logMsg(()=>L('Kredi erken kapatıldı: '+USD(b)+' (erken ödeme ücreti '+USD(fee)+')','Loan repaid early: '+USD(b)+' (early repayment fee '+USD(fee)+')','提前还清贷款：'+USD(b)+'（提前还款费'+USD(fee)+'）'));toast(L('Kredi kapandı','Loan repaid','贷款已还清'),'','ok');save();}
function shipLoan(m){return Math.round(m.price*0.5/1000)*1000;}
function shipLoanOk(m){return shipLoan(m)<=bankLimit()+0.5*shipValue(m)&&canPay(m.price-shipLoan(m));}
function buyShipLoan(lid){const m=S.market.find(x=>x.id===lid);if(!m)return null;const k=buyBlock(m);if(k&&k!=='cash'){toast(buyWhy(m),'','bad');return null;}
 const amt=shipLoan(m);if(amt>bankLimit()+0.5*shipValue(m)){toast(L('Banka bu gemi için kredi vermiyor','The bank won’t finance this ship','银行不为这艘船提供贷款'),'','bad');return null;}
 if(!canPay(m.price-amt)){toast(L('Peşinat için nakit yetmiyor','Not enough cash for the down payment','现金不足以支付首付'),'','bad');return null;}
 const l=takeLoan(amt,60,'ship'),s=buyShip(lid);if(!s){S.loans.pop();S.cash-=amt;fin('kredi',-amt);return null;}l.sid=s.id;
 logMsg(()=>L(s.name+' için gemi kredisi: '+USD(l.amt)+', 60 ay, faiz '+PCT1(l.rate)+', aylık taksit '+USD(l.pay),'Ship mortgage for '+s.name+': '+USD(l.amt)+', 60 months, interest '+PCT1(l.rate)+', monthly instalment '+USD(l.pay),s.name+'的船舶抵押贷款：'+USD(l.amt)+'，60个月，利率'+PCT1(l.rate)+'，每月还款'+USD(l.pay)));return s;}
function payoffShip(s){const i=S.loans.findIndex(l=>l.sid===s.id);if(i<0)return;const l=S.loans[i];pay(l.bal,'kredi');S.loans.splice(i,1);const b=l.bal;
 logMsg(()=>L(s.name+' satışından gemi kredisi kapatıldı: '+USD(b),'Ship mortgage repaid from the sale of '+s.name+': '+USD(b),'用'+s.name+'的售船款还清抵押贷款：'+USD(b)));}
function loanDay(day){for(const l of S.loans.slice()){if(day<l.next)continue;l.next+=30;const it=l.bal*l.rate/12,pr=Math.min(l.bal,Math.max(0,l.pay-it));pay(it,'faiz');pay(pr,'kredi');l.bal-=pr;
 if(l.bal<1){S.loans.splice(S.loans.indexOf(l),1);const a=l.amt;logMsg(()=>L('Kredi borcu bitti ('+USD(a)+')','Loan fully repaid ('+USD(a)+')','贷款已全部还清（'+USD(a)+'）'));toast(L('Bir kredinin son taksiti ödendi','The last instalment of a loan has been paid','一笔贷款的最后一期已还清'),'','ok');}}}

/* ---------- zaman çarteri ---------- */
const TCH={koster:2900,gcargo:5400,ctank:6400,handy:9000,supra:13800,pmax:18000,mr:22500,afra:33300,feeder:9000,cbox:23000,pctc:22000,lng:45000};
const TCREP={koster:0,gcargo:5,ctank:10,handy:15,supra:25,pmax:30,mr:35,afra:45,feeder:15,cbox:35,pctc:30,lng:60};
const CHRS=['Anatolian Grain Trading','Nordhavn Bulk','Gulfstar Energy Trading','Pacific Ore Logistics','Levant Cement Co.','Baltic Timber Lines','Orient Steel Trading','Atlas Commodities','Meridian Chartering','Bosphorus Agro'];
function fillTC(){S.tco=(S.tco||[]).filter(o=>o.exp>S.day);for(const c of CLSORD){while(S.tco.filter(o=>o.cls===c).length<2){const mo=wpick([3,6,12],[4,4,2]),used=S.tco.filter(o=>o.cls===c).map(o=>o.who);S.tco.push({id:S.nid++,cls:c,who:pick(CHRS.filter(n=>!used.includes(n))),mo,mul:Math.round(rnd(0.8,1.0)*S.tcIdx*(mo===12?0.97:1)*1000)/1000,exp:S.day+rnd(15,40)});}}}
function tcRate(s,o){const c=CLS[s.cls],sp=(c.spd[0]+c.spd[1])/2;return Math.round(TCH[s.cls]*o.mul*(0.85+0.15*clamp((s.cond-50)/40,0,1))*(s.spd/sp)*(1+0.05*(catLv(FLEETOF[s.cls])-1))/50)*50;}
function tcWhy(s,o){if(s.state!=='idle')return L('gemi limanda emir bekliyor olmalı','the ship must be idle in port','船舶须在港待命');if(missingRoles(s).length)return L('personel eksik','crew missing','缺少船员');
 const mc=s.type==='lng'?70:s.type==='tank'?65:55;if(s.cond<mc)return L('kiracı en az %'+mc+' durum istiyor','the charterer wants at least '+mc+'% condition','租家要求船况至少'+mc+'%');
 if(S.rep<TCREP[s.cls])return L('itibar '+TCREP[s.cls]+' gerekli','reputation '+TCREP[s.cls]+' required','需要声誉'+TCREP[s.cls]);
 if(s.svD-S.day<o.mo*30+10)return L('klas sörveyi kiralama süresine denk geliyor, önce sörveyi yaptır','the class survey falls due during the charter; do the survey first','船级检验将在租期内到期，请先完成检验');return '';}
function tcFix(sid,oid){S.done.tcDone=1;const s=S.ships.find(x=>x.id===sid),o=S.tco.find(x=>x.id===oid);if(!s||!o)return false;const w=tcWhy(s,o);if(w){toast(w,s.id,'bad');return false;}
 const rate=tcRate(s,o);S.tco=S.tco.filter(x=>x!==o);if(s.prov<60){pay((60-s.prov)*provRate(s),'kumanya',s);s.prov=60;}s.state='tc';s.op=0;s.ack=false;s.tc={who:o.who,rate,mo:o.mo,end:S.day+o.mo*30,t0:S.day,off:0,offT:0,earned:0,xpa:0,stay:rnd(1,2)};
 logMsg(()=>L(s.name+', '+o.who+' firmasına '+o.mo+' aylığına kiralandı: günlük '+USD(rate),s.name+' fixed on a '+o.mo+'-month time charter to '+o.who+': '+USD(rate)+' a day',s.name+'以期租方式租给'+o.who+'，租期'+o.mo+'个月：日租金'+USD(rate)));
 toast(L(s.name+' kiralandı',s.name+' is on charter',s.name+'已出租'),s.id,'ok');fillTC();resume();save();return true;}
function tcNext(s){const A=PORTS.filter(p=>p.id!==s.port&&portOpen(p.id)&&RTc[s.port].dist[p.id]<7000);if(!A.length)return null;return wpick(A,A.map(p=>1/(1+RTc[s.port].dist[p.id]/1800))).id;}
function crewXp(s,d){for(const r of ROLES){const p=s.crew[r.k];if(!p)continue;p.xp=(p.xp||0)+d;if(p.skill<5&&p.xp>=120*p.skill){p.xp=0;p.skill++;p.wage=Math.round(p.wage*1.15/50)*50;toast(L(p.name+' ('+r.n+') tecrübe kazandı',p.name+' ('+r.n+') gained experience',p.name+'（'+r.n+'）经验提升'),s.id,'ok');R();}}}
function tcStep(s,d){const t=s.tc;if(!t){goIdle(s);return;}
 if(t.off>0){t.off-=d;if(t.off<=0&&!managed(s))toast(L(s.name+' tamir edildi, kira yeniden işliyor',s.name+' repaired and back on hire',s.name+'已修好，恢复计租'),s.id,'ok');return;}
 earn(t.rate*d,'kira');t.earned+=t.rate*d;t.xpa+=0.17*d;if(t.xpa>=5){const g=Math.floor(t.xpa);t.xpa-=g;addXP(FLEETOF[s.cls],g);}
 if(s.voy){const v=s.voy,dn=seaSpeed(s)*24*d*wxSea(s,d,true);v.done+=dn;s.cf=(s.cf||0)+consSea(s)*d;s.cd=(s.cd||0)+dn*s.dwt;s.cond=Math.max(15,s.cond-0.08*(1+s.age/20)*(1.3-0.1*sk(s,'c2'))*(up(s,'eng')?0.8:1)*d);crewXp(s,d);
  if(Math.random()<pBreak(s)*d*0.8){const days=Math.round(rnd(1,3.5)*10)/10,c=Math.round((4000+s.dwt*0.4)/100)*100;pay(c,'bakım',s);t.off=days;t.offT+=days;
   toast(L(s.name+' arıza yaptı: '+D1(days)+' gün kira kesildi (off-hire), tamir '+USD(c),s.name+' broke down: '+D1(days)+' days off-hire, repairs '+USD(c),s.name+'发生故障：停租'+D1(days)+'天，修理费'+USD(c)),s.id,'bad');
   logMsg(()=>L(s.name+' kiralamadayken arıza yaptı, '+D1(days)+' gün off-hire',s.name+' broke down on charter, '+D1(days)+' days off-hire',s.name+'在租期内故障，停租'+D1(days)+'天'));}
  if(v.done>=v.nm){s.port=v.to;s.voy=null;t.stay=rnd(1.5,4);if(s.prov<40){pay((60-s.prov)*provRate(s),'kumanya',s);s.prov=60;}deepArrive(s);R();}}
 else{s.cond=Math.max(15,s.cond-0.015*d);t.stay-=d;if(t.stay<=0){if(S.day>=t.end){tcEnd(s);return;}const to=tcNext(s);if(!to){t.stay=1;return;}const r=route(s.port,to);s.voy={from:s.port,to,path:r.path,cum:legs(r.path),nm:r.nm,done:0,trig:[],lastEv:S.day,t0:S.day};s.port=null;R();}}}
function tcEnd(s){const t=s.tc;s.tc=null;const e=Math.round(t.earned),w=t.who,off=t.offT;
 logMsg(()=>L(s.name+' '+w+' kiralamasından döndü. Toplam kira '+USD(e)+(off?', off-hire '+D1(off)+' gün':''),s.name+' redelivered by '+w+'. Total hire '+USD(e)+(off?', off-hire '+D1(off)+' days':''),s.name+'已由'+w+'还船。租金合计'+USD(e)+(off?'，停租'+D1(off)+'天':'')));
 goIdle(s,L('kiralama bitti','charter ended','租期结束'));}

/* ---------- klas sörveyleri ---------- */
function svFor(age){const ph=age%5;return ph<2.5?{k:'ara',days:Math.floor((2.5-ph)*365)}:{k:'ozel',days:Math.floor((5-ph)*365)};}
function svInit(s){if(s.svD!==undefined)return;const f=svFor(s.age);s.svK=f.k;s.svD=Math.floor(S.day)+f.days;}
const svLeft=s=>s.svD-S.day,svOver=s=>s.svD!==undefined&&s.svD<S.day&&s.svP!=='ara'&&s.svP!=='ozel',svOpen=s=>svLeft(s)<=120;
const svName=k=>k==='ozel'?L('özel sörvey','special survey','特别检验'):L('ara sörvey','intermediate survey','中间检验');
function svInfo(s){const P=s.port?PORT[s.port]:null;if(!P||!P.yard)return null;const base=(6000+s.dwt*0.5)*P.yard*inspCf();
 if(s.svK==='ozel'){const d=dockInfo(s),steel=s.cond<65?Math.round((65-s.cond)*ppCost(s)*2):0;return {cost:Math.round((d.cost+base*1.2+steel)/100)*100,steel,days:Math.round(10+(steel?3:0)),to:maxCond(s)};}
 return {cost:Math.round(base*0.9/100)*100,steel:0,days:3,to:Math.min(maxCond(s),Math.max(s.cond,s.cond+4))};}
function doSurvey(s){if(s.state!=='idle'||!svOpen(s))return false;S.done.svy=1;const f=svInfo(s);if(!f){toast(L('Sörvey tersaneli bir limanda yapılır','Surveys are done at a port with a shipyard','检验须在有船厂的港口进行'),'','bad');return false;}
 if(!canPay(f.cost)){toast(L('Sörvey için nakit yetmiyor','Not enough cash for the survey','现金不足，无法检验'),'','bad');return false;}
 pay(f.cost,'bakım',s);s.state='maint';s.op=f.days;s.maintTo=Math.max(s.cond,f.to);s.svP=s.svK;s.ack=false;const k=s.svK;
 logMsg(()=>L(s.name+': klas '+svName(k)+' başladı, '+USD(f.cost)+(f.steel?' (sac yenileme dahil)':''),s.name+': class '+svName(k)+' started, '+USD(f.cost)+(f.steel?' (incl. steel renewal)':''),s.name+'：开始船级'+svName(k)+'，'+USD(f.cost)+(f.steel?'（含换板）':'')));resume();save();return true;}
function svDone(s){if(s.svP!=='ara'&&s.svP!=='ozel')return '';const k=s.svP;s.svP=0;s.svD=Math.max(s.svD+913,Math.floor(S.day)+700);s.svK=k==='ozel'?'ara':'ozel';s.svW=0;s.svX=0;
 logMsg(()=>L(s.name+': '+svName(k)+' tamamlandı, klas sertifikası yenilendi',s.name+': '+svName(k)+' completed, class certificate renewed',s.name+'：'+svName(k)+'完成，船级证书已更新'));return L('sörvey tamam','survey done','检验完成');}
function nearYard(s){let b=null,bd=1e9;for(const p of PORTS){if(!p.yard||p.id===s.port||!portOpen(p.id))continue;const d=RTc[s.port].dist[p.id];if(d<bd&&consSea(s)*d/(seaSpeed(s)*24)*1.12+2<=s.fuelCap){bd=d;b=p.id;}}return b;}
function svDay(){for(const s of S.ships){if(s.svD===undefined)svInit(s);const lf=svLeft(s);
 if(!s.svW&&lf<=120&&lf>0){s.svW=1;const k=s.svK,dl=Math.ceil(lf);toast(L(s.name+': klas '+svName(k)+' zamanı yaklaşıyor ('+dl+' gün)',s.name+': class '+svName(k)+' due in '+dl+' days',s.name+'：船级'+svName(k)+'将在'+dl+'天后到期'),s.id,'warn');
  logMsg(()=>L(s.name+': '+svName(k)+' penceresi açıldı, '+dl+' gün içinde tersaneli limanda yapılmalı',s.name+': '+svName(k)+' window opened; it must be done at a shipyard port within '+dl+' days',s.name+'：'+svName(k)+'窗口已开启，须在'+dl+'天内于有船厂的港口完成'));}
 if(!s.svX&&lf<0&&s.svP!=='ara'&&s.svP!=='ozel'){s.svX=1;pushInfo(()=>L('Klas askıya alındı: ','Class suspended: ','船级被暂停：')+s.name,()=>L(s.name+' '+svName(s.svK)+' zamanını kaçırdı. Klas kuruluşu sertifikayı askıya aldı: sigorta geçersiz, gemi yük alamaz ve kiralanamaz, denetimlerde de tutulma riski artar. Gemiyi tersaneli bir limana götürüp sörveyi yaptır.',s.name+' has missed its '+svName(s.svK)+'. The classification society has suspended its certificate: insurance is void, the ship can’t load cargo or go on charter, and detentions become more likely. Take the ship to a shipyard port and do the survey.',s.name+'错过了'+svName(s.svK)+'。船级社已暂停其证书：保险失效，船舶不能装货也不能出租，被滞留的风险也会增加。请把船开到有船厂的港口完成检验。'));}
 if(s.state!=='idle'||!svOpen(s))continue;const m=mgrOf(s),ins=inspector();
 if(managed(s)&&m){if(svInfo(s)){if(canPay(svInfo(s).cost))doSurvey(s);}else if(lf<45){const y=nearYard(s);if(y&&canPay(planTrip(s,y,null).topCost))depart(s,y,0,true,m);}continue;}
 if(ins&&svInfo(s)&&!(s.svAsk>S.day)&&!S.ev.some(e=>e.k==='svy')){s.svAsk=S.day+20;const f=svInfo(s),k=s.svK,pid=s.port;
  pushEv({k:'svy',sid:s.id,who:ins.id,title:()=>L('Sörvey önerisi: ','Survey proposal: ','检验建议：')+s.name,body:()=>L('Patron, '+s.name+' '+PORT[pid].n+' tersanesinde. Klas '+svName(k)+' '+(lf<0?'gecikti':Math.ceil(lf)+' gün sonra doluyor')+'. Şimdi yaptıralım mı?'+(f.steel?' Gövdede sac yenilemesi de gerekecek.':''),'Boss, '+s.name+' is at the '+PORT[pid].n+' yard. The class '+svName(k)+' '+(lf<0?'is overdue':'falls due in '+Math.ceil(lf)+' days')+'. Shall we do it now?'+(f.steel?' The hull will also need steel renewal.':''),'老板，'+s.name+'在'+PORT[pid].n+'船厂。船级'+svName(k)+(lf<0?'已逾期':'还有'+Math.ceil(lf)+'天到期')+'。现在就做吗？'+(f.steel?'船体还需要换板。':'')),
   opts:[{l:()=>L('Evet, yaptır','Yes, do it','好，去做'),s:()=>USD(f.cost)+' · '+f.days+L(' gün',' days','天')},{l:()=>L('Sonra','Later','以后再说'),s:()=>L('20 gün tekrar sorulmaz','Won’t ask again for 20 days','20天内不再询问')}]});}}}

/* ---------- rakipler ---------- */
const RIVS=[{n:'Marmara Lines',c:'#4a86d4',home:'IST',f:'dry',v:3.0e6,rep:15},{n:'Aegean Star Shipping',c:'#d4913f',home:'PIR',f:'dry',v:7.5e6,rep:28},{n:'Levant Tankers',c:'#3daf8a',home:'MER',f:'tank',v:12e6,rep:35},{n:'Golden Lotus Shipping',c:'#c9506f',home:'SHA',f:'dry',v:26e6,rep:50}];
const rivShips=r=>Math.max(1,Math.round(r.v/(r.f==='tank'?6.5e6:4e6)));
const riv=id=>S.riv.find(r=>r.id===id);
function rnews(t){S.rnews.unshift({d:Math.floor(S.day),t:LX(t)});if(S.rnews.length>12)S.rnews.length=12;}
function rivMonth(){for(const r of S.riv){if(r.st==='gone')continue;if(r.st==='ok'&&S.day>240&&Math.random()<0.012){r.v*=rnd(0.5,0.65);const nm=r.n;rnews(()=>L(nm+' büyük zarar açıkladı: bir gemisi karaya oturdu, bir kiracısı battı',nm+' reported a heavy loss: one ship ran aground and a charterer went bust',nm+'公布巨额亏损：一艘船搁浅，一个租家破产'));}let g=rnd(-0.035,0.06)-(S.pw&&S.pw.rid===r.id&&S.pw.mode===0?0.03:0);if(r.st==='weak'||r.st==='offered')g-=0.01;r.v*=1+g;r.tr=g;r.pk=Math.max(r.pk,r.v);r.rep=clamp(r.rep+rnd(-1,1.5),5,95);
 const x=r.v/(r.f==='tank'?6.5e6:4e6),nm=r.n;if(x>=r.sh+0.75){r.sh++;rnews(()=>L(nm+' filosuna yeni bir gemi kattı',nm+' added a ship to its fleet',nm+'船队新增一艘船'));}else if(x<=r.sh-0.75&&r.sh>1){r.sh--;rnews(()=>L(nm+' bir gemisini sattı',nm+' sold one of its ships',nm+'出售了一艘船'));}
 if(r.st==='ok'&&r.v<0.62*r.pk){r.st='weak';r.t=S.day;rnews(()=>L(nm+' zor durumda: bankalar kredi limitlerini kıstı',nm+' is in trouble: banks have cut its credit lines',nm+'陷入困境：银行削减了其信贷额度'));}
 else if((r.st==='weak'||r.st==='offered')&&r.v>0.8*r.pk){r.st='ok';rnews(()=>L(nm+' toparlandı',nm+' has recovered',nm+'已恢复元气'));}
 else if((r.st==='weak'||r.st==='offered')&&S.day-r.t>200){r.st='gone';rnews(()=>L(nm+' iflas etti, gemileri icradan satılıyor',nm+' went bankrupt; its ships are being sold at auction',nm+'破产，其船舶正在拍卖'));for(let k=0;k<Math.min(2,r.sh);k++)rivListing(r,0.8);}}}
function rivListing(r,disc){let A=CLSORD.filter(c=>CLS[c].t===r.f&&(LIC[c]?LIC[c][1]<=catLv(LIC[c][0])+1:true));if(!A.length)A=CLSORD.filter(c=>CLS[c].t===r.f);const cls=pick(A),m=mkListing(cls,[r.home].concat(HOME),false);m.price=Math.round(m.price*disc/1000)*1000;m.riv=r.n;S.market.push(m);return m;}
function rivEvent(force){const L0=S.riv.filter(r=>r.st!=='gone');if(!L0.length)return;const cand=[];
 const star=[];S.ships.forEach(s=>['kap','cb','zab','c2'].forEach(k=>{const p=s.crew[k];if(p&&p.skill>=4&&!p.leave)star.push([s,k,p]);}));if(star.length)cand.push('poach');
 if(S.ships.length)cand.push('war');cand.push('sale');const weak=L0.filter(r=>r.st==='weak');if(weak.length&&S.ships.length)cand.push('take','take');
 const k=force&&cand.includes(force)?force:pick(cand),r=k==='take'?pick(weak):pick(L0),nm=r.n;
 if(k==='sale'){const m=rivListing(r,0.86);toast(L(nm+' bir gemisini ucuza satışa çıkardı: ',nm+' has put a ship up for sale cheaply: ',nm+'低价出售一艘船：')+m.name,'','ok');rnews(()=>L(nm+', '+m.name+' gemisini piyasanın altında satışa çıkardı',nm+' listed '+m.name+' below market price',nm+'以低于市价的价格挂牌出售'+m.name));return;}
 if(k==='poach'){const [s,rk,p]=star.sort((a,b)=>b[2].skill-a[2].skill)[0],w=Math.round(p.wage*1.3/50)*50,ch=clamp(0.35+p.loy/150,0.35,0.95);
  pushEv({k:'poach',sid:s.id,title:()=>L('Rakip teklif: ','A rival’s offer: ','竞争对手挖角：')+p.name,body:()=>L(nm+', '+s.name+' gemisindeki '+ROLE[rk].n.toLocaleLowerCase('tr')+' '+p.name+' için '+USD(w)+' maaş teklif etti (şu an '+USD(p.wage)+'). '+p.name+' karar vermeden önce seninle konuşmak istiyor.',nm+' has offered '+p.name+', '+ROLE[rk].n.toLowerCase()+' of '+s.name+', a salary of '+USD(w)+' (now '+USD(p.wage)+'). '+p.name+' wants to talk to you before deciding.',nm+'向'+s.name+'的'+ROLE[rk].n+p.name+'开出'+USD(w)+'的月薪（目前'+USD(p.wage)+'）。'+p.name+'想在做决定前和你谈谈。'),d:{pid:p.id,rk,w,ch,rid:r.id},
   opts:[{l:()=>L('Teklifi eşle','Match the offer','跟进报价'),s:()=>USD(w)+L('/ay · kesin kalır · sadakat artar','/mo · stays for sure · loyalty rises','/月 · 一定留下 · 忠诚度提升')},{l:()=>L('%15 zam teklif et','Offer a 15% raise','提出加薪15%'),s:()=>L('%'+Math.round(ch*100)+' ihtimalle kalır',Math.round(ch*100)+'% chance they stay','留下的概率'+Math.round(ch*100)+'%')},{l:()=>L('Gitmesine izin ver','Let them go','让他走'),s:()=>L('yerine acenteden biri gelir','someone from the agency takes over','由中介安排的人接替')}]});return;}
 if(k==='war'){const cs=[...new Set(S.ships.map(s=>PORT[s.port||(s.voy&&s.voy.to)||'IST'].c))],c=pick(cs);
  pushEv({k:'war',title:()=>L('Navlun savaşı: ','Freight war: ','运费战：')+CNAME[c],body:()=>L(nm+', '+CNAME[c]+' limanlarında navlunları kırıyor ve yük sahiplerini kendine çekmeye çalışıyor. Ne yapacaksın?',nm+' is undercutting freight rates in '+CNAME[c]+'’s ports and trying to win over the cargo owners. What will you do?',nm+'正在'+CNAME[c]+'各港口压低运费，试图抢走货主。你打算怎么办？'),d:{c,rid:r.id},
   opts:[{l:()=>L('Fiyat kır, pazarı koru','Cut prices and hold the market','降价守住市场'),s:()=>L('60 gün bu ülkeden navlun −%10 · rakip zayıflar · ilişki artar','60 days of −10% freight from this country · the rival weakens · relations improve','60天内该国运费−10% · 对手被削弱 · 关系改善')},{l:()=>L('Bu limanlardan çekil','Pull out of these ports','退出这些港口'),s:()=>L('60 gün bu ülkede daha az yük · rakip güçlenir','60 days of fewer cargoes in this country · the rival grows','60天内该国货源减少 · 对手壮大')}]});return;}
 if(k==='take'){const price=Math.round(r.v*0.7/10000)*10000,n=r.sh;r.st='offered';
  pushEv({k:'take',title:()=>L(nm+' satılık',nm+' is for sale',nm+'寻求出售'),body:()=>L(nm+' borç batağında. Sahipleri şirketi, '+n+' gemilik filosuyla birlikte '+USD(price)+' karşılığında sana devretmeyi teklif ediyor. Ruhsatın ve ofis kapasiten yettiği kadar gemi filona katılır; kalanı hemen satılır ve parası sana kalır.',nm+' is drowning in debt. Its owners offer to sell you the company, with its fleet of '+n+' '+pl(n,'ship','ships')+', for '+USD(price)+'. As many ships as your licences and office capacity allow join your fleet; the rest are sold at once and the money is yours.',nm+'债台高筑。其船东提出以'+USD(price)+'把公司连同'+n+'艘船转让给你。在执照和办公室容量允许的范围内，船舶将并入你的船队；其余船舶立即出售，所得归你。'),d:{rid:r.id,price},
   opts:[{l:()=>L('Şirketi satın al','Buy the company','收购该公司'),s:()=>USD(price)+L(' · itibar artar',' · reputation rises',' · 声誉提升')},{l:()=>L('İlgilenmiyorum','Not interested','不感兴趣'),s:()=>L('başka bir alıcı çıkabilir','another buyer may turn up','可能会有其他买家')}]});}}
function takeOver(r,price){if(!canPay(price)){toast(L('Devralma için nakit yetmiyor','Not enough cash for the takeover','现金不足，无法收购'),'','bad');r.st='weak';return;}pay(price,'gemi');
 const cls=CLSORD.filter(c=>CLS[c].t===r.f&&licOk(c)),free=Math.max(0,shipCap()-S.ships.length),per=r.v/r.sh;let got=0,cash=0;
 for(let k=0;k<r.sh;k++){if(got<free&&cls.length){const m=mkListing(pick(cls),[r.home].concat(HOME),false);const s=shipFrom(m);s.name=m.name;got++;}else cash+=per*0.85;}
 if(cash)earn(Math.round(cash/1000)*1000,'gemi');r.st='gone';addRep(3);const nm=r.n,c2=Math.round(cash);
 logMsg(()=>L(nm+' satın alındı: '+got+' gemi filoya katıldı'+(c2?', kalan gemilerin satışından '+USD(c2):''),nm+' acquired: '+got+' '+pl(got,'ship','ships')+' joined the fleet'+(c2?', '+USD(c2)+' from selling the rest':''),'收购'+nm+'：'+got+'艘船并入船队'+(c2?'，出售其余船舶获得'+USD(c2):'')));
 rnews(()=>L(nm+' devralındı',nm+' was taken over',nm+'已被收购'));toast(L(nm+' artık senin','You now own '+nm,nm+'现在归你了'),'','ok');}
function pwMul(from,to){const p=S.pw;if(!p||p.until<=S.day||p.mode!==0)return 1;return PORT[from].c===p.c||PORT[to].c===p.c?0.9:1;}

/* ---------- personel hikâyeleri ---------- */
function replaceCrew(s,rk){if(!s.port)return null;const want=Math.max(1,(s._lastSkill||3)-1),A=S.pool.filter(p=>p.role===rk).sort((a,b)=>Math.abs(a.skill-want)-Math.abs(b.skill-want)||a.wage-b.wage);if(!A.length)return null;
 if(hire(s,rk,A[0].id)){const p=s.crew[rk];toast(L(s.name+': yerine '+p.name+' geldi ('+ROLE[rk].n+')',s.name+': '+p.name+' takes over as '+ROLE[rk].n.toLowerCase(),s.name+'：'+p.name+'接任'+ROLE[rk].n),s.id);return p;}return null;}
function crewLeave(s,rk,why){const p=s.crew[rk];if(!p)return;if(!s.port){p.leave=1;return;}delete s.crew[rk];s._lastSkill=p.skill;const nm=p.name;
 logMsg(()=>L(s.name+': '+ROLE[rk].n+' '+nm+' gemiden ayrıldı'+(why?' ('+why()+')':''),s.name+': '+ROLE[rk].n.toLowerCase()+' '+nm+' left the ship'+(why?' ('+why()+')':''),s.name+'：'+ROLE[rk].n+nm+'离船'+(why?'（'+why()+'）':'')));replaceCrew(s,rk);}
function doPromo(s,from,to){const p=s.crew[from];if(!p)return;const old=s.crew[to];if(old){old.since=undefined;S.pool.push(old);}delete s.crew[from];p.role=to;p.wage=Math.round(Math.max(p.wage*1.35,ROLE[to].base*WMUL[p.skill]*0.92)/50)*50;p.loy=Math.min(100,p.loy+20);p.since=Math.floor(S.day);s.crew[to]=p;s._lastSkill=p.skill;
 const nm=p.name,on=old?old.name:'';logMsg(()=>L(s.name+': '+nm+' '+ROLE[to].n.toLocaleLowerCase('tr')+' oldu'+(on?', '+on+' acenteye döndü':''),s.name+': '+nm+' promoted to '+ROLE[to].n.toLowerCase()+(on?'; '+on+' went back to the agency':''),s.name+'：'+nm+'晋升为'+ROLE[to].n+(on?'；'+on+'回到中介':'')));
 toast(L(nm+' terfi etti',nm+' was promoted',nm+'获得晋升'),s.id,'ok');replaceCrew(s,from);}
function deepArrive(s){for(const r of ROLES){const p=s.crew[r.k];if(!p)continue;
 if(p.promoTo){const to=p.promoTo;p.promoTo=0;doPromo(s,r.k,to);continue;}
 if(p.leave){p.leave=0;crewLeave(s,r.k);continue;}
 if(p.loy<20&&Math.random()<0.25){toast(L(p.name+' ('+r.n+') sadakatsizlikten istifa etti',p.name+' ('+r.n+') quit, feeling no loyalty to the company',p.name+'（'+r.n+'）对公司失去忠诚而辞职'),s.id,'bad');crewLeave(s,r.k,()=>L('istifa','resigned','辞职'));}}}
function crewDay(day,force){for(const s of S.ships){const sea=s.state==='sea'||(s.state==='tc'&&s.voy);for(const r of ROLES){const p=s.crew[r.k];if(!p)continue;if(p.age===undefined)personInit(p);p.age+=1/365;if(sea)p.loy=Math.min(100,p.loy+0.02);if(s.morale<35)p.loy=Math.max(0,p.loy-0.06);}}
 const y=Math.floor(day/365);if(!force&&day%365>=352&&S.bonusY!==y&&S.ships.length&&!S.ev.some(e=>e.k==='bonus')){S.bonusY=y;let w=0;S.ships.forEach(s=>w+=wageDay(s)*30);const full=Math.round(w/100)*100,half=Math.round(w/200)*100;
  pushEv({k:'bonus',title:()=>L('Yılsonu ikramiyesi','Year-end bonus','年终奖'),body:()=>L('Yıl bitiyor. Gemilerdeki personel bu yıl ikramiye verilip verilmeyeceğini merak ediyor. Bir aylık maaş toplamı '+USD(full)+'.','The year is ending. The crews are wondering whether there will be a bonus this year. One month’s wages come to '+USD(full)+'.','一年即将结束。船员们都在关心今年有没有年终奖。一个月的工资总额为'+USD(full)+'。'),d:{full,half},
   opts:[{l:()=>L('Tam maaş ikramiye','A full month’s pay','发一个月工资'),s:()=>USD(full)+L(' · moral ve sadakat çok artar',' · morale and loyalty rise a lot',' · 士气和忠诚度大幅提升')},{l:()=>L('Yarım maaş','Half a month’s pay','发半个月工资'),s:()=>USD(half)+L(' · moral biraz artar',' · morale rises a little',' · 士气略有提升')},{l:()=>L('Bu yıl ikramiye yok','No bonus this year','今年不发'),s:()=>L('moral ve sadakat düşer','morale and loyalty fall','士气和忠诚度下降')}]});return;}
 if(!force&&(day<S.crewNext||S.ev.some(e=>e.k==='ret'||e.k==='promo')))return;S.crewNext=day+ri(35,70);
 const all=[];S.ships.forEach(s=>ROLES.forEach(r=>{const p=s.crew[r.k];if(p&&!p.leave&&!p.promoTo)all.push([s,r.k,p]);}));
 const ret=all.filter(x=>x[2].age>=62&&!(x[2].retAsk>day));if(ret.length){const [s,rk,p]=pick(ret),cost=Math.round(p.wage*3/100)*100,ch=clamp(0.45+p.loy/200,0.45,0.9),ag=Math.floor(p.age);
  pushEv({k:'ret',sid:s.id,title:()=>L('Emeklilik: ','Retirement: ','退休：')+p.name,body:()=>L(s.name+' gemisinde '+ROLE[rk].n.toLocaleLowerCase('tr')+' olarak çalışan '+p.name+' '+ag+' yaşında ve emekli olmak istediğini söylüyor. '+(p.since!==undefined?Math.max(1,Math.round((day-p.since)/365))+' yıldır seninle çalışıyor.':''),p.name+', '+ROLE[rk].n.toLowerCase()+' of '+s.name+', is '+ag+' and says he wants to retire. '+(p.since!==undefined?'He has worked for you for '+Math.max(1,Math.round((day-p.since)/365))+' '+pl(Math.max(1,Math.round((day-p.since)/365)),'year','years')+'.':''),s.name+'的'+ROLE[rk].n+p.name+'今年'+ag+'岁，说想退休了。'+(p.since!==undefined?'他已经为你工作了'+Math.max(1,Math.round((day-p.since)/365))+'年。':'')),d:{pid:p.id,rk,cost,ch},
   opts:[{l:()=>L('Emeklilik ikramiyesi ver','Give a retirement bonus','发放退休奖金'),s:()=>USD(cost)+L(' · gemide moral, filoda sadakat artar',' · morale on board and loyalty across the fleet rise',' · 本船士气和全船队忠诚度提升')},{l:()=>L('Bir yıl daha kalmasını rica et','Ask him to stay one more year','请他再留一年'),s:()=>L('%'+Math.round(ch*100)+' ihtimalle kalır, %10 zamla',Math.round(ch*100)+'% chance he stays, with a 10% raise','留下的概率'+Math.round(ch*100)+'%，加薪10%')},{l:()=>L('Uğurla','Wish him well','送别'),s:()=>L('masraf yok · moral biraz düşer','no cost · morale dips a little','没有花费 · 士气略降')}]});return;}
 const pro=all.filter(x=>(x[1]==='zab'||x[1]==='c2')&&x[2].skill>=4&&x[2].loy>=35&&!(x[2].proAsk>day));if(pro.length&&(force||Math.random()<0.4)){const [s,rk,p]=pick(pro),to=rk==='zab'?'kap':'cb',cur=s.crew[to],ag=Math.floor(p.age);
  pushEv({k:'promo',sid:s.id,title:()=>L('Terfi isteği: ','Promotion request: ','晋升请求：')+p.name,body:()=>L(s.name+' gemisinde '+ROLE[rk].n.toLocaleLowerCase('tr')+' olarak çalışan '+p.name+' ('+ag+'), artık '+ROLE[to].n.toLocaleLowerCase('tr')+' olmaya hazır olduğunu düşünüyor. '+(cur?'Şu anki '+ROLE[to].n.toLocaleLowerCase('tr')+' '+cur.name+' ('+cur.skill+' yıldız) terfi olursa acenteye döner.':'Gemide şu an '+ROLE[to].n.toLocaleLowerCase('tr')+' yok.'),p.name+' ('+ag+'), '+ROLE[rk].n.toLowerCase()+' of '+s.name+', feels ready to become '+ROLE[to].n.toLowerCase()+'. '+(cur?'If you promote him, the current '+ROLE[to].n.toLowerCase()+' '+cur.name+' ('+cur.skill+' stars) goes back to the agency.':'The ship has no '+ROLE[to].n.toLowerCase()+' at the moment.'),s.name+'的'+ROLE[rk].n+p.name+'（'+ag+'岁）认为自己已经可以胜任'+ROLE[to].n+'。'+(cur?'如果提拔他，现任'+ROLE[to].n+cur.name+'（'+cur.skill+'星）将回到中介。':'船上目前没有'+ROLE[to].n+'。')),d:{pid:p.id,rk,to},
   opts:[{l:()=>L('Terfi ettir','Promote him','提拔他'),s:()=>L(s.port?'hemen':'bir sonraki limanda',s.port?'right away':'at the next port',s.port?'立即生效':'在下一个港口生效')+L(' · maaşı artar, sadakati çok artar',' · higher pay, much more loyal',' · 工资提高，忠诚度大增')},{l:()=>L('Zam ver, yerinde kalsın','Give a raise, keep him in post','加薪，留任原职'),s:()=>L('maaş +%15','pay +15%','工资+15%')},{l:()=>L('Şimdilik hayır','Not now','暂时不行'),s:()=>L('sadakati düşer, istifa edebilir','loyalty falls; he may quit','忠诚度下降，可能辞职')}]});}}

/* ---------- günlük ve aylık işler ---------- */
function deepDay(day){loanDay(day);if(day%3===0)fillTC();svDay();crewDay(day);
 if(S.pw&&S.pw.until<=day){const c=S.pw.c;S.pw=null;toast(L(CNAME[c]+' limanlarındaki navlun savaşı sona erdi','The freight war in '+CNAME[c]+'’s ports is over',CNAME[c]+'港口的运费战已结束'),'','ok');}
 if(S.pw&&S.pw.mode===1){PORTS.filter(p=>p.c===S.pw.c).forEach(p=>{if(S.offers[p.id])S.offers[p.id]=S.offers[p.id].slice(0,4);});}
 if(Math.floor(day/30)!==S.rivM){S.rivM=Math.floor(day/30);rivMonth();S.tcIdx=clamp(S.tcIdx*rnd(0.95,1.06),0.8,1.25);}
 if(day>=S.rivNext&&!S.ev.some(e=>['poach','war','take'].includes(e.k))){S.rivNext=day+ri(55,110);rivEvent();}}
function deepEv(ev,i,s,d){if(deep3Ev(ev,i,s,d)||lawEv(ev,i,s,d))return;switch(ev.k){
 case 'svy':if(s){if(i===0)doSurvey(s);}return true;
 case 'poach':{let rk=d.rk;const sh=S.ships.find(x=>x.crew[rk]&&x.crew[rk].id===d.pid);if(!sh)return true;const p=sh.crew[rk],r=riv(d.rid),nm=r?r.n:'';
  if(i===0){p.wage=d.w;p.loy=Math.min(100,p.loy+10);toast(L(p.name+' kalıyor',p.name+' is staying',p.name+'留下了'),sh.id,'ok');}
  else if(i===1&&Math.random()<d.ch){p.wage=Math.round(p.wage*1.15/50)*50;p.loy=Math.min(100,p.loy+4);toast(L(p.name+' zammı kabul etti, kalıyor',p.name+' accepted the raise and is staying',p.name+'接受了加薪，决定留下'),sh.id,'ok');}
  else{toast(L(p.name+', '+nm+' şirketine geçiyor',p.name+' is moving to '+nm,p.name+'将跳槽到'+nm),sh.id,'bad');crewLeave(sh,rk,()=>L(nm+' şirketine geçti','joined '+nm,'跳槽到'+nm));}return true;}
 case 'war':{const r=riv(d.rid);S.pw={c:d.c,until:S.day+60,mode:i,rid:d.rid};if(i===0){if(r)r.v*=0.92;addRel(d.c,3);addRep(1);}else if(r)r.v*=1.05;return true;}
 case 'take':{const r=riv(d.rid);if(!r)return true;if(i===0)takeOver(r,d.price);return true;}
 case 'bonus':{const f=i===0?1:i===1?0.5:0,m=i===2?-10:20*f,lo=i===2?-6:8*f;if(f)pay(i===0?d.full:d.half,'personel');S.ships.forEach(s=>{s.morale=clamp(s.morale+m,0,100);ROLES.forEach(r=>{const p=s.crew[r.k];if(p)p.loy=clamp(p.loy+lo,0,100);});});return true;}
 case 'ret':{const sh=S.ships.find(x=>x.crew[d.rk]&&x.crew[d.rk].id===d.pid);if(!sh)return true;const p=sh.crew[d.rk];
  if(i===0){pay(d.cost,'personel');sh.morale=Math.min(100,sh.morale+15);S.ships.forEach(x=>ROLES.forEach(r=>{const q=x.crew[r.k];if(q&&q!==p)q.loy=Math.min(100,q.loy+4);}));addRep(0.5);crewLeave(sh,d.rk,()=>L('emekli oldu','retired','退休'));}
  else if(i===1&&Math.random()<d.ch){p.retAsk=S.day+365;p.wage=Math.round(p.wage*1.1/50)*50;toast(L(p.name+' bir yıl daha kalacak',p.name+' will stay one more year',p.name+'将再留一年'),sh.id,'ok');}
  else{sh.morale=Math.max(0,sh.morale-5);crewLeave(sh,d.rk,()=>L('emekli oldu','retired','退休'));}return true;}
 case 'promo':{const sh=S.ships.find(x=>x.crew[d.rk]&&x.crew[d.rk].id===d.pid);if(!sh)return true;const p=sh.crew[d.rk];
  if(i===0){if(sh.port)doPromo(sh,d.rk,d.to);else{p.promoTo=d.to;toast(L(p.name+' bir sonraki limanda terfi edecek',p.name+' will be promoted at the next port',p.name+'将在下一个港口晋升'),sh.id,'ok');}}
  else if(i===1){p.wage=Math.round(p.wage*1.15/50)*50;p.loy=Math.min(100,p.loy+5);p.proAsk=S.day+300;}
  else{p.loy=Math.max(0,p.loy-20);p.proAsk=S.day+200;}return true;}}
 return false;}
