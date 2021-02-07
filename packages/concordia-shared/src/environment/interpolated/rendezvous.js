const { rendezvousHostEnv, rendezvousPortEnv } = require('../rendezvousEnv');
const {
  rendezvous: {
    host: RENDEZVOUS_HOST_DEFAULT,
    port: RENDEZVOUS_PORT_DEFAULT,
  },
} = require('../../constants/configuration/defaults');

const rendezvousHost = rendezvousHostEnv || RENDEZVOUS_HOST_DEFAULT;
const rendezvousPort = rendezvousPortEnv || RENDEZVOUS_PORT_DEFAULT;

module.exports = {
  rendezvousHost,
  rendezvousPort,
};
