// ModernShop Service Worker
// Provides offline functionality, caching, and performance optimization

const CACHE_NAME = 'modernshop-v1.0.0';
const STATIC_CACHE = 'modernshop-static-v1';
const DYNAMIC_CACHE = 'modernshop-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Files to cache as needed
const DYNAMIC_FILES = [
    '/images/'
];

// Network first strategy for these routes
const NETWORK_FIRST_ROUTES = [
    '/api/',
    '/products.json'
];

// Cache first strategy for these routes
const CACHE_FIRST_ROUTES = [
    '/css/',
    '/js/',
    '/images/',
    'https://cdnjs.cloudflare.com'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    event.respondWith(
        handleFetch(request)
    );
});

// Handle fetch requests with appropriate strategy
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Network first for API calls and dynamic content
        if (shouldUseNetworkFirst(request)) {
            return await networkFirst(request);
        }
        
        // Cache first for static assets
        if (shouldUseCacheFirst(request)) {
            return await cacheFirst(request);
        }
        
        // Default: Stale while revalidate
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch error', error);
        return await handleFetchError(request);
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Cache first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        throw error;
    }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then((cache) => cache.put(request, networkResponse.clone()));
        }
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Handle fetch errors
async function handleFetchError(request) {
    const url = new URL(request.url);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
        
        // Create a simple offline response
        return new Response(
            createOfflineHTML(),
            {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
    
    // Return a fallback response
    return new Response(
        JSON.stringify({ error: 'Network error', offline: true }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

// Determine if request should use network first strategy
function shouldUseNetworkFirst(request) {
    const url = new URL(request.url);
    return NETWORK_FIRST_ROUTES.some(route => url.pathname.startsWith(route));
}

// Determine if request should use cache first strategy
function shouldUseCacheFirst(request) {
    const url = new URL(request.url);
    return CACHE_FIRST_ROUTES.some(route => 
        url.pathname.startsWith(route) || url.origin.includes(route)
    );
}

// Create offline HTML page
function createOfflineHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ModernShop - Offline</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }
        
        .offline-container {
            max-width: 500px;
        }
        
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 2rem;
            opacity: 0.8;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 300;
        }
        
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .features {
            margin-top: 3rem;
            text-align: left;
        }
        
        .feature {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        
        .feature-icon {
            margin-right: 1rem;
            font-size: 1.2rem;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Offline</h1>
        <p>Don't worry! You can still browse cached content and your shopping cart is saved locally.</p>
        
        <button class="retry-btn" onclick="window.location.reload()">
            Try Again
        </button>
        
        <div class="features">
            <div class="feature">
                <span class="feature-icon">🛒</span>
                <span>Your cart items are saved</span>
            </div>
            <div class="feature">
                <span class="feature-icon">⚡</span>
                <span>Cached pages load instantly</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🔄</span>
                <span>Automatic sync when online</span>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

// Handle background sync
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }
    
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

// Sync cart data when online
async function syncCart() {
    try {
        // This would typically sync with your backend
        console.log('Service Worker: Syncing cart data');
        
        // Get cart data from IndexedDB or localStorage
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CART_SYNC_SUCCESS'
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Cart sync failed', error);
    }
}

// Sync orders when online
async function syncOrders() {
    try {
        console.log('Service Worker: Syncing order data');
        
        // Sync pending orders with backend
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'ORDERS_SYNC_SUCCESS'
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Orders sync failed', error);
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from ModernShop',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 'notification-' + Date.now()
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ModernShop', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ size });
        });
    }
});

// Get cache size for monitoring
async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

// Cleanup old caches periodically
self.addEventListener('activate', (event) => {
    const maxCacheAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(async (cacheName) => {
                    if (cacheName.includes('dynamic')) {
                        const cache = await caches.open(cacheName);
                        const requests = await cache.keys();
                        
                        return Promise.all(
                            requests.map(async (request) => {
                                const response = await cache.match(request);
                                if (response) {
                                    const dateHeader = response.headers.get('date');
                                    if (dateHeader) {
                                        const cacheDate = new Date(dateHeader);
                                        if (Date.now() - cacheDate.getTime() > maxCacheAge) {
                                            return cache.delete(request);
                                        }
                                    }
                                }
                            })
                        );
                    }
                })
            );
        })
    );
});

console.log('Service Worker: Script loaded successfully');
