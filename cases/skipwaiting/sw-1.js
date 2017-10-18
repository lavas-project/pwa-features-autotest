/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {isFunction} from 'utils';
import {sleep} from 'helper';
import {log} from 'log';

self.addEventListener('install', e => {
    log('in sw1: install 0');
    log('add something 0');

    // e.waitUntil(
    //     sleep(10000).then(() => log('in sw1: install wait for 10s'))
    // );

    // if (isFunction(self.skipWaiting)) {
    //     log('in sw1: has skipWaiting');
    //     self.skipWaiting()
    //     .then(() => {
    //         log('in sw1: skipWaiting!');
    //     });
    // }
    // else {
    //     log('in sw1: no skipWaiting');
    // }
});

self.addEventListener('activate', e => {
    log('in sw1: activate 0');
    e.waitUntil(
        sleep(15000).then(() => log('in sw1: activate wait for 15s'))
    );
});

self.addEventListener('fetch', e => {

});
