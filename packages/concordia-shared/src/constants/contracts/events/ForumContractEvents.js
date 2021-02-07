const USER_SIGNED_UP_EVENT = 'UserSignedUp';
const USERNAME_UPDATED_EVENT = 'UsernameUpdated';
const TOPIC_CREATED_EVENT = 'TopicCreated';
const POST_CREATED_EVENT = 'PostCreated';

const forumContractEvents = Object.freeze([
  USER_SIGNED_UP_EVENT,
  USERNAME_UPDATED_EVENT,
  TOPIC_CREATED_EVENT,
  POST_CREATED_EVENT,
]);

module.exports = {
  USER_SIGNED_UP_EVENT,
  USERNAME_UPDATED_EVENT,
  TOPIC_CREATED_EVENT,
  POST_CREATED_EVENT,
  forumContractEvents,
};
