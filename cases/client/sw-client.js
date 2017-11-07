/**
 * @file fetch sw
 * @author clark-t (clarktanglei@163.com)
 */

import {grade} from 'helper';
import {log} from 'log';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', async e => {
    if (self.clients) {
        grade('clients', 1);
    }
    else {
        return;
    }

    self.clients.claim();

    let clientList = await self.clients.matchAll();

    if (clientList && clientList.length) {
        await grade('clients.matchAll', 1);
        log('client sw-client: clients.matchAll works');

        let client = clientList[0];

        if (client && client.id) {
            let clientById = await self.clients.get(client.id);
            if (clientById) {
                await grade('clients.get', 1);
                log('client sw-client: clients.get works');
            }
        }
    }
});
