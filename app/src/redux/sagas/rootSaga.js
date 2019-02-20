import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import drizzleUtilsSaga from './drizzleUtilsSaga'
import userSaga from './userSaga';
import orbitSaga from "./orbitSaga";

export default function* root() {
    let sagas = [...drizzleSagas, drizzleUtilsSaga, orbitSaga, userSaga];
    yield all(
        sagas.map(saga => fork(saga))
    )
}