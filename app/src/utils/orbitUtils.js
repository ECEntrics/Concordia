import OrbitDB from 'orbit-db';
import Keystore from 'orbit-db-keystore';
import path from 'path';
import store from '../redux/store';
import { DATABASES_CREATED, DATABASES_LOADED, IPFS_INITIALIZED, updateDatabases } from '../redux/actions/orbitActions';
import IPFS from "ipfs";
import ipfsOptions from "../config/ipfsOptions";

function initIPFS(){
    const ipfs = new IPFS(ipfsOptions);
    ipfs.on('ready', async () => {
        store.dispatch({type: IPFS_INITIALIZED, ipfs});
        console.log("IPFS initialized.");
    });
}

async function createDatabases() {
    console.log("Creating databases...");
    const ipfs = getIPFS();
    const orbitdb = await new OrbitDB(ipfs);
    const topicsDB = await orbitdb.keyvalue('topics');
    const postsDB = await orbitdb.keyvalue('posts');
    store.dispatch(updateDatabases(DATABASES_CREATED, orbitdb, topicsDB, postsDB));

    const orbitKey = orbitdb.keystore.getKey(orbitdb.id);

    return {
        identityId: "Tempus",
        identityPublicKey: "edax",
        identityPrivateKey: "rerum",
        orbitId: orbitdb.id,
        orbitPublicKey: orbitKey.getPublic('hex'),
        orbitPrivateKey: orbitKey.getPrivate('hex'),
        topicsDB: topicsDB.address.root,
        postsDB: postsDB.address.root
    };
}

async function loadDatabases(identityId, identityPublicKey, identityPrivateKey,
                             orbitId, orbitPublicKey, orbitPrivateKey, topicsDBId, postsDBId) {
    console.log("Loading databases...");
    let directory = "./orbitdb";
    let keystore = Keystore.create(path.join(directory, orbitId, '/keystore'));

    keystore._storage.setItem(orbitId, JSON.stringify({
        publicKey: orbitPublicKey,
        privateKey: orbitPrivateKey
    }));

    const ipfs = getIPFS();
    const orbitdb = await new OrbitDB(ipfs, directory, { peerId:orbitId, keystore:keystore});
    const topicsDB = await orbitdb.keyvalue('/orbitdb/' + topicsDBId +'/topics');
    const postsDB = await orbitdb.keyvalue('/orbitdb/' + postsDBId +'/posts');

    await topicsDB.load();
    await postsDB.load();

    store.dispatch(updateDatabases(DATABASES_LOADED, orbitdb, topicsDB, postsDB));
}

function getIPFS(){
    return store.getState().orbit.ipfs;
}

async function orbitSagaPut(db, key, value) {
    db.put(key, value);
}

export { initIPFS, createDatabases, loadDatabases, orbitSagaPut };
