/* ================= ÇİZİMLER: PORTRE, BİNA, OFİS ================= */
function avatar(p,size){const sk=['#e9c4a0','#d9a67c','#c08a5e','#f0d2b6','#a8744a'][p.id%5],hr=['#2b2118','#151515','#5a3d28','#7d7d7d','#3a2a1c'][(p.id>>2)%5],k=p.role,z=size||44;
 const top=k==='insp'?`<path d="M11 19a13 13 0 0 1 26 0v2H11z" fill="#f2f2ee" stroke="#2a3640" stroke-width="1"/><rect x="9" y="20" width="30" height="3" rx="1.5" fill="#f2f2ee" stroke="#2a3640" stroke-width="1"/>`:`<path d="M13.5 20c0-9.5 4.5-13.5 10.5-13.5S34.5 10.500 34.5 20c-3-5-6-7-10.5-7s-7.500 2-10.500 7z" fill="${hr}"/>`;
 const body=k==='insp'?`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#d9732b"/><path d="M24 35v13" stroke="#a9541a" stroke-width="2"/>`:k==='dip'?`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#24364d"/><path d="M19.5 34l4.500 6 4.500-6z" fill="#fff"/><path d="M24 38.500v9.500" stroke="#b3147f" stroke-width="2.6"/>`:`<path d="M5 48c0-10 8-14 19-14s19 4 19 14z" fill="#e3e8ec"/><path d="M19.5 34l4.500 5.500 4.500-5.500z" fill="#c5ced6"/><path d="M24 38.500v9.500" stroke="#24364d" stroke-width="2.6"/>`;
 return `<svg class="av" viewBox="0 0 48 48" width="${z}" height="${z}" aria-hidden="true"><rect width="48" height="48" fill="var(--shal)"/>${body}<rect x="21" y="28" width="6" height="7" fill="${sk}"/><ellipse cx="24" cy="21" rx="9" ry="10.500" fill="${sk}"/>${top}<circle cx="20.500" cy="21.500" r="1.1" fill="#1d1d1d"/><circle cx="27.500" cy="21.500" r="1.1" fill="#1d1d1d"/><path d="M21 26.500q3 2 6 0" stroke="#7a4a3a" stroke-width="1" fill="none"/></svg>`;}
