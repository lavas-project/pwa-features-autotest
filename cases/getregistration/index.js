/**
 * @file test register/unregister
 * @author clark-t (clarktanglei@163.com)
 */

import {init, sleep, zero, grade, register, unregister} from 'helper';
import {featureStore} from 'store';
import {log} from 'log';

export const CHECK_LIST = [
    'navigator.serviceWorker.getRegistration',
    'navigator.serviceWorker.getRegistrations'
];

const SCOPE = '/cases/getregistration/';
const SUB_SCOPE_1 = '/cases/getregistration/sw-1/';
const SUB_SCOPE_2 = '/cases/getregistration/sw-2/';

const SCOPE_LIST = [SCOPE, SUB_SCOPE_1, SUB_SCOPE_2];

async function main() {

    await init(SCOPE_LIST);
    await zero(CHECK_LIST);

    let regs = await Promise.all([
        register(SCOPE + 'sw.js', SCOPE),
        register(SUB_SCOPE_1 + 'sw.js', SUB_SCOPE_1),
        register(SUB_SCOPE_2 + 'sw.js', SUB_SCOPE_2)
    ]);

    await Promise.all([
        testGetRegistration(),
        testGetRegistrations()
    ]);

    await unregister(regs);
}

async function testGetRegistration() {
    if (navigator.serviceWorker.getRegistration) {
        let [reg, subReg] = await Promise.all([
            navigator.serviceWorker.getRegistration(),
            navigator.serviceWorker.getRegistration(SUB_SCOPE_1)
        ]);

        let num = (reg ? 0.5 : 0) + (subReg ? 0.5 : 0);
        grade('navigator.serviceWorker.getRegistration', num);

        log('getRegistration with params:', subReg);
        log('getRegistration with no params:', reg);
    }
    else {
        log('unsupport getRegistration');
    }
}

const SCOPE_LIST_REGEXP = SCOPE_LIST.map(scope => new RegExp(scope + '$'));

async function testGetRegistrations() {
    if (navigator.serviceWorker.getRegistrations) {
        let regs = await navigator.serviceWorker.getRegistrations();

        if (
            Array.isArray(regs)
            && regs.length >= 3
            && SCOPE_LIST_REGEXP.every(regex => regs.some(reg => regex.test(reg.scope)))
        ) {
            await grade('navigator.serviceWorker.getRegistrations', 1);
            log('getRegistrations:', regs);
        }
        else {
            log('unexpect return from getRegistrations');
        }
    }
    else {
        log('unsupport getRegistrations');
    }
}

main();
