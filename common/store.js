/**
 * @file store.js
 * @author clark-t (clarktanglei@163.com)
 */

import localforage from 'localforage';

/**
 * get storage instance by store name
 *
 * @param {string} storeName store name
 * @return {Object} storage instance
 */
export function getStore(storeName) {
    return localforage.createInstance({
        name: 'pwaTest',
        version: 1.0,
        driver: localforage.INDEXEDDB,
        storeName: storeName
    });
}

export default getStore;

/**
 * an indexedDB storage instance for the scores of pwa features
 *
 * @type {Object}
 */
export const featureStore = getStore('feature');

/**
 * an indexedDB storage instance for the browser's ua information
 *
 * @type {Object}
 */
export const uaStore = getStore('ua');

/**
 * an indexedDB storage instance for uuid
 *
 * @type {Object}
 */
export const uuidStore = getStore('uuid');
