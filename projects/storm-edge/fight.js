/* STORM / EDGE — deterministic original vector animation.
 * Geometry is redrawn at every requested frame, then composited by PixiJS.
 * Local action coordinates: +x is the actor's facing. Hands and feet use
 * two-bone IK with constant lengths. No image cutouts or reference plates.
 */
(()=>{
const W=1920,H=1080,D=24,PI=Math.PI;
const surface=document.createElement('canvas');surface.width=W;surface.height=H;
const c=surface.getContext('2d',{alpha:false});
// The identical 2D vector surface can be presented directly for efficient
// software rendering, or composited through PixiJS with ?pixi in a browser.
const pixiMode=new URLSearchParams(location.search).has('pixi');
let app=null,texture=null;if(pixiMode){app=new PIXI.Application({width:W,height:H,backgroundColor:0x070e1b,antialias:true,autoStart:false,preserveDrawingBuffer:true});app.ticker.stop();texture=PIXI.Texture.from(surface);app.stage.addChild(new PIXI.Sprite(texture));}
document.querySelector('#art').appendChild(pixiMode?app.view:surface);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
const seed=n=>{let v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function line(p,col,w=3){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=col;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.stroke()}
function poly(p,col,stroke,w=2){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=col;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke()}}
function ellipse(x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,PI*2);c.fillStyle=col;c.fill()}
function glow(x,y,r,col){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
// Pose: root x/y, torso lean, front wrist, rear wrist, front foot, rear foot,
// whole-body rotation, weapon angle. Distinct anticipations/contact/recoveries.
const base=(x=760,y=708)=>[x,y,8,86,-154,22,-166,62,166,-58,166,0,-48];
const A=[],B=[];
function key(list,t,v){list.push({t,v:[...v]})}
function pose(list,t,changes){let v=list.length?[...list[list.length-1].v]:base();for(const [i,x] of Object.entries(changes))v[+i]=x;key(list,t,v)}
key(A,0,base(590));key(B,0,base(1270));
// The approach: grounded loading, flight, compression, guard.
pose(A,.6,{2:2,3:65,4:-150});pose(B,.6,{2:0});
pose(A,1.0,{0:620,1:720,2:22,3:-65,4:-90,5:110,6:-170,7:80,8:154,9:-70,10:152});
pose(A,1.12,{0:675,1:675,7:95,8:80,9:-80,10:130});pose(A,1.3,{0:745,1:713,3:93,4:-154,5:15,6:-173,7:76,8:161,9:-76,10:161});
pose(B,1.3,{0:1100,1:708,3:85,4:-165,5:20,6:-160});
// Lead jab / cross / slip; contacts at 2.12, 2.78, 3.52.
pose(A,1.8,{0:790,2:0,3:50,4:-160,7:64,9:-64});pose(B,1.8,{0:1055,3:100,4:-155});
pose(A,2.0,{2:-8,3:35,4:-164,5:20,6:-180});
pose(A,2.12,{0:825,2:20,3:171,4:-174,7:65,9:-89});pose(B,2.12,{0:1060,2:-21,3:112,4:-190});
pose(B,2.2,{0:1090,2:-29,1:714});pose(A,2.35,{0:812,2:5,3:83,4:-154});pose(B,2.5,{0:1060,2:8});
pose(A,2.62,{2:-12,5:-10,6:-145});pose(A,2.78,{0:840,2:24,5:165,6:-168,3:50,4:-150});pose(B,2.78,{0:1070,2:-27,3:56,4:-145});pose(B,2.92,{0:1125,1:725,2:-32,7:85,9:-70});
pose(A,3.15,{0:845,2:5,3:75,4:-168,5:25,6:-165});pose(B,3.15,{0:1090,1:708,2:5});
pose(B,3.35,{2:-12,3:24,4:-165});pose(B,3.52,{0:1055,2:25,3:170,4:-166});pose(A,3.48,{1:760,2:32,3:60,4:-145,5:10,6:-135,7:75,8:112,9:-80,10:112});
pose(B,3.7,{0:1020,2:25,3:140,4:-140});pose(A,3.78,{0:800,1:755,2:-5,3:40,4:-140});
// Body hook and recipient compression.
pose(A,4.02,{0:855,1:742,2:24,3:162,4:-67,5:36,6:-153,7:73,8:130,9:-73,10:130});pose(B,4.02,{0:1070,1:736,2:27,3:85,4:-93,5:34,6:-87});
pose(B,4.15,{0:1120,1:745,2:36});pose(A,4.32,{0:850,1:710,2:10,3:85,4:-155,7:74,8:164,9:-74,10:164});
pose(B,4.55,{0:1120,1:709,2:10,3:83,4:-164,5:23,6:-155});
// Low sweep is avoided by a real tucked flight; spinning kick at 6.18.
pose(B,4.9,{0:1080,1:770,2:52,3:18,4:70,5:55,6:-70,7:155,8:95,9:-75,10:100});
pose(A,4.87,{1:750,2:23,3:40,4:-150,7:65,8:124,9:-65,10:124});
pose(A,5.06,{0:885,1:635,2:-5,3:80,4:-190,5:-40,6:-130,7:74,8:85,9:-90,10:75});
pose(B,5.06,{0:1070,1:790,2:65,7:165,8:70,9:-67,10:85,11:-12});
pose(A,5.38,{0:915,1:660,2:7,3:60,4:-135,7:90,8:113,9:-55,10:142});
pose(A,5.62,{0:910,1:743,2:22,3:93,4:-130,7:76,8:131,9:-85,10:131});
pose(B,5.65,{0:1160,1:728,2:10,3:85,4:-150,5:22,6:-155,7:64,8:146,9:-64,10:146,11:0});
pose(A,5.9,{0:905,1:716,2:-18,3:10,4:-165,5:-65,6:-130,7:45,8:158,9:-65,10:158});
pose(A,6.18,{0:975,1:699,2:-20,3:35,4:-160,5:-80,6:-88,7:163,8:-70,9:-54,10:175,11:-6});pose(B,6.18,{0:1185,1:725,2:-30,3:65,4:-95});
pose(B,6.36,{0:1250,1:744,2:-39,7:90,8:130,9:-55,10:130});pose(A,6.5,{0:960,1:716,2:17,3:75,4:-150,5:15,6:-160,7:85,8:158,9:-65,10:158,11:0});
// Grapple counter, lift, flip and three-point landing.
pose(B,6.83,{0:1190,1:743,2:45,3:110,4:-90,5:70,6:-85});pose(A,6.83,{0:980,1:730,2:6});
pose(B,7.06,{0:1090,1:765,2:50,3:127,4:-110,5:92,6:-50,7:70,8:109,9:-80,10:109});
pose(A,7.06,{0:970,1:727,2:34,3:95,4:-95,5:35,6:-90});
pose(B,7.35,{0:1060,1:690,2:-30,3:65,4:-225,5:45,6:-180,7:70,8:184,9:-70,10:184});
pose(A,7.35,{0:1010,1:535,2:38,3:75,4:-155,5:-80,6:-105,7:110,8:45,9:-60,10:115,11:-60});
pose(A,7.58,{0:1240,1:560,2:0,3:100,4:-100,5:-80,6:-130,7:80,8:90,9:-90,10:70,11:-160});
pose(B,7.58,{0:1060,1:726,2:45,3:135,4:-80,5:88,6:-115,7:70,8:148,9:-70,10:148});
pose(A,7.88,{0:1390,1:660,2:10,3:80,4:-140,5:-25,6:-125,7:70,8:125,9:-80,10:100,11:-300});
pose(A,8.16,{0:1420,1:775,2:52,3:105,4:96,5:80,6:-100,7:70,8:99,9:-93,10:99,11:-360});
pose(A,8.45,{0:1420,1:750,2:30,3:75,4:-100,5:20,6:-145,7:60,8:124,9:-83,10:124});
pose(B,8.45,{0:1120,1:710,2:6,3:80,4:-160,5:20,6:-160,7:65,8:164,9:-65,10:164});
// Both turn. Facing is switched deliberately at 8.8 after the landing.
pose(A,8.85,{0:1420,1:710,2:8,3:85,4:-160,5:20,6:-170,7:65,8:164,9:-65,10:164});
pose(B,8.85,{0:1150,2:8});
// Challenger rush. Guard, elbow counter; hero moves left from here.
pose(B,9.15,{0:1200,1:717,2:27,3:50,4:-150,5:-70,6:-115,7:90,8:155,9:-85,10:155});
pose(B,9.35,{0:1220,1:685,2:20,3:160,4:-170,5:20,6:-150,7:55,8:105,9:-90,10:125});
pose(A,9.35,{0:1430,1:710,2:8,3:108,4:-187,5:75,6:-165});
pose(B,9.52,{0:1220,1:731,2:8,3:75,4:-150,7:70,8:143,9:-65,10:143});
pose(A,9.72,{0:1400,1:720,2:34,3:155,4:-135,5:35,6:-162,7:70,8:154,9:-85,10:154});pose(B,9.72,{0:1190,1:720,2:-28,3:70,4:-135});
pose(B,9.91,{0:1130,1:730,2:-35});pose(A,10.1,{0:1420,1:710,2:10,3:85,4:-160,7:65,8:164,9:-65,10:164});
// Separation and weapon retrieval, from the two rooftop racks.
pose(B,10.5,{0:1010,1:713,2:-15,3:-108,4:-98,5:40,6:-150,7:70,8:161,9:-70,10:161});
pose(B,10.8,{0:1010,2:8,3:85,4:-130,12:-55});
pose(A,10.8,{0:1490,2:-17,3:-90,4:-100,5:50,6:-150,7:65,9:-65});
pose(A,11.12,{0:1490,2:8,3:85,4:-140,12:-120});
pose(A,11.48,{0:1430,2:17,3:95,4:-160,12:-35});pose(B,11.48,{0:1100,2:12,3:92,4:-155,12:-30});
pose(A,11.95,{0:1410,2:3,3:80,4:-155,12:-45});pose(B,11.95,{0:1120,2:3,3:80,4:-155,12:-45});
// Blade beats — windups then 2-frame contacts. Facing A left / B right.
function bladeBeat(t,ax,bx,high,win){
pose(A,t,{0:ax,1:720,2:-15,3:10,4:high?-220:-95,5:20,6:-145,12:high?-130:25});
pose(B,t,{0:bx,1:720,2:-12,3:25,4:high?-80:-215,5:20,6:-140,12:high?30:-120});
pose(A,t+.18,{0:ax+15,1:710,2:10,3:58,4:high?-160:-95,12:-35});
pose(B,t+.18,{0:bx-15,1:715,2:10,3:58,4:high?-160:-95,12:-40});
pose(A,t+.28,{0:ax-12,2:win?15:-18,3:100,4:-153,12:-65});pose(B,t+.28,{0:bx+8,2:win?-22:10,3:92,4:-149,12:-50});
pose(A,t+.54,{0:ax,1:710,2:7,3:83,4:-157,12:-48});pose(B,t+.54,{0:bx,1:710,2:7,3:83,4:-157,12:-48});}
bladeBeat(12.15,1400,1140,true,true);bladeBeat(12.95,1390,1145,false,false);bladeBeat(13.72,1390,1145,true,true);
// Duck under wide slash, roof gouge sparks.
pose(B,14.5,{0:1170,2:-25,3:-35,4:-200,12:-140});pose(B,14.67,{0:1210,2:35,3:150,4:-145,12:-10});
pose(A,14.6,{0:1410,1:775,2:42,3:70,4:-96,5:30,6:-100,7:75,8:99,9:-80,10:99,12:25});
pose(A,14.88,{0:1460,1:775,2:35,3:80,4:-85,12:45});pose(B,14.88,{0:1210,2:48,3:130,4:-90,12:50});
pose(A,15.15,{0:1430,1:712,2:8,3:80,4:-155,7:65,8:162,9:-65,10:162,12:-45});pose(B,15.15,{0:1160,1:712,2:10,3:80,4:-155,12:-45});
bladeBeat(15.45,1420,1160,false,true);bladeBeat(16.2,1410,1150,true,false);
// Leap / overhead clash / compressed landing.
pose(A,17.0,{0:1410,1:758,2:27,3:15,4:-210,7:65,8:116,9:-65,10:116,12:-110});
pose(B,17.0,{0:1150,1:750,2:20,3:20,4:-220,7:65,8:124,9:-65,10:124,12:-115});
pose(A,17.24,{0:1340,1:570,2:15,3:100,4:-200,5:-40,6:-120,7:80,8:85,9:-85,10:80,12:-75});
pose(B,17.24,{0:1200,1:590,2:15,3:80,4:-205,5:-25,6:-120,7:80,8:90,9:-85,10:95,12:-75});
pose(A,17.48,{0:1410,1:530,2:10,3:58,4:-160,12:-35});pose(B,17.48,{0:1120,1:550,2:10,3:58,4:-160,12:-40});
pose(A,17.64,{0:1450,1:560,2:-25,3:80,4:-150,12:-65});pose(B,17.64,{0:1080,1:585,2:-25,3:80,4:-150,12:-65});
pose(A,18.0,{0:1480,1:770,2:38,3:80,4:-110,7:65,8:104,9:-85,10:104,12:10});pose(B,18.0,{0:1050,1:770,2:38,3:80,4:-110,7:65,8:104,9:-85,10:104,12:10});
pose(A,18.32,{0:1470,1:713,2:8,3:83,4:-155,7:65,8:161,9:-65,10:161,12:-45});pose(B,18.32,{0:1060,1:713,2:8,3:83,4:-155,7:65,8:161,9:-65,10:161,12:-45});
// The challenger commits; hero sidesteps and hooks the weapon arm.
pose(B,18.8,{0:1150,1:720,2:30,3:-15,4:-205,12:-135,7:85,8:154,9:-85,10:154});
pose(B,19.02,{0:1245,1:715,2:40,3:155,4:-130,12:15});pose(A,19.0,{0:1450,1:760,2:45,3:95,4:-100,7:75,8:114,9:-80,10:114,12:45});
pose(A,19.26,{0:1410,1:730,2:25,3:130,4:-165,5:115,6:-135,7:80,8:144,9:-85,10:144,12:-65});pose(B,19.26,{0:1210,1:720,2:20,3:140,4:-155,12:-15});
pose(A,19.46,{0:1380,1:705,2:-15,3:120,4:-210,5:85,6:-180,12:-100});pose(B,19.46,{0:1210,1:730,2:35,3:145,4:-210,12:-100});
// Disarm on 19.72; planted side kick on 20.48.
pose(A,19.72,{0:1390,1:714,2:23,3:140,4:-108,5:60,6:-160,12:30});pose(B,19.72,{0:1190,1:735,2:-20,3:125,4:-55,5:30,6:-140,12:100});
pose(B,19.9,{0:1155,1:730,2:-25,3:90,4:-90});pose(A,20.2,{0:1380,1:720,2:-10,3:75,4:-165,5:15,6:-145,7:75,8:65,9:-65,10:154,12:-75});
pose(A,20.48,{0:1360,1:700,2:-22,3:65,4:-155,5:-35,6:-120,7:170,8:-45,9:-60,10:174,12:-90});pose(B,20.48,{0:1130,1:728,2:-32,3:85,4:-90,7:60,8:146,9:-65,10:146});
pose(B,20.68,{0:1015,1:685,2:-40,3:30,4:-120,5:-70,6:-80,7:70,8:95,9:-80,10:90,11:32});
pose(A,20.8,{0:1380,1:720,2:16,3:80,4:-140,7:75,8:154,9:-65,10:154,12:20});
pose(B,21.12,{0:900,1:810,2:-35,3:90,4:-70,5:-30,6:-100,7:90,8:40,9:-85,10:45,11:78});
pose(B,21.3,{0:865,1:825,2:-20,3:80,4:-90,7:80,8:35,9:-90,10:40,11:88});
pose(A,21.35,{0:1380,1:713,2:4,3:65,4:-105,5:20,6:-155,7:65,8:161,9:-65,10:161,12:58});
pose(B,21.8,{0:865,1:825,2:-15});pose(A,21.8,{0:1380,2:0,3:60,4:-70,5:25,6:-100,12:72});
pose(B,23.99,{0:865,1:825,2:-15});pose(A,23.99,{0:1380,1:713,2:0,3:60,4:-70,5:25,6:-100,12:72});
function sample(list,t){let k=0;while(k<list.length-2&&list[k+1].t<=t)k++;const a=list[k],b=list[k+1];let u=clamp((t-a.t)/(b.t-a.t)); // retain fast strike travel; ease recovery only
if(b.t-a.t>.28)u=u*u*(3-2*u);return a.v.map((x,i)=>mix(x,b.v[i],u));}
const contacts=[{t:2.12,x:1052,y:526,k:'hit'},{t:2.78,x:1085,y:534,k:'hit'},{t:4.02,x:1048,y:655,k:'body'},{t:5.62,x:910,y:878,k:'land'},{t:6.18,x:1160,y:635,k:'hit'},{t:8.16,x:1420,y:878,k:'land'},{t:9.35,x:1320,y:530,k:'block'},{t:9.72,x:1240,y:572,k:'hit'},{t:12.33,x:1270,y:478,k:'metal'},{t:13.13,x:1280,y:543,k:'metal'},{t:13.9,x:1270,y:478,k:'metal'},{t:14.88,x:1390,y:869,k:'scrape'},{t:15.63,x:1280,y:543,k:'metal'},{t:16.38,x:1280,y:478,k:'metal'},{t:17.48,x:1270,y:310,k:'metal'},{t:18,x:1480,y:878,k:'land'},{t:18,x:1050,y:878,k:'land'},{t:19.72,x:1250,y:590,k:'metal'},{t:20.48,x:1175,y:680,k:'body'},{t:21.12,x:900,y:879,k:'land'}];
window.fightContacts=contacts;
function ik(a,b,l1,l2,side){let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);d=clamp(d,1,l1+l2-.5);const angle=Math.atan2(dy,dx),off=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));return[a[0]+Math.cos(angle+side*off)*l1,a[1]+Math.sin(angle+side*off)*l1]}
function limb(a,b,l1,l2,side,col,w){const j=ik(a,b,l1,l2,side);const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);if(d>l1+l2-.5)b=[a[0]+dx/d*(l1+l2-.5),a[1]+dy/d*(l1+l2-.5)];line([a,j,b],'#071019',w+5);line([a,j,b],col,w);line([[a[0]-3,a[1]],[j[0]-3,j[1]],[b[0]-3,b[1]]],'#5e7483',2);return b}
function sword(x,y,angle,enemy,alpha=1){c.save();c.globalAlpha*=alpha;c.translate(x,y);c.rotate(angle*PI/180);poly([[0,-8],[160,-5],[181,0],[160,5],[0,8]],enemy?'#bdc9e3':'#e6ffff','#649cae',2);line([[10,-4],[161,-2]],'#fff',2);line([[0,-23],[0,23]],'#d6a56e',7);line([[-32,0],[-2,0]],'#283240',13);line([[-27,-3],[-8,-3]],'#d6a56e',3);c.restore()}
function actor(p,enemy,t,ghost=false){let [x,y,lean,fx,fy,bx,by,tx,ty,ux,uy,rot,blade]=p;const facing=t<8.7?(enemy?-1:1):(enemy?1:-1);
c.save();c.translate(x,y);c.rotate(rot*PI/180);c.scale(facing,1);if(ghost)c.globalAlpha=.1;
const leanX=Math.sin(lean*PI/180)*118,sy=-Math.cos(lean*PI/180)*118;const sh=[leanX,sy];
const body=enemy?'#253758':'#f4eee5',ink='#101b27',arm=enemy?'#2d4568':'#182330';
// Cast shadow is drawn separately in world space. Far limbs are naturally occluded.
limb([-15,-3],[ux,uy],91,92,-1,enemy?'#1e2c46':'#101a28',19);
const farWrist=limb([sh[0]-13,sh[1]+6],[bx,by],72,73,-1,arm,18);ellipse(farWrist[0],farWrist[1],18,21,enemy?'#1c2940':'#101b28');
function shoe(xx,yy,far){poly([[xx-16,yy-8],[xx+12,yy-7],[xx+29,yy+2],[xx+28,yy+12],[xx-18,yy+12]],enemy?'#141c30':'#17202b','#08111d',2);line([[xx-17,yy+10],[xx+28,yy+10]],enemy?'#526480':'#e6e6dc',4);if(!enemy){poly([[xx+11,yy-6],[xx+27,yy+1],[xx+28,yy+7],[xx+8,yy+7]],'#eae8de');for(let i=0;i<3;i++)line([[xx-4+i*4,yy-6],[xx+i*4,yy]],'#eee',2)}}
shoe(ux,uy,true);
// Shoulder, waist and neck rotate together; torso contours change with pose.
const waist=[[-30,-12],[28,-12]],topL=[sh[0]-29,sh[1]+4],topR=[sh[0]+26,sh[1]+4];
poly([topL,[sh[0]-23,sh[1]+36],[-32,-8],[31,-8],[sh[0]+24,sh[1]+36],topR,[sh[0]+13,sh[1]-4],[sh[0]-12,sh[1]-4]],body,ink,3);
if(!enemy){c.beginPath();c.moveTo(sh[0]-13,sh[1]+1);c.quadraticCurveTo(sh[0]+3,sh[1]+26,sh[0]+17,sh[1]+2);c.strokeStyle='#9c9690';c.lineWidth=3;c.stroke();line([[sh[0]-16,sh[1]+48],[-11,-22],[18,-18]],'#c6bfb8',3);line([[sh[0]+15,sh[1]+58],[19,-35]],'#fff9ef',3)}
// Flag shorts: navy star panel and explicit striped panel, clipped to silhouette.
const shorts=[[-32,-17],[31,-17],[40,49],[4,53],[-3,29],[-11,53],[-41,48]];
poly(shorts,enemy?'#283b60':'#e5e3df',ink,3);c.save();c.beginPath();shorts.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.clip();if(!enemy){c.fillStyle='#193451';c.fillRect(-45,-12,42,70);for(let k=0;k<5;k++){c.fillStyle='#bd3444';c.fillRect(-1,-10+k*14,48,7)}for(let k=0;k<7;k++){let xx=-31+(k%2)*15,yy=-2+Math.floor(k/2)*15;c.save();c.translate(xx,yy);let pts=[];for(let j=0;j<10;j++){let a=-PI/2+j*PI/5,r=j%2?2:5;pts.push([Math.cos(a)*r,Math.sin(a)*r])}poly(pts,'#fff3d9');c.restore()}}c.restore();line([[-30,-15],[30,-15]],enemy?'#d95262':'#f5f0e9',7);
limb([13,27],[tx,ty],80,92,-1,arm,20);shoe(tx,ty,false);
// Head in coherent three-quarter/profile: nose, gaze and chin face local +x.
const hx=sh[0]+14,hy=sh[1]-58;line([[sh[0],sh[1]+7],[hx,hy+38]],enemy?'#263654':'#e8b88f',23);
c.save();c.translate(hx,hy);c.rotate(-lean*.19*PI/180);
if(enemy){ellipse(0,0,47,51,'#0f1b32');c.beginPath();c.arc(0,0,47,-1.9,.9);c.strokeStyle='#5986ab';c.lineWidth=3;c.stroke();poly([[4,-9],[41,-5],[42,6],[7,5]],'#283b59');line([[15,-2],[36,-2]],'#ff6574',4);line([[7,22],[34,15]],'#3b4c6a',3)}else{
ellipse(0,0,48,51,'#f1c9aa');c.beginPath();c.arc(-1,-1,46,2.6,5.9);c.strokeStyle='#ffda9f';c.lineWidth=3;c.stroke();
const hurt=contacts.some(e=>e.k==='land'&&e.t>7&&e.t<9&&t>e.t&&t<e.t+.5);const determined=t>1.4;
ellipse(21,-7,14,20,'#faf7ec');ellipse(-6,-9,12,18,'#faf7ec');ellipse(27,-6,6,11,'#101822');ellipse(0,-8,5,10,'#101822');ellipse(29,-10,2,4,'#fff');ellipse(2,-12,2,3,'#fff');line([[-17,-30],[4,determined?-24:-34]],'#29303a',4);line([[13,determined?-24:-32],[35,-29]],'#29303a',4);ellipse(40,10,9,6,'#e7b58e');if(determined){line([[4,27],[25,24]],'#70423c',3)}else{c.beginPath();c.arc(11,12,23,.2,2.7);c.fillStyle='#44262b';c.fill();line([[-7,22],[28,20]],'#fff9ef',6)}if(hurt){line([[-2,18],[4,14]],'#b76559',2)}}c.restore();
// Near arm and glove, with weapon attached to actual clamped wrist.
const wrist=limb([sh[0]+12,sh[1]+9],[fx,fy],72,73,1,arm,20);
ellipse(wrist[0],wrist[1],20,23,enemy?'#243451':'#111c29');line([[wrist[0]-12,wrist[1]-10],[wrist[0]-8,wrist[1]-18]],enemy?'#657897':'#8d9eaa',3);
const hasSword=enemy?t>=10.7&&t<19.72:t>=11.02;
if(hasSword)sword(wrist[0],wrist[1],blade,enemy);
if(enemy){poly([[29,-12],[45,5],[85,28],[40,19],[17,1]],'#a9364a');line([[31,-9],[64,16]],'#e56f6c',3)}
c.restore();return {x,y};}
// Painted rooftop, depth layers and reflected pools remain flat 2D.
function background(t){c.fillStyle='#070e1b';c.fillRect(0,0,W,H);glow(1330,290,720,'rgba(44,109,143,.32)');glow(320,550,550,'rgba(23,78,101,.25)');
for(let k=0;k<7;k++){let x=200+k*300+t*3;ellipse(x,190+seed(k)*130,220,27,'rgba(39,62,82,.2)')}const flash=Math.max(0,1-Math.abs(t-11.5)/.12)+Math.max(0,1-Math.abs(t-17.0)/.09);if(flash>0){c.save();c.globalAlpha=flash*.65;line([[460,90],[420,235],[459,221],[392,395],[435,273],[402,287]],'#b5e4f2',4);glow(430,240,330,'rgba(141,205,255,.3)');c.restore()}ellipse(1440,210,65,65,'#b8d4dd');ellipse(1418,190,62,61,'#111f32');
for(let layer=0;layer<3;layer++){const sc=1+layer*.38,baseY=690+layer*35;for(let i=0;i<30;i++){const x=i*86-180-layer*28,y=baseY-(100+seed(i+layer*80)*260)*sc,w=48+seed(i+20)*40;c.fillStyle=['#0c192b','#10253a','#163147'][layer];c.fillRect(x,y,w,baseY-y);if(layer===1)for(let r=0;r<9;r++)for(let q=0;q<3;q++)if(seed(i*40+r*3+q)>.63){c.fillStyle=seed(i+r)>.5?'#42616a':'#745b4b';c.fillRect(x+9+q*12,y+17+r*20,3,6)}if(i%7===0)line([[x+w*.5,y],[x+w*.5,y-60]],'#243a50',3)}}
// Far rail and roof ledge; cracks and puddles anchor the ground plane.
c.fillStyle='#152a3a';c.fillRect(-400,819,2800,200);c.fillStyle='#233e4d';c.fillRect(-400,820,2800,14);c.fillStyle='#0b1b2a';c.fillRect(-400,887,2800,300);
for(let x=-200;x<2300;x+=170){line([[x,725],[x,820]],'#335160',6);line([[x,745],[x+170,745]],'#2b4d5d',4)}
for(let i=0;i<35;i++){let x=seed(i+510)*2400-200,y=837+seed(i+431)*170;line([[x,y],[x+seed(i+41)*100+15,y-2]],'#284554',1)}
for(let i=0;i<9;i++){let x=150+i*225;ellipse(x,911+seed(i)*55,90,3,'#24424e');line([[x-55,912+seed(i)*55],[x+43,912+seed(i)*55]],'#4b6e75',1)}
// Rooftop ventilation blocks / utility lights create a different world.
for(const x of [380,1735]){poly([[x,740],[x+105,740],[x+130,768],[x+130,821],[x,821]],'#192d3c','#3c5361');for(let j=0;j<6;j++)line([[x+15,757+j*8],[x+92,757+j*8]],'#080f1e',4)}
for(const x of [300,1640]){glow(x,777,135,'rgba(255,165,83,.11)');line([[x,707],[x,817]],'#152536',7);c.fillStyle='#ffbd70';c.fillRect(x-12,708,24,7)}
// Swords start visibly secured to roof racks; disappear only when gripped.
if(t>=10.35&&t<11.2){for(const x of [920,1575]){line([[x,650],[x,820]],'#415363',5);line([[x-26,820],[x+26,820]],'#415363',5);line([[x-15,650],[x+15,650]],'#72828c',5)}}if(t>=10.35&&t<10.7)sword(920,616,-115,true);if(t>=10.35&&t<11.02)sword(1575,616,-65,false);
// Cloth strips, harbour searchlight, sparse rain.
for(let i=0;i<140;i++){let x=(seed(i+100)*2600+t*63)%2600-350,y=(seed(i+200)*1150+t*560)%1150;line([[x,y],[x-10,y+29]],'rgba(160,204,220,.12)',1)}
}
function effect(e,t){const d=t-e.t;if(d<0||d>.6)return;const metal=e.k==='metal'||e.k==='scrape',land=e.k==='land',life=land?.6:.28;if(d>life)return;const u=d/life,a=(1-u);c.save();
if(land){for(let i=0;i<16;i++){let dir=i%2?1:-1,xx=e.x+dir*(20+seed(i+e.t)*180)*u,yy=e.y-30*Math.sin(u*PI)*seed(i+6);ellipse(xx,yy,15+u*25,4+u*8,`rgba(117,167,183,${a*.18})`)}ellipse(e.x,e.y+4,140*u,5,'rgba(137,220,227,'+(a*.35)+')')}
else{glow(e.x,e.y,110*a,metal?'rgba(255,181,85,.42)':'rgba(255,233,184,.25)');for(let i=0;i<(metal?27:14);i++){let angle=seed(i+Math.floor(e.t*100))*PI*2,r=(metal?70:50)+(seed(i+19)*140),xx=e.x+Math.cos(angle)*r*u,yy=e.y+Math.sin(angle)*r*u+u*u*35;line([[xx,yy],[xx-Math.cos(angle)*(metal?25:12)*a,yy-Math.sin(angle)*20*a]],metal?`rgba(255,${180+Math.floor(seed(i)*60)},115,${a})`:`rgba(232,246,248,${a})`,metal?2:3)}if(u<.25){poly([[e.x-42,e.y-3],[e.x-8,e.y-9],[e.x,e.y-40],[e.x+8,e.y-8],[e.x+48,e.y],[e.x+8,e.y+7],[e.x,e.y+33],[e.x-8,e.y+8]],'#fff1cd')}}c.restore()}
function camera(t){const shots=[{t:0,z:1.08,x:970,y:530},{t:1.5,z:1.36,x:930,y:660},{t:3,z:1.62,x:1000,y:660},{t:4.7,z:1.28,x:1060,y:650},{t:6.7,z:1.18,x:1160,y:650},{t:8.7,z:1.55,x:1280,y:665},{t:10.4,z:1.04,x:1220,y:570},{t:12,z:1.55,x:1280,y:630},{t:14.5,z:1.3,x:1300,y:680},{t:17,z:1.12,x:1260,y:550},{t:18.6,z:1.5,x:1280,y:680},{t:20.3,z:1.2,x:1190,y:680},{t:22,z:1.5,x:1380,y:640}];let s=shots[0];for(const v of shots)if(t>=v.t)s=v;let age=t-s.t;return {...s,z:s.z*(1+.018*clamp(age/2.5)),age};}
window.drawFight=function(time){const t=Math.min(23.999,Math.max(0,time));c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle='#070e1b';c.fillRect(0,0,W,H);const cam=camera(t);let shake=0;for(const e of contacts){let d=t-e.t;if(d>=0&&d<.16)shake+=Math.sin(d*170)*5*(1-d/.16)}c.save();c.translate(W/2+shake,H/2+shake*.4);c.scale(cam.z,cam.z);c.translate(-cam.x,-cam.y);background(t);
const pa=sample(A,t),pb=sample(B,t);for(const p of [pa,pb]){const elevation=clamp((710-p[1])/250);ellipse(p[0],881,70*(1-elevation*.5),8*(1-elevation*.3),'rgba(0,3,11,.5)');}
// Tightly limited velocity afterimages only on fast travel.
for(const [ls,en]of [[B,true],[A,false]]){let prev=sample(ls,Math.max(0,t-.055)),cur=sample(ls,t);if(Math.abs(cur[0]-prev[0])>30){actor(sample(ls,Math.max(0,t-.07)),en,t,true);actor(sample(ls,Math.max(0,t-.035)),en,t,true)}}
actor(pb,true,t);actor(pa,false,t);
// Detached blade follows ballistic arc after actual release.
if(t>=19.72&&t<21.35){let d=t-19.72;sword(1250-d*215,590-430*d+280*d*d,-100+d*650,true);}
contacts.forEach(e=>effect(e,t));
// Short weapon arcs at clash events, anchored to the blade contact.
for(const e of contacts.filter(e=>e.k==='metal')){let d=t-e.t;if(d>-.08&&d<.1){c.save();c.globalAlpha=(1-Math.abs(d)/.11)*.65;c.beginPath();c.ellipse(e.x,e.y,155,60,-.65,.2,2.8);c.strokeStyle='#b8f5ff';c.lineWidth=7;c.stroke();c.restore()}}
c.restore();
// Motivated 80ms shutter handoffs instead of unmotivated long dissolves.
if(cam.age<.08&&t>0){c.fillStyle=`rgba(5,15,28,${(1-cam.age/.08)*.45})`;c.fillRect(0,0,W,H)}
// Cinemascope matte inside the requested 16:9 delivery; illustration fills width.
c.fillStyle='#03070d';c.fillRect(0,0,W,72);c.fillRect(0,1008,W,72);
if(t<1.45){let a=clamp(t/.25)*clamp((1.45-t)/.25);c.globalAlpha=a;c.fillStyle='#a8c6cf';c.font='bold 20px Arial';c.letterSpacing='7px';c.fillText('AN ORIGINAL 2D FIGHT',120,132);c.letterSpacing='0px';c.globalAlpha=1}
if(t>=22){let a=clamp((t-22)/.35);c.globalAlpha=a;c.fillStyle='#e4eff0';c.font='900 76px Arial';c.fillText('STORM / EDGE',130,240);c.fillStyle='#7dabb9';c.font='18px Arial';c.letterSpacing='5px';c.fillText('PRECISION OVER POWER',135,290);c.letterSpacing='0px';c.globalAlpha=1}
if(t<.25||t>23.7){c.fillStyle=`rgba(3,7,13,${t<.25?1-t/.25:(t-23.7)/.3})`;c.fillRect(0,0,W,H)}
if(pixiMode){texture.update();app.renderer.render(app.stage);}
};window.fightPoseData={A,B};
})();
