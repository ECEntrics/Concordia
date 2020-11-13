import { EthereumContractIdentityProvider } from '@ezerous/eth-identity-provider';

const breezeOptions = {
  ipfs: {
    config: {
      Addresses: {
        Swarm: [
          // Use local signaling server (see also rendezvous script in package.json)
          // For more information: https://github.com/libp2p/js-libp2p-webrtc-star
          '/ip4/127.0.0.1/tcp/9090/wss/p2p-webrtc-star',

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
    databases: [
      {
        address: 'topics',
        type: 'keyvalue',
      },
      {
        address: 'posts',
        type: 'keyvalue',
      },
    ],
  },
};

export default breezeOptions;
