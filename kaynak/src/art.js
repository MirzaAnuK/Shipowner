/* ================= ÇİZİMLER: PORTRE, BİNA, OFİS ================= */
function avatar(p,size){const sk=['#e9c4a0','#d9a67c','#c08a5e','#f0d2b6','#a8744a'][p.id%5],hr=['#2b2118','#151515','#5a3d28','#7d7d7d','#3a2a1c'][(p.id>>2)%5],k=p.role,z=size||44;
 const top=k==='insp'?`<path d="M11 19a13 13 0 0 1 26 0v2H11z" fill="#f2f2ee" stroke="#2a3640" stroke-width="1"/><rect x="9" y="20" width="30" height="3" rx="1.5" fill="#f2f2ee" stroke="#2a3640" stroke-width="1"/>`:`<path d="M13.5 20c0-9.5 4.5-13.5 10.5-13.5S34.5 10.500 34.5 20c-3-5-6-7-10.5-7s-7.500 2-10.500 7z" fill="${hr}"/>`;
 const body=k==='insp'?`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#d9732b"/><path d="M24 35v13" stroke="#a9541a" stroke-width="2"/>`:k==='dip'?`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#24364d"/><path d="M19.5 34l4.500 6 4.500-6z" fill="#fff"/><path d="M24 38.500v9.500" stroke="#b3147f" stroke-width="2.6"/>`:`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#e3e8ec"/><path d="M19.5 34l4.500 5.500 4.500-5.500z" fill="#c5ced6"/><path d="M24 38.500v9.500" stroke="#24364d" stroke-width="2.6"/>`;
 return `<svg class="av" viewBox="0 0 48 48" width="${z}" height="${z}" aria-hidden="true"><rect width="48" height="48" fill="var(--shal)"/>${body}<rect x="21" y="28" width="6" height="7" fill="${sk}"/><ellipse cx="24" cy="21" rx="9" ry="10.500" fill="${sk}"/>${top}<circle cx="20.500" cy="21.500" r="1.1" fill="#1d1d1d"/><circle cx="27.500" cy="21.500" r="1.1" fill="#1d1d1d"/><path d="M21 26.500q3 2 6 0" stroke="#7a4a3a" stroke-width="1" fill="none"/></svg>`;}
