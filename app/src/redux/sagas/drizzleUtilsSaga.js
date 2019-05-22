import { call, put, select } from 'redux-saga/effects';
import getContractInstance from "@drizzle-utils/get-contract-instance";
import getWeb3 from "@drizzle-utils/get-web3";
import Web3 from "web3";

import Forum from '../../contracts/Forum';
import { WEB3_UTILS_SAGA_INITIALIZED } from '../actions/web3UtilsActions';
import { DRIZZLE_INITIALIZED } from '../actions/drizzleActions';
import { fork, take } from 'redux-saga/effects';

const accounts = state => state.accounts;
let initFlag, web3, forumContract;

function* init() {
  if (!initFlag) {
    try{
      const host = "http://127.0.0.1:8545"; //Ganache development blockchain
      const fallbackProvider = new Web3.providers.HttpProvider(host);
      web3 = yield call(getWeb3, { fallbackProvider });

      forumContract = yield call(getContractInstance, { web3, artifact: Forum });
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
    console.warn('Attempted to reinitialize drizzleUtilsSaga!');
}

// If the method below proves to be problematic/ineffective (i.e. getting current account
// from state), consider getting it from @drizzle-utils/get-accounts instead
// with (yield call(getAccounts, {web3}))[0];
function* getCurrentAccount() {
  return (yield select(accounts))[0];
}

function* drizzleUtilsSaga() {
  yield take(DRIZZLE_INITIALIZED);
  yield fork(init);
}

export { web3, forumContract, getCurrentAccount };

export default drizzleUtilsSaga;
