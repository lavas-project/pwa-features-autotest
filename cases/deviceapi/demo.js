/**
 * @file deviceapi-test
 * @author ruoran (liuruoran@baidu.com)
 */

import {grade, sleep} from 'helper';
import {log} from 'log';

const CHECK_LIST = [
    'DeviceOrientationEvent',
    'DeviceMotionEvent',
    'navigator.geolocation',
    'navigator.geolocation.getCurrentPosition',
    'navigator.geolocation.watchPosition',
    'navigator.geolocation.clearWatch'
];

export default function (scope) {
    return {
        name: 'deviceapi',
        scope: scope,
        features: CHECK_LIST,
        async main() {

            log('<< deviceapi test >>');

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

            // navigator.geolocation test
            if (navigator.geolocation) {
                await grade('navigator.geolocation', 1);
                log('-- navigator.geolocation done --', 1, navigator.geolocation);

                // getCurrentPosition
                // "Network location provider at 'https://www.googleapis.com/' : No response received."
                await new Promise((resolve, reject) => {
                    let done = 0;
                    navigator.geolocation.getCurrentPosition(
                        async position => {
                            done = 1;
                            resolve();
                            await grade('navigator.geolocation.getCurrentPosition', 1);
                            log('-- navigator.geolocation.getCurrentPosition done --', 1, position);
                        },
                        (e) => {
                            reject();
                            log('getCurrentPosition error:', e);
                        }
                    );
                    setTimeout(() => {
                        if (!done) {
                            log('getCurrentPosition timeout');
                            return resolve();
                        }
                    }, 3000);
                });

                let watchId;

                // watchPosition
                // "Network location provider at 'https://www.googleapis.com/' : No response received."
                await new Promise(async (resolve, reject) => {
                    let done = 0;
                    watchId = await navigator.geolocation.watchPosition(
                        async position => {
                            done = 1;
                            resolve();
                            await grade('navigator.geolocation.watchPosition', 1);
                            log('-- navigator.geolocation.watchPosition done --', 1, position);
                        },
                        (e) => {
                            reject();
                            log('watchPosition error:', e);
                        }
                    );
                    setTimeout(() => {
                        if (!done) {
                            log('watchPosition timeout');
                            return resolve();

                        }
                    }, 3000);

                    await sleep(3000);
                    if (watchId) {
                        // clearWatch
                        navigator.geolocation.clearWatch(watchId);
                        // await grade('navigator.geolocation.clearWatch', 1);
                        // log('-- navigator.geolocation.clearWatch done --', 1);
                    }
                });

            }

            log('deviceapi: test finish');
        }
    };
}

