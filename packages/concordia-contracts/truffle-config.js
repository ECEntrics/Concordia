const path = require('path');

const { GANACHE_HOST } = process.env;
const { GANACHE_PORT } = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.7.4',
    },
  },
  contracts_build_directory: path.join(__dirname, 'build/'),
  networks: {
    develop: {
      host: GANACHE_HOST || '127.0.0.1',
      port: GANACHE_PORT || '8545',
      network_id: '*',
    },
    test: {
      host: GANACHE_HOST || '127.0.0.1',
      port: GANACHE_PORT || '8546',
      network_id: '*',
    },
  },
};
