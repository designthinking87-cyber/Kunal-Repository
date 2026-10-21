import subprocess
from pathlib import Path
P=Path('/workspace/video-edit/transition-finish')
z="1+0.16*exp(-pow((on-120)/4.5,2))+0.20*exp(-pow((on-240)/5,2))+0.07*exp(-pow((on-360)/4.5,2))"
x="iw/2-iw/zoom/2+28*sin((on-120)/2.5)*exp(-pow((on-120)/4,2))"
y="ih/2-ih/zoom/2"
f=f"[0:v]zoompan=z='{z}':x='{x}':y='{y}':d=1:s=1080x1920:fps=30,avgblur=sizeX=19:sizeY=1:enable='between(t,3.9,4.1)',gblur=sigma=4.5:steps=2:enable='between(t,7.9,8.1)'[base];"
f+="color=c=0xE9C770@0.22:s=150x2300:r=30:d=16,format=rgba,gblur=sigma=25:steps=2,rotate=-0.30:ow=rotw(-0.30):oh=roth(-0.30):c=none[gold];"
f+="[base][gold]overlay=x='-1100+4200*(t-11.72)':y=-180:enable='between(t,11.72,12.28)':format=auto,format=yuv420p[v]"
(P/'filter.txt').write_text(f)
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-i','/workspace/caption-delivery/videos/Main-behind-subject-overlapping-type.mp4','-filter_complex_threads','4','-filter_complex',f,'-map','[v]','-map','0:a:0','-c:v','libx264','-crf','17','-preset','fast','-threads','4','-c:a','copy','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-t','16','/workspace/caption-delivery/videos/Main-behind-subject-transitions.mp4']
subprocess.run(cmd,check=True)
