/* ================= DERİNLİK 4: deniz hukuku, filo müdürü kilidi, görevler ve ipuçları ================= */
const MGRN=15;
const mgrUnl=()=>!!(S.mgrOk||S.stat.cargo>=MGRN);
const lawyer=()=>staffOf('law');
function initDeep4(){S.cases=S.cases||[];S.cnid=S.cnid||1;S.done=S.done||{};S.tips=S.tips||{};S.tipQ=S.tipQ||[];S.msn=S.msn||{};S.whq=S.whq||[];
 if(S.spool&&!S.spool.law){S.spool.law=[];for(let i=0;i<3;i++)S.spool.law.push(mkStaff('law'));}
 if(S.staff.some(x=>x.role==='mgr'))S.mgrOk=1;awInit();
 if(S.v20===undefined){S.v20=1;if(S.day>2&&S.ships.length){for(const m of MSN)if(m.ok())S.msn[m.id]=1;
  pushInfo(()=>L('Yenilikler: deniz hukuku ve görevler','What’s new: maritime law and missions','新内容：海事法与任务'),()=>L('Deniz kurallarına aykırı davranırsan (yağlı su basmak, imdat çağrısına uymamak, sözleşmesi dolan denizciyi tutmak) ya da yük hasar görürse, gemin çatışırsa şirketine dava açılabilir. Ofis’e hukuk müşaviri alırsan davaları o yürütür. Şirket sekmesinde adım adım görevler var; her biri oyunun bir bölümünü öğretir ve ödül verir.','If you break the rules of the sea (pumping oily water overboard, ignoring a distress call, keeping seafarers past their contract) or cargo is damaged or your ship is in a collision, your company can be sued. Hire a legal counsel in the Office to handle the cases. The Company tab now has step-by-step missions; each one teaches a part of the game and pays a reward.','如果违反海上规则（向海里排放含油污水、不响应求救、让合同到期的船员继续工作），或者货物受损、船舶发生碰撞，公司就可能被起诉。在办公室聘请法律顾问来处理案件。公司页面现在有分步任务，每个任务都会教你游戏的一部分并给予奖励。'));}}}

/* ---------- davalar ---------- */
const LAWK={
 marpol:{n:['MARPOL kovuşturması','MARPOL prosecution','MARPOL刑事诉讼'],by:['bayrak devleti savcılığı','the flag state prosecutor','船旗国检察官'],rep:6},
 sar:{n:['SOLAS soruşturması','SOLAS inquiry','SOLAS调查'],by:['bayrak devleti','the flag state','船旗国'],rep:4},
 crew:{n:['Denizci alacak davası','Seafarer’s claim','船员索赔'],by:['ITF ve denizcinin avukatı','the ITF and the seafarer’s lawyer','国际运输工人联合会和船员律师'],rep:3},
 cargo:{n:['Yük hasarı davası','Cargo damage claim','货损索赔'],by:['yük alıcısının sigortacısı','the cargo receiver’s insurer','收货人的保险公司'],rep:1},
 coll:{n:['Çatışma davası','Collision claim','碰撞索赔'],by:['diğer geminin sahibi','the other ship’s owner','对方船东'],rep:2},
 quay:{n:['Rıhtım hasarı davası','Quay damage claim','码头损坏索赔'],by:['liman idaresi','the port authority','港务局'],rep:1},
 dem:{n:['Demuraj alacağı','Demurrage claim','滞期费追讨'],by:['sen (kiracıya karşı)','you (against the charterer)','你（起诉租船人）'],rep:0,us:1}};
