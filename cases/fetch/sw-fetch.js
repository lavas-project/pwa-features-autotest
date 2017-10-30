/**
 * @file fetch sw
 * @author clark-t (clarktanglei@163.com)
 */

import {checkProperties, grade} from 'helper';
import {log} from 'log';

/* eslint-disable fecs-camelcase */
checkProperties(self, {
    fetch: 0.5,
    Request: 1,
    Response: 0.5,
    Headers: 1
});
/* eslint-enable fecs-camelcase */

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    log('fetch sw: onfetch');

    grade('fetchEvent', 1);
    checkProperties(e, ['request', 'respondWith'], 1, {prefix: 'fetchEvent.'});
    log('fetch sw: get url', e.request.url);

    let url = new URL(e.request.url);

    log('fetch sw: create new url', url.pathname);

    if (/\/whoareyou\.json$/.test(url.pathname)) {
        let mock = {im: 'fetch-sw'};
        log('fetch sw: mock respone', mock);

        e.respondWith(new Response(
            JSON.stringify(mock),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ));
    }
});
