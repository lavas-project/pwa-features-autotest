/**
 * @file fetch sw
 * @author clark-t (clarktanglei@163.com)
 */

import {checkProperties, grade, sleep} from 'helper';

// self.addEventListener('install', e => {
//     console.log('oninstall');
//     self.skipWaiting();
// });

// self.addEventListener('activate', e => {
//     console.log('onactivate');
//     e.waitUntil(sleep(10000).then(() => {
//         console.log('sleep for 10000');
//         // self.clients.claim();
//     }))
//     // self.clients.claim();
// });

self.addEventListener('fetch', e => {
    console.log('onfetch');
    grade('fetchEvent', 1);
    checkProperties(e, ['request', 'respondWith'], 1, {prefix: 'fetchEvent.'});
    let url = new URL(e.request.url);
    if (url.pathname.endsWith('/whoareyou.json')) {
        e.respondWith(new Response(
            JSON.stringify({im: 'fetch-sw'}),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ));
    }
});
