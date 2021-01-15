let Forum, Voting, PostVoting;

/* eslint-disable global-require */
try {
  Forum = require('./build/Forum.json');
  Voting = require('./build/Voting.json');
  PostVoting = require('./build/PostVoting.json');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error("Could not require contract artifacts. Haven't you run compile yet?");
}

module.exports = {
  contracts: [Forum, Voting, PostVoting],
};
