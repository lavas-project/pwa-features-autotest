/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import fetchCase from '../cases/fetch/sequence';
import syncCase from '../cases/sync/sequence';
import lifecycleCase from '../cases/lifecycle/sequence';
import cacheCase from '../cases/cache/sequence';
import getregistrationCase from '../cases/getregistration/sequence';
import indexeddbCase from '../cases/indexeddb/sequence';
import notificationCase from '../cases/notification/sequence';
import postmessageCase from '../cases/postmessage/sequence';
import pushCase from '../cases/push/sequence';

export default [
    fetchCase,
    syncCase,
    lifecycleCase,
    cacheCase,
    getregistrationCase,
    indexeddbCase,
    notificationCase,
    postmessageCase,
    pushCase
];

