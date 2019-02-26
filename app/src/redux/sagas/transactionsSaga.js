import {call, put, select, take, takeEvery} from 'redux-saga/effects'
import { contract, getCurrentAccount } from './drizzleUtilsSaga';

import { drizzle } from '../../index'

let transactionsHistory = Object.create(null);

function* initTransaction(action) {
    transactionsHistory[action.uid] = action;
    transactionsHistory[action.uid].dataKey = drizzle.contracts[action.transactionDescriptor.contract]
            .methods[action.transactionDescriptor['method']]
            .cacheSend(...[action.transactionDescriptor.params]);

    transactionsHistory[action.uid].state = 'initialized';
}

function* completeWithOrbitInteractions(action) {
    const orbit = yield select((state) => state.orbit);

    yield call(orbit.topicsDB.put, action.receipt.events['TopicCreated'].returnValues.topicID, {
        subject: 'tada'
    });

    yield call(orbit.postsDB.put, action.receipt.events['TopicCreated'].returnValues.postID, {
        subject: 'tada',
        content: 'it worked!'
    });
}

function* transactionsSaga() {
    yield take("DRIZZLE_UTILS_SAGA_INITIALIZED");
    yield takeEvery("INIT_TRANSACTION", initTransaction);
    yield takeEvery("TX_SUCCESSFUL", completeWithOrbitInteractions);
}

export default transactionsSaga;
