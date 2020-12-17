import { all, fork } from 'redux-saga/effects';
import { drizzleSagas } from '@ezerous/drizzle';
import { breezeSagas } from '@ezerous/breeze';
import orbitSaga from './orbitSaga';
import userSaga from './userSaga';
import peerDbReplicationSaga from './peerDbReplicationSaga';
import eventSaga from './eventSaga';

export default function* root() {
  const sagas = [
    ...drizzleSagas,
    ...breezeSagas,
    eventSaga,
    orbitSaga,
    userSaga,
    peerDbReplicationSaga,
  ];
  yield all(
    sagas.map((saga) => fork(saga)),
  );
}
