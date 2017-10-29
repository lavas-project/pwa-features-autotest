/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import {refreshCommon} from './common.js';
import demoList from './demos';
import {zero, init} from 'helper';
import {log} from 'log';
import {featureStore} from 'store';
import 'babel-polyfill';

async function main() {
    try {
        let reg = await navigator.serviceWorker.getRegistration();
        if (reg && typeof reg === 'object') {
            await reg.unregister();
            await new Promise(() => {
                window.location.reload();
            })
        }
    }
    catch (e) {
        log('init error', e)
    }
    // await init();
    refreshCommon();

    let startIndex = 0;
    if (localStorage.getItem('step')) {
        startIndex = demoList.findIndex(item => {
            return item.name === localStorage.getItem('step');
        });
        startIndex = startIndex + 1;
    }
    else {

        let features = demoList.reduce(
            (arr, demo) => {
                if (demo.features) {
                    arr = arr.concat(demo.features);
                }

                return arr;
            },
            []
        );

        // await zero(features);
        features.map(async item => {
            await featureStore.setItem(item, 0);
        });
    }


    for (let j = 0; j < startIndex; j++) {
        window.result(demoList[j].name);
    }

    for (let i = startIndex; i < demoList.length; i++) {
        await run(demoList[i]);

        if (i < demoList.length - 1) {
            localStorage.setItem('step', demoList[i].name);
            location.reload();

        }
        else {
            localStorage.setItem('step', '');
            window.result(demoList[i].name);
        }

        // console.log(demoList[i].name + ' finish');
    }
}

async function run({name, scope, features, main, error}) {
    try {
        await main();
    }
    catch (e) {
        log('main-error', e);

        // if (error) {
        //     await error(e);
        // }
    }
}

main();

