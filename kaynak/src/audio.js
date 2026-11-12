/* ================= TERCİHLER, TEMA ve SES =================
   Tercihler kayıttan ayrı tutulur: yeni oyun açılınca silinmez.
   Müzik dosya değildir; Web Audio ile çalarken üretilir (telifsiz, internetsiz çalışır). */
const PREF_KEY='armator_pref';
const PREF=(()=>{let o={};try{o=JSON.parse(localStorage.getItem(PREF_KEY)||'{}')||{};}catch(e){}return Object.assign({mus:1,sea:1,vol:0.6,theme:'auto'},o);})();
function prefSave(){try{localStorage.setItem(PREF_KEY,JSON.stringify(PREF));}catch(e){}}

/* ---------- tema ---------- */
const DARKQ=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
function themeDark(){return PREF.theme==='dark'||(PREF.theme!=='light'&&!!(DARKQ&&DARKQ.matches));}
function applyTheme(){const h=document.documentElement;if(PREF.theme==='light'||PREF.theme==='dark')h.dataset.theme=PREF.theme;else delete h.dataset.theme;h.classList.toggle('lt',!themeDark());
 const m=document.querySelector('meta[name=theme-color]'),c=getComputedStyle(h).getPropertyValue('--panel').trim();if(m&&c)m.setAttribute('content',c);
 if(typeof readTheme==='function')readTheme();}
if(DARKQ){const f=()=>{if(PREF.theme==='auto')applyTheme();};DARKQ.addEventListener?DARKQ.addEventListener('change',f):DARKQ.addListener&&DARKQ.addListener(f);}

/* ---------- ses motoru ---------- */
const AU={ctx:null,on:false,timer:0,next:0,bar:0,sec:0,prog:null,mot:null,last:7};
const VOLS=[0.3,0.6,1];
/* Re minör, yavaş bir denizci havası: armonyum benzeri akortlar, bas, mızrap sesi ezgi, arada gemi çanı */
const BPM=66,BEAT=60/BPM,BARD=BEAT*4;
const PROGS=[[[2,5,9],[10,2,5],[5,9,0],[0,4,7]],[[2,5,9],[0,4,7],[10,2,5],[9,1,4]],[[5,9,0],[0,4,7],[2,5,9],[9,1,4]],[[2,5,9],[7,10,2],[2,5,9],[0,4,7]]];
const SCALE=[2,4,5,7,9,10,12,14,16,17,19,21,22,24];// Re minör, iki oktav (yarım ses, Do=0)
const RHY=[[0,1,2,3],[0,1.5,2,3],[0,0.5,1,2,3],[0,2,3],[0,1,1.5,2],[0,1,2,2.5,3]];
const hz=m=>440*Math.pow(2,(m-69)/12);
function impulse(c,sec,dec){const n=Math.floor(c.sampleRate*sec),b=c.createBuffer(2,n,c.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec);}return b;}
function auInit(oc){if(AU.ctx&&!oc)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C&&!oc)return false;
 try{if(navigator.audioSession)navigator.audioSession.type='ambient';}catch(e){}
 let c;try{c=AU.ctx=oc||new C();}catch(e){return false;}
 const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=3;comp.connect(c.destination);
 AU.mg=c.createGain();AU.mg.gain.value=0;AU.mg.connect(comp);
 AU.mus=c.createGain();AU.mus.gain.value=0;AU.mus.connect(AU.mg);AU.sea=c.createGain();AU.sea.gain.value=0;AU.sea.connect(AU.mg);
 AU.dry=c.createGain();AU.dry.connect(AU.mus);AU.rev=c.createConvolver();AU.rev.buffer=impulse(c,3,2.4);const rg=c.createGain();rg.gain.value=0.32;AU.rev.connect(rg);rg.connect(AU.mus);
 AU.send=c.createGain();AU.send.gain.value=1;AU.send.connect(AU.rev);
 seaInit();return true;}
