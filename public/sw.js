const CACHE_NAME = "dinner-credits-cache-v4"; // bump this when you ship big changes

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-192-dark.png",
  "/icon-512-dark.png"
];

// Install: pre-cache core assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches and notify clients to reload
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );

      // Take control of existing clients
      await self.clients.claim();

      // Tell all open windows there's a new version
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.postMessage({ type: "NEW_VERSION" });
      }
    })()
  );
});

// Fetch strategy:
// - For navigations (opening the app), try network first, fall back to cache
//   => ensures new index.html after deploy
// - For static assets, cache-first
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Let cross-origin / non-GET requests pass through
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // For navigation (PWA opening / refreshing), use network-first
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await caches.match(req);
          return cached || caches.match("/");
        }
      })()
    );
    return;
  }

  // For everything else (icons, CSS, etc.), cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
