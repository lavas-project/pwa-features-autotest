/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, zero, register, sleep, grade, checkProperties, createOnce} from 'helper';

const CHECK_LIST = [
    'fetch',
    'Request',
    'Response',
    'Headers',
    'fetchEvent',
    'fetchEvent.request',
    'fetchEvent.respondWith'
];
const SCOPE = '/cases/fetch/';

async function main() {
    let once = createOnce('cases-fetch');

    await once(async () => {
        await init(SCOPE);
    }, false);

    await once(async () => {
        await zero(CHECK_LIST);

        await checkProperties(window, {
            'fetch': 0.5,
            'Request': 1,
            'Response': 0.5,
            'Headers': 1
        });
    }, false);

    let reg = await register(SCOPE + 'sw.js', SCOPE);

    await once(async () => {
        await sleep(3000);
    });

    once.done();

    console.log('start to fetch');

    let response = await fetch('/whoareyou.json');
    if (response.ok) {
        let data = await response.json();
        if (data && data.im === 'fetch-sw') {
            await Promise.all([
                await grade('fetch', 1),
                await grade('Response', 1)
            ]);
            console.log('get response:', data);
        }
    }
}

main();