const R4=(x,y,w,h,f,e)=>`<rect x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" width="${(+w).toFixed(1)}" height="${(+h).toFixed(1)}" fill="${f}" ${e||''}/>`;
function hqSVG(lv,name){const W=320,g=132,ST='stroke="var(--hull)" stroke-width="1.2"';let o=R4(0,0,W,g,'var(--sea)')+R4(0,g,W,18,'var(--line)');
 for(const [x,h,w] of [[4,40,30],[38,26,26],[68,52,28],[216,36,30],[250,60,32],[286,30,30]])o+=R4(x,g-h,w,h,'var(--shal)');
 const B=[null,{w:78,h:38,fl:1,co:3},{w:84,h:68,fl:3,co:3},{w:108,h:86,fl:4,co:5},{w:132,h:106,fl:7,co:7},{w:80,h:124,fl:13,co:4}][lv],x0=(W-B.w)/2,y0=g-B.h;
 if(lv===1){o+=R4(0,g,74,18,'var(--shal)')+`<path d="M0 137q4-2.500 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0" fill="none" stroke="var(--sea)" stroke-width="1.5"/><path d="M34 ${g}V70M34 74l34 12M34 70l-12 20" stroke="var(--hull)" stroke-width="2" fill="none"/>`+R4(76,g-7,5,7,'var(--hull)');}
 if(lv===5)o+=R4(x0-34,g-26,B.w+68,26,'var(--sup)',ST);
 o+=R4(x0,y0,B.w,B.h,'var(--sup)',ST);
 const top=lv>=3?15:9,bot=lv===1?4:lv===5?28:14,fh=(B.h-top-bot)/B.fl,cw=(B.w-8)/B.co;let sd=lv*977+3;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
 for(let f=0;f<B.fl;f++)for(let c=0;c<B.co;c++){if(lv===1&&c===1)continue;o+=R4(x0+4+c*cw+1.6,y0+top+f*fh+1.6,cw-3.2,fh-3.6,rr()<0.22?'var(--warn)':'var(--shal)','stroke="var(--hull)" stroke-width=".5"');}
 o+=R4(x0+B.w/2-(lv>=4?9:5.5),g-(lv===1?20:13),lv>=4?18:11,lv===1?20:13,'var(--hull)');
 const mx=lv>=4?24:lv===3?20:14,up=(name||'').toLocaleUpperCase(LOC[LI]);let cut=up;if(up.length>mx){cut='';for(const w of up.split(/\s+/)){if((cut+' '+w).trim().length>mx)break;cut=(cut+' '+w).trim();}if(!cut)cut=up.slice(0,mx);}const nm=esc(cut),txt=(x,y,s,f)=>`<text x="${x}" y="${y}" text-anchor="middle" style="font:700 ${s}px var(--disp);letter-spacing:.06em" fill="${f}">${nm}</text>`;
 if(lv===1)o+=`<path d="M${x0-5} ${y0}L${x0+B.w/2} ${y0-15}L${x0+B.w+5} ${y0}Z" fill="var(--hull)"/>`+R4(x0+6,y0+2,B.w-12,8,'var(--mag)')+txt(x0+B.w/2,y0+8.500,6.500,'var(--onmag)');
 else if(lv===2)o+=R4(x0-3,y0-3,B.w+6,4,'var(--hull)')+R4(x0+10,y0+top+fh-2.500,B.w-20,7,'var(--mag)')+txt(x0+B.w/2,y0+top+fh+3,6.500,'var(--onmag)');
 else{o+=R4(x0,y0,B.w,13,'var(--hull)')+txt(x0+B.w/2,y0+9.500,lv===5?6:8,'var(--sup)');
  const flag=x=>`<path d="M${x} ${y0}v-20" stroke="var(--hull)" stroke-width="1.2"/><path d="M${x} ${y0-20}h12l-3 3.500 3 3.500h-12z" fill="var(--mag)"/>`;
  o+=flag(x0+12);if(lv===4)o+=flag(x0+B.w-22)+R4(x0+B.w/2-16,g-16,32,3,'var(--hull)');
  if(lv===5)o+=`<path d="M${x0+B.w/2} ${y0}v-16" stroke="var(--hull)" stroke-width="2"/>`+R4(x0,y0+20,B.w,4,'var(--mag)');}
 return `<svg viewBox="0 0 320 150" role="img" aria-label="${HQ[lv].n}">${o}<path d="M0 ${g}H320" stroke="var(--hull)" stroke-width="1.5"/></svg>`;}
