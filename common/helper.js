/**
 * @file helper.js
 * @author clark -t (clarktanglei@163.com)
 */

import {get} from 'utils';
import {featureStore, uaStore} from 'store';
import UAParser from 'ua-parser-js';

/**
 * unregister sw controller and then reload the page
 */
export async function init(scopes) {
    const sw = navigator.serviceWorker;

    if (!sw || typeof sw.getRegistration !== 'function') {
        return;
    }

    let results = await unregister(scopes);

    if (results.some(result => result === true)) {
        await reload();
    }
}

export async function register(filePath, scope) {
    return navigator.serviceWorker.register(filePath, {scope});
}

export async function unregister(scopes) {
    let arr = Array.isArray(scopes) ? scopes : [scopes];

    return await Promise.all(
        arr.map(async scope => {
            let reg;

            switch (typeof scope) {
                case 'string':
                case 'undefined':
                    reg = await navigator.serviceWorker.getRegistration(scope);
                    break;
                case 'object':
                    reg = scope;
                    break;
                default:
                    break;
            }

            if (reg && typeof reg === 'object') {
                return await reg.unregister();
            }
        })
    );
}

export async function checkProperties(scope, list, score, config) {
    let map;

    if (Array.isArray(list)) {
        map = list.map(name => [name, score]);
    }
    else {
        map = Object.keys(list).map(name => [name, list[name]]);
        config = score;
    }

    await Promise.all(
        map.map(item => checkProperty(scope, item[0], item[1], config))
    );
}

export async function checkProperty(scope, name, score, {prefix = ''} = {}) {
    if (get(scope, ...name.split('.')) !== undefined) {
        await grade(prefix + name, score);
    }
}

/**
 * reload webpage, return a no-resolve promise object to block execute
 * usage: await reload();
 *
 * @return {Promise} promise object to block execute
 */
export async function reload() {
    return new Promise(() => {
        location.reload();
    });
}

/**
 * attach a handler to an event, and the handler executes at most once per event type
 *
 * @param {Element} target event target
 * @param {string} event event name
 * @param {Function} fn event handler
 * @return {Promise} promise
 */
export async function one(target, event, fn) {
    return new Promise((resolve, reject) => {
        function handler(e) {
            Promise.resolve(fn(e))
            .then(() => {
                target.removeEventListener(event, handler);
                resolve();
            })
            .catch(() => {
                target.removeEventListener(event, handler);
                reject();
            });
        }

        target.addEventListener(event, handler);
    });
}

/**
 * block the execution for a period of time
 *
 * @param {number} duration sleep duration time
 * @return {Promise} promise
 */
export function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// uuid
export function uuid(duration) {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() + '-' + Date.now());
}

// 4 random number
export function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export function limit(fn, time) {
    return new Promise((resolve, reject) => {
        fn().then(resolve);
        sleep(time).then(reject);
    });
}

export function until(fn, interval = 50) {
    return new Promise(resolve => {
        let timer = setInterval(
            async () => {
                if (await fn()) {
                    clearInterval(timer);
                    resolve();
                }
            },
            interval
        );
    });
}

export function zero(list) {
    return Promise.all(list.map(feature => grade(feature, 0)));
}

export function grade(feature, score) {
    return featureStore.setItem(feature, score);
}

export function createOnce({name, prefix = 'pwa-test-once-'}) {
    const key = prefix + name;

    // const getStep = () => +localStorage.getItem(key);

    let stepNumber = -1;
    let target = +localStorage.getItem(key);

    const once = async (fn, needReload = true) => {
        stepNumber++;

        if (target === stepNumber) {
            target++;
            localStorage.setItem(key, target);

            await fn();

            if (needReload) {
                await reload();
            }
        }
    };

    once.done = () => {
        localStorage.removeItem(key);
    };

    return once;
}

export function createStepTest(totalStep, onSuccess, onFail) {
    let currentStepNo = 0;
    let isFinished = false;

    const tester = expectStepNo => {
        if (isFinished) {
            return;
        }

        if (expectStepNo !== currentStepNo) {
            isFinished = true;
            onFail();
            return false;
        }

        if (expectStepNo + 1 === totalStep) {
            isFinished = true;
            onSuccess();
        }
        else {
            currentStepNo++;
        }

        return true;
    };

    tester.currentStep = () => currentStepNo;
    tester.isFinished = () => isFinished;

    return tester;
}

export function showCaseName(caseName) {
    let div = document.createElement('div');
    div.style = "width:100%;height:20px;text-align:center;background:rgba(0,0,0,0.5);color:#fff;position:fixed;top:0;left:0";
    div.innerHTML = caseName;
    document.body.appendChild(div);
}

export async function uaParse() {
    const parser = new UAParser();
    const {browser, os, device, ua} = parser.getResult();

    let deviceTip = (device.type || '---') + ' ' + (device.model || '---') + ' ' + (device.vendor || '---');


    document.querySelector('.browser span').innerHTML = browser.name + ' ' + browser.version;
    document.querySelector('.os span').innerHTML = os.name + ' ' + os.version;
    document.querySelector('.device span').innerHTML = deviceTip;
    await uaStore.setItem('browser', JSON.stringify(browser));
    await uaStore.setItem('os', JSON.stringify(os));
    await uaStore.setItem('device', JSON.stringify(device));
    await uaStore.setItem('ua', JSON.stringify(ua));

    // await Promise.all([
    //     uaStore.setItem('browser', JSON.stringify(browser)),
    //     uaStore.setItem('os', JSON.stringify(os)),
    //     uaStore.setItem('device', JSON.stringify(device)),
    //     uaStore.setItem('ua', JSON.stringify(ua))
    // ]);
}


