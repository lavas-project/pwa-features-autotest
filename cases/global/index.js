/**
 * @file global test
 * @author clark-t (clarktanglei@163.com)
 */

setTimeout(function () {
    parent
    && parent.result
    && typeof parent.result === 'function'
    && parent.result('global', 'haha')
    || console.log('global haha...');
}, 5000);

console.log('in global');