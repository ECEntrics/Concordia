import getLibp2pBundle from './libp2pBundle';
import { getSwarmAddresses } from '../utils/ipfsUtils';
import { logger } from '../utils/logger';
import { IPFS_DIRECTORY_DEFAULT } from '../constants';

const getIpfsOptions = async () => getSwarmAddresses()
  .then((swarmAddresses) => {
    logger.info(`Swarm addresses used: ${swarmAddresses.join(', ')}`);
    return swarmAddresses;
  })
  .then((swarmAddresses) => {
    const IPFS_DIRECTORY = process.env.IPFS_DIRECTORY || IPFS_DIRECTORY_DEFAULT;
    logger.info(`Setting up IPFS in repo: ${IPFS_DIRECTORY}`);

    return ({
      repo: IPFS_DIRECTORY,
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
    });
  });

export default getIpfsOptions;