const lawSk=()=>{const l=lawyer();return l?l.skill:0;};
function caseP(c){return clamp(c.p0+0.07*lawSk(),0.05,0.92);}
function caseFee(c){return lawyer()?Math.round((3000+c.amt*0.01)/100)*100:Math.round((9000+c.amt*0.07)/100)*100;}
function caseSet(c){const k=lawSk();return Math.round(c.amt*(LAWK[c.k].us?0.42+0.06*k:0.72-0.05*k)/100)*100;}
function caseDays(c){return Math.max(45,ri(80,160)-8*lawSk());}
function lawOpen(k,s,amt,p0,story){amt=Math.round(amt/1000)*1000;if(S.yr){if(k==='coll'||k==='quay')S.yr.acc++;if(k==='marpol')S.yr.dump++;if(k==='crew')S.yr.walk++;}const c={id:S.cnid++,k,sid:s?s.id:0,sn:s?s.name:'',amt,p0,t0:Math.floor(S.day),st:'new',story:LX(story)};S.cases.push(c);tip('case');
 const K=LAWK[k],us=!!K.us;
 pushEv({k:'case',sid:c.sid,title:()=>tx(K.n)+(c.sn?': '+c.sn:''),body:()=>tx(c.story)+' '+(us?L('Alacağın '+USD(c.amt)+'. Kiracı ödemiyor.','You are owed '+USD(c.amt)+'. The charterer refuses to pay.','应收'+USD(c.amt)+'，租船人拒绝支付。'):L('Talep edilen '+USD(c.amt)+'. Davayı açan: '+tx(K.by)+'.','The claim is '+USD(c.amt)+', brought by '+tx(K.by)+'.','索赔金额'+USD(c.amt)+'，起诉方：'+tx(K.by)+'。'))+' '+(lawyer()?L('Hukuk müşavirin '+lawyer().name+' mahkemede kazanma şansını yaklaşık %'+Math.round(caseP(c)*100)+' görüyor.','Your legal counsel '+lawyer().name+' puts the chance of winning in court at about '+Math.round(caseP(c)*100)+'%.','你的法律顾问'+lawyer().name+'认为胜诉几率约为'+Math.round(caseP(c)*100)+'%。'):L('Hukuk müşavirin olmadığı için davayı dışarıdan bir büroya vermen gerekir; kazanma şansını kestiremiyorsun.','You have no legal counsel, so the case would go to an outside law firm, and you can’t judge the chances.','你没有法律顾问，案件只能交给外部律所，也无法判断胜算。')),d:{cid:c.id},
  opts:[{l:()=>us?L('Uzlaş','Settle','和解'):L('Uzlaş','Settle','和解'),s:()=>us?L(USD(caseSet(c))+' tahsil edilir · hemen kapanır',USD(caseSet(c))+' collected · closed at once','收回'+USD(caseSet(c))+' · 立即结案'):L(USD(caseSet(c))+' ödenir · hemen kapanır',USD(caseSet(c))+' paid · closed at once','支付'+USD(caseSet(c))+' · 立即结案')},
   {l:()=>us?L('Dava aç','Sue','起诉'):L('Mahkemede savun','Defend in court','出庭应诉'),s:()=>L('avukatlık ve mahkeme masrafı '+USD(caseFee(c))+' · karar '+caseDays(c)+' gün civarı','legal fees '+USD(caseFee(c))+' · ruling in about '+caseDays(c)+' days','律师和诉讼费'+USD(caseFee(c))+' · 约'+caseDays(c)+'天后判决')+(us?'':L(' · kaybedersen '+USD(c.amt),' · '+USD(c.amt)+' if you lose',' · 败诉需付'+USD(c.amt)))}]
   .concat(lawyer()?[{l:()=>L('Hukuk müşavirine bırak','Leave it to your counsel','交给法律顾问'),s:()=>L('en akıllıca yolu o seçer','they choose the wisest course','由其选择最明智的做法')}]:[])});
 return c;}
function lawDecide(c,i){if(i===2){const p=caseP(c),f=caseFee(c),us=!!LAWK[c.k].us;i=us?(p*c.amt-f>caseSet(c)?1:0):((1-p)*c.amt+f<caseSet(c)?1:0);
  const l=lawyer();if(l){l.stat.jobs++;}logMsg(()=>L((l?l.name:'')+': '+tx(LAWK[c.k].n)+' için '+(i?'mahkeme':'uzlaşma')+' yolunu seçti',(l?l.name:'')+' chose to '+(i?'go to court':'settle')+' in the '+tx(LAWK[c.k].n).toLowerCase(),(l?l.name:'')+'决定'+tx(LAWK[c.k].n)+(i?'诉诸法庭':'和解')));}
 const us=!!LAWK[c.k].us;
 if(i===0){const v=caseSet(c);if(us)earn(v,'hukuk');else{pay(v,'hukuk');addRep(-Math.ceil(LAWK[c.k].rep/2));}c.st='done';c.res='set';c.paid=us?-v:v;c.end=Math.floor(S.day);
  logMsg(()=>L(tx(LAWK[c.k].n)+' uzlaşmayla kapandı: '+USD(v),tx(LAWK[c.k].n)+' settled: '+USD(v),tx(LAWK[c.k].n)+'和解结案：'+USD(v)));}
 else{const f=caseFee(c);pay(f,'hukuk');c.st='court';c.fee=f;c.due=Math.floor(S.day)+caseDays(c);c.p=caseP(c);if(lawyer())lawyer().stat.jobs++;}}
