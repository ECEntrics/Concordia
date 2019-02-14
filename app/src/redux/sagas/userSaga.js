import getWeb3 from "@drizzle-utils/get-web3";
import getContractInstance from "@drizzle-utils/get-contract-instance";
import getAccounts from "@drizzle-utils/get-accounts";
import { call, put, take, takeLatest, takeEvery } from 'redux-saga/effects'

import Forum from "../../contracts/Forum.json";

let initFlag, web3, contract, account;

function* initUser() {
    if(!initFlag) {
        web3 = yield call(getWeb3);
        contract = yield call(getContractInstance,{
            web3,
            artifact: Forum
        });
        initFlag=true;
        yield put({type: 'USER_SAGA_INITIALIZED', ...[]});
    }
    else
        console.warn("Attempted to reinitialize userSaga!");
}

function* updateUserData() {
    if(initFlag){
        const currentAccount = (yield call(getAccounts, {web3}))[0];
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
    else
        console.warn("Attempted to fetch data without initializing!");
}


function* userSaga() {
    yield takeLatest("DRIZZLE_INITIALIZED", initUser);
    yield take("USER_SAGA_INITIALIZED");
    yield takeEvery("ACCOUNTS_FETCHED", updateUserData);
}

export default userSaga;
