const { forumContractEvents } = require('./ForumContractEvents');
const { postVotingContractEvents } = require('./PostVotingContractEvents');
const { FORUM_CONTRACT, POST_VOTING_CONTRACT } = require('../ContractNames');

const appEvents = Object.freeze({
  [FORUM_CONTRACT]: forumContractEvents,
  [POST_VOTING_CONTRACT]: postVotingContractEvents,
});

module.exports = appEvents;
