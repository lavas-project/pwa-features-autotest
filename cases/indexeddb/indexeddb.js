const DB_NAME = 'pwa-features-autotest-indexeddb';
const VERSION = 1;
const STORE_NAME = 'test';

export function createStore() {
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

export function deleteStore() {
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
