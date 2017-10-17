/**
 * @file sw-cache
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';

self.addEventListener('install', function (event) {
    console.log('Install event');

    const baseUrl = '/cache/';

    /* eslint-disable fecs-max-statements */
    event.waitUntil((async () => {

        let value = 0;

        // caches.open, caches.has
        const cache1 = await caches.open('caches-1');
        let hasCaches1 = await caches.has('caches-1');
        value = Number(hasCaches1);
        await featureStore.setItem('caches.open', value);
        await featureStore.setItem('caches.has', value);
        console.log('- caches open/has done -', value);

        // caches.keys
        await caches.open('caches-2');
        const hasCachesKeys = await caches.keys('caches-keys');
        value = Number(hasCachesKeys && hasCachesKeys.length >= 2);
        await featureStore.setItem('caches.keys', value);
        console.log('- caches keys done -', value, hasCachesKeys);

        // caches.delete
        await caches.delete('caches-2');
        const hasCaches2 = await caches.has('caches-2');
        value = Number(!hasCaches2);
        await featureStore.setItem('caches.delete', value);
        console.log('- caches delete done -', value);

        // cache.add
        const urlAdd = baseUrl + 'add';
        await cache1.add(urlAdd);
        await featureStore.setItem('cache.add', 0.5);

        // caches.match
        const matchCaches = await caches.match(urlAdd, {
            cacheName: 'caches-1'
        });
        const matchCachesData = await matchCaches.json();
        value = Number(matchCachesData.data === urlAdd);
        await featureStore.setItem('cache.add', value);
        await featureStore.setItem('caches.match', value);
        console.log('- caches match done -', value);

        // cache.match
        let matchCache = await cache1.match(urlAdd);
        let matchCacheData = await matchCache.json();
        value = Number(matchCacheData.data === urlAdd);
        await featureStore.setItem('cache.add', value);
        await featureStore.setItem('cache.match', value);
        console.log('- cache add done -', value);
        console.log('- cache match done -', value);

        // cache.addAll
        const urlAddAll = [
            baseUrl + '1',
            baseUrl + '2',
            baseUrl + '3',
            baseUrl + '4'
        ];
        await cache1.addAll(urlAddAll);
        await featureStore.setItem('cache.addAll', 0.5);

        const cacheKeys = await cache1.keys();
        value = Number(cacheKeys && cacheKeys.length >= 4);
        console.log('- cache addAll done -', value, cacheKeys);


        // cache.matchAll
        const matchAllCache = await cache1.matchAll(baseUrl);
        value = Number(matchAllCache && matchAllCache.length >= 4);
        await featureStore.setItem('cache.matchAll', value);
        console.log('- cache matchAll done -', value, matchAllCache);


        // cache.put
        const urlPut = '/cache/' + 'put';
        const resPut = await fetch(urlPut);
        await cache1.put(urlPut, resPut);
        await featureStore.setItem('cache.put', 0.5);

        matchCache = await cache1.match(urlPut);
        matchCacheData = await matchCache.json();
        value = Number(matchCacheData.data === urlPut);
        await featureStore.setItem('cache.put', value);
        console.log('- cache put done -', value);

        // cache.delete
        await cache1.delete(urlPut);
        matchCache = await cache1.match(urlPut);
        value = Number(!matchCache);
        await featureStore.setItem('cache.delete', value);
        console.log('- cache delete done -', value, matchCache);

    })());
    /* eslint-enable */

    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Activate event');
});

