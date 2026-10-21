const fs=require('fs'),path=require('path'),http=require('http'),net=require('net'),{spawn,spawnSync}=require('child_process');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),chrome=process.env.CHROME_PATH||'/usr/bin/chromium';
function run(bin,args,env=process.env){const r=spawnSync(bin,args,{cwd:root,stdio:'inherit',env});if(r.status!==0)throw Error(`${bin} failed: ${r.status}`)}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
const vite=spawn(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port',String(port)],{cwd:root,stdio:'inherit'});let browser;
try{let ready=false;for(let i=0;i<100;i++){try{const r=await fetch(`http://127.0.0.1:${port}/capture.html`);if(r.ok){ready=true;break}}catch{}await wait(200)}if(!ready)throw Error('Vite did not start');
browser=await puppeteer.launch({executablePath:chrome,headless:true,protocolTimeout:600000,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const mode of ['standalone','narrated']){const page=await browser.newPage();page.on('pageerror',e=>console.error(e));await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});await page.goto(`http://127.0.0.1:${port}/capture.html?mode=${mode}`);await page.waitForFunction(()=>window.mcReady,{timeout:90000});await page.evaluate(()=>window.renderAll());await page.close();console.log('Native Motion Canvas export:',mode)}
await browser.close();browser=null;
fs.mkdirSync(path.join(root,'renders'),{recursive:true});
for(const mode of ['standalone','narrated']){const target=mode==='narrated'?'assembly/narrated-sequence.mp4':'renders/Karma-MotionCanvas-cinematic-15s.mp4';run('ffmpeg',['-y','-framerate','30','-i',`output/${mode}/%06d.png`,'-frames:v','450','-c:v','libx264','-crf','16','-preset','fast','-pix_fmt','yuv420p','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-movflags','+faststart',target])}
const env={...process.env,npm_config_cache:process.env.npm_config_cache||path.join(root,'.npm-cache'),XDG_CACHE_HOME:process.env.XDG_CACHE_HOME||path.join(root,'.cache'),HYPERFRAMES_BROWSER_PATH:chrome};
run('npx',['--yes','hyperframes@0.8.181','check','assembly'],env);
run('npx',['--yes','hyperframes@0.8.181','render','assembly','--output','renders/hyperframes-render.mp4','--quality','high','--fps','30','--workers','2'],env);
// Restore the original AAC stream after HyperFrames export, keeping the spoken message bit-for-bit.
run('ffmpeg',['-y','-i','renders/hyperframes-render.mp4','-i','assembly/source.mp4','-map','0:v:0','-map','1:a:0','-c','copy','-t','24.333333','-movflags','+faststart','renders/Karma-MotionCanvas-narrated-short.mp4']);
console.log('Complete. Video files are in renders/.');
}finally{if(browser)await browser.close();vite.kill('SIGTERM')}})().catch(e=>{console.error(e);process.exit(1)});
