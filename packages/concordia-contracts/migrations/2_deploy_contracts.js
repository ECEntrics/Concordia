const Forum = artifacts.require('Forum');
const Voting = artifacts.require('Voting');
const PostVoting = artifacts.require('PostVoting');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Forum).then((forum) => {
    deployer.deploy(Voting, forum.address);
    deployer.deploy(PostVoting, forum.address);
  });
};
