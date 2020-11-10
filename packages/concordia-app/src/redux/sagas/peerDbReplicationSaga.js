import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import {
  createOrbitDatabase,
  ORBIT_DATABASE_READY,
  ORBIT_DATABASE_REPLICATED,
  ORBIT_DATABASE_WRITE,
} from '@ezerous/breeze/src/orbit/orbitActions';
import determineDBAddress from '../../orbit/orbitUtils';
import { FETCH_USER_DATABASE, UPDATE_ORBIT_DATA } from '../actions/peerDbReplicationActions';

function* fetchUserDb({ orbit, userAddress }) {
  const peerDbAddress = yield call(determineDBAddress, {
    orbit, dbName: 'topics', type: 'keyvalue', identityId: userAddress,
  });

  yield put(createOrbitDatabase(orbit, { name: peerDbAddress, type: 'keyvalue' }));
}

function* updateReduxState({ database }) {
  const { topics, posts } = yield select((state) => ({
    topics: state.orbitData.topics,
    posts: state.orbitData.posts,
  }));

  if (database.dbname === 'topics') {
    yield put({
      type: UPDATE_ORBIT_DATA,
      topics: [...Object.entries(database.all).map(([key, value]) => ({
        id: parseInt(key, 10),
        subject: value.subject,
      }))],
      posts: [...posts],
    });
  }

  if (database.dbname === 'posts') {
    yield put({
      type: UPDATE_ORBIT_DATA,
      topics: [...topics],
      posts: [...Object.entries(database.all).map(([key, value]) => ({
        id: parseInt(key, 10),
        subject: value.subject,
        message: value.message,
      }))],
    });
  }
}

function* peerDbReplicationSaga() {
  yield takeEvery(FETCH_USER_DATABASE, fetchUserDb);

  yield takeEvery(ORBIT_DATABASE_REPLICATED, updateReduxState);
  yield takeEvery(ORBIT_DATABASE_READY, updateReduxState);
  yield takeEvery(ORBIT_DATABASE_WRITE, updateReduxState);
}

export default peerDbReplicationSaga;
