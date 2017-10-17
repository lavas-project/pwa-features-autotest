/**
 * @file helper.js
 * @author clark -t (clarktanglei@163.com)
 */

/**
 * unregister sw controller and then reload the page
 */
export async function init(scope) {
    const sw = navigator.serviceWorker;

    if (!sw) {
        return;
    }

    const reg = await sw.getRegistration(scope);

    if (reg && reg.unregister) {
        await reg.unregister();
        await reload();
    }
}

export async function register(filePath, scope) {
    return navigator.serviceWorker.register(filePath, {scope});
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


export function createStep({name, prefix = 'pwa-test-step-'}) {
    const key = prefix + name;

    const getStep = () => +localStorage.getItem(key);

    let stepNumber = 0;
    let target = getStep();

    const step = async fn => {
        stepNumber++;

        if (target === stepNumber) {
            await fn();
            localStorage.setItem(key, stepNumber);
            await reload();
        }
    };

    step.getCurrentStep = () => stepNumber;

    step.getTargetStep = getStep;

    step.beforeRun = async fn => {
        if (target === 0 && stepNumber === 0) {
            await fn();
        }
    };

    step.done = () => {
        localStorage.removeItem(key);
    };

    return step;
}
