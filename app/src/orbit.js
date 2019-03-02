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
    console.log("Creating databases...");
    orbitdb = await new OrbitDB(ipfs);
    topicsDB = await orbitdb.keyvalue('topics');
    postsDB = await orbitdb.keyvalue('posts');
    store.dispatch({
        type: "DATABASES_CREATED",
        orbitdb: orbitdb,
        topicsDB: topicsDB,
        postsDB: postsDB,
        id: orbitdb.id
    });

    const orbitKey = orbitdb.keystore.getKey(orbitdb.id);

    const returnValue = {
        identityId: "Tempus",
        identityPublicKey: "edax",
        identityPrivateKey: "rerum",
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
    console.log("Loading databases...");
    let directory = "./orbitdb";
    let keystore = Keystore.create(path.join(directory, orbitId, '/keystore'));

    keystore._storage.setItem(orbitId, JSON.stringify({
        publicKey: orbitPublicKey,
        privateKey: orbitPrivateKey
    }));

    orbitdb = await new OrbitDB(ipfs, directory, { peerId:orbitId, keystore:keystore});
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