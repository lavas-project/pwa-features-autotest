/**
 * @file sw-1.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep, grade} from 'helper';
import {isFunction} from 'utils';
import {log} from 'log';

self.addEventListener('install', e => {
    log('lifecycle sw-1: oninstall');
});

self.addEventListener('activate', e => {
    log('lifecycle sw-1: onactivate');
});

testSkipWaiting();
testClientsClaim();
testInstallWaitUntil();
testActivateWaitUntil();

function testSkipWaiting() {
    log('lifecycle sw-1: skipWaiting test');

    let score = 0;

    self.addEventListener('install', e => {
        self.skipWaiting().then(() => {
            log('lifecycle sw-1: skipWaiting called');
            score = 0.5;
        });
    });

    self.addEventListener('activate', e => {
        if (score === 0.5) {
            grade('skipWaiting', 1);
            log('lifecycle sw-1: skipWaiting success');
        }
        else {
            log('lifecycle sw-1: skipWaiting fail');
        }
    });
}

function testClientsClaim() {
    log('lifecycle sw-1: clients.claim test');

    self.addEventListener('activate', e => {
        self.clients.claim().then(() => {
            log('lifecycle sw-1: clients.claim called');
        })
    });
}

function testInstallWaitUntil() {
    log('lifecycle sw-1: installEvent.waitUntil test');

    let score = 0;

    self.addEventListener('install', e => {
        e.waitUntil(
            sleep(1000)
            .then(() => {
                score = 0.5;
                log('lifecycle sw-1: installEvent.waitUntil wait for 1s');
            })
        );
    });

    self.addEventListener('activate', e => {
        if (score === 0.5) {
            grade('installEvent.waitUntil', 1);
            log('lifecycle sw-1: installEvent.waitUntil success');
        }
        else {
            log('lifecycle sw-1: installEvent.waitUntil fail');
        }
    });
}

function testActivateWaitUntil() {
    log('lifecycle sw-1: activateEvent.waitUntil test');
    let score = 0;

    self.addEventListener('activate', e => {
        e.waitUntil(sleep(1000).then(() => {
            score = 0.5;
            log('lifecycle sw-1: activateEvent.waitUntil wait for 1s');
            log('lifecycle sw-1: current state is', self.registration.active.state);
        }));

        self.registration.active.onstatechange = () => {
            let state = self.registration.active.state;
            log('lifecycle sw-1: active state change to', state);
            if (state === 'activated' && score === 0.5) {
                grade('activateEvent.waitUntil', 1);
                log('lifecycle sw-1: activateEvent.waitUntil success');
            }
            else {
                log('lifecycle sw-1: activateEvent.waitUntil fail');
            }
        };
    });
}
