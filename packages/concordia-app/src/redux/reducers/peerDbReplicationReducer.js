import { UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';

const initialState = {
  fetchedPeerDatabases: [],
  topics: [],
  posts: [],
};

const peerDbReplicationReducer = (state = initialState, action) => {
  const { type } = action;

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
