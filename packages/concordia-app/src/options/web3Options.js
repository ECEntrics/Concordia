import Web3 from 'web3';
import {
  WEB3_HOST_DEFAULT,
  WEB3_PORT_DEFAULT,
  WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT,
  WEB3_PORT_SOCKET_TIMEOUT_DEFAULT,
} from '../constants/configuration/defaults';

const { WEB3_HOST, WEB3_PORT, WEBSOCKET_TIMEOUT } = process.env;

const web3WebsocketOptions = {
  keepAlive: true,
  timeout: WEBSOCKET_TIMEOUT !== undefined ? WEBSOCKET_TIMEOUT : WEB3_PORT_SOCKET_TIMEOUT_DEFAULT,
  reconnect: {
    maxAttempts: WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT,
  },
};

const web3 = (WEB3_HOST !== undefined && WEB3_PORT !== undefined)
  ? new Web3(new Web3.providers.WebsocketProvider(`ws://${WEB3_HOST}:${WEB3_PORT}`))
  : new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(
    `ws://${WEB3_HOST_DEFAULT}:${WEB3_PORT_DEFAULT}`, web3WebsocketOptions,
  ));

const web3Options = {
  customProvider: web3,
};

export default web3Options;
