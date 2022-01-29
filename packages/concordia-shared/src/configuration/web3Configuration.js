const getWeb3ProviderUrl = require('../utils/web3');
const { web3PortSocketConnectMaxAttempts, web3PortSocketTimeout } = require('../environment/interpolated/web3');
const { web3HostEnv, web3PortEnv } = require('../environment/web3Env');

const getWeb3Configuration = (Web3) => {
  const web3WebsocketOptions = {
    keepAlive: true,
    timeout: web3PortSocketTimeout,
    reconnect: {
      maxAttempts: web3PortSocketConnectMaxAttempts,
    },
  };

  const web3 = (web3HostEnv !== undefined && web3PortEnv !== undefined)
    ? new Web3(new Web3.providers.WebsocketProvider(getWeb3ProviderUrl()))
    : new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(getWeb3ProviderUrl(), web3WebsocketOptions));

  return {
    customProvider: web3,
  };
};

module.exports = {
  getWeb3Configuration,
};
