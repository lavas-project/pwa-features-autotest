/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';

self.addEventListener('install', function (event) {
    console.log('Install event');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Activate event');
});

self.addEventListener('push', function (event) {
    console.log('Push event');
    event.waitUntil(self.registration.showNotification('Hi', {
        body: 'push event works.',
        icon: 'https://avatars2.githubusercontent.com/u/29660949?s=200&v=4'
    }));
    featureStore.setItem('pushEvent', 1);
});


self.addEventListener('notificationclick', function (event) {
    console.log('NotificationClick event');
    event.notification.close();
    event.waitUntil(
        self.clients.openWindow('https://lavas.baidu.com/ready')
    );
});

