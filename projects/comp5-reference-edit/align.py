import sys,json,wave,re,subprocess,tempfile
from pathlib import Path
sys.path.insert(0,'/workspace/video-edit/alignment-libs')
from pocketsphinx import Decoder
p=Path(__file__).parent
text=(p/'script.txt').read_text()
words=re.findall(r"[a-zA-Z]+(?:'[a-zA-Z]+)?",text)
norm=[w.lower().replace('realised','realized') for w in words]
d=Decoder(lm=None,samprate=16000,beam=1e-100,wbeam=1e-80,pbeam=1e-100)
missing=[w for w in norm if d.lookup_word(w) is None]
print('Missing words:',missing,flush=True)
if missing:raise RuntimeError('Missing dictionary entries')
d.set_align_text(' '.join(norm))
with tempfile.TemporaryDirectory() as temp:
 audio=Path(temp)/'alignment.wav'
 subprocess.run(['ffmpeg','-y','-i',str(p/'assets/comp5.mp4'),'-t','33.5','-vn','-ac','1','-ar','16000',str(audio)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 with wave.open(str(audio),'rb') as f:data=f.readframes(f.getnframes())
d.start_utt();d.process_raw(data,full_utt=True);d.end_utt()
segments=[{'text':s.word,'start':s.start_frame/100,'end':(s.end_frame+1)/100} for s in d.seg()]
print(json.dumps(segments),flush=True)
(p/'alignment-raw.json').write_text(json.dumps(segments,indent=2))
clean=[s for s in segments if s['text'] not in ['<sil>','<s>','</s>','[SPEECH]','[NOISE]','<noise>'] and not s['text'].startswith('+')]
if len(clean)!=len(words):raise RuntimeError(f'Alignment count mismatch: {len(clean)} vs {len(words)}')
for w,s in zip(words,clean):s['text']=w
(p/'words.json').write_text(json.dumps(clean,indent=2))
