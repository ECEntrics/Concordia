import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

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
    store.dispatch({type: "IPFS_READY"});
});


async function createDatabases() {
    const orbitdb = new OrbitDB(ipfs);
    const topicsDB = await orbitdb.keyvalue('topics');
    const postsDB = await orbitdb.keyvalue('posts');
    console.log("OrbitDBs created successfully!");
    return {id: orbitdb.id, topicsDB: topicsDB.address.root, postsDB: postsDB.address.root,
        publicKey: orbitdb.key.getPublic('hex'), privateKey:orbitdb.key.getPrivate('hex')};
}

export { createDatabases }