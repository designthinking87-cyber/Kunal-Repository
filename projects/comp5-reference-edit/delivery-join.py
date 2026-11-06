import hashlib,json
from pathlib import Path
p=Path(__file__).parent/'delivery'
m=json.loads((p/'manifest.json').read_text())
out=p/m['file']
with out.open('wb') as f:
 for part in m['parts']:
  data=(p/part['file']).read_bytes()
  assert hashlib.sha256(data).hexdigest()==part['sha256'],f"Damaged download: {part['file']}"
  f.write(data)
assert hashlib.sha256(out.read_bytes()).hexdigest()==m['sha256']
print('Verified full 4K video:',out)
