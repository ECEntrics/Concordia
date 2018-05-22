import { put, takeLatest } from 'redux-saga/effects'

let contractGrabbed=false;
let grabbedContract;

function* grabContract({contract}) {
    if(!contractGrabbed)
    {
        contractGrabbed=true;
        grabbedContract = contract;
        yield put({type: 'CONTRACT_GRABBED', ...[]});
    }
}

function* contractSaga() {
    yield takeLatest('LISTEN_FOR_EVENT', grabContract);
}

export  { contractSaga, grabbedContract };
