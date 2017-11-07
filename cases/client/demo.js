/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */
// import 'whatwg-fetch';
import {register, sleep, grade} from 'helper';
import {log} from 'log';

export default function (scope) {
    return {
        name: 'client',
        scope: scope,
        features: [
            'clients',
            'clients.get',
            'clients.matchAll',
            // 'clients.openWindow',
            'clients.claim'
            // ,
            // 'client.focus',
            // 'client.navigate'
        ],
        async main() {
            log('client: start');

            let reg = await register(scope + 'sw-client.js', scope);

            log('client: sleep for 5s');

            await sleep(5000);

            if (navigator.serviceWorker.controller) {
                if (navigator.serviceWorker.controller.state === 'activated') {
                    grade('clients.claim', 1);
                    log('client: clients.claim works');
                }
            }

            await reg.unregister();

            log('client: test finish');
        },
        error(e) {
            log('client: catch unhandled error');
            log(e);
        }
    };
}
