const { databases } = require('../constants/orbit/OrbitDatabases');
const { rendezvousHost, rendezvousPort } = require('../environment/interpolated/rendezvous');

const getBreezeConfiguration = (identityProvider) => ({
  ipfs: {
    repo: 'concordia',
    config: {
      Addresses: {
        Swarm: [
          // Use local signaling server (see also rendezvous script in package.json)
          // For more information: https://github.com/libp2p/js-libp2p-webrtc-star
          `/ip4/${rendezvousHost}/tcp/${rendezvousPort}/wss/p2p-webrtc-star`,

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
    identityProvider,
    databases,
  },
});

module.exports = getBreezeConfiguration;
