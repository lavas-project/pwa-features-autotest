/**
 * @file notification-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {featureStore} from 'store';
import {sleep} from 'helper';
import {log} from 'log';
const CHECK_LIST = [
    'notification',
    // 'notification.requestPermission',
    'showNotification',
    'getNotification',
    'notificationclick' // no statistics
];

export default function (scope) {
    return {
        name: 'notification',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< notification-test >>');

            // sw support
            if (!navigator.serviceWorker) {
                return;
            }

            // sw register
            const reg = await navigator.serviceWorker.register(scope + 'sw-notification.js', {scope});
            await sleep(3000);

            // notification test
            if (window.Notification) {
                await featureStore.setItem('notification', 1);
                log('- notification done -', 1);
            }

            // notification.requestPermission test
            // try {
                // let permission = await new Promise((resolve, reject) => {
                //     const permissionPromise = Notification.requestPermission(result => {
                //         resolve(result);
                //     });

                //     if (permissionPromise) {
                //         permissionPromise.then(resolve);
                //     }
                // });

                // if (permission === 'granted') {
                //     await featureStore.setItem('notification.requestPermission', 1);
                //     log('- notification.requestPermission done -', 1, permission);
                // }
            // }
            // catch (e) {
            //     log('error: not support');

            // }

            // notification.showNotification test
            await reg.showNotification('Hello World!');
            await featureStore.setItem('showNotification', 1);
            log('- showNotification done -', 1);

            // notification.getNotification test
            const hasNotification = await reg.getNotifications();
            await featureStore.setItem('getNotification', 1);
            log('- getNotifications done -', 1, hasNotification);


            await sleep(5000);
            await reg.unregister();
            log('notification: test finish');
        }
    };
}