const R4=(x,y,w,h,f,e)=>`<rect x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" width="${(+w).toFixed(1)}" height="${(+h).toFixed(1)}" fill="${f}" ${e||''}/>`;
/* ---------- ortak çizim yardımcıları ---------- */
const F1=n=>(+n).toFixed(1);
const SR=(x,y,w,h,f,e)=>`<rect x="${F1(x)}" y="${F1(y)}" width="${F1(w)}" height="${F1(h)}" fill="${f}" ${e||''}/>`;
const SP=(d,f,e)=>`<path d="${d}" fill="${f||'none'}" ${e||''}/>`;
const SC=(x,y,r,f,e)=>`<circle cx="${F1(x)}" cy="${F1(y)}" r="${F1(r)}" fill="${f}" ${e||''}/>`;
const HS='stroke="var(--hull)" stroke-width="1"',HS2='stroke="var(--hull)" stroke-width="1.4"';
function seeded(n){let sd=n*977+13;return ()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};}
/* konteyner vinci silueti */
function crane(x,base,h,sc,op){const w=26*sc,b=7*sc;return `<g opacity="${op}" stroke="var(--hull)" stroke-width="${F1(1.3*sc)}" fill="none"><path d="M${F1(x)} ${base}V${F1(base-h)}M${F1(x+b)} ${base}V${F1(base-h)}M${F1(x)} ${F1(base-h*0.55)}H${F1(x+b)}M${F1(x)} ${F1(base-h*0.3)}L${F1(x+b)} ${F1(base-h*0.55)}"/><path d="M${F1(x-w*0.45)} ${F1(base-h)}H${F1(x+b+w)}M${F1(x+b*0.5)} ${F1(base-h)}V${F1(base-h-7*sc)}L${F1(x+b+w)} ${F1(base-h)}M${F1(x+b*0.5)} ${F1(base-h-7*sc)}L${F1(x-w*0.45)} ${F1(base-h)}"/></g>`;}
/* uzaktaki gemi */
function farShip(x,y,sc,col){return `<g transform="translate(${F1(x)} ${F1(y)}) scale(${sc})"><path d="M0 0h46l-4 6h-38z" fill="${col||'var(--hull)'}"/><rect x="4" y="-7" width="8" height="7" fill="var(--sup)" stroke="var(--hull)" stroke-width=".8"/><rect x="14" y="-4" width="7" height="4" fill="#b8432f"/><rect x="21" y="-4" width="7" height="4" fill="#2f6fa8"/><rect x="28" y="-4" width="7" height="4" fill="#c99a2e"/><rect x="35" y="-4" width="6" height="4" fill="#2e7d57"/></g>`;}
/* liman manzarası (pencereden ya da arka plandan) */
function harbour(x,y,w,h,lv,id){const hz=y+h*0.58,r=seeded(lv+7);let o=`<defs><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--card)"/><stop offset="1" style="stop-color:var(--sea)"/></linearGradient><clipPath id="cl${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#cl${id})">`+SR(x,y,w,h,`url(#sk${id})`);
 o+=SC(x+w*0.8,y+h*0.22,Math.min(9,h*0.12),'var(--warn)','opacity=".55"');
 for(let k=0;k<3;k++){const cx=x+w*(0.15+0.3*k)+r()*20,cy=y+h*(0.12+r()*0.15);o+=SP(`M${F1(cx)} ${F1(cy)}h${F1(18+r()*14)}a5 5 0 0 0-6-6a7 7 0 0 0-12 1a5 5 0 0 0-${F1(6)} 5z`,'var(--card)','opacity=".8"');}
 if(lv>=3){let bx=x;while(bx<x+w){const bw=6+r()*10,bh=h*(0.08+r()*(lv>=5?0.3:0.16));o+=SR(bx,hz-bh,bw,bh,'var(--line)','opacity=".9"');bx+=bw+1.5;}}
 else o+=SP(`M${x} ${F1(hz)}q${F1(w*0.2)} -${F1(h*0.12)} ${F1(w*0.45)} -${F1(h*0.04)}t${F1(w*0.55)} -${F1(h*0.02)}V${F1(hz)}z`,'var(--land)','opacity=".75"');
 o+=SR(x,hz,w,y+h-hz,'var(--shal)');
 for(let k=0;k<4;k++)o+=SP(`M${F1(x+r()*w)} ${F1(hz+4+k*((y+h-hz-4)/4))}h${F1(10+r()*16)}`,'none','stroke="var(--sea)" stroke-width="1" opacity=".8"');
 o+=crane(x+w*0.12,hz,h*0.42,Math.max(0.5,h/70),0.55)+(w>90?crane(x+w*0.3,hz,h*0.4,Math.max(0.5,h/70),0.45):'');
 o+=farShip(x+w*0.48,hz+h*0.1,Math.max(0.5,w/170));
 return o+'</g>';}
