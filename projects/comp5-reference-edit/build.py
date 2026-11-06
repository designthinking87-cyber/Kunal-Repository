import json,html
from pathlib import Path
p=Path(__file__).parent
fps=30000/1001
cutoff=934/fps
length=4425/fps
caps=json.loads((p/'captions.json').read_text())
camera=json.loads((p/'camera.json').read_text())
css='''@font-face{font-family:ReferenceSans;src:url(assets/ReferenceSans-Regular.ttf);font-weight:400;font-style:normal}@font-face{font-family:ReferenceSans;src:url(assets/ReferenceSans-BoldItalic.ttf);font-weight:700;font-style:italic}*{box-sizing:border-box;margin:0}html,body{width:3840px;height:2160px;background:#000;overflow:hidden}#root{position:relative;width:3840px;height:2160px;overflow:hidden}#camera{position:absolute;inset:0;transform-origin:50% 50%;will-change:transform}video{width:100%;height:100%;object-fit:cover}.caption{position:absolute;inset:0;z-index:5;pointer-events:none}.caption-inner{width:100%;height:100%;padding:520px 220px 700px 2500px;display:flex;justify-content:center;align-items:center}.caption.left .caption-inner{padding:520px 2500px 700px 220px}.phrase{font-family:ReferenceSans,Arial,sans-serif;font-size:118px;font-weight:400;color:#fff;line-height:1.16;text-align:center;max-width:1120px;text-wrap:balance;text-shadow:0 3px 14px #100d0e80}.word{display:inline-block}.phrase em{font-size:176px;font-weight:700;font-style:italic}'''
body=f'''<div id="camera" data-layout-allow-overflow><video id="footage" class="clip" src="assets/comp5.mp4" data-start="0" data-duration="{length:.9f}" data-track-index="0" muted playsinline></video></div><audio id="voice" src="assets/comp5.mp4" data-start="0" data-duration="{length:.9f}" data-track-index="1" data-volume="1"></audio>'''
tweens=[]
first=camera[0]
tweens.append(f"tl.set('#camera',{{scale:{first['scale']},x:{first['x']},y:{first['y']}}},0);")
for prev,k in zip(camera,camera[1:]):
    dur=min(1.0,k['time']-prev['time'])
    start=max(prev['time'],k['time']-dur)
    tweens.append(f"tl.to('#camera',{{scale:{k['scale']},x:{k['x']},y:{k['y']},duration:{dur},ease:'power2.inOut'}},{start});")
for i,c in enumerate(caps):
    start=max(0,float(c['start']));end=min(cutoff,float(c['end']))
    if start>=end:continue
    text=' '.join(f'<span id="word-{i}-{j}" class="word">'+(('<em>'+html.escape(w['text'])+'</em>') if w.get('emphasis') else html.escape(w['text']))+'</span>' for j,w in enumerate(c['words']))
    side=c.get('side','right')
    body+=f'<div id="cap{i}" class="clip caption {side}" data-start="{start}" data-duration="{end-start}" data-track-index="2"><div class="caption-inner"><div class="phrase">{text}</div></div></div>'
    for j,w in enumerate(c['words']):
        wt=max(start,float(w.get('start',start)))
        tweens.append(f"tl.from('#word-{i}-{j}',{{opacity:0,y:20,scale:.985,duration:.14,ease:'power3.out'}},{wt});")
    tweens.append(f"tl.to('#cap{i}',{{opacity:0,duration:.065,ease:'power2.in'}},{max(start,end-.065)});tl.set('#cap{i}',{{opacity:0}},{end});")
script="window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});"+''.join(tweens)+"window.__timelines['comp5']=tl;"
(p/'index.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Comp 5 — Reference Captions and Camera</title><script src="assets/gsap.min.js"></script><style>{css}</style></head><body><div id="root" data-composition-id="comp5" data-width="3840" data-height="2160" data-fps="30000/1001" data-start="0" data-duration="{length:.9f}">{body}</div><script>{script}</script></body></html>')
print('Built',len(caps),'caption groups; cutoff',cutoff,'duration',length)
