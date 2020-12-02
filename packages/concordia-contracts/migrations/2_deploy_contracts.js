const Forum = artifacts.require('Forum');
const Voting = artifacts.require('Voting');
const PostVoting = artifacts.require('PostVoting');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Forum).then(async (forum) => {
    await deployer.deploy(Voting, forum.address);
    await deployer.deploy(PostVoting, forum.address);
  });
};
