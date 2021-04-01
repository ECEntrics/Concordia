import {
  POST_CREATED_EVENT,
  TOPIC_CREATED_EVENT,
  USER_SIGNED_UP_EVENT,
  USERNAME_UPDATED_EVENT,
} from 'concordia-shared/src/constants/contracts/events/ForumContractEvents';
import {
  USER_VOTED_POST_EVENT,
} from 'concordia-shared/src/constants/contracts/events/PostVotingContractEvents';
import {
  POLL_CREATED_EVENT,
  USER_VOTED_POLL_EVENT,
} from 'concordia-shared/src/constants/contracts/events/VotingContractEvents';

export const FORUM_EVENT_USER_SIGNED_UP = 'FORUM_EVENT_USER_SIGNED_UP';
export const FORUM_EVENT_USERNAME_UPDATED = 'FORUM_EVENT_USERNAME_UPDATED';
export const FORUM_EVENT_TOPIC_CREATED = 'FORUM_EVENT_TOPIC_CREATED';
export const FORUM_EVENT_POST_CREATED = 'FORUM_EVENT_POST_CREATED';

export const POST_VOTING_USER_VOTED_POST = 'POST_VOTING_USER_VOTED_POST';

export const VOTING_POLL_CREATED = 'VOTING_POLL_CREATED';
export const VOTING_USER_VOTED_POLL = 'VOTING_USER_VOTED_POLL';

const eventActionMap = {
  [USER_SIGNED_UP_EVENT]: FORUM_EVENT_USER_SIGNED_UP,
  [USERNAME_UPDATED_EVENT]: FORUM_EVENT_USERNAME_UPDATED,
  [TOPIC_CREATED_EVENT]: FORUM_EVENT_TOPIC_CREATED,
  [POST_CREATED_EVENT]: FORUM_EVENT_POST_CREATED,
  [USER_VOTED_POST_EVENT]: POST_VOTING_USER_VOTED_POST,
  [POLL_CREATED_EVENT]: VOTING_POLL_CREATED,
  [USER_VOTED_POLL_EVENT]: VOTING_USER_VOTED_POLL,
};

export default eventActionMap;
