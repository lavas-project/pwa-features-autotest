/**
 * @file cache-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {run} from 'base';
import {featureStore} from 'store';
import {sleep, showCaseName} from 'helper';
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

const SCOPE = '/cases/cache/';

async function main() {

    log('<< cache test >>');

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    log('sw-cache register');
    const reg = await navigator.serviceWorker.register('./sw-cache.js', {scope: SCOPE});
    await sleep(5000);
    await reg.unregister();
    log('cache: test finish');

};

run({
    name: 'cache',
    scope: SCOPE,
    features: CHECK_LIST,
    main: main
});
