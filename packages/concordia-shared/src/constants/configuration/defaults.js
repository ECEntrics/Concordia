// Contracts provider
const CONTRACTS_PROVIDER_HOST_DEFAULT = 'http://127.0.0.1';
const CONTRACTS_PROVIDER_PORT_DEFAULT = '8400';
const CONTRACTS_VERSION_HASH_DEFAULT = 'latest';

// Pinner
const PINNER_API_HOST_DEFAULT = 'http://127.0.0.1';
const PINNER_API_PORT_DEFAULT = 4444;

// Rendezvous
const RENDEZVOUS_HOST_DEFAULT = '/ip4/127.0.0.1';
const RENDEZVOUS_PORT_DEFAULT = '9090';

// Web3 (probably ganache)
const WEB3_HOST_DEFAULT = 'http://127.0.0.1';
const WEB3_PORT_DEFAULT = '8545';
const WEB3_HOST_TEST_DEFAULT = 'http://127.0.0.1';
const WEB3_PORT_TEST_DEFAULT = '8546';
const WEB3_PORT_SOCKET_TIMEOUT_DEFAULT = 30000;
const WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT = 3;

module.exports = Object.freeze({
  contractsProvider: {
    host: CONTRACTS_PROVIDER_HOST_DEFAULT,
    port: CONTRACTS_PROVIDER_PORT_DEFAULT,
    hash: CONTRACTS_VERSION_HASH_DEFAULT,
  },
  pinner: {
    host: PINNER_API_HOST_DEFAULT,
    port: PINNER_API_PORT_DEFAULT,
  },
  rendezvous: {
    host: RENDEZVOUS_HOST_DEFAULT,
    port: RENDEZVOUS_PORT_DEFAULT,
  },
  web3: {
    develop: {
      chainHost: WEB3_HOST_DEFAULT,
      chainPort: WEB3_PORT_DEFAULT,
    },
    test: {
      chainHost: WEB3_HOST_TEST_DEFAULT,
      chainPort: WEB3_PORT_TEST_DEFAULT,
    },
    socketTimeout: WEB3_PORT_SOCKET_TIMEOUT_DEFAULT,
    socketConnectMaxAttempts: WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT,
  },
});
