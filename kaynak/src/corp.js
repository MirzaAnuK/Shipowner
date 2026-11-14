/* ================= ŞİRKET YÖNETİMİ: FİLOLAR, ÇALIŞANLAR, BİNA, DİPLOMASİ ================= */
const FLEETS=[{k:'koster',n:'',sh:'',cls:['koster']},{k:'gcargo',n:'',sh:'',cls:['gcargo']},{k:'bulk',n:'',sh:'',cls:['handy','supra','pmax']},{k:'tank',n:'',sh:'',cls:['ctank','mr','afra']},{k:'box',n:'',sh:'',cls:['feeder','cbox']},{k:'roro',n:'',sh:'',cls:['pctc']},{k:'gas',n:'',sh:'',cls:['lng']}];
const FLEET3={koster:[['Koster filosu','Coaster fleet','沿海货船船队'],['Koster','Coaster','沿海货船']],gcargo:[['Genel kargo filosu','General cargo fleet','杂货船船队'],['Genel kargo','General cargo','杂货船']],bulk:[['Dökme yük filosu','Bulk carrier fleet','散货船队'],['Dökme yük','Bulk','散货']],tank:[['Tanker filosu','Tanker fleet','油轮船队'],['Tanker','Tanker','油轮']],box:[['Konteyner filosu','Container fleet','集装箱船队'],['Konteyner','Container','集装箱']],roro:[['Ro-Ro filosu','Ro-Ro fleet','滚装船队'],['Ro-Ro','Ro-Ro','滚装']],gas:[['LNG filosu','LNG fleet','LNG船队'],['LNG','LNG','LNG']]};
const FLEETOF={},FLEET={};FLEETS.forEach(f=>{FLEET[f.k]=f;f.cls.forEach(c=>FLEETOF[c]=f.k);});
const SROLE={mgr:{n:'',base:21000,d:''},insp:{n:'',base:7000,d:''},dip:{n:'',base:7500,d:''},law:{n:'',base:8000,d:''}};
const SROLE3={
 mgr:[['Filo müdürü','Fleet manager','船队经理'],['Filosundaki gemilere yük bulur, ikmali yapar ve sefere çıkarır. İyisi kârlı iş bağlar, kötüsü zarar ettirir. Becerisi özgeçmişten tam anlaşılmaz; yaptığı işlere bak.','Finds cargo for the ships in the fleet, arranges supplies and sends them to sea. A good one closes profitable deals, a bad one loses you money. The CV doesn’t really show skill; judge by results.','为船队中的船舶寻找货源、安排补给并派船出航。好的经理能谈成赚钱的生意，差的会让你亏钱。简历看不出真实能力，要看实际业绩。']],
 insp:[['Makine enspektörü','Technical superintendent','机务主管'],['Gemilerin durumunu izler, bakım zamanı gelince sana sorar. İyisi sorunu erken görür, arızayı azaltır ve bakımı ucuza bağlar.','Monitors the ships’ condition and asks you when maintenance is due. A good one spots trouble early, reduces breakdowns and gets maintenance done cheaply.','监控船舶状况，到了维修时间会征求你的意见。好的机务主管能及早发现问题、减少故障，并以较低成本完成维修。']],
 law:[['Hukuk müşaviri','Legal counsel','法律顾问'],['Şirkete açılan davaları yürütür. İyisi mahkemede kazanma şansını artırır, uzlaşmaları ucuzlatır ve avukatlık masrafını düşürür. Müşavir yoksa her dava dışarıdan pahalı bir büroya gider.','Handles lawsuits against the company. A good one improves your chances in court, makes settlements cheaper and cuts legal fees. Without counsel every case goes to an expensive outside firm.','负责公司的诉讼案件。好的法律顾问能提高胜诉几率、降低和解金额并减少律师费。没有顾问时，每个案件都要交给昂贵的外部律所。']],
 dip:[['Dış ilişkiler müdürü','External relations manager','对外关系经理'],['Ülkelerle ilişkileri yürütür. İlişki kazanımlarını artırır, ticaret heyetlerini ucuzlatır.','Handles relations with countries. Increases relation gains and makes trade delegations cheaper.','负责与各国的关系。提高关系增幅，并降低贸易代表团的费用。']]};
const HQ=[null,
 {n:'',slots:1,cost:0,nw:0,rent:1500,d:''},
 {n:'',slots:3,cost:1.2e6,nw:5e6,lv:1,rent:10000,d:''},
 {n:'',slots:4,cost:6e6,nw:2e7,lv:2,rent:30000,d:''},
 {n:'',slots:5,cost:2.5e7,nw:7e7,lv:3,rent:90000,d:''},
 {n:'',slots:6,cost:9e7,nw:2.2e8,lv:4,rent:220000,d:''}];