/* dalga sesi: kesintisiz döngülü pembe gürültü, iki katman, yavaş kabarıp çekilen */
function seaInit(){const c=AU.ctx,L=c.sampleRate*8,N=c.sampleRate,b=c.createBuffer(2,L,c.sampleRate);
 for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch),x=new Float32Array(L+N);let b0=0,b1=0,b2=0;for(let i=0;i<L+N;i++){const w=Math.random()*2-1;b0=0.99765*b0+w*0.099046;b1=0.963*b1+w*0.2965164;b2=0.57*b2+w*1.0526913;x[i]=(b0+b1+b2+w*0.1848)*0.16;}
  for(let i=0;i<L;i++)d[i]=i<N?x[i]*(i/N)+x[L+i]*(1-i/N):x[i];}
 const lay=(type,f,q,base,depth,rate,ph)=>{const s=c.createBufferSource();s.buffer=b;s.loop=true;s.loopEnd=8;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();g.gain.value=base;
  const o=c.createOscillator(),og=c.createGain();o.frequency.value=rate;og.gain.value=depth;o.connect(og);og.connect(g.gain);
  const o2=c.createOscillator(),og2=c.createGain();o2.frequency.value=rate*0.37;og2.gain.value=f*0.35;o2.connect(og2);og2.connect(fl.frequency);
  s.connect(fl);fl.connect(g);g.connect(AU.sea);s.start(0,ph);o.start();o2.start();};
 lay('lowpass',420,0.6,0.55,0.45,0.085,0);lay('bandpass',1700,0.5,0.16,0.14,0.11,3.7);lay('lowpass',160,0.8,0.5,0.2,0.05,5.1);}
function env(g,t,a,peak,hold,rel){const p=g.gain;p.setValueAtTime(0.0001,t);p.exponentialRampToValueAtTime(peak,t+a);p.setValueAtTime(peak,t+a+hold);p.exponentialRampToValueAtTime(0.0001,t+a+hold+rel);}
function pad(t,notes){const c=AU.ctx;for(const n of notes){const f=hz(n);for(const dt of [-7,7]){const o=c.createOscillator(),fl=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=f;o.detune.value=dt;fl.type='lowpass';fl.frequency.value=950;fl.Q.value=0.4;
  o.connect(fl);fl.connect(g);g.connect(AU.dry);g.connect(AU.send);env(g,t,0.7,0.022,BARD-0.9,1.4);o.start(t);o.stop(t+BARD+1.6);}}}
function bass(t,n,dur){const c=AU.ctx,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.type='sine';o2.type='triangle';o.frequency.value=o2.frequency.value=hz(n);const g2=c.createGain();g2.gain.value=0.35;o2.connect(g2);g2.connect(g);o.connect(g);g.connect(AU.dry);env(g,t,0.03,0.16,dur*0.4,dur*0.8);o.start(t);o2.start(t);o.stop(t+dur*1.3+0.1);o2.stop(t+dur*1.3+0.1);}
function pluck(t,n,v){const c=AU.ctx,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='triangle';o2.type='sine';o.frequency.value=hz(n);o2.frequency.value=hz(n+12);fl.type='lowpass';fl.frequency.setValueAtTime(3200,t);fl.frequency.exponentialRampToValueAtTime(700,t+0.6);
 const g2=c.createGain();g2.gain.value=0.25;o2.connect(g2);g2.connect(fl);o.connect(fl);fl.connect(g);g.connect(AU.dry);g.connect(AU.send);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.11*v,t+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t+1.6);o.start(t);o2.start(t);o.stop(t+1.7);o2.stop(t+1.7);}
