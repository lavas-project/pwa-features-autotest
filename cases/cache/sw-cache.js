/**
 * @file sw-cache
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';

self.addEventListener('install', function (event) {
    console.log('Install event');
    const baseUrl = '/cases/cache/';

    event.waitUntil((async () => {

        // caches.open, caches.has
        const cache = await caches.open('cache-test-v1');
        const hasCache = await caches.has('cache-test-v1');
        await featureStore.setItem('caches.open', Number(hasCache));
        await featureStore.setItem('caches.has', Number(hasCache));
        console.log('open a cache', cache);

        // cache.put,cache.match
        const urlPut = baseUrl + 'put';
        const resPut = await fetch(urlPut);
        await cache.put(urlPut, resPut);
        await featureStore.setItem('cache.put', 0.5);

        const matchPut = await cache.match(urlPut);
        await featureStore.setItem('cache.match', 0.5);

        const checkPut = await matchPut.json();
        if (checkPut.data === urlPut) {
            console.log('put and match a request', checkPut);
            await featureStore.setItem('cache.put', 1);
            await featureStore.setItem('cache.match', 1);
        }

        // cache.add
        const urlAdd = baseUrl + 'add';
        await cache.add(urlAdd);
        await featureStore.setItem('cache.add', 0.5);

        const matchAdd = await cache.match(urlAdd);
        const checkAdd = await matchAdd.json();
        if (checkAdd.data === urlAdd) {
            console.log('add and match a request', checkAdd);
            await featureStore.setItem('cache.add', 1);
        }

        // cache.keys
        const keys = await cache.keys();
        console.log(keys, 'check cache.keys');
        if (keys.length >= 2) {
            console.log('cache.keys passed');
            await featureStore.setItem('cache.keys', 1);
        }

        // cache.delete
        await cache.delete(urlPut);
        await featureStore.setItem('cache.delete', 0.5);
        const nullPutCache = await cache.match(urlPut);
        if (!nullPutCache) {
            console.log('check cache.delete');
            await featureStore.setItem('cache.delete', 1);
        }

        // cache.addAll
        const urlAddAllArr = [
            baseUrl + 1,
            baseUrl + 2,
            baseUrl + 3,
            baseUrl + 4
        ];
        await cache.addAll(urlAddAllArr);
        await featureStore.setItem('cache.addAll', 0.5);
        console.log('addAll');
        const keys2 = await cache.keys();
        const matchAddAll = await cache.match(urlAddAllArr[3]);
        const checkAddAll = await matchAddAll.json();
        console.log(keys2, checkAddAll.data, 'checkAddAll');
        if (keys2.length >= 5 && checkAddAll.data === urlAddAllArr[3]) {
            await featureStore.setItem('cache.addAll', 1);
        }

        // cache.matchAll
        const matchAll = await cache.matchAll(baseUrl);
        if (matchAll.length >= 5) {
            await featureStore.setItem('cache.matchAll', 1);
        }

        // caches.delete
        await caches.delete('cache-test-v1');
        const hasCache2 = await caches.has('cache-test-v1');
        await featureStore.setItem('caches.delete', Number(!hasCache2));
    })());

    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Activate event');
});

