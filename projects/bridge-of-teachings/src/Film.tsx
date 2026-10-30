import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,continueRender,delayRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
if(typeof document!=='undefined'){const h=delayRender('Loading editorial font');new FontFace('Manrope',`url(${staticFile('assets/manrope.ttf')})`,{weight:'200 800'}).load().then(f=>{(document.fonts as unknown as {add:(f:FontFace)=>void}).add(f);continueRender(h)});}
const G='#d9bc82',I='#eeeae0',B='#0a1014';
const S=(t:number,a:number,b:number)=>{let x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const pt=(u:number,v=0,offset=0)=>({x:400+1060*u+80*v,y:680-80*u-150*Math.sin(Math.PI*u)-45*v+offset});
const curve=(v:number=0,offset=0,max=1)=>Array.from({length:81},(_,i)=>{const p=pt(i/80*max,v,offset);return `${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`}).join(' ');
const ribbon=()=>curve(0)+' '+Array.from({length:81},(_,i)=>{const p=pt(1-i/80,1);return `L${p.x},${p.y}`}).join(' ')+' Z';
const face=()=>curve(0)+' '+Array.from({length:81},(_,i)=>{const p=pt(1-i/80,0,35+55*Math.sin(Math.PI*(1-i/80)));return `L${p.x},${p.y}`}).join(' ')+' Z';
const type:React.CSSProperties={fontFamily:'Manrope,Arial,sans-serif',fontWeight:700,letterSpacing:'-.035em',lineHeight:1.16};
function Page({x,y,scale=1,opacity=1}:{x:number;y:number;scale?:number;opacity?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}><rect x="-14" y="-20" width="28" height="40" rx="2" fill="#1b2429" stroke={G} strokeWidth="1.5"/><path d="M-8 -10 H7 M-8 -3 H8 M-8 4 H4 M-8 11 H7" stroke={I} strokeWidth="1" opacity=".75"/></g>}
function Book({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-74 -50 Q-35 -65 0 -39 Q35 -65 74 -50 L74 52 Q35 35 0 62 Q-35 35 -74 52Z" fill="#141e23" stroke={I} strokeWidth="2"/><path d="M0 -39 V62" stroke={G} strokeWidth="2"/>
 {[0,1,2,3,4].map(i=><g key={i} opacity=".44"><path d={`M-61 ${-29+i*15} Q-34 ${-37+i*15} -13 ${-20+i*15}`} fill="none" stroke={I} strokeWidth="1.5"/><path d={`M13 ${-20+i*15} Q34 ${-37+i*15} 61 ${-29+i*15}`} fill="none" stroke={I} strokeWidth="1.5"/></g>)}
 <path d="M-74 62 Q-35 45 0 72 Q35 45 74 62" fill="none" stroke={G} strokeWidth="1" opacity=".5"/></g>}
function Seeker({x,y,scale=1,light=0,opacity=1}:{x:number;y:number;scale?:number;light?:number;opacity?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}><ellipse cx="0" cy="-147" rx="18" ry="23" fill="#142128" stroke={I} strokeOpacity=".8" strokeWidth="1.6"/><path d="M-10 -124 L-10 -112 Q-30 -108 -33 -87 L-48 -35 Q-49 -24 -40 -22 Q-33 -22 -29 -34 L-20 -62 L-21 -7 L-25 57 Q-25 65 -16 65 Q-9 65 -8 57 L0 7 L8 57 Q9 65 17 65 Q25 65 25 57 L21 -7 L20 -62 L29 -34 Q33 -22 41 -22 Q49 -24 48 -35 L33 -87 Q30 -108 10 -112 L10 -124" fill="#142128" stroke={I} strokeOpacity=".75" strokeWidth="1.6"/><circle cx="0" cy="-90" r="25" fill="url(#warm)" opacity={light*.7}/><circle cx="0" cy="-90" r="2.4" fill={G} opacity={light}/></g>}
export const Film:React.FC=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const unfold=S(t,2.15,5.8),departure=S(t,1.65,3.15),focus=S(t,9.4,11.0),wide=1-S(t,10.0,11.2);
 const bookX=mix(960,285,departure),bookY=mix(540,560,departure),bookScale=mix(1.6,1,departure);
 const packet=S(t,7.05,9.8),p=pt(packet,.5,-16),q=S(t,9.5,10.25),humanX=mix(1585,1320,focus),humanY=mix(610,645,focus),humanScale=mix(.66,1.12,focus);
 const ring=S(t,10.4,13.0),closing=S(t,12.35,13.0);
 return <AbsoluteFill style={{backgroundColor:B,color:I,overflow:'hidden',...type}}>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <defs><radialGradient id="warm"><stop stopColor="#fff1ca"/><stop offset=".18" stopColor={G} stopOpacity=".65"/><stop offset="1" stopColor={G} stopOpacity="0"/></radialGradient><linearGradient id="deck" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#34434a"/><stop offset="1" stopColor="#1c292f"/></linearGradient><clipPath id="build"><rect x="0" y="0" width={370+unfold*1240} height="1080"/></clipPath></defs>
 <ellipse cx={mix(960,1200,focus)} cy="600" rx="850" ry="470" fill="url(#warm)" opacity=".035"/>
 <g opacity={wide}>
  {/* Shores share a single perspective and disappear as attention reaches the seeker. */}
  <g opacity={departure*.8}><path d="M140 700 L475 650 L565 716 L220 819 Z" fill="#132128"/><path d="M140 700 L475 650 L565 716" fill="none" stroke={I} strokeOpacity=".12"/><path d="M1420 600 L1715 563 L1810 642 L1505 720 Z" fill="#132128"/><path d="M1420 600 L1715 563 L1810 642" fill="none" stroke={I} strokeOpacity=".12"/></g>
  <g clipPath="url(#build)" opacity={S(t,2.1,2.9)}>
   {/* Continuous deck, architectural side face and hand rails. */}
   <path d={face()} fill="#111e25" stroke="#3e515b" strokeWidth="1"/>
   <path d={ribbon()} fill="url(#deck)" stroke={I} strokeOpacity=".28" strokeWidth="1.2"/>
   {[0,.25,.5,.75,1].map((u,i)=>{let a=pt(u,0,30);return <path key={i} d={`M${a.x} ${a.y} L${a.x} ${mix(785,694,u)} L${a.x+23} ${mix(775,684,u)} L${a.x+23} ${a.y-4} Z`} fill="#15242c" stroke="#37505d" strokeWidth=".7" opacity=".7"/>})}
   {Array.from({length:15},(_,i)=>{let u=i/14,a=pt(u),b=pt(u,1);return <g key={i}><path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="#859091" strokeWidth=".7" opacity=".25"/><path d={`M${a.x} ${a.y} V${a.y-48} M${b.x} ${b.y} V${b.y-48}`} stroke={G} strokeWidth="1" opacity=".65"/></g>})}
   <path d={curve(0,-48)} fill="none" stroke={G} strokeWidth="1.6"/><path d={curve(1,-48)} fill="none" stroke={G} strokeWidth="1.4" opacity=".6"/>
  </g>
  <path d="M305 618 Q355 660 440 657" fill="none" stroke={G} strokeWidth="1.4" opacity={departure*.6}/>
  <Book x={bookX} y={bookY} scale={bookScale}/>
  <Seeker x={1670} y={650} scale={.5} opacity={S(t,4.45,5.7)*.6}/><Seeker x={1750} y={601} scale={.46} opacity={S(t,4.8,6.1)*.4}/>
  {/* A page, not a random spark, carries the teaching across the bridge. */}
  <Page x={p.x} y={p.y} scale={.8} opacity={S(t,7,7.4)*(1-S(t,9.7,10.2))}/><circle cx={p.x} cy={p.y} r="36" fill="url(#warm)" opacity={S(t,7,7.4)*(1-S(t,9.7,10.2))*.3}/>
 </g>
 <Seeker x={humanX} y={humanY} scale={humanScale} opacity={S(t,4.0,5.25)} light={q}/>
 {/* The bridge's delivery becomes a path of inquiry around the same receiver. */}
 <path d="M1320 455 C1150 455 1080 600 1170 718 C1265 850 1490 784 1509 619 C1527 471 1371 370 1245 422" fill="none" stroke={G} strokeWidth="1.6" strokeOpacity=".6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ring}/>
 <path d="M1320 455 C1150 455 1080 600 1170 718 C1265 850 1490 784 1509 619 C1527 471 1371 370 1245 422" fill="none" stroke={I} strokeWidth=".8" strokeOpacity=".08" opacity={ring}/>
 </svg>
 <div style={{position:'absolute',left:150,right:150,top:118,textAlign:'center',fontSize:79,opacity:1-S(t,1.75,2.4),translate:`0 ${-20*S(t,1.75,2.4)}px`}}>One purpose.</div>
 <div style={{position:'absolute',left:150,right:150,top:125,textAlign:'center',fontSize:83,opacity:S(t,2.45,3.2)*(1-S(t,6.5,6.95)),translate:`0 ${20*(1-S(t,2.45,3.2))}px`}}>To be a <span style={{color:G}}>bridge.</span></div>
 <div style={{position:'absolute',left:150,right:150,top:125,textAlign:'center',fontSize:68,opacity:S(t,7.0,7.6)*(1-S(t,9.6,10.3)),translate:`0 ${20*(1-S(t,7,7.6))}px`}}>Bring the teachings closer.</div>
 <div style={{position:'absolute',left:140,top:382,width:360,textAlign:'center',fontSize:21,fontWeight:500,letterSpacing:'.1em',opacity:S(t,3.1,3.8)*wide}}>MY SPIRITUAL MASTER</div>
 <div style={{position:'absolute',left:1410,top:370,width:390,textAlign:'center',fontSize:21,fontWeight:500,letterSpacing:'.1em',opacity:S(t,5.0,5.8)*wide}}>SEEKING ANSWERS</div>
 <div style={{position:'absolute',left:160,top:380,width:800,opacity:S(t,10.2,10.8)*(1-S(t,11.95,12.3)),translate:`0 ${20*(1-S(t,10.2,10.8))}px`}}><div style={{fontSize:72}}>Begin with</div><div style={{fontSize:72,color:G,marginTop:8}}>a question.</div></div>
 <div style={{position:'absolute',left:160,top:380,width:850,opacity:closing,translate:`0 ${20*(1-closing)}px`}}><div style={{fontSize:72}}>Discover</div><div style={{fontSize:72,color:G,marginTop:8}}>something deeper.</div></div>
 <div style={{position:'absolute',left:1025,top:458,fontSize:20,fontWeight:500,letterSpacing:'.08em',color:G,opacity:S(t,10.7,11.3)}}>QUESTION</div>
 <div style={{position:'absolute',left:1435,top:411,fontSize:20,fontWeight:500,letterSpacing:'.08em',color:G,opacity:S(t,11.45,12.05)}}>REFLECT</div>
 <div style={{position:'absolute',left:1380,top:803,fontSize:20,fontWeight:500,letterSpacing:'.08em',color:G,opacity:S(t,12.15,12.85)}}>DISCOVER</div>
 <Sequence from={Math.round(.1*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-0.wav')}/></Sequence>
 <Sequence from={2*fps} premountFor={fps}><Audio src={staticFile('assets/voice-1.wav')}/></Sequence>
 <Sequence from={7*fps} premountFor={fps}><Audio src={staticFile('assets/voice-2.wav')}/></Sequence>
 <Audio src={staticFile('assets/bed.wav')} volume={.5}/>
 </AbsoluteFill>;
};
export const Root:React.FC=()=> <Composition id="BridgeOfTeachings" component={Film} durationInFrames={450} fps={30} width={1920} height={1080}/>;
