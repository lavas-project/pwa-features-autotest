/**
 * @file fetch & fetchEvent test
 * @author clark-t (clarktanglei@163.com)
 */

import {run} from 'base';
import caseCreator from './demo';

const SCOPE = '/cases/fetch/';

// let case = caseCreator(SCOPE);

run(caseCreator(SCOPE));

