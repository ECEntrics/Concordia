import { all, fork } from 'redux-saga/effects';
import { drizzleSagas } from 'drizzle';
import drizzleUtilsSaga from './drizzleUtilsSaga';
import userSaga from './userSaga';
import orbitSaga from './orbitSaga';
import transactionsSaga from './transactionsSaga';

export default function* root() {
  const sagas = [
    ...drizzleSagas,
    drizzleUtilsSaga,
    orbitSaga,
    userSaga,
    transactionsSaga];
  yield all(
    sagas.map(saga => fork(saga)),
  );
}
