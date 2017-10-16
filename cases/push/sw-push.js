/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';

self.oninstall = function (event) {
    self.skipWaiting();
};

self.onactivate = function () {
    if (self.clients && self.clients.claim) {
        self.clients.claim();
    }
};

self.addEventListener('push', function (event) {
    event.waitUntil(self.registration.showNotification('Hmmm, how lucky you are', {
        body: 'Yay it works.',
        icon: 'https://p5.ssl.qhimg.com/t01245986c32f09718d.png'
    }));
    featureStore.setItem('pushEvent', 1);
});


self.addEventListener('notificationclick', function (event) {

    event.notification.close();
    event.waitUntil(
        self.clients.openWindow('https://ispwaready.toxicjohann.com')
    );
});

