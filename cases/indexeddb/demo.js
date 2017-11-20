/**
 * @file indexeddb index.js
 * @author clark-t (clarktanglei@163.com)
 */

import {grade, sleep} from 'helper';
import {log} from 'log';

export const CHECK_LIST = [
    'indexedDB',
    'indexedDB.getAll'
];

export default function (scope) {
    return {
        name: 'indexeddb',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            if (typeof indexedDB === 'undefined') {
                log('indexeddb: indexedDB unsupport');
                return;
            }

            let store = await createStore();

            try {
                if (await store.get('a')) {
                    await store.delete('a');
                }

                let data = {key: 'a', value: 'b'};
                await store.add(data);
                log('indexeddb: add data', data);

                data = await store.get('a');
                log('indexeddb: get data after add', data);

                data = {key: 'a', value: 'c'};
                await store.put(data);
                log('indexeddb: put data', data);

                data = await store.get('a');
                log('indexeddb: get data after put', data);

                await store.delete('a');
                log('indexeddb: delete data');

                data = await store.get('a');
                log('indexeddb: get data after delete', data);

                grade('indexedDB', 1);
            }
            catch (e) {
                log('indexeddb: error happen when crud', e);
            }

            if (store.getAll) {
                try {
                    await Promise.all([
                        store.put({key: 'a', value: '1'}),
                        store.put({key: 'b', value: '2'})
                    ]);

                    let result = await store.getAll();
                    grade('indexedDB.getAll', 1);
                    log('indexeddb: getAll', result);
                }
                catch (e) {
                    log('indexeddb: getAll error', e);
                }
            }
            else {
                log('indexeddb: getAll unsupport');
            }

            deleteStore();

            await sleep(1000);

            log('indexeddb: test finish');
        }
    };
}

const DB_NAME = 'pwa-features-autotest-indexeddb';
const VERSION = 1;
const STORE_NAME = 'test';

function createStore() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, VERSION);
        request.onerror = event => reject(event);

        request.onupgradeneeded = event => {
            let db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                let objectStore = db.createObjectStore(STORE_NAME, {keyPath: 'key'});
                objectStore.createIndex('key', 'key', {unique: true});
                objectStore.createIndex('value', 'value', {unique: false});
            }
        };

        request.onsuccess = event => {
            let db = request.result;

            db.onerror = event => reject(event);

            let transaction = db.transaction('test', 'readwrite');
            let store = transaction.objectStore('test');

            let promisifyStore = ['add', 'get', 'put', 'delete', 'getAll'].reduce(
                (obj, key) => {
                    if (typeof store[key] === 'function') {
                        obj[key] = (...args) => promisify(store[key](...args));
                    }
                    return obj;
                },
                {}
            );

            resolve(promisifyStore);
        };
    });
}

function deleteStore() {
    try {
        indexedDB.deleteDatabase(DB_NAME);
    }
    catch (e) {}
}

function promisify(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(event);
        };
    });
}

