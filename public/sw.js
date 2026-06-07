// Kill-switch service worker — replaces previous app SW so any browsers/previews
// that still have it installed will clean it up and stop serving stale code.
function isAppCache(name) {
  return /(^|-)precache-v\d+-|(^|-)runtime-|^zyra-|^workbox-/.test(name);
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      try {
        const names = await caches.keys();
        await Promise.allSettled(
          names.filter(isAppCache).map((n) => caches.delete(n))
        );
        await self.clients.claim();
        const clients = await self.clients.matchAll({ type: 'window' });
        await Promise.allSettled(clients.map((c) => c.navigate(c.url)));
      } finally {
        await self.registration.unregister();
      }
    })()
  )
);
