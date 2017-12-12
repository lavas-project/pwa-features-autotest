/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */
// import 'whatwg-fetch';
import {checkProperties} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'navigator.credentials',
    'PasswordCredential',
    'FederatedCredential',
    'navigator.credentials.store',
    'navigator.credentials.get'
];

export default function (scope) {
    return {
        name: 'credentials',
        scope: scope,
        features: CHECK_LIST,
        async main() {
            log('credentials: start');

            await checkProperties(window, CHECK_LIST, 1);

            log('credentials: test finish');
        },
        error(e) {
            log('credentials: catch unhandled error');
            log(e);
        }
    };
}