const HQ3=[null,
 [['Liman bürosu','Harbour office','港口办事处'],['Rıhtımda kiralık tek oda.','A single rented room on the quay.','码头边租来的一个单间。']],
 [['İş hanında kat','Office floor','写字楼楼层'],['Eski bir iş hanında bütün bir kat.','A whole floor in an old office block.','一栋老写字楼里的整整一层。']],
 [['Müstakil ofis','Office building','独栋办公楼'],['Tabelası sokaktan okunan dört katlı bina.','A four-storey building with a sign you can read from the street.','一栋四层楼，招牌在街上就能看到。']],
 [['Genel müdürlük','Headquarters','总部大楼'],['Cam cepheli genel müdürlük binası.','A glass-fronted headquarters building.','玻璃幕墙的总部大楼。']],
 [['Denizcilik kulesi','Maritime tower','航运大厦'],['Şehrin siluetine giren kule.','A tower that has joined the city skyline.','跻身城市天际线的摩天大楼。']]];
const EU=['GR','IT','ES','NL','DE','RO'];
const CV={hi:['Büyük bir armatörde yıllarca çalıştı','Yirmi yıldır aynı işi yapıyor, piyasayı ezbere bilir','Önceki şirketinde iyi iş çıkardı, referansları sağlam','Yurt dışında uzun süre çalıştı'],mid:['Orta ölçekli bir şirkette çalıştı','Limanları iyi tanır','İşini bilir, parlak değil','Denizden karaya yeni geçti'],lo:['Yeni mezun, çok hevesli','Bir tanıdığın tavsiyesiyle geldi','Son üç işinden kısa sürede ayrıldı','Sektöre yeni girdi']};
const MSIG=[0.85,0.55,0.28,0.14,0.05],MNEG=[0.84,0.92,1,1.05,1.1],MDLY=[1.6,1,0.6,0.35,0.2],ITHR=[56,58,60,62,64],ICF=[1.1,1.03,0.96,0.9,0.84],IBF=[1,0.97,0.93,0.88,0.82],DMUL=[1.1,1.2,1.3,1.45,1.6];
const NOWIN=['pencere açılmasın, bildirim yeter','no window, a notification is enough','不弹窗，通知即可'];
const AUTOLBL={bd:[['Seyirde arıza','Breakdown at sea','航行中故障'],[['mürettebat tamir etsin','crew repairs it','船员自修'],['servis çağrılsın','call a service team','叫维修服务']]],
 storm:[['Fırtına uyarısı','Storm warning','风暴预警'],[['rota değişsin','change course','改变航线'],['rotada kalınsın','stay on course','保持航线']]],
 bilge:[['Sintine tankı','Bilge tank','舱底水舱'],[['slop tesisine verilsin','hand it to a slop facility','交给污油接收设施'],['2. çarkçı onarsın','second engineer repairs','大管轮修理'],['denize basılsın','pump it overboard','排入海中']]],
 pir:[['Aden Körfezi','Gulf of Aden','亚丁湾'],[['güvenlik ekibi alınsın','hire a security team','雇用安保队'],['korumasız geçilsin','go through unprotected','不设防通过']]],
 maint:[['Bakım önerisi','Maintenance proposal','维修建议'],[['yaptırılsın','do it','执行'],['yaptırılmasın','don’t do it','不执行']]],
 bribe:[['Limanda ek ödeme talebi','Extra payment request in port','港口索要额外费用'],[['ödensin','pay','付款'],['reddedilsin','refuse','拒绝']]],
 info:[['Bilgi pencereleri','Information windows','信息窗口'],[NOWIN]],lvl:[['Seviye atlama','Level-ups','升级通知'],[NOWIN]],
 nofuel:[['Denizde yakıt bitmesi','Running out of fuel at sea','海上燃油耗尽'],[['acil ikmal istensin','request emergency bunkers','申请紧急加油']]],
 sar:[['İmdat çağrısı','Distress call','求救信号'],[['yardıma gidilsin','go and help','前往救援'],['sahil güvenliğe bildirilsin','alert the coast guard','通知海岸警卫队']]],
 ga:[['Kaza masrafı','Casualty costs','事故费用'],[['müşterek avarya','general average','共同海损'],['masraf üstlenilsin','bear the cost','承担费用']]],
 grad:[['Kadet mezuniyeti','Cadet graduation','实习生结业'],[['gemide başlasın','start on board','在船任职'],['acentede beklesin','wait at the agency','在中介待命']]],
 case:[['Davalar','Lawsuits','诉讼'],[['uzlaşılsın','settle','和解'],['mahkemeye gidilsin','go to court','诉诸法庭'],['müşavir karar versin','counsel decides','顾问决定']]],
 arrest:[['Gemi tutuklaması','Ship arrest','船舶扣押'],[['teminat yatırılsın','post security','提供担保'],['uzlaşılsın','settle','和解']]],
 svy:[['Sörvey önerisi','Survey proposal','检验建议'],[['yaptırılsın','do it','执行'],['sonraya kalsın','later','以后再说']]],
 poach:[['Rakiplerin personel teklifi','Rivals poaching crew','对手挖角船员'],[['teklif eşlensin','match the offer','跟进报价'],['%15 zam teklif edilsin','offer a 15% raise','提出加薪15%'],['gitmesine izin verilsin','let them go','让他走']]],
 war:[['Navlun savaşı','Freight war','运费战'],[['fiyat kırılsın','cut prices','降价'],['çekilinsin','pull out','退出']]],
 bonus:[['Yılsonu ikramiyesi','Year-end bonus','年终奖'],[['tam maaş','a full month’s pay','一个月工资'],['yarım maaş','half a month’s pay','半个月工资'],['ikramiye yok','no bonus','不发']]],
 ret:[['Emeklilik','Retirement','退休'],[['ikramiye verilsin','give a bonus','发奖金'],['kalması rica edilsin','ask them to stay','请其留任'],['uğurlansın','wish them well','送别']]],
 promo:[['Terfi isteği','Promotion request','晋升请求'],[['terfi ettirilsin','promote','提拔'],['zam verilsin','give a raise','加薪'],['reddedilsin','refuse','拒绝']]]};

