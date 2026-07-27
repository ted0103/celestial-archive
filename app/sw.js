const RELEASE_ID='source-20260727-2',CACHE='celestial-archive-shell-'+RELEASE_ID;
const SHELL=['./','./index.html','./styles.css','./data.js','./logic.js','./app.js','./assets/audio/celestial-ambient.mp3','./manifest.webmanifest'];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{if(event.data?.type==='RELEASE_ID')event.source?.postMessage({type:'RELEASE_ID',releaseId:RELEASE_ID});});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));
});
