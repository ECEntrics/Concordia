import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import Keystore  from 'orbit-db-keystore';
import path from 'path';
import store from './../store';

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
// Note that these options need to be passed to IPFS in
// all examples in this document even if not specified so.
const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    },
};

// Create IPFS instance
const ipfs = new IPFS(ipfsOptions);

ipfs.on('ready', async () => {
    store.dispatch({type: "IPFS_INITIALIZED"});
});


async function createDatabases() {
    const orbitdb = new OrbitDB(ipfs);
    const topicsDB = await orbitdb.keyvalue('topics');
    const postsDB = await orbitdb.keyvalue('posts');
    store.dispatch({type: "DATABASES_CREATED", id: orbitdb.id});
    return {id: orbitdb.id, topicsDB: topicsDB.address.root, postsDB: postsDB.address.root,
        publicKey: orbitdb.key.getPublic('hex'), privateKey:orbitdb.key.getPrivate('hex')};
}

async function loadDatabases(id,topicsDB, postsDB,publicKey,privateKey) {   //TODO: does this work? does IPFS need reinitializng?
    let directory = "./orbitdb";
    let keystore = Keystore.create(path.join(directory, id, '/keystore'));
    keystore._storage.setItem(id, JSON.stringify({
        publicKey: publicKey,
        privateKey: privateKey
    }));
    const orbitdb = new OrbitDB(ipfs,directory,{peerId:id, keystore:keystore});
    await orbitdb.keyvalue('/orbitdb/' + topicsDB +'/topics');
    await orbitdb.keyvalue('/orbitdb/' + postsDB +'/posts');
    //todo: loadedDBs.load() (?)
    store.dispatch({type: "DATABASES_LOADED", id: orbitdb.id});
}



export { createDatabases, loadDatabases }