/**
 * @file sw-postmessage
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {log} from 'log';

self.addEventListener('install', function (event) {
    log('Install event');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    log('Activate event');
});

self.addEventListener('message', async function (event) {
    log('Message event');

    await featureStore.setItem('sw-msg-got', 1);
    log('- sw-msg-got done -', 1);

    if (event.source) {
        event.source.postMessage('Woop!');
        await featureStore.setItem('sw-msg-send', 1);
        log('- sw-msg-send done -', ' by event.source -', 1);
    // await store.put('feature', 'event.source', 'sw-msg-send-by')
        return;
    }

    if (self.clients && self.clients.matchAll) {
        self.clients.matchAll().then(function (clients) {
            for (const client of clients) {
                client.postMessage('Whoop! (via client api)');
            }
        });
        await featureStore.setItem('sw-msg-send', 0.8);
        log('- sw-msg-send done -', ' by clients -', 0.8);
        // await store.put('feature', 'self.clients', 'sw-msg-send-by')
        return;
    }

    if (event.data.port) {
        event.data.port.postMessage('Woop!');
        await featureStore.setItem('sw-msg-send', 0.5);
        log('- sw-msg-send done -', ' by ch.port -', 0.5);
        // await store.put('feature', 'event.data.port', 'sw-msg-send-by')
        return;
    }

    await featureStore.setItem('sw-msg-send', 0);
    log('- sw-msg-send done -', ' no -', 0);
  // await store.put('feature', 'nothing', 'sw-msg-send-by')
    return;
});

