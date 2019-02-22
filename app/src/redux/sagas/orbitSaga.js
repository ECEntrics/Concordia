import { call, put, take, takeLatest } from 'redux-saga/effects'
import { contract, getCurrentAccount} from './drizzleUtilsSaga';
import { loadDatabases } from '../../orbit'

let latestAccount;

function* getOrbitDBInfo() {
    yield put({type: 'ORRBIT_GETTING_INFO', ...[]});
    const account = yield call(getCurrentAccount);
    if(account!==latestAccount) {
        //console.log("Deleting local storage..");
        //localStorage.clear();
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
    yield take("DRIZZLE_UTILS_SAGA_INITIALIZED");
    yield take('IPFS_INITIALIZED');
    yield takeLatest("ACCOUNT_CHANGED", getOrbitDBInfo);    //TODO: takeEvery (?)
}

export default orbitSaga;
