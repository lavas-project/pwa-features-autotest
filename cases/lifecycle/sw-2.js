/**
 * @file sw-2.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep} from 'helper';
import {isFunction} from 'utils';

self.addEventListener('install', e => {
    console.log('in sw2: install');
    if (e.waitUntil) {
        e.waitUntil(
            sleep(1000)
            .then(() => {
                console.log('in sw2: install wait until after 1s');
            })
        );
    }

    if (isFunction(self.skipWaiting)) {
        console.log('in sw2: has skipWaiting');
        self.skipWaiting()
        .then(() => {
            console.log('in sw2: skipWaiting!');
        });
    }
    else {
        console.log('in sw2: no skipWaiting');
    }
});

self.addEventListener('install', e => {
    console.log('in sw2: install2');
    if (e.waitUntil) {
        e.waitUntil(
            sleep(2000)
            .then(() => {
                console.log('in sw2: install wait until after 2s');
            })
        );
    }
});

self.addEventListener('activate', async e => {
    console.log('in sw2: activate');
    e.waitUntil(
        sleep(1000)
        .then(() => {
            console.log('in sw1: activate wait until after 1s');
        })
    )

    sleep(500).then(async () => {
        if (isFunction(self.clients.claim)) {
            console.log('in sw2: has clients.cliam');
            await self.clients.claim();
            console.log('in sw2: after claim');
        }
        else {
            console.log('in sw2: no clients claim');
        }
    });
});

