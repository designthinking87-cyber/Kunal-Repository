import React from 'react';
import {AbsoluteFill,Audio,CanvasImage,Composition,Easing,Sequence,continueRender,delayRender,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';

if(typeof document!=='undefined'){
 const hold=delayRender('Loading editorial typeface');
 new FontFace('Editorial',`url(${staticFile('assets/editorial-serif.ttf')})`).load().then(f=>{(document.fonts as unknown as {add:(font:FontFace)=>void}).add(f);continueRender(hold)});
}
const cream='#eee9dc',gold='#d9b77b',dark='#080b0e';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,1,.36,1);
const s=(t:number,a:number,b:number)=>{const v=Math.max(0,Math.min(1,(t-a)/(b-a)));return v*v*(3-2*v)};
const gate=(t:number,a:number,b:number)=>s(t,a,a+.55)*(1-s(t,b-.55,b));
const rnd=(i:number)=>{const n=Math.sin(i*127.1+81.7)*43758.5453;return n-Math.floor(n)};
const serif:React.CSSProperties={fontFamily:'Editorial, Georgia, serif',fontWeight:400,letterSpacing:'-.035em',lineHeight:1.03,color:cream};
const label:React.CSSProperties={fontFamily:'Arial,sans-serif',fontSize:22,fontWeight:400,letterSpacing:'.22em',color:gold};
function Atmosphere({t}:{t:number}){return <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
 <defs><radialGradient id="atmo"><stop stopColor="#ac8c58" stopOpacity=".08"/><stop offset="1" stopColor="#ac8c58" stopOpacity="0"/></radialGradient></defs><ellipse cx={1230+Math.sin(t*.1)*40} cy="530" rx="820" ry="650" fill="url(#atmo)"/>
 {Array.from({length:125},(_,i)=><circle key={i} cx={rnd(i+1)*1920+Math.sin(t*.18+i)*12} cy={(rnd(i+301)*1160-t*(1+rnd(i+99)*2)+1160)%1160-40} r={.6+rnd(i+550)*1.5} fill={i%4===0?gold:cream} opacity={.035+rnd(i+889)*.13}/>)}
 </svg>}
