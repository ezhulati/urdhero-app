// Service Worker for Urdhëro PWA
const CACHE_NAME = 'urdhero-v1.0.0';
const STATIC_CACHE_NAME = 'urdhero-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'urdhero-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.includes(url.pathname)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
    // API requests - network first with cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?)$/)) {
    // Other assets - cache first
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    // HTML pages - network first for freshness
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {
          // Ignore network errors for background updates
        });
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network error', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOfflineOrders());
  }
});

// Sync offline orders when connection is restored
async function syncOfflineOrders() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const offlineOrders = await cache.match('/offline-orders');
    
    if (offlineOrders) {
      const orders = await offlineOrders.json();
      
      for (const order of orders) {
        try {
          // Attempt to submit the order
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
          });
          
          if (response.ok) {
            console.log('Offline order synced successfully:', order.id);
            
            // Show notification to user
            self.registration.showNotification('Order Submitted', {
              body: `Your offline order #${order.orderNumber} has been submitted successfully!`,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: `order-${order.orderNumber}`,
              data: {
                orderNumber: order.orderNumber,
                url: `/order/${order.orderNumber}`
              }
            });
          }
        } catch (error) {
          console.error('Failed to sync offline order:', error);
        }
      }
      
      // Clear offline orders after sync attempt
      await cache.delete('/offline-orders');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    const { title, body, icon, badge, tag, data: notificationData } = data;
    
    const options = {
      body,
      icon: icon || '/pwa-192x192.png',
      badge: badge || '/pwa-192x192.png',
      tag: tag || 'urdhero-notification',
      data: notificationData,
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const { action, notification } = event;
  const { data } = notification;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Default action or 'view' action
  if (data && data.url) {
    event.waitUntil(
      clients.openWindow(data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ORDER_OFFLINE') {
    // Cache order for offline sync
    cacheOfflineOrder(event.data.order);
  }
});

// Cache order for offline submission
async function cacheOfflineOrder(order) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const existingOrders = await cache.match('/offline-orders');
    
    let orders = [];
    if (existingOrders) {
      orders = await existingOrders.json();
    }
    
    orders.push({
      ...order,
      cachedAt: new Date().toISOString()
    });
    
    await cache.put('/offline-orders', new Response(JSON.stringify(orders)));
    
    // Register for background sync
    await self.registration.sync.register('order-sync');
    
    console.log('Order cached for offline sync:', order.orderNumber);
  } catch (error) {
    console.error('Failed to cache offline order:', error);
  }
}