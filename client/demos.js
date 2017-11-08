/**
 * @file client entry js file
 * @author clark-t (clarktanglei@163.com)
 */

import fetchCase from '../cases/fetch/sequence'; // ok
import syncCase from '../cases/sync/sequence'; // ok
import lifecycleCase from '../cases/lifecycle/sequence'; // 数据统计2个读取null onstatechange+activate.eventUtil
import cacheCase from '../cases/cache/sequence'; // 数据统计读取多个属性null
import getregistrationCase from '../cases/getregistration/sequence'; // 数据统计1个s读取null
import indexeddbCase from '../cases/indexeddb/sequence'; // 数据统计1个s读取null，getAll
import notificationCase from '../cases/notification/sequence';
import postmessageCase from '../cases/postmessage/sequence'; // ok
import pushCase from '../cases/push/sequence';
import deviceapiCase from '../cases/deviceapi/sequence';
import clientCase from '../cases/client/sequence';
import credentialsCase from '../cases/credentials/sequence';

export default [
    lifecycleCase,
    getregistrationCase,
    clientCase,
    fetchCase,
    indexeddbCase,
    cacheCase,
    syncCase,
    postmessageCase,
    notificationCase,
    pushCase,
    deviceapiCase,
    credentialsCase
];

