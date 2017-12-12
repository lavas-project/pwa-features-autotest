/**
 * @file sw-2.js
 * @author clark-t (clarktanglei@163.com)
 */

self.skipWaiting();

self.addEventListener('activate', e => {
    self.clients.claim();
});
