const { rendezvousHost, rendezvousPort } = require('../environment/interpolated/rendezvous');

const getRendezvousUrl = () => `http://${rendezvousHost}:${rendezvousPort}`;

module.exports = getRendezvousUrl;
