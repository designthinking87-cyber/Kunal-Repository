from pathlib import Path
import json,html
p=Path(__file__).parent
fps=30000/1001
T=lambda s,f=0:s+f/fps
# Lines: text, px size, highlight treatment, language.
groups=[
(T(0,7),T(2,8), [('हरे कृष्णा',108,True,'hi'),("What’s Up!",110,False,'en')]),
(T(2,8),T(3,26), [('Everyone',112,True,'en'),('कैसे हैं आप सब?',72,False,'hi')]),
(T(3,26),T(4,18), [('बचपन',150,True,'hi'),('में',66,False,'hi')]),
(T(4,18),T(5,21), [('हम लोगों को',70,False,'hi'),('कहानियाँ',142,True,'hi')]),
(T(5,21),T(7,19), [('बहुत पसंद',113,True,'hi'),('हुआ करती थीं',70,False,'hi')]),
(T(7,19),T(8,19), [('और काफी',76,False,'hi'),('अपनी',123,True,'hi')]),
(T(8,19),T(9,19), [('दादी नानी',127,True,'hi'),('से हम लोग',65,False,'hi')]),
(T(9,19),T(11,15), [('कहानी',145,True,'hi'),('सुना करते थे।',74,False,'hi')]),
(T(11,15),T(13,3), [('तो मैं',75,False,'hi'),('आज',152,True,'hi')]),
(T(13,3),T(14,2), [('एक छोटी सी',75,False,'hi'),('कहानी',145,True,'hi')]),
(T(14,2),15.548867, [('आपको',108,True,'hi'),('सुनाना चाहता हूँ।',70,False,'hi')]),
]
(p/'transcript.json').write_text(json.dumps([{'start':a,'end':b,'lines':[l[0] for l in lines]} for a,b,lines in groups],ensure_ascii=False,indent=2))
css='''@font-face{font-family:ReferenceInter;src:url(inter.ttf);font-weight:100 900} @font-face{font-family:HindiReference;src:url(hindi-variable.ttf);font-weight:100 900}*{box-sizing:border-box;margin:0}html,body{width:1920px;height:1080px;overflow:hidden;background:#100d0e}#root{position:relative;width:1920px;height:1080px;overflow:hidden}video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.caption{position:absolute;inset:0;z-index:2;pointer-events:none}.stack{width:100%;height:100%;padding:235px 1070px 235px 190px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0}.line{flex:0 0 auto;max-width:100%;white-space:nowrap;text-align:center;font-family:HindiReference,sans-serif;font-weight:850;letter-spacing:-.008em;line-height:1.24;color:#fbfbfb;text-shadow:0 2px 1px #100d0e55,0 7px 8px #100d0e90,0 17px 22px #100d0e70;transform-origin:50% 60%;padding:2px 12px 4px}.en{font-family:ReferenceInter,sans-serif;letter-spacing:-.045em;line-height:1.07;font-weight:900;font-optical-sizing:none;font-variation-settings:'opsz' 32}.hero{font-weight:900;letter-spacing:-.018em;background:radial-gradient(ellipse at 65% 19%,#99bed7 0%,#99bed700 31%),radial-gradient(ellipse at 13% 94%,#bfbad3 0%,#bfbad300 50%),linear-gradient(132deg,#edeaf7 0%,#dedce9 32%,#fafafa 62%,#d4d4df 100%);background-clip:text;-webkit-background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 1px 0 #ffffff40) drop-shadow(0 2px 0 #100d0e65) drop-shadow(0 8px 7px #100d0e85) drop-shadow(0 17px 18px #100d0e65)}.hero.en{letter-spacing:-.065em}'''
body=[];js=[]
for i,(a,b,lines) in enumerate(groups):
    linehtml=''.join(f'<div id="line-{i}-{j}" class="line {"hero" if hero else ""} {lang}" lang="{lang}" style="font-size:{size}px">{html.escape(txt)}</div>' for j,(txt,size,hero,lang) in enumerate(lines))
    body.append(f'<div id="cg{i}" class="caption clip" data-start="{a:.8f}" data-duration="{b-a:.8f}" data-track-index="2"><div class="stack">{linehtml}</div></div>')
    for j in range(len(lines)):
        ease=['power3.out','power2.out','sine.out'][(i+j)%3]
        js.append(f"tl.from('#line-{i}-{j}',{{opacity:0,y:14,scale:.973,duration:.16,ease:'{ease}'}},{a+j*.08:.8f});")
    if i<len(groups)-1:
        js.append(f"tl.to('#cg{i}',{{opacity:0,duration:.085,ease:'power2.in'}},{b-.085:.8f});tl.set('#cg{i}',{{opacity:0}},{b:.8f});")
(p/'index.html').write_text(f'''<!doctype html><html lang="hi"><head><meta charset="utf-8"><title>Story — Reference Style Captions</title><script src="gsap.min.js"></script><style>{css}</style></head><body><div id="root" data-composition-id="story-left" data-start="0" data-duration="15.548867" data-fps="30000/1001" data-width="1920" data-height="1080"><video id="footage" class="clip" src="source.mp4" data-start="0" data-duration="15.548867" data-track-index="0" muted playsinline></video><audio id="voice" src="source.mp4" data-start="0" data-duration="15.548867" data-track-index="1" data-volume="1"></audio>{''.join(body)}</div><script>window.__timelines=window.__timelines||{{}};const tl=gsap.timeline({{paused:true}});{''.join(js)}window.__timelines['story-left']=tl;</script></body></html>''')
