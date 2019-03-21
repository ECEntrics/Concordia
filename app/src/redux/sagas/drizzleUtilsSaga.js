import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getContractInstance, getWeb3 } from '../../utils/drizzleUtils';

import Forum from '../../contracts/Forum';
import { DRIZZLE_UTILS_SAGA_INITIALIZED } from '../actions/drizzleUtilsActions';

const accounts = state => state.accounts;
let initFlag, web3, forumContract;

function* init() {
  if (!initFlag) {
    web3 = yield call(getWeb3);
    forumContract = yield call(getContractInstance, {
      web3, artifact: Forum
    });
    initFlag = true;
    yield put({
      type: DRIZZLE_UTILS_SAGA_INITIALIZED, ...[]
    });
  }
  else console.warn('Attempted to reinitialize drizzleUtilsSaga!');
}

// If the method below proves to be problematic/ineffective (i.e. getting current account
// from state), consider getting it from @drizzle-utils/get-accounts instead
// with (yield call(getAccounts, {web3}))[0];
function* getCurrentAccount() {
  return (yield select(accounts))[0];
}

function* drizzleUtilsSaga() {
  yield takeLatest('DRIZZLE_INITIALIZED', init);
}

export { web3, forumContract, getCurrentAccount };

export default drizzleUtilsSaga;