function Photo({kind,t,opacity=1}:{kind:'child'|'adult'|'all';t:number;opacity?:number}){
 const child=kind==='child',all=kind==='all';const scale=all?1.15:child?2.03:1.55;
 const left=all?0:child?0:-730;const top=all?0:child?-340:-105;
 return <div style={{position:'absolute',left:all?0:child?940:780,top:0,width:all?1920:child?980:1140,height:1080,overflow:'hidden',opacity,maskImage:all?undefined:'linear-gradient(90deg,transparent,black 16%,black 90%,transparent)'}}>
  <CanvasImage src={staticFile('assets/life-stages.png')} style={{position:'absolute',width:1672*scale,height:941*scale,left,top,scale:1+Math.min(.035,t*.0014),transformOrigin:'58% 45%'}}/>
  <AbsoluteFill style={{background:all?'linear-gradient(0deg,#080b0e 0%,#080b0e00 65%)':'linear-gradient(0deg,#080b0e 0%,#080b0e00 35%,#080b0e00 80%,#080b0e44)',opacity:.85}}/>
 </div>
}
function Clock({t}:{t:number}){const a=t*.07;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <defs><radialGradient id="clockLight"><stop stopColor="#d9b77b" stopOpacity=".07"/><stop offset="1" stopColor="#d9b77b" stopOpacity="0"/></radialGradient></defs>
 <circle cx="1330" cy="530" r="420" fill="url(#clockLight)"/><g transform={`translate(1330 530) rotate(${a*180/Math.PI})`}>
 <circle r="333" fill="none" stroke={gold} opacity=".2"/><circle r="350" fill="none" stroke={gold} opacity=".07"/>
 {Array.from({length:60},(_,i)=><line key={i} x1={Math.sin(i*Math.PI/30)*318} y1={-Math.cos(i*Math.PI/30)*318} x2={Math.sin(i*Math.PI/30)*(i%5?326:333)} y2={-Math.cos(i*Math.PI/30)*(i%5?326:333)} stroke={gold} strokeWidth={i%5?1:2} opacity={i%5?.25:.65}/>)}
 </g><path d={`M1330 530 L${1330+Math.sin(t*.14)*255} ${530-Math.cos(t*.14)*255}`} stroke={cream} strokeWidth="2" opacity=".65"/>
 <path d="M1330 530 L1200 430" stroke={gold} strokeWidth="3" opacity=".5"/><circle cx="1330" cy="530" r="5" fill={gold}/></svg>
}
const bust='M 120 730 C 200 670 260 670 300 625 L 312 565 C 252 541 225 492 225 430 C 195 395 195 354 215 330 C 220 210 260 155 355 145 C 445 134 500 196 496 279 L 526 340 L 553 380 Q 559 391 540 398 L 517 401 Q 529 432 518 449 L 503 461 Q 502 512 450 535 L 432 625 C 480 665 554 677 610 730 Z';
function Body({t}:{t:number}){const local=t-5.7,m=s(local,.3,2.7);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><defs>
 <clipPath id="bust"><path d={bust}/></clipPath><radialGradient id="bodyCore"><stop stopColor="#fff2cf"/><stop offset=".2" stopColor="#d9b77b" stopOpacity=".8"/><stop offset="1" stopColor="#d9b77b" stopOpacity="0"/></radialGradient>
 </defs><g transform="translate(850 80)"><path d={bust} fill="#d9b77b" fillOpacity=".018" stroke={gold} strokeOpacity=".72" strokeWidth="1.5"/>
 <g clipPath="url(#bust)">{Array.from({length:600},(_,i)=>{let x=rnd(i+1)*600+Math.sin(local*.3+i)*4,y=120+rnd(i+876)*620;
 return <circle key={i} cx={x+Math.sin(i)*m*16} cy={y+Math.sin(local*.6+i)*3} r={.6+rnd(i+999)*1.2} fill={i%3?cream:gold} opacity={.22+rnd(i+532)*.63}/>})}</g>
 <path d={bust} transform={`translate(${-45*m} ${25*m}) scale(${1-.09*m})`} fill="none" stroke={cream} strokeOpacity={(1-m)*.4} strokeWidth="1"/>
 <circle cx="375" cy="510" r="65" fill="url(#bodyCore)" opacity=".8"/><circle cx="375" cy="510" r="3" fill={cream}/>
 {Array.from({length:18},(_,i)=><path key={i} d={`M ${300+Math.sin(i)*90} ${240+i*20} Q ${660+m*100} ${150+i*30} ${740+m*200} ${280+i*18}`} fill="none" stroke={gold} strokeWidth=".7" opacity={Math.sin(m*Math.PI)*.12}/>)}
 </g></svg>
}
function Network({t}:{t:number}){const local=t-13.7,m=s(local,.5,3.8),turn=local*.07;
 const nodes=Array.from({length:64},(_,i)=>{const y=1-2*(i+.5)/64,a=i*2.399963,r=Math.sqrt(1-y*y),x=Math.cos(a)*r,z=Math.sin(a)*r;const xx=x*Math.cos(turn)-z*Math.sin(turn),zz=x*Math.sin(turn)+z*Math.cos(turn);const q=900/(900-zz*210);return {x:1330+xx*290*q,y:510+y*290*q,z:zz,q}});
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><defs><radialGradient id="brainGlow"><stop stopColor="#d9b77b" stopOpacity=".13"/><stop offset="1" stopColor="#d9b77b" stopOpacity="0"/></radialGradient></defs><circle cx="1330" cy="510" r="390" fill="url(#brainGlow)"/>
 {nodes.map((p,i)=>[1,7,13].flatMap((jump,j)=>[0,1].map(layer=>{const q=nodes[(i+jump+layer*5)%64];return <line key={`${i}-${j}-${layer}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={j===0?gold:'#aebcc4'} strokeWidth=".9" opacity={(layer?m:1-m)*(.12+(p.z+1)*.12)}/>})))}
 {nodes.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r={(1.4+p.q)*1.2} fill={i%3?cream:gold} opacity={.25+(p.z+1)*.3}/><circle cx={p.x} cy={p.y} r="10" fill={gold} opacity={i%9===Math.floor(local*.8)%9?.09:0}/></g>)}
 <circle cx="1330" cy="510" r="32" fill={gold} opacity=".04"/><circle cx="1330" cy="510" r="3.5" fill={cream}/>
 </svg>
}
function WordBlock({t,from,eyebrow,first,second}:{t:number;from:number;eyebrow?:string;first:string;second?:string}){const e=interpolate(t,[from,from+.8],[0,1],{...clamp,easing:ease});return <div style={{position:'absolute',left:150,top:315,width:940,translate:`0 ${(1-e)*28}px`,opacity:e}}>
 {eyebrow&&<div style={{...label,marginBottom:42}}>{eyebrow}</div>}<div style={{...serif,fontSize:128}}>{first}</div>{second&&<div style={{...serif,fontSize:128,color:gold,marginTop:12}}>{second}</div>}
 </div>}
export const Film:React.FC=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 return <AbsoluteFill style={{backgroundColor:dark,color:cream,overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,opacity:gate(t,-.7,3.2)}}><Clock t={t}/><WordBlock t={t} from={.12} first="Think about it."/><div style={{position:'absolute',left:156,top:660,...label,opacity:s(t,.8,1.5)}}>FOR A SECOND.</div></div>
 <div style={{position:'absolute',inset:0,opacity:gate(t,2.55,6.3)}}><Photo kind="child" t={t}/><WordBlock t={t} from={2.8} eyebrow="A MEMORY YOU STILL CARRY" first="You remember" second="being a child."/></div>
 <div style={{position:'absolute',inset:0,opacity:gate(t,5.75,10)}}><Body t={t}/><WordBlock t={t} from={6.05} eyebrow="THE BODY CHANGES" first="But that body" second="is gone."/></div>
 <div style={{position:'absolute',inset:0,opacity:gate(t,9.4,14.3)}}><Photo kind="adult" t={t}/><WordBlock t={t} from={9.7} eyebrow="TEN YEARS AGO" first="Another version" second="of you."/><div style={{position:'absolute',left:160,top:760,width:700,height:1,backgroundColor:gold,opacity:.45,scale:`${s(t,10,12)} 1`,transformOrigin:'left'}}/></div>
 <div style={{position:'absolute',inset:0,opacity:gate(t,13.7,19.6)}}><Network t={t}/><WordBlock t={t} from={14} eyebrow="THOUGHTS. BELIEFS. CERTAINTIES." first="Even your mind" second="can change."/></div>
 <div style={{position:'absolute',inset:0,opacity:gate(t,19,22.9)}}><Photo kind="all" t={t} opacity={.5}/><AbsoluteFill style={{background:'linear-gradient(90deg,#080b0ee0,#080b0e00)'}}/><WordBlock t={t} from={19.25} eyebrow="AND YET…" first="You look back."/></div>
 <div style={{position:'absolute',inset:0,opacity:s(t,22.2,22.9)}}><svg width="1920" height="1080" style={{position:'absolute',inset:0}}><defs><radialGradient id="lastLight"><stop stopColor="#fff2cf"/><stop offset=".1" stopColor="#d9b77b" stopOpacity=".7"/><stop offset="1" stopColor="#d9b77b" stopOpacity="0"/></radialGradient></defs><circle cx="960" cy="375" r="80" fill="url(#lastLight)" opacity=".8"/><path d="M 500 375 Q 730 375 960 375 Q 1200 375 1420 375" fill="none" stroke={gold} strokeWidth="1" opacity=".3"/></svg>
 <div style={{position:'absolute',top:480,width:'100%',textAlign:'center',...serif,fontSize:176,opacity:s(t,22.55,23.3),translate:`0 ${18*(1-s(t,22.55,23.4))}px`}}>“That was <span style={{color:gold,fontStyle:'italic'}}>me.</span>”</div>
 </div>
 <Atmosphere t={t}/>
 <div style={{position:'absolute',left:150,right:150,bottom:102,height:1,backgroundColor:'#eee9dc',opacity:.06}}/>
 <div style={{position:'absolute',left:150,bottom:102,height:1,width:interpolate(f,[0,749],[0,1620],clamp),backgroundColor:gold,opacity:.35}}/>
 <Sequence from={Math.round(.15*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-0.wav')}/></Sequence>
 <Sequence from={Math.round(2.8*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-1.wav')}/></Sequence>
 <Sequence from={Math.round(5.95*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-2.wav')}/></Sequence>
 <Sequence from={Math.round(9.6*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-3.wav')}/></Sequence>
 <Sequence from={Math.round(13.95*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-4.wav')}/></Sequence>
 <Sequence from={Math.round(19*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-5.wav')}/></Sequence>
 <Sequence from={Math.round(22.55*fps)} premountFor={fps}><Audio src={staticFile('assets/voice-6.wav')}/></Sequence>
 <Audio src={staticFile('assets/sound-bed.wav')} volume={.6}/>
 </AbsoluteFill>;
};
export const Root:React.FC=()=> <Composition id="ThatWasMe" component={Film} durationInFrames={750} fps={30} width={1920} height={1080}/>;
