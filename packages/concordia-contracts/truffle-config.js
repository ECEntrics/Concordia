const path = require('path');
const web3EnvInterpolated = require('concordia-shared/src/environment/interpolated/web3');
const configurationDefaults = require('concordia-shared/src/constants/configuration/defaults');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.8.1',
    },
  },
  contracts_build_directory: path.join(__dirname, 'build/'),
  networks: {
    develop: {
      host: configurationDefaults.web3.develop.chainHost,
      port: configurationDefaults.web3.develop.chainPort,
      network_id: '*',
    },
    test: {
      host: configurationDefaults.web3.test.chainHost,
      port: configurationDefaults.web3.test.chainPort,
      network_id: '*',
    },
    env: {
      host: web3EnvInterpolated.web3Host,
      port: web3EnvInterpolated.web3Port,
      network_id: '*',
    },
  },
};
