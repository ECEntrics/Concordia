import { call, put, select, take, takeEvery } from 'redux-saga/effects';

import { contract, getCurrentAccount } from './drizzleUtilsSaga';
import { DRIZZLE_UTILS_SAGA_INITIALIZED } from '../actions/drizzleUtilsActions';

let account;

function* updateUserData() {
  const currentAccount = yield call(getCurrentAccount);
  if (currentAccount !== account) {
    account = currentAccount;
    yield put({
      type: 'ACCOUNT_CHANGED', ...[]
    });
  }
  const txObj1 = yield call(contract.methods.hasUserSignedUp, ...[account]);
  try {
    const userState = yield call(getUserState);
    const callResult = yield call(txObj1.call, {
      address: account
    });
    if (callResult) {
      const txObj2 = yield call(contract.methods.getUsername, ...[account]);
      const username = yield call(txObj2.call, {
        address: account
      });
      if (account !== userState.address || username !== userState.username) {
        const dispatchArgs = {
          address: account,
          username
        };
        yield put({
          type: 'USER_DATA_UPDATED_(AUTHENTICATED)', ...dispatchArgs
        });
      }
    } else if (account !== userState.address) {
      const dispatchArgs = {
        address: account
      };
      yield put({
        type: 'USER_DATA_UPDATED_(GUEST)', ...dispatchArgs
      });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: 'USER_FETCHING_ERROR', ...[]
    });
  }
}

function* getUserState() {
  return yield select(state => state.user);
}

function* userSaga() {
  yield take(DRIZZLE_UTILS_SAGA_INITIALIZED);
  yield takeEvery('ACCOUNTS_FETCHED', updateUserData);
}

export default userSaga;
