const IPFS_INITIALIZED = 'IPFS_INITIALIZED';
const DATABASES_CREATED = 'DATABASES_CREATED';
const DATABASES_LOADED = 'DATABASES_LOADED';
const ADD_PEER_DATABASE = 'ADD_PEER_DATABASE';
const PEER_DATABASE_ADDED = 'PEER_DATABASE_ADDED';
const UPDATE_PEERS = 'UPDATE_PEERS';
const ORBIT_INIT = 'ORBIT_INIT';
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

function addPeerDatabase(userAddress, dbName) {
  return {
    type: ADD_PEER_DATABASE,
    userAddress, //User's Ethereum address - it's also his Orbit Identity Id
    dbName  //e.g. topics or posts
  };
}

export { DATABASES_CREATED,
  DATABASES_LOADED,
  IPFS_INITIALIZED,
  UPDATE_PEERS,
  ADD_PEER_DATABASE,
  PEER_DATABASE_ADDED,
  ORBIT_INIT,
  ORBIT_SAGA_ERROR,
  addPeerDatabase,
  updateDatabases
};
