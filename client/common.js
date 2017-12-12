/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import './index.styl';
// import {log} from 'log';
import axios from 'axios';
import {featureStore, uaStore, uuidStore} from 'store';
import {uuid} from 'helper';
import {featureKeys, uaKeys} from './feature-list';
import UAParser from 'ua-parser-js';

let summary = {
    info: {},
    feature: {}
};
let id;
let totalTestNum = 0;
let totalTestDone = 0;
let totalTestScore = 0;
// let testNumPerCase = 0;
let testNumberDonePerCase = 0;
const totalScore = document.querySelector('.score-wrapper .total-score');
const totalSchedule = document.querySelector('.score-wrapper .title span');
const sendDataBtn = document.querySelector('.send-data');

window.result = function (caseName) {
    let list = featureKeys[caseName.toLowerCase()];
    const caseIdShow = '.schedule #' + caseName.toLowerCase() + '-show';
    const casePart = document.querySelector(caseIdShow);
    casePart.classList.remove('case-shake');
    casePart.classList.add('finished');
    refreshFeatureScore(list);
};

window.schedulePerCase = function ({caseName, feature, score}) {
    if (caseName) {
        // let list = featureKeys[caseName.toLowerCase()];
        // testNumPerCase = list.length;
        testNumberDonePerCase = 0;
        const caseIdShow = '.schedule #' + caseName.toLowerCase() + '-show';
        const casePart = document.querySelector(caseIdShow);
        casePart.classList.add('case-shake');
    }
    else {
        testNumberDonePerCase += testNumberDonePerCase;
        refreshScorePerFeature(feature, score);
    }
};

export function refreshCommon() {

    // sendDataBtnBind
    sendDataBtnBind();

    // ua
    uaProcess();

    uuidProcess();

    // init page table
    initFeatureScore();
}



function initFeatureScore() {
    let tbody = [];
    let schedule = [];
    for (let key in featureKeys) {
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

        score = score || 0;
        totalTestScore += score;
        summary.feature[item] = score;
        let idClass = '#' + item.toLowerCase().replace(/\./g, '-') + ' .score';
        document.querySelector(idClass).innerHTML = score;
        totalTestDone++;
        let rate = parseInt(totalTestDone / totalTestNum * 100, 10) + '%';
        totalSchedule.innerHTML = rate;
        // totalSchedule.style.width = rate;
        totalScore.innerHTML = parseInt((totalTestScore / totalTestNum) * 100, 10);
        if (totalTestNum === totalTestDone) {
            sendDataBtn.classList.remove('hide');
        }
    });
}

function refreshScorePerFeature(feature, score) {
    let midScore = totalTestScore + score;
    let midDone = totalTestDone + 1;
    let rate = parseInt(midDone / totalTestNum * 100, 10) + '%';
    totalSchedule.innerHTML = rate;
    // totalSchedule.style.width = rate;
    totalScore.innerHTML = parseInt((midScore / totalTestNum) * 100, 10);
}

function uaProcess() {
    uaParse();
    uaKeys.forEach(async item => {
        let info = await uaStore.getItem(item);
        if (item !== 'ua') {
            summary.info[item] = JSON.parse(info);
        }
        else {
            summary.info[item] = info;
        }
    });
}

async function uuidProcess() {
    id = await uuidStore.getItem('id');
    if (!id) {
        id = uuid();
        await uuidStore.setItem('id', id);
    }
}

function sendDataBtnBind() {

    sendDataBtn.addEventListener('click', async function (e) {
        let sendDataConfirm = confirm('send data to the database ?');

        if (sendDataConfirm) {

            let res = await axios({
                method: 'post',
                url: 'https://lavas.baidu.com/api/ready/statistic',
                data: {
                    id,
                    info: summary.info,
                    feature: summary.feature
                }
            });

            if (res && res.data && res.data.status === 0) {
                toast('Success!');
            }
            else {
                toast('Failed!');
            }
        }
    });

}

function toast(msg, timeout = 3000) {
    let sendTip = document.querySelector('.send-data-tip');
    sendTip.innerHTML = msg;
    sendTip.classList.remove('hide-tip');
    sendTip.classList.add('show-tip');
    setTimeout(
        () => {
            sendTip.classList.remove('show-tip');
            sendTip.classList.add('hide-tip');
        },
        timeout
    );
}

async function uaParse() {
    const parser = new UAParser();
    const {browser, os, device, ua} = parser.getResult();

    let deviceTip = (device.type || '---') + ' ' + (device.model || '---') + ' ' + (device.vendor || '---');


    document.querySelector('.browser span').innerHTML = browser.name + ' ' + browser.version;
    document.querySelector('.os span').innerHTML = os.name + ' ' + os.version;
    document.querySelector('.device span').innerHTML = deviceTip;

    await Promise.all([
        uaStore.setItem('browser', JSON.stringify(browser)),
        uaStore.setItem('os', JSON.stringify(os)),
        uaStore.setItem('device', JSON.stringify(device)),
        uaStore.setItem('ua', ua)
    ]);
}
