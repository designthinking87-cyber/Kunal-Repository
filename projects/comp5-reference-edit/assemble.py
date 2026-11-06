import subprocess,json,hashlib,shutil,sys
from pathlib import Path
p=Path(__file__).parent
r=p/'renders';d=p/'delivery';d.mkdir(exist_ok=True)
def run(args):subprocess.run(['ffmpeg','-y',*args],check=True)
# Normalize the stream timescale; the concat demuxer inserts in-band H.264 parameter sets.
run(['-i',str(r/'opening-4k.mp4'),'-an','-c:v','copy','-video_track_timescale','30000',str(r/'opening-video.mp4')])
# Normalize decode lead-in to two frames while retaining each packet's original PTS.
run(['-i',str(r/'opening-video.mp4'),'-c','copy','-bsf:v','setts=pts=PTS:dts=DTS-2002','-video_track_timescale','30000',str(r/'opening-shift.mp4')])
run(['-i',str(r/'original-tail-4k.mp4'),'-c','copy','-bsf:v','setts=pts=PTS:dts=DTS-1001','-video_track_timescale','30000',str(r/'tail-shift.mp4')])
(r/'concat.txt').write_text("file 'opening-shift.mp4'\nduration 31.164466666667\nfile 'bridge-4k.mp4'\nduration 0.333666666667\nfile 'tail-shift.mp4'\nduration 116.149366666667\n")
final=r/'Comp-5-reference-edit-4K.mp4'
run(['-f','concat','-safe','0','-i',str(r/'concat.txt'),'-i',str(p/'assets/comp5.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-map_metadata','-1','-video_track_timescale','30000','-movflags','+faststart',str(final)])
if '--reuse-opening' not in sys.argv or not (d/'Comp-5-opening-4K.mp4').exists():
 run(['-i',str(r/'opening-4k.mp4'),'-i',str(p/'assets/comp5.mp4'),'-map','0:v:0','-map','1:a:0','-t',str(934/(30000/1001)),'-c','copy','-map_metadata','-1','-movflags','+faststart',str(d/'Comp-5-opening-4K.mp4')])
 opening=d/'Comp-5-opening-4K.mp4'
 if opening.stat().st_size>=100*1024*1024:
  compressed=d/'opening-compressed.mp4'
  run(['-i',str(opening),'-c:v','libx264','-preset','veryfast','-crf','20','-threads','2','-c:a','copy','-movflags','+faststart',str(compressed)])
  compressed.replace(opening)
parts=[]
with final.open('rb') as f:
 for i in range(1,100):
  block=f.read(90*1024*1024)
  if not block:break
  name=f'{final.name}.part{i:02d}'
  (d/name).write_bytes(block)
  parts.append({'file':name,'bytes':len(block),'sha256':hashlib.sha256(block).hexdigest()})
manifest={'file':final.name,'bytes':final.stat().st_size,'sha256':hashlib.sha256(final.read_bytes()).hexdigest(),'parts':parts}
(d/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
