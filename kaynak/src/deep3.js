/* ================= DERİNLİK 3: karbon kuralları, terminaller, kadetler, sözleşmeler, kurtarma ve avarya, riskli bölgeler ================= */

function initDeep3(){S.term=S.term||{};if(S.eua===undefined)S.eua=rnd(75,95);S.cprog=S.cprog||0;S.cpool=S.cpool||[];S.leave=S.leave||[];
 if(!S.rz)S.rz={red:2,aden:1,guinea:2,hormuz:1,bsea:1};if(!S.rpol)S.rpol={ins:1,grd:1,avoid:0};S.rnext=S.rnext||Math.floor(S.day)+ri(60,120);
 S.ships.forEach(s=>{if(s.cad===undefined)s.cad=[];ROLES.forEach(r=>{const p=s.crew[r.k];if(p&&p.ce===undefined)p.ce=Math.floor(S.day)+ri(20,150);});});
 if(!S.cpool.length)fillCadets();setRouting();
 if(!S.v19){S.v19=1;if(S.day>2&&S.ships.length)pushInfo(()=>L('Yenilikler: karbon, terminal, kadet, sözleşmeler','What’s new: carbon, terminals, cadets, contracts','新内容：碳排放、码头、实习生、合同'),()=>L('Gemiler artık yıl sonunda karbon notu (CII) alıyor ve AB seferlerinde karbon bedeli ödeniyor; gemi › Durum’dan ekonomik seyir açabilirsin. Şirket seviyesi 3’te limanlardan terminal alabilirsin. Personelin sözleşmeleri var; süresi dolanları havalimanı olan limanlarda değiştir. Ofis’ten kadet programını ve riskli bölge politikanı (sigorta, silahlı koruma, Kızıldeniz) seçebilirsin. Ayrıntılar Yardım’da.','Ships now get a carbon rating (CII) at the end of each year and EU voyages pay a carbon charge; you can switch on slow steaming under ship › Status. From company level 3 you can buy terminals at ports. Crew now have contracts; relieve those who are due at ports with an airport. In the Office you can start a cadet programme and set your high-risk area policy (insurance, armed guards, the Red Sea). Details are in Help.','船舶现在每年年底获得碳强度评级（CII），往返欧盟的航次需支付碳排放费；可以在 船舶 › 状态 中开启经济航速。公司等级达到3后可以在港口购买码头。船员现在有合同；到期的船员要在有机场的港口换班。在办公室可以启动实习生计划并设定高风险海域政策（保险、武装护卫、红海）。详情见帮助。'));}}
const gameYear=d=>2027+Math.floor((d===undefined?S.day:d)/365);

/* ---------- karbon: CII notu, ekonomik seyir, AB emisyon bedeli ---------- */
const EUP=()=>PORTS.filter(p=>EU.includes(p.c)).map(p=>p.id);
const isEU=pid=>!!PORT[pid]&&EU.includes(PORT[pid].c);
const CIIB=['A','B','C','D','E'];
function ciiRef(cls){const c=CLS[cls];return ((c.cons[0]+c.cons[1])/2)/(((c.spd[0]+c.spd[1])/2)*24*((c.dwt[0]+c.dwt[1])/2));}
function ciiReq(y){return 1-0.017*Math.min(10,(y||gameYear())-2026);}
function slowFrac(s){return (s.sdy||0)>20?(s.sly||0)/s.sdy:(s.slow?1:0);}
function ciiAtt(s){const q=1+0.4*((s.cons/(s.spd*24*s.dwt))/ciiRef(s.cls)-1);
 return q*(1+0.005*(s.age-12))*(s.cond<70?1+(70-s.cond)/250:1)*(up(s,'prop')?0.95:1)*(up(s,'coat')?0.97:1)*(up(s,'eng')?0.97:1)*(s.lngf?0.75:1)*(1-0.18*slowFrac(s));}
