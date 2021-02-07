const { web3Port } = require('../environment/interpolated/web3');
const { web3Host } = require('../environment/interpolated/web3');

const getWeb3ProviderUrl = () => `ws://${web3Host}:${web3Port}`;

module.exports = getWeb3ProviderUrl;
