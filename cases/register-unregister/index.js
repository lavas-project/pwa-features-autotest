/**
 * @file test register/unregister
 * @author clark-t (clarktanglei@163.com)
 */

import {init, sleep, zero, score} from 'helper';
import {featureStore} from 'store';
import {log} from 'log';

export const CHECK_LIST = [
    'navigator.serviceWorker.ready',
    'Registered',
    'Unregistered'
];

const SCOPE = '/cases/register-unregister/';

async function main() {
    await init();
    await zero(CHECK_LIST);

    if (navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(() => {
            featureStore.setItem('navigator.serviceWorker.ready', 1);
            log('sw is ready');
        });
    }
    else {
        log('unsupport navigator.serviceWorker.ready');
    }

    if (!navigator.serviceWorker.register) {
        log('unsupport navigator.serviceWorker.register');
        return;
    }

    const reg = await navigator.serviceWorker.register(SCOPE + 'sw.js', {scope: SCOPE});

    await score('Registered', 1);
    log('sw is registered:', reg);

    log('sleep for 3s...');
    await sleep(3000);

    const result = await reg.unregister();

    score('Unregistered', 1);
    log('sw is unregistered:', result);
}

main();
