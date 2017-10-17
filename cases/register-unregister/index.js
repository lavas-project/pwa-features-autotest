/**
 * @file test register/unregister
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep} from 'helper';

export const CHECK_LIST = [
    'navigator.serviceWorker',
    'navigator.serviceWorker.ready',
    'Registered',
    'Unregistered'
];

export const SCOPE = '/cases/register-unregister/';

async function main() {
    if (!navigator.serviceWorker) {
        return;
    }

    navigator.serviceWorker.ready.then(() => {
        console.log('sw is ready');
    });

    const sw = await navigator.serviceWorker.register(
        '/cases/register-unregister/sw.js',
        {scope: SCOPE}
    );

    console.log('register!');
    console.log(sw);
    console.log(await navigator.serviceWorker.getRegistration());

    await sleep(3000);

    const result = await sw.unregister();
    console.log('unregister!');
    console.log(result);

    console.log(await navigator.serviceWorker.getRegistration());
}

main();
