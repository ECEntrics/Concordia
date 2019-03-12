import { IPFS_INITIALIZED, DATABASES_CREATED, DATABASES_LOADED, DATABASES_NOT_READY } from "../actions/orbitActions";

const initialState = {
    ipfsInitialized: false,
    ready: false,
    orbitdb: null,
    topicsDB: null,
    postsDB: null,
    id: null
};

const orbitReducer = (state = initialState, action) => {
    switch (action.type) {
        case IPFS_INITIALIZED:
            return {
                ...state,
                ipfsInitialized: true
            };
        case DATABASES_CREATED:
            return {
                ...state,
                ready: true,
                orbitdb: action.orbitdb,
                topicsDB: action.topicsDB,
                postsDB: action.postsDB,
                id: action.id
            };
        case DATABASES_LOADED:
            return {
                ...state,
                ready: true,
                orbitdb: action.orbitdb,
                topicsDB: action.topicsDB,
                postsDB: action.postsDB,
                id: action.id
            };
        case DATABASES_NOT_READY:
            return {
                ...state,
                ready: false,
                orbitdb: null,
                topicsDB: null,
                postsDB: null,
                id: null
            };
        default:
            return state
    }
};

export default orbitReducer;
