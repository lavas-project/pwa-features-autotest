/**
 * @file service worker related helper
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
        window.location.reload();
    });
}

