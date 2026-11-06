"""Retain source fight SFX at original timestamps; exclude dialogue sections."""
import wave,json,numpy as np
from pathlib import Path
root=Path(__file__).resolve().parents[1];work=root/'trace-work'
with wave.open(str(work/'source-audio.wav'),'rb')as f:
 rate=f.getframerate();channels=f.getnchannels();data=np.frombuffer(f.readframes(f.getnframes()),'<i2').reshape(-1,channels).astype(float)/32768
keep=[(0.0,4.25),(5.35,8.0),(10.88,20.0)]
t=np.arange(len(data))/rate;env=np.zeros(len(data));fade=.012
for a,b in keep:
 shape=np.minimum(np.clip((t-a)/fade,0,1),np.clip((b-t)/fade,0,1));env=np.maximum(env,shape)
data*=env[:,None]*.86
with wave.open(str(root/'sfx-only.wav'),'wb')as f:
 f.setnchannels(channels);f.setsampwidth(2);f.setframerate(rate);f.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
json.dump({'duration':len(data)/rate,'sample_rate':rate,'channels':channels,'retained_source_intervals':keep,'crossfade_seconds':fade,'dialogue_sections_muted':[[4.25,5.35],[8,10.88]],'source':'Original audio from the user-provided reference; action regions only, no newly generated SFX.','listening_audition':'Not yet available'},open(root/'audio-cues.json','w'),indent=2)
print({'duration':len(data)/rate,'peak_dbfs':20*np.log10(np.abs(data).max()),'kept':keep})
