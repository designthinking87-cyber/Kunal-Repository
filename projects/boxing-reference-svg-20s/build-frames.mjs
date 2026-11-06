import {readFile,writeFile,readdir} from 'node:fs/promises';
const files=(await readdir(new URL('./frames/',import.meta.url))).filter(x=>/^\d{4}\.svg$/.test(x)).sort();
if(files.length!==440)throw new Error(`Expected 440 source-timed SVG frames, found ${files.length}`);
const frames=[];for(const file of files){const svg=await readFile(new URL(`./frames/${file}`,import.meta.url),'utf8');if(/<image\b|data:image|<video\b/i.test(svg))throw new Error(`Raster embedding found: ${file}`);frames.push(svg.slice(svg.indexOf('>')+1,svg.lastIndexOf('</svg>')))}
await writeFile(new URL('./frame-data.js',import.meta.url),'window.SVG_FRAMES='+JSON.stringify(frames)+';');
console.log(`Built ${frames.length} vector frames at 22 fps (20 seconds).`);
