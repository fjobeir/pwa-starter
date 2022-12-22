var CACHE_NAME = 'mycache-3'

self.addEventListener('install', function(event) {
    console.log('Installing Service Worker')
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll([
                '/',
                'offline.html',
                'index.html',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
                'assets/css/common.css',
                'assets/css/index.css',
                'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/plugin/relativeTime.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
                'assets/js/common.js',
                'assets/js/index.js',
                'assets/images/logo.svg',
            ])
        })
    )
})


self.addEventListener('activate', function(event) {
    console.log('Activating Service Worker')
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    self.clients.claim()
})


self.addEventListener('fetch', function(event) {
    console.log('Detected a request', event.request)
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // cache first strategy
                console.log('Found in cache: ', event.request.url)
                return response
            } else {
                return fetch(event.request).then((response) => {
                    // fron network (we have internet)
                    //'https://www.ferasjobeir.com/api/posts?page=1'
                    return caches.open(CACHE_NAME).then(function(cache) {
                        // adding dynamic cache
                        cache.put(event.request, response.clone())
                        return response
                    })
                }).catch((error) => {
                    // failed to load from cache and failed to access the network
                    return caches.open(CACHE_NAME).then(cache => {
                        return cache.match('offline.html')
                    })
                })
            }
        })
    )
})