function bell(t){const c=AU.ctx;for(const k of [0,0.42]){for(const [r,a,d] of [[1,0.05,3.2],[2.76,0.025,1.8],[5.4,0.012,1],[8.93,0.006,0.6]]){const o=c.createOscillator(),g=c.createGain();o.frequency.value=740*r;o.connect(g);g.connect(AU.dry);g.connect(AU.send);g.gain.setValueAtTime(0.0001,t+k);g.gain.exponentialRampToValueAtTime(a,t+k+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+k+d);o.start(t+k);o.stop(t+k+d+0.05);}}}
function nearIdx(m){let b=0;for(let i=0;i<SCALE.length;i++)if(Math.abs(SCALE[i]-m)<Math.abs(SCALE[b]-m))b=i;return b;}
function motif(chord){const r=RHY[Math.floor(Math.random()*RHY.length)],out=[];let pc=chord[Math.floor(Math.random()*3)];let i=nearIdx(pc+(pc<5?12:0));for(const b of r){out.push([b,i]);i=clamp(i+[-2,-1,-1,1,1,2][Math.floor(Math.random()*6)],1,SCALE.length-2);}return out;}
function schedBar(t){const ph=AU.bar%4;if(ph===0&&AU.bar%16===0)AU.prog=PROGS[Math.floor(Math.random()*PROGS.length)];if(!AU.prog)AU.prog=PROGS[0];const ch=AU.prog[ph];
 pad(t,ch.map(n=>n+(n<5?60:48)));const bn=p=>36+p+(p<2?12:0);bass(t,bn(ch[0]),BEAT*1.6);bass(t+BEAT*2,bn(ch[2]),BEAT*1.6);
 const sec=Math.floor(AU.bar/4)%4;if(ph===0)AU.mot=motif(ch);
 if(sec>0){let m=AU.mot;if(ph===3)m=[[0,nearIdx(ch[0]+(ch[0]<5?12:0))],[2,nearIdx(ch[1]+(ch[1]<5?12:0))]];else if(ph===2)m=motif(ch);
  for(const [b,i] of m){const n=SCALE[clamp(i,0,SCALE.length-1)]+60;pluck(t+b*BEAT+(Math.random()-0.5)*0.02,n,b===0?1:0.75);}}
 if(ph===0&&AU.bar%16===8&&Math.random()<0.6)bell(t+BEAT*0.5);
 AU.bar++;}
function auTick(){if(!AU.ctx||!AU.on)return;const c=AU.ctx;if(AU.next<c.currentTime)AU.next=c.currentTime+0.15;while(AU.next<c.currentTime+0.8){if(PREF.mus)schedBar(AU.next);else AU.bar++;AU.next+=BARD;}}
function auApply(){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,v=typeof PREF.vol==='number'?clamp(PREF.vol,0,1):0.6;
 AU.mg.gain.setTargetAtTime((PREF.mus||PREF.sea)?v:0,t,0.6);AU.mus.gain.setTargetAtTime(PREF.mus?0.9:0,t,0.8);AU.sea.gain.setTargetAtTime(PREF.sea?0.38:0,t,0.8);}
function auStart(){if(!(PREF.mus||PREF.sea))return;if(!auInit())return;const c=AU.ctx;if(c.state==='suspended')c.resume().catch(()=>{});
 if(!AU.on){AU.on=true;AU.next=c.currentTime+0.3;clearInterval(AU.timer);AU.timer=setInterval(auTick,150);}auApply();}
function auStop(){if(!AU.ctx)return;auApply();if(!PREF.mus&&!PREF.sea){setTimeout(()=>{if(!PREF.mus&&!PREF.sea&&AU.ctx){AU.on=false;clearInterval(AU.timer);AU.ctx.suspend().catch(()=>{});}},2500);}}
function auSet(k,v){PREF[k]=v;prefSave();if(PREF.mus||PREF.sea)auStart();else auStop();}
/* tarayıcılar sesi ancak bir dokunuştan sonra başlatır */
const auKick=()=>{if((PREF.mus||PREF.sea)&&(!AU.on||(AU.ctx&&AU.ctx.state!=='running')))auStart();};
document.addEventListener('pointerdown',auKick,true);document.addEventListener('keydown',auKick,true);
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend().catch(()=>{});else if(AU.on&&(PREF.mus||PREF.sea))AU.ctx.resume().catch(()=>{});});
