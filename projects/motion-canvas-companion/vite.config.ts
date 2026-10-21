import {defineConfig,Plugin} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import fs from 'node:fs/promises';
import path from 'node:path';
// Keep application settings inside this project, which is writable in cloud environments.
function localSettings():Plugin{const id='\0virtual:settings.meta',file=path.resolve('.motion-canvas/settings.json');return{name:'motion-canvas:local-settings',resolveId(v){if(v==='virtual:settings.meta')return id},async load(v){if(v===id){try{return await fs.readFile(file,'utf8')}catch{return '{}'}}},configureServer(server){server.ws.on('motion-canvas:meta',async({source,data},client)=>{if(source!==id)return;await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(data,null,2));client.send('motion-canvas:meta-ack',{source})})}}}
export default defineConfig({plugins:[...motionCanvas({project:['./src/project.ts','./src/narrated.ts'],output:'./output'}).filter(p=>p.name!=='motion-canvas:settings'),localSettings()],server:{host:'127.0.0.1',port:8780,strictPort:true}});
