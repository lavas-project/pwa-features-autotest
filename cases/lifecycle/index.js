/**
 * @file service worker lifecycle test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, one, sleep, register, grade, zero, showCaseName} from 'helper';
import {log} from 'log';
// import {featureStore} from 'store';

const CHECK_LIST = [
    'navigator.serviceWorker',
    'navigator.serviceWorker.ready',
    'oncontrollerchange',
    'onstatechange',
    'Registered',
    'Unregistered',
    'clients.claim',
    'skipWaiting',
    'installEvent.waitUntil',
    'activateEvent.waitUntil'
];

const SCOPE = '/cases/lifecycle/';

async function main() {
    showCaseName('lifecycle');

    await init(SCOPE);
    await zero(CHECK_LIST);

    if (navigator.serviceWorker) {
        await grade('navigator.serviceWorker', 1);
        log('lifecycle: navigator.serviceWorker exist');
    }
    else {
        log('lifecycle: navigator.serviceWorker unsupport');
        return;
    }

    testReady();
    testOnControllerChange();
    testClientsClaim();

    log('lifecycle: register sw-1.js');

    let reg1 = await register(SCOPE + 'sw-1.js', SCOPE);

    log('lifecycle: sw-1.js registered', reg1);
    await grade('Registered', 1);

    log('lifecycle: sleep for 5s');
    await sleep(5000);

    log('lifecycle: register sw-2.js');
    let reg2 = await register(SCOPE + 'sw-2.js', SCOPE);
    log('lifecycle: sw-2.js registered', reg2);

    log('lifecycle: sleep for 5s');
    await sleep(5000);

    log('lifecycle: unregister sw-2.js');
    let result = await reg2.unregister();

    log('lifecycle: sw-2.js is unregistered', result);
    await grade('Unregistered', 1);

    log('lifecycle: test finished');

    if (parent && parent.result) {
        log('refresh score');
        parent.result('lifecycle');
    }
}

function testReady() {
    if (navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(() => {
            grade('navigator.serviceWorker.ready', 1);
            log('lifecycle: sw is ready');
        });
    }
}

function testOnControllerChange() {
    let score = 0;

    navigator.serviceWorker.oncontrollerchange = e => {
        score += 0.5;
        grade('oncontrollerchange', Math.min(score, 1));
        log('lifecycle: oncontrollerchange');
    };
}

function testClientsClaim() {
    one(navigator.serviceWorker, 'controllerchange', e => {
        grade('clients.claim', 1);
        log('lifecycle: clients.claim success');
    });
}

// function test

// function getScriptURL(controller) {
//     return controller && controller.scriptURL;
// }

main();