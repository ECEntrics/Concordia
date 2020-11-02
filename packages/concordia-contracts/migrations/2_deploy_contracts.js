const Forum = artifacts.require('Forum');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
    deployer.deploy(Forum);
};
