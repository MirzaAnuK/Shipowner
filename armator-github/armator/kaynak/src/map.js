/* ================= HARİTA ================= */
const $=q=>document.querySelector(q);
const cv=$('#map'),cx=cv.getContext('2d'),base=document.createElement('canvas'),bx=base.getContext('2d');
let CW=1,CH=1,DPR=1,baseKey='',patLand=null,patSea=null,ROT=false;const TH={};
const view={lon:24,lat:38.5,z:11};
const TKEYS=['sea','shal','land','coast','grid','mag','ink','mute','ok','warn','bad','dry','tank','card','foam','hull','deck','sup'];
const FD='"Barlow Condensed","Arial Narrow","Roboto Condensed","PingFang SC","Hiragino Sans GB","Noto Sans SC","Microsoft YaHei",sans-serif';
function mkPatterns(){
 const a=document.createElement('canvas');a.width=a.height=96;const g=a.getContext('2d');let seed=7;const rr=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<300;i++){g.fillStyle=rr()<0.5?'rgba(0,0,0,0.07)':'rgba(255,255,255,0.10)';const q=rr()<0.8?1:2;g.fillRect(Math.floor(rr()*96),Math.floor(rr()*96),q,q);}
 patLand=bx.createPattern(a,'repeat');
 const b=document.createElement('canvas');b.width=72;b.height=40;const h=b.getContext('2d');h.strokeStyle=TH.foam;h.globalAlpha=0.2;h.lineWidth=1;h.lineCap='round';
 const wv=(x,y)=>{h.beginPath();h.moveTo(x,y);h.quadraticCurveTo(x+3,y-2.5,x+6,y);h.quadraticCurveTo(x+9,y+2.5,x+12,y);h.stroke();};wv(8,10);wv(44,30);
 patSea=bx.createPattern(b,'repeat');}
function readTheme(){const cs=getComputedStyle(document.documentElement);let k='';for(const t of TKEYS){TH[t]=cs.getPropertyValue('--'+t).trim();k+=TH[t];}if(k!==TH._k){TH._k=k;mkPatterns();baseKey='';}}
const zmin=()=>CW/(360*KX);
function clampView(){view.z=clamp(view.z,zmin(),40);const hw=CW/2/(view.z*KX),hh=CH/2/view.z;view.lon=hw>=180?0:clamp(view.lon,-180+hw,180-hw);view.lat=hh>=68?10:clamp(view.lat,-58+hh,79-hh);}
function resizeMap(){const el=cv.parentElement,w=el.clientWidth,h=el.clientHeight;if(w<2||h<2)return;DPR=Math.min(window.devicePixelRatio||1,2.5);CW=w;CH=h;cv.width=base.width=Math.round(CW*DPR);cv.height=base.height=Math.round(CH*DPR);baseKey='';clampView();}
const sx=lon=>(lon-view.lon)*KX*view.z+CW/2,sy=lat=>(view.lat-lat)*view.z+CH/2;
function zoomAt(px,py,z){const lon=view.lon+(px-CW/2)/(KX*view.z),lat=view.lat-(py-CH/2)/view.z;view.z=clamp(z,zmin(),40);view.lon=lon-(px-CW/2)/(KX*view.z);view.lat=lat+(py-CH/2)/view.z;clampView();}
function focusOn(lon,lat,minZ,force){const x=sx(lon),y=sy(lat);if(!force&&x>40&&x<CW-56&&y>60&&y<CH-54&&view.z>=(minZ||0))return;view.lon=lon;view.lat=lat;if(minZ&&view.z<minZ)view.z=minZ;clampView();}

/* liman önündeki deniz yönü (ekran koordinatında birim vektör) */
PORTS.forEach(p=>{let vx=0,vy=0,n=0;for(let k=0;k<24;k++){const a=k/24*Math.PI*2;for(const r of [0.35,0.7,1.1]){n++;if(!isLand(p.lon+Math.cos(a)*r,p.lat+Math.sin(a)*r)){vx+=Math.cos(a);vy+=Math.sin(a);}}}
 let ux=vx*KX,uy=-vy;const m=Math.hypot(ux,uy);if(m<n*0.08){ux=0;uy=1;}else{ux/=m;uy/=m;}p.ux=ux;p.uy=uy;});