function initCorp(){S.hq=S.hq||1;S.staff=S.staff||[];S.fleet=S.fleet||{};FLEETS.forEach(f=>{if(!S.fleet[f.k])S.fleet[f.k]={open:true,crew:'cheap'};});
 S.rel=S.rel||{};Object.keys(CNAME).forEach(c=>{if(S.rel[c]===undefined)S.rel[c]=c==='TR'?65:Math.round(rnd(44,58));});
 S.ban=S.ban||{};S.boy=S.boy||{};S.auto=S.auto||{};S.dipCd=S.dipCd||{};S.pol=S.pol||{next:S.day+rnd(25,45),cr:{},last:{},n:0};S.lastSpd=S.lastSpd||1;
 if(!S.spool)refreshStaff();initProg();PORTS.forEach(p=>{if(!S.offers[p.id]){S.offers[p.id]=[];fillOffers(p.id);}});setRouting();initDeep();initDeep2();initDeep3();initDeep4();}
function setRouting(){RTc=(S&&((S.pol&&S.pol.cr.redsea&&S.pol.cr.redsea.mode===0)||(S.rpol&&S.rpol.avoid)))?RT2:RT;}

/* ---------- çalışanlar ---------- */
function mkStaff(role){const skill=rndSkill(),nat=wpick(NATS,NATW),[f,l]=NAMES[nat],fn=pick(f),ln=pick(l),tier=Math.random()<0.65?(skill>=4?'hi':skill<=2?'lo':'mid'):pick(['hi','mid','lo']);
 return {id:S.nid++,role,skill,nat,name:nat==='CN'?ln+' '+fn:fn+' '+ln,exp:clamp(skill*4+ri(-5,5),0,32),cv:pick(CV[tier]),wage:Math.round(SROLE[role].base*(0.55+0.22*skill)*rnd(0.85,1.2)/50)*50,stat:{voy:0,profit:0,late:0,det:0,jobs:0,hist:[]}};}
function refreshStaff(){S.spool={mgr:[],insp:[],dip:[],law:[]};for(let i=0;i<5;i++)S.spool.mgr.push(mkStaff('mgr'));for(let i=0;i<3;i++){S.spool.insp.push(mkStaff('insp'));S.spool.dip.push(mkStaff('dip'));S.spool.law.push(mkStaff('law'));}S.spoolDay=Math.floor(S.day);}
const staffOf=(role,fleet)=>S.staff.find(x=>x.role===role&&(role!=='mgr'||x.fleet===fleet));
const inspector=()=>staffOf('insp'),diplomat=()=>staffOf('dip');
function mgrOf(s){return staffOf('mgr',FLEETOF[s.cls]);}
function managed(s){return !s.manual&&!!mgrOf(s);}
function fireStaff(id){const i=S.staff.findIndex(x=>x.id===id);if(i<0)return;const m=S.staff[i];pay(m.wage,'ofis');S.staff.splice(i,1);
 logMsg(()=>L(m.name+' ('+SROLE[m.role].n+') işten çıkarıldı',m.name+' ('+SROLE[m.role].n+') dismissed',m.name+'（'+SROLE[m.role].n+'）被解雇'));}
function hireStaff(role,pid,fleet){if(role==='mgr'&&!mgrUnl()){toast(L('Filo müdürü '+MGRN+' teslimattan sonra açılır','Fleet managers open after '+MGRN+' deliveries','完成'+MGRN+'次交货后可任命船队经理'),'','bad');return false;}const pool=S.spool[role],i=pool.findIndex(x=>x.id===pid);if(i<0)return false;const cur=staffOf(role,fleet);
 if(!cur&&S.staff.length>=HQ[S.hq].slots){toast(L('Kadro dolu. Daha büyük bir binaya taşınman gerekiyor.','No free positions. You need to move to a bigger building.','编制已满，需要搬到更大的办公楼。'),'','bad');return false;}
 const m=pool[i];if(!canPay(m.wage)){toast(L('İmza parası için nakit yetmiyor','Not enough cash for the signing bonus','现金不足以支付签约金'),'','bad');return false;}
 if(cur)fireStaff(cur.id);pool.splice(i,1);pool.push(mkStaff(role));pay(m.wage,'ofis');m.since=Math.floor(S.day);if(role==='mgr')m.fleet=fleet;S.staff.push(m);
 logMsg(()=>L(m.name+' işe alındı: '+SROLE[role].n+(role==='mgr'?' ('+FLEET[fleet].n+')':''),m.name+' hired: '+SROLE[role].n+(role==='mgr'?' ('+FLEET[fleet].n+')':''),'聘用'+m.name+'：'+SROLE[role].n+(role==='mgr'?'（'+FLEET[fleet].n+'）':'')));
 S.ships.forEach(s=>{if(s.state==='idle')s.idleAt=S.day;});return true;}

