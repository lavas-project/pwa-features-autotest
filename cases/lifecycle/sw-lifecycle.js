/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep, grade, one} from 'helper';
import {log} from 'log';

let installWaitingScore = 0;

self.addEventListener('install', e => {
    log('lifecycle sw-lifecycle: oninstall');
    grade('installEvent', 1);

    if (e.waitUntil) {
        e.waitUntil((async () => {
            await sleep(100);
            log('lifecycle sw-lifecycle: installEvent.waitUntil wait for 1s');
            await sleep(1000);

            installWaitingScore = 1;
            log('lifecycle sw-lifecycle: installEvent.waitUntil wait for 1s finished');

            await sleep(100);
        })());
    }

    log('lifecycle sw-lifecycle: skipWaiting');
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    log('lifecycle sw-lifecycle: onactivate');
    grade('self.skipWaiting', 1);
    grade('installEvent.waitUntil', installWaitingScore);
    grade('activateEvent', 1);

    if (e.waitUntil) {
        e.waitUntil((async () => {
            await sleep(100);
            log('lifecycle sw-lifecycle: activateEvent.waitUntil wait for 1s');
            await sleep(1000);
            grade('activateEvent.waitUntil', 0.5);
            log('lifecycle sw-lifecycle: activateEvent.waitUntil wait for 1s finished');
            await sleep(100);
        })());
    }

    log('lifecycle sw-lifecycle: clients.cliam');
    self.clients.claim();
});