function lawVerdict(c){const win=Math.random()<c.p,us=!!LAWK[c.k].us,l=lawyer();c.st='done';c.end=Math.floor(S.day);c.res=win?'won':'lost';
 if(us){if(win){earn(c.amt,'hukuk');c.paid=-c.amt;}}
 else if(win){addRep(1);if(c.sec){earn(c.sec,'hukuk');c.sec=0;}c.paid=0;}
 else{const owe=Math.max(0,c.amt-(c.sec||0));pay(owe,'hukuk');c.paid=c.amt;c.sec=0;addRep(-LAWK[c.k].rep);if(S.yr)S.yr.lost++;}
 if(l&&win)l.stat.won=(l.stat.won||0)+1;
 pushInfo(()=>L('Karar: ','Ruling: ','判决：')+tx(LAWK[c.k].n),()=>win?(us?L('Mahkeme haklı buldu, kiracı '+USD(c.amt)+' ödeyecek.','The court found in your favour; the charterer must pay '+USD(c.amt)+'.','法院判你胜诉，租船人须支付'+USD(c.amt)+'。'):L('Mahkeme şirketini haklı buldu, tazminat ödenmeyecek.'+(c.secd?' Yatırdığın teminat geri döndü.':''),'The court found in your company’s favour; no damages are due.'+(c.secd?' Your security has been returned.':''),'法院判你公司胜诉，无需赔偿。'+(c.secd?'你缴纳的担保金已退还。':''))):(us?L('Mahkeme kiracıyı haklı buldu, alacağını tahsil edemedin.','The court sided with the charterer; you could not recover the money.','法院支持租船人，你没能追回款项。'):L('Mahkeme şirketini kusurlu buldu: '+USD(c.amt)+' tazminat. İtibarın zarar gördü.','The court found your company at fault: '+USD(c.amt)+' in damages. Your reputation has suffered.','法院判你公司有过错：赔偿'+USD(c.amt)+'，声誉受损。')));}
/* bekleyen davası olan gemi limanda tutuklanabilir */
function lawArrive(s,P){const c=S.cases.find(x=>x.st==='court'&&x.sid===s.id&&!x.secd&&!LAWK[x.k].us&&['cargo','coll','quay','crew'].includes(x.k));if(!c||Math.random()>0.3||S.ev.some(e=>e.sid===s.id))return;
 pushEv({k:'arrest',sid:s.id,title:()=>L('Gemi tutuklandı: ','Ship arrested: ','船舶被扣押：')+s.name,body:()=>L(P.n+' mahkemesi, '+tx(LAWK[c.k].n).toLocaleLowerCase('tr')+' için davacının talebiyle gemiyi tutukladı. Teminat yatırmadan ya da uzlaşmadan gemi limandan çıkamaz.','At the claimant’s request, the court in '+P.n+' has arrested the ship over the '+tx(LAWK[c.k].n).toLowerCase()+'. She cannot leave port until you post security or settle.',P.n+'法院应原告申请，就'+tx(LAWK[c.k].n)+'扣押了该船。在提供担保或和解之前，船舶不得离港。'),d:{cid:c.id},
  opts:[{l:()=>L('Teminat yatır','Post security','提供担保'),s:()=>USD(c.amt)+L(' · davayı kazanırsan geri döner',' · returned if you win',' · 胜诉后退还')},{l:()=>L('Uzlaş','Settle','和解'),s:()=>USD(caseSet(c))+L(' · dava kapanır',' · the case is closed',' · 结案')}]});}
