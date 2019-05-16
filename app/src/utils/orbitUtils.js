import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import IPFS from 'ipfs';
import store from '../redux/store';
import {  DATABASES_LOADED, IPFS_INITIALIZED, updateDatabases } from '../redux/actions/orbitActions';
import ipfsOptions from '../config/ipfsOptions';
import EthereumIdentityProvider from './EthereumIdentityProvider';
import { getPrivateKey, setKeyPair } from './levelUtils';

function initIPFS() {
  Identities.addIdentityProvider(EthereumIdentityProvider);
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

async function createTempDatabases() {
  console.debug('Creating temporary databases...');
  const ipfs = getIPFS();
  const identity = await Identities.createIdentity({type: 'ethereum'});
  const orbitdb = await OrbitDB.createInstance(ipfs, {identity});
  console.dir(orbitdb)
  const topicsDB = await orbitdb.keyvalue('topics');
  const postsDB = await orbitdb.keyvalue('posts');
  return { orbitdb, topicsDB, postsDB };
}

async function createDatabases() {
  console.debug('Creating databases...');
  const ipfs = getIPFS();
  const identity = await Identities.createIdentity({type: 'ethereum'});
  const orbitdb = await OrbitDB.createInstance(ipfs, {identity});
  const options = {
    // Give write access to ourselves
    accessController: {
      write: ['*']
    }
  };
  const topicsDB = await orbitdb.keyvalue('topics', options);
  const postsDB = await orbitdb.keyvalue('posts', options);
  const privateKey = await getPrivateKey(identity.id);

  return {
    identityId: identity.id,
    identityPublicKey: identity.publicKey,
    identityPrivateKey: privateKey,
    orbitdb: orbitdb,
    orbitPublicKey: "eeeee",
    orbitPrivateKey: "fffffff",
    topicsDB: topicsDB.address.root,
    postsDB: postsDB.address.root
  };
}

async function loadDatabases(identityId, identityPublicKey, identityPrivateKey,
                             orbitId, orbitPublicKey, orbitPrivateKey,
                             topicsDBId, postsDBId) {
  console.debug('Loading databases...');
  const ipfs = getIPFS();
  await setKeyPair(identityId, identityPublicKey, identityPrivateKey);
  const identity = await Identities.createIdentity({type: 'ethereum' });
  const orbitdb = await OrbitDB.createInstance(ipfs, {identity});

  console.dir(orbitdb)

  const topicsDB = await orbitdb.keyvalue('topics')
    .catch((error) => console.error(`TopicsDB init error: ${error}`));

  console.dir(topicsDB)

  const postsDB = await orbitdb.keyvalue('posts')
    .catch((error) => console.error(`PostsDB init error: ${error}`));
  console.dir(topicsDB)
  await topicsDB.load().catch((error) => console.error(`TopicsDB loading error: ${error}`));
  await postsDB.load().catch((error) => console.error(`PostsDB loading error: ${error}`));

  //It is possible that we lack our own data and need to replicate them from somewhere else
  topicsDB.events.on('replicate', (address) => {
    console.log(`TopicsDB replicating (${address}).`);
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

  console.debug('Databases loaded successfully.');
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

export { initIPFS, createTempDatabases, createDatabases, loadDatabases, orbitSagaPut, orbitSagaOpen };
