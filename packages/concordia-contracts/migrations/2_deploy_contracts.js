const Forum = artifacts.require('Forum');
const Voting = artifacts.require('Voting');
const PostVoting = artifacts.require('PostVoting');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  return deployer.deploy(Forum)
    .then(async (forum) => Promise.all([
      deployer.deploy(Voting, forum.address),
      deployer.deploy(PostVoting, forum.address),
    ]));
};
