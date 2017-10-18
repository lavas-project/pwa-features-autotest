/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep} from 'helper';
const list = [
    'pushManager', // no statistics
    'pushManager.permissionState',
    'pushManager.getSubscription',
    'pushManager.subscribe',
    'pushSubscription.unsubscribe',
    'pushEvent' // no statistics
];

const applicationServerKey = urlB64ToUint8Array(
    'BDm6z7ImnFDW6GJ3bwtFdR4ifKGE0CVGXNRfGJhWGm8gwX1sXHH9uq3zo6mYd7fkjVrzfiDHhS5gYfCbxj2g-Bo'
);

(async function () {
    console.log('<< push-test >>');

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
        console.log('no pushManager');
        return await reg.unregister();
    }
    await featureStore.setItem('pushManager', 1);
    console.log('- pushManager done', pushManager);

    // pushManager.permissionState test
    try {
        const permissionState = await pushManager.permissionState({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });
        await featureStore.setItem('pushManager.permissionState', 1);
        if (permissionState === 'denied') {
            console.log('permission denied');
            await reg.unregister();
            return;
        }
        console.log('- pushManager.permissionState done -', 1);
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
        console.log('Failed to subscribe the user: ', err);
    }

    // getSubscription test
    let getSubscribe = await pushManager.getSubscription();
    if (getSubscribe) {
        await featureStore.setItem('pushManager.subscribe', 1);
        console.log('- pushManager.subscribe done -', 1, subscribe);

        await featureStore.setItem('pushManager.getSubscription', 1);
        console.log('- pushManager.getSubscription done -', 1, getSubscribe);
    }

    if (subscribe) {

        await subscribe.unsubscribe();
        getSubscribe = await pushManager.getSubscription();
        if (!getSubscribe) {
            await featureStore.setItem('pushManager.unsubscribe', 1);
        }
        console.log('- pushManager.unsubscribe done -', Number(!getSubscribe));
        await sleep(5000);
        await reg.unregister();
        console.log('unregister');
        return;
    }

    await sleep(5000);
    await reg.unregister();
    console.log('unregister');

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

