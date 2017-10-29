/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */
import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep} from 'helper';
import {log} from 'log';
// import webpush from 'web-push';
const CHECK_LIST = [
    'pushManager', // no statistics
    'pushManager.permissionState',
    'pushManager.getSubscription',
    'pushManager.subscribe',
    'pushSubscription.unsubscribe',
    'pushEvent' // no statistics
];

// const vapidKeys = webpush.generateVAPIDKeys();
const vapidKeys = {
    publicKey: 'BCILcrKBo1kSIZHB3rpO2kAyPm4uinkiL-5wu0eBBzXWGrBDvb020splIapyiTgZmgTxNzp4jKSSa68L4rL3XBY',
    privateKey: 'JfLpqnWY4mKBuH9kcghsfjpdb20lgz92tUuBgllsGPw'
};
// log('vapidKeys:', vapidKeys);
let applicationServerKey;
// uc/qq can't pass urlB64ToUint8Array();
try {
    applicationServerKey = urlB64ToUint8Array(vapidKeys.publicKey);
}
catch (err) {
    // log('error urlB64ToUint8Array', err);
}


export default function (scope) {
    return {
        name: 'push',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< push-test >>');

            // sw support
            if (!navigator.serviceWorker || !applicationServerKey) {
                log('no applicationServerKey or no sw');
                return;
            }


            // sw register
            const reg = await navigator.serviceWorker.register(scope + 'sw-push.js', {scope});
            await sleep(3000);
            log('sw register', reg);
            const pushManager = reg.pushManager;

            // pushManager test
            if (!pushManager) {
                log('no pushManager', pushManager);
                await reg.unregister();
                log('push: test finish');
                return;
            }
            await featureStore.setItem('pushManager', 1);
            log('- pushManager done -', 1, pushManager);


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
                log('Failed to test permissionState: ', err);
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
            let getSubscribe;
            try {
                getSubscribe = await pushManager.getSubscription();
                await featureStore.setItem('pushManager.getSubscription', 1);
                log('- pushManager.getSubscription done -', 1);

                if (getSubscribe) {
                    await featureStore.setItem('pushManager.subscribe', 1);
                    log('- pushManager.subscribe done -', 1);
                }

            }
            catch (err) {
                log('Failed to test getSubscription: ', err);
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
        }
    };
}

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