/* ---------- filo müdürü otomasyonu ---------- */
function hash01(a,b){let x=Math.imul(a|0,73856093)^Math.imul(b|0,19349663);x=Math.imul(x^(x>>>13),1274126177);x^=x>>>16;return ((x>>>0)%10000)/10000;}
function mgrPick(s,m){let best=null,bv=0;const sg=MSIG[m.skill-1];
 for(const o of S.offers[s.port]||[]){if(!fits(s,o)||avoid(o.to))continue;const e=planTrip(s,o.to,o);if(!e.range||!canPay(e.topCost))continue;
  if(m.skill>=3&&(e.risk.lvl===2||e.days>o.days||e.wx.sev>0.55))continue;
  const ppd=(e.profit+e.fr*(MNEG[m.skill-1]-1))/Math.max(e.days,0.5);let v=ppd*(1+(hash01(o.id,m.id)*2-1)*sg*2)+(hash01(o.id+7,m.id)*2-1)*sg*5000;
  if(m.skill>=4&&e.risk.lvl===1)v*=0.8;if(v>bv){bv=v;best=o;}}
 return best;}
function mgrBallast(s,m){let best=null,bv=0;const sg=MSIG[m.skill-1],sp=seaSpeed(s)*24;
 for(const p of PORTS){if(p.id===s.port||!portOpen(p.id)||avoid(p.id))continue;const n=(S.offers[p.id]||[]).filter(o=>fits(s,o)&&!avoid(o.to)).length;if(!n)continue;
  if(m.skill>=3&&pscRisk(s,p.id).lvl===2)continue;const nm=RTc[s.port].dist[p.id];if(consSea(s)*nm/sp*1.12+2>s.fuelCap)continue;
  const v=n/(1+nm/500)*(1+(hash01(p.lon*100|0,m.id+Math.floor(S.day/3))*2-1)*sg*2);if(v>bv){bv=v;best=p.id;}}
 return best;}
function manageShip(s,m){if(S.day-(s.idleAt||0)<MDLY[m.skill-1]||s.askMaint)return;
 if(missingRoles(s).length){autoCrew(s,S.fleet[m.fleet].crew||'cheap');if(missingRoles(s).length)return;}
 if(maintCheck(s))return;
 const o=mgrPick(s,m);if(o){depart(s,o.to,o.id,true,m);return;}
 if(S.day-(s.idleAt||0)>MDLY[m.skill-1]+1.2){const b=mgrBallast(s,m);if(b&&canPay(planTrip(s,b,null).topCost))depart(s,b,0,true,m);else s.idleAt=S.day-0.6;}}
function autoRun(){if(!S.staff.length)return;for(const s of S.ships){if(s.state!=='idle'||s.manual)continue;const m=mgrOf(s);if(m)manageShip(s,m);}}
function quickBest(s){let best=null,bv=0;for(const o of S.offers[s.port]||[]){if(!fits(s,o)||avoid(o.to))continue;const e=planTrip(s,o.to,o);if(!e.range||e.miss.length||!canPay(e.topCost)||e.risk.lvl===2||e.days>o.days)continue;if(e.ppd>bv){bv=e.ppd;best=o;}}return best;}

/* ---------- makine enspektörü ---------- */
function inspCf(){const m=inspector();return m?ICF[m.skill-1]:1;}
function maintCheck(s){const m=inspector();if(!m||s.state!=='idle'||s.askMaint||(s.maintSkip||0)>S.day)return false;
 const d=dockInfo(s),r=repairInfo(s);let dock=false;
 if(d&&d.ok&&m.skill>=3&&s.cond<maxCond(s)-16)dock=true;else if(!(r.ok&&s.cond<ITHR[m.skill-1]))return false;
 const inf=dock?d:r;if(!canPay(inf.cost))return false;m.stat.jobs++;s.askMaint=1;const c=Math.round(s.cond),to=Math.round(inf.to),pid=s.port,days=Math.round(inf.days);
 pushEv({k:'maint',sid:s.id,who:m.id,title:()=>L('Bakım önerisi: ','Maintenance proposal: ','维修建议：')+s.name,
  body:()=>L('Patron, '+s.name+' yıprandı, durumu %'+c+'. '+PORT[pid].n+' limanında '+(dock?'havuza alalım':'bakıma alalım')+' mı? Durum %'+to+' olur.','Boss, '+s.name+' is worn out, condition '+c+'%. Shall we '+(dock?'drydock her':'do maintenance')+' at '+PORT[pid].n+'? Condition would go up to '+to+'%.','老板，'+s.name+'磨损了，船况'+c+'%。要不要在'+PORT[pid].n+(dock?'进坞':'维修')+'？船况会恢复到'+to+'%。'),d:{dock},
  opts:[{l:()=>L('Evet, yaptır','Yes, do it','好，去做'),s:()=>USD(inf.cost)+' · '+days+L(' gün',' days','天')},{l:()=>L('Hayır, sefere devam','No, keep sailing','不，继续航行'),s:()=>L('25 gün tekrar sorulmaz','Won’t ask again for 25 days','25天内不再询问')}]});return true;}

