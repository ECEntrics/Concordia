import {
  DATABASES_CREATED,
  DATABASES_LOADED,
  DATABASES_NOT_READY,
  IPFS_INITIALIZED, UPDATE_PEERS, PEER_DATABASE_ADDED
} from '../actions/orbitActions';

const initialState = {
  ipfs: null,
  ipfsInitialized: false,
  ready: false,
  orbitdb: null,
  topicsDB: null,
  postsDB: null,
  pubsubPeers: {topicsDBPeers:[], postsDBPeers:[]},
  peerDatabases: [],
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
    case PEER_DATABASE_ADDED:
      if(state.peerDatabases.find(db => db.fullAddress === action.fullAddress))
        return state;
      console.debug(`Added peer database ${action.fullAddress}`);
      return {
        ...state,
        peerDatabases:[...state.peerDatabases,
          {fullAddress: action.fullAddress, store: action.store}]
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
