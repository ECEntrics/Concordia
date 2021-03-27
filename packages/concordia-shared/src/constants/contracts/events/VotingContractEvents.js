const POLL_CREATED_EVENT = 'PollCreated';
const USER_VOTED_POLL_EVENT = 'UserVotedPoll';

const votingContractEvents = Object.freeze([
  POLL_CREATED_EVENT,
  USER_VOTED_POLL_EVENT,
]);

module.exports = {
  POLL_CREATED_EVENT,
  USER_VOTED_POLL_EVENT,
  votingContractEvents,
};
