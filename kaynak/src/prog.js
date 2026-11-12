/* ================= İLERLEME: TECRÜBE, RUHSAT, LİMAN KİLİTLERİ, GELİŞTİRMELER ================= */
const LVXP=[0,250,800,2000,4500];
const CLV=[0,400,1500,4000,9000];
const CLVN=['','','','',''];
const CLVN3=[['Yeni armatör','New shipowner','新晋船东'],['Bölgesel taşıyıcı','Regional carrier','区域承运人'],['Uzak yol armatörü','Deep-sea shipowner','远洋船东'],['Uluslararası armatör','International shipowner','国际船东'],['Küresel armatör','Global shipowner','全球船东']];
const LIC={koster:null,gcargo:['koster',2],ctank:['koster',3],handy:['gcargo',3],supra:['bulk',2],pmax:['bulk',3],mr:['tank',3],afra:['tank',4],feeder:['gcargo',3],cbox:['box',3],pctc:['gcargo',4],lng:['tank',4]};
const LICREP={handy:15,supra:25,pmax:35,ctank:10,mr:35,afra:55,feeder:15,cbox:35,pctc:30,lng:60};
const PTIER={JED:2,BND:2,KHI:2,DKR:2,LOS:2,MBA:2,DXB:3,BOM:3,CGP:3,DUR:3,SSZ:3,BUE:3,HAM:3,RTM:4,SIN:4,SHA:4,PUS:4,NYC:4,HOU:4,YOK:5,SYD:5,LAX:5};
const SHIPCAP=[0,2,5,9,15,25];
const CLSORD=['koster','gcargo','handy','supra','pmax','ctank','mr','afra','feeder','cbox','pctc','lng'];

const xpOf=k=>(S.xp&&S.xp[k])||0;
function lvOf(x,T){let l=1;for(let i=1;i<T.length;i++)if(x>=T[i])l=i+1;return l;}
const catLv=k=>lvOf(xpOf(k),LVXP);
const catB=s=>catLv(FLEETOF[s.cls])-1;
function coXP(){let t=S.xpB||0;for(const f of FLEETS)t+=xpOf(f.k);return t;}
const coLv=()=>lvOf(coXP(),CLV);
const portTier=pid=>PTIER[pid]||1;
const portUnl=pid=>portTier(pid)<=coLv();
const shipCap=()=>SHIPCAP[S.hq||1];
function licOk(cls){const r=LIC[cls];return !(r&&catLv(r[0])<r[1])&&S.rep>=(LICREP[cls]||0);}
function licTxt(cls){const r=LIC[cls],a=[];if(r)a.push(L(FLEET[r[0]].sh+' tecrübesi seviye '+r[1],FLEET[r[0]].sh+' experience level '+r[1],FLEET[r[0]].sh+'经验等级'+r[1]));if(LICREP[cls])a.push(L('itibar ','reputation ','声誉')+LICREP[cls]);return a.join(L(' ve ',' and ','和'));}
function lvPct(x,T){const l=lvOf(x,T);if(l>=T.length)return 100;const a=T[l-1],b=T[l];return clamp((x-a)/(b-a)*100,0,100);}

/* seviye kazançları: her seviye navlunu %3 artırır, denetim puanına 1,5 ekler, liman işlerini %4 kısaltır */
const frMul=s=>(1+0.03*catB(s))*ciiMul(s);
const opsMul=s=>(1-0.04*catB(s))*(up(s,'gear')?0.75:1);
const pscB=s=>1.5*catB(s)+(up(s,'nav')?4:0);

