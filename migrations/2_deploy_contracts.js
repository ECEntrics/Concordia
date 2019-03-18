const Forum = artifacts.require("Forum");
const Posting = artifacts.require("Posting");

module.exports = function(deployer) {
  deployer.deploy(Posting).then(function() {
    return deployer.deploy(Forum, Posting.address)
  });
};
