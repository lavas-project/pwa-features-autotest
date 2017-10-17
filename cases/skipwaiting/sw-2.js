/**
 * @file sw-2.js
 * @author clark-t (clarktanglei@163.com)
 */

import {isFunction} from 'utils';
import {log} from 'log';

self.addEventListener('install', async e => {
    log('in sw2: install');
    if (isFunction(self.skipWaiting)) {
        log('in sw2: has skipWaiting');
        await self.skipWaiting();
        log('in sw2: skipWaiting!');
    }
    else {
        log('in sw2: no skipWaiting');
    }
});

self.addEventListener('activate', async e => {
    log('in sw2: activate');
});
