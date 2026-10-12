const C='swipefit-v13',F=['./','index.html','style.css','data.js','kin.js','app.js','img/body-m.webp','img/body-m-dim.webp','img/body-f.webp','img/body-f-dim.webp','CREDITS.md','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('periodicsync',e=>{if(e.tag==='sf-remind')e.waitUntil(self.registration.showNotification('SwipeFit 🔥',{body:'Swipe tomorrow\'s workout 😴',icon:'icon-192.png'}))});
self.addEventListener('push',e=>{const d=e.data?e.data.text():'Time to swipe! 🔥';e.waitUntil(self.registration.showNotification('SwipeFit',{body:d,icon:'icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./#train'))});
