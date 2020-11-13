import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import {
  addOrbitDB,
  ORBIT_DB_READY,
  ORBIT_DB_REPLICATED,
  ORBIT_DB_WRITE,
} from '@ezerous/breeze/src/orbit/orbitActions';
import determineKVAddress from '../../utils/orbitUtils';
import { FETCH_USER_DATABASE, UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';

function* fetchUserDb({ orbit, userAddress }) {
  const peerDbAddress = yield call(determineKVAddress, {
    orbit, dbName: 'topics', userAddress,
  });

  yield put(addOrbitDB({ address: peerDbAddress, type: 'keyvalue' }));
}

function* updateReduxState({ database }) {
  const { topics, posts } = yield select((state) => ({
    topics: state.orbitData.topics,
    posts: state.orbitData.posts,
  }));

  if (database.dbname === 'topics') {
    const oldTopicsUnchanged = topics
      .filter((topic) => !Object
        .keys(database.all)
        .map((key) => parseInt(key, 10))
        .includes(topic.id));

    yield put({
      type: UPDATE_ORBIT_DATA,
      topics: [
        ...oldTopicsUnchanged,
        ...Object
          .entries(database.all)
          .map(([key, value]) => ({
            id: parseInt(key, 10),
            subject: value.subject,
          })),
      ],
      posts: [...posts],
    });
  }

  if (database.dbname === 'posts') {
    const oldPostsUnchanged = posts
      .filter((post) => !Object
        .keys(database.all)
        .map((key) => parseInt(key, 10))
        .includes(post.id));

    yield put({
      type: UPDATE_ORBIT_DATA,
      topics: [...topics],
      posts: [
        ...oldPostsUnchanged,
        ...Object.entries(database.all).map(([key, value]) => ({
          id: parseInt(key, 10),
          subject: value.subject,
          message: value.message,
        })),
      ],
    });
  }
}

function* peerDbReplicationSaga() {
  yield takeEvery(FETCH_USER_DATABASE, fetchUserDb);

  yield takeEvery(ORBIT_DB_REPLICATED, updateReduxState);
  yield takeEvery(ORBIT_DB_READY, updateReduxState);
  yield takeEvery(ORBIT_DB_WRITE, updateReduxState);
}

export default peerDbReplicationSaga;
