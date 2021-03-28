import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import {
  addOrbitDB,
  ORBIT_DB_READY,
  ORBIT_DB_REPLICATED,
  ORBIT_DB_WRITE,
} from '@ezerous/breeze/src/orbit/orbitActions';
import {
  POLLS_DATABASE,
  POSTS_DATABASE,
  TOPICS_DATABASE,
  USER_DATABASE,
} from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import determineKVAddress from '../../utils/orbitUtils';
import { FETCH_USER_DATABASE, UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';
import userDatabaseKeys from '../../constants/orbit/UserDatabaseKeys';
import { TOPIC_SUBJECT } from '../../constants/orbit/TopicsDatabaseKeys';
import { POST_CONTENT } from '../../constants/orbit/PostsDatabaseKeys';
import { POLL_OPTIONS, POLL_QUESTION } from '../../constants/orbit/PollsDatabaseKeys';

function* fetchUserDb({ orbit, userAddress, dbName }) {
  const peerDbAddress = yield call(determineKVAddress, {
    orbit, dbName, userAddress,
  });

  yield put(addOrbitDB({ address: peerDbAddress, type: 'keyvalue' }));
}

function* updateReduxState({ database }) {
  const {
    users, topics, posts, polls,
  } = yield select((state) => ({
    users: state.orbitData.users,
    topics: state.orbitData.topics,
    posts: state.orbitData.posts,
    polls: state.orbitData.polls,
  }));

  if (database.dbname === USER_DATABASE) {
    const oldUsersUnchanged = users
      .filter((user) => database.id !== user.id);

    yield put({
      type: UPDATE_ORBIT_DATA,
      users: [
        ...oldUsersUnchanged,
        {
          id: database.id,
          // Don't ask how.. it just works
          ...Object
            .entries(database.all)
            .filter(([key]) => userDatabaseKeys.includes(key))
            .reduce(((acc, keyValue) => {
              const [key, value] = keyValue;
              acc[key] = value;

              return acc;
            }), {}),
        },
      ],
      topics: [...topics],
      posts: [...posts],
      polls: [...polls],
    });
  }

  if (database.dbname === TOPICS_DATABASE) {
    const oldTopicsUnchanged = topics
      .filter((topic) => !Object
        .keys(database.all)
        .map((key) => parseInt(key, 10))
        .includes(topic.id));

    yield put({
      type: UPDATE_ORBIT_DATA,
      users: [...users],
      topics: [
        ...oldTopicsUnchanged,
        ...Object
          .entries(database.all)
          .map(([key, value]) => ({
            id: parseInt(key, 10),
            [TOPIC_SUBJECT]: value[TOPIC_SUBJECT],
          })),
      ],
      posts: [...posts],
      polls: [...polls],
    });
  }

  if (database.dbname === POSTS_DATABASE) {
    const oldPostsUnchanged = posts
      .filter((post) => !Object
        .keys(database.all)
        .map((key) => parseInt(key, 10))
        .includes(post.id));

    yield put({
      type: UPDATE_ORBIT_DATA,
      users: [...users],
      topics: [...topics],
      posts: [
        ...oldPostsUnchanged,
        ...Object.entries(database.all).map(([key, value]) => ({
          id: parseInt(key, 10),
          [POST_CONTENT]: value[POST_CONTENT],
        })),
      ],
      polls: [...polls],
    });
  }

  if (database.dbname === POLLS_DATABASE) {
    const oldPollsUnchanged = polls
      .filter((poll) => !Object
        .keys(database.all)
        .map((key) => parseInt(key, 10))
        .includes(poll.id));

    yield put({
      type: UPDATE_ORBIT_DATA,
      users: [...users],
      topics: [...topics],
      posts: [...posts],
      polls: [
        ...oldPollsUnchanged,
        ...Object.entries(database.all).map(([key, value]) => ({
          id: parseInt(key, 10),
          [POLL_QUESTION]: value[POLL_QUESTION],
          [POLL_OPTIONS]: [
            ...value[POLL_OPTIONS],
          ],
        })),
      ],
    });
  }
}

function* peerDbReplicationSaga() {
  yield takeEvery(FETCH_USER_DATABASE, fetchUserDb);

  yield takeEvery([ORBIT_DB_READY, ORBIT_DB_REPLICATED, ORBIT_DB_WRITE], updateReduxState);
}

export default peerDbReplicationSaga;
