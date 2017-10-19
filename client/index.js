/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import './index.styl';

const caseList = process.env.CASE_ENTRY_LIST;

window.result = function (testCase, score) {
    console.log(testCase + ' gets score:' + score);
};

function test(src) {
    var iframe = document.createElement('iframe');
    iframe.src = src;
    document.body.appendChild(iframe);
}


caseList.forEach(test);
