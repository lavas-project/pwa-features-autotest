/**
 * @file sync-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {featureStore} from 'store';
import {sleep} from 'helper';

(async function () {
    console.log('<< sync test >>');

    // sw support
    if (!navigator.serviceWorker) {
        return;
    }

    featureStore.setItem('syncEvent', 0);

    // syncEvent
    console.log('- syncEvent test -');
    const reg = await navigator.serviceWorker.register('./sw-sync.js', {scope: '/cases/sync/'});
    await sleep(3000);

    // sync register
    try {
        const tags = await reg.sync.getTags();
        if (tags.includes('syncEventTest')) {
            console.log('exist syncEventTest background');
        }
        else {
            reg.sync.register('syncEventTest');
            console.log('Sync registered');
        }
    }
    catch (error) {
        console.error('It broke (probably sync not supported or flag not enabled)');
        console.error(error.message);
        return;
    }

    await reg.unregister();
})();
