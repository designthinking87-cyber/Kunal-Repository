"""Original, softly evolving harmonic sound design. No samples or external music."""
import math,wave,random,struct
from pathlib import Path
SR=48000;N=SR*10;random.seed(84);out=bytearray();low=0
for i in range(N):
 t=i/SR; fade=min(1,t/.8)*min(1,(10-t)/1.1); chord=0
 for f,a in [(146.832,.032),(220,.017),(293.665,.012),(440,.006)]:
  chord+=a*math.sin(2*math.pi*f*t+.12*math.sin(t*.7))
 low=.987*low+.013*(random.random()*2-1)
 air=low*.055*math.sin(min(1,t/5)*math.pi/2)
 bells=0
 for onset,freq in [(3.65,587.33),(5.55,880),(6.1,1174.66)]:
  dt=t-onset
  if dt>0:
   env=(1-math.exp(-dt*22))*math.exp(-dt*1.8)
   bells+=env*(math.sin(2*math.pi*freq*dt)+.22*math.sin(2*math.pi*freq*2.003*dt))*.032
 val=(chord+air+bells)*fade
 l=int(max(-.95,min(.95,val))*32767);r=int(max(-.95,min(.95,val*.96+low*.009*fade))*32767)
 out.extend(struct.pack('<hh',l,r))
p=Path(__file__).parent/'sound-design.wav'
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(out)
