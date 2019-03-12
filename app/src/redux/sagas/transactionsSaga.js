import {call, select, take, takeEvery} from 'redux-saga/effects'

import { drizzle } from '../../index'
import { orbitSagaPut } from '../../orbit'
import { DRIZZLE_UTILS_SAGA_INITIALIZED } from "../actions/drizzleUtilsActions";

let transactionsHistory = Object.create(null);

function* initTransaction(action) {
    var dataKey = drizzle.contracts[action.transactionDescriptor.contract]
        .methods[action.transactionDescriptor['method']]
        .cacheSend(...(action.transactionDescriptor.params));

    transactionsHistory[dataKey] = action;
    transactionsHistory[dataKey].state = 'initialized';
}

function* handleEvent(action) {
    var transactionStack = yield select((state) => state.transactionStack);
    var dataKey = transactionStack.indexOf(action.event.transactionHash);

    switch(action.event.event) {
        case 'TopicCreated':
            if (dataKey !== -1 &&
                transactionsHistory[dataKey] &&
                transactionsHistory[dataKey].state === 'initialized') {
                transactionsHistory[dataKey].state = 'success';
                //Gets orbit
                const orbit = yield select((state) => state.orbit);
                //And saves the topic
                yield call(orbitSagaPut, orbit.topicsDB, action.event.returnValues.topicID,
                    { subject: transactionsHistory[dataKey].userInputs.topicSubject });
                yield call(orbitSagaPut, orbit.postsDB, action.event.returnValues.postID,
                    { subject: transactionsHistory[dataKey].userInputs.topicSubject,
                    content: transactionsHistory[dataKey].userInputs.topicMessage });
            }
            break;
        case 'PostCreated':
            if (dataKey !== -1 &&
                transactionsHistory[dataKey] &&
                transactionsHistory[dataKey].state === 'initialized') {
                transactionsHistory[dataKey].state = 'success';
                //Gets orbit
                const orbit = yield select((state) => state.orbit);
                //And saves the topic
                yield call(orbitSagaPut, orbit.postsDB, action.event.returnValues.postID,
                    {subject: transactionsHistory[dataKey].userInputs.postSubject,
                    content: transactionsHistory[dataKey].userInputs.postMessage });
            }
            break;
        default:
            //Nothing to do here
            return;
    }
}

function* handleError() {
    var transactionStack = yield select((state) => state.transactionStack);
    transactionStack.forEach((transaction, index) => {
        if (transaction.startsWith('TEMP_')) {
            transactionsHistory[index].state = 'error';
        }
    })
}

function* transactionsSaga() {
    yield take(DRIZZLE_UTILS_SAGA_INITIALIZED);
    yield takeEvery("INIT_TRANSACTION", initTransaction);
    yield takeEvery("EVENT_FIRED", handleEvent);
    yield takeEvery("TX_ERROR", handleError);
}

export default transactionsSaga;
