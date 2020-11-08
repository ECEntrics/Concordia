import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import {
  createOrbitDatabase,
  ORBIT_DATABASE_READY,
  ORBIT_DATABASE_REPLICATED,
} from '@ezerous/breeze/src/orbit/orbitActions';
import determineDBAddress from '../../orbit/orbitUtils';
import {
  ADD_USER_POST,
  ADD_USER_TOPIC,
  FETCH_USER_POST,
  FETCH_USER_TOPIC,
  UPDATE_ORBIT_DATA,
} from '../actions/peerDbReplicationActions';

function* fetchUserDb({ orbit, peerDbAddress }) {
  yield put(createOrbitDatabase(orbit, { name: peerDbAddress, type: 'keyvalue' }));
}

function* fetchTopic({ orbit, userAddress, topicId }) {
  const previousTopics = yield select((state) => state.orbitData.topics);
  const peerDbAddress = yield call(determineDBAddress, {
    orbit, dbName: 'topics', type: 'keyvalue', identityId: userAddress,
  });

  if (previousTopics === undefined || !previousTopics.some((topic) => topic.topicId === topicId)) {
    yield put({
      type: ADD_USER_TOPIC,
      topic: {
        userAddress,
        dbAddress: peerDbAddress,
        topicId,
        subject: null,
      },
    });
  }

  yield call(fetchUserDb, { orbit, peerDbAddress });
}

function* fetchUserPost({ orbit, userAddress, postId }) {
  const previousPosts = yield select((state) => state.orbitData.posts);
  const peerDbAddress = yield call(determineDBAddress, {
    orbit, dbName: 'posts', type: 'keyvalue', identityId: userAddress,
  });

  if (previousPosts === undefined || !previousPosts.some((post) => post.postId === postId)) {
    yield put({
      type: ADD_USER_POST,
      posts: {
        userAddress,
        dbAddress: peerDbAddress,
        postId,
        subject: null,
        message: null,
      },
    });
  }

  yield call(fetchUserDb, { orbit, peerDbAddress });
}

function* updateReduxState({ database }) {
  const { topics, posts } = yield select((state) => ({ topics: state.orbitData.topics, posts: state.orbitData.posts }));

  yield put({
    type: UPDATE_ORBIT_DATA,
    topics: topics.map((topic) => {
      if (database.id === topic.dbAddress) {
        return ({
          ...topic,
          ...database.get(topic.topicId),
        });
      }

      return { ...topic };
    }),
    posts: posts.map((post) => {
      if (database.id === post.dbAddress) {
        return ({
          ...post,
          ...database.get(post.postId),
        });
      }

      return { ...post };
    }),
  });
}

function* peerDbReplicationSaga() {
  yield takeEvery(FETCH_USER_TOPIC, fetchTopic);
  yield takeEvery(FETCH_USER_POST, fetchUserPost);
  yield takeEvery(ORBIT_DATABASE_REPLICATED, updateReduxState);
  yield takeEvery(ORBIT_DATABASE_READY, updateReduxState);
}

export default peerDbReplicationSaga;
