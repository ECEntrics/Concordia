import { put, takeEvery } from 'redux-saga/effects';
import { CONTRACT_EVENT_FIRED } from '@ezerous/drizzle/src/contracts/constants';

function* eventBreakDown({ event }) {
  yield put({ type: event.event, event: { ...event } });
}

function* eventSaga() {
  yield takeEvery(CONTRACT_EVENT_FIRED, eventBreakDown);
}

export default eventSaga;
