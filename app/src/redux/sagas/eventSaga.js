import {  put, takeEvery } from 'redux-saga/effects';
import { EVENT_FIRED } from '../actions/drizzleActions';

const CONTRACT_EVENT_FIRED = 'CONTRACT_EVENT_FIRED';

let eventSet = new Set();

// Entire purpose of this saga is to bypass a strange bug where EVENT_FIRED is called multiple times
// for the same event
function* sanitizeEvent(action) {
  const size = eventSet.size;
  eventSet.add(action.event.transactionHash + action.name);
  if(eventSet.size>size)
    yield put({ ...action, type: CONTRACT_EVENT_FIRED });
}

function* eventSaga() {
  yield takeEvery(EVENT_FIRED, sanitizeEvent);
}

export default eventSaga;
export { CONTRACT_EVENT_FIRED }
