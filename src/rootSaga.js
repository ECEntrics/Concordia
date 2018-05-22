import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import { contractSaga } from "./contractSaga";
import userSaga from "./userSaga";
import orbitSaga from "./util/orbitSaga";

export default function* root() {
    let sagas = [...drizzleSagas,userSaga,orbitSaga,contractSaga];
    yield all(
        sagas.map(saga => fork(saga))
    )
}