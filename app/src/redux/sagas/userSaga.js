import { call, put, select, take, takeEvery } from 'redux-saga/effects';

import { forumContract, getCurrentAccount } from './drizzleUtilsSaga';
import { DRIZZLE_UTILS_SAGA_INITIALIZED } from '../actions/drizzleUtilsActions';
import {
  ACCOUNT_CHANGED,
  AUTH_USER_DATA_UPDATED,
  GUEST_USER_DATA_UPDATED,
  USER_FETCHING_ERROR
} from '../actions/userActions';
import { ACCOUNTS_FETCHED } from '../actions/drizzleActions';

let account;

function* updateUserData() {
  const currentAccount = yield call(getCurrentAccount);
  if (currentAccount !== account) {
    account = currentAccount;
    yield put({
      type: ACCOUNT_CHANGED, ...[]
    });
  }
  const txObj1 = yield call(forumContract.methods.hasUserSignedUp, ...[account]);
  try {
    const userState = yield call(getUserState);
    const callResult = yield call(txObj1.call, {
      address: account
    });
    if (callResult) {
      const txObj2 = yield call(forumContract.methods.getUsername, ...[account]);
      const username = yield call(txObj2.call, {
        address: account
      });
      if (account !== userState.address || username !== userState.username) {
        const dispatchArgs = {
          address: account,
          username
        };
        yield put({
          type: AUTH_USER_DATA_UPDATED, ...dispatchArgs
        });
      }
    } else if (account !== userState.address) {
      const dispatchArgs = {
        address: account
      };
      yield put({
        type: GUEST_USER_DATA_UPDATED, ...dispatchArgs
      });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: USER_FETCHING_ERROR, ...[]
    });
  }
}

function* getUserState() {
  return yield select(state => state.user);
}

function* userSaga() {
  yield take(DRIZZLE_UTILS_SAGA_INITIALIZED);
  yield takeEvery(ACCOUNTS_FETCHED, updateUserData);
}

export default userSaga;
