import { all, fork } from 'redux-saga/effects';
import { drizzleSagas } from 'drizzle';
import web3UtilsSaga from './web3UtilsSaga';
import userSaga from './userSaga';
import orbitSaga from './orbitSaga';
import transactionsSaga from './transactionsSaga';
import eventSaga from './eventSaga';

export default function* root() {
  const sagas = [
    ...drizzleSagas,
    web3UtilsSaga,
    orbitSaga,
    userSaga,
    eventSaga,
    transactionsSaga];
  yield all(
    sagas.map(saga => fork(saga)),
  );
}
