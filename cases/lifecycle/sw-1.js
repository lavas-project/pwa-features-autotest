/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep} from 'helper';
import {isFunction} from 'utils';

self.addEventListener('install', e => {
    console.log('in sw1: install');
    if (e.waitUntil) {
        e.waitUntil(
            sleep(1000)
            .then(() => {
                console.log('in sw1: install wait until after 1s');
            })
        );
    }

    if (isFunction(self.skipWaiting)) {
        console.log('in sw1: has skipWaiting');
        self.skipWaiting()
        .then(() => {
            console.log('in sw1: skipWaiting!');
        });
    }
    else {
        console.log('in sw1: no skipWaiting');
    }
});

self.addEventListener('activate', async e => {
    console.log('in sw1: activate');
    e.waitUntil(
        sleep(1000)
        .then(() => {
            console.log('in sw1: activate wait until after 1s');
        })
    )

    sleep(2000).then(async () => {
        if (isFunction(self.clients.claim)) {
            console.log('in sw1: has clients.cliam');
            await self.clients.claim();
            console.log('in sw1: after claim');
        }
        else {
            console.log('in sw1: no clients claim');
        }
    });
});