const SEA_LBL=[[['ATLAS OKYANUSU','ATLANTIC OCEAN','大西洋'],-40,31,0,6],[['ATLAS OKYANUSU','ATLANTIC OCEAN','大西洋'],-16,-20,1.2,6],[['HİNT OKYANUSU','INDIAN OCEAN','印度洋'],76,-15,0,7],[['BÜYÜK OKYANUS','PACIFIC OCEAN','太平洋'],-142,6,0,6],[['BÜYÜK OKYANUS','PACIFIC OCEAN','太平洋'],168,16,1.2,6],[['AKDENİZ','MEDITERRANEAN','地中海'],18.3,34.3,3,24],[['KARADENİZ','BLACK SEA','黑海'],34.4,43.15,5,40],[['EGE DENİZİ','AEGEAN SEA','爱琴海'],25.2,37.05,13,40],[['MARMARA','MARMARA','马尔马拉海'],28.0,40.7,22,40],[['KIZILDENİZ','RED SEA','红海'],37.4,21.3,7,40],[['UMMAN DENİZİ','ARABIAN SEA','阿拉伯海'],63,16,3,30],[['BENGAL KÖRFEZİ','BAY OF BENGAL','孟加拉湾'],88.5,14,3.5,30],[['GÜNEY ÇİN DENİZİ','SOUTH CHINA SEA','南海'],114.5,14.5,3.5,30],[['KUZEY DENİZİ','NORTH SEA','北海'],3,56.3,5,30],[['KARAYİP DENİZİ','CARIBBEAN SEA','加勒比海'],-75,15,3.5,30],[['MEKSİKA KÖRFEZİ','GULF OF MEXICO','墨西哥湾'],-90.5,25,4,30],[['BASRA KÖRFEZİ','PERSIAN GULF','波斯湾'],51.9,26.7,10,40],[['BİSKAY KÖRFEZİ','BAY OF BISCAY','比斯开湾'],-4.6,45.4,7,40],[['TİREN DENİZİ','TYRRHENIAN SEA','第勒尼安海'],12.3,39.9,11,40],[['DOĞU ÇİN DENİZİ','EAST CHINA SEA','东海'],125.3,29.3,5,30],[['JAPON DENİZİ','SEA OF JAPAN','日本海'],135,39.5,5,30],[['MOZAMBİK KANALI','MOZAMBIQUE CHANNEL','莫桑比克海峡'],40.6,-19.5,6,30],[['GİNE KÖRFEZİ','GULF OF GUINEA','几内亚湾'],2,2,4,30],[['TASMAN DENİZİ','TASMAN SEA','塔斯曼海'],160,-38,3,30]];
const LAND_LBL=[[['KUZEY AMERİKA','NORTH AMERICA','北美洲'],-102,45,0,3.2],[['GÜNEY AMERİKA','SOUTH AMERICA','南美洲'],-58,-12,0,3.2],[['AFRİKA','AFRICA','非洲'],20,8,0,3.2],[['AVRUPA','EUROPE','欧洲'],22,52,0,3.2],[['ASYA','ASIA','亚洲'],95,48,0,3.2],[['AVUSTRALYA','AUSTRALIA','澳大利亚'],134,-25,0,40],
 [['TÜRKİYE','TÜRKİYE','土耳其'],33.5,39.2,4.5,40],[['YUNANİSTAN','GREECE','希腊'],21.8,39.6,10,40],[['BULGARİSTAN','BULGARIA','保加利亚'],25.3,42.7,9,40],[['ROMANYA','ROMANIA','罗马尼亚'],25,45.8,6,40],[['UKRAYNA','UKRAINE','乌克兰'],32,48.8,5,40],[['RUSYA','RUSSIA','俄罗斯'],42,51,3.2,40],[['GÜRCİSTAN','GEORGIA','格鲁吉亚'],43.5,42.2,10,40],[['SURİYE','SYRIA','叙利亚'],38.5,35,8,40],[['IRAK','IRAQ','伊拉克'],43.5,33,7,40],[['İRAN','IRAN','伊朗'],54,32.5,4.5,40],[['MISIR','EGYPT','埃及'],29.5,27,5,40],[['LİBYA','LIBYA','利比亚'],17.5,27.5,5,40],[['TUNUS','TUNISIA','突尼斯'],9.4,34.3,10,40],[['CEZAYİR','ALGERIA','阿尔及利亚'],2.5,31,5,40],[['FAS','MOROCCO','摩洛哥'],-6.5,31.8,6,40],[['İSPANYA','SPAIN','西班牙'],-3.8,40,5,40],[['FRANSA','FRANCE','法国'],2.5,46.8,5,40],[['İTALYA','ITALY','意大利'],12.3,43.3,8,40],[['ALMANYA','GERMANY','德国'],10.3,51,5,40],[['İNGİLTERE','UNITED KINGDOM','英国'],-1.6,52.8,7,40],[['POLONYA','POLAND','波兰'],19.5,52,6,40],[['SUUDİ ARABİSTAN','SAUDI ARABIA','沙特阿拉伯'],45,23.5,4.5,40],[['YEMEN','YEMEN','也门'],47.5,15.8,7,40],[['UMMAN','OMAN','阿曼'],56.6,20.5,7,40],[['PAKİSTAN','PAKISTAN','巴基斯坦'],69,29.5,5,40],[['HİNDİSTAN','INDIA','印度'],79,22,3.5,40],[['ÇİN','CHINA','中国'],104,34,3.2,40],[['JAPONYA','JAPAN','日本'],138.6,36.5,7,40],[['GÜNEY KORE','SOUTH KOREA','韩国'],127.9,36.4,10,40],[['ENDONEZYA','INDONESIA','印度尼西亚'],113.6,-0.6,5,40],[['TAYLAND','THAILAND','泰国'],101,15.6,6,40],[['BANGLADEŞ','BANGLADESH','孟加拉国'],90,24,9,40],[['ABD','USA','美国'],-98,39,3.2,40],[['KANADA','CANADA','加拿大'],-105,57,3.2,40],[['MEKSİKA','MEXICO','墨西哥'],-102.5,24,4.5,40],[['BREZİLYA','BRAZIL','巴西'],-52,-10,3.2,40],[['ARJANTİN','ARGENTINA','阿根廷'],-65,-35,4,40],[['KOLOMBİYA','COLOMBIA','哥伦比亚'],-73,4,6,40],[['NİJERYA','NIGERIA','尼日利亚'],8,9.5,5,40],[['SENEGAL','SENEGAL','塞内加尔'],-14.6,14.6,9,40],[['KENYA','KENYA','肯尼亚'],38,0.6,6,40],[['GÜNEY AFRİKA','SOUTH AFRICA','南非'],24,-30.5,4.5,40],[['SOMALİ','SOMALIA','索马里'],46.4,5.4,7,40],[['SUDAN','SUDAN','苏丹'],30,15,5.5,40],[['ETİYOPYA','ETHIOPIA','埃塞俄比亚'],39.5,8.5,6,40],[['KAZAKİSTAN','KAZAKHSTAN','哈萨克斯坦'],67,48,4.5,40],[['ANGOLA','ANGOLA','安哥拉'],17.5,-12.5,6,40]];

