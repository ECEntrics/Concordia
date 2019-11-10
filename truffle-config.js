const path = require('path');
const GANACHE_HOST = process.env.GANACHE_HOST || 'localhost';
const GANACHE_PORT = process.env.GANACHE_PORT || '8545';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'app/src/contracts'),
  networks: {
    development: {
      host: GANACHE_HOST,
      port: GANACHE_PORT,
      network_id: '*' // Match any network id
    }
  },
  compilers: {
    solc: {
      version: '0.5.8',
      settings: {
        optimizer: {
          enabled: true,
          runs: 500
        }
      }
    }
  }
};
