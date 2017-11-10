/**
 * @file sw-payment
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
    // self.clients.claim();
});

self.addEventListener('sync', function (event) {
    featureStore.setItem('syncEvent', 1);
    log('- syncEvent test -', 1);
});

