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
    const pushManager = reg.pushManager;

    // pushManager
    console.log('- pushManager test -');
    if (!pushManager) {
        console.log('no pushManager');
        return await reg.unregister();
    }
    console.log('pushManager found');

    // getSubscription
    const subscription = await pushManager.getSubscription();
    await featureStore.setItem('pushManager.getSubscription', 1);
    console.log('- pushManager.getSubscription done -', subscription);
    if (subscription) {
        await subscription.unsubscribe();
        await featureStore.setItem('pushManager.unsubscribe', 1);
        console.log('older subscription remove');
    }

    await sleep(5000);
    await reg.unregister();
    console.log('unregister');

})();
