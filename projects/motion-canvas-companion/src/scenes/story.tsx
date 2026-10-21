import {makeScene2D,Node,Rect,Circle,Line,Spline,Path,Txt,Gradient} from '@motion-canvas/2d';
import {createSignal,linear,useScene,Vector2} from '@motion-canvas/core';

const ivory='#FFF1D4',gold='#E8BD65',midnight='#07131F';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
const arc=(a:number,b:number,r:number,count=100):[number,number][]=>Array.from({length:count+1},(_,i)=>{const q=(a+(b-a)*i/count)*Math.PI/180;return [Math.cos(q)*r,Math.sin(q)*r]});
export default makeScene2D(function*(view){
 const t=createSignal(0), narrated=useScene().variables.get('narrated',false)();
 const distract=narrated?8.1:3.6,reveal=narrated?10.5:6.0,revealDuration=narrated?1.05:2.0;
 const nodes=narrated?[11.1,11.65,12.2]:[8.05,9.15,10.25];
 const pulseStart=narrated?13.05:11.35,pulseLength=narrated?.85:1.25,question=narrated?13.0:12.7;
 const progress=(start:number,duration:number)=>smooth((t()-start)/duration);
 const zoom=()=>3.05-.42*progress(0,3.3)-1.70*progress(reveal,revealDuration)-.10*progress(question,1.0);
 const worldY=()=>330-430*zoom()*(1-progress(reveal,revealDuration)) - 250*progress(reveal,revealDuration)-105*progress(question,1);
 const turn=()=>progress(distract,.95),drift=()=>-22*progress(distract,2.1), R=430;
 view.add(<Rect width={1080} height={1920} fill={midnight}/>);
 // Broad, quiet light field; it has no hard gradient edge.
 view.add(<Circle y={-130} width={1800} height={2000} fill={new Gradient({type:'radial',from:[0,0],to:[0,0],fromRadius:0,toRadius:1000,stops:[{offset:0,color:'#17344988'},{offset:.65,color:'#10263844'},{offset:1,color:'#07131F00'}]})}/>);
 // Overlapping silhouettes move at different rates to suggest depth without ornament.
 for(let i=0;i<3;i++)view.add(<Path data="M -900 960 L -900 420 C -650 390 -620 80 -430 100 C -270 160 -330 320 -70 300 C 150 260 250 -120 410 -80 C 680 -40 670 350 920 280 L 920 960 Z" fill={['#0C1E2B','#102535','#142B3C'][i]} opacity={.30-i*.055} scale={1.1-i*.08} x={()=>Math.sin(t()*.16+i)*12} y={()=>430+i*105-35*progress(reveal,revealDuration)}/>);
 const world=new Node({scale:zoom,y:worldY});view.add(world);
 // Two quiet perimeter echoes, then the one continuous environment stroke.
 world.add(<Circle width={R*2+100} height={R*2+100} stroke={'#91AEC11A'} lineWidth={.8} startAngle={90} endAngle={450} end={()=>.62+.1*progress(1,3)} rotation={-26}/>);
 world.add(<Circle width={R*2-56} height={R*2-56} stroke={'#547A8C28'} lineWidth={1} startAngle={-30} endAngle={225} end={()=>progress(.8,2.9)}/>);
 const ringOpacity=()=>1-.74*progress(reveal,.8);
 world.add(<Line points={arc(90,450,R)} stroke={gold} lineWidth={5} opacity={()=>ringOpacity()*.14} shadowColor={gold} shadowBlur={18} end={()=>.08+.92*progress(.7,2.6)} lineCap="round"/>);
 world.add(<Line points={arc(90,450,R)} stroke={gold} lineWidth={1.35} opacity={ringOpacity} end={()=>.08+.92*progress(.7,2.6)} lineCap="round"/>);
 // Fine line physically joins the companion glow to the world stroke.
 world.add(<Spline points={()=>[[drift()+77,R-71],[drift()+90,R-25],[drift()+42,R+6],[0,R]]} stroke={gold} lineWidth={1.2} end={()=>progress(.20,1.15)} opacity={()=>.8*(1-progress(reveal,.8))} smoothness={.55}/>);
 // A soft lower arc gives the path weight without turning it into a box.
 world.add(<Line points={arc(5,175,R+5)} stroke={'#88A7B24D'} lineWidth={3} opacity={.35}/>);
 const figure=new Node({x:drift,y:R,rotation:()=>-4*turn()});world.add(figure);
 // A simple human silhouette, animated through pose rather than facial features.
 figure.add(<Circle x={()=>-3*turn()} y={-116} width={25} height={31} fill={ivory}/>);
 figure.add(<Path data="M -9 -97 Q -17 -95 -19 -85 L -24 -42 Q -10 -35 0 -37 Q 11 -36 24 -42 L 19 -85 Q 16 -96 8 -97 Z" fill={ivory} opacity={.94}/>);
 figure.add(<Spline points={()=>[[-15,-89],[-22,-64],[-21-9*turn(),-43]]} stroke={ivory} lineWidth={7} lineCap="round" smoothness={.5}/>);
 figure.add(<Spline points={()=>[[15,-89],[24-10*turn(),-67],[39-29*turn(),-65+20*turn()]]} stroke={ivory} lineWidth={7} lineCap="round" smoothness={.5}/>);
 for(let s of [-1,1])figure.add(<Spline points={()=>[[s*9,-42],[s*10+Math.sin(t()*1.3)*turn()*s*3,-23],[s*13+turn()*s*3,0]]} stroke={ivory} lineWidth={8} lineCap="round" smoothness={.5}/>);
 // The companion remains at the same distance and luminance throughout the turn.
 const companion=new Node({x:()=>drift()+77,y:R-72});world.add(companion);
 companion.add(<Circle width={150} height={150} fill={new Gradient({type:'radial',from:[0,0],to:[0,0],fromRadius:0,toRadius:75,stops:[{offset:0,color:'#E8BD654D'},{offset:.28,color:'#E8BD652B'},{offset:1,color:'#E8BD6500'}]})}/>);
 companion.add(<Circle width={21} height={21} fill={'#E8BD6522'} shadowColor={gold} shadowBlur={16}/>);
 companion.add(<Circle width={10} height={10} fill={gold} shadowColor={gold} shadowBlur={9}/>);
 companion.add(<Circle width={4.5} height={4.5} fill={ivory}/>);
 // Graceful smoky ribbons; their strongest area stays on the figure's averted side.
 for(let i=0;i<3;i++){
 const points=():[number,number][]=>{const sway=Math.sin((t()-distract)*.65+i)*9;return [[-250,R-50-i*28],[-140,R-100-i*19+sway],[-57,R-78-i*15],[6,R-93-i*9+sway],[37,R-55-i*14],[55,R-40-i*20]]};
 world.add(<Spline points={points} stroke={['#718797','#93A1AC','#526B7D'][i]} lineWidth={[17,9,4][i]} shadowColor={'#718797'} shadowBlur={[9,7,4][i]} opacity={()=>progress(distract,.9)*(1-.75*progress(reveal,.8))*.24} start={()=>.03*progress(distract,.9)} end={()=>progress(distract+i*.16,1.6)} smoothness={.65} lineCap="round"/>);
 }
 // Three large nodes and their connecting arcs are built one at a time.
 const angles=[-90,30,150],words=['भूल','दुःख','सवाल'];
 for(let i=0;i<3;i++){
 const a=angles[i]*Math.PI/180,p:[number,number]=[Math.cos(a)*R,Math.sin(a)*R];
 const node=new Node({zIndex:10,position:p,opacity:()=>progress(nodes[i],.35),scale:()=>.84+.16*progress(nodes[i],.45)});world.add(node);
 node.add(<Circle width={191} height={191} fill={'#102638'} stroke={'#E8BD6580'} lineWidth={1.2} shadowColor={'#E8BD6533'} shadowBlur={25}/>);
 node.add(<Circle width={168} height={168} stroke={'#E8BD652B'} lineWidth={.8}/>);
 node.add(<Txt text={words[i]} fontFamily="Dev" fontWeight={700} fontSize={i===2?61:67} fill={ivory} y={6}/>);
 const end= i===2?270:angles[i+1];const delay=nodes[i]+.24;const duration=i<2?Math.max(.25,nodes[i+1]-delay):.55;
 world.add(<Line points={arc(angles[i],end,R)} stroke={gold} lineWidth={2.2} start={.12} end={()=>Math.max(.12,.88*progress(delay,duration))} opacity={()=>progress(nodes[0],.2)} lineCap="round" shadowColor={'#E8BD6560'} shadowBlur={7}/>);
 }
 const pulseQ=()=>clamp((t()-pulseStart)/pulseLength);
 world.add(<Line points={arc(-90,270,R)} stroke={ivory} lineWidth={4} start={()=>Math.max(0,pulseQ()-.035)} end={pulseQ} opacity={()=>progress(pulseStart,.15)*(1-progress(pulseStart+pulseLength,.18))} shadowColor={gold} shadowBlur={15} lineCap="round"/>);
 // Retain the completed cycle while the central question settles below it.
 view.add(<Line points={[[-44,530],[44,530]]} stroke={gold} lineWidth={2} end={()=>progress(question,.5)}/>);
 view.add(<Txt text="भगवान साथ हैं…" fontFamily="Dev" fontWeight={700} fontSize={78} fill={ivory} y={()=>594+18*(1-progress(question,.5))} opacity={()=>progress(question,.5)}/>);
 view.add(<Txt fontFamily="Dev" fontWeight={700} fontSize={82} fill={ivory} y={()=>720+18*(1-progress(question+.44,.5))} opacity={()=>progress(question+.44,.5)}><Txt text="फिर "/><Txt text="दुःख" fill={gold}/><Txt text=" क्यों?"/></Txt>);
 yield* t(15,15,linear);
});
