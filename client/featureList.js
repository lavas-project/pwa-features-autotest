/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

export const featureKeys = {
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
    sync: [
        'syncEvent'
    ],
    lifecycle: [
        'navigator.serviceWorker',
        'navigator.serviceWorker.ready',
        'oncontrollerchange',
        'onstatechange',
        'Registered',
        'Unregistered',
        'clients.claim',
        'skipWaiting',
        'installEvent.waitUntil',
        'activateEvent.waitUntil'
    ],
    cache: [
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
        // 'cache.matchAll',
        'cache.put'
    ],
    getregistration: [
        'navigator.serviceWorker.getRegistration',
        'navigator.serviceWorker.getRegistrations'
    ],
    indexeddb: [
        'indexedDB',
        'indexedDB.getAll'
    ],
    notification: [
        'notification',
        // 'notification.requestPermission',
        'showNotification',
        'getNotification'
    ],
    push: [
        'pushManager.subscribe',
        'pushManager.getSubscription',
        'pushManager.permissionState',
        'pushSubscription.unsubscribe'
    ],
    postmessage: [
        'sw-msg-send',
        'sw-msg-got',
        'main-msg-send',
        'main-msg-got'
    ]
};

export const uaKeys = ['browser', 'os', 'system', 'ua'];