/* ---------- ülkeler ve ilişkiler ---------- */
function rel(c){const v=S.rel[c];return v===undefined?50:v;}
function relName(v){return v<15?L('kapalı','closed','关闭'):v<35?L('soğuk','cold','冷淡'):v<65?L('normal','normal','一般'):v<85?L('iyi','good','良好'):L('çok iyi','very good','很好');}
function addRel(c,x){if(!x)return;if(x>0){const d=diplomat();x*=(1+0.1*(S.hq-1))*(d?DMUL[d.skill-1]:1);}const o=rel(c);S.rel[c]=clamp(o+x,0,100);
 if(o>=15&&S.rel[c]<15){pushInfo(()=>L(CNAME[c]+' limanlarını kapattı',CNAME[c]+' has closed its ports',CNAME[c]+'关闭了港口'),()=>L(CNAME[c]+' ile ilişkiler koptu. Bu ülkenin limanları gemilerine kapalı; ilişki 15’in üstüne çıkana kadar yük alınamaz, sefer yapılamaz. Ticaret heyeti göndererek ilişkiyi onarabilirsin.','Relations with '+CNAME[c]+' have broken down. Its ports are closed to your ships; until relations rise above 15 you can’t load there or sail there. You can repair relations by sending a trade delegation.','与'+CNAME[c]+'的关系破裂。该国港口对你的船舶关闭；在关系回升到15以上之前，无法在那里装货或前往。可以派遣贸易代表团来修复关系。'));
  logMsg(()=>L(CNAME[c]+' limanları şirkete kapandı',CNAME[c]+' ports closed to the company',CNAME[c]+'港口对公司关闭'));}
 else if(o<15&&S.rel[c]>=15){toast(L(CNAME[c]+' limanları yeniden açıldı',CNAME[c]+' ports have reopened',CNAME[c]+'港口重新开放'),'','ok');}}
function portOpen(pid){const c=PORT[pid].c;return portUnl(pid)&&rel(c)>=15&&!((S.ban[c]||0)>S.day);}
function portWhy(pid){if(!portUnl(pid))return L('şirket seviyesi '+portTier(pid)+' gerekli','company level '+portTier(pid)+' required','需要公司等级'+portTier(pid));const c=PORT[pid].c;
 if(rel(c)<15)return L(CNAME[c]+' ile ilişkiler kopuk','relations with '+CNAME[c]+' have broken down','与'+CNAME[c]+'关系破裂');if((S.ban[c]||0)>S.day)return L('geçici olarak kapalı','temporarily closed','暂时关闭');return '';}
function avoid(pid){return !!S.boy[PORT[pid].c];}
function relMul(pid){return 0.8+0.4*rel(PORT[pid].c)/100;}
function relFee(pid){return 1.15-0.3*rel(PORT[pid].c)/100;}
function relPsc(pid){return 1.3-0.6*rel(PORT[pid].c)/100;}
function offerMul(from,to){let m=(relMul(from)+relMul(to))/2;const cr=S.pol.cr,a=PORT[from].c,b=PORT[to].c;
 if(cr.hormuz&&(a==='IR'||b==='IR'))m*=cr.hormuz.pro?1.5:1.3;
 if(cr.uscn&&((a==='US'&&b==='CN')||(a==='CN'&&b==='US')))m*=0.85;return m;}
function heyetCost(){return Math.round(clamp(20000+netWorth()*0.004,20000,400000)*(diplomat()?0.75:1)/1000)*1000;}
function sendHeyet(c){const cost=heyetCost();if((S.dipCd[c]||0)>S.day){toast(L('Bu ülkeye yakın zamanda heyet gitti','A delegation went to this country recently','最近已向该国派过代表团'),'','bad');return;}if(!canPay(cost)){toast(L('Heyet için nakit yetmiyor','Not enough cash for a delegation','现金不足以派遣代表团'),'','bad');return;}
 pay(cost,'diplomasi');S.dipCd[c]=S.day+45;addRel(c,8);logMsg(()=>L(CNAME[c]+' ülkesine ticaret heyeti gönderildi: '+USD(cost),'Trade delegation sent to '+CNAME[c]+': '+USD(cost),'向'+CNAME[c]+'派出贸易代表团：'+USD(cost)));toast(L(CNAME[c]+' ile ilişkiler gelişti','Relations with '+CNAME[c]+' improved','与'+CNAME[c]+'的关系改善了'),'','ok');}

/* ---------- bina ---------- */
function hqNext(){return HQ[S.hq+1]||null;}
function upgradeHQ(){const n=hqNext();if(!n)return false;if(coLv()<n.lv){toast(L('Bu bina için şirket seviyesi '+n.lv+' gerekli','This building requires company level '+n.lv,'这栋楼需要公司等级'+n.lv),'','bad');return false;}
 if(netWorth()<n.nw){toast(L('Bu bina için şirket değeri yetmiyor','Your company value is too low for this building','公司价值不足以搬入这栋楼'),'','bad');return false;}if(!canPay(n.cost)){toast(L('Taşınmak için nakit yetmiyor','Not enough cash to move','现金不足以搬迁'),'','bad');return false;}
 pay(n.cost,'ofis');S.hq++;logMsg(()=>L('Şirket '+n.n+' binasına taşındı: '+USD(n.cost),'The company moved into the '+n.n+': '+USD(n.cost),'公司搬入'+n.n+'：'+USD(n.cost)));toast(L('Yeni bina: ','New building: ','新办公楼：')+n.n,'','ok');save();return true;}

