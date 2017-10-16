/**
 * @file common tools
 * @author ruoran (liuruoran@baidu.com)
 */

// uuid
export function init() {

}


// uuid
export function uuid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() + '-' + Date.now());
}
