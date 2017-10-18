/**
 * @file service worker lifecycle test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, createStep, one, sleep, register} from 'helper';
import {featureStore} from 'store';

export const SCOPE = '/cases/lifecycle/';

async function main() {
    await init(SCOPE);
    // const step = createStep({name: 'lifecycle'});

    // await step.beforeRun(init);


    // console.log('start to register sw-1!');
    // navigator.serviceWorker.addEventListener('controllerchange', e => {
    //     console.log('controller change!');
    // });
    // console.log('register sw-1!');

    let reg = await navigator.serviceWorker.register('/cases/lifecycle/sw-1.js', {scope: SCOPE});
    console.log('Registered!');
    await sleep(5000);
    console.log('start to register sw-2!');

    console.log('register sw-2!');
    let reg2 = await navigator.serviceWorker.register('/cases/lifecycle/sw-2.js', {scope: SCOPE});
    console.log('Registered2!');
    await sleep(5000);
    let unreg = await reg2.unregister();
    console.log('unregister:' + unreg);
}

function testReady() {
    if (navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(() => {
            console.log('sw is ready!');
        });
    }
}

function testOnControllerChange() {
    let num = 0;

    navigator.serviceWorker.oncontrollerchange = e => {
        num += 0.5;
        featureStore.setItem('oncontrollerchange', num);
    };
}

main();