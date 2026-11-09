// App shell offline; cards and uploads always go to the network (the page keeps its own copy of cards).
const SHELL='review-v2',FILES=['./','index.html','manifest.webmanifest','icon.svg','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // Network first so an updated app reaches phones; cache when offline.
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(SHELL).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