function smoothPath(L){const P=new Path2D();for(const p of L){const n=p.length;let ax=sx(p[n-1][0]),ay=sy(p[n-1][1]),fx=sx(p[0][0]),fy=sy(p[0][1]);P.moveTo((ax+fx)/2,(ay+fy)/2);
  for(let i=0;i<n;i++){const q=p[(i+1)%n],nx=sx(q[0]),ny=sy(q[1]);P.quadraticCurveTo(fx,fy,(fx+nx)/2,(fy+ny)/2);fx=nx;fy=ny;}P.closePath();}return P;}
function linePts(g,pts){g.beginPath();let pv=null;for(const p of pts){if(!pv)g.moveTo(sx(p[0]),sy(p[1]));else{const dl=p[0]-pv[0];if(Math.abs(dl)>180){const k=dl>0?-1:1;g.lineTo(sx(p[0]+k*360),sy(p[1]));g.moveTo(sx(pv[0]-k*360),sy(pv[1]));}g.lineTo(sx(p[0]),sy(p[1]));}pv=p;}g.stroke();}
function spaced(g,v){try{g.letterSpacing=v;}catch(e){}}
function anchor(g,x,y,k){g.save();g.translate(x,y);g.scale(k,k);g.lineWidth=1.25;g.lineCap='round';g.lineJoin='round';g.beginPath();g.arc(0,-3.7,1.25,0,7);g.moveTo(0,-2.4);g.lineTo(0,3.9);g.moveTo(-2.3,-1.1);g.lineTo(2.3,-1.1);g.moveTo(-3.7,0.9);g.quadraticCurveTo(-3.3,3.9,0,3.9);g.quadraticCurveTo(3.3,3.9,3.7,0.9);g.stroke();g.restore();}
function padlock(g,x,y,k){g.save();g.translate(x,y);g.scale(k,k);g.lineWidth=1.3;g.lineCap='round';g.beginPath();g.moveTo(-2.2,-0.6);g.lineTo(-2.2,-2.4);g.arc(0,-2.4,2.2,Math.PI,0);g.lineTo(2.2,-0.6);g.stroke();g.fillStyle=g.strokeStyle;g.fillRect(-3.4,-0.8,6.8,5.2);g.restore();}
function harbor(g,p,x,y,k){const ux=p.ux,uy=p.uy,px=-uy,py=ux,a0=Math.atan2(uy,ux),R=15*k;
 g.lineCap='round';g.strokeStyle=TH.mute;g.lineWidth=2.4;g.beginPath();g.arc(x,y,R,a0-1.1,a0-0.3);g.stroke();g.beginPath();g.arc(x,y,R,a0+0.3,a0+1.1);g.stroke();
 g.fillStyle=TH.bad;g.beginPath();g.arc(x+Math.cos(a0-0.3)*R,y+Math.sin(a0-0.3)*R,1.7,0,7);g.fill();g.fillStyle=TH.ok;g.beginPath();g.arc(x+Math.cos(a0+0.3)*R,y+Math.sin(a0+0.3)*R,1.7,0,7);g.fill();
 g.strokeStyle=TH.ink;g.lineWidth=2.6;g.beginPath();g.moveTo(x-px*11*k,y-py*11*k);g.lineTo(x+px*11*k,y+py*11*k);g.stroke();
 g.lineWidth=1.8;g.beginPath();for(const j of [-1,1]){g.moveTo(x+px*j*10*k,y+py*j*10*k);g.lineTo(x+px*j*10*k+ux*6*k,y+py*j*10*k+uy*6*k);}g.stroke();
 if(p.yard){g.lineWidth=1.4;const cx0=x-px*7*k-ux*1,cy0=y-py*7*k-uy*1;g.beginPath();g.moveTo(cx0,cy0);g.lineTo(cx0-ux*7*k,cy0-uy*7*k);g.lineTo(cx0-ux*7*k+px*5*k,cy0-uy*7*k+py*5*k);g.stroke();}
 g.lineCap='butt';}
