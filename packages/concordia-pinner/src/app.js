import express from 'express';
import _ from 'lodash';
import isReachable from 'is-reachable';
import { pinnerApiPort } from 'concordia-shared/src/environment/interpolated/pinner';
import getWeb3ProviderUrl from 'concordia-shared/src/utils/web3';
import getRendezvousUrl from 'concordia-shared/src/utils/rendezvous';

const POLLING_INTERVAL = 1000;

const responseBody = {
  ipfs: {
    id: '', localAddresses: [], peers: [], totalPeers: 0, repoStats: {},
  },
  orbit: { identity: {}, databases: [] },
  web3: { url: getWeb3ProviderUrl(), reachable: false },
  rendezvous: { url: getRendezvousUrl(), reachable: false },
  timestamp: 0,
};

async function getStats(orbit) {
  try {
    const ipfs = orbit._ipfs;
    const { id } = await ipfs.id();
    const peers = await ipfs.swarm.peers();
    const localAddresses = await ipfs.swarm.localAddrs();
    const repoStats = await ipfs.stats.repo();
    const uniquePeers = _.uniqBy(peers, 'peer');
    const orbitIdentity = orbit.identity;
    const databases = Object.keys(orbit.stores);
    const isWeb3Reachable = await isReachable(getWeb3ProviderUrl());
    const isRendezvousReachable = await isReachable(getRendezvousUrl());
    const timestamp = +new Date();

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
    console.error('Error while getting stats:', err);
  }
}

const startAPI = (orbit) => {
  const app = express();
  app.get('/', async (req, res) => {
    res.send(responseBody);
  });

  app.listen(pinnerApiPort, () => {
    console.log(`Pinner API at http://localhost:${pinnerApiPort}!`);
  });

  setInterval(getStats, POLLING_INTERVAL, orbit);
};

export default startAPI;
