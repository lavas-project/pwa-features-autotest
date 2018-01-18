/**
 * @file sw-indexeddb.js
 * @author clark-t (clarktanglei@163.com)
 */

import {sleep} from 'helper';
import {log} from 'log';
import {createStore, deleteStore} from './indexeddb';

self.addEventListener('install', e => {
    log('indexeddb sw-indexeddb: oninstall');

    if (e.waitUntil) {
        e.waitUntil((async () => {
            if (typeof indexedDB === 'undefined') {
                log('indexeddb sw-indexeddb: indexedDB unsupport');
                return;
            }

            let store = await createStore();

            try {
                if (await store.get('a')) {
                    await store.delete('a');
                }

                let data = {key: 'a', value: 'b'};
                await store.add(data);
                log('indexeddb sw-indexeddb: add data', data);

                data = await store.get('a');
                log('indexeddb sw-indexeddb: get data after add', data);

                data = {key: 'a', value: 'c'};
                await store.put(data);
                log('indexeddb sw-indexeddb: put data', data);

                data = await store.get('a');
                log('indexeddb sw-indexeddb: get data after put', data);

                await store.delete('a');
                log('indexeddb sw-indexeddb: delete data');

                data = await store.get('a');
                log('indexeddb sw-indexeddb: get data after delete', data);

                // grade('indexedDB', 1);
            }
            catch (e) {
                log('indexeddb sw-indexeddb: error happen when crud', e);
            }

            if (store.getAll) {
                try {
                    await Promise.all([
                        store.put({key: 'a', value: '1'}),
                        store.put({key: 'b', value: '2'})
                    ]);

                    let result = await store.getAll();
                    // grade('sw-indexeddb indexedDB.getAll', 1);
                    log('sw-indexeddb indexeddb: getAll', result);
                }
                catch (e) {
                    log('indexeddb sw-indexeddb: getAll error', e);
                }
            }
            else {
                log('indexeddb sw-indexeddb: getAll unsupport');
            }

            deleteStore();

            await sleep(1000);

            log('indexeddb: test finish');
        })());
    }

    // log('lifecycle sw-lifecycle: skipWaiting');
    self.skipWaiting();
});