function drawBase(){const g=bx,z=view.z;g.setTransform(DPR,0,0,DPR,0,0);g.lineJoin='round';
 g.fillStyle=TH.sea;g.fillRect(0,0,CW,CH);
 if(patSea&&patSea.setTransform){const ox=((sx(0)%72)+72)%72,oy=((sy(0)%40)+40)%40;patSea.setTransform(new DOMMatrix([1,0,0,1,ox,oy]));patLand.setTransform(new DOMMatrix([1,0,0,1,ox,oy]));}
 if(patSea){g.fillStyle=patSea;g.fillRect(0,0,CW,CH);}
 /* enlem boylam ağı */
 const step=z<3?30:z<7?10:z<16?5:z<30?2:1;g.strokeStyle=TH.grid;g.lineWidth=1;g.beginPath();
 const lo0=Math.ceil((view.lon-CW/2/(KX*z))/step)*step,la0=Math.ceil((view.lat-CH/2/z)/step)*step;
 for(let lo=lo0;sx(lo)<=CW;lo+=step){g.moveTo(sx(lo),0);g.lineTo(sx(lo),CH);}for(let la=la0;sy(la)>=0;la+=step){g.moveTo(0,sy(la));g.lineTo(CW,sy(la));}g.stroke();
 /* sığ su bandı, kara */
 const land=smoothPath(LAND),seas=smoothPath(SEAS),hw=clamp(z*0.85,3,13);
 g.strokeStyle=TH.shal;g.globalAlpha=0.45;g.lineWidth=hw*2.6;g.stroke(land);g.globalAlpha=1;g.lineWidth=hw*1.2;g.stroke(land);
 g.fillStyle=TH.land;g.fill(land);if(patLand){g.fillStyle=patLand;g.fill(land);}
 g.fillStyle=TH.sea;g.fill(seas);g.save();g.clip(seas);if(patSea){g.fillStyle=patSea;g.fillRect(0,0,CW,CH);}g.strokeStyle=TH.shal;g.globalAlpha=0.45;g.lineWidth=hw*2.6;g.stroke(seas);g.globalAlpha=1;g.lineWidth=hw*1.2;g.stroke(seas);g.restore();
 g.strokeStyle=TH.shal;g.lineWidth=Math.max(2,0.2*z);g.lineCap='round';for(const st of STRAITS)linePts(g,st);g.lineCap='butt';
 g.strokeStyle=TH.coast;g.lineWidth=1.1;g.stroke(land);g.stroke(seas);
 /* ağ etiketleri */
 g.font='500 10px '+FD;g.fillStyle=TH.mute;g.textBaseline='alphabetic';g.textAlign='left';g.globalAlpha=0.8;
 for(let la=la0;sy(la)>=0;la+=step){const y=sy(la);if(y>62&&y<CH-58)g.fillText(Math.abs(la)+'°'+(la>0?L('K','N','N'):la<0?L('G','S','S'):''),3,y-2);}
 for(let lo=lo0;sx(lo)<=CW;lo+=step){const x=sx(lo);if(x>36&&x<CW-60)g.fillText(Math.abs(lo)+'°'+(lo>0?L('D','E','E'):lo<0?L('B','W','W'):''),x+3,CH-3);}
 g.globalAlpha=1;
 /* limanlar */
 const placed=[],hit=b=>placed.some(q=>b[0]<q[0]+q[2]&&b[0]+b[2]>q[0]&&b[1]<q[1]+q[3]&&b[1]+b[3]>q[1]);
 const hk=clamp(z/14,0.7,1.5),plist=PORTS.slice().sort((a,b)=>a.pr-b.pr);
 const unl=pid=>!S||portUnl(pid);
 for(const p of plist){const x=sx(p.lon),y=sy(p.lat);p._on=!(x<-50||x>CW+50||y<-40||y>CH+40);if(!p._on)continue;const lk=!unl(p.id),col=lk?TH.mute:p.st<=2?TH.ok:p.st===3?TH.warn:TH.bad;
  if(z<3){p._bx=x;p._by=y;p._r=3.2;g.beginPath();g.arc(x,y,3.2,0,7);g.fillStyle=lk?TH.card:col;g.fill();g.strokeStyle=lk?TH.mute:TH.card;g.lineWidth=1.2;g.stroke();}
  else{const det=z>=7;if(det)harbor(g,p,x,y,hk);const r=z<7?6.5:8.5,bxx=det?x-p.ux*13*hk:x,byy=det?y-p.uy*13*hk:y;p._bx=bxx;p._by=byy;p._r=r;
   g.beginPath();g.arc(bxx,byy,r,0,7);g.fillStyle=TH.card;g.fill();g.strokeStyle=col;g.lineWidth=2.6;if(lk)g.setLineDash([3,2.5]);g.stroke();g.setLineDash([]);g.strokeStyle=lk?TH.mute:TH.ink;if(lk)padlock(g,bxx,byy,r/7.2);else anchor(g,bxx,byy,r/7.2);}
  placed.push([p._bx-p._r-2,p._by-p._r-2,p._r*2+4,p._r*2+4]);}
 for(const p of plist){if(!p._on)continue;if((z<2.2&&p.pr>1)||(z<5&&p.pr>2))continue;const two=z>=14,lk=!unl(p.id);g.font='600 12.5px '+FD;const w1=g.measureText(p.n).width;let w=w1,sub='';
  if(two){sub=lk?L('şirket seviyesi '+portTier(p.id)+' gerekli','company level '+portTier(p.id)+' required','需要公司等级'+portTier(p.id)):L('denetim ','inspection: ','检查：')+STN[p.st]+(p.yard?L(' · tersane',' · shipyard',' · 船厂'):'');g.font='500 10.5px '+FD;w=Math.max(w1,g.measureText(sub).width);}
  const hh=two?27:16,ww=w+10,r=p._r+4;let b=null;for(const c of [[p._bx+r,p._by-hh/2],[p._bx-r-ww,p._by-hh/2],[p._bx-ww/2,p._by+r],[p._bx-ww/2,p._by-r-hh]]){const t=[c[0],c[1],ww,hh];if(!hit(t)){b=t;break;}}
  if(!b)continue;placed.push(b);g.globalAlpha=0.9;g.fillStyle=TH.card;g.fillRect(b[0],b[1],ww,hh);g.globalAlpha=1;g.strokeStyle=TH.mute;g.lineWidth=0.7;g.strokeRect(b[0]+0.5,b[1]+0.5,ww-1,hh-1);
  g.textBaseline='middle';g.fillStyle=lk?TH.mute:TH.ink;g.font='600 12.5px '+FD;g.fillText(p.n,b[0]+5,b[1]+(two?8.5:8.5));if(two){g.font='500 10.5px '+FD;g.fillStyle=TH.mute;g.fillText(sub,b[0]+5,b[1]+20);}}
 /* deniz ve ülke adları */
 g.textAlign='center';g.textBaseline='middle';
 const lbl=(A,font,col,sp,al)=>{g.font=font;spaced(g,LI===2?'1px':sp);g.fillStyle=col;g.globalAlpha=al;for(const l of A){if(z<l[3]||z>l[4])continue;const x=sx(l[1]),y=sy(l[2]);if(x<-80||x>CW+80||y<0||y>CH)continue;const t=l[0][LI],w=g.measureText(t).width+8,b=[x-w/2,y-8,w,16];if(hit(b))continue;placed.push(b);g.fillText(t,x,y);}g.globalAlpha=1;spaced(g,'0px');};
 lbl(SEA_LBL,'italic 500 12px '+FD,TH.mute,'3px',0.85);lbl(LAND_LBL,'600 11px '+FD,TH.coast,'2px',0.95);
 /* ölçek */
 const pxnm=z/60;let nm=5000;for(const v of [5,10,20,50,100,200,500,1000,2000,5000]){if(v*pxnm>=44){nm=v;break;}}const sw=nm*pxnm,x0=10,y0=CH-52;
 g.textAlign='left';g.textBaseline='alphabetic';g.font='600 11px '+FD;g.lineWidth=3;g.strokeStyle=TH.sea;const nmT=N(nm)+L(' nm',' nm',' 海里');g.strokeText(nmT,x0,y0-5);g.fillStyle=TH.ink;g.fillText(nmT,x0,y0-5);
 g.strokeStyle=TH.ink;g.lineWidth=1.5;g.beginPath();g.moveTo(x0,y0-3);g.lineTo(x0,y0+1);g.lineTo(x0+sw,y0+1);g.lineTo(x0+sw,y0-3);g.stroke();
}