/* tecrübe kazanımı: oyun uzun soluklu olsun diye düşük tutulur */
const XPM=0.4;
function voyXP(c,late){const d=clamp(S.day-(c.t0===undefined?S.day-10:c.t0),2,80);let x=4+1.2*d;if(late)x*=0.5;if(PORT[c.to].st>=4)x*=1.2;return Math.max(1,Math.round(x*XPM));}
function addXP(k,x){if(!(x>0))return;const l0=catLv(k),c0=coLv();S.xp[k]=xpOf(k)+x;const l1=catLv(k),c1=coLv();
 if(l1>l0){const lic=CLSORD.filter(c=>LIC[c]&&LIC[c][0]===k&&LIC[c][1]===l1),ups=UPGK.filter(u=>UPG[u].lv===l1),F=FLEET[k];
  const ls=()=>LJ(lic.map(c=>CLS[c].n)),us=()=>LJ(ups.map(u=>UPG[u].n));
  pushEv({k:'lvl',title:()=>L(F.sh+' tecrübesi seviye '+l1,F.sh+' experience level '+l1,F.sh+'经验升至'+l1+'级'),
   body:()=>L('Şirketin '+F.sh.toLocaleLowerCase('tr')+' işinde ustalaştı. Bu sınıftaki gemiler artık navlunda %'+3*(l1-1)+' fazla kazanır, limanda daha hızlı çalışır ve denetimde daha iyi puan alır.'+(lic.length?' Yeni ruhsat: '+ls()+'. Gemi pazarından alabilirsin.':'')+(ups.length?' Yeni geliştirme: '+us()+'.':''),
    'Your company has grown more skilled in '+F.sh.toLowerCase()+' shipping. Ships in this class now earn '+3*(l1-1)+'% more freight, work faster in port and score better in inspections.'+(lic.length?' New licence: '+ls()+'. You can buy them in the ship market.':'')+(ups.length?' New upgrade: '+us()+'.':''),
    '公司在'+F.sh+'业务上更加娴熟。该类船舶的运费收入提高'+3*(l1-1)+'%，在港作业更快，检查得分也更高。'+(lic.length?'新执照：'+ls()+'。可以在船舶市场购买。':'')+(ups.length?'新的改装项目：'+us()+'。':'')),opts:[{l:OK3}]});
  logMsg(()=>L(F.sh+' tecrübesi seviye '+l1+' oldu',F.sh+' experience reached level '+l1,F.sh+'经验升至'+l1+'级'));}
 if(c1>c0){const ps=PORTS.filter(p=>portTier(p.id)===c1);ps.forEach(p=>fillOffers(p.id));const nh=HQ[c1+1]&&HQ[c1+1].lv===c1?HQ[c1+1]:null,pn=()=>LJ(ps.map(p=>p.n));
  pushEv({k:'lvl',title:()=>L('Şirket seviyesi ','Company level ','公司等级')+c1+L(': ',': ','：')+CLVN[c1-1],
   body:()=>L('Tecrüben arttıkça daha büyük limanlar seninle çalışmak istiyor. Yeni açılan limanlar: '+pn()+'.'+(nh?' '+nh.n+' binasına taşınma şartlarından biri de sağlandı.':''),'As your experience grows, bigger ports want to work with you. Newly opened ports: '+pn()+'.'+(nh?' You also meet one of the requirements for moving into the '+nh.n+'.':''),'随着经验增长，更大的港口愿意与你合作。新开放的港口：'+pn()+'。'+(nh?'搬入'+nh.n+'的条件之一也已达成。':'')),opts:[{l:OK3}]});
  logMsg(()=>L('Şirket seviyesi '+c1+' oldu, yeni limanlar açıldı','The company reached level '+c1+', new ports opened','公司升至'+c1+'级，新港口开放'));}}

