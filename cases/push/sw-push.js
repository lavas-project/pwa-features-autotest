/**
 * @file sw-push
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

self.addEventListener('push', async function (event) {
    console.log('Push event');

    event.waitUntil(self.registration.showNotification('Push', {
        body: 'push event done.',
        icon: 'https://avatars2.githubusercontent.com/u/29660949?s=200&v=4'
    }));

    await featureStore.setItem('pushEvent', 1);
    console.log('- pushEvent done -', 1);
});


