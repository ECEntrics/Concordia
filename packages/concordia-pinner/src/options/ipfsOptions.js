import libp2pBundle from './libp2pBundle'
import { swarmAddresses } from '../constants';

export default {
    repo: 'ipfs',
    config: {
        Addresses: {
            Swarm: swarmAddresses
        },
    },
    libp2p: libp2pBundle,
    EXPERIMENTAL: {
        pubsub: true,
    },
    preload: {
        enabled: false,
    },
    init: {
        emptyRepo: true,
    },
}
