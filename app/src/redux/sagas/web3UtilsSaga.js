import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getContractInstance, getWeb3 } from '../../utils/web3Utils';

import Forum from '../../contracts/Forum';
import { WEB3_UTILS_SAGA_INITIALIZED } from '../actions/web3UtilsActions';
import { DRIZZLE_INITIALIZED } from '../actions/drizzleActions';

const accounts = state => state.accounts;
let initFlag, web3, forumContract;

function* init() {
  if (!initFlag) {
    try{
      web3 = yield call(getWeb3);
      forumContract = yield call(getContractInstance, {
        web3, artifact: Forum
      });
      initFlag = true;
      yield put({
        type: WEB3_UTILS_SAGA_INITIALIZED, ...[]
      });
    }
    catch (error) {
      console.error(`Error while initializing web3UtilsSaga: ${error}`);
    }
  }
  else
    console.warn('Attempted to reinitialize web3UtilsSaga!');
}

// If the method below proves to be problematic/ineffective (i.e. getting current account
// from state), consider getting it from @drizzle-utils/get-accounts instead
// with (yield call(getAccounts, {web3}))[0];
function* getCurrentAccount() {
  return (yield select(accounts))[0];
}

function* web3UtilsSaga() {
  yield takeLatest(DRIZZLE_INITIALIZED, init);
}

export { web3, forumContract, getCurrentAccount };

export default web3UtilsSaga;
