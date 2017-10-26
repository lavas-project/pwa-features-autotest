/**
 * @file base.js
 * @author clark-t (clarktanglei@163.com)
 */

import {init, zero, showCaseName} from 'helper';

export async function run({
    name,
    scope,
    features,
    main,
    error
}) {
    showCaseName(name);
    await init(scope);
    await zero(features);

    try {
        await main();
    }
    catch (e) {
        if (error) {
            await error(e);
        }
    }

    if (parent && parent.result) {
        parent.result(name);
    }
}
