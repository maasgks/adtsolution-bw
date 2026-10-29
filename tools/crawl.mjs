import fs from 'fs'; import path from 'path';
const ORIGIN='https://www.adtsolution.com'; const OUT=process.argv[2];
fs.mkdirSync(OUT,{recursive:true});
const seen=new Set(['/']); const queue=['/']; const pages={};
const assetRe=/\.(css|js|png|jpe?g|webp|svg|gif|ico|woff2?|ttf|mp4|pdf|xml|json|txt)(\?|$)/i;
function norm(h){
  h=h.replace(/&amp;/g,'&');
  if(h.startsWith(ORIGIN)) h=h.slice(ORIGIN.length)||'/';
  if(!h.startsWith('/')||h.startsWith('//')) return null;
  h=h.split('#')[0].split('?')[0]; if(!h) return null;
  if(assetRe.test(h)||h.startsWith('/cdn-cgi')) return null;
  if(h.length>1&&h.endsWith('/')) h=h.slice(0,-1);
  return h;
}
while(queue.length){
  const batch=queue.splice(0,10);
  await Promise.all(batch.map(async p=>{
    for(let a=0;a<3;a++){try{
      const r=await fetch(ORIGIN+encodeURI(p),{headers:{'User-Agent':'Mozilla/5.0'}});
      const t=await r.text(); pages[p]={status:r.status,final:r.url.replace(ORIGIN,'')};
      if(r.status===200){const f=path.join(OUT,(p==='/'?'index':p.slice(1).replace(/[^a-zA-Z0-9\/\-_.]/g,'_'))+'.html');
        fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,t);}
      for(const m of t.matchAll(/href=["']([^"'#][^"']*)["']/g)){const n=norm(m[1]); if(n&&!seen.has(n)){seen.add(n);queue.push(n);}}
      return;
    }catch(e){pages[p]={err:e.message}}}
  }));
}
fs.writeFileSync(path.join(OUT,'..','pages-index.json'),JSON.stringify(pages,null,1));
const ok=Object.values(pages).filter(v=>v.status===200).length;
console.log('total',Object.keys(pages).length,'ok',ok);
