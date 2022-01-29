const {
  pinner: {
    host: PINNER_API_HOST_DEFAULT,
    port: PINNER_API_PORT_DEFAULT,
  },
} = require('../../constants/configuration/defaults');
const { pinnerApiHostEnv, pinnerApiPortEnv } = require('../pinnerEnv');

const pinnerApiHost = pinnerApiHostEnv || PINNER_API_HOST_DEFAULT;
const pinnerApiPort = pinnerApiPortEnv || PINNER_API_PORT_DEFAULT;

module.exports = {
  pinnerApiHost,
  pinnerApiPort,
};
