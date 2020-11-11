import Web3 from 'web3';

const { WEB3_URL, WEB3_PORT } = process.env;

const web3 = new Web3(Web3.givenProvider || `ws://${WEB3_URL}:${WEB3_PORT}`);

const web3Options = {
  web3,
};

export default web3Options;
