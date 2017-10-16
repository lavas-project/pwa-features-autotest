/**
 * @file test register/unregister
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep} from 'helper';

async function main() {
    if (!navigator.serviceWorker) {
        return;
    }

    const sw = await navigator.serviceWorker.register(
        '/cases/register-unregister/sw.js',
        {scope: '/cases/register-unregister/'}
    );

    console.log('register!');
    console.log(sw);

    await sleep(3000);

    const result = await sw.unregister();
    console.log('unregister!');
}

main();