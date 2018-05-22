import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import {grabbedContract as contract} from "./contractSaga";

const contractWasGrabbed = (state) => state.forumContract.grabbed;
const accounts = (state) => state.accounts;
let account;

let initFlag = false;


function* initUser() {
    if(!initFlag)
    {
        while(true)
            if(yield select(contractWasGrabbed))
            {
                yield call(getUserData);
                initFlag=true;
                break;
            }
    }
}


function* updateUserData() {
    if(initFlag)
        yield call(getUserData);
}


function* getUserData() {
    const currentAccount = (yield select(accounts))[0];
    if(currentAccount!==account)
    {
        account = currentAccount;
        yield put({type: 'ACCOUNT_CHANGED', ...[]});
    }
    const txObj1 = yield call(contract.methods["hasUserSignedUp"], ...[account]);
    try {
        const callResult = yield call(txObj1.call, {address:account});
        if(callResult)
        {
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
                address: account,
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
    yield takeLatest("DRIZZLE_INITIALIZED", initUser);
    yield takeEvery("ACCOUNTS_FETCHED", updateUserData);
}

export default userSaga;
