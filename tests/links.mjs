import {readFile} from 'node:fs/promises';
import {projects} from '../modules/projects.js';

const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
const profile = await readFile(new URL('../modules/profile.js',import.meta.url),'utf8');
const urls = new Set([...html.matchAll(/<a\b[^>]*?href="(https:\/\/[^"]+)"/g)].map(match=>match[1]));
urls.add(profile.match(/linkedin: '([^']+)'/)[1]);
for (const project of projects) for (const url of Object.values(project.links)) urls.add(url);
await Promise.all([...urls].map(async url=>{
    try {
        const result = await fetch(url,{signal:AbortSignal.timeout(18000),headers:{'User-Agent':'PortfolioLinkCheck/1.0'}});
        await result.body?.cancel();
        console.log(result.status,url);
        if (!result.ok) process.exitCode=1;
    } catch (error) {console.log(error.cause?.code || error.name,url);process.exitCode=1;}
}));