/* ---------- gemi geliştirmeleri ---------- */
const UPG={coat:{n:'',d:'',f:0.02,k:0,lv:1,yard:1,days:4},nav:{n:'',d:'',f:0.012,k:25000,lv:1,yard:0,days:2},sec:{n:'',d:'',f:0.008,k:20000,lv:1,yard:0,days:2},hab:{n:'',d:'',f:0.01,k:15000,lv:1,yard:1,days:5},prop:{n:'',d:'',f:0.035,k:0,lv:2,yard:1,days:6},gear:{n:'',d:'',f:0.045,k:0,lv:2,yard:1,days:7},eng:{n:'',d:'',f:0.05,k:0,lv:3,yard:1,days:10},scr:{n:'',d:'',f:0.06,k:0,lv:3,yard:1,days:12},hold:{n:'',d:'',f:0.05,k:0,lv:4,yard:1,days:14},imo:{n:'',d:'',f:0.003,k:15000,lv:2,yard:0,days:2,t:['box']}};
const UPG3={
 coat:[['Silikon gövde boyası','Silicone hull coating','有机硅船体涂层'],['Kirlenmeyi önleyen boya. Hız %3 artar, tüketim %4 azalır.','Antifouling paint. Speed +3%, fuel consumption −4%.','防污涂料。航速提高3%，油耗降低4%。']],
 nav:[['Köprüüstü paketi','Bridge package','驾驶台升级包'],['Yeni ECDIS ve radar. Fırtınada hasar riski azalır, denetimde puan kazandırır.','New ECDIS and radar. Less risk of storm damage and better inspection scores.','新的电子海图（ECDIS）和雷达。降低风暴受损风险，提高检查得分。']],
 sec:[['Güvenlik paketi','Security package','安保升级包'],['Sığınak odası, jiletli tel, gözetleme. Korsan ve saldırı riski büyük ölçüde azalır.','Citadel, razor wire and lookout gear. Greatly reduces the risk of piracy and attacks.','安全舱、蛇腹铁丝网和瞭望设备。大幅降低海盗和袭击风险。']],
 hab:[['Yaşam mahalli yenileme','Accommodation refit','生活区翻新'],['Kamaralar, yemekhane ve internet yenilenir. Mürettebatın morali yükselir.','Cabins, mess room and internet are renewed. Crew morale goes up.','翻新船员舱室、餐厅和网络。船员士气提升。']],
 prop:[['Verimli pervane','Efficient propeller','高效螺旋桨'],['Yeni pervane ve dümen. Yakıt tüketimi %8 azalır.','New propeller and rudder. Fuel consumption −8%.','新的螺旋桨和舵。油耗降低8%。']],
 gear:[['Yük donanımı','Cargo gear','货物装卸设备'],['Güverte vinçleri (kuru yük) ya da yüksek kapasiteli kargo pompaları (tanker). Yükleme ve tahliye %25 kısalır.','Deck cranes (dry cargo) or high-capacity cargo pumps (tankers). Loading and discharge 25% faster.','甲板吊（干货船）或大排量货油泵（油轮）。装卸时间缩短25%。']],
 eng:[['Makine revizyonu','Engine overhaul','主机大修'],['Ana makine ve yardımcılar elden geçer. Arıza ihtimali %35, yıpranma %20 azalır.','The main engine and auxiliaries are overhauled. Breakdowns −35%, wear −20%.','主机和辅机全面检修。故障概率降低35%，磨损降低20%。']],
 scr:[['Scrubber','Scrubber','脱硫塔'],['Egzoz temizleyici. Ucuz yüksek kükürtlü yakıt yakar: yakıt %10 ucuzlar, Avrupa emisyon bedelinden muaf olur.','Exhaust gas cleaner. Burns cheaper high-sulphur fuel: fuel 10% cheaper, and exempt from the European emissions charge.','废气洗涤系统。可使用更便宜的高硫燃油：燃油便宜10%，并免缴欧洲排放费。']],
 imo:[['Tehlikeli yük belgesi (DOC)','Dangerous goods certificate (DOC)','危险品适装证书（DOC）'],['Gemi tehlikeli madde taşıma uygunluk belgesi alır; IMO sınıfı yükleri taşıyabilir. Bu yükler daha iyi öder.','The ship gets a Document of Compliance for dangerous goods and can carry IMO-class cargo, which pays better.','船舶取得危险品适装证书，可以装运IMO类危险货物，这类货物运费更高。']],
 hold:[['Kapasite artırımı','Capacity increase','扩容改造'],['Ambar ya da tanklar büyütülür. Taşıma kapasitesi %6 artar.','Holds or tanks are enlarged. Carrying capacity +6%.','扩大货舱或液货舱。载货量增加6%。']]};
const UPGK=Object.keys(UPG);
const HULLC=[['',''],['','#22364f'],['','#6e2222'],['','#1f4d3a'],['','#202326'],['','#5d656c'],['','#b4561c']];
const HULL3=[['Fabrika','Factory','原厂'],['Lacivert','Navy','藏青'],['Bordo','Maroon','酒红'],['Yeşil','Green','绿色'],['Siyah','Black','黑色'],['Gri','Grey','灰色'],['Turuncu','Orange','橙色']];
const up=(s,k)=>!!(s&&s.up&&s.up[k]);
const yardF=s=>(s.port&&PORT[s.port].yard)||1;
function upgCost(s,k){const u=UPG[k];return Math.round((CLS[s.cls].base*u.f+u.k)*(u.yard?yardF(s):1)/1000)*1000;}
function upgVal(s){let v=0;if(s.up)for(const k in s.up)if(UPG[k])v+=CLS[s.cls].base*UPG[k].f*0.45;return v;}
function upgWhy(s,k){const u=UPG[k],sh=FLEET[FLEETOF[s.cls]].sh;if(up(s,k))return L('takılı','fitted','已安装');if(u.t&&!u.t.includes(s.type))return L('bu gemi tipine uygun değil','not for this ship type','不适用于此船型');if(catLv(FLEETOF[s.cls])<u.lv)return L(sh+' tecrübesi seviye '+u.lv+' gerekli','requires '+sh+' experience level '+u.lv,'需要'+sh+'经验等级'+u.lv);
 if(s.state!=='idle')return L('gemi limanda boşta olmalı','the ship must be idle in port','船舶须在港空闲');if(u.yard&&!PORT[s.port].yard)return L('tersaneli limanda yapılır','done at a port with a shipyard','须在有船厂的港口进行');if(!canPay(upgCost(s,k)))return L('nakit yetmiyor','not enough cash','现金不足');return '';}
