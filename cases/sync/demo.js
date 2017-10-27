/**
 * @file sync-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {sleep} from 'helper';
import {log} from 'log';
const CHECK_LIST = [
    'syncEvent'
];

export default function (scope) {
    return {
        name: 'sync',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< sync test >>');

            // sw support
            if (!navigator.serviceWorker) {
                return;
            }

            log('start to register sync sw');
            // syncEvent test
            const reg = await navigator.serviceWorker.register(scope + 'sw-sync.js', {scope});
            log('sync sw registered', reg);

            await sleep(3000);



            if (reg && reg.sync) {
                log('has sync object');
                 // sync register
                try {
                    const tags = await reg.sync.getTags();
                    if (tags.includes('syncEventTest')) {
                        log('exist syncEventTest background');
                    }
                    else {
                        reg.sync.register('syncEventTest');
                        log('sync registered');
                    }
                }
                catch (error) {
                    log('It broke (probably sync not supported or flag not enabled)', error.message);
                    // console.error(error.message);
                    return;
                }
            }

            log('sleep for 5000');

            await sleep(5000);
            await reg.unregister();
            log('sync: test finish');
        },
        error(e) {
            log('sync: catch unhandled error');
            log(e);
        }
    };
}

