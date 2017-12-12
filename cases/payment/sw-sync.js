/**
 * @file sw-payment
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
    // self.clients.claim();
});

self.addEventListener('sync', function (event) {
    grade('syncEvent', 1);
    log('- syncEvent test -', 1);
});

