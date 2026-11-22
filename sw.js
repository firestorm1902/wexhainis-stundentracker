// Bei jeder Änderung der App hier VERSION und in index.html APP_VERSION hochzählen
const VERSION = '1.4.1';
const C = 'stundentracker-' + VERSION;
const HOSTS = ['www.gstatic.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const SHELL = ['./', './index.html', './manifest.webmanifest?v=1.3.5', './icon.svg?v=4', './icon-192.png?v=4', './icon-512.png?v=4', './maskable-192.png?v=4', './maskable-512.png?v=4', './apple-touch-icon.png?v=4', './favicon-32.png?v=4'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
// Netzwerk zuerst, bei fehlender Verbindung aus dem Zwischenspeicher.
// Datenbank- und Anmelde-Aufrufe (googleapis.com) gehen nie durch den Zwischenspeicher.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !HOSTS.includes(u.hostname))) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
