const forumContractEvents = require('./ForumContractEvents');
const { FORUM_CONTRACT } = require('../ContractNames');

const appEvents = Object.freeze({
  [FORUM_CONTRACT]: forumContractEvents,
});

module.exports = appEvents;
