import { EthereumContractIdentityProvider } from '@ezerous/eth-identity-provider';
import databases from '../constants/orbit/OrbitDatabases';
import {
  REACT_APP_RENDEZVOUS_HOST_DEFAULT,
  REACT_APP_RENDEZVOUS_PORT_DEFAULT,
} from '../constants/configuration/defaults';

const REACT_APP_RENDEZVOUS_HOST = process.env.REACT_APP_RENDEZVOUS_HOST || REACT_APP_RENDEZVOUS_HOST_DEFAULT;
const REACT_APP_RENDEZVOUS_PORT = process.env.REACT_APP_RENDEZVOUS_PORT || REACT_APP_RENDEZVOUS_PORT_DEFAULT;

export const RENDEZVOUS_URL = `http://${REACT_APP_RENDEZVOUS_HOST}:${REACT_APP_RENDEZVOUS_PORT}`;

const breezeOptions = {
  ipfs: {
    repo: 'concordia',
    config: {
      Addresses: {
        Swarm: [
          // Use local signaling server (see also rendezvous script in package.json)
          // For more information: https://github.com/libp2p/js-libp2p-webrtc-star
          `/ip4/${REACT_APP_RENDEZVOUS_HOST}/tcp/${REACT_APP_RENDEZVOUS_PORT}/wss/p2p-webrtc-star`,

          // Use the following public servers if needed
          // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
          // '/dns4/ wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
        ],
      },
    },
    preload: {
      enabled: false,
    },
    init: {
      emptyRepo: true,
    },
  },
  orbit: {
    identityProvider: EthereumContractIdentityProvider,
    databases,
  },
};

export default breezeOptions;
