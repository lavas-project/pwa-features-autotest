/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */

import {run} from 'base';
import {register, unregister, sleep, grade, checkProperties} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'Promise',
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
    log('fetch: start');

    const value = Number(!!(window.Promise));
    await grade('Promise', value);
    log('- Promise done -', value);


    /* eslint-disable fecs-camelcase */
    await checkProperties(window, {
        fetch: 0.5,
        Request: 1,
        Response: 0.5,
        Headers: 1
    });
    /* eslint-enable fecs-camelcase */
    log('fetch: register sw.js');

    let reg = await register(SCOPE + 'sw.js', SCOPE);

    log('fetch: registered');

    log('fetch: sleep 3s');

    await sleep(3000);

    log('fetch: start to fetch');

    let response = await fetch('/whoareyou.json');

    if (response && +response.status === 200) {
        let data = await response.json();
        log('fetch: get response', data);
        if (data && data.im === 'fetch-sw') {
            await Promise.all([
                await grade('fetch', 1),
                await grade('Response', 1)
            ]);
            log('fetch: full score');
        }
    }

    log('fetch: sleep 3s');

    await sleep(3000);

    await unregister(reg);

    log('fetch: test finish');
}

run({
    name: 'fetch',
    scope: SCOPE,
    features: CHECK_LIST,
    main: main
});

// main();
