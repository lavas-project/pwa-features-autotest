/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, zero, register, unregister, sleep, grade, checkProperties, showCaseName} from 'helper';
import {log} from 'log';

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
    showCaseName('fetch');

    await init(SCOPE);
    await zero(CHECK_LIST);

    log('fetch: start');

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

    console.log('fetch: start to fetch');

    let response = await fetch('/whoareyou.json');
    if (response.ok) {
        let data = await response.json();
        if (data && data.im === 'fetch-sw') {
            await Promise.all([
                await grade('fetch', 1),
                await grade('Response', 1)
            ]);
            log('fetch: get response', data);
        }
    }

    await unregister(reg);
    log('fetch: test finish');

    if (parent) {
        log('refresh score');
        parent.result('fetch');
    }
}

main();
