//Action creators

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
                event: 'UsernameUpdated',
            },
        callback: callback
    };
}

export function createTopic(callback){
    return {
        type: INIT_TRANSACTION,
        transactionDescriptor:
            {
                contract: 'Forum',
                method: 'createTopic',
                params: [],
                event: 'TopicCreated',
            },
        callback: callback
    };
}

export function createPost(topicID, callback){
    return {
        type: INIT_TRANSACTION,
        transactionDescriptor:
            {
                contract: 'Forum',
                method: 'createPost',
                params: [topicID],
                event: 'PostCreated',
            },
        callback: callback
    };
}

export function updateTransaction(transactionIndex, updateDescriptor){
    return {
        type: UPDATE_TRANSACTION,
        index: transactionIndex,
        transactionUpdates: updateDescriptor
    };
}