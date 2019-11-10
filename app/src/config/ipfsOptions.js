const REACT_APP_RENDEZVOUS_HOST = process.env.REACT_APP_RENDEZVOUS_HOST || '127.0.0.1';
const REACT_APP_RENDEZVOUS_PORT = process.env.REACT_APP_RENDEZVOUS_PORT || '9090';

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        // Use local signaling server (see also rendezvous script in package.json)
        // For more information: https://github.com/libp2p/js-libp2p-websocket-star-rendezvous
        '/dns4/' + REACT_APP_RENDEZVOUS_HOST + '/tcp/' + REACT_APP_RENDEZVOUS_PORT + '/ws/p2p-websocket-star',
      ]
    }
  },
  preload: {
    enabled: false
  },
  init:{
    emptyRepo: true
  }
};

export default ipfsOptions;
