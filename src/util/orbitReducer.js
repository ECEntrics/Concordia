const initialState = {
    initialized: false,
    databasesReady: false
};

const orbitReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IPFS_READY':
            return {
                initialized: true
            };
        case 'DATABASES_CREATED':
            return {
                databasesReady: true
            };
        default:
            return state
    }
};

export default orbitReducer
