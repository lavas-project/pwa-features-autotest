/**
 * @file notification-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep, showCaseName} from 'helper';
import {log} from 'log';
const list = [
    'notification',
    'notification.requestPermission',
    'showNotification',
    'getNotification',
    'notificationclick' // no statistics
];

(async function () {
    showCaseName('notification');

    log('<< notification-test >>');

    list.map(async item => {
        await featureStore.setItem(item, 0);
    });

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    // sw register
    const reg = await navigator.serviceWorker.register('./sw-notification.js', {scope: '/cases/notification/'});
    await sleep(3000);

    // notification test
    if (Notification) {
        await featureStore.setItem('notification', 1);
        log('- notification done -', 1);
    }

    // notification.requestPermission test
    let permission = await new Promise((resolve, reject) => {
        const permissionPromise = Notification.requestPermission(result => {
            resolve(result);
        });

        if (permissionPromise) {
            permissionPromise.then(resolve);
        }
    });

    if (permission === 'granted') {
        await featureStore.setItem('notification.requestPermission', 1);
        log('- notification.requestPermission done -', 1, permission);
    }

    // notification.showNotification test
    await reg.showNotification('Hello World!');
    await featureStore.setItem('notification.showNotification', 1);
    log('- notification.showNotification done -', 1);

    // notification.getNotification test
    const hasNotification = await reg.getNotifications();
    await featureStore.setItem('notification.getNotification', 1);
    log('- notification.getNotifications done -', 1, hasNotification);


    await sleep(5000);
    await reg.unregister();
    log('unregister');

})();