function ciiRatio(s,y){return ciiAtt(s)/ciiReq(y);}
function ciiBand(r){return r<=0.92?0:r<=1.0?1:r<=1.1?2:r<=1.21?3:4;}
const ciiNow=s=>ciiBand(ciiRatio(s));
const ciiOf=s=>s.cii===undefined?2:s.cii;
function ciiMul(s){return [1.04,1.02,1,0.96,0.9][ciiOf(s)];}
function ciiBanned(s){return ciiOf(s)===4;}
function ciiYear(){tip('cii');const y=gameYear()-1,A=[0,0,0,0,0];for(const s of S.ships){const b=ciiBand(ciiRatio(s,y));s.cii=b;s.ciiY=y;s.cf=0;s.cd=0;s.sdy=0;s.sly=0;A[b]++;}
 if(!S.ships.length)return;const ban=S.ships.filter(ciiBanned).map(s=>s.name);
 pushInfo(()=>L(y+' karbon notları',y+' carbon ratings',y+'年碳强度评级'),()=>L('Gemilerinin '+y+' yılı karbon yoğunluğu notları (CII): '+CIIB.map((b,i)=>A[i]?b+' '+A[i]:'').filter(Boolean).join(', ')+'. A ve B notlu gemilere yük sahipleri biraz fazla öder, D ve E notlulara daha az. '+(ban.length?ban.join(', ')+' E notu yüzünden Avrupa Birliği limanlarına giremez. ':'')+'Kurallar her yıl yaklaşık %2 sıkılaşıyor; ekonomik seyir, makine revizyonu ve yeni gemiler notu iyileştirir.',
  'Your ships’ carbon intensity ratings (CII) for '+y+': '+CIIB.map((b,i)=>A[i]?b+' '+A[i]:'').filter(Boolean).join(', ')+'. Cargo owners pay a little more for A and B ships and less for D and E. '+(ban.length?ban.join(', ')+' cannot enter EU ports because of an E rating. ':'')+'The rules tighten by about 2% a year; slow steaming, engine overhauls and new ships improve the rating.',
  '你的船舶'+y+'年碳强度评级（CII）：'+CIIB.map((b,i)=>A[i]?b+' '+A[i]:'').filter(Boolean).join('，')+'。货主对A、B级船舶的运费略高，对D、E级船舶的运费较低。'+(ban.length?ban.join('，')+'因E级不得进入欧盟港口。':'')+'规则每年收紧约2%；经济航速、主机大修和新船都能改善评级。'));}
function etsShare(a,b){return isEU(a)&&isEU(b)?1:isEU(a)||isEU(b)?0.5:0;}
function etsPhase(){return gameYear()<=2027?0.7:1;}
function etsCalc(fuel,a,b){return Math.round(fuel*3.114*etsShare(a,b)*S.eua*etsPhase()/10)*10;}
function etsArrive(s,v){if(!v||!v.fu)return;const c=etsCalc(v.fu,v.from,v.to);if(c<=0)return;pay(c,'karbon',s);const co=Math.round(v.fu*3.114);
 logMsg(()=>L(s.name+': AB emisyon bedeli '+USD(c)+' ('+N(co)+' t CO₂)',s.name+': EU emissions charge '+USD(c)+' ('+N(co)+' t CO₂)',s.name+'：欧盟排放费'+USD(c)+'（'+N(co)+'吨二氧化碳）'));}

/* ---------- terminaller ---------- */
const TERML=[null,['Rıhtım','Berth','泊位'],['Terminal','Terminal','码头'],['Büyük terminal','Major terminal','大型码头']];
function termBase(pid){return Math.round(5e6*(1+0.25*portTier(pid))*(1+congBase(pid)*0.15)/1e5)*1e5;}
function termCost(pid,lvl){return Math.round(termBase(pid)*[0,1,1.4,1.9][lvl]/1e4)*1e4;}
function termMax(){const c=coLv();return c>=5?3:c>=4?2:c>=3?1:0;}
function termWhy(pid){const t=S.term[pid];if(t&&t.lvl>=3)return L('en üst seviyede','at the top level','已达最高等级');if(!t){if(coLv()<3)return L('şirket seviyesi 3 gerekli','company level 3 required','需要公司等级3');if(Object.keys(S.term).length>=termMax())return L('şirket seviyen bu kadar terminale yetiyor','your company level allows no more terminals','公司等级不允许更多码头');if(!portUnl(pid))return L('liman kilitli','port locked','港口未解锁');if(rel(PORT[pid].c)<35)return L('bu ülkeyle ilişkiler yetersiz','relations with this country are too poor','与该国关系不足');}
 const c=termCost(pid,(t?t.lvl:0)+1);if(!canPay(c))return L('nakit yetmiyor','not enough cash','现金不足');return '';}
function termBuy(pid){const w=termWhy(pid);if(w){toast(w,'','bad');return;}const t=S.term[pid],lv=(t?t.lvl:0)+1,c=termCost(pid,lv);pay(c,'terminal');
 if(t){t.lvl=lv;t.inv+=c;}else S.term[pid]={lvl:lv,inv:c,t0:Math.floor(S.day),inc:0};addRel(PORT[pid].c,4);addRep(lv);
 logMsg(()=>L(PORT[pid].n+': '+tx(TERML[lv])+(t?' seviyesine büyütüldü':' kuruldu')+', '+USD(c),PORT[pid].n+': '+tx(TERML[lv])+(t?' upgrade':' opened')+', '+USD(c),PORT[pid].n+'：'+(t?'升级为':'建成')+tx(TERML[lv])+'，'+USD(c)));toast(L('Terminal hazır: ','Terminal ready: ','码头就绪：')+PORT[pid].n,'','ok');save();}
function termSell(pid){const t=S.term[pid];if(!t)return;const v=Math.round(t.inv*0.8/1e4)*1e4;earn(v,'terminal');delete S.term[pid];
 logMsg(()=>L(PORT[pid].n+' terminali satıldı: '+USD(v),PORT[pid].n+' terminal sold: '+USD(v),PORT[pid].n+'码头已出售：'+USD(v)));save();}
