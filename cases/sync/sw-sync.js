/**
 * @file sw-sync
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

self.addEventListener('sync', function (event) {
    console.log('Sync event', event);
    featureStore.setItem('syncEvent', 1);
});

