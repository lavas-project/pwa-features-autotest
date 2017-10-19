/**
 * @file sw-notification
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {log} from 'log';

self.addEventListener('install', function (event) {
    log('Install event');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    log('Activate event');
});

self.addEventListener('notificationclick', async function (event) {

    await featureStore.setItem('notificationclick', 1);
    log('- notificationclick done -', 1);
    event.notification.close();
});

