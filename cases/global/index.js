/**
 * @file global test
 * @author clark-t (clarktanglei@163.com)
 */

// setTimeout(function () {
//     parent
//     && parent.result
//     && typeof parent.result === 'function'
//     && parent.result('global', 'haha')
//     || console.log('global hehe...');
// }, 5000);

// console.log('in global');
import {createStep, sleep} from 'helper';

async function main() {
    const step = createStep({name: 'cases-global'});
    console.log('step 1:');
    await step(sleep.bind(null, 3000));
    console.log('step 2:');
    await step(sleep.bind(null, 2000));
    console.log('step 3:');
    await step(sleep.bind(null, 4000));
    console.log('step number:');
    console.log(step.getTargetStep());
    console.log('execute done:');
    step.done();
    console.log(step.getTargetStep());
    console.log('finish!');
}


main();