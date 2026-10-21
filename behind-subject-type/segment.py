import cv2,mediapipe as mp,numpy as np,subprocess
from pathlib import Path
P=Path('/workspace/video-edit/behind-type')
cap=cv2.VideoCapture('/workspace/video-edit/reference-caption-match/source.mp4')
proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s','1080x1920','-r','30','-i','-','-c:v','libx264','-preset','fast','-crf','15','-pix_fmt','yuv420p',str(P/'subject-mask.mp4')],stdin=subprocess.PIPE)
with mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=0) as segmenter:
 n=0
 while True:
  ok,frame=cap.read()
  if not ok:break
  small=cv2.resize(frame,(540,960));rgb=cv2.cvtColor(small,cv2.COLOR_BGR2RGB)
  mask=segmenter.process(rgb).segmentation_mask
  # Confidence remap keeps solid interiors and a narrow natural antialiased edge.
  mask=np.clip((mask-.25)/.5,0,1)
  mask=cv2.resize(mask,(1080,1920),interpolation=cv2.INTER_LINEAR)
  mask=cv2.GaussianBlur(mask,(5,5),.9)
  proc.stdin.write((mask*255).astype('uint8').tobytes())
  n+=1
  if n in (45,180,330):
   bg=np.full_like(frame,(65,35,85));out=(frame*mask[:,:,None]+bg*(1-mask[:,:,None])).astype('uint8');cv2.imwrite(str(P/f'cutout-{n}.jpg'),out)
  if n%120==0:print('segmented',n,flush=True)
proc.stdin.close();proc.wait();cap.release();print('frames',n,flush=True)
