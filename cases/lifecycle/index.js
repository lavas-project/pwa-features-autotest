/**
 * @file service worker lifecycle test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, one, sleep, register, grade} from 'helper';
// import {featureStore} from 'store';

const CHECK_LIST = [
    'navigator.serviceWorker',
    'navigator.serviceWorker.ready',
    'navigator.serviceWorker.oncontrollerchange',
];

const SCOPE = '/cases/lifecycle/';

async function main() {
    await init(SCOPE);

    testReady();
    testOnControllerChange();
    testClientsClaim();
    // const step = createStep({name: 'lifecycle'});

    // await step.beforeRun(init);


    // console.log('start to register sw-1!');
    // navigator.serviceWorker.addEventListener('controllerchange', e => {
    //     console.log('controller change!');
    // });
    console.log('register sw-1!');

    let reg1 = await register(SCOPE + 'sw-1.js', SCOPE);
    console.log('sw-1 registered!');

    console.log('sleep for 5s');
    await sleep(5000);

    console.log('register sw-2!');

    let reg2 = await register(SCOPE + 'sw-2.js', SCOPE);
    console.log('sw-2 registered!');

    await sleep(3000);
    // let reg = await navigator.serviceWorker.register('/cases/lifecycle/sw-1.js', {scope: SCOPE});
    // console.log('Registered!');
    // await sleep(5000);
    // console.log('start to register sw-2!');

    // console.log('register sw-2!');
    // let reg2 = await navigator.serviceWorker.register('/cases/lifecycle/sw-2.js', {scope: SCOPE});
    // console.log('Registered2!');
    // await sleep(5000);
    // let unreg = await reg2.unregister();
    // console.log('unregister:' + unreg);
}

function testReady() {
    if (navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(() => {
            console.log('sw is ready!');
        });
    }
}

function testOnControllerChange() {
    let score = 0;

    navigator.serviceWorker.oncontrollerchange = e => {
        console.log('oncontrollerchange');
        score += 0.5;
        grade('oncontrollerchange', Math.min(score, 1));

        // if (score === 1) {
        //     let url = getScriptURL(navigator.serviceWorker.controller);
        //     if (url && /sw-2\.js$/.test(url)) {

        //     }
        // }
    };
}

function testClientsClaim() {
    one(navigator.serviceWorker, 'controllerchange', e => {
        console.log('clients.claim success!');
        grade('clients.claim', 1);
    });
}

// function test

// function getScriptURL(controller) {
//     return controller && controller.scriptURL;
// }

main();