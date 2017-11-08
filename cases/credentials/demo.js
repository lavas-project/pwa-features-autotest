/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */
// import 'whatwg-fetch';
import {sleep, grade, checkProperties} from 'helper';
import {log} from 'log';

export default function (scope) {
    return {
        name: 'credentials',
        scope: scope,
        features: [
            'navigator.credentials',
            'PasswordCredential',
            'FederatedCredential',
            'navigator.credentials.store',
            'navigator.credentials.get'
        ],
        async main() {
            log('credentials: start');

            checkProperties(
                window,
                [
                    'navigator.credentials',
                    'PasswordCredential',
                    'FederatedCredential',
                    'navigator.credentials.store',
                    'navigator.credentials.get'
                ],
                1
            );

            log('credentials: test finish');
        },
        error(e) {
            log('credentials: catch unhandled error');
            log(e);
        }
    };
}
