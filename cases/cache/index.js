/**
 * @file cache-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {sleep, showCaseName} from 'helper';
import {log} from 'log';
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
    showCaseName('cache');

    log('<< cache test >>');

    // init store
    list.map(async item => {
        await featureStore.setItem(item, 0);
    });

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    log('sw-cache register');
    const reg = await navigator.serviceWorker.register('./sw-cache.js', {scope: '/cases/cache/'});
    await sleep(5000);
    await reg.unregister();
    log('cache: test finish');

    if (parent && parent.result) {
        log('refresh score');
        parent.result('cache');
    }

})();
