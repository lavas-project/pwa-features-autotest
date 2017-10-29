/**
 * @file cache-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {sleep} from 'helper';
import {log} from 'log';
const CHECK_LIST = [
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
    'cache.matchAll', // no statistics
    'cache.put'
];

export default function (scope) {
    return {
        name: 'cache',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< cache test >>');

            // sw support
            if (!navigator.serviceWorker) {
                return;
            }

            log('sw-cache register');
            const reg = await navigator.serviceWorker.register(scope + 'sw-cache.js', {scope});
            await sleep(10000);
            await reg.unregister();
            log('cache: test finish');
        }
    };
}

