/**
 * @file cache-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {sleep, one} from 'helper';
const list = [
    'sw-msg-send',
    'sw-msg-got',
    'main-msg-send',
    'main-msg-got'
];

let ch;

(async function () {
    console.log('<< postMessage test >>');

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    const messageWaiter = messageFromSWListener();
    console.log('sw-postmessage register');
    const reg = await navigator.serviceWorker.register('./sw-postmessage.js', {scope: '/cases/postmessage/'});
    await sleep(3000);

    // main-msg-send test
    try {
        reg.active.postMessage({
            text: 'Hi!',
            port: ch && ch.port2
        }, [ch && ch.port2]);
        await featureStore.setItem('main-msg-send', 1);
        console.log('- main-msg-send done -', 1);
    }
    catch (err) {
        console.error(err);
        // getting a cloning error in Firefox
        reg.active.postMessage({
            text: 'Hi!'
        });
        await featureStore.setItem('main-msg-send', 0.5);
        console.log('- main-msg-send done -', 0.5);
    }

    // main-msg-got test
    await Promise.race([
        messageWaiter,
        sleep(3000)
    ]);

    // postmessage score
    let point = 0;
    list.map(async item => {
        const score = await featureStore.getItem(item);
        point += parseFloat(score);
    });
    const result = (point / list.length).toFixed(2);

    await featureStore.setItem('postMessage', result);
    console.log('- postmessage -', result);

    await reg.unregister();
    console.log('sw-postmessage Unregistered');

})();

async function messageFromSWListener() {

    // support MessageChannel
    if (window.MessageChannel) {
        // set up a message channel to communicate with the SW
        ch = new MessageChannel();
        ch.port1.onmessage = async event => {
            console.log('Got reply from sw via ch.port2', event.data);
            await featureStore.setItem('main-msg-got', 0.8);
            console.log('- main-msg-got done -', 0.8);
            // await store.put('feature', 'messageChannel.port1', 'main-msg-got-by')
        };
    }

    // window, sw
    return Promise.race([
        one(window, 'error', async error => {
            console.error(error);
            await featureStore.setItem('main-msg-got', 0);
            console.log('- main-msg-send done -', 0);
        }),
        one(window, 'message', async event => {
            console.warn('Got reply from serviceWorker via window', event.data);
            await featureStore.setItem('main-msg-got', 0.5);
            console.log('- main-msg-got done -', 0.5);
          // await store.put('feature', 'window', 'main-msg-got-by')
        }),
        one(navigator.serviceWorker, 'message', async event => {
            console.log('Got reply from serviceWorker via navigator.serviceWorker', event);
            await featureStore.setItem('main-msg-got', 1);
            console.log('- main-msg-got done -', 1);
          // await store.put('feature', 'navigator.serviceWorker', 'main-msg-got-by')
        })
    ]);
}