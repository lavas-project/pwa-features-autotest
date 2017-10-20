/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import './index.styl';
import {featureStore} from 'store';
import {sleep, uaParse} from 'helper';
import {featureKeys} from './featureList.js';
const caseList = process.env.CASE_ENTRY_LIST;

window.result = function (caseName) {
    let list = featureKeys[caseName.toLowerCase()];
    const caseIdShow = '.schedule #' + caseName.toLowerCase() + '-show';
    const casePart = document.querySelector(caseIdShow);
    casePart.className = 'case-part finished';
    // casePart.querySelector('.case-schedule').innerHTML = 'done';
    refreshFeatureScore(list);
};

// ua
uaParse();

// init page table
initFeatureScore(featureKeys);

// test case
caseList.forEach(test);

function test(src) {
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style = "width:40%;min-width:100px;height:100px;margin-bottom:20px;background:rgba(0,0,0,0.5);"
    document.body.appendChild(iframe);
}

function initFeatureScore(obj) {
    let tbody = [];
    let schedule = [];
    for(let key in obj) {
        let mid = obj[key].map(item => {
            return [
                '<tr id="' + item.toLowerCase().replace(/\./g, '-') + '">',
                '<td class="name">' + item + '</td>',
                '<td class="score">' + 0 + '</td>',
                '</tr>'
            ].join('');
        });

        schedule = schedule.concat([
            '<div id="' + key + '-show" class="case-part">',
            '<div class="case-name">' + key + '</div>',
            // '<div class="case-schedule"></div>',
            '</div>'
        ]);

        tbody = tbody.concat(mid);
    }
    document.querySelector('.schedule .all-case').innerHTML = schedule.join('');
    document.getElementsByTagName('tbody')[0].innerHTML = tbody.join('');
}

function refreshFeatureScore(list) {
    list = list || [];
    list.forEach(async item => {
        let score = await featureStore.getItem(item);
        console.log('++++++++++++', item, score);
        let idClass = '#' + item.toLowerCase().replace(/\./g, '-') + ' .score'
        document.querySelector(idClass).innerHTML = score;
    });
}
