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
    orbitdb = new OrbitDB(ipfs);
    topicsDB = await orbitdb.keyvalue('topics');
    postsDB = await orbitdb.keyvalue('posts');
    store.dispatch({
        type: "DATABASES_CREATED",
        orbitdb: orbitdb,
        topicsDB: topicsDB,
        postsDB: postsDB,
        id: orbitdb.id
    });
    return {id: orbitdb.id, topicsDB: topicsDB.address.root, postsDB: postsDB.address.root,
        publicKey: orbitdb.key.getPublic('hex'), privateKey:orbitdb.key.getPrivate('hex')};
}

async function loadDatabases(id,mTopicsDB, mPostsDB,publicKey,privateKey) {
    let directory = "./orbitdb";
    let keystore = Keystore.create(path.join(directory, id, '/keystore'));
    keystore._storage.setItem(id, JSON.stringify({
        publicKey: publicKey,
        privateKey: privateKey
    }));
    orbitdb = new OrbitDB(ipfs,directory,{peerId:id, keystore:keystore});
    topicsDB = await orbitdb.keyvalue('/orbitdb/' + mTopicsDB +'/topics');
    postsDB = await orbitdb.keyvalue('/orbitdb/' + mPostsDB +'/posts');

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