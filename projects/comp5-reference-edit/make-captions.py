import json,re
from pathlib import Path
p=Path(__file__).parent
w=json.loads((p/'words.json').read_text())
# Exact written punctuation and spelling are retained from the supplied script.
tokens=(p/'script.txt').read_text().split()
assert len(tokens)==len(w),(len(tokens),len(w))
for a,b in zip(w,tokens):a['text']=b
ranges=[(0,2,[2]),(3,4,[4]),(5,5,[5]),(6,9,[9]),(10,11,[11]),(12,14,[14]),(15,17,[17]),(18,20,[19]),(21,21,[21]),(22,23,[23]),(24,26,[26]),(27,29,[28]),(30,30,[30]),(31,34,[32]),(35,37,[35]),(38,39,[39]),(40,43,[43]),(44,45,[45]),(46,48,[]),(49,50,[49]),(51,52,[52]),(53,56,[56]),(57,58,[58]),(59,61,[61]),(62,63,[63]),(64,68,[68]),(69,71,[71]),(72,75,[73]),(76,78,[76])]
caps=[]
fps=30000/1001
for i,(a,b,em) in enumerate(ranges):
    start=round(w[a]['start']*fps)/fps
    nxt=w[ranges[i+1][0]]['start'] if i+1<len(ranges) else 934/fps
    end=min(nxt,w[b]['end']+.28,934/fps)
    end=round(end*fps)/fps
    if i==len(ranges)-1:end=934/fps
    caps.append({'start':start,'end':end,'side':'left' if 15.07<=start<20.62 else 'right','words':[{'text':w[k]['text'],'start':max(start,round(w[k]['start']*fps)/fps),'emphasis':k in em} for k in range(a,b+1)]})
(p/'captions.json').write_text(json.dumps(caps,indent=2))
keys=[(0,1.035,0),(.98,1.12,-150),(3.04,1.18,-280),(3.89,1.055,0),(6.23,1.12,-170),(8.65,1.18,-290),(9.85,1.09,-100),(12.27,1.18,-280),(13.45,1.07,80),(15.2,1.15,230),(17.7,1.17,280),(20.62,1.07,0),(21.83,1.16,-250),(23.06,1.10,-150),(24.25,1.055,0),(26.81,1.14,-220),(29.71,1.18,-290),(934/fps,1,0)]
(p/'camera.json').write_text(json.dumps([{'time':t,'scale':s,'x':x,'y':round((s-1)*450,2)} for t,s,x in keys],indent=2))
