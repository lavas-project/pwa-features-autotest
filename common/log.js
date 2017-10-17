/**
 * @file log.js
 * @author clark-t (clarktanglei@163.com)
 */

import {getStore} from 'store';

const logStore = getStore('log');

export function log(...args) {
    if (typeof document === 'undefined') {
        swLog(...args);
    }
    else {
        mainLog(...args);
    }
}

let wrapper;

function init() {
    if (typeof document !== 'undefined') {
        wrapper = document.createElement('div');
        wrapper.style.wordBreak = 'break-all';
        wrapper.style.background = '#dcdcdc';
        document.body.appendChild(wrapper);

        const tictok = () => setTimeout(async () => {
            let stack = await logStore.getItem('stack');
            await logStore.setItem('stack', '');

            if (stack) {
                stack = JSON.parse(stack);
                stack.forEach(msg => {
                    mainLog(...msg);
                })
            }

            return tictok();
        }, 200);

        tictok();

        console.log('here')
    }

}

export function mainLog(...args) {
    let div = document.createElement('div');
    div.style.wordBreak = 'break-all';
    div.style.color = '#f00';
    div.innerHTML = args.map(msg => {
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        return msg;
    })
    .join(' - ');
    wrapper.appendChild(div);
    console.log(...args);
}

export async function swLog(...args) {
    let stack = await logStore.getItem('stack');
    if (stack) {
        stack = JSON.parse(stack);
        stack.push(args);
    }
    else {
        stack = [args];
    }

    stack = JSON.stringify(stack);
    await logStore.setItem('stack', stack);

    console.log(...args);
}

init();