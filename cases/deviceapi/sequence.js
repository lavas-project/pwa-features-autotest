/**
 * @file deviceapi-test-test entry for test in order
 * @author ruoran (liuruoran@baidu.com)
 */

import caseCreator from './demo';

const SCOPE = process.env.ROUTE_PREFIX + '/';

export default caseCreator(SCOPE);