function lawArrest(c,i,s){if(i===0){pay(c.amt,'hukuk');c.sec=c.amt;c.secd=1;}else{const v=caseSet(c);pay(v,'hukuk');addRep(-1);c.st='done';c.res='set';c.paid=v;c.end=Math.floor(S.day);}if(s){s.op=(s.op||0)+1;}addRep(-1);}
function lawWhistle(s){if(Math.random()<(s.morale<40?0.3:0.16))S.whq.push({sid:s.id,sn:s.name,at:Math.floor(S.day)+ri(20,120),amt:(180000+s.dwt*22)*rnd(0.8,1.5)});}
const TSS=[[0.5,50.5,2.5,51.6],[98,0.8,104.5,6],[28.8,40.9,29.3,41.3],[-6.2,35.7,-5.2,36.2],[32.2,29.8,32.7,31.4],[121,23,123,26]];
function inTSS(lon,lat){return TSS.some(b=>lon>=b[0]&&lon<=b[2]&&lat>=b[1]&&lat<=b[3]);}
function collRoll(s){if(s.state!=='sea'||!s.voy||S.ev.some(e=>e.sid===s.id))return;const p=posOn(s.voy);if(!inTSS(p.lon,p.lat))return;
 const pr=0.012*(1.6-0.15*sk(s,'kap'))*(s.morale<30?1.5:1)*(dueCrew(s).length?1.4:1);if(Math.random()>pr)return;
 const nm=pick(SHIPS2),dmg=Math.round((40000+s.dwt*1.2)/1000)*1000;pay(dmg,'bakım',s);s.cond=Math.max(15,s.cond-10);s.hold=(s.hold||0)+3;s.morale=Math.max(0,s.morale-10);
 lawOpen('coll',s,(160000+s.dwt*26)*rnd(0.7,1.5),0.3+0.06*sk(s,'kap'),()=>L(s.name+', trafik ayırım düzeninde '+nm+' ile çatıştı. Kendi hasarın '+USD(dmg)+', 3 gün kayıp. Diğer gemi kusurun bizde olduğunu iddia ediyor.',s.name+' collided with '+nm+' in a traffic separation scheme. Your own damage is '+USD(dmg)+' and 3 days are lost. The other ship says we were at fault.',s.name+'在分道通航区与'+nm+'相撞。本船损失'+USD(dmg)+'，耽误3天。对方声称过错在我方。'));}
function quayRoll(s,P){if(cong(P.id)<2||Math.random()>0.02*(1.5-0.1*sk(s,'kap')))return;const a=(70000+s.dwt*5)*rnd(0.8,1.4);
 lawOpen('quay',s,a,0.35,()=>L(s.name+' '+P.n+' limanında yanaşırken rıhtıma sert çarptı ve iskeleye zarar verdi.',s.name+' struck the quay hard while berthing at '+P.n+' and damaged it.',s.name+'在'+P.n+'靠泊时重重撞上码头，造成损坏。'));}
function lawDay(){for(const c of S.cases)if(c.st==='court'&&S.day>=c.due)lawVerdict(c);
 for(const w of S.whq.slice())if(S.day>=w.at){S.whq.splice(S.whq.indexOf(w),1);const s=S.ships.find(x=>x.id===w.sid);
  lawOpen('marpol',s||null,w.amt,0.3,()=>L('Eski bir denizci, '+w.sn+' gemisinden denize yağlı su basıldığını belge ve fotoğraflarla ihbar etti.','A former seafarer has reported, with documents and photos, that oily water was pumped overboard from '+w.sn+'.','一名前船员举报'+w.sn+'向海里排放含油污水，并提供了文件和照片。'));}
 for(const s of S.ships)collRoll(s);
 S.cases=S.cases.filter(c=>c.st!=='done'||S.day-c.end<200);}
function lawEv(ev,i,s,d){if(ev.k==='case'){const c=S.cases.find(x=>x.id===d.cid);if(c)lawDecide(c,i);return true;}
 if(ev.k==='award')return true;
 if(ev.k==='arrest'){const c=S.cases.find(x=>x.id===d.cid);if(c)lawArrest(c,i,s);return true;}return false;}

