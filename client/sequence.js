/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import {refreshCommon} from './common.js';
import demoList from './demos';
import {zero} from 'helper';
import 'babel-polyfill';


async function main() {
    await refreshCommon();

    let features = demoList.reduce(
        (arr, demo) => {
            if (demo.features) {
                arr = arr.concat(demo.features);
            }

            return arr;
        },
        []
    );

    await zero(features);

    for (let i = 0; i < demoList.length; i++) {
        await run(demoList[i]);
        window.result(demoList[i].name);
        // console.log(demoList[i].name + ' finish');
    }
}

async function run({name, scope, features, main, error}) {
    try {
        await main();
    }
    catch (e) {
        if (error) {
            await error(e);
        }
    }
}

main();

