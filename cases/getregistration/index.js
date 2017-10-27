/**
 * @file getregistration by iframe
 * @author clark-t (clarktanglei@163.com)
 */

import {run} from 'base';
import caseCreator from './demo';

const SCOPE = '/cases/getregistration/';

// let case = caseCreator(SCOPE);

run(caseCreator(SCOPE));