function paintCost(s){return Math.round((CLS[s.cls].base*0.004+6000)*yardF(s)/1000)*1000;}
function startWork(s,cost,days,tag,what){pay(cost,'geliştirme');s.state='maint';s.op=days;s.maintTo=s.cond;s.upP=tag;s.ack=false;logMsg(()=>L(s.name+': '+what()+' işine başlandı, '+USD(cost),s.name+': work started on '+what()+', '+USD(cost),s.name+'：开始'+what()+'，'+USD(cost)));resume();save();}
function doUpg(s,k){if(upgWhy(s,k))return false;startWork(s,upgCost(s,k),UPG[k].days,k,()=>UPG[k].n);return true;}
function doPaint(s,ci){if(s.state!=='idle'||!PORT[s.port].yard||!HULLC[ci])return false;const c=paintCost(s);if(!canPay(c)){toast(L('Boya için nakit yetmiyor','Not enough cash for painting','现金不足以涂装'),'','bad');return false;}startWork(s,c,3,'paint:'+ci,()=>L('gövde boyası ('+HULLC[ci][0].toLocaleLowerCase('tr')+')','hull painting ('+HULLC[ci][0].toLowerCase()+')','船体涂装（'+HULLC[ci][0]+'）'));return true;}
function finishWork(s){const t=s.upP;s.upP=0;if(!t)return '';
 if(t.startsWith('paint:')){s.col=+t.slice(6);return L('boya bitti','painting done','涂装完成');}
 s.up=s.up||{};s.up[t]=1;if(t==='hold')s.dwt=Math.round(s.dwt*1.06/100)*100;logMsg(()=>L(s.name+': '+UPG[t].n+' tamamlandı',s.name+': '+UPG[t].n+' completed',s.name+'：'+UPG[t].n+'已完成'));return L(UPG[t].n.toLocaleLowerCase('tr')+' tamam',UPG[t].n+' done',UPG[t].n+'完成');}
function renameShip(s,nm){nm=(nm||'').replace(/\s+/g,' ').trim().slice(0,22);if(nm.length<2)return false;const pre=shipPre(s.type);if(pre+nm===s.name)return false;
 const fee=5000;if(!canPay(fee)){toast(L('Sicil harcı için nakit yetmiyor','Not enough cash for the registry fee','现金不足以支付登记费'),'','bad');return false;}pay(fee,'geliştirme');const old=s.name;logMsg(()=>L(old+' adını değiştirdi: '+pre+nm,old+' renamed: '+pre+nm,old+'更名为'+pre+nm));s.name=pre+nm;save();return true;}
const hullCol=s=>(s&&s.col&&HULLC[s.col]?HULLC[s.col][1]:'');

/* ---------- eski kayıtlara geçiş ---------- */
function initProg(){S.ships.forEach(s=>{s.up=s.up||{};});if(S.xp)return;S.xp={koster:0,gcargo:0,bulk:0,tank:0};S.xpB=0;
 if(!S.ships.length&&!(S.stat&&S.stat.cargo))return;
 const n={};S.ships.forEach(s=>{const k=FLEETOF[s.cls];n[k]=(n[k]||0)+1;});const tot=S.ships.length||1;
 for(const k in n)S.xp[k]+=Math.round((S.stat.cargo||0)*16*n[k]/tot);
 for(const s of S.ships){const r=LIC[s.cls];if(r)S.xp[r[0]]=Math.max(S.xp[r[0]],LVXP[r[1]-1]);}
 let mt=1;for(const s of S.ships){for(const p of [s.port,s.voy&&s.voy.to,s.cargo&&s.cargo.to])if(p)mt=Math.max(mt,portTier(p));}
 S.xpB=Math.max(0,CLV[mt-1]-coXP());}

installLang();
