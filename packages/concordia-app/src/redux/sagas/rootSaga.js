import { all, fork } from 'redux-saga/effects';
import { drizzleSagas } from '@ezerous/drizzle';
import { breezeSagas } from '@ezerous/breeze'
import orbitSaga from './orbitSaga'

export default function* root() {
    const sagas = [
        ...drizzleSagas,
        ...breezeSagas,
        orbitSaga
    ];
    yield all(
        sagas.map((saga) => fork(saga)),
    );
}
