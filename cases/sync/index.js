/**
 * @file sync-test by iframe
 * @author ruoran (liuruoran@baidu.com)
 */

import {run} from 'base';
import caseCreator from './case';

const SCOPE = '/cases/sync/';

// let case = caseCreator(SCOPE);

run(caseCreator(SCOPE));

