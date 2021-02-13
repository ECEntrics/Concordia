// Depending on the package user (app in contrast to any of the other packages) the env var names should either include
// the REACT_APP_ prefix or not

const runtimeEnv = typeof window !== 'undefined' && window.runtimeEnv;

const web3HostEnv = process.env.REACT_APP_WEB3_HOST
    || (runtimeEnv && runtimeEnv.REACT_APP_WEB3_HOST)
    || process.env.WEB3_HOST;
const web3PortEnv = process.env.REACT_APP_WEB3_PORT
    || (runtimeEnv && runtimeEnv.REACT_APP_WEB3_PORT)
    || process.env.WEB3_PORT;

// Web3 test environment shouldn't be available to the react app
const web3HostTestEnv = process.env.WEB3_HOST_TEST;
const web3PortTestEnv = process.env.WEB3_PORT_TEST;

const web3PortSocketTimeoutEnv = process.env.REACT_APP_WEB3_PORT_SOCKET_TIMEOUT
    || (runtimeEnv && runtimeEnv.REACT_APP_WEB3_PORT_SOCKET_TIMEOUT)
    || process.env.WEB3_PORT_SOCKET_TIMEOUT;
const web3PortSocketConnectMaxAttemptsEnv = process.env.REACT_APP_WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS
    || (runtimeEnv && runtimeEnv.REACT_APP_WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS)
    || process.env.WEB3_PORT_SOCKET_CONNECT_MAX_ATTEMPTS;

module.exports = {
  web3HostEnv,
  web3PortEnv,
  web3HostTestEnv,
  web3PortTestEnv,
  web3PortSocketTimeoutEnv,
  web3PortSocketConnectMaxAttemptsEnv,
};