/* ---------- gemiler ---------- */
const SLEN={koster:18,gcargo:21,handy:26,supra:28,pmax:31,ctank:20,mr:27,afra:33},SHOLD={koster:1,gcargo:3,handy:5,supra:5,pmax:7};
function shipTop(g,s,L,moving,t){const B=Math.max(4.6,L*0.22),h=B/2,st=-L/2,bw=L/2;
 if(moving){g.strokeStyle=TH.foam;g.lineCap='round';g.lineWidth=1.2;for(let k=0;k<3;k++){const ph=(t*0.8+k/3)%1,d=L*0.25+ph*L*1.25,sp=h*0.5+ph*h*1.7;g.globalAlpha=0.6*(1-ph);g.beginPath();g.moveTo(st-d+L*0.22,-sp*0.55);g.lineTo(st-d,-sp);g.moveTo(st-d+L*0.22,sp*0.55);g.lineTo(st-d,sp);g.stroke();}
  g.globalAlpha=0.45;g.setLineDash([2,3]);g.lineDashOffset=t*18;g.beginPath();g.moveTo(st,0);g.lineTo(st-L*1.1,0);g.stroke();g.setLineDash([]);g.globalAlpha=1;g.lineCap='butt';}
 g.beginPath();g.moveTo(bw,0);g.quadraticCurveTo(bw-L*0.14,-h,bw-L*0.32,-h);g.lineTo(st+L*0.09,-h);g.quadraticCurveTo(st,-h,st,-h*0.4);g.lineTo(st,h*0.4);g.quadraticCurveTo(st,h,st+L*0.09,h);g.lineTo(bw-L*0.32,h);g.quadraticCurveTo(bw-L*0.14,h,bw,0);g.closePath();
 g.fillStyle=hullCol(s)||TH.hull;g.fill();g.strokeStyle=TH.foam;g.lineWidth=1.1;g.stroke();
 const d0=st+L*0.27,d1=bw-L*0.24,dh=h-1.4;g.fillStyle=s.type==='tank'?TH.tank:TH.dry;g.fillRect(d0,-dh,d1-d0,dh*2);
 if(L>=13){if(s.type==='tank'){g.strokeStyle=TH.sup;g.lineWidth=0.9;g.beginPath();g.moveTo(d0+1,0);g.lineTo(d1-1,0);g.moveTo((d0+d1)/2,-dh);g.lineTo((d0+d1)/2,dh);g.stroke();}
  else{const n=SHOLD[s.cls]||2,gw=(d1-d0)/n;g.fillStyle=TH.deck;for(let i=0;i<n;i++)g.fillRect(d0+i*gw+0.7,-dh+0.9,gw-1.4,dh*2-1.8);}}
 g.fillStyle=TH.sup;g.fillRect(st+L*0.08,-(h-0.9),L*0.16,(h-0.9)*2);g.fillStyle=TH.mag;g.fillRect(st+L*0.115,-1.1,L*0.06,2.2);}
