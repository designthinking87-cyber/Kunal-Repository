from pathlib import Path
import os,json,subprocess
os.environ['OMP_NUM_THREADS']='4'
import soundfile as sf
from kokoro_onnx import Kokoro
p=Path(__file__).parent
k=Kokoro(os.environ.get('KOKORO_MODEL','models/kokoro-v1.0.onnx'),os.environ.get('KOKORO_VOICES','models/voices-v1.0.bin'))
segments=[
(0.15,2.55,'Think about it for a second.'),
(2.8,5.65,'You can remember being a child,'),
(5.95,9.25,"but you no longer have that child's body."),
(9.6,13.65,'You can remember the person you were ten years ago,'),
(13.95,18.6,'but your thoughts and beliefs may be completely different today.'),
(19.0,22.25,'Still, when you look back, you say,'),
(22.55,24.45,'That was me.')]
for i,(start,end,text) in enumerate(segments):
 a,sr=k.create(text,voice='am_michael',speed=.74 if i<5 else .62,lang='en-us')
 sf.write(p/f'public/assets/voice-{i}-raw.wav',a,sr)
 duration=len(a)/sr;ratio=duration/(end-start)
 # Keep the provided narration complete and fit the fixed 25-second edit.
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(p/f'public/assets/voice-{i}-raw.wav'),'-af',f'atempo={ratio:.8f},afade=t=in:d=0.012,afade=t=out:st={end-start-.025}:d=0.025','-ar','48000',str(p/f'public/assets/voice-{i}.wav')],check=True)
 print(i,text,duration,ratio,flush=True)
(p/'narration.json').write_text(json.dumps([{'start':a,'end':b,'text':c} for a,b,c in segments],indent=2))
