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
import deviceapiCase from '../cases/deviceapi/sequence';
import clientCase from '../cases/client/sequence';
import credentialsCase from '../cases/credentials/sequence';
import paymentCase from '../cases/payment/sequence';

export default [
    lifecycleCase,
    fetchCase,
    indexeddbCase,
    clientCase,
    cacheCase,
    syncCase,
    postmessageCase,
    getregistrationCase,
    notificationCase,
    pushCase,
    deviceapiCase,
    credentialsCase,
    paymentCase
];

