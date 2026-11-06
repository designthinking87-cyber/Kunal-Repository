import sys,json,math,os
import cv2,numpy as np
from pathlib import Path
ROOT=Path(os.environ.get("TRACE_WORKDIR",str(Path(__file__).resolve().parents[1]/"trace-work")))
cv2.setNumThreads(2)
out=[]
for i,p in enumerate(sorted((ROOT/'source-frames').glob('*.png'))):
 im=cv2.imread(str(p));b,g,r=cv2.split(im.astype(np.int16));mask=((r>145)&(r-g>38)&(r-b>32)).astype(np.uint8)*255
 small=cv2.resize(mask,(640,360),interpolation=cv2.INTER_AREA);small=cv2.GaussianBlur(small,(5,5),.7)
 circles=cv2.HoughCircles(small,cv2.HOUGH_GRADIENT,1.2,18,param1=80,param2=18,minRadius=5,maxRadius=125)
 candidates=[];angles=np.linspace(0,2*np.pi,180,endpoint=False)
 for x,y,rad in ([]if circles is None else circles[0]):
  x*=2;y*=2;rad*=2
  xx=np.clip(np.rint(x+np.cos(angles)*rad*.92),0,1279).astype(int);yy=np.clip(np.rint(y+np.sin(angles)*rad*.92),0,719).astype(int);inside=mask[yy,xx]>0
  xx=np.clip(np.rint(x+np.cos(angles)*rad*1.08),0,1279).astype(int);yy=np.clip(np.rint(y+np.sin(angles)*rad*1.08),0,719).astype(int);outside=mask[yy,xx]>0
  score=float(np.mean(inside&~outside));fill=float(np.mean(inside));score+=min(rad/300,.3)
  if fill>.65 and score>.65:candidates.append((score,x,y,rad))
 if candidates:
  score,x,y,rad=max(candidates)
  # Find the torso direction from the neck connection through the head's ring.
  # Use far-enough samples so a guard hand near the head is not the torso.
  angles2=np.linspace(-np.pi,np.pi,144,endpoint=False);scores=[]
  for a in angles2:
   ax,ay=np.cos(a),np.sin(a);weights=[]
   for rr in np.linspace(1.1,2.6,16):
    px,py=int(x+ax*rad*rr),int(y+ay*rad*rr)
    if 0<=px<1280 and 87<=py<633:weights.append((mask[py,px]>0)*(1 if rr<2 else .5))
    else:weights.append(0)
   scores.append(sum(weights))
  scores=np.array(scores);scores=sum(np.roll(scores,k)for k in range(-4,5));a=float(angles2[np.argmax(scores)])
  out.append({'frame':i,'time':i/22,'head':[round(float(x),2),round(float(y),2),round(float(rad),2)],'confidence':round(score,3),'axis':[round(float(np.cos(a)),4),round(float(np.sin(a)),4)]})
 else:out.append({'frame':i,'time':i/22,'head':None,'confidence':0,'axis':None})
json.dump(out,open(ROOT/'tracking-better.json','w'),indent=2,default=float)
from PIL import Image,ImageDraw
sheet=Image.new('RGB',(1600,1440),'#111')
for j,i in enumerate(range(0,len(out),11)):
 im=Image.open(ROOT/'source-frames'/f'{i+1:04d}.png').resize((320,180));d=ImageDraw.Draw(im)
 if out[i]['head']:
  x,y,r=out[i]['head'];ax,ay=out[i]['axis'];x/=4;y/=4;r/=4;d.ellipse((x-r,y-r,x+r,y+r),outline='lime',width=2);d.line((x,y,x+ax*r*3,y+ay*r*3),fill='yellow',width=2)
 d.text((8,9),f'{i} / {i/22:.2f}s',fill='yellow');sheet.paste(im,((j%5)*320,(j//5)*180))
sheet.save(ROOT/'head-better.jpg');print({'frames':len(out),'heads':sum(x['head']is not None for x in out)})
