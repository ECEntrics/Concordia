import {
  POST_CREATED_EVENT,
  TOPIC_CREATED_EVENT,
  USER_SIGNED_UP_EVENT,
  USERNAME_UPDATED_EVENT,
} from '../../constants/ForumContractEvents';

export const FORUM_EVENT_USER_SIGNED_UP = 'FORUM_EVENT_USER_SIGNED_UP';
export const FORUM_EVENT_USERNAME_UPDATED = 'FORUM_EVENT_USERNAME_UPDATED';
export const FORUM_EVENT_TOPIC_CREATED = 'FORUM_EVENT_TOPIC_CREATED';
export const FORUM_EVENT_POST_CREATED = 'FORUM_EVENT_POST_CREATED';

const eventActionMap = {
  [USER_SIGNED_UP_EVENT]: FORUM_EVENT_USER_SIGNED_UP,
  [USERNAME_UPDATED_EVENT]: FORUM_EVENT_USERNAME_UPDATED,
  [TOPIC_CREATED_EVENT]: FORUM_EVENT_TOPIC_CREATED,
  [POST_CREATED_EVENT]: FORUM_EVENT_POST_CREATED,
};

export default eventActionMap;