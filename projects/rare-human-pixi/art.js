/* All artwork is original PixiJS vector geometry and seeded light particles.
   Pure-time rendering: no ticker, frame accumulation, random clocks or network. */
(()=>{
const W=1920,H=1080,CX=1375,CY=530,GOLD=0xe6bd72,IVORY=0xf5efdf;
const app=new PIXI.Application({width:W,height:H,backgroundColor:0x000000,antialias:true,autoStart:false,sharedTicker:false,preserveDrawingBuffer:true,resolution:1,powerPreference:'high-performance'});
app.stop();document.getElementById('art').appendChild(app.view);
const paths=new PIXI.Graphics(),iconLayer=new PIXI.Container(),dots=new PIXI.ParticleContainer(2200,{position:true,scale:true,alpha:true,tint:true}),figure=new PIXI.Graphics(),lightLayer=new PIXI.Container();
app.stage.addChild(paths,iconLayer,dots,figure,lightLayer);
let seed=841084;function rng(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=(a,b,t)=>{let v=clamp((t-a)/(b-a));return v*v*(3-2*v)};const lerp=(a,b,t)=>a+(b-a)*t;
function glowTexture(){let c=document.createElement('canvas');c.width=c.height=64;let x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff9ea');g.addColorStop(.12,'rgba(255,244,211,.95)');g.addColorStop(.35,'rgba(230,189,114,.25)');g.addColorStop(1,'rgba(230,189,114,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return PIXI.Texture.from(c)}
const glow=glowTexture();function light(size){let s=new PIXI.Sprite(glow);s.anchor.set(.5);s.width=s.height=size;s.blendMode=PIXI.BLEND_MODES.ADD;lightLayer.addChild(s);return s}
const seedGlow=light(110),heartGlow=light(180),softHead=light(135);
// A calm, anatomically legible standing silhouette sampled into points.
const mc=document.createElement('canvas');mc.width=300;mc.height=720;const mx=mc.getContext('2d');
const body=new Path2D('M132 108 L168 108 L170 137 Q213 143 222 182 L251 345 Q257 369 241 375 Q225 380 220 356 L195 242 L194 383 L205 645 Q208 670 190 671 L171 671 Q161 668 160 646 L151 437 L141 646 Q140 670 121 671 L107 671 Q92 667 95 645 L107 383 L106 242 L80 356 Q74 380 58 374 Q42 368 49 345 L78 182 Q87 143 130 137 Z');
mx.fillStyle='#fff';mx.fill(body);mx.beginPath();mx.ellipse(150,65,40,49,0,0,Math.PI*2);mx.fill();const pixels=mx.getImageData(0,0,300,720).data;
const P=[];for(let i=0;i<1900;i++){let x,y;do{x=rng()*300;y=rng()*720}while(pixels[(Math.floor(y)*300+Math.floor(x))*4+3]<128);let s=new PIXI.Sprite(glow);s.anchor.set(.5);s.blendMode=PIXI.BLEND_MODES.ADD;dots.addChild(s);P.push({s,tx:CX+(x-150)*.94,ty:188+y*.94,a:rng()*Math.PI*2,r:110+rng()*340,z:rng(),v:.12+rng()*.22,p:rng()*6.283,size:3.8+rng()*4.1})}
function animal(kind){let g=new PIXI.Graphics();g.lineStyle(2.1,IVORY,.96);switch(kind){
case 0: // fish
 g.moveTo(-25,0);g.bezierCurveTo(-8,-19,14,-18,27,0);g.bezierCurveTo(14,18,-8,19,-25,0);g.moveTo(-24,0);g.lineTo(-40,-14);g.lineTo(-40,14);g.lineTo(-24,0);g.moveTo(0,-12);g.lineTo(-7,-24);g.lineTo(12,-11);g.drawCircle(16,-2,1.7);break;
case 1: // bird
 g.moveTo(-36,7);g.bezierCurveTo(-20,-25,-6,-24,0,-4);g.bezierCurveTo(10,-27,28,-24,38,1);g.bezierCurveTo(16,-11,9,-4,0,13);g.bezierCurveTo(-12,-1,-22,-6,-36,7);g.moveTo(0,13);g.lineTo(-3,26);g.lineTo(7,20);break;
case 2: // butterfly
 g.moveTo(0,-15);g.bezierCurveTo(-36,-48,-45,12,-7,10);g.bezierCurveTo(-31,38,2,40,0,10);g.bezierCurveTo(12,44,35,28,10,10);g.bezierCurveTo(46,7,30,-44,0,-15);g.moveTo(0,-22);g.lineTo(0,26);g.moveTo(0,-18);g.lineTo(-8,-29);g.moveTo(0,-18);g.lineTo(8,-29);break;
case 3: // leaf / plant
 g.moveTo(0,31);g.bezierCurveTo(-35,10,-25,-25,19,-34);g.bezierCurveTo(37,-4,21,20,0,31);g.moveTo(-9,41);g.lineTo(17,-28);g.moveTo(1,16);g.lineTo(-13,0);g.moveTo(7,-1);g.lineTo(25,-9);break;
case 4: // deer
 g.moveTo(-30,-5);g.bezierCurveTo(-16,-17,4,-13,15,-8);g.lineTo(27,-30);g.lineTo(37,-29);g.lineTo(39,-17);g.lineTo(26,-11);g.lineTo(20,6);g.lineTo(22,33);g.lineTo(15,33);g.lineTo(10,11);g.lineTo(-18,10);g.lineTo(-23,33);g.lineTo(-30,33);g.lineTo(-26,3);g.lineTo(-30,-5);g.moveTo(-29,-4);g.lineTo(-42,-14);g.moveTo(29,-29);g.lineTo(23,-48);g.lineTo(17,-50);g.moveTo(25,-42);g.lineTo(33,-50);g.moveTo(35,-29);g.lineTo(40,-43);g.lineTo(47,-45);break;
case 5: // turtle
 g.drawEllipse(0,0,28,19);g.drawEllipse(36,0,10,7);g.moveTo(-20,-13);g.lineTo(-29,-24);g.lineTo(-13,-19);g.moveTo(15,-16);g.lineTo(27,-24);g.lineTo(23,-10);g.moveTo(-20,13);g.lineTo(-29,24);g.lineTo(-13,19);g.moveTo(15,16);g.lineTo(27,24);g.lineTo(23,10);g.moveTo(-28,0);g.lineTo(-40,3);g.moveTo(-13,-15);g.lineTo(2,-4);g.lineTo(15,-15);g.moveTo(2,-4);g.lineTo(0,16);break;
}return g}
const icons=[];for(let i=0;i<30;i++){let g=animal(i%6);iconLayer.addChild(g);let ring=Math.floor(i/10);icons.push({g,a:(i%10)/10*Math.PI*2+ring*.18,r:190+ring*91,spin:(ring%2?-1:1)*(.065+ring*.012),k:.62+ring*.17})}
function strokeFigure(alpha,t){figure.clear();if(alpha<=0)return;figure.lineStyle(1.2,GOLD,alpha*.32); // echo aura
figure.drawEllipse(CX,535,184,367);
figure.lineStyle(1.6,IVORY,alpha*.7);
// Outline matching the particle figure, with a narrow space around the body.
const ox=CX-141,oy=188,sc=.94;
const M=(x,y)=>figure.moveTo(ox+x*sc,oy+y*sc),L=(x,y)=>figure.lineTo(ox+x*sc,oy+y*sc),Q=(a,b,c,d)=>figure.quadraticCurveTo(ox+a*sc,oy+b*sc,ox+c*sc,oy+d*sc);
figure.drawEllipse(CX,oy+65*sc,40*sc,49*sc);M(132,114);L(130,137);Q(87,143,78,182);L(49,345);Q(42,368,58,374);Q(74,380,80,356);L(106,242);L(107,383);L(95,645);Q(92,667,107,671);L(121,671);Q(140,670,141,646);L(151,437);L(160,646);Q(161,668,171,671);L(190,671);Q(208,670,205,645);L(194,383);L(195,242);L(220,356);Q(225,380,241,375);Q(257,369,251,345);L(222,182);Q(213,143,170,137);L(168,114);
// Fine head ring and a calm floor ripple, not a full-screen glow.
figure.lineStyle(1.15,GOLD,alpha*.8);figure.drawCircle(CX,249,84);figure.lineStyle(.8,GOLD,alpha*.36);figure.drawCircle(CX,249,96);
figure.drawEllipse(CX,849,147,18);figure.lineStyle(.65,GOLD,alpha*.19);figure.drawEllipse(CX,849,206,29);
}
window.drawArt=function(t){
const enter=smooth(.08,1.1,t),collapse=smooth(3.12,4.55,t),form=smooth(4.35,6.12,t),settle=smooth(5.6,7,t);
paths.clear();const ringAlpha=enter*(1-smooth(3.9,4.65,t));
// Interlaced orbital arcs: the path of life, held inside the black field.
for(let k=0;k<7;k++){let rr=186+k*31;let rrScale=lerp(1,1.3,smooth(2.8,3.6,t))*(1-collapse);paths.lineStyle(k%3===0?1.65:.85,GOLD,ringAlpha*(k%3===0?.58:.26));for(let j=0;j<=150;j++){let a=j/150*Math.PI*2+(.08*t)*(k%2?1:-1),x=CX+Math.cos(a)*rr*rrScale,y=CY+Math.sin(a)*rr*.83*rrScale+Math.sin(a*2+k)*22; if(j===0)paths.moveTo(x,y);else paths.lineTo(x,y)}}
// Gentle converging trails help the transformation read at speed.
if(t>3.1&&t<6){for(let j=0;j<24;j++){let a=j*2.39996+t*.55,r=(120+(j%7)*42)*(1-collapse);let tx=CX+Math.cos(a)*r,ty=CY+Math.sin(a)*r*.8;paths.lineStyle(.8,GOLD,Math.sin(clamp((t-3.1)/2.9)*Math.PI)*.35);paths.moveTo(tx,ty);paths.quadraticCurveTo(CX+Math.cos(a+.7)*r*.55,CY+Math.sin(a+.7)*r*.55,CX,CY)}}
for(let i=0;i<icons.length;i++){const q=icons[i],a=q.a+t*q.spin,r=q.r*(1-collapse);q.g.position.set(CX+Math.cos(a)*r,CY+Math.sin(a)*r*.82);q.g.rotation=.12*Math.sin(a+t);q.g.scale.set(q.k*lerp(1,.1,collapse)*enter);q.g.alpha=enter*(1-smooth(3.3,4.45,t))*(.58+.4*(Math.sin(a)+1)/2)}
for(let i=0;i<P.length;i++){let p=P[i],a=p.a+t*p.v,r=(p.r+Math.sin(t*.8+p.p)*12)*lerp(1,1.25,smooth(2.8,3.6,t)),ix=CX+Math.cos(a)*r,iy=CY+Math.sin(a)*r*.82;ix=lerp(ix,CX+Math.cos(p.p+t*2)*7,collapse);iy=lerp(iy,CY+Math.sin(p.p+t*2)*7,collapse);let f=smooth(4.3+p.z*.28,5.95+p.z*.32,t),wx=Math.sin(t*.8+p.p)*1.8*settle,wy=Math.cos(t*.7+p.p)*1.3*settle;p.s.position.set(lerp(ix,p.tx+wx,f),lerp(iy,p.ty+wy,f));let sz=p.size*lerp(.7,1.05,f);p.s.width=p.s.height=sz;p.s.alpha=enter*(.48+.5*p.z)*lerp(.8,1,f);p.s.tint=i%5?IVORY:GOLD}
strokeFigure(smooth(5.4,6.5,t),t);
const burst=Math.sin(clamp((t-3.6)/1.8)*Math.PI);seedGlow.position.set(CX,CY);seedGlow.width=seedGlow.height=lerp(75,165,burst);seedGlow.alpha=enter*(1-smooth(5.1,5.8,t))*.9;
heartGlow.position.set(CX,441);heartGlow.alpha=smooth(5.4,6.5,t)*(.56+.06*Math.sin(t*2));heartGlow.width=heartGlow.height=120+5*Math.sin(t*1.5);
softHead.position.set(CX,249);softHead.alpha=smooth(5.6,6.8,t)*.22;
app.renderer.render(app.stage);
};window.drawArt(0);window.__pixiApp=app;
})();
