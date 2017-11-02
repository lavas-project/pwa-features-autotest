/**
 * @file log.js
 * @author clark-t (clarktanglei@163.com)
 */

import {until} from 'helper';
import {getStore} from 'store';

const logStore = getStore('log');

export function log(...args) {
    console.log(...args);

    args = args.map(msg => {
        if (typeof msg === 'object') {
            msg = JSON.stringify(msg);
        }
        return msg;
    });

    args.unshift(Date.now());

    if (typeof document === 'undefined') {
        swLog(...args);
    }
    else {
        mainLog(...args);
    }
}

let wrapper;
let scope;
let startTime;

async function init() {
    startTime = Date.now();
    scope = location.pathname.split('/').slice(0, -1).join('/');
    let scopeLen = scope.length;

    if (typeof document !== 'undefined') {
        // init display dom
        wrapper = document.createElement('div');
        wrapper.classList.add('log-wrapper');
        wrapper.style.wordBreak = 'break-all';
        wrapper.style.background = 'rgba(0,0,0,0.5)';
        document.body.appendChild(wrapper);

        const tictok = displayTime => setTimeout(async () => {
            let infos = await logStore.iterate((value, key, i) => {
                let currScope = key.slice(0, scopeLen);
                let timestamp = +key.slice(scopeLen);

                if (currScope === scope && timestamp >= displayTime) {
                    return [[key, timestamp, value]];
                }
            });

            if (!infos || !infos.length) {
                return tictok(displayTime);
            }

            infos.sort((a, b) => a[1] - b[1])
                .forEach(info => {
                    mainLog(info[0], info[2]);
                    logStore.removeItem(info[0]);
                    displayTime = info[1];
                });

            return tictok(displayTime);
        }, 200);

        tictok(startTime);
    }
    else {
        // clear expired log data
        let keys = await logStore.keys();

        keys.filter(key => key.slice(0, scopeLen) === scope)
            .filter(
                key => +key.slice(scopeLen) < startTime
                    || /-lock$/.test(key)
                    || /-stack$/.test(key)
            )
            .forEach(key => logStore.removeItem(key));
    }

}

// let logStack = [];

export function mainLog(...args) {
    let msg = args.slice(1).join(' - ');
    let div = document.createElement('div');
    div.style.wordBreak = 'break-all';
    div.style.color = '#fff';
    div.innerText = msg;

    wrapper.appendChild(div);
    // logStack.push(args);

    // let html = logStack.sort((a, b) => a[0] - b[0])
    //     .map(msg => {
    //         let str = msg.slice(1).join(' - ');
    //         return `<div style="word-break: break-all; color: #fff">${str}</div>`;
    //     })
    //     .join('');

    // wrapper.innerHTML = html;
}

export function swLog(...args) {
    let timestamp = args[0];
    let msg = args.slice(1).join(' - ');

    logStore.setItem(scope + timestamp, msg);
}

init();
