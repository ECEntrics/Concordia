// Depending on the package user (app in contrast to any of the other packages) the env var names should either include
// the REACT_APP_ prefix or not
const contractsProviderHostEnv = process.env.REACT_APP_CONTRACTS_PROVIDER_HOST
    || process.env.CONTRACTS_PROVIDER_HOST;
const contractsProviderPortEnv = process.env.REACT_APP_CONTRACTS_PROVIDER_PORT
    || process.env.CONTRACTS_PROVIDER_PORT;
const contractsVersionHashEnv = process.env.REACT_APP_CONTRACTS_VERSION_HASH
    || process.env.CONTRACTS_VERSION_HASH;

module.exports = {
  contractsProviderHostEnv,
  contractsProviderPortEnv,
  contractsVersionHashEnv,
};
