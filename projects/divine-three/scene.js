(async()=>{
await document.fonts.ready;
const T=THREE, W=1080,H=1920, canvas=document.querySelector('#world');
const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setSize(W,H);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
const scene=new T.Scene();scene.background=new T.Color('#07131f');scene.fog=new T.FogExp2('#07131f',.0065);
const camera=new T.PerspectiveCamera(47,W/H,.1,1000);
scene.add(new T.HemisphereLight(0xa6c8e2,0x10141a,2.4));let moon=new T.DirectionalLight(0xc4dcf2,3.8);moon.position.set(-35,60,35);scene.add(moon);let rim=new T.DirectionalLight(0xd8b77a,1.4);rim.position.set(50,20,-30);scene.add(rim);
let seed=71;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)), sm=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,x)=>a+(b-a)*x;
function stoneTex(){const c=document.createElement('canvas');c.width=c.height=256;let x=c.getContext('2d');x.fillStyle='#59616a';x.fillRect(0,0,256,256);for(let i=0;i<13000;i++){let v=40+rand()*95;x.fillStyle=`rgba(${v},${v+3},${v+7},.23)`;let s=1+rand()*5;x.fillRect(rand()*256,rand()*256,s,s)}for(let i=0;i<22;i++){x.beginPath();let a=rand()*256,b=rand()*256;x.moveTo(a,b);x.lineTo(a+rand()*50-25,b+rand()*80);x.strokeStyle='#1f2a3480';x.lineWidth=.5+rand();x.stroke()}let tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;return tx}
const texture=stoneTex();const stone=new T.MeshStandardMaterial({map:texture,color:0xb0bac3,roughness:.95,metalness:.08});const edgeMat=new T.MeshStandardMaterial({color:0x263540,roughness:.9});
const ring=new T.Group();scene.add(ring);const R=22,N=144;
for(let i=0;i<N;i++){let a=i/N*Math.PI*2;for(let lane=0;lane<2;lane++){let rr=R+(lane?1:-1)*.91;let b=new T.Mesh(new T.BoxGeometry(1.82,.92+rand()*.24,.91),stone);b.position.set(Math.cos(a)*rr,-.55+rand()*.045,Math.sin(a)*rr);b.rotation.y=-a;b.rotation.z=(rand()-.5)*.02;ring.add(b)}}
// Thick underside and broken hanging masonry provide depth in the elevated reveal.
let underside=new T.Mesh(new T.TorusGeometry(R,1.68,6,144),edgeMat);underside.rotation.x=Math.PI/2;underside.scale.z=.63;underside.position.y=-1.13;ring.add(underside);
for(let i=0;i<45;i++){let a=rand()*6.283;let b=new T.Mesh(new T.BoxGeometry(.45+rand()*1.3,1+rand()*2.1,.6+rand()),edgeMat);b.position.set(Math.cos(a)*(R+.1),-1.8-rand(),Math.sin(a)*(R+.1));b.rotation.set(rand()*.4,rand()*3,rand()*.3);ring.add(b)}
const gateAngles=[1.13,3.22,5.31],gates=[];
for(let i=0;i<3;i++){let a=gateAngles[i],g=new T.Group();g.position.set(R*Math.cos(a),0,R*Math.sin(a));g.rotation.y=Math.PI/2-a;
for(let side of [-1,1]){let leg=new T.Mesh(new T.BoxGeometry(1.25,8.7,1.5),stone);leg.position.set(side*2.65,4.25,0);g.add(leg);let foot=new T.Mesh(new T.BoxGeometry(1.75,.6,2),stone);foot.position.set(side*2.65,.15,0);g.add(foot)}
let top=new T.Mesh(new T.BoxGeometry(7.2,1.35,1.95),stone);top.position.y=8.7;g.add(top);let cap=new T.Mesh(new T.BoxGeometry(7.65,.4,2.2),stone);cap.position.y=9.5;g.add(cap);
let trim=new T.Mesh(new T.BoxGeometry(5.6,.07,2.02),new T.MeshBasicMaterial({color:0xe8bd65,transparent:true,opacity:0}));trim.position.y=8.2;g.add(trim);g.traverse(o=>{if(o.isMesh&&o!==trim){o.material=o.material.clone();o.material.transparent=true;}});scene.add(g);gates.push({g,trim,a});}
const person=new T.Group();scene.add(person);let cloth=new T.MeshStandardMaterial({color:0x182029,roughness:.92}),faceMat=new T.MeshStandardMaterial({color:0x34414b,roughness:.9});
function mesh(geo,mat,x,y,z,parent=person){let m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m}
mesh(new T.SphereGeometry(.40,24,20),faceMat,0,3.14,0).scale.set(.86,1.08,.90);mesh(new T.CylinderGeometry(.37,.62,1.48,20),cloth,0,2.05,0);let shoulders=mesh(new T.SphereGeometry(1,20,16),cloth,0,2.65,0);shoulders.scale.set(.68,.28,.36);
const legs=[],arms=[];for(let side of [-1,1]){let lg=new T.Group();lg.position.set(side*.23,1.35,0);person.add(lg);mesh(new T.CylinderGeometry(.17,.14,1.23,12),cloth,0,-.6,0,lg);mesh(new T.BoxGeometry(.32,.17,.53),cloth,0,-1.18,.12,lg);legs.push(lg);let arm=new T.Group();arm.position.set(side*.60,2.65,0);person.add(arm);mesh(new T.CylinderGeometry(.12,.10,1.15,12),cloth,0,-.5,0,arm);arms.push(arm)}
// Soft radial glow is a procedural texture, not a stock lens flare.
function radial(){let c=document.createElement('canvas');c.width=c.height=128;let x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,245,203,1)');g.addColorStop(.12,'rgba(255,221,132,.9)');g.addColorStop(.4,'rgba(245,182,65,.22)');g.addColorStop(1,'rgba(240,175,65,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)}
let glowTex=radial();const lightGroup=new T.Group();scene.add(lightGroup);mesh(new T.SphereGeometry(.20,24,20),new T.MeshBasicMaterial({color:0xffedc1}),0,0,0,lightGroup);let sprite=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0xffd782,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));sprite.scale.set(3.7,3.7,1);lightGroup.add(sprite);let lamp=new T.PointLight(0xffc568,11,22,2);lightGroup.add(lamp);
let motes=[];for(let i=0;i<24;i++){let m=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0xffd792,transparent:true,opacity:.2+rand()*.3,blending:T.AdditiveBlending,depthWrite:false}));let s=.04+rand()*.10;m.scale.set(s,s,1);scene.add(m);motes.push({m,a:rand()*6.283,r:1+rand()*4,h:rand()*5,phase:rand()*6})}
const seaUniforms={time:{value:0},orb:{value:new T.Vector3()},rippleTime:{value:-1}};
const water=new T.Mesh(new T.PlaneGeometry(1400,1400,1,1),new T.ShaderMaterial({uniforms:seaUniforms,vertexShader:`varying vec3 wp;void main(){vec4 p=modelMatrix*vec4(position,1.);wp=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`,fragmentShader:`precision highp float;varying vec3 wp;uniform float time;uniform vec3 orb;uniform float rippleTime;void main(){vec2 p=wp.xz;float warp=sin(p.x*.23+p.y*.18)*3.+sin(p.y*.31-p.x*.12)*2.;float wave=sin(p.x*1.7+time*.8+warp)*sin(p.y*2.5-time*.45+warp*.7)+.45*sin(p.x*4.2+p.y*3.4+time*.7+warp);vec3 n=normalize(vec3(.11*cos(p.x*1.7+time*.8),1.,.10*sin(p.y*2.5-time*.45)));vec3 v=normalize(cameraPosition-wp);float fres=pow(1.-max(dot(n,v),0.),3.);vec3 col=mix(vec3(.011,.033,.057),vec3(.047,.098,.14),fres);col+=vec3(.012,.024,.032)*(wave*.3+.5);vec2 axis=normalize(cameraPosition.xz-orb.xz);vec2 rel=p-orb.xz;float along=dot(rel,axis);float crossDist=abs(rel.x*axis.y-rel.y*axis.x);float stripe=exp(-crossDist*crossDist/(1.8+abs(along)*.1))*exp(-abs(along)*.018)*smoothstep(-3.,2.,along);float glitter=pow(clamp(.52+.27*wave+.2*sin(p.x*9.+p.y*12.+time+warp*7.),0.,1.),3.);col+=vec3(1.,.60,.17)*stripe*(.13+.8*glitter);float d=length(rel);float r=exp(-pow((d-rippleTime*8.)/.45,2.))*step(0.,rippleTime)*exp(-rippleTime*.7);col+=vec3(.32,.25,.12)*r;float fog=1.-exp(-length(wp-cameraPosition)*.009);col=mix(col,vec3(.02745,.07451,.12157),fog);gl_FragColor=vec4(col,1.);}` }));water.rotation.x=-Math.PI/2;water.position.y=-7.2;scene.add(water);
// Sparse fog banks made from transparent soft sprites, layered in depth.
let fogs=[];for(let i=0;i<14;i++){let m=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0x9bb1c0,transparent:true,opacity:.025,depthWrite:false}));m.scale.set(18+rand()*26,3+rand()*5,1);let a=rand()*6.283,rr=16+rand()*24;m.position.set(Math.cos(a)*rr,-2+rand()*5,Math.sin(a)*rr);scene.add(m);fogs.push({m,p:m.position.clone(),phase:rand()*6.28})}
// Gold pulse is a short travelling arc along the ring, linking the three gateways.
let pulse=new T.Mesh(new T.TorusGeometry(R,.095,5,220,Math.PI*.24),new T.MeshBasicMaterial({color:0xffd480,transparent:true,opacity:0}));pulse.rotation.x=Math.PI/2;pulse.position.y=.13;scene.add(pulse);
function polar(a,r=R){return new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)}
let proj=new T.Vector3();let now=0;
window.renderAt=function(t){now=t;let walk=sm((t-3)/3),a=.08+.27*walk+.07*sm((t-6)/3.6);let fp=polar(a);person.position.copy(fp);person.rotation.y=-a+Math.PI*(1-sm((t-3)/.8));let stepping=(t>3&&t<9.8)?Math.sin((t-3)*6.2)*.27:0;legs[0].rotation.x=stepping;legs[1].rotation.x=-stepping;arms[0].rotation.x=-stepping*.6;arms[1].rotation.x=stepping*.6;
let op=fp.clone().add(new T.Vector3(-Math.sin(a)*2.35,2.25,Math.cos(a)*2.35));lightGroup.position.copy(op);seaUniforms.time.value=t;seaUniforms.orb.value.copy(op);seaUniforms.rippleTime.value=t>10.8?t-10.8:-1;
let pos,look;
let c0=new T.Vector3(27,4.6,10),c1=new T.Vector3(34,6.2,17),look0=new T.Vector3(21.9,1.9,2.8);
let close=new T.Vector3(fp.x+9,5.4,fp.z+10),focus=fp.clone().lerp(op,.42);focus.y=1.9;
let wide=new T.Vector3(11,102,56),wideLook=new T.Vector3(0,0,0);
if(t<3){let q=sm(t/3);pos=c0.clone().lerp(c1,q);look=look0.clone().lerp(new T.Vector3(21.6,1.5,3.8),q)}
else if(t<6){let q=sm((t-3)/3);pos=c1.clone().lerp(new T.Vector3(fp.x+12,7,fp.z+16),q);look=new T.Vector3(21.6,1.5,3.8).lerp(focus,q)}
else if(t<9.6){let q=sm((t-6)/3.3);pos=new T.Vector3(32.67,7,23.54).lerp(wide,q);look=focus.clone().lerp(wideLook,q)}
else if(t<10.65){let q=sm((t-9.6)/1.05);pos=wide.clone().lerp(close,q);look=wideLook.clone().lerp(focus,q)}
else{pos=close.clone();look=focus.clone();if(t>13){let q=sm((t-13)/1.2);pos.lerp(new T.Vector3(fp.x+5,9,fp.z+19),q);look.lerp(new T.Vector3(op.x,-4,op.z+5),q)}}
camera.position.copy(pos);camera.lookAt(look);camera.updateMatrixWorld();
fogs.forEach((f,i)=>{f.m.position.copy(f.p);f.m.position.x+=Math.sin(t*.12+f.phase)*1.3;let obstruct=sm((t-3)/2)*(1-sm((t-10.05)/.75));f.m.material.opacity=.026+obstruct*.055;if(i<6){let rel=polar(a+(i-2.5)*.055,R+.4);f.m.position.set(rel.x,1.3+(i%3)*.8,rel.z);f.m.scale.set(7,4,1);f.m.material.opacity=obstruct*.17}f.m.visible=f.m.material.opacity>.004});
motes.forEach(({m,a,r,h,phase})=>m.position.set(op.x+Math.cos(a+t*.09)*r,op.y+h-2+Math.sin(t*.25+phase)*.18,op.z+Math.sin(a+t*.09)*r));
pulse.material.opacity=sm((t-6.8)/.4)*(1-sm((t-10)/.3))*.8;pulse.rotation.z=-(1.13+(t-6.8)*1.9);
for(let i=0;i<3;i++){let on=sm((t-(6.8+i*.72))/.3),vis=sm((t-6.6)/.5)*(1-sm((t-9.8)/.55));gates[i].g.traverse(o=>{if(o.isMesh&&o!==gates[i].trim)o.material.opacity=sm((t-5.3)/1.0)});gates[i].trim.material.opacity=on*.95;let p=gates[i].g.position.clone();p.y=11.5;p.project(camera);let el=document.querySelector('#label'+i);el.style.left=clamp((p.x*.5+.5)*W,130,950)+'px';el.style.top=clamp((-p.y*.5+.5)*H,190,1640)+'px';el.style.opacity=vis*on;}
// A slow dark dissolve retains the ocean's warm reflection for the closing question.
let ending=sm((t-12.85)/.7);document.querySelector('#shade').style.opacity=ending*.80;document.querySelector('.endline').style.opacity=sm((t-13.1)/.4);for(let [id,start] of [['line1',13.05],['line2',13.7]]){let v=sm((t-start)/.45);let e=document.querySelector('#'+id);e.style.opacity=v;e.style.transform=`translateY(${(1-v)*22}px)`}
renderer.render(scene,camera);
};window.renderAt(0);window.__sceneReady=true;
})();
