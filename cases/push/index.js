/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep, showCaseName} from 'helper';
import {log} from 'log';
const webpush = require('web-push');
const list = [
    'pushManager', // no statistics
    'pushManager.permissionState',
    'pushManager.getSubscription',
    'pushManager.subscribe',
    'pushSubscription.unsubscribe',
    'pushEvent' // no statistics
];

const vapidKeys = webpush.generateVAPIDKeys();

const applicationServerKey = urlB64ToUint8Array(vapidKeys.publicKey);

(async function () {
    showCaseName('push');

    log('<< push-test >>');

    list.map(async item => {
        await featureStore.setItem(item, 0);
    });

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    // sw register
    const reg = await navigator.serviceWorker.register('./sw-push.js', {scope: '/cases/push/'});
    await sleep(3000);

    const pushManager = reg.pushManager;

    // pushManager test
    if (!pushManager) {
        log('no pushManager');
        return await reg.unregister();
    }
    await featureStore.setItem('pushManager', 1);
    log('- pushManager done -', 1);

    // pushManager.permissionState test
    try {
        const permissionState = await pushManager.permissionState({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });
        await featureStore.setItem('pushManager.permissionState', 1);
        if (permissionState === 'denied') {
            log('permission denied');
            await reg.unregister();
            return;
        }
        log('- pushManager.permissionState done -', 1);
    }
    catch (err) {
        console.error(err);
    }

    // subscribe test
    let subscribe;
    try {
        subscribe = await pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });
    }
    catch (err) {
        log('Failed to subscribe the user: ', err);
    }
    // debugger

    // getSubscription test
    let getSubscribe = await pushManager.getSubscription();
    if (getSubscribe) {
        await featureStore.setItem('pushManager.subscribe', 1);
        log('- pushManager.subscribe done -', 1);

        await featureStore.setItem('pushManager.getSubscription', 1);
        log('- pushManager.getSubscription done -', 1);
    }

    if (subscribe) {

        // unsubscribe test
        await subscribe.unsubscribe();
        getSubscribe = await pushManager.getSubscription();
        if (!getSubscribe) {
            await featureStore.setItem('pushSubscription.unsubscribe', 1);
        }
        log('- pushSubscription.unsubscribe done -', Number(!getSubscribe));
    }

    await sleep(5000);
    await reg.unregister();
    log('push: test finish');

    if (parent) {
        log('refresh score');
        parent.result('push');
    }

})();

/**
 * urlB64ToUint8Array public key
 *
 * @param {string} base64String public key
 * @return {Array} outputArray Uint8Array
 */
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

