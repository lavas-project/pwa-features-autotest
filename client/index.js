/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import './index.styl';
import {featureStore} from 'store';
import {sleep, uaParse} from 'helper';
import {featureKeys} from './featureList.js';
const caseList = process.env.CASE_ENTRY_LIST;

let totalTestNum = 0;
let totalTestDone = 0;
let totalTestScore = 0;
const totalScore = document.querySelector('.score-wrapper .total-score');
const totalSchedule = document.querySelector('.score-wrapper .title span');

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
        totalTestNum += obj[key].length;

        tbody = tbody.concat(mid);
    }
    document.querySelector('.schedule .all-case').innerHTML = schedule.join('');
    document.getElementsByTagName('tbody')[0].innerHTML = tbody.join('');
}

function refreshFeatureScore(list) {
    list = list || [];
    totalTestDone += list.length;
    console.log('++++++++++++', totalTestNum, totalTestDone, totalScore);
    totalSchedule.innerHTML = parseInt(totalTestDone / totalTestNum * 100, 10) + ' %';
    totalScore.innerHTML = parseInt(totalTestScore / totalTestNum * 100, 10);
    if (totalTestNum === totalTestDone) {
        document.querySelector('.score-wrapper .send-data').className = 'send-data';
        document.querySelector('.score-wrapper .test-again').className = 'test-again';
    }
    list.forEach(async item => {
        let score = await featureStore.getItem(item);
        totalTestScore += score;
        // console.log('++++++++++++', item, score);
        let idClass = '#' + item.toLowerCase().replace(/\./g, '-') + ' .score'
        document.querySelector(idClass).innerHTML = score;
    });
}