/* ---------- gündem: politik olaylar (kurgusal) ---------- */
const POL={
 hormuz:{cool:260,title:()=>L('Hürmüz Boğazı’nda gerilim','Tension in the Strait of Hormuz','霍尔木兹海峡局势紧张'),
  body:()=>L('ABD ile İran arasındaki gerilim tırmandı. Hürmüz’den geçen gemilerin savaş riski primleri yükseldi. ABD, İran limanlarına uğrayan şirketleri izlemeye alacağını duyurdu; İran ise kendisiyle çalışmayı sürdüren armatörlere öncelik tanıyacağını açıkladı. Şirketin nasıl davranacak?','Tension between the US and Iran has escalated. War-risk premiums for ships passing through Hormuz have gone up. The US announced it will monitor companies calling at Iranian ports; Iran said it will give priority to shipowners who keep working with it. How will your company act?','美国与伊朗之间的紧张局势升级。通过霍尔木兹海峡的船舶战争险保费上涨。美国宣布将关注停靠伊朗港口的公司；伊朗则表示将优先照顾继续与其合作的船东。你的公司将如何应对？'),
  opts:[{l:()=>L('İran limanlarıyla çalışmayı bırak','Stop working with Iranian ports','停止与伊朗港口合作'),s:()=>L('ABD ilişkisi artar · İran ilişkisi düşer · müdürler İran’a yük almaz','US relations rise · Iran relations fall · managers won’t take cargo to Iran','与美国关系上升 · 与伊朗关系下降 · 经理不再承接前往伊朗的货物')},
   {l:()=>L('Tarafsız kal, işe bak','Stay neutral, focus on business','保持中立，专注生意'),s:()=>L('Her İran seferi ABD ilişkisini biraz düşürür · İran yükleri primli','Each Iran voyage slightly lowers US relations · Iranian cargoes pay a premium','每次前往伊朗都会略微降低与美国的关系 · 伊朗货物运费有溢价')},
   {l:()=>L('İran’la ticareti artır','Increase trade with Iran','扩大与伊朗的贸易'),s:()=>L('İran ilişkisi artar, yükleri daha da primli · ABD ilişkisi düşer','Iran relations rise, its cargoes pay even more · US relations fall','与伊朗关系上升，其货物溢价更高 · 与美国关系下降')}],
  run(i){S.pol.cr.hormuz={until:S.day+150,pro:i===2};if(i===0){S.boy.IR=1;addRel('US',8);addRel('IR',-15);}else if(i===2){S.boy.IR=0;addRel('IR',15);addRel('US',-12);}}},
 redsea:{cool:260,title:()=>L('Kızıldeniz’de saldırılar','Attacks in the Red Sea','红海遇袭事件'),
  body:()=>L('Kızıldeniz’in güneyinde ticaret gemilerine yönelik saldırılar arttı. Büyük hatların bir kısmı Süveyş yerine Ümit Burnu’ndan dolaşmaya başladı; Mısır ise kanalın açık ve güvenli olduğunu söylüyor. Gemilerin hangi yoldan gidecek?','Attacks on merchant ships in the southern Red Sea have increased. Some major lines have started going around the Cape of Good Hope instead of using Suez; Egypt says the canal is open and safe. Which way will your ships go?','红海南部针对商船的袭击增多。一些大型航运公司开始绕行好望角，不再经过苏伊士运河；埃及则表示运河开放且安全。你的船走哪条路？'),
  opts:[{l:()=>L('Ümit Burnu’ndan dolaş','Go around the Cape of Good Hope','绕行好望角'),s:()=>L('Güvenli ama seferler uzar · Mısır ilişkisi biraz düşer','Safe, but voyages get longer · Egypt relations drop slightly','安全但航程变长 · 与埃及关系略降')},
   {l:()=>L('Koruma ve sigortayla geç','Transit with escort and insurance','在护航和保险下通过'),s:()=>L('Her geçişte ek masraf · güvenli','Extra cost on every transit · safe','每次通过都有额外费用 · 安全')},
   {l:()=>L('Normal geçmeye devam et','Keep transiting as normal','照常通过'),s:()=>L('Masraf yok · her geçişte saldırı riski','No extra cost · risk of attack on every transit','没有额外费用 · 每次通过都有遇袭风险')}],
  run(i){S.pol.cr.redsea={until:S.day+150,mode:i};if(i===0)addRel('EG',-4);else addRel('EG',3);setRouting();}},
 inpk:{cool:300,title:()=>L('Hindistan ve Pakistan limanlarını kapattı','India and Pakistan close their ports to each other’s traffic','印度和巴基斯坦相互关闭港口'),
  body:()=>L('İki ülke, karşı tarafın limanına uğrayan gemilere 90 gün boyunca giriş izni vermeyeceğini açıkladı. İkisiyle birden çalışmak mümkün değil.','Both countries announced that for 90 days they will refuse entry to ships that call at the other side’s ports. You can’t work with both.','两国宣布，在90天内拒绝停靠过对方港口的船舶入港。你无法同时与两国合作。'),
  opts:[{l:()=>L('Hindistan’la çalış','Work with India','与印度合作'),s:()=>L('Pakistan limanları 90 gün kapalı · Hindistan ilişkisi artar','Pakistani ports closed for 90 days · India relations rise','巴基斯坦港口关闭90天 · 与印度关系上升')},
   {l:()=>L('Pakistan’la çalış','Work with Pakistan','与巴基斯坦合作'),s:()=>L('Hindistan limanları 90 gün kapalı · Pakistan ilişkisi artar','Indian ports closed for 90 days · Pakistan relations rise','印度港口关闭90天 · 与巴基斯坦关系上升')},
   {l:()=>L('İkisinden de uzak dur','Stay away from both','两国都不去'),s:()=>L('İki ülkenin limanları 90 gün kapalı · ilişkiler değişmez','Both countries’ ports closed for 90 days · relations unchanged','两国港口均关闭90天 · 关系不变')}],
  run(i){S.pol.cr.inpk={until:S.day+90};const u=S.day+90;if(i===0){S.ban.PK=u;addRel('IN',8);addRel('PK',-8);}else if(i===1){S.ban.IN=u;addRel('PK',8);addRel('IN',-8);}else{S.ban.PK=u;S.ban.IN=u;}}},
 uscn:{cool:300,title:()=>L('ABD ile Çin arasında ticaret gerginliği','Trade tension between the US and China','中美贸易紧张'),
  body:()=>L('İki ülke karşılıklı olarak yeni gümrük vergileri açıkladı. Pasifik hattında yük azaldı ve navlunlar geriledi. İki taraf da kendi limanlarına bağlı kalan taşıyıcıları ödüllendireceğini söylüyor.','The two countries announced new tariffs on each other. Cargo on the Pacific route has fallen and freight rates have dropped. Both sides say they will reward carriers that stay loyal to their ports.','两国相互宣布加征新关税。太平洋航线货量减少，运费下跌。双方都表示会奖励坚持停靠本国港口的承运人。'),
  opts:[{l:()=>L('ABD pazarına ağırlık ver','Focus on the US market','侧重美国市场'),s:()=>L('ABD ilişkisi artar · Çin ilişkisi düşer','US relations rise · China relations fall','与美国关系上升 · 与中国关系下降')},
   {l:()=>L('Çin pazarına ağırlık ver','Focus on the Chinese market','侧重中国市场'),s:()=>L('Çin ilişkisi artar · ABD ilişkisi düşer','China relations rise · US relations fall','与中国关系上升 · 与美国关系下降')},
   {l:()=>L('Dengeyi koru','Keep a balance','保持平衡'),s:()=>L('İlişkiler değişmez','Relations unchanged','关系不变')}],
  run(i){S.pol.cr.uscn={until:S.day+120};if(i===0){addRel('US',10);addRel('CN',-8);}else if(i===1){addRel('CN',10);addRel('US',-8);}}},
 euets:{cool:1e9,min:150,title:()=>L('Avrupa limanlarında emisyon bedeli','Emissions charge at European ports','欧洲港口征收排放费'),
  body:()=>{const c=etsCost();return L('Avrupa Birliği limanlarına uğrayan 15 yaşından büyük gemilerden her uğrakta emisyon bedeli alınacak. Filoya yakıt tasarruf donanımı takılırsa gemiler muaf sayılacak. Bugünkü filon için donanım bedeli '+USD(c)+'.','Ships over 15 years old will pay an emissions charge on every call at European Union ports. Ships fitted with fuel-saving equipment will be exempt. Fitting your current fleet would cost '+USD(c)+'.','停靠欧盟港口的船龄超过15年的船舶，每次停靠都要缴纳排放费。加装节油设备的船舶可以豁免。为你目前的船队加装设备需要'+USD(c)+'。');},
  opts:[{l:()=>L('Bedeli öde, böyle devam et','Pay the charge and carry on','缴费，维持现状'),s:()=>L('Yaşlı gemiler AB limanlarında ek ücret öder','Older ships pay extra at EU ports','老旧船舶在欧盟港口需额外付费')},
   {l:()=>L('Filoya tasarruf donanımı taktır','Fit fuel-saving equipment to the fleet','为船队加装节油设备'),s:()=>L('Mevcut gemilerde tüketim %6 azalır · AB ülkeleriyle ilişkiler artar','Consumption drops 6% on current ships · relations with EU countries rise','现有船舶油耗降低6% · 与欧盟国家关系上升')}],
  run(i){S.ets=1;if(i===1){const c=etsCost();if(canPay(c)){pay(c,'bakım');S.ships.forEach(s=>{if(!s.eco){s.eco=1;s.cons=Math.round(s.cons*0.94*10)/10;}});EU.forEach(c2=>addRel(c2,4));}else toast(L('Donanım için nakit yetmedi, bedel ödenecek','Not enough cash for the equipment; the charge will be paid','现金不足以加装设备，将缴纳排放费'),'','bad');}}},
 fair:{cool:120,pickC:1,title:()=>L('Denizcilik fuarına davet','Invitation to a maritime fair','受邀参加海事展会'),
  body:c=>L(CNAME[c]+' ticaret odası şirketini denizcilik fuarına davet etti. Stant açarsan ülkenin yük sahipleriyle tanışırsın.','A chamber of commerce in '+CNAME[c]+' has invited your company to a maritime fair. With a stand you would meet the country’s cargo owners.',CNAME[c]+'商会邀请你的公司参加海事展会。设立展位就能结识该国的货主。'),
  opts:c=>[{l:()=>L('Stant aç','Open a stand','设立展位'),s:()=>USD(heyetCost())+' · '+L(CNAME[c]+' ilişkisi artar','relations with '+CNAME[c]+' rise','与'+CNAME[c]+'关系上升')},{l:()=>L('Katılma','Don’t attend','不参加'),s:()=>L('Değişiklik olmaz','Nothing changes','无变化')}],
  run(i,c){if(i===0){const k=heyetCost();if(canPay(k)){pay(k,'diplomasi');addRel(c,10);addRep(1);}else toast(L('Stant için nakit yetmedi','Not enough cash for the stand','现金不足以设立展位'),'','bad');}}},
 aid:{cool:160,pickC:1,title:()=>L('Fırtına sonrası yardım çağrısı','Call for help after a storm','风暴后的援助呼吁'),
  body:c=>L(CNAME[c]+' kıyılarını vuran fırtına limanlarda ağır hasar bıraktı. Hükümet armatörlerden yardım malzemesi taşıması için destek istiyor.','A storm that hit the coast of '+CNAME[c]+' has badly damaged its ports. The government is asking shipowners to help carry relief supplies.','袭击'+CNAME[c]+'沿海的风暴严重损坏了港口。政府请求船东协助运送救援物资。'),
  opts:c=>[{l:()=>L('Bağış yap ve yardım taşı','Donate and carry relief supplies','捐款并运送救援物资'),s:()=>USD(heyetCost())+' · '+L(CNAME[c]+' ilişkisi ve itibar artar','relations with '+CNAME[c]+' and reputation rise','与'+CNAME[c]+'关系和声誉上升')},{l:()=>L('Sessiz kal','Stay out of it','不参与'),s:()=>L('Değişiklik olmaz','Nothing changes','无变化')}],
  run(i,c){if(i===0){const k=heyetCost();if(canPay(k)){pay(k,'diplomasi');addRel(c,12);addRep(3);}else toast(L('Bağış için nakit yetmedi','Not enough cash for the donation','现金不足以捐款'),'','bad');}}}};
