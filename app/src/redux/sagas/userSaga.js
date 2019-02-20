import { call, put, take, takeEvery } from 'redux-saga/effects'

import { contract, getCurrentAccount } from './drizzleUtilsSaga';

let account;

function* updateUserData() {
    const currentAccount = yield call(getCurrentAccount);
    if(currentAccount!==account) {
        account = currentAccount;
        yield put({type: 'ACCOUNT_CHANGED', ...[]});
    }
    const txObj1 = yield call(contract.methods["hasUserSignedUp"], ...[account]);
    try {
        const callResult = yield call(txObj1.call, {address:account});
        if(callResult) {
            const txObj2 = yield call(contract.methods["getUsername"], ...[account]);
            const username = yield call(txObj2.call, {address:account});
            const dispatchArgs = {
                address: account,
                username: username
            };
            yield put({type: 'USER_HAS_SIGNED_UP', ...dispatchArgs});
        }
        else{
            const dispatchArgs = {
                address: account
            };
            yield put({type: 'USER_IS_GUEST', ...dispatchArgs});
        }
    }
    catch (error) {
        console.error(error);
        yield put({type: 'USER_FETCHING_ERROR', ...[]})
    }
}


function* userSaga() {
    yield take("DRIZZLE_UTILS_SAGA_INITIALIZED");
    yield takeEvery("ACCOUNTS_FETCHED", updateUserData);
}

export default userSaga;
