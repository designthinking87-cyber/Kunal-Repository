import React, {useLayoutEffect,useMemo} from 'react';
import {AbsoluteFill,Composition,Easing,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useLoader,useThree} from '@react-three/fiber';
import * as THREE from 'three';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.42,0,.58,1);
const IW=1672,IH=941,W=1920,H=1080,PH=IH/IW*W;
const world=(x:number,y:number,z=0)=>new THREE.Vector3((x/IW-.5)*W,(.5-y/IH)*PH,z);
// A spline in the supplied image's coordinates; the photographic clock stays untouched.
const path=new THREE.CatmullRomCurve3([[0,600],[130,650],[260,700],[450,735],[720,718],[840,746],[805,768],[850,782],[1010,771],[1120,747],[1210,759],[1230,774],[1200,785],[1280,794],[1430,775],[1560,780]].map(([x,y])=>world(x,y,4)),false,'centripetal');
const seed=(n:number)=>{const v=Math.sin(n*127.1+84.77)*43758.5453;return v-Math.floor(v)};
const glowVertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const glowFrag=`varying vec2 vUv;uniform vec3 tint;uniform float alpha;void main(){float r=length((vUv-.5)*2.);float a=exp(-r*r*7.)*smoothstep(1.,.35,r);gl_FragColor=vec4(tint,a*alpha);}`;
const DustMaterial=()=> <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`attribute float aSize;attribute float aAlpha;varying float va;void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=aSize*(1000./-p.z);va=aAlpha;}`} fragmentShader={`varying float va;void main(){float r=length(gl_PointCoord-.5)*2.;float a=exp(-r*r*4.)*smoothstep(1.,.2,r);gl_FragColor=vec4(.96,.80,.55,a*va);}`}/>;

