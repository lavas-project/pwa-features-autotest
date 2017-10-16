/**
 * @file helper.js
 * @author clark -t (clarktanglei@163.com)
 */

/**
 * unregister sw controller and then reload the page
 */
export async function init() {
    const sw = navigator.serviceWorker;

    if (!sw) {
        return;
    }

    const reg = await sw.getRegistration();

    if (reg && reg.unregister) {
        await reg.unregister();
        await reload();
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
    })
}

/**
 * block the execution for a period of time
 *
 * @param {number} duration sleep duration time
 * @return {Promise} promise
 */
export function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

export function createStep({name, prefix = 'pwa-test-step-'}) {
    const key = prefix + name;

    const getStep = () => localStorage.getItem(key);

    let stepNumber = -1;
    let target = getStep();

    const step = async function (fn) {
        stepNumber++;

        if (target == null || target < stepNumber) {
            localStorage.setItem(key, stepNumber);
            await reload();
        }
        else if (target === stepNumber) {
            await fn();
        }
    };

    step.getCurrentStep = function () {
        return stepNumber;
    };

    step.getStep = getStep;

    step.done = function () {
        localStorage.removeItem(key);
    };

    return step;
}
