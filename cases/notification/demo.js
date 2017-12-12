/**
 * @file notification-test
 * @author ruoran (liuruoran@baidu.com)
 */

import 'whatwg-fetch';
import {sleep, grade} from 'helper';
import {log} from 'log';
const CHECK_LIST = [
    'Notification',
    'notification.requestPermission',
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
            if (!window.Notification) {
                await sleep(5000);
                await reg.unregister();
                log('Notification: no support');
                log('notification: test finish');
                return;
            }

            await grade('Notification', 1);
            log('- Notification done -',  Notification.permission, 1);

            // notification.requestPermission test
            // if Notification.permission is 'denied', Notification.requestPermission() doesn't work
            if (Notification.permission !== 'denied') {
                let permission = await Promise.race([
                    new Promise((resolve, reject) => {
                        const permissionPromise = Notification.requestPermission(result => {
                            log('in callback');
                            resolve(result);
                        });

                        if (permissionPromise) {
                            log('in promise', permissionPromise);
                            permissionPromise.then(resolve);
                        }
                        else {
                            log('in undefined');
                            reject('no permission');
                        }
                    }),
                    sleep(3000)
                ]);

                if (permission === 'granted') {
                    await grade('notification.requestPermission', 1);
                    log('- notification.requestPermission done -', 1, permission);
                }
                else {
                    await reg.unregister();
                    log('Notification.permission: denied');
                    log('notification: test finish');
                    return;
                }
            }
            else {
                await sleep(5000);
                await reg.unregister();
                log('Notification.permission: denied');
                log('notification: test finish');
                return;
            }


            // notification.showNotification test
            await reg.showNotification('Hello World!');
            await grade('showNotification', 1);
            log('- showNotification done -', 1);

            // notification.getNotification test
            const hasNotification = await reg.getNotifications();
            await grade('getNotification', 1);
            log('- getNotifications done -', 1, hasNotification);


            await sleep(5000);
            await reg.unregister();
            log('notification: test finish');
        },
        error(e) {
            log(e);
        }
    };
}