/* binanın penceresi: bazıları yanıyor */
function winGrid(x,y,cols,rows,cw,ch,gap,r,lit){let o='';for(let f=0;f<rows;f++)for(let c=0;c<cols;c++){const on=r()<lit;o+=SR(x+c*(cw+gap),y+f*(ch+gap),cw,ch,on?'var(--warn)':'var(--shal)',on?'opacity=".9"':'');if(!on)o+=SP(`M${F1(x+c*(cw+gap)+1)} ${F1(y+f*(ch+gap)+ch-1)}l${F1(cw*0.5)} -${F1(ch-2)}`,'none','stroke="var(--card)" stroke-width=".8" opacity=".7"');}return o;}
function tree(x,base,h){return SR(x-1,base-h*0.4,2,h*0.4,'var(--hull)')+SC(x,base-h*0.62,h*0.32,'var(--ok)','opacity=".85"')+SC(x-h*0.18,base-h*0.5,h*0.22,'var(--ok)')+SC(x+h*0.2,base-h*0.52,h*0.2,'var(--ok)','opacity=".9"');}
function lamp(x,base,h){return SP(`M${x} ${base}v-${h}h5`,'none','stroke="var(--hull)" stroke-width="1.3"')+SC(x+5,base-h+2,1.8,'var(--warn)');}
function flagP(x,base,h,c){return SP(`M${x} ${base}v-${h}`,'none','stroke="var(--hull)" stroke-width="1"')+SP(`M${x} ${base-h}h11q-2 3.5 0 7h-11z`,c||'var(--mag)');}
function car(x,base,c){return SP(`M${x} ${base-3}v-4q0-2 2-2h4l3-4h9l4 4h3q2 0 2 2v4z`,c,HS)+SR(x+9.5,base-11,4,3.5,'var(--shal)')+SR(x+15,base-11,4,3.5,'var(--shal)')+SC(x+6,base-2.5,2.5,'var(--hull)')+SC(x+21,base-2.5,2.5,'var(--hull)');}
function signTxt(name,mx){const up=(name||'').toLocaleUpperCase(LOC[LI]);let cut=up;if(up.length>mx){cut='';for(const w of up.split(/\s+/)){if((cut+' '+w).trim().length>mx)break;cut=(cut+' '+w).trim();}if(!cut)cut=up.slice(0,mx);}return esc(cut);}
const TXT=(x,y,s,f,t)=>`<text x="${F1(x)}" y="${F1(y)}" text-anchor="middle" style="font:700 ${s}px var(--disp);letter-spacing:.06em" fill="${f}">${t}</text>`;

