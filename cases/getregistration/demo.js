/**
 * @file indexeddb index.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep, grade, register, unregister} from 'helper';
import {log} from 'log';

export const CHECK_LIST = [
    'navigator.serviceWorker.getRegistration',
    'navigator.serviceWorker.getRegistrations'
];

export default function (scope) {
    const SCOPE = scope;
    const SUB_SCOPE_1 = scope + 'sub-getregistration-1/';
    const SUB_SCOPE_2 = scope + 'sub-getregistration-2/';

    const SCOPE_LIST = [SCOPE, SUB_SCOPE_1, SUB_SCOPE_2];

    async function testGetRegistration() {
        log('getregistration: getRegistration test');

        if (navigator.serviceWorker.getRegistration) {
            let [reg, subReg] = await Promise.all([
                navigator.serviceWorker.getRegistration(),
                navigator.serviceWorker.getRegistration(SUB_SCOPE_1)
            ]);

            let num = (reg ? 0.5 : 0) + (subReg ? 0.5 : 0);
            grade('navigator.serviceWorker.getRegistration', num);

            log('getregistration: getRegistration with params:', subReg);
            log('getregistration: getRegistration with no params:', reg);
        }
        else {
            log('getregistration: getRegistration unsupport');
        }
    }

    const SCOPE_LIST_REGEXP = SCOPE_LIST.map(scope => new RegExp(scope + '$'));

    async function testGetRegistrations() {
        log('getregistration: getRegistrations test');

        if (navigator.serviceWorker.getRegistrations) {
            let regs = await navigator.serviceWorker.getRegistrations();

            if (
                Array.isArray(regs)
                && regs.length >= 3
                && SCOPE_LIST_REGEXP.every(regex => regs.some(reg => regex.test(reg.scope)))
            ) {
                await grade('navigator.serviceWorker.getRegistrations', 1);
                log('getregistration: getRegistrations', regs);
            }
            else {
                log('getregistration: getRegistrations return a unexpect value', regs);
            }
        }
        else {
            log('getregistration: getRegistrations unsupport');
        }
    }

    return {
        name: 'getregistration',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('getregistration: start');
            log('getregistration: register several sw');

            let regs = await Promise.all([
                register(SCOPE + 'sw-getregistration.js', SCOPE),
                register(SUB_SCOPE_1 + 'sw.js', SUB_SCOPE_1),
                register(SUB_SCOPE_2 + 'sw.js', SUB_SCOPE_2)
            ]);

            log('getregistration: sw registered');

            await Promise.all([
                testGetRegistration(),
                testGetRegistrations()
            ]);

            await sleep(3000);

            await unregister(regs);
            log('getregistration: test finish');
        }
    };
}
