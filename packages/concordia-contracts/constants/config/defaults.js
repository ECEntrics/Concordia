const DEVELOP_CHAIN_HOST_DEFAULT = '127.0.0.1';
const DEVELOP_CHAIN_PORT_DEFAULT = '8545';

const TEST_CHAIN_HOST_DEFAULT = '127.0.0.1';
const TEST_CHAIN_PORT_DEFAULT = '8546';

module.exports = {
  develop: {
    chainHost: DEVELOP_CHAIN_HOST_DEFAULT,
    chainPort: DEVELOP_CHAIN_PORT_DEFAULT,
  },
  test: {
    chainHost: TEST_CHAIN_HOST_DEFAULT,
    chainPort: TEST_CHAIN_PORT_DEFAULT,
  },
};