/* ---------- genel merkez binası (dışarıdan) ---------- */
function hqSVG(lv,name){const W=320,g=128,id='h'+lv,r=seeded(lv*31);
 let o=`<defs><linearGradient id="hs${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--card)"/><stop offset="1" style="stop-color:var(--sea)"/></linearGradient><linearGradient id="gl${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--shal)"/><stop offset=".55" style="stop-color:var(--sea)"/><stop offset="1" style="stop-color:var(--shal)"/></linearGradient></defs>`+SR(0,0,W,g,`url(#hs${id})`);
 o+=SC(268,26,11,'var(--warn)','opacity=".5"');
 for(const [cx,cy,cw] of [[40,22,30],[150,14,24],[220,34,20]])o+=SP(`M${cx} ${cy}h${cw}a6 6 0 0 0-7-7a8 8 0 0 0-14 1a6 6 0 0 0-7 6z`,'var(--card)','opacity=".85"');
 /* arka plan: şehir ya da liman */
 let bx=0;while(bx<W){const bw=10+r()*18,bh=16+r()*(lv>=4?52:30);o+=SR(bx,g-bh,bw,bh,'var(--shal)','opacity=".75"');if(lv>=3)o+=winGrid(bx+2,g-bh+3,Math.max(1,Math.floor((bw-3)/4)),Math.max(1,Math.floor((bh-6)/6)),2,3,2,r,0.12).replace(/var\(--shal\)/g,'var(--sea)');bx+=bw+2;}
 o+=crane(14,g,lv>=3?62:48,1,0.35)+crane(58,g,lv>=3?56:44,0.9,0.3);
 /* zemin: rıhtım ve kaldırım */
 o+=SR(0,g,W,22,'var(--line)')+SR(0,g,W,3,'var(--deck)')+SP(`M0 ${g}H${W}`,'none',HS2);
 for(let x=8;x<W;x+=24)o+=SP(`M${x} ${g+11}h12`,'none','stroke="var(--deck)" stroke-width="1.2"');
 const B=[null,{w:84,h:40},{w:92,h:66},{w:112,h:88},{w:118,h:108},{w:78,h:122}][lv],x0=(W-B.w)/2,y0=g-B.h,mid=x0+B.w/2;
 if(lv===1){/* rıhtımda tek katlı ahşap acente bürosu */
  o+=SR(0,g+3,70,19,'var(--shal)')+SP(`M0 ${g+9}q5-3 10 0t10 0t10 0t10 0t10 0t10 0t10 0`,'none','stroke="var(--sea)" stroke-width="1.3"');
  o+=SP(`M24 ${g+6}h30l-3 5h-24z`,'var(--hull)')+SR(30,g,8,6,'var(--sup)',HS)+SP(`M42 ${g+5}v-16`,'none','stroke="var(--hull)" stroke-width="1"');
  o+=SR(x0,y0,B.w,B.h,'var(--rust)',HS2);for(let k=1;k<B.w/6;k++)o+=SP(`M${F1(x0+k*6)} ${y0+2}V${g}`,'none','stroke="var(--hull)" stroke-width=".5" opacity=".45"');
  o+=SP(`M${x0-7} ${y0+1}L${F1(mid)} ${y0-16}L${x0+B.w+7} ${y0+1}Z`,'var(--hull)')+SP(`M${x0-7} ${y0+1}L${F1(mid)} ${y0-16}`,'none','stroke="var(--deck)" stroke-width="1"');
  o+=SR(mid-6,g-22,12,22,'var(--hull)')+SC(mid+3,g-11,1,'var(--warn)')+SR(x0+8,y0+12,18,14,'var(--shal)',HS)+SP(`M${x0+17} ${y0+12}v14M${x0+8} ${y0+19}h18`,'none','stroke="var(--hull)" stroke-width=".8"')+SR(x0+B.w-26,y0+12,18,14,'var(--warn)',HS+' opacity=".9"');
  o+=SR(x0+12,y0+2,B.w-24,8,'var(--mag)')+TXT(mid,y0+8.3,6,'var(--onmag)',signTxt(name,14));
  o+=SR(x0+B.w+8,g-6,8,6,'var(--deck)',HS)+SR(x0+B.w+10,g-12,8,6,'var(--deck)',HS)+SC(x0-14,g-3,3,'var(--hull)')+lamp(x0+B.w+28,g,30);}
 if(lv===2){/* iki katlı tuğla liman ofisi */
  o+=SR(x0,y0,B.w,B.h,'var(--rust)',HS2);for(let y=y0+5;y<g;y+=5)o+=SP(`M${x0} ${y}h${B.w}`,'none','stroke="var(--hull)" stroke-width=".35" opacity=".5"');
  o+=SR(x0-4,y0-5,B.w+8,6,'var(--hull)')+SR(x0-2,y0+30,B.w+4,3,'var(--hull)');
  o+=winGrid(x0+8,y0+8,4,1,16,16,5,r,0.4)+SR(x0+12,y0+35,B.w-24,8,'var(--mag)')+TXT(mid,y0+41.3,6.4,'var(--onmag)',signTxt(name,16));
  o+=SR(x0+8,g-20,24,16,'var(--shal)',HS)+SR(x0+B.w-32,g-20,24,16,'var(--warn)',HS+' opacity=".85"')+SR(mid-7,g-20,14,20,'var(--hull)');
  o+=tree(x0-18,g,30)+car(x0+B.w+14,g+1,'var(--sup)')+lamp(x0-34,g,34);}
 if(lv===3){/* beş katlı modern ofis */
  o+=SR(x0,y0,B.w,B.h,'var(--sup)',HS2)+SR(x0+4,y0+16,B.w-8,B.h-34,`url(#gl${id})`,HS);
  o+=winGrid(x0+8,y0+20,6,4,13.4,11,3,r,0.25)+SR(x0,y0,B.w,13,'var(--hull)')+TXT(mid,y0+9.5,7.6,'var(--sup)',signTxt(name,20));
  o+=SR(x0-6,g-18,B.w+12,3,'var(--hull)')+SR(mid-12,g-15,24,15,'var(--shal)',HS)+SP(`M${mid} ${g-15}v15`,'none',HS);
  o+=flagP(x0+10,y0,20)+tree(x0-20,g,34)+tree(x0+B.w+20,g,30)+car(x0+B.w+32,g+1,'var(--mag)')+lamp(x0-40,g,36);}
 if(lv===4){/* cam cepheli plaza */
  o+=SR(x0+10,y0-12,B.w-20,14,'var(--line)',HS)+SR(x0,y0,B.w,B.h,`url(#gl${id})`,HS2);
  for(let c=1;c<7;c++)o+=SP(`M${F1(x0+c*B.w/7)} ${y0}V${g-20}`,'none','stroke="var(--hull)" stroke-width=".6" opacity=".7"');
  for(let f=1;f<9;f++)o+=SP(`M${x0} ${F1(y0+f*(B.h-20)/9)}h${B.w}`,'none','stroke="var(--hull)" stroke-width=".5" opacity=".6"');
  o+=winGrid(x0+3,y0+3,7,8,B.w/7-3.4,(B.h-20)/9-3.2,3.4,r,0.18).replace(/var\(--shal\)/g,'transparent');
  o+=SP(`M${x0+8} ${y0+B.h*0.75}L${x0+B.w*0.6} ${y0+6}`,'none','stroke="var(--card)" stroke-width="5" opacity=".25"');
  o+=SR(x0+B.w/2-30,y0-10,60,9,'var(--hull)')+TXT(mid,y0-3.4,6.2,'var(--sup)',signTxt(name,22));
  o+=SR(x0-10,g-20,B.w+20,4,'var(--hull)')+SR(mid-18,g-16,36,16,'var(--shal)',HS)+SP(`M${mid-6} ${g-16}v16M${mid+6} ${g-16}v16`,'none',HS);
  o+=flagP(x0-24,g,44)+flagP(x0-14,g,44,'var(--ok)')+flagP(x0+B.w+16,g,44)+tree(x0-44,g,34)+tree(x0+B.w+40,g,36)+car(x0+B.w+52,g+1,'var(--hull)');
  o+=SP(`M${mid-20} ${g+12}q20 -8 40 0`,'none','stroke="var(--sea)" stroke-width="3" opacity=".7"');}
 if(lv===5){/* gökdelen genel merkez */
  o+=SR(x0-40,g-26,B.w+80,26,'var(--sup)',HS2)+winGrid(x0-36,g-22,5,2,5,6,2.4,r,0.4)+winGrid(x0+B.w+4,g-22,5,2,5,6,2.4,r,0.4);
  o+=SP(`M${x0} ${g}V${y0+10}L${x0+B.w*0.5} ${y0-6}L${x0+B.w} ${y0+10}V${g}Z`,`url(#gl${id})`,HS2);
  for(let f=0;f<15;f++)o+=SP(`M${x0} ${F1(y0+16+f*7)}h${B.w}`,'none','stroke="var(--hull)" stroke-width=".45" opacity=".55"');
  for(let c=1;c<5;c++)o+=SP(`M${F1(x0+c*B.w/5)} ${y0+6}V${g-26}`,'none','stroke="var(--hull)" stroke-width=".5" opacity=".6"');
  for(let f=0;f<14;f++)for(let c=0;c<5;c++)if(r()<0.2)o+=SR(x0+c*B.w/5+1.5,y0+17.5+f*7,B.w/5-3,4.4,'var(--warn)','opacity=".85"');
  o+=SP(`M${x0+6} ${g-40}L${x0+B.w*0.55} ${y0+14}`,'none','stroke="var(--card)" stroke-width="6" opacity=".22"');
  o+=SR(x0,y0+12,B.w,9,'var(--hull)')+TXT(mid,y0+18.6,5.6,'var(--sup)',signTxt(name,18))+SP(`M${mid} ${y0-6}v-18`,'none','stroke="var(--hull)" stroke-width="1.6"')+SC(mid,y0-25,1.8,'var(--bad)');
  o+=SR(x0,y0+24,B.w,2.5,'var(--mag)');
  for(let k=0;k<4;k++)o+=flagP(x0-34+k*9,g-26,22,k%2?'var(--ok)':'var(--mag)');
  o+=tree(x0-58,g,34)+tree(x0+B.w+56,g,34)+car(x0+B.w+16,g+15,'var(--mag)')+car(x0-48,g+15,'var(--sup)');}
 return `<svg viewBox="0 0 320 150" role="img" aria-label="${HQ[lv].n}">${o}</svg>`;}

