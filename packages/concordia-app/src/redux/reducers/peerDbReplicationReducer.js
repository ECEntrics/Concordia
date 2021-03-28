import { UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';

const initialState = {
  users: [],
  topics: [],
  posts: [],
  polls: [],
};

const peerDbReplicationReducer = (state = initialState, action) => {
  const { type } = action;

  if (type === UPDATE_ORBIT_DATA) {
    const {
      users, topics, posts, polls,
    } = action;

    return {
      ...state,
      users: [
        ...users,
      ],
      topics: [
        ...topics,
      ],
      posts: [
        ...posts,
      ],
      polls: [
        ...polls,
      ],
    };
  }

  return state;
};

export default peerDbReplicationReducer;
