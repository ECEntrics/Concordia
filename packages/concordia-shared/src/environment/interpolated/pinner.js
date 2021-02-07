const {
  pinner: {
    port: PINNER_API_PORT_DEFAULT,
  },
} = require('../../constants/configuration/defaults');
const { pinnerApiPortEnv } = require('../pinnerEnv');

const pinnerApiPort = pinnerApiPortEnv || PINNER_API_PORT_DEFAULT;

module.exports = {
  pinnerApiPort,
};
