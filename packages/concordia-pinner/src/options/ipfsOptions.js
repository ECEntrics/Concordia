import getLibp2pBundle from './libp2pBundle';
import { getSwarmAddresses } from '../utils/ipfsUtils';
import { logger } from '../utils/logger';

const getIpfsOptions = async () => getSwarmAddresses()
  .then((swarmAddresses) => {
    logger.info(`Swarm addresses used: ${swarmAddresses.join(', ')}`);
    return swarmAddresses;
  })
  .then((swarmAddresses) => ({
    repo: 'ipfs',
    config: {
      Profile: 'server',
      Addresses: {
        Swarm: swarmAddresses,
      },
    },
    libp2p: getLibp2pBundle(swarmAddresses),
    EXPERIMENTAL: {
      pubsub: true,
    },
    preload: {
      enabled: false,
    },
    init: {
      emptyRepo: true,
    },
  }));

export default getIpfsOptions;
