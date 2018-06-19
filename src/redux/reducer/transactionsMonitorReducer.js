import { INIT_TRANSACTION, UPDATE_TRANSACTION } from '../actions/transactionsMonitorActions';

const initialState = {
    transactions: []
};

const transactionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_TRANSACTION:
            let transactionsShallowCopy = state.transactions.slice();
            transactionsShallowCopy.push({
                status: 'initialized',
                contract: action.transactionDescriptor.contract,
                method: action.transactionDescriptor.method,
                params: action.transactionDescriptor.params,
                event: action.transactionDescriptor.event,
                returnData: null,
                userInputs: action.userInputs
            });
            return {
                transactions: transactionsShallowCopy
            };
        case UPDATE_TRANSACTION:
            return { transactions: state.transactions.map( (transaction, index) => {
                if (index !== action.index){
                    return transaction;
                }

                return {
                    ...transaction,
                    ...action.transactionUpdates
                }
            })};
        default:
            return state;
    }
};

export default transactionsReducer;