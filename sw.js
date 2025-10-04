// Service Worker for caching and performance optimization
/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals, no-console */

const STATIC_CACHE = 'ngc-static-v1';
const DYNAMIC_CACHE = 'ngc-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/styles/styles.css',
  '/scripts/aem.js',
  '/scripts/scripts.js',
  '/scripts/performance.js',
  '/fonts/Geist-Regular.woff2',
  '/fonts/Geist-Bold.woff2',
];

// Function definitions (moved to top to avoid hoisting issues)
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Image request failed:', error);
    return new Response('', { status: 404 });
  }
}

async function handleAssetRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Asset request failed:', error);
    return caches.match(request);
  }
}

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Navigation request failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('/');
  }
}

async function handleOtherRequests(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          const cache = caches.open(DYNAMIC_CACHE);
          cache.then((c) => c.put(request, networkResponse));
        }
      }).catch(() => {
        // Network failed, but we have cache
      });
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Request failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

async function doBackgroundSync() {
  console.log('Background sync triggered');
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          }).filter(Boolean)
        ))
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(handleAssetRequest(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.url,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