function shipPos(s){if(s.voy&&(s.state==='sea'||s.state==='broken'))return posOn(s.voy);const p=PORT[s.port];return {lon:p.lon,lat:p.lat,ang:null,i:0};}
function drawMap(now){
 const key=view.lon.toFixed(4)+'|'+view.lat.toFixed(4)+'|'+view.z.toFixed(4)+'|'+CW+'|'+CH+'|'+(S?coLv():0)+'|'+LI;if(key!==baseKey){baseKey=key;drawBase();}
 cx.setTransform(1,0,0,1,0,0);cx.drawImage(base,0,0);cx.setTransform(DPR,0,0,DPR,0,0);if(!S)return;
 const t=now/1000,z=view.z,f=z<2.5?0.55:z<5?0.75:z<9?1:z<16?1.2:1.5,run=S.speed>0&&!S.ev.length;
 /* rotalar */
 cx.lineJoin='round';cx.setLineDash([5,4]);
 for(const s of S.ships){if(!s.voy)continue;const p=shipPos(s),pts=[[p.lon,p.lat]];for(let i=Math.max(1,p.i);i<s.voy.path.length;i++)pts.push(NODE[s.voy.path[i]]);const sel=ui.sel===s.id;cx.strokeStyle=sel?TH.mag:TH.mute;cx.lineWidth=sel?2:1.1;cx.globalAlpha=sel?1:0.75;linePts(cx,pts);
  if(sel){const P=PORT[s.voy.to];cx.setLineDash([]);cx.beginPath();cx.arc(P._bx,P._by,(P._r||4)+4,0,7);cx.stroke();cx.setLineDash([5,4]);}}
 cx.globalAlpha=1;
 if(ui.preview){cx.strokeStyle=TH.mag;cx.lineWidth=2.4;cx.lineDashOffset=-t*14;linePts(cx,ui.preview.map(k=>NODE[k]));cx.lineDashOffset=0;const P=PORT[ui.preview[ui.preview.length-1]];if(P&&P._on){cx.setLineDash([]);cx.beginPath();cx.arc(P._bx,P._by,(P._r||4)+4,0,7);cx.stroke();}}
 cx.setLineDash([]);
 /* gemiler */
 const dock={},hk=clamp(z/14,0.7,1.5);
 for(const s of S.ships){const p=shipPos(s),L=SLEN[s.cls]*f;let x=sx(p.lon),y=sy(p.lat),ang=p.ang;
  if(ang===null){const P=PORT[s.port],k=dock[s.port]=(dock[s.port]||0)+1;
   if(z>=7){const d=(5+(k-1)*8.5)*hk;x+=P.ux*d;y+=P.uy*d;ang=Math.atan2(P.ux,-P.uy);if(Math.cos(ang)<0)ang+=Math.PI;}
   else{x=(P._bx||x)+(P._r||4)+2+L/2+(k-1)*3;y=(P._by||y)-(P._r||4)-3-(k-1)*7;ang=0;}}
  s._x=x;s._y=y;const sel=ui.sel===s.id,moving=s.state==='sea'&&!(s.hold>0);
  cx.save();cx.translate(x,y);
  const rr=L*0.62+4;
  if(s.state==='idle'&&!s.ack){const ph=(t*1.1)%1;cx.strokeStyle=TH.mag;cx.lineWidth=2;cx.globalAlpha=1-ph;cx.beginPath();cx.arc(0,0,rr+ph*9,0,7);cx.stroke();cx.globalAlpha=1;cx.beginPath();cx.arc(0,0,rr,0,7);cx.stroke();}
  else if(s.state==='broken'||s.state==='held'){const ph=(t*1.4)%1;cx.strokeStyle=TH.bad;cx.lineWidth=2;cx.globalAlpha=s.state==='broken'?0.4+0.6*Math.abs(Math.sin(t*4)):1;cx.setLineDash(s.state==='held'?[3,3]:[]);cx.beginPath();cx.arc(0,0,rr,0,7);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1;}
  else if(s.state==='load'||s.state==='disch'||s.state==='maint'){cx.strokeStyle=s.state==='maint'?TH.warn:TH.ok;cx.lineWidth=1.8;cx.setLineDash([4,4]);cx.lineDashOffset=run?-t*10:0;cx.beginPath();cx.arc(0,0,rr,0,7);cx.stroke();cx.setLineDash([]);cx.lineDashOffset=0;}
  if(sel){cx.strokeStyle=TH.mag;cx.lineWidth=1.5;cx.beginPath();const q=rr+4;for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;cx.moveTo(Math.cos(a-0.25)*q,Math.sin(a-0.25)*q);cx.arc(0,0,q,a-0.25,a+0.25);}cx.stroke();}
  cx.rotate(ang);shipTop(cx,s,L,moving,run?t:0);cx.restore();
  if(z>=6||sel){const nm=s.name.slice(4);cx.font='600 11px '+FD;cx.textAlign='center';cx.textBaseline='top';cx.lineWidth=3;cx.strokeStyle=TH.sea;cx.strokeText(nm,x,y+rr+3);cx.fillStyle=sel?TH.mag:TH.ink;cx.fillText(nm,x,y+rr+3);cx.textAlign='left';}}
}
function mapTap(px,py){if(!S)return;let b=null,bd=26;for(const s of S.ships){const d=Math.hypot(s._x-px,s._y-py);if(d<bd){bd=d;b=s;}}if(b){openShip(b.id);return;}
 let bp=null;bd=26;for(const p of PORTS){if(!p._on)continue;const d=Math.min(Math.hypot(sx(p.lon)-px,sy(p.lat)-py),Math.hypot(p._bx-px,p._by-py));if(d<bd){bd=d;bp=p;}}if(bp)openPort(bp.id);}