function termMonth(){for(const pid in S.term){const t=S.term[pid],b=termBase(pid),rev=Math.round(b*0.014*[0,1,2.1,3.3][t.lvl]*rnd(0.85,1.15)*(S.strike[pid]>S.day?0.4:1)/100)*100,cost=Math.round(b*0.0025*t.lvl/100)*100;
 earn(rev,'terminal');pay(cost,'terminal');t.inc=rev-cost;t.tot=(t.tot||0)+rev-cost;}}
const hasTerm=pid=>!!(S.term&&S.term[pid]);

/* ---------- kadet programı ---------- */
function mkCadet(){const nat=wpick(NATS,NATW),[f,l]=NAMES[nat],fn=pick(f),ln=pick(l),track=Math.random()<0.5?'deck':'eng';return {id:S.nid++,nat,name:nat==='CN'?ln+' '+fn:fn+' '+ln,track,pot:ri(1,5),age:ri(19,23),sd:0};}
function fillCadets(){S.cpool=(S.cpool||[]).slice(-3);while(S.cpool.length<6)S.cpool.push(mkCadet());}
const CADW=600,CPROG=3000;
function cadetAdd(sid,cid){const s=S.ships.find(x=>x.id===sid),i=S.cpool.findIndex(c=>c.id===cid);if(!s||i<0)return false;if(!S.cprog){toast(L('Önce Ofis’ten kadet programını başlat','Start the cadet programme in the Office first','请先在办公室启动实习生计划'),'','bad');return false;}
 if(!s.port){toast(L('Kadet limanda katılır','Cadets join in port','实习生须在港口上船'),'','bad');return false;}if((s.cad||[]).length>=2){toast(L('Bir gemide en fazla iki kadet olur','A ship can take at most two cadets','每艘船最多两名实习生'),'','bad');return false;}
 const c=S.cpool.splice(i,1)[0];c.since=Math.floor(S.day);s.cad=s.cad||[];s.cad.push(c);pay(800,'personel',s);S.cpool.push(mkCadet());
 logMsg(()=>L(s.name+': kadet '+c.name+' ('+(c.track==='deck'?'güverte':'makine')+') gemiye katıldı',s.name+': '+(c.track==='deck'?'deck':'engine')+' cadet '+c.name+' joined',s.name+'：'+(c.track==='deck'?'甲板':'轮机')+'实习生'+c.name+'上船'));save();return true;}
function cadetGrad(s,c){const role=c.track==='deck'?'zab':'c2',ment=sk(s,c.track==='deck'?'kap':'cb'),skill=clamp(Math.round(1+c.pot*0.45+(ment>=4?1:0)+rnd(-0.4,0.4)),1,4),nat=c.nat;
 return personInit({id:S.nid++,role,skill,nat,name:c.name,exp:1,wage:Math.round(ROLE[role].base*WMUL[skill]*0.85/50)*50,xp:0,age:c.age+1,loy:85,own:1});}
function cadetDay(){if(S.cprog)pay(CPROG/30,'ofis');for(const s of S.ships){if(!s.cad||!s.cad.length)continue;pay(CADW/30*s.cad.length,'personel',s);const sea=s.state==='sea'||(s.state==='tc'&&s.voy);
 for(const c of s.cad.slice()){if(sea)c.sd++;if(s.morale<25&&Math.random()<0.004){s.cad.splice(s.cad.indexOf(c),1);toast(L(s.name+': kadet '+c.name+' moral bozukluğundan programı bıraktı',s.name+': cadet '+c.name+' quit the programme over low morale',s.name+'：实习生'+c.name+'因士气低落退出计划'),s.id,'bad');continue;}
  if(c.sd>=300&&!c.done&&!S.ev.some(e=>e.k==='grad')){c.done=1;const p=cadetGrad(s,c),role=p.role,cur=s.crew[role];c.pid=p.id;c.grad=p;
   pushEv({k:'grad',sid:s.id,title:()=>L('Kadet mezun oldu: ','Cadet graduated: ','实习生结业：')+c.name,body:()=>L(c.name+', '+s.name+' gemisinde bir yıllık deniz stajını bitirdi ve '+ROLE[role].n.toLocaleLowerCase('tr')+' olmaya hazır: '+p.skill+' yıldız, maaşı piyasanın %15 altında, sana çok bağlı.'+(cur?' Gemideki '+ROLE[role].n.toLocaleLowerCase('tr')+' '+cur.name+' '+cur.skill+' yıldızlı.':''),c.name+' has finished a year of sea training on '+s.name+' and is ready to serve as '+ROLE[role].n.toLowerCase()+': '+p.skill+' stars, pay 15% below market, very loyal to you.'+(cur?' The current '+ROLE[role].n.toLowerCase()+' '+cur.name+' has '+cur.skill+' stars.':''),c.name+'已在'+s.name+'完成一年海上实习，可以担任'+ROLE[role].n+'：'+p.skill+'星，工资比市场低15%，对你非常忠诚。'+(cur?'现任'+ROLE[role].n+cur.name+'为'+cur.skill+'星。':'')),d:{cid:c.id},
    opts:[{l:()=>L('Bu gemide göreve başlasın','Put them to work on this ship','在本船任职'),s:()=>cur?L('mevcut '+ROLE[role].n.toLocaleLowerCase('tr')+' acenteye döner','the current '+ROLE[role].n.toLowerCase()+' goes back to the agency','现任'+ROLE[role].n+'回到中介'):L('boş göreve atanır','fills the vacancy','填补空缺')},{l:()=>L('Acentede beklesin','Keep them at the agency','留在中介待命'),s:()=>L('istediğin gemiye sonra atarsın (6 ay bekler)','assign them to any ship later (waits 6 months)','以后可派到任意船上（等待6个月）')}]});}}}}
