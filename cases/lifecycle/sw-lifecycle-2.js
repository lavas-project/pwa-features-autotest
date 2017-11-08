self.skipWaiting();

self.addEventListener('activate', e => {
    self.clients.claim();
});
