const CACHE = 'ppl-v2';
const PRECACHE = ['./workout-tracker.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Pass GitHub API requests through — never cache them
  if(url.hostname === 'api.github.com') return;
  // Network-first for the HTML so updates are picked up immediately
  if(url.pathname.endsWith('.html')) {
    e.respondWith(
      // no-cache: revalidate with the server instead of using GitHub Pages' 10-min HTTP cache
      // (URL string, not e.request — navigate requests can't be re-wrapped with options)
      fetch(e.request.url, { cache: 'no-cache' }).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for everything else (fonts, svg, etc.)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
