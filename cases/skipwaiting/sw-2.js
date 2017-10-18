/**
 * @file sw-2.js
 * @author clark-t (clarktanglei@163.com)
 */

import {isFunction} from 'utils';
import {sleep} from 'helper';
import {log} from 'log';

self.addEventListener('install', e => {
    log('in sw2: install');
    // e.waitUntil(
    //     sleep(10000).then(() => log('in sw2: wait for 10s'))
    // );
    // if (isFunction(self.skipWaiting)) {
    //     log('in sw2: has skipWaiting');
    //     self.skipWaiting()
    //     .then(() => {
    //         log('in sw2: skipWaiting!');
    //     });
    // }
    // else {
    //     log('in sw2: no skipWaiting');
    // }
});

self.addEventListener('activate', e => {
    log('in sw2: activate');
    e.waitUntil(
        sleep(10000).then(() => log('in sw2: activate wait for 10s'))
    );
});
