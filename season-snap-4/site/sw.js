const CACHE_NAME = "media-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("[Service Worker] Installed and pre-caching media...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch("/api/fetch/")
        .then((response) => response.json())
        .then((paths) => {
          const mediaUrls = paths.map(path => new URL(path, self.location.origin).href);
          console.log("[Service Worker] Pre-caching media:", mediaUrls);
          return cache.addAll(mediaUrls);
        })
        .catch((error) => {
          console.error("[Service Worker] Failed to fetch media list:", error);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image" || event.request.destination === "video") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch((error) => {
            console.error(`[Service Worker] Failed to fetch: ${event.request.url}`, error);
          });
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[Service Worker] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
});