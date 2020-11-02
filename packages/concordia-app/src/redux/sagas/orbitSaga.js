import { put, all, take } from 'redux-saga/effects';

import { breezeActions } from '@ezerous/breeze';
import { drizzleActions } from '@ezerous/drizzle';

function* initOrbitDatabases(action) {
  const { account, breeze } = action;
  yield put(breezeActions.orbit.orbitInit(breeze, account)); // same as breeze.initOrbit(account);
}

function* orbitSaga() {
  const res = yield all([
    take(drizzleActions.drizzle.DRIZZLE_INITIALIZED),
    take(breezeActions.breeze.BREEZE_INITIALIZED),
    take(drizzleActions.account.ACCOUNTS_FETCHED),
  ]);

  yield initOrbitDatabases({ breeze: res[1].breeze, account: res[2].accounts[0] });
}

export default orbitSaga;