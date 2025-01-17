import express from 'express';
import morgan from 'morgan';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import isReachable from 'is-reachable';
import { pinnerApiPort } from 'concordia-shared/src/environment/interpolated/pinner';
import getWeb3ProviderUrl from 'concordia-shared/src/utils/web3';
import { getResolvedRendezvousUrl } from './utils/ipfsUtils';
import { logger, logsDirectoryPath } from './utils/logger';

const POLLING_INTERVAL = 1000;
const accessLogStream = fs.createWriteStream(path.join(logsDirectoryPath, 'access.log'), { flags: 'a' });
logger.info('Service setting up.');

const responseBody = {
  ipfs: {
    id: '', localAddresses: [], peers: [], totalPeers: 0, repoStats: {},
  },
  orbit: { identity: {}, databases: [] },
  web3: { url: getWeb3ProviderUrl(), reachable: false },
  rendezvous: { url: '', reachable: false },
  timestamp: 0,
};

getResolvedRendezvousUrl().then(({ address }) => {
  logger.info(`Resolved rendezvous URL to: ${address}`);
  responseBody.rendezvous.url = address;
});

const getStats = async (orbit) => {
  logger.info('Gathering stats.');

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
    const isRendezvousReachable = responseBody.rendezvous.url ? await isReachable(responseBody.rendezvous.url) : false;
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
    logger.error('Error while getting stats:', err);
  }
};

const startAPI = (orbit) => {
  const app = express();

  app.use(morgan('combined', { stream: accessLogStream }));

  app.get('/', async (req, res) => {
    res.send(responseBody);
  });

  app.listen(pinnerApiPort, () => {
    logger.info(`Pinner API at http://localhost:${pinnerApiPort}!`);
  });

  setInterval(getStats, POLLING_INTERVAL, orbit);
};

export default startAPI;
