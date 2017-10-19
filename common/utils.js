/**
 * @file common tools
 * @author ruoran (liuruoran@baidu.com)
 */

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function get(obj, ...arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!obj || typeof obj !== 'object') {
            return undefined;
        }

        obj = obj[arr[i]];
    }

    return obj;
}
