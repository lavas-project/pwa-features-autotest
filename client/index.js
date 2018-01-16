/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import {refreshCommon} from './common.js';
const files = require.context('../cases', true, /index\.js$/);

const caseList = files.keys()
    .map(key => key.slice(1).replace(/js$/, 'html'))
    .map(key => process.env.ROUTE_PREFIX + '/cases' + key);

refreshCommon();

// test case
caseList.forEach(test);

// [
//     '/cases/lifecycle/index.html',
//     '/cases/sync/index.html',
//     '/cases/cache/index.html',
//     '/cases/fetch/index.html',
//     '/cases/getregistration/index.html',
//     '/cases/indexeddb/index.html',
//     '/cases/notification/index.html',
//     '/cases/postmessage/index.html',
//     '/cases/push/index.html'
// ].forEach(item => test(item));

function test(src) {
    let iframe = document.createElement('iframe');
    iframe.src = src;
    document.body.appendChild(iframe);
}
