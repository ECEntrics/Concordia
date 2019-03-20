const IPFS_INITIALIZED = 'IPFS_INITIALIZED';
const DATABASES_CREATED = 'DATABASES_CREATED';
const DATABASES_LOADED = 'DATABASES_LOADED';
const DATABASES_NOT_READY = 'DATABASES_NOT_READY';
const UPDATE_PEERS = 'UPDATE_PEERS';

function updateDatabases(type, orbitdb, topicsDB, postsDB) {
  return {
    type,
    orbitdb,
    topicsDB,
    postsDB,
    id: orbitdb.id
  };
}

export { DATABASES_CREATED,
  DATABASES_LOADED,
  DATABASES_NOT_READY,
  IPFS_INITIALIZED,
  UPDATE_PEERS,
  updateDatabases };
