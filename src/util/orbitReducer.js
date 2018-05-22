const initialState = {
    ipfsInitialized: false,
    ready: false,
    id: null
};

const orbitReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IPFS_INITIALIZED':
            return {
                ...state,
                ipfsInitialized: true
            };
        case 'DATABASES_CREATED':
            return {
                ...state,
                ready: true,
                id: action.id
            };
        case 'DATABASES_LOADED':
            return {
                ...state,
                ready: true,
                id: action.id
            };
        case 'DATABASES_NOT_READY':
            return {
                ...state,
                ready: false,
                id: null
            };
        default:
            return state
    }
};

export default orbitReducer
