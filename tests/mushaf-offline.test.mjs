import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const listeners = {};
const storage = new Map();
const caches = {open:async name=>{
  if(!storage.has(name)) storage.set(name,new Map());
  const entries=storage.get(name);
  const key=request=>typeof request==='string'?request:request.url;
  return {match:async request=>entries.get(key(request))?.clone(),put:async(request,response)=>entries.set(key(request),response.clone())};
}};
let network=0;
let offline=false;
const fetch=async()=>{network++;if(offline)throw Error('offline');return new Response('network');};
vm.runInNewContext(fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),{self:{location:{origin:'https://example.test'},addEventListener:(name,fn)=>listeners[name]=fn},caches,fetch,URL,Response});
async function request(path,mode='cors') {
 let result;
 listeners.fetch({request:{url:'https://example.test'+path,method:'GET',mode},respondWith:p=>result=p});
 return result;
}
const scans=await caches.open('nurulquran-indopak-downloads-v1');
await scans.put('/api/indopak-mushaf/1',new Response('original scan'));
offline=true;
assert.equal(await (await request('/api/indopak-mushaf/1?retry=4')).text(),'original scan');
assert.equal(network,0,'downloaded scans work without network, ignoring retry query');
await assert.rejects(request('/api/indopak-mushaf/2'));
assert.equal(await request('/api/auth/user'),undefined,'never intercept private API data');
assert.equal(await request('/prayer-times','navigate'),undefined,'never serve stale prayer navigation');
const shell=await caches.open('nurulquran-mushaf-shell-v1');
await shell.put('/mushaf',new Response('<html>saved reader</html>'));
assert.equal(await (await request('/mushaf?page=1','navigate')).text(),'<html>saved reader</html>');
offline=false;
await request('/_next/static/test.js');
offline=true;
assert.equal(await (await request('/_next/static/test.js')).text(),'network','cached reader JS remains available offline');
console.log('PASS: offline scan, shell and static assets; missing downloads fail honestly; private routes excluded.');
