import { ADD_USER_POST, ADD_USER_TOPIC, UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';

const initialState = {
  topics: [],
  posts: [],
};

const peerDbReplicationReducer = (state = initialState, action) => {
  const { type } = action;

  if (type === ADD_USER_TOPIC) {
    const { topic } = action;

    return {
      ...state,
      topics: [
        ...state.topics,
        topic,
      ],
    };
  }

  if (type === ADD_USER_POST) {
    const { post } = action;

    return {
      ...state,
      posts: [
        ...state.posts,
        post,
      ],
    };
  }

  if (type === UPDATE_ORBIT_DATA) {
    const { topics, posts } = action;

    return {
      ...state,
      topics: [
        ...topics,
      ],
      posts: [
        ...posts,
      ],
    };
  }

  return state;
};

export default peerDbReplicationReducer;
