import Web3 from 'web3';

const { WEB3_URL, WEB3_PORT } = process.env;

// We need fallback ws://127.0.0.1:8545 because drizzle has not the patched web3 we use here
const web3 = (WEB3_URL && WEB3_PORT)
  ? `ws://${WEB3_URL}:${WEB3_PORT}`
  : new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));

const web3Options = {
  web3,
};

export default web3Options;
