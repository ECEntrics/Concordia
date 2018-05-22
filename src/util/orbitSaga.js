import { loadDatabases } from './../util/orbit'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import {grabbedContract as contract} from "../contractSaga";

const accounts = (state) => state.accounts;

let latestAccount;

function* getOrbitDBInfo() {
    yield put({type: 'ORRBIT_GETTING_INFO', ...[]});
    const account = (yield select(accounts))[0];
    if(account!==latestAccount)
    {
        console.log("Deleting local storage..");
        localStorage.clear();
        const txObj1 = yield call(contract.methods["hasUserSignedUp"], ...[account]);
        try {
            const callResult = yield call(txObj1.call, {address:account});
            if(callResult) {
                const txObj2 = yield call(contract.methods["getOrbitDBInfo"], ...[account]);
                const info = yield call(txObj2.call, {address: account});
                //TODO: update localStorage OrbitDB stuff
                yield call(loadDatabases, info[0], info[1], info[2],info[3], info[4]);
            }
            else
                yield put({type: 'DATABASES_NOT_READY', ...[]});

            latestAccount=account;
        }
        catch (error) {
            console.error(error);
            yield put({type: 'ORBIT_SAGA_ERROR', ...[]});
        }

    }
}

function* orbitSaga() {
    yield takeLatest("ACCOUNT_CHANGED", getOrbitDBInfo);
}

export default orbitSaga;