/* ---------- patronun odası (içeriden) ---------- */
function officeSVG(lv){const id='o'+lv,r=seeded(lv*53),fl=104;let o='';
 const wall=lv>=4?'var(--card)':'var(--panel)';
 o+=SR(0,0,320,fl,wall)+SR(0,fl,320,46,'var(--line)')+(lv>=3?SR(0,fl,320,46,'var(--rust)','opacity=".42"'):'')+SP(`M0 ${fl}H320`,'none',HS2);
 if(lv>=3)for(let x=0;x<320;x+=26)o+=SP(`M${x} ${fl}l-8 46`,'none','stroke="var(--hull)" stroke-width=".4" opacity=".35"');
 else for(let x=0;x<320;x+=20)o+=SP(`M${x} ${fl+8}h320`.replace('h320','h12'),'none','stroke="var(--hull)" stroke-width=".3" opacity=".25"');
 if(lv===1){/* konteyner ofis: oluklu duvar, çıplak ampul */
  for(let x=0;x<320;x+=8)o+=SP(`M${x} 0v${fl}`,'none','stroke="var(--hull)" stroke-width=".5" opacity=".18"');}
 if(lv>=2)o+=SR(0,fl-7,320,7,'var(--line)')+SP(`M0 ${fl-7}H320`,'none',HS);
 /* pencere */
 const WX=[0,18,16,14,12,10][lv],WW=[0,74,96,130,176,160][lv],WY=12,WH=[0,52,56,62,70,78][lv];
 o+=harbour(WX,WY,WW,WH,lv,id)+SR(WX,WY,WW,WH,'none','stroke="var(--hull)" stroke-width="3"');
 const pn=lv===1?2:lv===2?2:lv===3?3:lv===4?4:5;for(let k=1;k<pn;k++)o+=SP(`M${F1(WX+k*WW/pn)} ${WY}v${WH}`,'none','stroke="var(--hull)" stroke-width="2"');
 if(lv<=2)o+=SP(`M${WX} ${WY+WH/2}h${WW}`,'none','stroke="var(--hull)" stroke-width="1.5"');
 o+=SR(WX-3,WY+WH,WW+6,4,'var(--sup)',HS);
 if(lv>=3)o+=SR(WX-6,WY-4,10,WH+10,'var(--mag)','opacity=".55"')+SR(WX+WW-4,WY-4,10,WH+10,'var(--mag)','opacity=".55"');
 /* tavan lambası */
 if(lv===1)o+=SP('M168 0v16','none','stroke="var(--hull)" stroke-width="1"')+SC(168,19,4,'var(--warn)')+SC(168,19,10,'var(--warn)','opacity=".18"');
 else if(lv<5)o+=SP('M200 0v8','none',HS)+SP('M190 8h20l-4 6h-12z','var(--hull)')+SP('M193 14l-14 30h42l-14-30z','var(--warn)','opacity=".09"');
 else{o+=SP('M110 0v8M88 10h44M92 10v6M110 10v7M128 10v6','none',HS);for(const x of [92,110,128])o+=SC(x,x===110?19:18,2.6,'var(--warn)')+SC(x,x===110?19:18,7,'var(--warn)','opacity=".15"');}
 /* duvar süsleri */
 if(lv===1){o+=SR(116,20,30,36,'var(--sup)',HS)+SR(116,20,30,8,'var(--bad)')+winGrid(119,31,5,4,3.6,4,1.5,r,0).replace(/var\(--shal\)/g,'var(--line)')+SR(156,30,32,22,'var(--sup)',HS+' transform="rotate(-4 172 41)"')+SP('M160 36h22M160 41h18M160 46h20','none','stroke="var(--hull)" stroke-width=".7" transform="rotate(-4 172 41)"');}
 if(lv>=2&&lv<5){const mx=lv>=4?246:lv===3?168:136,mw=lv>=4?62:56;o+=SR(mx,16,mw,34,'var(--shal)',HS)+SP(`M${mx+8} ${30}q6-6 12 0t10 4M${mx+mw-28} ${26}q8-3 12 4t6 6M${mx+16} ${42}q8 3 14-2`,'none','stroke="var(--land)" stroke-width="3.5" stroke-linecap="round"');for(let k=0;k<4;k++)o+=SC(mx+8+r()*(mw-16),22+r()*24,1.3,'var(--mag)');}
 if(lv===2||lv===3){const cx=lv===2?216:250,cy=lv===2?28:24;o+=SC(cx,cy,9,'var(--sup)',HS)+SP(`M${cx} ${cy}v-6M${cx} ${cy}l4 3`,'none','stroke="var(--hull)" stroke-width="1.2"');}
 if(lv===4){o+=SR(196,18,40,30,'var(--rust)',HS)+SR(199,21,34,24,'var(--sea)')+SP('M204 40h24l-3 3h-18zM215 40v-14l-8 12M216 27l8 11','var(--sup)','stroke="var(--hull)" stroke-width=".6"');}
 /* sol köşe: dolap, raf, koltuk */
 if(lv===1)o+=SR(8,78,26,26,'var(--rust)',HS)+SR(12,62,22,16,'var(--rust)',HS)+SP('M8 88h26M12 70h22','none','stroke="var(--hull)" stroke-width=".6"')+SR(40,90,18,14,'var(--deck)',HS);
 if(lv===2)o+=SR(14,70,26,34,'var(--line)',HS)+SP('M14 81h26M14 92h26','none',HS)+SR(24,74,6,2,'var(--hull)')+SR(24,85,6,2,'var(--hull)')+SR(24,96,6,2,'var(--hull)')+SR(46,90,12,14,'var(--rust)',HS)+SP('M52 90q-10-14-3-24q4 9 3 24q0-15 9-22q2 12-9 22','var(--ok)');
 if(lv===3||lv===4){const bx=lv>=4?14:18;o+=SR(bx,76,40,28,'var(--rust)',HS);for(let k=0;k<2;k++){const y=79+k*12.5;o+=SP(`M${bx} ${y+11}h40`,'none',HS);for(let b=0;b<7;b++){const c=['var(--mag)','var(--hull)','var(--ok)','var(--warn)','var(--sea)'][Math.floor(r()*5)];o+=SR(bx+3+b*5,y+1+r()*3,4,10-r()*3,c,'opacity=".9"');}}}
 if(lv===4){o+=SR(62,84,64,16,'var(--hull)','rx="4"')+SR(58,76,9,28,'var(--hull)','rx="3"')+SR(121,76,9,28,'var(--hull)','rx="3"')+SR(66,80,26,7,'var(--mag)','rx="2" opacity=".75"')+SR(94,80,24,7,'var(--sea)','rx="2"');
  o+=SC(146,96,8,'var(--shal)',HS)+SP('M141 94q4-4 8 1t3 5','none','stroke="var(--land)" stroke-width="2.6"')+SP('M146 104v-0','none');}
 /* halı */
 if(lv>=3)o+=`<ellipse cx="${lv>=5?170:196}" cy="128" rx="${lv>=4?118:90}" ry="13" fill="var(--mag)" opacity=".2"/>`;
 /* masa */
 if(lv<5){const dw=[0,84,100,112,112][lv],dx=[0,182,182,150,156][lv],dy=84,ch=lv>=4?34:24;
  o+=SP(`M${dx+dw/2-12} ${dy+4}v-${ch-6}q0-6 6-6h12q6 0 6 6v${ch-6}z`,'var(--hull)')+SR(dx+dw/2-14,dy-4,28,6,'var(--hull)','rx="2"');
  o+=SR(dx,dy,dw,6,lv>=3?'var(--rust)':'var(--deck)',HS);
  if(lv>=3)o+=SR(dx+5,dy+6,dw-10,lv>=4?28:22,'var(--rust)',HS)+SP(`M${dx+dw/2} ${dy+8}v${lv>=4?24:18}`,'none','stroke="var(--hull)" stroke-width=".6"')+SC(dx+dw/2-5,dy+17,1,'var(--warn)')+SC(dx+dw/2+5,dy+17,1,'var(--warn)');
  else o+=SR(dx+5,dy+6,5,24,'var(--hull)')+SR(dx+dw-10,dy+6,5,24,'var(--hull)');
  if(lv===1)o+=SR(dx+48,dy-16,22,16,'var(--sup)',HS)+SR(dx+51,dy-13,16,10,'var(--sea)')+SR(dx+54,dy-1,10,1,'var(--hull)')+SR(dx+10,dy-4,14,4,'var(--hull)','rx="1"')+SR(dx+30,dy-6,6,6,'var(--sup)',HS);
  else{const mx=dx+dw/2+16;o+=SR(mx,dy-18,24,15,'var(--hull)','rx="1.5"')+SR(mx+2,dy-16,20,11,'var(--shal)')+SP(`M${mx+4} ${dy-9}l4-3 4 2 5-4 3 2`,'none','stroke="var(--ok)" stroke-width="1"')+SR(mx+10,dy-3,4,3,'var(--hull)');
   if(lv>=3)o+=SR(mx-28,dy-18,24,15,'var(--hull)','rx="1.5"')+SR(mx-26,dy-16,20,11,'var(--shal)')+SR(mx-18,dy-3,4,3,'var(--hull)');
   o+=SP(`M${dx+dw-10} ${dy}v-14l-8-4`,'none','stroke="var(--hull)" stroke-width="1.4"')+SP(`M${dx+dw-24} ${dy-15}l9-5 3 6z`,'var(--warn)');
   o+=SR(dx+8,dy-3,16,3,'var(--sup)',HS)+SR(dx+30,dy-5,5,5,'var(--sup)',HS);}}
 /* gemi maketi */
 if(lv===3||lv===4){const mx=lv>=4?282:282,my=lv>=4?70:82;o+=SR(mx-10,my,46,lv>=4?34:22,'var(--rust)',HS);if(lv>=4)o+=SR(mx-6,my-26,40,26,'var(--sea)','opacity=".35" stroke="var(--hull)" stroke-width=".8"');o+=SP(`M${mx-2} ${my-2}h36l-4-6h-28z`,'var(--hull)')+SR(mx+2,my-15,7,7,'var(--sup)',HS)+SR(mx+11,my-11,6,3,'#b8432f')+SR(mx+17,my-11,6,3,'#2f6fa8')+SR(mx+23,my-11,6,3,'#c99a2e');}
 /* 5: toplantı salonu */
 if(lv===5){o+=SR(180,16,128,48,'var(--hull)','rx="2"')+SR(183,19,122,42,'var(--sea)')+SP('M190 38q8-8 16 0t12 4M232 30q12-4 18 6t8 8M274 48q8 3 14-2','none','stroke="var(--land)" stroke-width="4" stroke-linecap="round"');for(let k=0;k<8;k++)o+=SC(190+r()*110,24+r()*32,1.6,'var(--mag)');o+=SP('M194 32l30 6 26-2 30 10','none','stroke="var(--mag)" stroke-width=".8" stroke-dasharray="2 2"')+SR(232,64,24,3,'var(--hull)');
  o+=SP('M86 112h178l14 12H72z','var(--rust)',HS)+SR(84,124,184,4,'var(--hull)');
  for(let k=0;k<6;k++){const cx=100+k*30;o+=SP(`M${cx} 112v-14q0-4 4-4h8q4 0 4 4v14z`,'var(--hull)');}
  o+=SP('M298 104v-40','none','stroke="var(--hull)" stroke-width="1"')+SP('M298 64h14q-3 4 0 8h-14z','var(--mag)')+SP('M306 104v-34','none','stroke="var(--hull)" stroke-width="1"')+SP('M306 70h10q-2 3 0 6h-10z','var(--bad)');
  o+=SR(20,90,14,14,'var(--rust)',HS)+SP('M27 90q-12-16-4-28q5 10 4 28q0-18 10-26q3 14-10 26','var(--ok)');}
 return `<svg viewBox="0 0 320 150" role="img" aria-label="${L('Patron odası','Boss’s office','老板办公室')}">${o}</svg>`;}