function gradApply(s,c,i){const p=c.grad;if(!p)return;s.cad.splice(s.cad.indexOf(c),1);
 if(i===0&&s.port){const old=s.crew[p.role];if(old){old.since=undefined;S.pool.push(old);}s.crew[p.role]=p;p.since=Math.floor(S.day);p.ce=Math.floor(S.day)+ri(150,200);}
 else if(i===0){p.poolT=S.day;S.pool.push(p);s.pendGrad=p.id;}
 else{p.poolT=S.day;S.pool.push(p);}
 logMsg(()=>L(p.name+' mezun oldu: '+ROLE[p.role].n+' ('+p.skill+' yıldız)',p.name+' graduated: '+ROLE[p.role].n.toLowerCase()+' ('+p.skill+' stars)',p.name+'结业：'+ROLE[p.role].n+'（'+p.skill+'星）'));}

/* ---------- sözleşmeler ve personel değişimi ---------- */
const CONTR={kap:120,cb:120,zab:160,c2:160,asc:240};
const NOAIR=['TRP','ALG','NOV','BND','KHI','CGP','DKR','MBA','SSZ'];
const crewAir=pid=>!!pid&&!NOAIR.includes(pid)&&rel(PORT[pid].c)>=30;
const NATH={TR:[33,39],PH:[121,14],UA:[31,49],IN:[77,20],GE:[44,42],AZ:[49,40],ID:[107,-6],CN:[116,40]};
function travelCost(p,pid){const h=NATH[p.nat]||[30,40],P=PORT[pid],d=hav([h[0],h[1]],[P.lon,P.lat]);return Math.round((700+d*0.32)/50)*50;}
const ceLeft=p=>p.ce===undefined?999:p.ce-S.day;
const dueCrew=s=>ROLES.filter(r=>s.crew[r.k]&&ceLeft(s.crew[r.k])<=0);
/* süresi dolan denizciyi izne gönderip yerine benzer birini alır */
function crewChange(s,rk){if(!s.port||!crewAir(s.port))return false;const p=s.crew[rk];if(!p)return false;
 const want=p.skill,A=S.pool.filter(q=>q.role===rk).sort((a,b)=>(b.own||b.ret?1:0)-(a.own||a.ret?1:0)||Math.abs(a.skill-want)-Math.abs(b.skill-want)||a.wage-b.wage);if(!A.length)return false;
 const q=A[0],c=travelCost(p,s.port)+travelCost(q,s.port);delete s.crew[rk];S.leave.push({p,back:Math.floor(S.day)+ri(45,90)});
 S.pool.splice(S.pool.indexOf(q),1);s.crew[rk]=q;q.since=Math.floor(S.day);q.ce=Math.floor(S.day)+CONTR[rk]+ri(-15,15);pay(c,'personel',s);q.poolT=undefined;
 if(S.pool.filter(x=>x.role===rk).length<3)S.pool.push(mkPerson(rk,rndSkill()));
 logMsg(()=>L(s.name+': '+ROLE[rk].n+' değişimi, '+p.name+' izne çıktı, yerine '+q.name+' geldi (yol '+USD(c)+')',s.name+': '+ROLE[rk].n.toLowerCase()+' change, '+p.name+' went on leave, '+q.name+' joined (travel '+USD(c)+')',s.name+'：'+ROLE[rk].n+'换班，'+p.name+'休假，'+q.name+'上船（差旅'+USD(c)+'）'));return true;}
