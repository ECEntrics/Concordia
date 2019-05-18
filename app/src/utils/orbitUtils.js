import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import IPFS from 'ipfs';
import store from '../redux/store';
import { DATABASES_LOADED, IPFS_INITIALIZED, updateDatabases } from '../redux/actions/orbitActions';
import ipfsOptions from '../config/ipfsOptions';
import EthereumIdentityProvider from './EthereumIdentityProvider';

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

async function createDatabases(identityId) {
  console.debug('Creating databases...');
  const databases = await createDBs(identityId);
  console.debug('Databases created successfully.');
  return databases;
}

async function loadDatabases(identityId) {
  console.debug('Loading databases...');
  const { orbitdb, topicsDB, postsDB } = await createDBs(identityId);

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

async function determineDBAddress(dbName, identityId){
  return (await getOrbitDB().determineAddress(dbName, 'keyvalue', {
    accessController: {
      write: [identityId]}
    }
  )).root;
}

function getIPFS() {
  return store.getState().orbit.ipfs;
}

function getOrbitDB() {
  return store.getState().orbit.orbitdb;
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

async function createDBs(identityId){
  const ipfs = getIPFS();
  const identity = await Identities.createIdentity({id: identityId, type: 'ethereum'});
  const orbitdb = await OrbitDB.createInstance(ipfs, {identity});
  const topicsDB = await orbitdb.keyvalue('topics')
    .catch((error) => console.error(`TopicsDB init error: ${error}`));
  const postsDB = await orbitdb.keyvalue('posts')
    .catch((error) => console.error(`PostsDB init error: ${error}`));

  return { orbitdb, topicsDB, postsDB };
}


export {
  initIPFS,
  createDatabases,
  loadDatabases,
  orbitSagaPut,
  orbitSagaOpen,
  determineDBAddress
};