function officeSVG(lv){const ST='stroke="var(--hull)" stroke-width="1.2"';let o=R4(0,0,320,104,'var(--panel)')+R4(0,104,320,46,'var(--line)')+`<path d="M0 104H320" stroke="var(--hull)" stroke-width="1"/>`;
 const ww=[0,58,76,112,152,212][lv],wx=22,wy=16,wh=lv>=4?60:48,hz=wy+wh*0.6,n=Math.max(1,Math.round(ww/44));
 o+=R4(wx,wy,ww,wh,'var(--sea)')+R4(wx,hz,ww,wy+wh-hz,'var(--shal)');
 if(lv>=5)for(const [x,h] of [[30,16],[52,24],[150,14],[176,22],[204,12]])o+=R4(wx+x,hz-h,14,h,'var(--line)');
 o+=`<path d="M${wx+ww*0.45-13} ${hz}h26l-3 4.500h-20z" fill="var(--hull)"/>`+R4(wx+ww*0.45-10,hz-5,5,5,'var(--sup)','stroke="var(--hull)" stroke-width=".5"');
 for(let k=1;k<n;k++)o+=`<path d="M${(wx+k*ww/n).toFixed(1)} ${wy}v${wh}" stroke="var(--hull)" stroke-width="1"/>`;
 o+=`<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="var(--hull)" stroke-width="2"/>`;
 if(lv===1)o+=R4(252,22,22,28,'var(--sup)',ST)+R4(252,22,22,7,'var(--bad)')+R4(20,84,26,20,'var(--rust)',ST)+R4(30,68,22,16,'var(--rust)',ST)+`<path d="M160 0v14" stroke="var(--hull)" stroke-width="1"/><circle cx="160" cy="17" r="4" fill="var(--warn)"/>`;
 if(lv>=2)o+=R4(246,18,60,34,'var(--shal)',ST)+`<path d="M254 30q6-6 12 0t10 4M280 26q8-3 12 4t6 6M262 42q8 3 14-2" fill="none" stroke="var(--land)" stroke-width="3.500" stroke-linecap="round"/>`;
 if(lv===2||lv===3)o+=R4(22,74,26,30,'var(--deck)',ST)+`<path d="M22 84h26M22 94h26" stroke="var(--hull)" stroke-width="1"/>`;
 if(lv>=3)o+=`<ellipse cx="186" cy="127" rx="${lv>=4?112:86}" ry="14" fill="var(--mag)" opacity=".18"/>`;
 if(lv>=4)o+=R4(16,86,82,18,'var(--hull)','rx="3"')+R4(12,78,8,26,'var(--hull)','rx="2"')+R4(94,78,8,26,'var(--hull)','rx="2"')+R4(24,82,30,6,'var(--mag)','rx="2" opacity=".7"')+R4(246,60,60,2.500,'var(--hull)')+`<path d="M256 60v-6h-2v-3h8v3h-2v6zM276 60v-8h-3v-3h10v3h-3v8zM296 60v-5h-2v-3h7v3h-2v5z" fill="var(--warn)"/>`;
 if(lv>=5)o+=`<path d="M160 0v10M140 12h40M144 12v5M160 12v6M176 12v5" stroke="var(--hull)" stroke-width="1.2" fill="none"/><circle cx="144" cy="19" r="2.500" fill="var(--warn)"/><circle cx="160" cy="20" r="2.500" fill="var(--warn)"/><circle cx="176" cy="19" r="2.500" fill="var(--warn)"/><path d="M112 104v-10" stroke="var(--hull)" stroke-width="2"/><circle cx="112" cy="86" r="9" fill="var(--shal)" stroke="var(--hull)" stroke-width="1.2"/><path d="M106 84q5-4 9 1t3 5" fill="none" stroke="var(--land)" stroke-width="3"/>`;
 const dw=[0,82,98,112,128,134][lv],dx=258-dw,dy=84,ch=lv>=4?32:20;
 o+=R4(dx+dw/2-10,dy-ch,20,ch+6,'var(--hull)','rx="4"');
 o+=R4(dx,dy,dw,6,lv>=3?'var(--rust)':'var(--deck)',ST);
 if(lv>=4)o+=R4(dx+5,dy+6,dw-10,26,'var(--rust)',ST);else o+=R4(dx+5,dy+6,6,26,'var(--hull)')+R4(dx+dw-11,dy+6,6,26,'var(--hull)');
 o+=R4(dx+9,dy-4,13,4,'var(--hull)','rx="1"')+R4(dx+28,dy-2,15,2,'var(--sup)');
 if(lv>=2)o+=R4(dx+dw/2+12,dy-17,22,14,'var(--hull)','rx="1.500"')+R4(dx+dw/2+14,dy-15,18,10,'var(--shal)')+R4(dx+dw/2+21,dy-3,4,3,'var(--hull)')+`<path d="M${dx+dw-12} ${dy}v-13l-9-4" stroke="var(--hull)" stroke-width="1.500" fill="none"/><path d="M${dx+dw-25} ${dy-15}l9-5 2.500 6z" fill="var(--warn)"/>`;
 if(lv===2)o+=R4(286,90,14,14,'var(--rust)',ST)+`<path d="M293 90q-10-12-4-22q4 8 4 22q0-14 8-20q2 10-8 20" fill="var(--ok)"/>`;
 if(lv>=3)o+=R4(266,82,46,22,'var(--rust)',ST)+`<path d="M276 80h28l-4 -6h-20z" fill="var(--hull)"/>`+R4(279,69,6,5,'var(--sup)','stroke="var(--hull)" stroke-width=".5"')+`<path d="M292 74v-8M274 81h32" stroke="var(--hull)" stroke-width="1"/>`;
 return `<svg viewBox="0 0 320 150" role="img" aria-label="${L('Patron odası','Boss’s office','老板办公室')}">${o}</svg>`;}

