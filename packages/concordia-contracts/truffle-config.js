const path = require('path');
const defaults = require('./constants/config/defaults');

const {
  CHAIN_HOST, CHAIN_PORT,
} = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.7.5',
    },
  },
  contracts_build_directory: path.join(__dirname, 'build/'),
  networks: {
    develop: {
      host: defaults.develop.chainHost,
      port: defaults.develop.chainPort,
      network_id: '*',
    },
    test: {
      host: defaults.test.chainHost,
      port: defaults.test.chainPort,
      network_id: '*',
    },
    env: {
      host: CHAIN_HOST,
      port: CHAIN_PORT,
      network_id: '*',
    },
  },
};
