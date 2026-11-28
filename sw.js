/* Service Worker: hält die App offline startbar.
   Firestore selbst puffert Buchungen eigenständig (IndexedDB). */
const VERSION = 'strichliste-v2.15.0';
const FB = 'https://www.gstatic.com/firebasejs/13.4.0/';
const CORE = [
  './',
  './index.html',
  './index_min.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/sc-scan.png',
  './icons/sc-konto.png',
  './icons/sc-req.png',
  './icons/sc-msg.png',
  './icons/sc-admin.png',
  './sounds/bier-1.mp3',
  './sounds/bier-2.mp3',
  './sounds/bier-3.mp3',
  './sounds/bier-4.mp3',
  './sounds/wein-1.mp3',
  './sounds/wein-2.mp3',
  './sounds/wein-3.mp3',
  './sounds/wein-4.mp3',
  './sounds/wein-5.mp3',
  './sounds/soft-1.mp3',
  './sounds/soft-2.mp3',
  './sounds/wasser-1.mp3',
  './sounds/wasser-2.mp3',
  FB + 'firebase-app.js',
  FB + 'firebase-auth.js',
  FB + 'firebase-firestore.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => Promise.all(CORE.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn = ['www.gstatic.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname);
  // Datenbank- und Anmelde-Anfragen nie anfassen
  if (!sameOrigin && !cdn) return;

  // Seite selbst: erst Netz (für Updates), sonst Cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
        // App-Verknüpfungen wie ./?scan=1 offline ebenfalls auf die gecachte Seite
    );
    return;
  }

  // Skripte: aus dem Cache, im Hintergrund aktualisieren
  event.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});

// Benachrichtigung antippen: App nach vorne holen und an die passende Stelle springen
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const go = (event.notification.data && event.notification.data.go) || '';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const c = list.find(x => x.url.startsWith(self.registration.scope));
    if (c) { if (go) c.postMessage({ go }); return c.focus(); }
    const map = { admin: 'admin', myreq: 'req', mymsg: 'msg' };
    return self.clients.openWindow('./' + (map[go] ? '?go=' + map[go] : ''));
  }));
});
