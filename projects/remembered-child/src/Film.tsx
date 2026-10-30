import React from 'react';
import {AbsoluteFill,Audio,CanvasImage,Composition,Easing,Sequence,continueRender,delayRender,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
if(typeof document!=='undefined'){
 const h=delayRender('Loading Manrope');new FontFace('Manrope',`url(${staticFile('assets/manrope.ttf')})`,{weight:'200 800'}).load().then(f=>{(document.fonts as unknown as {add:(f:FontFace)=>void}).add(f);continueRender(h)});
}
const gold='#dcbb7f',ivory='#eeeae0',bg='#101416';
const C={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.65,0,.2,1);
const S=(t:number,a:number,b:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)};
const R=(i:number)=>{let x=Math.sin(i*127.1+44)*43758.5453;return x-Math.floor(x)};
const type:React.CSSProperties={fontFamily:'Manrope,Arial,sans-serif',fontWeight:700,letterSpacing:'-.045em',lineHeight:1.12};
const human='M -28 108 L -28 132 Q -74 138 -82 179 L -112 338 Q -119 363 -102 369 Q -86 375 -80 351 L -55 240 L -54 376 L -66 628 Q -68 650 -49 650 L -35 650 Q -21 648 -20 627 L -8 437 L 7 627 Q 8 648 23 650 L 39 650 Q 57 648 55 628 L 44 376 L 45 240 L 71 351 Q 77 375 93 369 Q 111 363 104 338 L 74 179 Q 65 138 19 132 L 19 108';
function Person({stroke=gold,opacity=1,fill='none',dash=0}:{stroke?:string;opacity?:number;fill?:string;dash?:number}){return <g opacity={opacity}><ellipse cx="-4" cy="63" rx="39" ry="47" fill={fill} stroke={stroke} strokeWidth="2.2" strokeDasharray="320" strokeDashoffset={dash*320}/><path d={human} fill={fill} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="2300" strokeDashoffset={dash*2300}/></g>}
export const Film:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const travel=interpolate(t,[1.8,3.65],[0,1],{...C,easing:ease});
 const photoX=750-500*travel,photoY=220+50*travel,photoScale=1.10-.10*travel;
 const reveal=S(t,3.05,4.7),change=S(t,5.95,8.75),adultScale=.64+.36*change;
 const photoStyle:React.CSSProperties={position:'absolute',left:photoX,top:photoY,width:420,height:560,scale:photoScale,transformOrigin:'50% 50%',rotate:`${-1.7*(1-travel)}deg`,overflow:'hidden',border:'1px solid #eeeae055',boxShadow:'0 24px 80px #00000066'};
 return <AbsoluteFill style={{backgroundColor:bg,color:ivory,overflow:'hidden',...type}}>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 66% 55%,#35302155 0%,#10141600 54%)'}}/>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <defs><radialGradient id="light"><stop stopColor="#fff8dd"/><stop offset=".12" stopColor={gold} stopOpacity=".7"/><stop offset="1" stopColor={gold} stopOpacity="0"/></radialGradient></defs>
  {/* Shared baseline is a comparison device, not a scientific body-scale measurement. */}
  <path d="M250 852 H1690" stroke={ivory} strokeOpacity=".15" strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset={1-S(t,3.4,4.5)}/>
  <path d="M700 550 C900 550 980 610 1240 610" fill="none" stroke={gold} strokeWidth="1.6" strokeOpacity=".6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-S(t,3.15,4.55)}/>
  <circle cx={700+540*S(t,3.15,4.55)} cy={550+60*S(t,3.15,4.55)} r="3" fill={gold} opacity={S(t,3.15,4.55)*(1-S(t,5.5,6.0))}/>
  {/* The remembered body is explicitly a conceptual vector, not a morphed photograph. */}
  {Array.from({length:19},(_,i)=>{const dissolve=S(t,5.95+i*.045,7.3+i*.045);return <g key={i} opacity={reveal*(1-dissolve)} transform={`translate(${1320+dissolve*(120+R(i)*120)} ${820-650*.64-dissolve*(18+R(i+80)*30)}) scale(.64)`}><clipPath id={`band${i}`}><rect x="-130" y={i*35} width="260" height="35"/></clipPath><g clipPath={`url(#band${i})`}><Person stroke={ivory} dash={1-reveal}/></g></g>})}
  <g transform={`translate(1320 ${820-650*adultScale}) scale(${adultScale})`} opacity={S(t,6.25,7.45)}>
   <Person stroke={gold} dash={1-S(t,6.25,8.8)} fill="#dcbb7f05"/>
   {Array.from({length:16},(_,i)=><path key={i} d={`M ${-48+Math.sin(i)*5} ${155+i*27} Q -4 ${149+i*27}  ${42+Math.cos(i)*4} ${155+i*27}`} fill="none" stroke={gold} strokeWidth=".9" opacity={.12*S(t,6.8,8.7)}/>)}
  </g>
  {/* A fixed reference tick helps the viewer see the original smaller form dissolve. */}
  <path d="M1190 404 H1209 M1190 404 V422" fill="none" stroke={ivory} strokeWidth="1" opacity={reveal*.35*(1-change)}/>
  <path d="M1190 183 H1209 M1190 183 V201" fill="none" stroke={gold} strokeWidth="1" opacity={change*.65}/>
  {/* Only a few fragments depart the silhouette, serving the transformation. */}
  {Array.from({length:45},(_,i)=>{let p=S(t,6+R(i)*.7,8.1+R(i)*.7);return <circle key={i} cx={1320+(R(i+44)-.5)*95+p*(100+R(i+80)*190)} cy={455+R(i+155)*270-p*55} r={.7+R(i+190)*1.1} fill={ivory} opacity={Math.sin(p*Math.PI)*.55}/>})}
 </svg>
 <div style={photoStyle}>
  <CanvasImage src={staticFile('assets/life-stages.png')} style={{position:'absolute',width:1672*1.55,height:941*1.55,left:-90,top:-430,scale:1+S(t,0,5.5)*.025,transformOrigin:'210px 240px'}}/>
  <AbsoluteFill style={{background:'linear-gradient(0deg,#10141666,#10141600 36%)'}}/>
 </div>
 <div style={{position:'absolute',top:90,left:150,right:150,textAlign:'center',fontSize:72,opacity:1-S(t,2.05,2.85),translate:`0 ${-18*S(t,2.05,2.85)}px`}}>Think about it.</div>
 <div style={{position:'absolute',left:250,top:150,fontSize:66,opacity:S(t,3.25,4),translate:`0 ${20*(1-S(t,3.25,4))}px`}}>You remember.</div>
 <div style={{position:'absolute',left:1060,top:105,width:720,textAlign:'center',fontSize:61,color:gold,opacity:S(t,6.75,7.6),translate:`0 ${20*(1-S(t,6.75,7.6))}px`}}>A different body.</div>
 <div style={{position:'absolute',left:250,top:905,width:420,textAlign:'center',fontSize:20,fontWeight:500,letterSpacing:'.15em',opacity:S(t,3.5,4.3),color:'#d6d4cb'}}>THE REMEMBERED CHILD</div>
 <div style={{position:'absolute',left:1110,top:905,width:420,textAlign:'center',fontSize:20,fontWeight:500,letterSpacing:'.15em',color:gold,opacity:S(t,3.65,4.4)}}>
  <div style={{opacity:1-S(t,6.2,7)}}>THAT CHILD’S BODY</div><div style={{position:'absolute',inset:0,opacity:S(t,7,7.8)}}>YOUR BODY, NOW</div>
 </div>
 <Sequence from={Math.round(.15*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-0.wav')}/></Sequence>
 <Sequence from={Math.round(2.8*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-1.wav')}/></Sequence>
 <Sequence from={Math.round(5.95*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-2.wav')}/></Sequence>
 <Audio src={staticFile('assets/bed.wav')} volume={.55}/>
 </AbsoluteFill>;
};
export const Root:React.FC=()=> <Composition id="RememberedChild" component={Film} durationInFrames={300} fps={30} width={1920} height={1080}/>;
