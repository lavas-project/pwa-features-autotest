/**
 * @file lifecycle-test
 * @author ruoran (liuruoran@baidu.com)
 */
import 'whatwg-fetch';
import {featureStore} from 'store';
import {one, sleep, register, grade, zero} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'lifecycle',
    'navigator.serviceWorker',
    'navigator.serviceWorker.ready',
    'oncontrollerchange',
    'onstatechange',
    'onupdatefound',
    'Registered',
    'Unregistered',
    'clients.claim',
    'self.skipWaiting',
    'installEvent',
    'activateEvent',
    'installEvent.waitUntil',
    'activateEvent.waitUntil'
];

export default function (scope) {
    return {
        name: 'lifecycle',
        scope: scope,
        features: CHECK_LIST,
        async main() {
            if (navigator.serviceWorker) {
                await grade('navigator.serviceWorker', 1);
                log('lifecycle: navigator.serviceWorker exist');
            }
            else {
                log('lifecycle: navigator.serviceWorker unsupport');
                return;
            }

            if (navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(() => {
                    grade('navigator.serviceWorker.ready', 1);
                    log('lifecycle: sw is ready');
                });
            }

            navigator.serviceWorker.addEventListener('controllerchange', e => {
                grade('clients.claim', 1);
                grade('oncontrollerchange', 1);
                log('lifecycle: oncontrollerchange');
            });

            log('lifecycle: register sw-lifecycle.js');

            let reg = await register(scope + 'sw-lifecycle.js', scope);

            reg.addEventListener('updatefound', e => {
                let worker = reg.installing;

                worker.addEventListener('statechange', async e => {
                    let state = worker.state;
                    log('lifecycle: statechange', state);

                    grade('onstatechange', 1);

                    if (state !== 'activated') {
                        return;
                    }

                    await sleep(100);

                    let score = await featureStore.getItem('activateEvent.waitUntil');
                    if (+score > 0) {
                        grade('activateEvent.waitUntil', 1);
                    }
                });

                grade('onupdatefound', 1);
            });

            log('lifecycle: sw-1.js registered', reg);
            await grade('Registered', 1);

            log('lifecycle: sleep for 3s');
            await sleep(3000);

            log('lifecycle: unregister sw-lifecycle.js');
            let result = await reg.unregister();

            log('lifecycle: sw-lifecycle.js is unregistered', result);
            await grade('Unregistered', 1);

            let scores = await Promise.all(
                CHECK_LIST.map(feature => featureStore.getItem(feature))
            );

            let lifecycleScore = (scores.reduce((a, b) => a + b, 0) / (CHECK_LIST.length - 1)).toFixed(2);
            await grade('lifecycle', Number(lifecycleScore));

            await sleep(2000);

            log('lifecycle: test finished');
        },
        error(e) {
            log('lifecycle: catch unhandled error');
            log(e);
        }
    };
}
