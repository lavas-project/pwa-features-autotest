/**
 * @file sw-notification
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

self.addEventListener('notificationclick', async function (event) {

    await grade('notificationclick', 1);
    log('- notificationclick done -', 1);
    event.notification.close();
});