function crewChangeAll(s){let n=0;for(const r of dueCrew(s))if(crewChange(s,r.k))n++;return n;}
function extendAll(s){for(const r of dueCrew(s)){const p=s.crew[r.k];p.ce=Math.floor(S.day)+30;p.loy=Math.max(0,p.loy-6);s.morale=Math.max(0,s.morale-4);}}
function contractDay(){for(const s of S.ships){for(const r of ROLES){const p=s.crew[r.k];if(!p)continue;if(p.ce===undefined)p.ce=Math.floor(S.day)+CONTR[r.k];const lf=ceLeft(p);
  if(Math.floor(lf)===0&&!managed(s))toast(L(s.name+': '+ROLE[r.k].n.toLocaleLowerCase('tr')+' '+p.name+' sözleşmesi doldu',s.name+': '+p.name+' ('+ROLE[r.k].n.toLowerCase()+') has finished the contract',s.name+'：'+ROLE[r.k].n+p.name+'合同期满'),s.id,'warn');
  if(lf<0){s.morale=Math.max(0,s.morale-0.35);p.loy=Math.max(0,p.loy-0.1);}}
  if(s.port&&crewAir(s.port)&&managed(s)&&dueCrew(s).length)crewChangeAll(s);
  if(s.port&&s.state!=='sea'){for(const r of ROLES){const p=s.crew[r.k];if(p&&ceLeft(p)<-45){const c=travelCost(p,s.port)*2+10000;pay(c,'ceza',s);addRep(-2);if(S.yr)S.yr.walk++;delete s.crew[r.k];if(Math.random()<0.5){const pn=p.name;lawOpen('crew',s,p.wage*rnd(6,10)+45000,0.25,()=>L(pn+', sözleşmesi bittiği hâlde gemide tutulduğu için ücret ve tazminat davası açtı.',pn+' has sued for wages and compensation after being kept on board past the end of the contract.',pn+'因合同期满后仍被留在船上，起诉索要工资和赔偿。'));}S.leave.push({p,back:Math.floor(S.day)+120});p.loy=20;
   pushInfo(()=>L('Personel gemiyi terk etti: ','Crew walked off: ','船员离船：')+s.name,()=>L(p.name+' ('+ROLE[r.k].n+') sözleşmesi 45 günden fazla uzatıldığı için ITF’ye şikâyette bulundu ve gemiden ayrıldı. Ceza ve dönüş masrafı '+USD(c)+'. Yerine personel ata.',p.name+' ('+ROLE[r.k].n.toLowerCase()+') complained to the ITF after being kept on more than 45 days past the contract, and left the ship. Fine and repatriation '+USD(c)+'. Hire a replacement.',p.name+'（'+ROLE[r.k].n+'）因合同超期45天以上向国际运输工人联合会投诉并离船。罚款和遣返费用'+USD(c)+'。请招募替补。'));}}}}
 for(const l of S.leave.slice()){if(S.day>=l.back){S.leave.splice(S.leave.indexOf(l),1);const p=l.p;if(p.loy>=45){p.ret=1;p.poolT=S.day;S.pool.push(p);}}}
 S.pool=S.pool.filter(p=>!((p.own||p.ret)&&p.poolT!==undefined&&S.day-p.poolT>180));}

/* ---------- kurtarma ve müşterek avarya ---------- */
const SHIPS2=['Sea Falcon','Nordic Star','Asian Pearl','Ocean Grace','Blue Horizon','Kota Mas','Maria K','Atlantic Hope','Golden Wave','Cape Iris'];
function sarRoll(s){if(s.state!=='sea'||!s.voy||S.ev.some(e=>e.sid===s.id)||Math.random()>0.0018)return;const nm=pick(SHIPS2),k=pick(['fire','flood','engine']),crew=ri(12,24),rw=Math.round(rnd(80,520)/10)*10000,dl=Math.round(rnd(1,2.2)*10)/10;
 const what={fire:['yangın çıktı','is on fire','发生火灾'],flood:['su alıyor','is taking on water','正在进水'],engine:['makinesi durdu, fırtınada sürükleniyor','has lost her engine and is drifting in heavy weather','主机失灵，在风暴中漂流']}[k];
 pushEv({k:'sar',sid:s.id,title:()=>L('İmdat çağrısı: ','Distress call: ','求救信号：')+nm,body:()=>L('Kaptan bildiriyor: yakınlardaki yük gemisi '+nm+' '+what[0]+', gemide '+crew+' kişi var. En yakın gemi biziz. Rotayı değiştirirsek yaklaşık '+D1(dl)+' gün kaybederiz.','The captain reports: the nearby cargo ship '+nm+' '+what[1]+', with '+crew+' people on board. We are the closest ship. Changing course will cost about '+D1(dl)+' days.','船长报告：附近的货船'+nm+what[2]+'，船上有'+crew+'人。我们是离得最近的船。改变航向大约会损失'+D1(dl)+'天。'),d:{rw,dl,crew,nm},
  opts:[{l:()=>L('Rotayı değiştir, yardıma git','Change course and help','改变航向前往救援'),s:()=>L('gemi kurtarılırsa kurtarma ödülü, her durumda itibar','a salvage award if the ship is saved, reputation either way','若救下船舶可获救助报酬，无论结果都提升声誉')},{l:()=>L('Sahil güvenliğe haber ver, devam et','Alert the coast guard and carry on','通知海岸警卫队并继续航行'),s:()=>L('denizcilik kurallarına aykırı; soruşturma olabilir','against the rules of the sea; there may be an inquiry','违反海上救助义务，可能被调查')}]});}
