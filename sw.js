// Service Worker for offline support
const CACHE_NAME = 'microcycle-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // Continue even if some assets fail
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const clonedResponse = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request).then((response) => {
          return response || new Response('Offline - resource not available', { status: 503 });
        });
      })
  );
});