/* ---------- görevler ---------- */
const did=k=>!!(S.done&&S.done[k]);
const MSN=[
 {id:'m1',t:['İlk yükünü teslim et','Deliver your first cargo','交付第一批货物'],h:['Filo’da gemine dokun, “Yük seç” ile bir yük al. Gemi yükler, seyreder ve tahliye eder; navlun teslimde ödenir.','Tap your ship in the Fleet tab and take a cargo with “Choose cargo”. The ship loads, sails and discharges; freight is paid on delivery.','在船队页面点你的船，用“选货”接一票货。船会装货、航行、卸货；运费在交货时支付。'],ok:()=>S.stat.cargo>=1,pr:()=>[S.stat.cargo,1],r:15000,go:'fleet'},
 {id:'m2',t:['Yakıt ya da kumanya al','Buy fuel or provisions','购买燃油或伙食'],h:['Gemi limandayken İkmal sekmesinden yakıt ve kumanya alabilirsin. Yakıt fiyatı limana göre değişir; ucuz limanda depoyu doldur.','In port, buy fuel and provisions on the ship’s Supplies tab. Fuel prices vary by port, so fill up where it’s cheap.','船在港时，在“补给”页购买燃油和伙食。各港油价不同，便宜的地方多加点。'],ok:()=>did('fuel')||did('prov'),r:5000,go:'fleet'},
 {id:'m3',t:['Personelini değiştir','Change a crew member','更换一名船员'],h:['Personel sekmesinde bir göreve “Değiştir” de. İyi kaptan hızlı gider, iyi çarkçıbaşı yakıtı ve arızayı azaltır, iyi aşçı morali tutar.','On the Crew tab press “Replace” on a post. A good master is faster, a good chief engineer saves fuel and breakdowns, a good cook keeps morale up.','在“船员”页点某个岗位的“更换”。好船长航速快，好轮机长省油少故障，好厨师能稳住士气。'],ok:()=>did('hire'),r:5000,go:'fleet'},
 {id:'m4',t:['5 yük teslim et','Deliver 5 cargoes','交付5批货物'],h:['Yük listesinde kârı ve süreyi karşılaştır. Geç kalırsan ceza var; büyük yük daha çok tecrübe getirir.','Compare profit and time in the cargo list. Late delivery is penalised; bigger cargoes bring more experience.','在货物列表中比较利润和用时。延误会被罚款；大票货经验更多。'],ok:()=>S.stat.cargo>=5,pr:()=>[S.stat.cargo,5],r:25000,go:'fleet'},
 {id:'m5',t:['Boş sefer yap','Make a ballast voyage','空载航行一次'],h:['Limanda iyi yük yoksa gemi sayfasından “Boş sefer” ile yükün bol olduğu bir limana git.','If there’s no good cargo in port, use “Ballast voyage” on the ship page to move to a port with more cargo.','港口没有好货时，在船舶页用“空载航行”去货多的港口。'],ok:()=>did('ballastGo'),r:5000,go:'fleet'},
 {id:'m6',t:['Bakım yaptır','Get maintenance done','进行维修'],h:['Durum %60’ın altına inince İkmal sekmesinden bakım ya da havuz yaptır. Kötü durumdaki gemi arıza yapar ve sıkı limanlarda tutulur.','When condition drops below 60%, get maintenance or drydocking on the Supplies tab. A ship in poor condition breaks down and gets detained at strict ports.','船况低于60%时，在“补给”页进行维修或进坞。船况差会故障，并在严格的港口被滞留。'],ok:()=>did('repair'),r:10000,go:'fleet'},
 {id:'m7',t:['İkinci gemini al','Buy your second ship','购买第二艘船'],h:['Pazar sekmesinden bir gemi al. Para yetmezse Şirket › Banka’dan yarı peşin yarı krediyle alabilirsin.','Buy a ship in the Market tab. If cash is short, buy half in cash and half on a loan via Company › Bank.','在市场页买船。钱不够时，可以通过 公司 › 银行 一半现金一半贷款购买。'],ok:()=>S.ships.length>=2,r:20000,go:'market'},
 {id:'m8',t:['Makine enspektörü ata','Hire a technical superintendent','聘请机务主管'],h:['Ofis sekmesinde boş enspektör yerine dokun. Enspektör bakım zamanını haber verir, arızayı ve bakım masrafını azaltır.','In the Office tab tap the empty superintendent post. They tell you when maintenance is due and cut breakdowns and repair costs.','在办公室页点空缺的机务主管岗位。机务主管会提醒维修时间，减少故障和维修费用。'],ok:()=>!!inspector(),r:10000,go:'office'},
 {id:'m9',t:['Gemine bir geliştirme tak','Fit an upgrade to a ship','给船加装改装'],h:['Gemi sayfasının Geliştir sekmesinde pervane, makine revizyonu ya da kapak gibi parçalar var. Tecrübe arttıkça yenileri açılır.','The ship’s Upgrade tab has items such as a new propeller, an engine overhaul or new hatch covers. More open up with experience.','船舶的“改装”页有螺旋桨、主机大修、舱盖等。经验越多，开放的越多。'],ok:()=>S.ships.some(s=>Object.keys(s.up||{}).length>0),r:15000,go:'fleet'},
 {id:'m10',t:['Ticaret heyeti gönder','Send a trade delegation','派出贸易代表团'],h:['Dünya › Ülkeler’de bir ülke seç ve heyet gönder. İlişki iyi olunca o ülkede navlun artar, masraf ve denetim azalır.','Pick a country under World › Countries and send a delegation. Good relations mean higher freight and lower costs and inspections there.','在 世界 › 国家 中选择一个国家派出代表团。关系好时，那里的运费更高，费用和检查更少。'],ok:()=>did('heyet'),r:10000,go:'world'},
 {id:'m11',t:['15 yük teslim et','Deliver 15 cargoes','交付15批货物'],h:['Bu görev bitince filo müdürü atayabilirsin. O zamana kadar yükü kendin seçerek işin inceliklerini öğren.','When this is done you can appoint fleet managers. Until then, learn the trade by choosing cargoes yourself.','完成后即可任命船队经理。在那之前，自己选货来学习这一行。'],ok:()=>S.stat.cargo>=MGRN,pr:()=>[S.stat.cargo,MGRN],r:40000,go:'fleet'},
 {id:'m12',t:['Filo müdürü ata','Appoint a fleet manager','任命船队经理'],h:['Ofis’te bir filoya müdür ata. Müdür o filonun gemilerine yük bulur. Karnesine bak: zarar ettiriyorsa değiştir.','Appoint a manager to a fleet in the Office. They find cargo for that fleet. Check their record and replace them if they lose money.','在办公室为船队任命经理。经理会为该船队找货。看看业绩，亏钱就换人。'],ok:()=>S.staff.some(x=>x.role==='mgr'),r:20000,go:'office'},
 {id:'m13',t:['Gemini zaman çarterine ver','Put a ship on time charter','把船期租出去'],h:['Limanda bekleyen geminin sayfasında “Kirala” de. Kiracı yakıtı ve limanı öder, sen günlük kira alırsın; arıza olursa kira kesilir.','On an idle ship’s page press “Charter out”. The charterer pays fuel and port costs and you get daily hire; breakdowns stop the hire.','在待命船的页面点“出租”。租家付燃油和港口费，你收日租金；故障时停租。'],ok:()=>did('tcFix')&&(S.ships.some(s=>s.state==='tc')||did('tcDone')),r:20000,go:'fleet'},
 {id:'m14',t:['Ekonomik seyri dene','Try slow steaming','试试经济航速'],h:['Gemi › Durum’da ekonomik seyri aç. Gemi yavaşlar ama yakıt ve karbon notu iyileşir; acelesi olmayan yüklerde kullan.','Turn on slow steaming under ship › Status. The ship is slower but saves fuel and improves its carbon rating; use it for cargoes with time to spare.','在 船舶 › 状态 中开启经济航速。船变慢，但省油并改善碳评级；适合不赶时间的货。'],ok:()=>did('slow')||S.ships.some(s=>s.slow),r:5000,go:'fleet'},
 {id:'m15',t:['İş hanına taşın','Move into an office floor','搬进写字楼'],h:['Ofis sekmesinde “Sonraki bina” kartı gereken net değeri ve parayı gösterir. Büyük bina daha çok çalışan ve gemi demek.','The “Next building” card in the Office shows the net worth and cash you need. A bigger building means more staff and ships.','办公室页的“下一栋楼”卡片显示所需净资产和资金。楼越大，员工和船越多。'],ok:()=>S.hq>=2,r:30000,go:'office'},
 {id:'m16',t:['Hukuk müşaviri ata','Hire a legal counsel','聘请法律顾问'],h:['Ofis’te hukuk müşaviri yerine dokun. Müşavir davalarda kazanma şansını artırır, uzlaşmayı ucuzlatır ve dava masrafını azaltır.','Tap the legal counsel post in the Office. Counsel improves your chances in court, makes settlements cheaper and cuts legal fees.','在办公室点法律顾问岗位。法律顾问能提高胜诉几率、降低和解金额并减少诉讼费用。'],ok:()=>!!lawyer(),r:15000,go:'office'},
 {id:'m17',t:['Sörvey yaptır','Complete a class survey','完成船级检验'],h:['Durum sekmesinde Klas satırı sörvey tarihini gösterir. Zamanı yaklaşınca tersanesi olan bir limana git ve sörvey yaptır; kaçırırsan klas askıya alınır.','The Class line on the Status tab shows the survey date. When it’s near, go to a port with a shipyard and do the survey; miss it and class is suspended.','状态页的“船级”行显示检验日期。临近时去有船厂的港口检验；错过会暂停船级。'],ok:()=>did('svy'),r:15000,go:'fleet'},
 {id:'m18',t:['Kadet programını başlat','Start the cadet programme','启动实习生计划'],h:['Ofis’te kadet programını aç, sonra gemi › Personel’den kadet al. Bir yıl sonra kendi yetiştirdiğin zabitlerin olur.','Start the programme in the Office, then take cadets on ship › Crew. A year later you have officers you trained yourself.','在办公室启动计划，然后在 船舶 › 船员 招收实习生。一年后就有自己培养的驾驶员。'],ok:()=>!!S.cprog,r:10000,go:'office'},
 {id:'m19',t:['50 yük teslim et','Deliver 50 cargoes','交付50批货物'],h:['Filoyu büyüt, farklı gemi sınıflarında tecrübe kazan. Her sınıfın seviyesi yeni ruhsatlar ve limanlar açar.','Grow the fleet and gain experience in different ship classes. Each class level opens new licences and ports.','扩大船队，在不同船型积累经验。每个船型等级都会开放新执照和港口。'],ok:()=>S.stat.cargo>=50,pr:()=>[S.stat.cargo,50],r:100000,go:'xp'},
 {id:'m20',t:['Rıhtım satın al','Buy a berth','购买泊位'],h:['Şirket seviyesi 3’te yoğun bir limanın sayfasından rıhtım al. Gemilerin orada kuyruk beklemez ve terminal her ay gelir getirir.','At company level 3, buy a berth from a busy port’s page. Your ships skip the queue there and the terminal earns every month.','公司等级3时，在繁忙港口页面购买泊位。你的船在那里无需排队，码头每月有收入。'],ok:()=>Object.keys(S.term||{}).length>0,r:100000,go:'world'},
 {id:'m21',t:['Yeni gemi siparişi ver','Order a newbuilding','订造新船'],h:['Pazar › Yeni inşa’dan bir tersane seç. Sıfır gemi pahalıdır ama az yakar, az arıza yapar ve karbon notu iyidir.','Pick a yard under Market › Newbuilding. A new ship is expensive but burns less, breaks down less and has a good carbon rating.','在 市场 › 新造船 选择船厂。新船贵，但省油、少故障、碳评级好。'],ok:()=>S.nb.length>0||did('nbDone'),r:150000,go:'market'},
 {id:'m22',t:['Müstakil ofise taşın','Move into an office building','搬进独栋办公楼'],h:['Daha büyük bina daha çok müdür, daha çok gemi ve daha yüksek kredi limiti demek.','A bigger building means more managers, more ships and a higher credit limit.','更大的办公楼意味着更多经理、更多船和更高的信用额度。'],ok:()=>S.hq>=3,r:100000,go:'office'}];
