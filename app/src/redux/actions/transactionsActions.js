//Action creators
import uuid from 'uuid/v1';

export const INIT_TRANSACTION = 'INIT_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

export function updateUsername(newUsername, callback){
    return {
        type: INIT_TRANSACTION,
        transactionDescriptor:
            {
                contract: 'Forum',
                method: 'updateUsername',
                params: [newUsername],
                event: 'UsernameUpdated'
            },
        uid: uuid(),
        callback: callback
    };
}

export function createTopic(userInputs){
    return {
        type: INIT_TRANSACTION,
        transactionDescriptor:
            {
                contract: 'Forum',
                method: 'createTopic',
                params: [],
                event: 'TopicCreated'
            },
        uid: uuid(),
        userInputs: userInputs
    };
}

export function createPost(topicID, userInputs){
    return {
        type: INIT_TRANSACTION,
        transactionDescriptor:
            {
                contract: 'Forum',
                method: 'createPost',
                params: [topicID],
                event: 'PostCreated'
            },
        uid: uuid(),
        userInputs: userInputs
    };
}

export function updateTransaction(transactionIndex, updateDescriptor){
    return {
        type: UPDATE_TRANSACTION,
        index: transactionIndex,
        transactionUpdates: updateDescriptor
    };
}