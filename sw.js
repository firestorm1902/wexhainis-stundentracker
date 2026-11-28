// Bei jeder Änderung der App hier VERSION und in index.html APP_VERSION hochzählen
const VERSION = '1.11.5';
const C = 'stundentracker-' + VERSION;
const HOSTS = ['www.gstatic.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const SHELL = ['./', './index.html', './manifest.webmanifest?v=1.3.6', './icon.svg?v=5', './icon-192.png?v=5', './icon-512.png?v=5', './maskable-192.png?v=5', './maskable-512.png?v=5', './apple-touch-icon.png?v=5', './favicon-32.png?v=5'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
// Sonst: Netzwerk zuerst, bei fehlender Verbindung aus dem Zwischenspeicher.
// Datenbank- und Anmelde-Aufrufe (googleapis.com) gehen nie durch den Zwischenspeicher.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !HOSTS.includes(u.hostname))) return;
  // Dateien mit Versionsnummer im Pfad oder ?v= ändern sich nie: direkt aus dem Zwischenspeicher (spart Netz beim Start)
  const fixed = /[?&]v=/.test(u.search) || u.hostname === 'www.gstatic.com' || u.hostname === 'cdnjs.cloudflare.com' || u.hostname === 'fonts.gstatic.com';
  if (fixed) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); }
      return r;
    })));
    return;
  }
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
