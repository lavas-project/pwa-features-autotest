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

function init() {
    scope = location.pathname.split('/').slice(0, -1).join('/') + '-';

    if (typeof document !== 'undefined') {
        wrapper = document.createElement('div');
        wrapper.classList.add('log-wrapper');
        wrapper.style.wordBreak = 'break-all';
        wrapper.style.background = 'rgba(0,0,0,0.5)';
        document.body.appendChild(wrapper);

        const tictok = () => setTimeout(async () => {
            if (await logStore.getItem(scope + 'stack')) {
                if (await lock('main')) {
                    let stack = await logStore.getItem(scope + 'stack');

                    await logStore.setItem(scope + 'stack', '');
                    await unlock();

                    try {
                        stack = JSON.parse(stack);
                        stack.forEach(msg => {
                            mainLog(...msg);
                        });
                    }
                    catch (e) {
                        console.log('error in parse json:');
                        console.log(stack);
                        console.log(e);
                    }
                }
            }

            return tictok();
        }, 200);

        tictok();
    }

}

async function lock(name) {
    if (await logStore.getItem(scope + 'lock')) {
        return false;
    }

    await logStore.setItem(scope + 'lock', name);
    let lock = await logStore.getItem(scope + 'lock');

    return lock === name;
}

async function unlock() {
    await logStore.setItem(scope + 'lock', '');
}

let logStack = [];

export function mainLog(...args) {
    logStack.push(args);

    let html = logStack.sort((a, b) => a[0] - b[0])
        .map(msg => {
            let str = msg.slice(1).join(' - ');
            return `<div style="word-break: break-all; color: #fff">${str}</div>`;
        })
        .join('');

    wrapper.innerHTML = html;
}

// let count = 0;

export async function swLog(...args) {
    await until(lock.bind(null, 'sw' + Math.floor(Math.random() * Date.now())));
    let stack = await logStore.getItem(scope + 'stack');
    if (stack) {
        stack = JSON.parse(stack);
        stack.push(args);
    }
    else {
        stack = [args];
    }

    stack = JSON.stringify(stack);
    await logStore.setItem(scope + 'stack', stack);
    await unlock();
}

init();
