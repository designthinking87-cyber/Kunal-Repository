from pathlib import Path
import subprocess
p=Path(__file__).parent/'assets'/'comp5.mp4'
p.parent.mkdir(exist_ok=True)
subprocess.run(['curl','-L','--fail','--output',str(p),'https://www.dropbox.com/scl/fi/zy7qc0789i4lkki0w91j2/Comp-5.mp4?rlkey=q5os24dffdv3ufyzh0d39zvzf&dl=1'],check=True)
