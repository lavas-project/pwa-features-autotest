/**
 * @file sw-2.js
 * @author clark-t (clarktanglei@163.com)
 */

// import {sleep} from 'helper';
import {log} from 'log';

// import {isFunction} from 'utils';

self.addEventListener('install', e => {
    log('lifecycle sw-2: oninstall');

    self.skipWaiting().then(() => {
        log('lifecycle sw-2: skipWaiting called');
    });
});

self.addEventListener('activate', async e => {
    log('lifecycle sw-2: onactivate');
    self.clients.claim().then(() => {
        log('lifecycle sw-2: clients.claim called');
    });
});

