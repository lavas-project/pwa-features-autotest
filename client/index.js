/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import './index.styl';
import axios from 'axios';
import {featureStore, uaStore, uuidStore} from 'store';
import {sleep, uaParse, uuid} from 'helper';
import {featureKeys, uaKeys} from './featureList.js';
const caseList = process.env.CASE_ENTRY_LIST;
// console.log('!!!!!!!!caseList', caseList);

let summary = {
    info: {},
    feature: {}
};

let totalTestNum = 0;
let totalTestDone = 0;
let totalTestScore = 0;
const totalScore = document.querySelector('.score-wrapper .total-score');
const totalSchedule = document.querySelector('.score-wrapper .title span');
const sendDataBtn = document.querySelector('.send-data');

window.result = function (caseName) {
    let list = featureKeys[caseName.toLowerCase()];
    const caseIdShow = '.schedule #' + caseName.toLowerCase() + '-show';
    const casePart = document.querySelector(caseIdShow);
    casePart.classList.add('finished');
    refreshFeatureScore(list);
};

// sendDataBtnBind
sendDataBtnBind();

// ua
uaProcess();

// init page table
initFeatureScore();

// test case
// caseList.forEach(test);
[
    '/cases/lifecycle/index.html',
    '/cases/cache/index.html',
    '/cases/fetch/index.html',
    '/cases/getregistration/index.html',
    '/cases/indexeddb/index.html',
    // ,
    '/cases/notification/index.html',
    '/cases/postmessage/index.html',
    '/cases/push/index.html',
    '/cases/sync/index.html'
].forEach(item => test(item));

function test(src) {
    var iframe = document.createElement('iframe');
    iframe.src = src;
    document.body.appendChild(iframe);
}

function initFeatureScore() {
    let tbody = [];
    let schedule = [];
    for(let key in featureKeys) {
        let mid = featureKeys[key].map(item => {
            summary.feature[item] = 0;
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
        totalTestNum += featureKeys[key].length;

        tbody = tbody.concat(mid);
    }
    document.querySelector('.schedule .all-case').innerHTML = schedule.join('');
    document.getElementsByTagName('tbody')[0].innerHTML = tbody.join('');
}

function refreshFeatureScore(list) {
    list = list || [];
    list.forEach(async item => {
        let score = await featureStore.getItem(item);
        totalTestScore += score;
        summary.feature[item] = score;
        // console.log('++++++++++++', item, score, totalTestScore);
        let idClass = '#' + item.toLowerCase().replace(/\./g, '-') + ' .score'
        document.querySelector(idClass).innerHTML = score;
        totalTestDone ++;
        totalSchedule.innerHTML = parseInt(totalTestDone / totalTestNum * 100, 10) + ' %';
        totalScore.innerHTML = parseInt(totalTestScore / totalTestNum * 100, 10);
        if (totalTestNum === totalTestDone) {
            sendDataBtn.classList.remove('hide');
        }
    });
}

function uaProcess() {
    uaParse();
    uaKeys.forEach(async item => {
        summary.info[item] = await uaStore.getItem(item);
    });
}

function sendDataBtnBind() {

    sendDataBtn.addEventListener('click', async function (e) {
        let sendDataConfirm = confirm('send data to the database ?');

        if (sendDataConfirm) {
            console.log('!!!!!!!!!0', summary);
            // send uuid
            // let id = await uuidStore.getItem('id');
            // console.log('!!!!!!!!!00', id);
            // if (!id) {
            //     id = uuid();
            //     await uuidStore.setItem('id', id);
            // }
            // console.log('!!!!!!!!!1', id);
            // send ua

            let res = await axios({
                method: 'post',
                url: 'https://lavas.baidu.com/api/ready/statistic',
                data: {
                    // id,
                    info: summary.info,
                    feature: summary.feature
                }
            });

            let sendTip = document.querySelector('.send-data-tip');
            if (res && res.data && res.data.status === 0) {
                sendTip.innerHTML = 'Success!';
                sendTip.classList.remove('hide-tip');
                sendTip.classList.add('show-tip');
                setTimeout(function () {
                    sendTip.classList.remove('show-tip');
                    sendTip.classList.add('hide-tip');
                }, 3000);
            }
            else {
                sendTip.innerHTML = 'Failed!';
                sendTip.classList.remove('hide-tip');
                sendTip.classList.add('show-tip');
                setTimeout(function () {
                    sendTip.classList.remove('show-tip');
                    sendTip.classList.add('hide-tip');
                }, 3000);
            }
        }
    });

}

