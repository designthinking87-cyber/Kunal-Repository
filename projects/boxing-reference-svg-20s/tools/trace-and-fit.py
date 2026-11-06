"""Source-derived vector tracing and supplied-character replacement.
Every SVG is geometry only. No embedded source bitmap or video is emitted.
"""
import sys,json,math,os
import cv2,numpy as np
from pathlib import Path
cv2.setNumThreads(2);cv2.setRNGSeed(81)
OUT=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('TRACE_WORKDIR',str(OUT/'trace-work')));(OUT/'frames').mkdir(exist_ok=True)
paths=sorted((ROOT/'source-frames').glob('*.png'));tracking=json.load(open(ROOT/'tracking-better.json'))
# A fixed source-measured palette avoids unrelated per-frame colour changes.
train=np.concatenate([cv2.imread(str(p))[::12,::12,:].reshape(-1,3)for p in paths[::9]]).astype(np.float32)
_,_,palette=cv2.kmeans(train,40,None,(cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER,40,.2),3,cv2.KMEANS_PP_CENTERS)
palette=np.rint(palette).clip(0,255).astype(np.uint8)
# Fixed RGB lookup; 6 bits per component preserves compression-edge detail.
q=np.arange(64)*4+1.5;xx,yy,zz=np.meshgrid(q,q,q,indexing='ij');bins=np.stack([xx,yy,zz],axis=-1).reshape(-1,3).astype(np.float32)
lut=[]
for chunk in np.array_split(bins,16):lut.extend(np.argmin(((chunk[:,None,:]-palette.astype(float)[None,:,:])**2).sum(axis=2),axis=1))
lut=np.array(lut,dtype=np.uint8);del bins,xx,yy,zz,train

def color(rgb):return '#'+''.join(f'{int(x):02x}'for x in rgb)
def convert_color(bgr):
 b,g,r=map(float,bgr)
 if r>132 and r-g>22 and r-b>22:
  alpha=min(1,max(0,(r-g)/111));shade=round(119*(1-alpha)+23*alpha);return color([shade*.88,shade,shade*1.1])
 if r>145 and g-r>6 and b-r>10:return '#eeeae4'
 return color([r,g,b])

def trace(mask,epsilon=.9,minarea=4):
 mask=cv2.medianBlur(mask,3)
 mask=cv2.GaussianBlur(mask,(5,5),.72)
 _,mask=cv2.threshold(mask,125,255,cv2.THRESH_BINARY)
 contours,h=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE);d=[]
 if h is None:return ''
 for cnt in contours:
  if abs(cv2.contourArea(cnt))<minarea:continue
  p=cv2.approxPolyDP(cnt,epsilon,True).reshape(-1,2)
  if len(p)<3:continue
  if len(p)<7:
   d.append('M'+f'{p[0,0]},{p[0,1]}'+'L'+' '.join(f'{x},{y}'for x,y in p[1:])+'Z')
  else:
   pf=p.astype(float);before=np.roll(pf,1,axis=0)-pf;after=np.roll(pf,-1,axis=0)-pf
   lens1=np.maximum(np.linalg.norm(before,axis=1),.01);lens2=np.maximum(np.linalg.norm(after,axis=1),.01)
   rounding=np.minimum(1.0,np.minimum(lens1,lens2)/3)
   ins=pf+before/lens1[:,None]*rounding[:,None];outs=pf+after/lens2[:,None]*rounding[:,None]
   d.append(f'M{outs[-1,0]:.1f},{outs[-1,1]:.1f}'+''.join(f'L{pin[0]:.1f},{pin[1]:.1f}Q{x},{y} {pout[0]:.1f},{pout[1]:.1f}'for (x,y),pin,pout in zip(p,ins,outs))+'Z')
 return ''.join(d)

def tagpath(d,fill,id=None):return f'<path'+(f' id="{id}"'if id else '')+f' d="{d}" fill="{fill}" fill-rule="evenodd" stroke="{fill}" stroke-width=".65" stroke-linejoin="round"/>'if d else ''

def star(x,y,r):return ' '.join(f'{x+math.cos(-math.pi/2+j*math.pi/5)*r*(.44 if j%2 else 1):.3f},{y+math.sin(-math.pi/2+j*math.pi/5)*r*(.44 if j%2 else 1):.3f}'for j in range(10))
# Fill short occluded head-detection gaps within the same shot only.
for i,rec in enumerate(tracking):
 if rec['head']is not None:continue
 a=next((j for j in range(i-1,max(-1,i-5),-1)if tracking[j]['head']is not None),None)
 b=next((j for j in range(i+1,min(len(tracking),i+5))if tracking[j]['head']is not None),None)
 if a is not None and b is not None and b-a<7:
  ha=np.array(tracking[a]['head']);hb=np.array(tracking[b]['head']);
  if .65<ha[2]/hb[2]<1.5 and np.linalg.norm(ha[:2]-hb[:2])<ha[2]*4:
   rec['head']=(ha+(hb-ha)*(i-a)/(b-a)).tolist();rec['interpolated_occlusion']=True

