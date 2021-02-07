const {
  contractsProviderHostEnv, contractsProviderPortEnv, contractsVersionHashEnv,
} = require('../contractsProviderEnv');

const {
  contractsProvider: {
    host: CONTRACTS_PROVIDER_HOST_DEFAULT,
    port: CONTRACTS_PROVIDER_PORT_DEFAULT,
    hash: CONTRACTS_VERSION_HASH_DEFAULT,
  },
} = require('../../constants/configuration/defaults');

const contractsProviderHost = contractsProviderHostEnv || CONTRACTS_PROVIDER_HOST_DEFAULT;
const contractsProviderPort = contractsProviderPortEnv || CONTRACTS_PROVIDER_PORT_DEFAULT;
const contractsVersionHash = contractsVersionHashEnv || CONTRACTS_VERSION_HASH_DEFAULT;

module.exports = {
  contractsProviderHost,
  contractsProviderPort,
  contractsVersionHash,
};
