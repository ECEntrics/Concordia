import { all, fork } from 'redux-saga/effects';
import { drizzleSagas } from '@ezerous/drizzle';
import { breezeSagas } from '@ezerous/breeze';
import orbitSaga from './orbitSaga';
import userSaga from './userSaga';
import peerDbReplicationSaga from './peerDbReplicationSaga';

export default function* root() {
  const sagas = [
    ...drizzleSagas,
    ...breezeSagas,
    orbitSaga,
    userSaga,
    peerDbReplicationSaga,
  ];
  yield all(
    sagas.map((saga) => fork(saga)),
  );
}
