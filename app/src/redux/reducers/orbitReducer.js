import {
  DATABASES_CREATED,
  DATABASES_LOADED,
  DATABASES_NOT_READY, OPENING_PEER_DATABASE,
  IPFS_INITIALIZED, UPDATE_PEERS, PEER_DATABASE_LOADED
} from '../actions/orbitActions';

const initialState = {
  ipfs: null,
  ipfsInitialized: false,
  ready: false,
  orbitdb: null,
  topicsDB: null,
  postsDB: null,
  pubsubPeers: {topicsDBPeers:[], postsDBPeers:[]},
  replicatedDatabases: [],
  id: null
};

const orbitReducer = (state = initialState, action) => {
  switch (action.type) {
    case IPFS_INITIALIZED:
      return {
        ...state,
        ipfs: action.ipfs,
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
    case OPENING_PEER_DATABASE:
      if(state.replicatedDatabases.find(db => db.fullAddress === action.fullAddress))
        return state;
      return {
        ...state,
        replicatedDatabases:[...state.replicatedDatabases,
          {fullAddress: action.fullAddress, ready: false, store: null}]
      };
    case PEER_DATABASE_LOADED:
      return {
        ...state,
        replicatedDatabases: [...state.replicatedDatabases.map((db) => {
          if (db.fullAddress !== action.fullAddress)
            return db; // This isn't the item we care about - keep it as-is
          return { ...db, ready: true, store: action.store}  // Otherwise return an updated value
        })]
      };
    case UPDATE_PEERS:
      return {
        ...state,
        pubsubPeers: {topicsDBPeers:action.topicsDBPeers, postsDBPeers:action.postsDBPeers}
      };
    default:
      return state;
  }
};

export default orbitReducer;
