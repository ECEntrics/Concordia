import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import Keystore  from 'orbit-db-keystore';
import path from 'path';
import store from './../redux/store';

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
// Note that these options need to be passed to IPFS in
// all examples in this document even if not specified so.
const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    }, config: {
        Addresses: {
            Swarm: [
                // Use IPFS dev signal server
                // Prefer websocket over webrtc
                //
                // Websocket:
                // '/dns4/ws-star-signal-2.servep2p.com/tcp/443//wss/p2p-websocket-star',
                 '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                // Local signal server
                //'/ip4/127.0.0.1/tcp/4711/ws/p2p-websocket-star'
                //
                // WebRTC:
                // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
                // Local signal server
                // '/ip4/127.0.0.1/tcp/1337/ws/p2p-webrtc-star'
            ]
        }
    },
};

// Create IPFS instance
const ipfs = new IPFS(ipfsOptions);
let orbitdb, topicsDB, postsDB;

ipfs.on('ready', async () => {
    store.dispatch({type: "IPFS_INITIALIZED"});
});

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

export { createDatabases, loadDatabases };