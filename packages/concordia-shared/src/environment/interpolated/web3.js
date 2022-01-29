const {
  web3: {
    develop: {
      chainHost: WEB3_HOST_DEFAULT,
      chainPort: WEB3_PORT_DEFAULT,
    },
    test: {
      chainHost: WEB3_HOST_TEST_DEFAULT,
      chainPort: WEB3_PORT_TEST_DEFAULT,
    },
    socketConnectMaxAttempts: WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT,
    socketTimeout: WEB3_PORT_SOCKET_TIMEOUT_DEFAULT,
  },
} = require('../../constants/configuration/defaults');
const {
  web3HostEnv, web3HostTestEnv, web3PortEnv, web3PortSocketConnectMaxAttemptsEnv, web3PortSocketTimeoutEnv,
  web3PortTestEnv,
} = require('../web3Env');

const web3Host = web3HostEnv || WEB3_HOST_DEFAULT;
const web3Port = web3PortEnv || WEB3_PORT_DEFAULT;

const web3HostTest = web3HostTestEnv || WEB3_HOST_TEST_DEFAULT;
const web3PortTest = web3PortTestEnv || WEB3_PORT_TEST_DEFAULT;

const web3PortSocketTimeout = web3PortSocketTimeoutEnv || WEB3_PORT_SOCKET_TIMEOUT_DEFAULT;
const web3PortSocketConnectMaxAttempts = web3PortSocketConnectMaxAttemptsEnv
    || WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS_DEFAULT;

module.exports = {
  web3Host,
  web3Port,
  web3HostTest,
  web3PortTest,
  web3PortSocketTimeout,
  web3PortSocketConnectMaxAttempts,
};
