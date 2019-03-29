const IPFS_INITIALIZED = 'IPFS_INITIALIZED';
const DATABASES_CREATED = 'DATABASES_CREATED';
const DATABASES_LOADED = 'DATABASES_LOADED';
const DATABASES_NOT_READY = 'DATABASES_NOT_READY';
const ADD_PEER_DATABASE = 'ADD_PEER_DATABASE';
const PEER_DATABASE_ADDED = 'PEER_DATABASE_ADDED';
const UPDATE_PEERS = 'UPDATE_PEERS';
const ORRBIT_GETTING_INFO = 'ORRBIT_GETTING_INFO';
const ORBIT_SAGA_ERROR = 'ORBIT_SAGA_ERROR';

function updateDatabases(type, orbitdb, topicsDB, postsDB) {
  return {
    type,
    orbitdb,
    topicsDB,
    postsDB,
    id: orbitdb.id
  };
}

function addPeerDatabase(fullAddress) {
  return {
    type: ADD_PEER_DATABASE,
    fullAddress
  };
}

export { DATABASES_CREATED,
  DATABASES_LOADED,
  DATABASES_NOT_READY,
  IPFS_INITIALIZED,
  UPDATE_PEERS,
  ADD_PEER_DATABASE,
  PEER_DATABASE_ADDED,
  ORRBIT_GETTING_INFO,
  ORBIT_SAGA_ERROR,
  addPeerDatabase,
  updateDatabases
};
