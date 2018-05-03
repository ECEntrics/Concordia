import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import userSaga from "./userSaga";

export default function* root() {
    let sagas = [...drizzleSagas,userSaga];
    yield all(
        sagas.map(saga => fork(saga))
    )
}