import web3Options from './web3Options';
import EthereumIdentityProvider from '../orbit/ΕthereumIdentityProvider';
import {orbitTypes} from '@ezerous/breeze'

const { web3 } = web3Options;
EthereumIdentityProvider.setWeb3(web3);

const breezeOptions = {
    ipfs: {
        config: {
            Addresses: {
                Swarm: [
                    // Use local signaling server (see also rendezvous script in package.json)
                    // For more information: https://github.com/libp2p/js-libp2p-webrtc-star
                    '/ip4/127.0.0.1/tcp/9090/wss/p2p-webrtc-star'
                ]
            },
        },
        preload: {
            enabled: false
        },
        init: {
            emptyRepo: true
        }
    },
    orbit: {
        identityProvider: EthereumIdentityProvider,
        databases: [
            {
                name: 'topics',
                type: orbitTypes.ORBIT_TYPE_KEYVALUE
            },
            {
                name: 'posts',
                type: orbitTypes.ORBIT_TYPE_KEYVALUE
            }
        ]
    }
};

export default breezeOptions;
