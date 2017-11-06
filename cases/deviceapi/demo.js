/**
 * @file deviceapi-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {grade} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'navigator.geolocation',
    // 'navigator.geolocation.getCurrentPosition',
    // 'navigator.geolocation.watchPosition',
    'DeviceOrientationEvent',
    'DeviceMotionEvent'
];

export default function (scope) {
    return {
        name: 'deviceapi',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< deviceapi test >>');

            // navigator.geolocation test
            if (navigator.geolocation) {
                await grade('navigator.geolocation', 1);
                log('-- navigator.geolocation done --', 1, navigator.geolocation);

                // // getCurrentPosition test
                // // "Network location provider at 'https://www.googleapis.com/' : No response received."
                // await navigator.geolocation.getCurrentPosition(
                //     async position => {
                //         await grade('navigator.geolocation.getCurrentPosition', 1);
                //         log('-- navigator.geolocation.getCurrentPosition done --', 1, position);
                //     },
                //     (e) => {
                //         log('getCurrentPosition error:', e);
                //     }
                // );
                // // watchPosition
                // // "Network location provider at 'https://www.googleapis.com/' : No response received."
                // await navigator.geolocation.watchPosition(
                //     async position => {
                //         await grade('navigator.geolocation.watchPosition', 1);
                //         log('-- navigator.geolocation.watchPosition done --', 1, position);
                //     },
                //     (e) => {
                //         log('watchPosition error:', e);
                //     }
                // );
            }

            // DeviceOrientationEvent test
            if (window.DeviceOrientationEvent) {
                await grade('DeviceOrientationEvent', 1);
                log('-- DeviceOrientationEvent done --', 1);
            }

            // DeviceMotionEvent test
            if (window.DeviceMotionEvent) {
                await grade('DeviceMotionEvent', 1);
                log('-- DeviceMotionEvent done --', 1);
            }

            log('deviceapi: test finish');
        }
    };
}

