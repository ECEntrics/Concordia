import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'

const accounts = (state) => state.accounts;
let account;

let initFlag = false;

let forumContract;
let contractGrabbed = false;


function* initUser() {
    if(!initFlag)
    {
        while(true)
            if(contractGrabbed)
            {
                yield call(getUserData);
                initFlag=true;
                break;
            }
    }
}

function grabContract({contract}) {
    if(!contractGrabbed)
    {
        forumContract = contract;
        contractGrabbed=true;
    }
}

function* updateUserData() {
    if(initFlag)
        yield call(getUserData);
}


function* getUserData() {
    account = (yield select(accounts))[0];
    forumContract.methods["hasUserSignedUp"].cacheCall(...[account]);
    const txObj1 = yield call(forumContract.methods["hasUserSignedUp"], ...[account]);
    try {
        const callResult = yield call(txObj1.call, {address:account});
        if(callResult)
        {
            const txObj2 = yield call(forumContract.methods["getUsername"], ...[account]);
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
    yield takeLatest('LISTEN_FOR_EVENT', grabContract);
    yield takeLatest("DRIZZLE_INITIALIZED", initUser);
    yield takeEvery("ACCOUNTS_FETCHED", updateUserData);
}

export default userSaga;