const msnCur=()=>MSN.filter(m=>!S.msn[m.id]);
function msnCheck(){if(!S||!S.msn)return;let n=0;for(const m of MSN){if(S.msn[m.id]||!m.ok())continue;S.msn[m.id]=1;n++;earn(m.r,'görev');addRep(1);
  const t=()=>L('Görev tamam: '+tx(m.t)+' · ödül '+USD(m.r),'Mission complete: '+tx(m.t)+' · reward '+USD(m.r),'任务完成：'+tx(m.t)+' · 奖励'+USD(m.r));logMsg(t);if(typeof toast==='function')toast(t(),'','ok');
  if(m.id==='m11')tip('mgr');}return n;}
function msnAct(a){if(!S||!S.done)return;S.done[a]=1;msnCheck();}

/* ---------- ipuçları ---------- */
function tipsOn(){return typeof PREF==='undefined'||PREF.tips!==0;}
function tip(k){if(!S||!S.tips||S.tips[k]||!tipsOn())return;S.tips[k]=1;S.tipQ.push(k);if(typeof tipRender==='function')tipRender();}

function deep4Day(day){lawDay();msnCheck();awTrack();if(day%365===0&&day>0&&S.awDone!==day){S.awDone=day;awYear();}
 if(S.cash<0)tip('cash');if(coLv()>=3)tip('term');for(const s of S.ships){if(!s.svP&&svLeft(s)<=60)tip('svy');if(dueCrew(s).length)tip('ce');if(s.state==='sea'&&s.voy){const p=posOn(s.voy),z=rzAt(p.lon,p.lat);if(z&&rzLvl(z))tip('rz');}}}

