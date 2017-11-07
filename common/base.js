/**
 * @file base.js
 * @author clark-t (clarktanglei@163.com)
 */

import {init, zero} from 'helper';

export async function run({name, scope, features, main, error}) {
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

function showCaseName(caseName) {
    let div = document.createElement('div');
    div.style
        = 'width:100%;height:20px;text-align:center;background:rgba(0,0,0,0.5);color:#fff;position:fixed;top:0;left:0';
    div.innerHTML = caseName;
    document.body.appendChild(div);
}
