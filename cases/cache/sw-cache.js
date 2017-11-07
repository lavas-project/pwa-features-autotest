/**
 * @file sw-cache
 * @author ruoran (liuruoran@baidu.com)
 */

import {sleep} from 'helper';
import {featureStore} from 'store';
import {log} from 'log';

self.addEventListener('install', function (event) {
    log('Install event');

    if (self.Cache) {
        featureStore.setItem('Cache', 1);
    }

    if (self.caches) {
        featureStore.setItem('caches', 1);
    }

    const baseUrl = process.env.ROUTE_PREFIX + '/cache/';

    /* eslint-disable fecs-max-statements */
    event.waitUntil((async () => {

        let value = 0;

        // caches.open, caches.has
        const cache1 = await caches.open('caches-1');
        let hasCaches1 = await caches.has('caches-1');
        value = Number(hasCaches1);
        await featureStore.setItem('caches.open', value);
        await featureStore.setItem('caches.has', value);
        log('- caches open/has done -', value);

        // caches.keys
        await caches.open('caches-2');
        const hasCachesKeys = await caches.keys();
        value = Number(hasCachesKeys && hasCachesKeys.length >= 2);
        await featureStore.setItem('caches.keys', value);
        log('- caches keys done -', value, hasCachesKeys);

        // caches.delete (** 猎豹 caches.delete().then() no response **)
        // await caches.delete('caches-2');
        caches.delete('caches-2').then(async res => {
            await sleep(3000);
            log('delete then',res);
            if (res) {
                value = Number(res);
                await featureStore.setItem('caches.delete', value);
                log('- caches delete done -', value);
            }
        });
        await sleep(2000);
        const cachesKeys = await caches.keys();
        log('- caches keys done -', cachesKeys);
        const cachesKeysCheck = cachesKeys.length >= hasCachesKeys.length;
        const hasCheck = await caches.has('caches-2');
        const hasCaches2 = cachesKeysCheck && hasCheck;
        value = Number(!hasCaches2) * 0.8;
        await featureStore.setItem('caches.delete', value);
        log('- caches delete done -', value);

        // cache.put
        const urlPut = baseUrl + 'put';
        const resPut = await fetch(urlPut);
        await cache1.put(urlPut, resPut);
        await featureStore.setItem('cache.put', 0.5);

        // cache.match
        let matchCache = await cache1.match(urlPut);
        let matchCacheData = await matchCache.json();
        value = Number(matchCacheData.data === 'put');
        await featureStore.setItem('cache.put', value);
        await featureStore.setItem('cache.match', value);
        log('- cache put done -', value);
        log('- cache match done -', value);

        // caches.match
        try {
            const matchCaches = await caches.match(urlPut, {
                cacheName: 'caches-1'
            });
            const matchCachesData = await matchCaches.json();
            value = Number(matchCachesData.data === 'put');
            await featureStore.setItem('cache.add', value);
            await featureStore.setItem('caches.match', value);
            log('- caches match done -', value);
        }
        catch (e) {
            log('caches.match error', e);
        }

        // cache.delete
        await cache1.delete(urlPut);
        matchCache = await cache1.match(urlPut);
        value = Number(!matchCache);
        await featureStore.setItem('cache.delete', value);
        log('- cache delete done -', value);

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
        await featureStore.setItem('cache.addAll', value);
        log('- cache addAll done -', value, cacheKeys);

        value = Number(cacheKeys && cacheKeys.length >= 2);
        await featureStore.setItem('cache.keys', value);
        log('- cache keys done -', value, cacheKeys);

        // cache.add
        const urlAdd = baseUrl + 'add';
        await cache1.add(urlAdd);
        await featureStore.setItem('cache.add', 0.5);

        // cache.match
        matchCache = await cache1.match(urlAdd);
        matchCacheData = await matchCache.json();
        value = Number(matchCacheData.data === 'add');
        await featureStore.setItem('cache.add', value);
        await featureStore.setItem('cache.match', value);
        log('- cache add done -', value);
        log('- cache match done -', value);


        // cache.matchAll
        const matchAllCache = await cache1.matchAll(baseUrl);
        value = Number(matchAllCache && matchAllCache.length >= 4);
        await featureStore.setItem('cache.matchAll', value);
        log('- cache matchAll done -', value, matchAllCache);

        // delete test cache
        caches.delete('caches-1');
        log('- cache test done -');

    })());
    /* eslint-enable */
    self.skipWaiting();

});

self.addEventListener('activate', function (event) {
    log('Activate event');
});

