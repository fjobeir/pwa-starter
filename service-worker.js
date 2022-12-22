self.addEventListener('install', function(event) {
    console.log('Installing Service Worker')
    event.waitUntil(
        caches.open('mycache').then((cache) => {
            cache.addAll([
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
})

self.addEventListener('fetch', function(event) {
    console.log('Detected a request', event.request)
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response
            } else {
                return fetch(event.request).then((response) => {
                    return response
                })
            }
        })
    )
})