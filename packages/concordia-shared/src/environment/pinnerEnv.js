// Depending on the package user (app in contrast to any of the other packages) the env var names should either include
// the REACT_APP_ prefix or not
const pinnerApiHostEnv = process.env.REACT_APP_PINNER_API_HOST || process.env.PINNER_API_HOST;
const pinnerApiPortEnv = process.env.REACT_APP_PINNER_API_PORT || process.env.PINNER_API_PORT;

module.exports = {
  pinnerApiHostEnv,
  pinnerApiPortEnv,
};