function CameraRig(){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();const t=frame/fps;
 const {camera}=useThree();
 // Child -> teen -> adult pause -> older -> elder; one eased pullback reveals all six.
 const pan=interpolate(t,[0,1.5,3.1,4.2,5.25,7.45,8.25],[530,535,680,850,890,1120,1140],{...clamp,easing:ease});
 const zoom=interpolate(t,[0,1.5,3.1,4.2,5.25,7.45,8.25],[1.58,1.64,1.6,1.62,1.66,1.6,1.58],{...clamp,easing:ease});
 const pull=interpolate(t,[8.25,299/fps],[0,1],{...clamp,easing:Easing.bezier(.32,0,.35,1)});
 const z=THREE.MathUtils.lerp(zoom,1,pull),cx=THREE.MathUtils.lerp(pan,IW/2,pull);
 const cy=THREE.MathUtils.lerp(interpolate(t,[0,3.2,4.4,6.3,8.2],[485,455,445,460,470],clamp),IH/2,pull);
 useLayoutEffect(()=>{
  // Clamp the 2D texture's projection to the frame: no revealed missing background.
  const halfW=IW/(2*z);const safeX=Math.max(halfW,Math.min(IW-halfW,cx));
  camera.position.set((safeX/IW-.5)*W,(.5-cy/IH)*PH,1000/z);
  camera.rotation.set(0,0,0);camera.updateMatrixWorld();
 },[camera,cx,cy,z]);return null;
}
function Photograph(){
 const texture=useLoader(THREE.TextureLoader,staticFile('assets/life-stages.png'));
 useMemo(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;},[texture]);
 return <mesh position={[0,0,0]}><planeGeometry args={[W,PH]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
function Dust(){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();const t=frame/fps;
 const geometry=useMemo(()=>new THREE.BufferGeometry(),[]);
 const arrays=useMemo(()=>({positions:new Float32Array(460*3),sizes:new Float32Array(460),alphas:new Float32Array(460)}),[]);
 for(let i=0;i<460;i++){
  const k=i*3;arrays.positions[k]=(seed(i+1)-.5)*2500+Math.sin(t*.17+i)*9;
  arrays.positions[k+1]=(seed(i+800)-.5)*1250+t*(1+seed(i+41)*2);
  arrays.positions[k+2]=20+seed(i+1600)*170;
  arrays.sizes[i]=1.2+Math.pow(seed(i+2100),4)*5;
  arrays.alphas[i]=(.045+seed(i+2800)*.15)*interpolate(t,[0,1,6,8,10],[.35,.65,.7,1,1],clamp);
 }
 geometry.setAttribute('position',new THREE.BufferAttribute(arrays.positions,3));
 geometry.setAttribute('aSize',new THREE.BufferAttribute(arrays.sizes,1));
 geometry.setAttribute('aAlpha',new THREE.BufferAttribute(arrays.alphas,1));
 return <points geometry={geometry} frustumCulled={false}><DustMaterial/></points>;
}
function Haze(){const frame=useCurrentFrame(),{fps}=useVideoConfig();const t=frame/fps;
 return <group>{[0,1,2,3].map(i=><mesh key={i} position={[-780+i*590+Math.sin(t*.1+i)*14,-370+Math.sin(i)*90,35+i*20]} scale={[850,210,1]}>
  <planeGeometry/><shaderMaterial transparent depthWrite={false} vertexShader={glowVertex} fragmentShader={glowFrag} uniforms={{tint:{value:new THREE.Color(t>6?'#83949e':'#d1ad77')},alpha:{value:.022+(.012*Math.sin(t*.25+i)**2)}}}/>
 </mesh>)}</group>;
}
function TimelineLight(){const frame=useCurrentFrame(),{fps}=useVideoConfig();const t=frame/fps;
 const progress=interpolate(t,[.15,8.4],[.02,.97],clamp);
 const point=path.getPointAt(progress);
 const pulse=Math.sin(interpolate(t,[8.65,9.35],[0,Math.PI],clamp));
 const lightAlpha=interpolate(t,[0,.35,8.3,9.1],[0,.7,.55,.1],clamp);
 const pathGeometry=useMemo(()=>new THREE.BufferGeometry().setFromPoints(path.getPoints(240)),[]);
 return <group>
  <primitive object={useMemo(()=>new THREE.Line(pathGeometry,new THREE.LineBasicMaterial({color:'#f4ce91',transparent:true,opacity:.16,depthWrite:false})),[pathGeometry])}/>
  {[0,1,2].map(i=><mesh key={i} position={[point.x-i*5,point.y,8]} scale={[i===0?44:15,i===0?44:15,1]}><planeGeometry/><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={glowVertex} fragmentShader={glowFrag} uniforms={{tint:{value:new THREE.Color('#ffd695')},alpha:{value:lightAlpha/(i+1)}}}/></mesh>)}
  {Array.from({length:38},(_,i)=>{const p=path.getPointAt(i/37);return <mesh key={i} position={[p.x,p.y,6]} scale={[28,28,1]}><planeGeometry/><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={glowVertex} fragmentShader={glowFrag} uniforms={{tint:{value:new THREE.Color('#eeb86c')},alpha:{value:pulse*.17}}}/></mesh>})}
 </group>;
}
export const LifeStagesAnimation:React.FC=()=>{
 const frame=useCurrentFrame(),{width,height,fps}=useVideoConfig();
 const t=frame/fps;
 return <AbsoluteFill style={{backgroundColor:'#020407'}}>
  <ThreeCanvas width={width} height={height} camera={{position:[0,0,1000],fov:THREE.MathUtils.radToDeg(2*Math.atan(540/1000)),near:1,far:2500}} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} onCreated={({gl})=>{gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.NoToneMapping;}}>
   <ambientLight intensity={.15}/><pointLight position={[0,0,500]} intensity={.1} color="#e7bf80"/>
   <CameraRig/><Photograph/><Dust/><Haze/><TimelineLight/>
  </ThreeCanvas>
  <AbsoluteFill style={{backgroundColor:'#000',opacity:interpolate(frame,[0,45,150,240,284,299],[.24,.11,.06,.07,.065,.24],clamp)}}/>
  <AbsoluteFill style={{backgroundColor:'#172738',mixBlendMode:'color',opacity:interpolate(t,[0,6,8,10],[0,0,.105,.105],clamp)}}/>
 </AbsoluteFill>;
};
export const RemotionRoot:React.FC=()=> <Composition id="PassageOfTime" component={LifeStagesAnimation} durationInFrames={300} fps={30} width={1920} height={1080}/>;
