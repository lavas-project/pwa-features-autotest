/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep, grade} from 'helper';
import {isFunction} from 'utils';

self.addEventListener('install', e => {
    console.log('in sw-1 install');
});

self.addEventListener('activate', e => {
    console.log('in sw-1 activate');
});

testSkipWaiting();
testClientsClaim();
testInstallWaitUntil();
testActivateWaitUntil();

function testSkipWaiting() {
    let score = 0;

    self.addEventListener('install', e => {
        self.skipWaiting().then(() => {
            console.log('skipWaiting!');
            score = 0.5;
        });
    });

    self.addEventListener('activate', e => {
        if (score === 0.5) {
            grade('skipWaiting', 1);
        }
    });
}

function testClientsClaim() {
    self.addEventListener('activate', e => {
        self.clients.claim().then(() => {
            console.log('claim!');
        })
    });
}

function testInstallWaitUntil() {
    let score = 0;

    self.addEventListener('install', e => {
        e.waitUntil(
            sleep(1000)
            .then(() => {
                console.log('sw-1 install wait 1s!');
                score = 0.5;
            })
        );
    });

    self.addEventListener('activate', e => {
        if (score === 0.5) {
            grade('installEvent.waitUntil', 1);
        }
    });
}

function testActivateWaitUntil() {
    self.addEventListener('activate', e => {
        e.waitUntil(sleep(1000).then(() => {
            console.log('sw-1 activate wait 1s!');
            console.log(self.registration.active.state)
        }));

        self.registration.active.onstatechange = () => {
            console.log('sw-1 installing state change')
            console.log(event)
            console.log(self.registration.waiting)
            console.log(self.registration.active)
        };
    });
}