function gaRoll(s){if(s.state!=='sea'||!s.voy||S.ev.some(e=>e.sid===s.id))return;const p=0.0005*(s.cond<50?2:1)*(up(s,'eng')?0.7:1);if(Math.random()>p)return;
 const k=pick(['fire','ground']),C=Math.round((80000+s.dwt*3)*(1.25-s.cond/100)/1000)*1000,dl=ri(6,12),what={fire:['makine dairesinde yangın','an engine-room fire','机舱火灾'],ground:['karaya oturma','a grounding','搁浅']}[k];
 if(S.yr)S.yr.acc++;if(!s.cargo){pay(C,'bakım',s);s.hold=(s.hold||0)+dl;s.cond=Math.max(15,s.cond-18);pushInfo(()=>L('Kaza: ','Casualty: ','事故：')+s.name,()=>L(s.name+' gemisinde '+what[0]+'. Hasar '+USD(C)+', '+dl+' gün kayıp.','Casualty on '+s.name+': '+what[1]+'. Damage '+USD(C)+', '+dl+' days lost.',s.name+'发生'+what[2]+'。损失'+USD(C)+'，耽误'+dl+'天。'));return;}
 s.hold=(s.hold||0)+dl;s.cond=Math.max(15,s.cond-18);
 pushEv({k:'ga',sid:s.id,title:()=>L('Kaza: ','Casualty: ','事故：')+s.name,body:()=>L(s.name+' gemisinde '+what[0]+'. Gemi ve yük kurtarıldı ama kurtarma ve onarım masrafı '+USD(C)+', '+dl+' gün kayıp. Müşterek avarya ilan edersen bu masrafın bir kısmını yük sahipleri öder.','Casualty on '+s.name+': '+what[1]+'. Ship and cargo were saved, but salvage and repairs cost '+USD(C)+' and '+dl+' days are lost. If you declare general average, the cargo owners pay part of the cost.',s.name+'发生'+what[2]+'。船货均已保住，但救助和修理费用'+USD(C)+'，耽误'+dl+'天。如果宣布共同海损，货主将分担部分费用。'),d:{C},
  opts:[{l:()=>L('Müşterek avarya ilan et','Declare general average','宣布共同海损'),s:()=>L('sen '+USD(Math.round(C*0.6))+' ödersin (eksper dahil) · yük sahipleri kızar','you pay '+USD(Math.round(C*0.6))+' (incl. adjusters) · cargo owners are unhappy','你承担'+USD(Math.round(C*0.6))+'（含理算费）· 货主不满')},{l:()=>L('Tüm masrafı üstlen','Bear the whole cost','承担全部费用'),s:()=>USD(C)+L(' · itibar artar',' · reputation rises',' · 声誉提升')}]});}
function sarApply(s,d,i){if(i===0){s.hold=(s.hold||0)+d.dl;const ok=Math.random()<0.55+0.07*sk(s,'kap');addRep(ok?4:2);
  if(ok){earn(d.rw,'kurtarma');pushInfo(()=>L('Kurtarma başarılı','Rescue successful','救援成功'),()=>L(s.name+' mürettebatı '+d.nm+' gemisindeki '+d.crew+' kişiyi kurtardı ve gemiyi yedeğe alıp limana çekti. Kurtarma ödülü '+USD(d.rw)+'.','The crew of '+s.name+' rescued all '+d.crew+' people on '+d.nm+' and towed her to port. Salvage award '+USD(d.rw)+'.',s.name+'的船员救起了'+d.nm+'上的'+d.crew+'人，并把该船拖回港口。救助报酬'+USD(d.rw)+'。'));}
  else pushInfo(()=>L('Can kurtarıldı','Lives saved','人员获救'),()=>L(d.nm+' battı ama '+s.name+' mürettebatı '+d.crew+' kişiyi kurtardı. Denizcilik basını olayı övgüyle yazdı.',d.nm+' sank, but the crew of '+s.name+' rescued all '+d.crew+' people. The shipping press praised them.',d.nm+'沉没了，但'+s.name+'的船员救起了全部'+d.crew+'人。航运媒体对此大加赞扬。'));
  s.morale=Math.min(100,s.morale+10);logMsg(()=>L(s.name+' '+d.nm+' gemisinin imdat çağrısına yanıt verdi',s.name+' answered the distress call of '+d.nm,s.name+'响应了'+d.nm+'的求救'));}
 else{addRep(-2);if(Math.random()<0.35){const nm=d.nm;lawOpen('sar',s,rnd(220000,520000)+s.dwt*6,0.3,()=>L('Bayrak devleti, '+s.name+' gemisinin '+nm+' gemisinin imdat çağrısına yanıt vermediğini tespit etti ve SOLAS’a aykırılıktan soruşturma açtı. Olay basına yansıdı.','The flag state found that '+s.name+' failed to answer the distress call of '+nm+' and opened an inquiry for breaching SOLAS. The story reached the press.','船旗国查明'+s.name+'未响应'+nm+'的求救，以违反SOLAS公约为由展开调查，事件见诸报端。'));}}}
function gaApply(s,d,i){if(i===0){pay(Math.round(d.C*0.6),'bakım',s);addRep(-1);logMsg(()=>L(s.name+': müşterek avarya ilan edildi',s.name+': general average declared',s.name+'：宣布共同海损'));}else{pay(d.C,'bakım',s);addRep(2);}}

