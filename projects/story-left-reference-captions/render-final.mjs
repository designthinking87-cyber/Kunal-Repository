import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const root=path.dirname(fileURLToPath(import.meta.url));
const raw=path.join(root,'renders','hyperframes-visual.mp4');
const final=path.join(root,'renders','My-File-reference-style-captions.mp4');
fs.mkdirSync(path.dirname(raw),{recursive:true});
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{cwd:root,stdio:'inherit',env:process.env});if(r.status!==0)process.exit(r.status||1)};
run(process.platform==='win32'?'npx.cmd':'npx',['--yes','hyperframes@0.8.181','render','--output',raw,'--fps','30000/1001','--quality','high','--workers','2']);
// Preserve the exact original AAC stream, avoiding any voice normalization/re-encode.
run('ffmpeg',['-y','-i',raw,'-i',path.join(root,'source.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-map_metadata','-1','-movflags','+faststart',final]);
console.log(`Finished: ${final}`);
