/* ================= DİL / LANGUAGE / 语言 ================= */
const LANGS=['tr','en','zh'],LANGN=['Türkçe','English','中文'];
let LI=0;
const LANG=()=>LANGS[LI];
/* anında metin: L(türkçe, english, 中文) */
const L=(tr,en,zh)=>LI===1?en:LI===2?zh:tr;
/* kaydedilecek metin: kapanışı üç dilde çalıştırır, [tr,en,zh] döndürür */
function LX(f){if(typeof f!=='function')return f;const o=LI,r=[];try{for(let i=0;i<3;i++){LI=i;r.push(f());}}finally{LI=o;}return r;}
const tx=v=>Array.isArray(v)?(v[LI]!==undefined?v[LI]:v[0]):(v==null?'':v);
function detectLang(){try{const s=localStorage.getItem('armator_lang');if(LANGS.includes(s))return s;}catch(e){}
 try{const ls=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']).map(x=>String(x).toLowerCase());for(const l of ls){if(l.startsWith('tr'))return 'tr';if(l.startsWith('zh'))return 'zh';if(l.startsWith('en'))return 'en';}}catch(e){}return 'en';}
function setLangIdx(i){LI=clamp0(i);}
const clamp0=i=>i===1||i===2?i:0;
const pl=(n,one,many)=>n===1?one:many;

/* ---------- sayı ve tarih ---------- */
const LOC=['tr-TR','en-US','zh-CN'];
const MONS=[['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']];

/* ---------- sözlükler ---------- */
const PN3={IST:['İstanbul','Istanbul','伊斯坦布尔'],IZM:['İzmir','Izmir','伊兹密尔'],MER:['Mersin','Mersin','梅尔辛'],CND:['Köstence','Constanța','康斯坦察'],NOV:['Novorossiysk','Novorossiysk','新罗西斯克'],PIR:['Pire','Piraeus','比雷埃夫斯'],ALX:['İskenderiye','Alexandria','亚历山大'],TRP:['Trablus','Tripoli','的黎波里'],ALG:['Cezayir','Algiers','阿尔及尔'],GOA:['Cenova','Genoa','热那亚'],ALC:['Algeciras','Algeciras','阿尔赫西拉斯'],CAS:['Kazablanka','Casablanca','卡萨布兰卡'],RTM:['Rotterdam','Rotterdam','鹿特丹'],HAM:['Hamburg','Hamburg','汉堡'],DKR:['Dakar','Dakar','达喀尔'],LOS:['Lagos','Lagos','拉各斯'],DUR:['Durban','Durban','德班'],MBA:['Mombasa','Mombasa','蒙巴萨'],JED:['Cidde','Jeddah','吉达'],DXB:['Dubai','Dubai','迪拜'],KHI:['Karaçi','Karachi','卡拉奇'],BOM:['Mumbai','Mumbai','孟买'],CGP:['Chittagong','Chittagong','吉大港'],SIN:['Singapur','Singapore','新加坡'],SHA:['Şanghay','Shanghai','上海'],PUS:['Busan','Busan','釜山'],YOK:['Yokohama','Yokohama','横滨'],SYD:['Sidney','Sydney','悉尼'],SSZ:['Santos','Santos','桑托斯'],BUE:['Buenos Aires','Buenos Aires','布宜诺斯艾利斯'],HOU:['Houston','Houston','休斯敦'],NYC:['New York','New York','纽约'],LAX:['Los Angeles','Los Angeles','洛杉矶'],BND:['Bender Abbas','Bandar Abbas','阿巴斯港']};
const CN3={TR:['Türkiye','Türkiye','土耳其'],RO:['Romanya','Romania','罗马尼亚'],RU:['Rusya','Russia','俄罗斯'],GR:['Yunanistan','Greece','希腊'],EG:['Mısır','Egypt','埃及'],LY:['Libya','Libya','利比亚'],DZ:['Cezayir','Algeria','阿尔及利亚'],IT:['İtalya','Italy','意大利'],ES:['İspanya','Spain','西班牙'],MA:['Fas','Morocco','摩洛哥'],NL:['Hollanda','Netherlands','荷兰'],DE:['Almanya','Germany','德国'],SN:['Senegal','Senegal','塞内加尔'],NG:['Nijerya','Nigeria','尼日利亚'],ZA:['Güney Afrika','South Africa','南非'],KE:['Kenya','Kenya','肯尼亚'],SA:['Suudi Arabistan','Saudi Arabia','沙特阿拉伯'],AE:['BAE','UAE','阿联酋'],PK:['Pakistan','Pakistan','巴基斯坦'],IN:['Hindistan','India','印度'],BD:['Bangladeş','Bangladesh','孟加拉国'],SG:['Singapur','Singapore','新加坡'],CN:['Çin','China','中国'],KR:['Güney Kore','South Korea','韩国'],JP:['Japonya','Japan','日本'],AU:['Avustralya','Australia','澳大利亚'],BR:['Brezilya','Brazil','巴西'],AR:['Arjantin','Argentina','阿根廷'],US:['ABD','USA','美国'],IR:['İran','Iran','伊朗']};
const KIND3={'Genel kargo':['General cargo','件杂货'],'Çelik rulo':['Steel coils','钢卷'],'Çimento':['Cement','水泥'],'Kereste':['Timber','木材'],'Hurda':['Scrap metal','废钢'],'Mermer':['Marble','大理石'],'Gübre':['Fertiliser','化肥'],'Tahıl':['Grain','谷物'],'Proje yükü':['Project cargo','项目货物'],'Kömür':['Coal','煤炭'],'Klinker':['Clinker','熟料'],'Şeker':['Sugar','糖'],'Çelik':['Steel','钢材'],'Demir cevheri':['Iron ore','铁矿石'],'Boksit':['Bauxite','铝土矿'],'Motorin':['Diesel','柴油'],'Benzin':['Gasoline','汽油'],'Bitkisel yağ':['Vegetable oil','植物油'],'Kimyasal':['Chemicals','化学品'],'Jet yakıtı':['Jet fuel','航空煤油'],'Nafta':['Naphtha','石脑油'],'Ham petrol':['Crude oil','原油'],'Fuel oil':['Fuel oil','燃料油']};
const kindN=k=>LI&&KIND3[k]?KIND3[k][LI-1]:k;
const CV3={'Büyük bir armatörde yıllarca çalıştı':['Worked for years at a large shipowner','曾在大型船东公司工作多年'],'Yirmi yıldır aynı işi yapıyor, piyasayı ezbere bilir':['Twenty years in the job, knows the market by heart','干这行二十年，对市场了如指掌'],'Önceki şirketinde iyi iş çıkardı, referansları sağlam':['Did well at the last company, strong references','在上一家公司表现出色，推荐信可靠'],'Yurt dışında uzun süre çalıştı':['Worked abroad for a long time','曾长期在海外工作'],'Orta ölçekli bir şirkette çalıştı':['Worked at a mid-sized company','曾在一家中型公司工作'],'Limanları iyi tanır':['Knows the ports well','熟悉各个港口'],'İşini bilir, parlak değil':['Knows the job, nothing brilliant','业务熟练，但不算出色'],'Denizden karaya yeni geçti':['Recently came ashore from sea service','刚从海上转到岸上工作'],'Yeni mezun, çok hevesli':['Fresh graduate, very eager','应届毕业生，干劲十足'],'Bir tanıdığın tavsiyesiyle geldi':['Came recommended by an acquaintance','经熟人推荐而来'],'Son üç işinden kısa sürede ayrıldı':['Left the last three jobs after a short time','最近三份工作都很快离职'],'Sektöre yeni girdi':['New to the industry','刚入行']};
const cvN=c=>LI&&CV3[c]?CV3[c][LI-1]:c;
const TOLL3={'Süveyş Kanalı':['Suez Canal','苏伊士运河'],'Panama Kanalı':['Panama Canal','巴拿马运河']};
const tollN=n=>LI&&TOLL3[n]?TOLL3[n][LI-1]:n;
const BD3=[['Yakıt pompası sıkıştı','The fuel pump has seized','燃油泵卡死'],['Turboşarj surge yapıyor','The turbocharger is surging','增压器发生喘振'],['Soğutma suyu pompası kaçırıyor','The cooling water pump is leaking','冷却水泵泄漏'],['Egzoz valfi yandı','An exhaust valve has burnt out','排气阀烧损'],['Jeneratör devreden çıktı','A generator has tripped','发电机跳闸'],['Separatör arızalandı, yakıt kirli geliyor','The separator has failed and the fuel is coming through dirty','分油机故障，燃油不洁'],['Yağlama yağı basıncı düştü','Lube oil pressure has dropped','滑油压力下降'],['Dümen makinesinde hidrolik kaçağı var','There is a hydraulic leak in the steering gear','舵机液压系统泄漏'],['Hava kompresörü arızalandı','The air compressor has failed','空压机故障'],['Krank yatağı sıcaklığı yükseldi','A crankshaft bearing is running hot','曲轴轴承温度升高']];
const CLS3={koster:['Koster','Coaster','沿海货船'],gcargo:['Genel kargo','General cargo','杂货船'],handy:['Handysize dökme','Handysize bulker','灵便型散货船'],supra:['Supramax dökme','Supramax bulker','超灵便型散货船'],pmax:['Panamax dökme','Panamax bulker','巴拿马型散货船'],ctank:['Küçük ürün tankeri','Small product tanker','小型成品油船'],mr:['MR tanker','MR tanker','MR型油轮'],afra:['Aframax tanker','Aframax tanker','阿芙拉型油轮']};
const ROLE3={kap:[['Kaptan','Captain','船长'],['Sefer hızını, fırtınadaki kararları ve denetim sonuçlarını etkiler.','Affects voyage speed, decisions in storms and inspection results.','影响航速、风暴中的决策和检查结果。']],
 zab:[['2. Kaptan','Chief officer','大副'],['Yükleme ve tahliye süresini, yük hasarı riskini etkiler.','Affects loading and discharge time and the risk of cargo damage.','影响装卸时间和货损风险。']],
 cb:[['Çarkçıbaşı','Chief engineer','轮机长'],['Arıza sıklığını, yakıt tüketimini ve denetim sonuçlarını etkiler.','Affects breakdown frequency, fuel consumption and inspection results.','影响故障频率、油耗和检查结果。']],
 c2:[['2. Çarkçı','Second engineer','大管轮'],['Arızaların gemide tamir edilmesini ve makinenin yıpranmasını etkiler.','Affects whether breakdowns get fixed on board and how fast the engine wears.','影响能否在船上排除故障以及主机磨损速度。']],
 asc:[['Aşçı','Cook','厨师'],['Mürettebatın moralini belirler. Moral düşerse herkes daha kötü çalışır.','Sets crew morale. When morale drops, everyone works worse.','决定船员士气。士气低落时，所有人的工作都会变差。']]};
const STN3=[['','',''],['çok gevşek','very lax','很宽松'],['gevşek','lax','宽松'],['orta','moderate','中等'],['sıkı','strict','严格'],['çok sıkı','very strict','很严格']];
const RISK3=[['düşük','low','低'],['orta','medium','中'],['yüksek','high','高']];
const STN=[],RISK=[];
STN3.forEach((t,i)=>Object.defineProperty(STN,i,{get:()=>t[LI],enumerable:true}));
RISK3.forEach((t,i)=>Object.defineProperty(RISK,i,{get:()=>t[LI],enumerable:true}));
const NATN={TR:['TR','TR','土耳其'],PH:['PH','PH','菲律宾'],UA:['UA','UA','乌克兰'],IN:['IN','IN','印度'],GE:['GE','GE','格鲁吉亚'],AZ:['AZ','AZ','阿塞拜疆'],ID:['ID','ID','印尼'],CN:['CN','CN','中国']};
const natN=c=>NATN[c]?NATN[c][LI]:c;

/* tablolara dil getter'ları kur (bütün tablolar tanımlandıktan sonra çağrılır) */
function defG(o,k,t){Object.defineProperty(o,k,{get:()=>t[LI],configurable:true,enumerable:true});}
function installLang(){
 PORTS.forEach(p=>{if(PN3[p.id])defG(p,'n',PN3[p.id]);});
 for(const c in CN3)defG(CNAME,c,CN3[c]);
 for(const k in CLS)if(CLS3[k])defG(CLS[k],'n',CLS3[k]);
 ROLES.forEach(r=>{const t=ROLE3[r.k];if(t){defG(r,'n',t[0]);defG(r,'d',t[1]);}});
 FLEETS.forEach(f=>{const t=FLEET3[f.k];defG(f,'n',t[0]);defG(f,'sh',t[1]);});
 for(const k in SROLE){const t=SROLE3[k];defG(SROLE[k],'n',t[0]);defG(SROLE[k],'d',t[1]);}
 HQ.forEach((h,i)=>{if(!h)return;const t=HQ3[i];defG(h,'n',t[0]);defG(h,'d',t[1]);});
 for(const k in UPG){const t=UPG3[k];defG(UPG[k],'n',t[0]);defG(UPG[k],'d',t[1]);}
 HULLC.forEach((c,i)=>{const t=HULL3[i];Object.defineProperty(c,0,{get:()=>t[LI],configurable:true,enumerable:true});});
 CLVN3.forEach((t,i)=>Object.defineProperty(CLVN,i,{get:()=>t[LI],configurable:true,enumerable:true}));}
