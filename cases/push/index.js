/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {run} from 'base';
import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep} from 'helper';
import {log} from 'log';
import webpush from 'web-push';
const CHECK_LIST = [
    'pushManager', // no statistics
    'pushManager.permissionState',
    'pushManager.getSubscription',
    'pushManager.subscribe',
    'pushSubscription.unsubscribe',
    'pushEvent' // no statistics
];
const SCOPE = '/cases/push/';

const vapidKeys = webpush.generateVAPIDKeys();

const applicationServerKey = urlB64ToUint8Array(vapidKeys.publicKey);

async function main() {

    log('<< push-test >>');

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    // sw register
    const reg = await navigator.serviceWorker.register('./sw-push.js', {scope: SCOPE});
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
        log('- pushManager.permissionState done -', 1);

        if (permissionState === 'denied') {
            log('permission denied');
            await reg.unregister();
            return;
        }
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

    // getSubscription test
    let getSubscribe = await pushManager.getSubscription();
    await featureStore.setItem('pushManager.getSubscription', 1);
    log('- pushManager.getSubscription done -', 1);

    if (getSubscribe) {
        await featureStore.setItem('pushManager.subscribe', 1);
        log('- pushManager.subscribe done -', 1);
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
};

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

run({
    name: 'push',
    scope: SCOPE,
    features: CHECK_LIST,
    main: main
});