/* ---------- riskli bölgeler ---------- */
const RZ={red:{n:['Güney Kızıldeniz','Southern Red Sea','红海南部'],b:[[38,12,44,20]],k:'war'},aden:{n:['Aden Körfezi ve Somali','Gulf of Aden and Somalia','亚丁湾和索马里'],b:[[43,10,58,16],[48,0,62,10]],k:'pir'},guinea:{n:['Gine Körfezi','Gulf of Guinea','几内亚湾'],b:[[-4,-2,9,7]],k:'pir'},hormuz:{n:['Hürmüz Boğazı','Strait of Hormuz','霍尔木兹海峡'],b:[[54,24.5,58,27.5]],k:'seize'},bsea:{n:['Kuzey Karadeniz','Northern Black Sea','黑海北部'],b:[[30,43,40,47]],k:'mine'}};
const RZL=[['sakin','calm','平静'],['dikkat','caution','注意'],['yüksek','high','高'],['çok yüksek','very high','极高']];
function rzLvl(z){let l=(S.rz&&S.rz[z])||0;if(z==='red'&&S.pol&&S.pol.cr.redsea)l=Math.max(l,2);if(z==='hormuz'&&S.pol&&S.pol.cr.hormuz)l=Math.max(l,2);return clamp(l,0,3);}
function rzAt(lon,lat){for(const z in RZ)for(const b of RZ[z].b)if(lon>=b[0]&&lon<=b[2]&&lat>=b[1]&&lat<=b[3])return z;return null;}
function rzRoute(path){const out=new Set();for(let i=0;i<path.length;i++){const n=NODE[path[i]];if(!n)continue;const z=rzAt(n[0],n[1]);if(z)out.add(z);if(i){const m=NODE[path[i-1]];if(m){const z2=rzAt((n[0]+m[0])/2,(n[1]+m[1])/2);if(z2)out.add(z2);}}}return [...out].filter(z=>rzLvl(z)>0);}
function rzCost(s,z){const l=rzLvl(z),v=shipValue(s),ins=RZ[z].k==='pir'?v*0.0006*l:v*0.0012*l,grd=RZ[z].k==='pir'?(z==='guinea'?25000:18000):0;return {ins:Math.round(ins/100)*100,grd};}
function rzEst(s,path){const zs=rzRoute(path);let cost=0;for(const z of zs){const c=rzCost(s,z);cost+=(S.rpol.ins?c.ins:0)+(S.rpol.grd?c.grd:0);}return {zs,cost};}
function rzEnter(s,z){const v=s.voy;v.rz=v.rz||{};if(v.rz[z])return;const c=rzCost(s,z),r={ins:!!S.rpol.ins,grd:!!S.rpol.grd&&c.grd>0};v.rz[z]=r;
 if(r.ins&&c.ins){pay(c.ins,'sigorta',s);}if(r.grd){pay(c.grd,'sigorta',s);}
 if((r.ins&&c.ins)||r.grd)logMsg(()=>L(s.name+': '+tx(RZ[z].n)+' için '+(r.ins?'savaş riski sigortası':'')+(r.ins&&r.grd?' ve ':'')+(r.grd?'silahlı koruma':'')+' '+USD((r.ins?c.ins:0)+(r.grd?c.grd:0)),s.name+': '+(r.ins?'war-risk cover':'')+(r.ins&&r.grd?' and ':'')+(r.grd?'armed guards':'')+' for '+tx(RZ[z].n)+' '+USD((r.ins?c.ins:0)+(r.grd?c.grd:0)),s.name+'：'+tx(RZ[z].n)+(r.ins?'战争险':'')+(r.ins&&r.grd?'和':'')+(r.grd?'武装护卫':'')+USD((r.ins?c.ins:0)+(r.grd?c.grd:0))));}
function rzDay(){for(const s of S.ships){const sea=s.state==='sea'&&s.voy;if(!sea)continue;const p=posOn(s.voy),z=rzAt(p.lon,p.lat);if(!z)continue;const l=rzLvl(z);if(!l)continue;rzEnter(s,z);const r=s.voy.rz[z],K=RZ[z].k;
 let pr={pir:0.025,war:0.02,seize:0.012,mine:0.01}[K]*l*(K==='pir'&&r.grd?0.15:1)*(up(s,'sec')?0.5:1);if(Math.random()>pr||S.ev.some(e=>e.sid===s.id))continue;rzHit(s,z,r);}}
