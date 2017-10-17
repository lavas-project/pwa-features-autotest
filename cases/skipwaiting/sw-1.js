/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {isFunction} from 'utils';
import {log} from 'log';

self.addEventListener('install', async e => {
    log('in sw1: install');
    if (isFunction(self.skipWaiting)) {
        log('in sw1: has skipWaiting');
        await self.skipWaiting();
        log('in sw1: skipWaiting!');
    }
    else {
        log('in sw1: no skipWaiting');
    }
});

self.addEventListener('activate', async e => {
    log('in sw1: activate');
});

