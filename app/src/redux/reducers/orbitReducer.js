import {
  DATABASES_CREATED,
  DATABASES_LOADED,
  IPFS_INITIALIZED, UPDATE_PEERS, PEER_DATABASE_ADDED, ORBIT_INIT
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
    case DATABASES_LOADED:
      return {
        ...state,
        ready: true,
        orbitdb: action.orbitdb,
        topicsDB: action.topicsDB,
        postsDB: action.postsDB,
        id: action.id
      };
    case ORBIT_INIT:
      return {
        ...state,
        ready: false,
        orbitdb: null,
        topicsDB: null,
        postsDB: null,
        pubsubPeers: {topicsDBPeers:[], postsDBPeers:[]},
        peerDatabases: [],
        id: null
      };
    case PEER_DATABASE_ADDED:
      if(state.peerDatabases.find(db => db.fullAddress === action.fullAddress))
        return state;
      console.debug(`Added peer database ${action.fullAddress}`);
      return {
        ...state,
        peerDatabases:[...state.peerDatabases,
          {
            fullAddress: action.fullAddress,
            userAddress: action.userAddress,
            name: action.fullAddress.split('/')[3],
            store: action.store
          }
        ]
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
