/**
 * @file service worker lifecycle test
 * @author clark-t (clarktanglei@163.com)
 */

import {init, one, sleep, register} from 'helper';
import {log} from 'log';

export const SCOPE = '/cases/skipwaiting/';

async function main() {
    // await init(SCOPE);

    log('start to register sw-1!');
    let reg1 = await register(SCOPE + 'sw-1.js', SCOPE);
    log('Registered sw-1:', reg1);
    // await sleep(5000);
    // log('start to register sw-2!');
    // let reg2 = await register(SCOPE + 'sw-2.js', SCOPE);
    // log('Registered sw-2:', reg2);
    // await sleep(5000);
    // log('skipWaiting finish!');
}

main();
