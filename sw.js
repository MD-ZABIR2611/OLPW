// OLPW:sw.js | script for sw
const CACHE = 'olpw-v3'; // bump version to force update
const CORE = [
  'index.html', 'manifest.json', 'olpw-site.css', 'olpw-site.js',
  'subjects.js', 'chapters.js', 'planner-core.js', 'planner.html',
  'chess.html', 'refreshment.html', 'tools.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  // For HTML navigation requests: network-first, don't cache HTML
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          // Don't cache HTML navigation responses - always fetch fresh
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('index.html')))
    );
    return;
  }
  
  // For static assets (CSS, JS, images, etc.): cache-first
  if (e.request.destination === 'style' || 
      e.request.destination === 'script' || 
      e.request.destination === 'image' ||
      e.request.destination === 'font' ||
      e.request.destination === 'manifest') {
    e.respondWith(
      caches.match(e.request).then(cached => 
        cached || fetch(e.request).then(resp => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return resp;
        }).catch(() => cached)
      )
    );
    return;
  }
  
  // For other requests: network-first
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
