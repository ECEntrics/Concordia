import Web3 from 'web3';
import EthereumIdentityProvider from '../orbit/ΕthereumIdentityProvider';

const { WEB3_URL, WEB3_PORT } = process.env;

const web3 = new Web3(Web3.givenProvider || `ws://${WEB3_URL}:${WEB3_PORT}`);

EthereumIdentityProvider.setWeb3(web3);

const web3Options = {
    web3
};

export default web3Options;
