import express from 'express';
import _ from 'lodash';
import isReachable from 'is-reachable';

import { API_PORT, RENDEZVOUS_URL, WEB3_PROVIDER_URL } from './constants';

const POLLING_INTERVAL = 1000;

let app;
let responseBody = {
    ipfs:{id:"", localAddresses:[], peers:[], totalPeers:0, repoStats:{}},
    orbit:{identity:{}, databases:[]},
    web3:{url:WEB3_PROVIDER_URL, reachable: false},
    rendezvous:{url:RENDEZVOUS_URL, reachable: false},
    timestamp:0
};

export function startAPI(orbit){
    app = express();
    app.get('/', async (req, res) => {
        res.send(responseBody);
    });

    app.listen(API_PORT, () => {
        console.log(`Pinner API at http://localhost:${API_PORT}!`);
    });
    setInterval(getStats, POLLING_INTERVAL, orbit);
}

async function getStats(orbit) {
    try {
        const ipfs = orbit._ipfs;
        const {id} = await ipfs.id();
        const peers = await ipfs.swarm.peers();
        const localAddresses = await ipfs.swarm.localAddrs();
        const repoStats = await ipfs.stats.repo();
        const uniquePeers = _.uniqBy(peers, 'peer');
        const orbitIdentity = orbit.identity;
        const databases = Object.keys(orbit.stores);
        const isWeb3Reachable = await isReachable(WEB3_PROVIDER_URL);
        const isRendezvousReachable = await isReachable(RENDEZVOUS_URL);
        const timestamp = + new Date();

        responseBody.ipfs.id = id;
        responseBody.ipfs.peers = uniquePeers;
        responseBody.ipfs.totalPeers = uniquePeers.length;
        responseBody.ipfs.localAddresses = localAddresses;
        responseBody.ipfs.repoStats = repoStats;
        responseBody.orbit.identity = orbitIdentity;
        responseBody.orbit.databases = databases;
        responseBody.web3.reachable = isWeb3Reachable;
        responseBody.rendezvous.reachable = isRendezvousReachable;
        responseBody.timestamp = timestamp;
    } catch (err) {
        console.error('Error while getting stats:', err)
    }
}