fixpath=OUT/'manual-tracking-corrections.json'
if fixpath.exists():
 for index,head in json.load(open(fixpath)).items():tracking[int(index)]['head']=head;tracking[int(index)]['manual_review_fix']=True
frames=[];meta=[]
only=set(map(int,os.environ.get('FIX_FRAMES','').split(',')))if os.environ.get('FIX_FRAMES')else set()
oldmeta=json.load(open(OUT/'frame-map.json'))if only else []
for i,p in enumerate(paths):
 if only and i not in only:
  svg=(OUT/'frames'/f'{i:04d}.svg').read_text();frames.append(svg.split('>',1)[1].rsplit('</svg>',1)[0]);meta.append(oldmeta[i]);continue
 im=cv2.imread(str(p));b,g,r=cv2.split(im.astype(np.int16));light=((r>140)&(r-g>30)&(r-b>28)).astype(np.uint8)*255
 torso=((r>140)&(r<244)&(r-g>35)&(r-b>30)).astype(np.uint8)*255
 idx=lut[((im[:,:,0]//4).astype(np.int32)*4096+(im[:,:,1]//4).astype(np.int32)*64+(im[:,:,2]//4))]
 counts=np.bincount(idx.reshape(-1),minlength=40);valid=(np.max(palette,axis=1)-np.min(palette,axis=1)<18)&(palette[:,1]>50)&(palette[:,1]<180)
 base=int(np.argmax(counts*valid));parts=[f'<rect width="1280" height="720" fill="{convert_color(palette[base])}"/>']
 # Trace every retained set/opponent/effect/caption layer from the current source frame.
 for k,col in enumerate(palette):
  if k==base:continue
  m=(idx==k).astype(np.uint8)*255
  d=trace(m,1.05 if abs(int(col[2])-int(col[1]))<20 else .65,5 if abs(int(col[2])-int(col[1]))<20 else 2)
  parts.append(tagpath(d,convert_color(col)))
 rec=tracking[i];head=rec['head'];fitted=None
 if head and np.count_nonzero(light)>150:
  hx,hy,rad=map(float,head)
  # Weighted torso direction: original darker body colour excludes the nearer arm.
  y0=max(0,int(hy-rad*4));y1=min(720,int(hy+rad*4));x0=max(0,int(hx-rad*4));x1=min(1280,int(hx+rad*4))
  yy,xx=np.mgrid[y0:y1,x0:x1];dx=xx-hx;dy=yy-hy;dd=np.sqrt(dx*dx+dy*dy)/rad
  dm=cv2.distanceTransform(torso[y0:y1,x0:x1],cv2.DIST_L2,3)
  weights=(dm**2)*((dd>1.12)&(dd<3.8))*np.exp(-((dd-2.2)/1.25)**2)
  if weights.sum()>0:
   ax=float((dx*weights).sum()/weights.sum());ay=float((dy*weights).sum()/weights.sum());norm=math.hypot(ax,ay);ax/=norm;ay/=norm
  else:ax,ay=rec.get('axis')or[0,1]
  # In nearly featureless head-only close-ups, use a stable down-screen torso.
  if rad>140 and hy+rad>515:ax,ay=0,1
  angle=math.degrees(math.atan2(ay,ax))-90
  if rad>100 and i<308:ax,ay,angle=0,1,0
  head_angle=max(-35,min(35,angle))if i<154 or 176<=i<330 or i>=368 else angle
  # Keep depth ordering: custom layers are clipped to the source-visible actor.
  maskpath=trace(light,.65,2);bodypath=trace(torso,.8,2)
  parts.append(f'<defs><clipPath id="visible-hero"><path d="{maskpath}" fill-rule="evenodd"/></clipPath><clipPath id="body-only"><path d="{bodypath}" fill-rule="evenodd"/></clipPath></defs>')
  transform=f'translate({hx:.2f} {hy:.2f}) rotate({angle:.2f}) scale({rad:.5f})'
  # Garments are fitted to the original torso axis, with near arms occluding them.
  parts.append(f'<g id="hero-wardrobe" clip-path="url(#body-only)"><g transform="{transform}">')
  parts.append('<path d="M-.52 1.08L-.27 .96Q0 1.38 .27 .96L.53 1.1L.40 1.85L.51 3.58Q0 3.69-.51 3.58L-.39 1.85Z" fill="#f3eee6" stroke="#c4bcb1" stroke-width=".025"/>')
  parts.append('<path d="M-.32 2.02L-.16 3.28L.31 3.46M.3 2.66L.38 3.22" fill="none" stroke="#c4bcb1" stroke-width=".035"/>')
  parts.append('<path d="M-.53 3.5L.53 3.5L.7 4.58L.04 4.65L0 4.15L-.08 4.65L-.7 4.58Z" fill="#eeeae4"/>')
  parts.append('<path d="M-.54 3.51L-.01 3.51L-.06 4.64L-.7 4.57Z" fill="#193451"/>')
  for j in range(5):parts.append(f'<path d="M.02 {3.57+j*.21:.2f}L{.55+j*.026:.3f} {3.57+j*.21:.2f}L{.57+j*.026:.3f} {3.67+j*.21:.2f}L.02 {3.67+j*.21:.2f}Z" fill="#bd3444"/>')
  for row in range(4):
   for col in range(2):parts.append(f'<polygon points="{star(-.42+col*.22,3.68+row*.23,.074)}" fill="#fff4df"/>')
  parts.append('<path d="M-.54 3.51L.54 3.51" stroke="#fff6e8" stroke-width=".10"/>')
  parts.append('</g></g>')
  # Peach head, large eyes, nose, mouth and bald identity from the supplied image.
  # Rotated with the pose; gaze faces the actual opponent where visible.
  dark=((r-g>25)&(r<145)&(r>55)).astype(np.uint8)
  ys,xs=np.where(dark);oppx=float(xs.mean())if len(xs)>200 else hx+200
  facing=1 if oppx>hx else -1
  head_transform=f'translate({hx:.2f} {hy:.2f}) rotate({head_angle:.2f}) scale({rad:.5f})'
  parts.append(f'<g id="hero-head" clip-path="url(#visible-hero)"><g transform="{head_transform}">')
  parts.append('<circle r="1.025" fill="#efc9aa"/><path d="M-.86 .22A.91 .91 0 0 1 .65-.68" fill="none" stroke="#ffdfad" stroke-width=".045"/>')
  parts.append(f'<g transform="scale({facing} 1)">')
  parts.append('<ellipse cx="-.18" cy="-.17" rx=".23" ry=".34" fill="#faf6ec"/><ellipse cx=".38" cy="-.15" rx=".27" ry=".37" fill="#faf6ec"/><ellipse cx="-.10" cy="-.13" rx=".10" ry=".19" fill="#171c21"/><ellipse cx=".47" cy="-.11" rx=".12" ry=".21" fill="#171c21"/><ellipse cx="-.07" cy="-.21" rx=".034" ry=".061" fill="white"/><ellipse cx=".51" cy="-.20" rx=".041" ry=".071" fill="white"/><ellipse cx=".81" cy=".16" rx=".15" ry=".1" fill="#dfad88"/>')
  action=i/22>=5.3
  if action:parts.append('<path d="M-.44-.57L.02-.46M.2-.45L.62-.55M-.01 .46L.4 .41" fill="none" stroke="#584137" stroke-width=".055" stroke-linecap="round"/>')
  else:parts.append('<path d="M-.44-.58Q-.2-.76 .03-.6M.19-.62Q.4-.79 .64-.62" fill="none" stroke="#534136" stroke-width=".043" stroke-linecap="round"/><path d="M-.28 .31Q.19 .51 .62 .24Q.35 .96-.04 .73Q-.23 .63-.28 .31Z" fill="#542f31"/><path d="M-.19 .38Q.2 .52 .51 .34L.38 .51L-.1 .5Z" fill="#fff8e9"/><path d="M.02 .68Q.24 .5 .44 .64L.27 .76Z" fill="#e88a7d"/>')
  parts.append('</g></g></g>')
  # White soles on fully visible planted source feet. No new foot trajectory.
  yb=int(np.where(light>0)[0].max())
  if yb<628 and ay>.55 and yb-hy>rad*5.3:
   sole=light.copy();sole[:max(0,yb-max(2,int(rad*.08)))]=0;parts.append(tagpath(trace(sole,.5,2),'#e9e6dd','hero-soles'))
  fitted={'head':[hx,hy,rad],'axis':[ax,ay],'angle':angle,'head_angle':head_angle,'facing':facing}
 # Restore original near-arm occlusion over the fitted head and vest.
 bright=((r>=244)&(r-g>38)&(r-b>35)).astype(np.uint8)*255
 parts.append(tagpath(trace(bright,.65,2),'#151a20','hero-near-arm'))
 # Preserve exact source letterbox over replacement geometry.
 parts.append('<path d="M0 0H1280V88H0ZM0 632H1280V720H0Z" fill="#000"/>')
 # Attribution is retained as live SVG text; no invented film branding.
 parts.append('<text x="1268" y="47" text-anchor="end" font-family="Arial,sans-serif" font-size="29" fill="#686868">DartAnimates</text>')
 inner=''.join(parts);svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1280 720">{inner}</svg>'
 (OUT/'frames'/f'{i:04d}.svg').write_text(svg);frames.append(inner);meta.append({'frame':i,'source_time':i/22,'actor_fit':fitted,'source_derived':True})
 if i%40==0:print(f'{i}/440',flush=True)
(OUT/'frame-data.js').write_text('window.SVG_FRAMES='+json.dumps(frames,separators=(',',':'))+';')
json.dump(meta,open(OUT/'frame-map.json','w'),indent=2)
json.dump({'bgr':palette.tolist(),'source_frames':440,'source_fps':22,'vector_path_epsilon_source_pixels':{'background':1.05,'actors':.65}},open(OUT/'trace-settings.json','w'),indent=2)
print({'svg_frames':len(frames),'js_bytes':(OUT/'frame-data.js').stat().st_size,'fitted_heads':sum(x['actor_fit']is not None for x in meta)})
