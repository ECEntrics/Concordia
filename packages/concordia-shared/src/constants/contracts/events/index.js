const { forumContractEvents } = require('./ForumContractEvents');
const { postVotingContractEvents } = require('./PostVotingContractEvents');
const { votingContractEvents } = require('./VotingContractEvents');
const { FORUM_CONTRACT, POST_VOTING_CONTRACT, VOTING_CONTRACT } = require('../ContractNames');

const appEvents = Object.freeze({
  [FORUM_CONTRACT]: forumContractEvents,
  [POST_VOTING_CONTRACT]: postVotingContractEvents,
  [VOTING_CONTRACT]: votingContractEvents,
});

module.exports = appEvents;
