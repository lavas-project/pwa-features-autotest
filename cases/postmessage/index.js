/**
 * @file postmessage-test by iframe
 * @author ruoran (liuruoran@baidu.com)
 */

import {run} from 'base';
import caseCreator from './demo';

const SCOPE = '/cases/postmessage/';

// let case = caseCreator(SCOPE);

run(caseCreator(SCOPE));

