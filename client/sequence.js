/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */
import 'babel-polyfill';
import {refreshCommon} from './common';
import {zero, init, createStep} from 'helper';
import {log} from 'log';
import {featureKeys} from './feature-list';

const files = require.context('../cases', true, /sequence\.js$/);
const caseList = Object.keys(featureKeys).map(key => files('./' + key.toLowerCase() + '/sequence.js'));



async function main() {
    let step = createStep({name: 'main'});

    await step(init, false);

    refreshCommon();

    await step(async () => {
        let features = caseList.reduce((arr, demo) => [...arr, ...(demo.features || [])], []);
        await zero(features);
    }, false);

    for (let i = 0; i < caseList.length; i++) {
        await step(async () => {
            if (parent && parent.schedulePerCase) {
                parent.schedulePerCase({
                    caseName: caseList[i].name || ''
                });
            }
            await run(caseList[i]);
        });


        window.result(caseList[i].name);
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

