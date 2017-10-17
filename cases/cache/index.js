/**
 * @file cache-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {sleep} from 'helper';
const list = [
    'caches.open',
    'caches.has',
    'caches.keys',
    'caches.match',
    'caches.delete',
    'cache.add',
    'cache.addAll',
    'cache.delete',
    'cache.keys',
    'cache.match',
    'cache.matchAll',
    'cache.put'
];

(async function () {
    console.log('<< cache test >>');

    // init store
    list.map(async item => {
        await featureStore.setItem(item, 0);
    });

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    const reg = await navigator.serviceWorker.register('./sw-cache.js', {scope: '/cases/cache/'});
    await sleep(5000);
    await reg.unregister();
    console.log('sw-cache unregister');

})();