const ptrs=new Map();let drag=null,pinch=null;
function loc(e){const r=cv.getBoundingClientRect();return ROT?{x:e.clientY-r.top,y:r.right-e.clientX}:{x:e.clientX-r.left,y:e.clientY-r.top};}
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId);}catch(_){}const q=loc(e);ptrs.set(e.pointerId,q);
 if(ptrs.size===1)drag={x:q.x,y:q.y,lon:view.lon,lat:view.lat,moved:0,t:performance.now()};
 else if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,z:view.z};drag=null;}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const q=loc(e);ptrs.set(e.pointerId,q);
 if(ptrs.size===2&&pinch){const [a,b]=[...ptrs.values()];zoomAt((a.x+b.x)/2,(a.y+b.y)/2,pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d);}
 else if(drag){const dx=q.x-drag.x,dy=q.y-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(dx,dy));if(drag.moved>6){view.lon=drag.lon-dx/(KX*view.z);view.lat=drag.lat+dy/view.z;clampView();}}});
function ptrUp(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
 if(ptrs.size===0){if(drag&&drag.moved<=6&&e.type==='pointerup'&&performance.now()-drag.t<600){const q=loc(e);mapTap(q.x,q.y);}drag=null;}
 else{const p=[...ptrs.values()][0];drag={x:p.x,y:p.y,lon:view.lon,lat:view.lat,moved:99,t:0};}}
cv.addEventListener('pointerup',ptrUp);cv.addEventListener('pointercancel',ptrUp);
cv.addEventListener('wheel',e=>{e.preventDefault();const q=loc(e);zoomAt(q.x,q.y,view.z*(e.deltaY<0?1.2:1/1.2));},{passive:false});
