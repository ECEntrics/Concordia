import Libp2p from 'libp2p';
import wrtc from 'wrtc';
import MulticastDNS from 'libp2p-mdns';
import WebrtcStar from 'libp2p-webrtc-star';
import Bootstrap from 'libp2p-bootstrap';
import Gossipsub from 'libp2p-gossipsub';
import KadDHT from 'libp2p-kad-dht';
import MPLEX from 'libp2p-mplex';
import { NOISE } from 'libp2p-noise';
import { swarmAddresses } from '../constants';

// See also: https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md
export default (opts) => new Libp2p({
  peerId: opts.peerId,
  addresses: {
    listen: swarmAddresses,
  },
  connectionManager: {
    minPeers: 25,
    maxPeers: 100,
    pollInterval: 5000,
  },
  modules: {
    transport: [
      WebrtcStar,
    ],
    streamMuxer: [
      MPLEX,
    ],
    connEncryption: [
      NOISE,
    ],
    peerDiscovery: [
      MulticastDNS,
      Bootstrap,
    ],
    dht: KadDHT,
    pubsub: Gossipsub,
  },
  config: {
    transport: {
      [WebrtcStar.prototype[Symbol.toStringTag]]: {
        wrtc,
      },
    },
    peerDiscovery: {
      autoDial: true,
      mdns: {
        enabled: true,
        interval: 10000,
      },
      bootstrap: {
        enabled: true,
        interval: 30e3,
        list: opts.config.Bootstrap,
      },
    },
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true,
      },
    },
    dht: {
      enabled: true,
      kBucketSize: 20,
      randomWalk: {
        enabled: true,
        interval: 10e3,
        timeout: 2e3,
      },
    },
    pubsub: {
      enabled: true,
      emitself: true,
    },
  },
  metrics: {
    enabled: true,
    computeThrottleMaxQueueSize: 1000,
    computeThrottleTimeout: 2000,
    movingAverageIntervals: [
      60 * 1000, // 1 minute
      5 * 60 * 1000, // 5 minutes
      15 * 60 * 1000, // 15 minutes
    ],
    maxOldPeersRetention: 50,
  },
});
