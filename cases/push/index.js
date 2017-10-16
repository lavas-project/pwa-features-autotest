/**
 * @file push-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep} from 'helper';
const list = [
    'pushManager.permissionState',
    'pushManager.getSubscription',
    'pushManager.subscribe',
    'pushSubscription.unsubscribe'
];

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

(async function () {
    console.log('<< push-test >>');

    list.map(async (item) => {
        await featureStore.setItem(item, 0);
    })

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    // sw register
    const reg = await navigator.serviceWorker.register('./sw-push.js', {scope: '/cases/push/'});
    const pushManager = reg.pushManager;

    // pushManager
    console.log('- pushManager test -');
    if (!pushManager) {
        console.log('no pushManager');
        return await reg.unregister();
    }
    console.log('pushManager found');


    // permissionState
    console.log('- permissionState test -');
    try {
        const permissionState = await pushManager.permissionState({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
                'BDm6z7ImnFDW6GJ3bwtFdR4ifKGE0CVGXNRfGJhWGm8gwX1sXHH9uq3zo6mYd7fkjVrzfiDHhS5gYfCbxj2g-Bo'
            )
        });
        await featureStore.setItem('pushManager.permissionState', 1);
        if (permissionState === 'denied') {
            console.log('permission denied');
            await reg.unregister();
            await featureStore.setItem('pushManager.denied', 1);
            return;
        }
    }
    catch (err) {
        console.error(err);
    }

    // getSubscription
    const subscription = await pushManager.getSubscription();
    await featureStore.setItem('pushManager.getSubscription', 1);
    console.log('pushManager.getSubscription work', subscription);
    if (subscription) {
        await subscription.unsubscribe();
        await featureStore.setItem('pushManager.unsubscribe', 1);
        console.log('older subscription remove');
    }

    // subscribe
    console.log('ready to subscribe');
    let sub;
    try {
        pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
                'BDm6z7ImnFDW6GJ3bwtFdR4ifKGE0CVGXNRfGJhWGm8gwX1sXHH9uq3zo6mYd7fkjVrzfiDHhS5gYfCbxj2g-Bo'
            )
        })
        .then(sth => {
            sub = sth;
        });
    }
    catch (err) {
        console.error(err);
    }

    // when i use Promise.race on firefox
    // it do not work as i want
    // so i give up and use sleep
    await sleep(5000);
    if (sub) {
        console.log('pushManager.subscribe work', sub);
        const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh'))));
        const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth'))));
        await featureStore.setItem('pushManager.subscribe', 1);
        try {
            await fetch('/askforpush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: sub.endpoint,
                    p256dh,
                    auth
                })
            });
        }
        catch (err) {
            console.error(err);
        }
        await sleep(5000);
        await sub.unsubscribe();
        console.log('subscription.unsubscribe work');
        await featureStore.setItem('pushManager.unsubscribe', 1);
        await reg.unregister();
        console.log('unregister');
    }
    else {
        await reg.unregister();
        console.log('unregister');
        return;
    }



})();
