/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import {refreshCommon} from './common.js';
const caseList = process.env.CASE_ENTRY_LIST;

refreshCommon();

// test case
// caseList.forEach(test);

[
    '/cases/lifecycle/index.html',
    '/cases/sync/index.html',
    '/cases/cache/index.html',
    '/cases/fetch/index.html',
    '/cases/getregistration/index.html',
    '/cases/indexeddb/index.html',
    '/cases/notification/index.html',
    '/cases/postmessage/index.html',
    '/cases/push/index.html'
].forEach(item => test(item));

function test(src) {
    let iframe = document.createElement('iframe');
    iframe.src = src;
    document.body.appendChild(iframe);
}
