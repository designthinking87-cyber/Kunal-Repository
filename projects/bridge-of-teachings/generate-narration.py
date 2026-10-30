import os,json,subprocess
from pathlib import Path
os.environ['OMP_NUM_THREADS']='4'
import soundfile as sf
from kokoro_onnx import Kokoro
p=Path(__file__).parent
k=Kokoro(os.environ.get('KOKORO_MODEL','models/kokoro-v1.0.onnx'),os.environ.get('KOKORO_VOICES','models/voices-v1.0.bin'))
segments=[(.1,1.9,'My purpose here is simple.'),(2,6.8,'To serve as a bridge between my Spiritual Master and those who are searching for answers.'),(7,14.75,'To bring these timeless teachings closer to you, in a way that encourages you to question, reflect, and discover something deeper about your own existence.')]
for i,(a,b,text) in enumerate(segments):
 samples,sr=k.create(text,voice='am_michael',speed=[.9,1.1,1.2][i],lang='en-us');raw=p/f'public/assets/voice-{i}-raw.wav';out=p/f'public/assets/voice-{i}.wav';sf.write(raw,samples,sr)
 ratio=len(samples)/sr/(b-a)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',f'atempo={ratio},afade=t=in:d=0.01,afade=t=out:st={b-a-.03}:d=0.03','-ar','48000',str(out)],check=True)
 print(i,len(samples)/sr,ratio,text,flush=True)
(p/'narration.json').write_text(json.dumps([{'start':a,'end':b,'text':c} for a,b,c in segments],indent=2)+'\n')
