// Depending on the package user (app in contrast to any of the other packages) the env var names should either include
// the REACT_APP_ prefix or not

const runtimeEnv = typeof window !== 'undefined' && window.runtimeEnv;

const rendezvousHostEnv = process.env.REACT_APP_RENDEZVOUS_HOST
    || (runtimeEnv && runtimeEnv.REACT_APP_RENDEZVOUS_HOST)
    || process.env.RENDEZVOUS_HOST;
const rendezvousPortEnv = process.env.REACT_APP_RENDEZVOUS_PORT
    || (runtimeEnv && runtimeEnv.REACT_APP_RENDEZVOUS_PORT)
    || process.env.RENDEZVOUS_PORT;

module.exports = {
  rendezvousHostEnv,
  rendezvousPortEnv,
};
