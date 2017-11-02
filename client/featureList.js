/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

export const featureKeys = {
    lifecycle: [
        'lifecycle',
        'navigator.serviceWorker',
        'navigator.serviceWorker.ready',
        'oncontrollerchange',
        'onstatechange',
        'Registered',
        'Unregistered',
        'clients.claim',
        'self.skipWaiting',
        'installEvent',
        'activateEvent',
        'installEvent.waitUntil',
        'activateEvent.waitUntil'
    ],
    fetch: [
        'Promise',
        'fetch',
        'Request',
        'Response',
        'Headers',
        'fetchEvent',
        'fetchEvent.request',
        'fetchEvent.respondWith'
    ],
    indexeddb: [
        'indexedDB',
        'indexedDB.getAll'
    ],
    cache: [
        'Cache',
        'caches',
        'caches.open',
        'caches.has',
        'caches.keys',
        'caches.match',
        'caches.delete',
        'cache.add',
        'cache.addAll',
        'cache.delete',
        'cache.keys',
        'cache.match',
        'cache.matchAll',
        'cache.put'
    ],
    sync: [
        'syncEvent'
    ],
    postmessage: [
        'postMessage',
        'clients.matchAll',
        'sw-msg-send',
        'sw-msg-got',
        'main-msg-send',
        'main-msg-got'
    ],
    getregistration: [
        'navigator.serviceWorker.getRegistration',
        'navigator.serviceWorker.getRegistrations'
    ],
    notification: [
        'Notification',
        'notification.requestPermission',
        'showNotification',
        'getNotification'
    ],
    push: [
        'pushManager.subscribe',
        'pushManager.getSubscription',
        'pushManager.permissionState',
        'pushSubscription.unsubscribe'
    ]
};

export const uaKeys = ['browser', 'os', 'device', 'ua'];