function etsCost(){let c=0;S.ships.forEach(s=>c+=15000+s.dwt*0.8);return Math.round(c/1000)*1000;}
function firePol(){const day=S.day,ids=Object.keys(POL).filter(id=>!S.pol.cr[id]&&day-(S.pol.last[id]===undefined?-1e9:S.pol.last[id])>=POL[id].cool&&day>=(POL[id].min||0));if(!ids.length)return;
 const id=S.pol.n===0&&ids.includes('hormuz')?'hormuz':pick(ids),P=POL[id];let c=null;if(P.pickC){const cs=Object.keys(CNAME).filter(x=>x!=='TR'&&rel(x)>=15);c=pick(cs);}
 S.pol.n++;S.pol.last[id]=day;pushEv({k:'pol',id,c,title:P.title,body:()=>P.body(c),opts:typeof P.opts==='function'?P.opts(c):P.opts});}
const CRISIS_END={hormuz:()=>L('Körfez’de gerilim yatıştı, primler normale döndü','Tension in the Gulf has eased, premiums are back to normal','海湾局势缓和，保费恢复正常'),redsea:()=>L('Kızıldeniz’de durum sakinleşti, Süveyş yolu normale döndü','The Red Sea has calmed down, the Suez route is back to normal','红海局势平静下来，苏伊士航线恢复正常'),inpk:()=>L('Hindistan ve Pakistan liman kısıtlamalarını kaldırdı','India and Pakistan have lifted their port restrictions','印度和巴基斯坦解除了港口限制'),uscn:()=>L('ABD ile Çin arasındaki ticaret gerginliği yumuşadı','Trade tension between the US and China has eased','中美贸易紧张局势有所缓和')};
function corpDay(day){
 let w=HQ[S.hq].rent;for(const m of S.staff)w+=m.wage;pay(w/30,'ofis');
 for(const k of Object.keys(S.pol.cr)){if(S.pol.cr[k].until<=day){delete S.pol.cr[k];const t=CRISIS_END[k];if(t){toast(t(),'','ok');logMsg(t);}if(k==='redsea')setRouting();}}
 if(day-(S.spoolDay||0)>=30)refreshStaff();
 if(inspector())for(const x of S.ships){if(x.state==='idle'&&!managed(x)&&maintCheck(x))break;}
 if(day>=S.pol.next&&!S.ev.some(e=>e.k==='pol')){S.pol.next=day+rnd(55,95);firePol();}}
