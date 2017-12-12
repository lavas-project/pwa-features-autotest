/**
 * @file payment-test
 * @author ruoran (liuruoran@baidu.com)
 *
 * reference: https://developers.google.com/web/fundamentals/payments
 */

import {sleep, grade} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'paymentRequest',
    'paymentRequest.show',
    'paymentRequest.abort'
];

const METHOD_DATA = [
    {
        supportedMethods: ['visa', 'mastercard', 'amex', 'discover', 'maestro',
            'diners', 'jcb', 'unionpay', 'bitcoin']
    }
];

const DETAILS = {
    displayItems: [
        {
            label: 'Original donation amount',
            amount: {currency: 'USD', value: '10.00'} // US$10.00
        },
        {
            label: 'Friends and family discount',
            amount: {currency: 'USD', value: '-9.99'}, // -US$9.99
            pending: true // The price is not determined yet
        }
    ],
    total: {
        label: 'Total',
        amount: {currency: 'USD', value: '0.01'} // US$55.00
    },
    shippingOptions: [
        {
            id: 'standard',
            label: 'Standard shipping',
            amount: {currency: 'USD', value: '0.00'},
            selected: true
        },
        {
            id: 'express',
            label: 'Express shipping',
            amount: {currency: 'USD', value: '12.00'}
        }
    ]
};

const OPTIONS = {};



export default function (scope) {
    return {
        name: 'payment',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< payment test >>');

            if (!window.PaymentRequest) {
                log('no-support PaymentRequest');
                return;
            }

            const request = new PaymentRequest(
                METHOD_DATA, // required payment method data
                DETAILS,     // required information about transaction
                OPTIONS      // optional parameter for things like shipping, etc.
            );
            await grade('paymentRequest', 1);
            log('-- new paymentRequest done --', 1, request);

            if (request && request.show) {
                await grade('paymentRequest.show', 1);
                log('-- paymentRequest.show done --', 1);
                request.show()
                .then(paymentResponse => {
                    log('-- paymentResponse done --', 1, paymentResponse);
                    // Process paymentResponse here
                    paymentResponse.complete('success').then(res => {
                        log('-- paymentResponse.complete done --', 1, paymentResponse);
                    });
                })
                .catch(err => {
                    log('Uh oh, something bad happened', err.message);
                });
            }

            if (request && request.abort) {
                setTimeout(() => {
                    request.abort()
                    .then(async () => {
                        await grade('paymentRequest.abort', 1);
                        log('-- paymentRequest.abort done --', 1);
                    })
                    .catch(() => {
                        log('Unable to abort.');
                    });
                }, 3000);
            }

            await sleep(3000);

            log('payment: test finish');
        },
        error(e) {
            log('payment: catch unhandled error');
            log(e);
        }
    };
}