/* ---------- yıl sonu denizcilik ödülleri ---------- */
const AWK={
 own:{n:['Yılın Armatörü','Shipowner of the Year','年度船东'],why:['yılın en hızlı büyüyen şirketi','the fastest-growing company of the year','年度增长最快的公司'],rep:5},
 safe:{n:['Güvenlik Ödülü','Safety Award','安全奖'],why:['tutulma, kaza ve ihlal olmadan geçen bir yıl','a year without detentions, accidents or violations','全年无滞留、无事故、无违规'],rep:4},
 green:{n:['Yeşil Denizcilik Ödülü','Green Shipping Award','绿色航运奖'],why:['filonun karbon notları','the fleet’s carbon ratings','船队的碳评级'],rep:3},
 crew:{n:['Yılın İşvereni','Employer of the Year','年度雇主'],why:['denizcilere iyi bakan şirket','the company that looks after its seafarers','善待船员的公司'],rep:3}};
function awInit(){S.awards=S.awards||[];if(!S.yr)awYearStart();}
function awYearStart(){S.yr={det:0,acc:0,lost:0,walk:0,bd:0,dump:0,nw0:Math.max(1,netWorth())};for(const r of S.riv||[])r.v0=r.v;}
function awTrack(){const y=S.yr;if(!y)return;for(const s of S.ships){if(s.state==='held'){if(!s.hC){s.hC=1;y.det++;}}else if(s.hC)s.hC=0;}}
function awYear(){const y=S.yr,yr=gameYear()-1,n=S.ships.length;if(!y)return awYearStart();const out=[],R=(S.riv||[]).filter(r=>r.st!=='gone'),rp=()=>R.length?pick(R).n:'Aegean Star Shipping';
 /* yılın armatörü */
 const g=(netWorth()-y.nw0)/Math.max(y.nw0,2e6),best=R.reduce((a,r)=>Math.max(a,(r.v/(r.v0||r.v))-1),-1),bestR=R.find(r=>(r.v/(r.v0||r.v))-1===best);
 out.push(['own',n>=2&&g>best&&g>0.15,bestR?bestR.n:rp()]);
 out.push(['safe',n>=2&&!y.det&&!y.acc&&!y.lost&&!y.dump&&y.bd<=n*2&&Math.random()<0.75,rp()]);
 const cs=S.ships.map(ciiOf),avg=cs.reduce((a,b)=>a+b,0)/Math.max(1,n);
 out.push(['green',n>=2&&avg<=1.2&&!cs.includes(4)&&Math.random()<0.75,rp()]);
 const mor=S.ships.reduce((a,s)=>a+s.morale,0)/Math.max(1,n);
 out.push(['crew',n>=2&&mor>=70&&!y.walk&&Math.random()<(S.cprog?0.9:0.55),rp()]);
 let won=0;for(const [k,w] of out)if(w){won++;S.awards.push({y:yr,k});addRep(AWK[k].rep);if(k==='crew')for(const s of S.ships)for(const r of ROLES){const p=s.crew[r.k];if(p)p.loy=Math.min(100,p.loy+5);}}
 const co=S.name;
 pushEv({k:'award',title:()=>L(yr+' Denizcilik Ödülleri',yr+' Shipping Awards',yr+'年度航运大奖'),body:()=>'',d:{yr,won,rows:out.map(([k,w,r])=>[k,w?1:0,w?co:r])},opts:[{l:OK3}]});
 logMsg(()=>L(yr+' ödülleri: '+won+' ödül',yr+' awards: '+won+' '+pl(won,'award','awards'),yr+'年度奖项：获得'+won+'项'));awYearStart();}
