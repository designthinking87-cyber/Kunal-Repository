"""Original deterministic stereo action SFX; no voices or music."""
import numpy as np, wave
SR=48000; duration=24
rng=np.random.default_rng(279)
out=np.zeros((duration*SR,2),dtype=np.float64)
events=[(1.12,'air',-.4),(1.3,'foot',-.3),(2.12,'hit',.1),(2.78,'hit',.2),(3.52,'air',.05),(4.02,'body',.1),(5.06,'air',.1),(5.62,'land',.1),(6.18,'hit',.3),(7.35,'air',.15),(8.16,'land',.6),(9.35,'block',.3),(9.72,'hit',.1),(10.7,'draw',-.1),(11.02,'draw',.6),(12.33,'metal',.25),(13.13,'metal',.25),(13.9,'metal',.25),(14.67,'air',.3),(14.88,'scrape',.4),(15.63,'metal',.25),(16.38,'metal',.25),(17.24,'air',.1),(17.48,'metal',.25),(18,'land',.45),(18.05,'land',-.25),(19.02,'air',.3),(19.72,'metal',.2),(20.48,'body',.05),(21.12,'land',-.4),(21.3,'scrape',-.5),(21.35,'drop',-.5)]
def add(t,s,pan=0,gain=1):
    i=int(t*SR); n=min(len(s),len(out)-i)
    if n<=0 or i<0:return
    out[i:i+n,0]+=s[:n]*np.sqrt((1-pan)/2)*gain
    out[i:i+n,1]+=s[:n]*np.sqrt((1+pan)/2)*gain

def sound(kind,index):
    dur={'metal':.72,'draw':.55,'land':.48,'scrape':.5,'air':.2,'drop':.6}.get(kind,.3)
    t=np.arange(int(dur*SR))/SR; noise=rng.normal(size=len(t))
    smooth=np.convolve(noise,np.ones(12)/12,mode='same')
    attack=np.minimum(t/.001,1)
    if kind in ('metal','drop'):
        freqs=[891,1342,2337,3698,5107] if kind=='metal' else [723,1703,2849]
        s=sum(np.sin(2*np.pi*f*(1+index*.001)*t)*np.exp(-t*(8+j*5))*(.25/(j+1)) for j,f in enumerate(freqs))
        s+=noise*np.exp(-t*170)*.3
    elif kind in ('draw','scrape'):
        high=noise-smooth;s=high*(.09 if kind=='draw' else .17)*np.exp(-t*7)*np.sin(np.pi*np.minimum(t/dur,1))
        s+=np.sin(2*np.pi*(1600*t+500*t*t))*np.exp(-t*10)*.065
    elif kind=='air':
        env=np.sin(np.pi*t/dur)**2;s=smooth*env*.62+(noise-smooth)*env*.018
    else:
        weight={'land':1.0,'body':.85,'hit':.65,'foot':.35,'block':.4}[kind]
        s=np.sin(2*np.pi*(76*t+34*(1-np.exp(-t*25))/25))*np.exp(-t*30)*weight*.65
        s+=smooth*np.exp(-t*45)*weight*.8
        s+=(noise-smooth)*np.exp(-t*200)*(.17 if kind=='hit' else .09)
        if kind=='land':s+=np.convolve(noise,np.ones(40)/40,mode='same')*np.exp(-t*14)*.8
        if kind=='block':s+=np.sin(2*np.pi*410*t)*np.exp(-t*65)*.12
    return s*attack
for i,(t,k,p) in enumerate(events):
    if k in ('hit','body','metal'):
        add(t-.1,sound('air',i),p,.5)
    add(t,sound(k,i),p)
# Quiet textured wind and rain, not pitched or musical.
n=rng.normal(size=len(out));low=np.convolve(n,np.ones(280)/280,mode='same')
for ch in range(2):out[:,ch]+=low*.025
for t in [1.0,4.55,6.5,8.85,10.5,11.48,15.15,18.32,21.35]:add(t,sound('foot',2),0,.4)
fade=np.minimum(np.arange(len(out))/(SR*.25),1)*np.minimum((len(out)-np.arange(len(out)))/(SR*.35),1)
out*=fade[:,None]
peak=np.max(np.abs(out));out*=.89/max(peak,.89)
with wave.open('sfx.wav','wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((out*32767).astype('<i2').tobytes())
print({'duration':duration,'peak_dbfs':round(20*np.log10(np.max(np.abs(out))),2),'events':len(events),'source':'Original procedural synthesis'})
