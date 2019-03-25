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
    ipfs.id(function (error, identity) {
      if (error)
        console.error(`IPFS id() error: ${error}`);
      console.debug(`IPFS initialized with id ${identity.id}`);
    })
  });
}

async function createDatabases() {
  console.debug('Creating databases...');
  const ipfs = getIPFS();
  const orbitdb = new OrbitDB(ipfs);
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
  const orbitdb = new OrbitDB(ipfs, directory,
    {
      peerId: orbitId, keystore
    });
  const topicsDB = await orbitdb.keyvalue(`/orbitdb/${topicsDBId}/topics`)
    .catch((error) => console.error(`TopicsDB init error: ${error}`));
  const postsDB = await orbitdb.keyvalue(`/orbitdb/${postsDBId}/posts`)
    .catch((error) => console.error(`PostsDB init error: ${error}`));

  await topicsDB.load().catch((error) => console.error(`TopicsDB loading error: ${error}`));
  await postsDB.load().catch((error) => console.error(`PostsDB loading error: ${error}`));

  //It is possible that we lack our own data and need to replicate them from somewhere else
  topicsDB.events.on('replicate', (address) => {
    console.log(`TopicsDB Replicating (${address}).`);
  });
  topicsDB.events.on('replicated', (address) => {
    console.log(`TopicsDB replicated (${address}).`);
  });
  postsDB.events.on('replicate', (address) => {
    console.log(`PostsDB replicating (${address}).`);
  });
  postsDB.events.on('replicated', (address) => {
    console.log(`PostsDB replicated (${address}).`);
  });

  console.debug('Orbit databases loaded successfully.');
  store.dispatch(updateDatabases(DATABASES_LOADED, orbitdb, topicsDB, postsDB));
}

function getIPFS() {
  return store.getState().orbit.ipfs;
}

async function orbitSagaPut(db, key, value) {
  await db.put(key, value).catch((error) => console.error(`Orbit put error: ${error}`));
}

async function orbitSagaOpen(orbitdb, address) {
  const store = await orbitdb.keyvalue(address)
    .catch((error) => console.error(`Error opening a peer's db: ${error}`));
  await store.load().catch((error) => console.log(error));
  store.events.on('replicate', (address) => {
    console.log(`A peer's DB is being replicated (${address}).`);
  });
  store.events.on('replicated', (address) => {
    console.log(`A peer's DB was replicated (${address}).`);
  });
  return store;
}

export { initIPFS, createDatabases, loadDatabases, orbitSagaPut, orbitSagaOpen };
