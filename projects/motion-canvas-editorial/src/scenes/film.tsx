import {makeScene2D,Node,Rect,Circle,Line,Spline,Path,Txt,Video,Gradient} from '@motion-canvas/2d';
import {createSignal,linear} from '@motion-canvas/core';
const ink='#07131F',ivory='#FFF1D4',gold='#E8BD65';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
const lerp=(a:number,b:number,q:number)=>a+(b-a)*q;
const arc=(a:number,b:number,r:number,n=90):[number,number][]=>Array.from({length:n+1},(_,i)=>{const p=(a+(b-a)*i/n)*Math.PI/180;return [Math.cos(p)*r,Math.sin(p)*r]});
function human(){const n=new Node({});n.add(<Circle y={-116} width={25} height={31} fill={ivory}/>);n.add(<Path data="M -9 -97 Q -17 -95 -19 -85 L -24 -42 Q -10 -35 0 -37 Q 11 -36 24 -42 L 19 -85 Q 16 -96 8 -97 Z" fill={ivory}/>);for(const s of [-1,1]){n.add(<Spline points={[[s*15,-89],[s*23,-65],[s*27,-43]]} stroke={ivory} lineWidth={7} lineCap="round"/>);n.add(<Spline points={[[s*9,-42],[s*10,-23],[s*13,0]]} stroke={ivory} lineWidth={8} lineCap="round"/>)}return n}
function light(){const n=new Node({});n.add(<Circle size={150} fill={new Gradient({type:'radial',from:[0,0],to:[0,0],fromRadius:0,toRadius:75,stops:[{offset:0,color:'#E8BD6555'},{offset:.3,color:'#E8BD6528'},{offset:1,color:'#E8BD6500'}]})}/>);n.add(<Circle size={13} fill={gold} shadowColor={gold} shadowBlur={18}/>);n.add(<Circle size={6} fill={ivory}/>);return n}
export default makeScene2D(function*(view){
 const t=createSignal(0),p=(a:number,d:number)=>ease((t()-a)/d);
 const gate=(a:number,b:number,d=.16)=>p(a,d)*(1-p(b-d,d));
 const masked=(parent:Node,text:string,y:number,size:number,start:number,fill=ivory,x=0,duration=.42)=>{const mask=new Rect({x,y,width:1020,height:size*1.65,clip:true});parent.add(mask);mask.add(<Txt text={text} fontFamily="Dev" fontWeight={700} fontSize={size} fill={fill} y={()=>(1-p(start,duration))*size*.65} opacity={()=>p(start,Math.min(.25,duration))}/>);return mask};
 const panel=(a:number,b:number)=>{const clip=new Circle({size:()=>3200*Math.min(p(a,.28),1-p(b-.24,.24)),clip:true});view.add(clip);const n=new Node({});clip.add(n);n.add(<Rect width={1080} height={1920} fill={ink}/>);n.add(<Circle y={-80} width={1500} height={1700} fill={new Gradient({type:'radial',fromRadius:0,toRadius:850,from:[0,0],to:[0,0],stops:[{offset:0,color:'#18364B77'},{offset:1,color:'#07131F00'}]})}/>);return n};
 view.add(<Rect width={1080} height={1920} fill={ink}/>);
 // Native Motion Canvas video is sought to the exact composition time on every frame.
 const reveal=new Circle({y:-120,size:()=>t()<3?0:280+3000*p(3,.38),clip:true,opacity:()=>t()<3?0:1});view.add(reveal);
 const push=()=>1+.035*p(8,.8)*(1-p(9.65,.35));
 reveal.add(<Video src="/source.mp4" width={1080} height={1920} y={120} time={()=>Math.min(t(),24.3)} scale={push}/>);
 // A broad lower-chest scrim keeps ivory legible over white clothing, without boxes.
 const scrim=new Rect({y:660,width:1080,height:780,opacity:()=>p(3.16,.25),fill:new Gradient({type:'linear',from:[0,-390],to:[0,390],stops:[{offset:0,color:'#07131F00'},{offset:.28,color:'#07131F55'},{offset:.66,color:'#07131FB8'},{offset:1,color:'#07131FE6'}]})});view.add(scrim);
 function caption(a:number,b:number,setup:string,key:string,keyGold=true,size=105,keyStart?:number){const n=new Node({opacity:()=>gate(a,b,.14)});view.add(n);n.add(<Txt text={setup} y={()=>505+16*(1-p(a,.22))} fontFamily="Dev" fontWeight={400} fontSize={67} fill={ivory} shadowColor={'#07131F'} shadowBlur={14}/>);n.add(<Txt text={key} y={()=>638+20*(1-p(keyStart??a+.04,.25))} opacity={()=>keyStart===undefined?1:p(keyStart,.20)} fontFamily="Dev" fontWeight={700} fontSize={size} fill={keyGold?gold:ivory} shadowColor={'#07131F'} shadowBlur={18}/>);return n}
 caption(3.24,4.666667,'कीड़े भी','बन जाते हैं ना?',false,99);
 caption(6.566667,8,'इतने','परम दयालु हैं',true,105);
 caption(8,9.6,'कि वो हमें','छोड़ते नहीं हैं',true,108);
 caption(9.6,12.3,'भगवान सदा सदैव','हमारे साथ रहते हैं',true,98);
 caption(15.866667,17.533333,'जैसे ही हम','मनुष्य बनते हैं',true,106,16.366667);
 caption(17.533333,18.366667,'तो भैया','सबसे पहले',false,104);
 caption(18.366667,20.1,'हम भगवान को','भूल जाते हैं',true,108);
 caption(22.733333,24.333333,'भगवान इतना दुःख','क्यों दे रहा है?',true,108);
 // The supporting companion motif occupies the clear space above the speaker's hair.
 function companionMotif(a:number,b:number,smoke:boolean){const n=new Node({y:-620,opacity:()=>gate(a,b,.22)});view.add(n);n.add(<Circle width={440} height={330} fill={new Gradient({type:'radial',from:[0,0],to:[0,0],fromRadius:0,toRadius:150,stops:[{offset:0,color:'#07131F70'},{offset:1,color:'#07131F00'}]})}/>);const h=human();h.position([-80,62]);h.scale(1.0);h.rotation(()=>smoke?-5*p(18.366667,.7):0);n.add(h);const l=light();l.position([72,-3]);n.add(l);n.add(<Circle x={-80} y={-2} size={174} stroke={gold} lineWidth={1.6} startAngle={-45} endAngle={235} end={()=>p(a,.7)}/>);
 if(smoke)for(let i=0;i<3;i++)n.add(<Spline points={()=>[[-265,-50-i*20],[-170,-70-i*15],[-95,-35-i*12+Math.sin(t()*.7+i)*5],[-30,-40-i*11],[23,-10-i*9]]} stroke={'#9CB2C1'} lineWidth={[14,7,3][i]} opacity={()=>p(18.366667,.8)*.32} end={()=>p(18.366667+i*.12,1.1)} shadowColor={'#718797'} shadowBlur={4} lineCap="round"/>);return n}
 companionMotif(9.6,12.3,false);companionMotif(17.533333,20.1,true);
 // Full-frame editorial compassion statement, on its actual spoken beat.
 const compassion=panel(4.666667,6.566667);
 const c1=new Node({opacity:()=>gate(4.666667,5.466667,.12)});compassion.add(c1);masked(c1,'तब भी',-355,75,4.68,ivory,0,.20);masked(c1,'भगवान',-135,153,4.70,gold,0,.22);
 const c2=new Node({opacity:()=>gate(5.466667,6.566667,.12)});compassion.add(c2);masked(c2,'इतने',-355,75,5.47,ivory,0,.20);masked(c2,'दयालु हैं',-135,150,5.49,gold,0,.22);
 const ch=human();ch.position([-85,420]);ch.scale(1.5);compassion.add(ch);const cl=light();cl.position([130,285]);cl.scale(1.3);compassion.add(cl);compassion.add(<Spline points={[[-270,465],[-225,165],[20,110],[230,300]]} smoothness={.5} stroke={gold} lineWidth={2} end={()=>p(4.8,1.2)} opacity={.65}/>);
 // Birth explanation: the luminous seed travels, then becomes the human form.
 const birth=panel(12.3,15.866667);
 const before=new Node({opacity:()=>gate(12.3,14.266667,.14)});birth.add(before);masked(before,'और उसके बाद',-430,67,12.4);masked(before,'जैसे ही हमें',-260,105,12.56,gold);
 const born=new Node({opacity:()=>gate(14.266667,15.866667,.14)});birth.add(born);masked(born,'इंसान की योनि',-365,107,14.30);masked(born,'मिलती है',440,113,14.42,gold);
 birth.add(<Circle x={-240} size={112} stroke={'#E8BD6588'} lineWidth={2} end={()=>p(12.48,.8)} opacity={()=>1-.6*p(14.2,.5)}/>);
 birth.add(<Spline points={[[-210,0],[-90,-170],[90,-170],[240,-102]]} stroke={gold} lineWidth={2.2} end={()=>p(12.68,1.58)} smoothness={.5} shadowColor={'#E8BD6540'} shadowBlur={10}/>);
 const seed=light();seed.position(()=>{const q=p(12.68,1.586667);return [lerp(-240,240,q),-102*q-95*Math.sin(q*Math.PI)]});seed.scale(()=>1+1.4*p(13.5,.76));seed.opacity(()=>1-p(14.266667,.35));birth.add(seed);
 const bh=human();bh.position([240,130]);bh.scale(()=>1.7+.3*p(14.266667,.6));bh.opacity(()=>p(14.266667,.4));birth.add(bh);
 birth.add(<Circle x={240} y={12} size={350} stroke={'#E8BD6577'} lineWidth={1.5} startAngle={-90} endAngle={270} end={()=>p(14.266667,.9)}/>);
 // The cycle develops while the speaker describes distress, before returning to the face.
 const cycle=panel(20.1,22.733333);const angles=[-90,30,150],words=['भूल','दुःख','सवाल'],starts=[20.25,20.93,21.61],R=335;
 for(let i=0;i<3;i++){const q=angles[i]*Math.PI/180,where:[number,number]=[Math.cos(q)*R,Math.sin(q)*R-110];const n=new Node({position:where,zIndex:5,opacity:()=>p(starts[i],.28),scale:()=>.88+.12*p(starts[i],.3)});cycle.add(n);n.add(<Circle size={186} fill={'#102638'} stroke={gold} lineWidth={1.5} shadowColor={'#E8BD6533'} shadowBlur={22}/>);n.add(<Txt text={words[i]} fontFamily="Dev" fontWeight={700} fontSize={i===2?64:70} fill={ivory} y={6}/>);const end=i===2?270:angles[i+1];cycle.add(<Line y={-110} points={arc(angles[i],end,R)} stroke={gold} lineWidth={2.3} start={.14} end={()=>Math.max(.14,.86*p(starts[i]+.18,i===2?.42:.5))} lineCap="round" opacity={()=>p(starts[i],.15)}/>)}
 const distress=new Node({opacity:()=>gate(20.1,22.733333,.18)});cycle.add(distress);masked(distress,'फिर दुख से',440,70,20.25);masked(distress,'बिलबिलाते हैं',580,108,20.5,gold);
 // The concluding face keeps the opening's fine gold question-mark motif.
 const endMark=new Node({y:-620,opacity:()=>gate(22.733333,24.333333,.22)});view.add(endMark);endMark.add(<Spline points={[[0,80],[0,18],[55,-25],[45,-92],[-20,-106],[-62,-65]]} stroke={gold} lineWidth={3} end={()=>p(22.8,.55)} smoothness={.55} lineCap="round"/>);endMark.add(<Circle y={116} size={9} fill={gold}/>);
 // Opening: the face is hard-hidden until t=3, even while the background dissolves.
 const hook=new Node({opacity:()=>1-p(2.96,.18)});view.add(hook);hook.add(<Rect width={1080} height={1920} fill={ink}/>);hook.add(<Circle x={-100} y={40} width={1600} height={1800} fill={new Gradient({type:'radial',fromRadius:0,toRadius:900,stops:[{offset:0,color:'#18364B88'},{offset:1,color:'#07131F00'}]})}/>);
 const heading=new Node({opacity:()=>1-p(2.76,.24)});hook.add(heading);masked(heading,'भगवान',-605,142,.04,ivory,-95);masked(heading,'साथ हैं…',-410,119,.40,ivory,-90);masked(heading,'फिर',-205,73,.93,ivory,-295);
 const keymask=new Rect({y:-15,width:1020,height:260,clip:true});heading.add(keymask);keymask.add(<Txt fontFamily="Dev" fontWeight={700} fontSize={164} y={()=>105*(1-p(1.12,.48))} opacity={()=>p(1.12,.35)}><Txt text="दुःख" fill={gold}/><Txt text=" क्यों?" fill={ivory}/></Txt>);
 const hh=human();hh.position([-170,485]);hh.scale(1.08);hh.opacity(()=>1-p(2.65,.25));hook.add(hh);
 const circlePoints=arc(90,450,151);const qpoints:[number,number][]=Array.from({length:91},(_,i)=>{const u=i/90;const v=u<.62?u/.62:(u-.62)/.38;const pts=u<.62?[[105,310],[105,185],[355,185],[310,335]]:[[310,335],[300,405],[210,400],[210,520]];const k=1-v;return [k*k*k*pts[0][0]+3*k*k*v*pts[1][0]+3*k*v*v*pts[2][0]+v*v*v*pts[3][0],k*k*k*pts[0][1]+3*k*k*v*pts[1][1]+3*k*v*v*pts[2][1]+v*v*v*pts[3][1]]});
 hook.add(<Spline points={()=>{const m=p(1.35,.85),back=p(2.65,.35);return circlePoints.map((v,i)=>{const cx=v[0]-170,cy=v[1]+410;const x=lerp(cx,qpoints[i][0],m),y=lerp(cy,qpoints[i][1],m);return [lerp(x,v[0]*(1+9.9*p(3,.38)),back),lerp(y,v[1]*(1+9.9*p(3,.38))-120,back)] as [number,number]})}} stroke={gold} lineWidth={3.1} end={()=>p(.15,1.0)} smoothness={.23} lineCap="round" shadowColor={'#E8BD6544'} shadowBlur={12}/>);
 hook.add(<Circle x={210} y={572} size={10} fill={gold} opacity={()=>p(1.9,.28)*(1-p(2.65,.2))}/>);
 yield* t(24.333333,24.333333,linear);
});