function rzHit(s,z,r){const K=RZ[z].k,zn=tx(RZ[z].n);let cost=0,days=0,cov=0,msg;
 if(K==='pir'){if(r.grd&&Math.random()<0.9){toast(L(s.name+': korsan saldırısı silahlı korumayla püskürtüldü',s.name+': pirates driven off by the armed guards',s.name+'：武装护卫击退了海盗'),s.id,'ok');s.morale=Math.max(0,s.morale-6);return;}
  cost=Math.round((z==='guinea'?150000:280000)+s.dwt*3);days=ri(12,25);cov=r.ins?0.8:0;s.morale=Math.max(0,s.morale-40);
  msg=[(z==='guinea'?'Korsanlar gemiye çıktı ve üç denizciyi kaçırdı. ':'Gemi korsanların eline geçti. ')+'Fidye ve aracı masrafı '+USD(cost)+(cov?', sigorta %80’ini karşıladı':'')+'. Gemi '+days+' gün tutuldu.',(z==='guinea'?'Pirates boarded the ship and kidnapped three seafarers. ':'The ship was hijacked by pirates. ')+'Ransom and negotiators cost '+USD(cost)+(cov?'; insurance covered 80%':'')+'. The ship was held for '+days+' days.',(z==='guinea'?'海盗登船并绑架了三名船员。':'船舶被海盗劫持。')+'赎金和谈判费用'+USD(cost)+(cov?'，保险赔付了80%':'')+'。船舶被扣'+days+'天。'];}
 else if(K==='war'){cost=Math.round(60000+s.dwt*1.2);days=3;cov=r.ins?0.9:0;s.cond=Math.max(15,s.cond-15);s.morale=Math.max(0,s.morale-20);msg=['Gemi '+zn+' açıklarında insansız hava aracıyla vuruldu. Hasar '+USD(cost)+(cov?', savaş riski sigortası %90’ını karşıladı':'')+'. Yaralı yok.','The ship was hit by a drone off the '+zn+'. Damage '+USD(cost)+(cov?'; war-risk cover paid 90%':'')+'. No injuries.','船舶在'+zn+'附近遭无人机袭击。损失'+USD(cost)+(cov?'，战争险赔付了90%':'')+'。无人受伤。'];}
 else if(K==='seize'){days=ri(10,30);addRel('IR',-3);msg=['Gemi '+zn+' açıklarında askerler tarafından durdurulup alıkonuldu. '+days+' gün sonra serbest bırakıldı.','The ship was stopped and detained by soldiers off the '+zn+'. She was released after '+days+' days.','船舶在'+zn+'附近被军方拦截扣押，'+days+'天后获释。'];}
 else{cost=Math.round(100000+s.dwt*1.5);days=6;cov=r.ins?0.9:0;s.cond=Math.max(15,s.cond-25);s.morale=Math.max(0,s.morale-25);msg=['Gemi '+zn+' bölgesinde sürüklenen bir mayına çarptı. Hasar '+USD(cost)+(cov?', savaş riski sigortası %90’ını karşıladı':'')+'.','The ship struck a drifting mine in the '+zn+'. Damage '+USD(cost)+(cov?'; war-risk cover paid 90%':'')+'.','船舶在'+zn+'触碰漂雷。损失'+USD(cost)+(cov?'，战争险赔付了90%':'')+'。'];}
 if(cost)pay(Math.round(cost*(1-cov)),'bakım',s);s.hold=(s.hold||0)+days;
 pushInfo(()=>L('Saldırı: ','Attack: ','遇袭：')+s.name,()=>L(msg[0],msg[1],msg[2]));logMsg(()=>L(s.name+': '+zn+' bölgesinde saldırı',s.name+': attacked in the '+zn,s.name+'：在'+zn+'遇袭'));}
function rzMonth(){for(const z in S.rz){if(Math.random()<0.18){const o=S.rz[z];S.rz[z]=clamp(o+(Math.random()<0.5?-1:1),0,3);if(S.rz[z]!==o){const up2=S.rz[z]>o,lv=S.rz[z];rnews(()=>L(tx(RZ[z].n)+': risk '+(up2?'arttı':'azaldı')+' ('+tx(RZL[lv])+')',tx(RZ[z].n)+': risk '+(up2?'rising':'easing')+' ('+tx(RZL[lv])+')',tx(RZ[z].n)+'：风险'+(up2?'上升':'下降')+'（'+tx(RZL[lv])+'）'));}}}}

/* ---------- günlük ve aylık ---------- */
function deep3Day(day){for(const s of S.ships)if(s.state==='sea'||(s.state==='tc'&&s.voy)){s.sdy=(s.sdy||0)+1;if(s.slow)s.sly=(s.sly||0)+1;}
 cadetDay();contractDay();rzDay();for(const s of S.ships){sarRoll(s);gaRoll(s);}
 if(day%365===0&&day>0&&S.ciiDone!==day){S.ciiDone=day;ciiYear();}
 if(Math.floor(day/30)!==S.d3M){S.d3M=Math.floor(day/30);termMonth();rzMonth();S.eua=clamp(S.eua*rnd(0.94,1.07),55,140);if(Math.random()<0.5)fillCadets();}}
function deep3Ev(ev,i,s,d){switch(ev.k){
 case 'sar':if(s)sarApply(s,d,i);return true;
 case 'ga':if(s)gaApply(s,d,i);return true;
 case 'grad':{if(!s)return true;const c=(s.cad||[]).find(x=>x.id===d.cid);if(c)gradApply(s,c,i);return true;}}
 return false;}
