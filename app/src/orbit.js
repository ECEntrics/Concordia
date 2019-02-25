import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import Keystore  from 'orbit-db-keystore';
import path from 'path';
import store from './redux/store';
import ipfsOptions from './config/ipfsOptions'

let ipfs, orbitdb, topicsDB, postsDB;

function initIPFS(){
    ipfs = new IPFS(ipfsOptions);
    ipfs.on('ready', async () => {
        store.dispatch({type: "IPFS_INITIALIZED"});
    });
}

async function createDatabases() {
    orbitdb = await OrbitDB.createInstance(ipfs);
    topicsDB = await orbitdb.keyvalue('topics');
    postsDB = await orbitdb.keyvalue('posts');
    store.dispatch({
        type: "DATABASES_CREATED",
        orbitdb: orbitdb,
        topicsDB: topicsDB,
        postsDB: postsDB,
        id: orbitdb.id
    });

    const identityKey = orbitdb.keystore.getKey(orbitdb.identity.id);
    const orbitKey = orbitdb.keystore.getKey(orbitdb.id);

    const returnValue = {
        identityId: orbitdb.identity.id,
        identityPublicKey: identityKey.getPublic('hex'),
        identityPrivateKey: identityKey.getPrivate('hex'),
        orbitId: orbitdb.id,
        orbitPublicKey: orbitKey.getPublic('hex'),
        orbitPrivateKey: orbitKey.getPrivate('hex'),
        topicsDB: topicsDB.address.root,
        postsDB: postsDB.address.root
    };
    console.dir(returnValue);

    return returnValue;
}

async function loadDatabases(identityId, identityPublicKey, identityPrivateKey,
                             orbitId, orbitPublicKey, orbitPrivateKey, topicsDB, postsDB) {
    let directory = "./orbitdb";
    let keystore = Keystore.create(path.join(directory, identityId, '/keystore'));
    keystore._storage.setItem(identityId, JSON.stringify({
        publicKey: identityPublicKey,
        privateKey: identityPrivateKey
    }));

    keystore._storage.setItem(orbitId, JSON.stringify({
        publicKey: orbitPublicKey,
        privateKey: orbitPrivateKey
    }));

    orbitdb = await OrbitDB.createInstance(ipfs, {directory: directory, peerId:identityId, keystore:keystore});
    topicsDB = await orbitdb.keyvalue('/orbitdb/' + topicsDB +'/topics');
    postsDB = await orbitdb.keyvalue('/orbitdb/' + postsDB +'/posts');

    topicsDB.load();
    postsDB.load();

    store.dispatch({
        type: "DATABASES_LOADED",
        orbitdb: orbitdb,
        topicsDB: topicsDB,
        postsDB: postsDB,
        id: orbitdb.id
    });
}

export { initIPFS, createDatabases, loadDatabases };