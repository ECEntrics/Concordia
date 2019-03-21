import OrbitDB from 'orbit-db';
import Keystore from 'orbit-db-keystore';
import path from 'path';
import IPFS from 'ipfs';
import store from '../redux/store';
import { DATABASES_CREATED, DATABASES_LOADED, IPFS_INITIALIZED, updateDatabases } from '../redux/actions/orbitActions';
import ipfsOptions from '../config/ipfsOptions';

function initIPFS() {
  const ipfs = new IPFS(ipfsOptions);
  ipfs.on('error', (error) => console.error(`IPFS error: ${error}`));
  ipfs.on('ready', async () => {
    store.dispatch({
      type: IPFS_INITIALIZED, ipfs
    });
    console.log('IPFS initialized.');
  });
}

async function createDatabases() {
  console.log("Deleting local storage..."); // Else we are in danger of reusing an existing orbit
  localStorage.clear(); // Perhaps not needed at all when orbit ids are used in Orbit 0.20.x+
  console.log('Creating databases...');
  const ipfs = getIPFS();
  const orbitdb = await new OrbitDB(ipfs);
  const topicsDB = await orbitdb.keyvalue('topics');
  const postsDB = await orbitdb.keyvalue('posts');
  store.dispatch(
    updateDatabases(DATABASES_CREATED, orbitdb, topicsDB, postsDB),
  );

  const orbitKey = orbitdb.keystore.getKey(orbitdb.id);

  return {
    identityId: 'Tempus',
    identityPublicKey: 'edax',
    identityPrivateKey: 'rerum',
    orbitId: orbitdb.id,
    orbitPublicKey: orbitKey.getPublic('hex'),
    orbitPrivateKey: orbitKey.getPrivate('hex'),
    topicsDB: topicsDB.address.root,
    postsDB: postsDB.address.root
  };
}

async function loadDatabases(identityId, identityPublicKey, identityPrivateKey,
                             orbitId, orbitPublicKey, orbitPrivateKey,
                             topicsDBId, postsDBId) {
  const directory = './orbitdb';
  const keystore = Keystore.create(path.join(directory, orbitId, '/keystore'));

  keystore._storage.setItem(orbitId, JSON.stringify({
    publicKey: orbitPublicKey,
    privateKey: orbitPrivateKey
  }));

  const ipfs = getIPFS();
  const orbitdb = await new OrbitDB(ipfs, directory,
    {
      peerId: orbitId, keystore
    });
  const topicsDB = await orbitdb.keyvalue(`/orbitdb/${topicsDBId}/topics`)
    .catch((error) => console.error(`TopicsDB init error: ${error}`));
  const postsDB = await orbitdb.keyvalue(`/orbitdb/${postsDBId}/posts`)
    .catch((error) => console.error(`PostsDB init error: ${error}`));

  await topicsDB.load().catch((error) => console.error(`TopicsDB loading error: ${error}`));
  await postsDB.load().catch((error) => console.error(`PostsDB loading error: ${error}`));

  console.log('Orbit databases loaded successfully.');
  store.dispatch(updateDatabases(DATABASES_LOADED, orbitdb, topicsDB, postsDB));
}

function getIPFS() {
  return store.getState().orbit.ipfs;
}

async function orbitSagaPut(db, key, value) {
  await db.put(key, value).catch((error) => console.error(`Orbit put error: ${error}`));
}

export { initIPFS, createDatabases, loadDatabases, orbitSagaPut };
