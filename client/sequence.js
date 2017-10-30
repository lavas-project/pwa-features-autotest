/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import {refreshCommon} from './common.js';
import demoList from './demos';
import {zero, init, createStep} from 'helper';
import {log} from 'log';
import {featureStore} from 'store';
import 'babel-polyfill';

async function main() {
    let step = createStep('main');

    await step(init, false);

    refreshCommon();

    await step(async () => {
        let features = demoList.reduce(
            (arr, demo) => {
                arr = arr.concat(demo.features || []);
                return arr;
            },
            []
        );

        await zero(features);
    }, false);

    for (let i = 0; i < demoList.length; i++) {
        await step(async () => {
            await run(demoList[i]);
        });

        window.result(demoList[i].name);
    }

    step.done();
}

async function run({name, scope, features, main, error}) {
    try {
        await main();
    }
    catch (e) {
        log('main-error', e);

        if (error) {
            await error(e);
        }
    }
}

main();

