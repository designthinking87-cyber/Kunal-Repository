import json,subprocess,hashlib
from pathlib import Path
p=Path(__file__).parent;f=p/'renders/Comp-5-reference-edit-4K.mp4'
def probe(args,file):return json.loads(subprocess.check_output(['ffprobe','-v','error',*args,'-of','json',str(file)]))
info=probe(['-show_streams','-show_format'],f)
v=next(s for s in info['streams'] if s['codec_type']=='video')
assert (v['width'],v['height'],v['nb_frames'],v['avg_frame_rate'])==(3840,2160,'4425','30000/1001')
assert abs(float(v['duration'])-147.6475)<1e-6
packets=probe(['-select_streams','v:0','-show_packets'],f)['packets']
assert sorted(int(k['pts']) for k in packets)==[i*1001 for i in range(4425)]
assert all(int(a['dts'])<int(b['dts']) for a,b in zip(packets,packets[1:]))
def audio_hash(file):return subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-']).decode().strip().split('=')[1]
a=audio_hash(p/'assets/comp5.mp4');b=audio_hash(f);assert a==b
m=json.loads((p/'delivery/manifest.json').read_text());combined=hashlib.sha256()
for part in m['parts']:
 data=(p/'delivery'/part['file']).read_bytes();assert hashlib.sha256(data).hexdigest()==part['sha256'];combined.update(data)
assert combined.hexdigest()==m['sha256']
assert all((p/'delivery'/part['file']).stat().st_size<100*1024*1024 for part in m['parts'])
opening=probe(['-select_streams','v:0','-show_streams'],p/'delivery/Comp-5-opening-4K.mp4')['streams'][0]
assert (opening['width'],opening['height'],opening['nb_frames'])==(3840,2160,'934')
assert (p/'delivery/Comp-5-opening-4K.mp4').stat().st_size<100*1024*1024
r={'width':3840,'height':2160,'fps':'30000/1001','full_video_frames':4425,'full_video_seconds':147.6475,'caption_cutoff_frame':934,'caption_cutoff_seconds':934/(30000/1001),'caption_groups':29,'supplied_words':79,'presentation_timestamps':'all 4425 frames have unique exact 1001-tick spacing','decode_timestamps':'strictly increasing','original_audio_sha256':a,'export_audio_sha256':b,'audio_preserved_exactly':True,'download_parts_verified':True,'all_github_files_under_100_MiB':True}
decode=subprocess.run(['ffmpeg','-v','error','-threads','2','-i',str(f),'-map','0:v:0','-f','null','-'],capture_output=True,check=True)
assert not decode.stderr,decode.stderr.decode()
r['full_video_decode_errors']=0
(p/'validation.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
