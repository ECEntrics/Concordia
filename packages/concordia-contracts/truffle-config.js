const path = require('path');
const defaults = require('./constants/config/defaults');

const {
  DEVELOP_CHAIN_HOST, DEVELOP_CHAIN_PORT, TEST_CHAIN_HOST, TEST_CHAIN_PORT,
} = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.7.1',
    },
  },
  contracts_build_directory: path.join(__dirname, 'build/'),
  networks: {
    develop: {
      host: DEVELOP_CHAIN_HOST || defaults.develop.chainHost,
      port: DEVELOP_CHAIN_PORT || defaults.develop.chainPort,
      network_id: '*',
    },
    test: {
      host: TEST_CHAIN_HOST || defaults.test.chainHost,
      port: TEST_CHAIN_PORT || defaults.test.chainPort,
      network_id: '*',
    },
  },
};
