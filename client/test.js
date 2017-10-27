import caseList from './cases';
import {zero} from 'helper';

async function main() {
    let features = caseList.reduce(
        (arr, app) => {
            if (app.features) {
                arr = arr.concat(app.features);
            }

            return arr;
        },
        []
    );

    await zero(features);

    for (let i = 0; i < caseList.length; i++) {
        await run(caseList[i]);
        console.log(caseList[i].name + ' finish');
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