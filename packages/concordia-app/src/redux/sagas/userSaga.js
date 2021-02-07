/* eslint-disable no-console */
import {
  all, call, put, take, takeLatest,
} from 'redux-saga/effects';
import { drizzleActions } from '@ezerous/drizzle';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { USER_DATA_UPDATED, USER_DATA_ERROR } from '../actions/userActions';
import { FORUM_EVENT_USER_SIGNED_UP } from '../actions/contractEventActions';

function* fetchUserData({ drizzle, account }) {
  const contract = drizzle.contracts[FORUM_CONTRACT];
  const transaction = yield call(contract.methods.hasUserSignedUp, account);

  try {
    const dispatchArgs = { address: account };
    const callResult = yield call(transaction.call, { address: account });

    // User has signed up, fetch his username
    if (callResult) {
      const txObj2 = yield call(contract.methods.getUsername, account);
      dispatchArgs.username = yield call(txObj2.call, {
        address: account,
      });
    }

    yield put({
      type: USER_DATA_UPDATED, ...dispatchArgs,
    });
  } catch (error) {
    console.error(error);
    yield put({ type: USER_DATA_ERROR });
  }
}

function* userHasSignedUp({ event }) {
  yield put({
    type: USER_DATA_UPDATED,
    ...{
      address: event.returnValues.userAddress, username: event.returnValues.username,
    },
  });
}

function* userSaga() {
  const res = yield all([
    take(drizzleActions.drizzle.DRIZZLE_INITIALIZED),
    take(drizzleActions.account.ACCOUNTS_FETCHED),
  ]);

  yield fetchUserData({ drizzle: res[0].drizzle, account: res[1].accounts[0] });

  yield takeLatest(FORUM_EVENT_USER_SIGNED_UP, userHasSignedUp);
}

export default userSaga;
