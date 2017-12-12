/**
 * @file sw-push
 * @author ruoran (liuruoran@baidu.com)
 */

import {grade} from 'helper';
import {log} from 'log';

self.addEventListener('install', function (event) {
    log('Install event');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    log('Activate event');
});

self.addEventListener('push', async function (event) {
    log('Push event');

    event.waitUntil(self.registration.showNotification('Push', {
        body: 'push event done.',
        icon: 'https://avatars2.githubusercontent.com/u/29660949?s=200&v=4'
    }));

    await grade('pushEvent', 1);
    log('- pushEvent done -', 1);
});


