from pathlib import Path
import math,wave,struct
p=Path(__file__).parent;sr=48000;data=bytearray()
for i in range(sr*25):
 t=i/sr;fade=min(1,t/2)*min(1,(25-t)/2);v=0
 for freq,amp in [(110,.022),(164.813,.012),(220,.008),(329.627,.004)]:v+=math.sin(t*math.tau*freq+.08*math.sin(t*.6))*amp
 for at,freq in [(2.65,440),(9.5,329.627),(13.8,554.365),(22.4,659.255)]:
  dt=t-at
  if dt>0:v+=(1-math.exp(-dt*8))*math.exp(-dt*1.7)*math.sin(dt*math.tau*freq)*.012
 v*=fade
 data.extend(struct.pack('<hh',int(v*32767),int(v*.95*32767)))
with wave.open(str(p/'public/assets/sound-bed.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(data)
