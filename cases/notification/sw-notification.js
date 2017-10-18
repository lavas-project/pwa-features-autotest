/**
 * @file sw-notification
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

self.addEventListener('notificationclick', async function (event) {

    await featureStore.setItem('notificationclick', 1);
    console.log('- notificationclick done -', 1);
    event.notification.close();
    if (self.clients.openWindow) {
        self.clients.openWindow('/');
    }
});

