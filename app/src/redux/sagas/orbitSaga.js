import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import isEqual from 'lodash.isequal';
import { forumContract, getCurrentAccount } from './drizzleUtilsSaga';
import { loadDatabases, orbitSagaOpen } from '../../utils/orbitUtils';
import { DRIZZLE_UTILS_SAGA_INITIALIZED } from '../actions/drizzleUtilsActions';
import {
  ADD_PEER_DATABASE, PEER_DATABASE_ADDED,
  DATABASES_NOT_READY,
  IPFS_INITIALIZED,
  UPDATE_PEERS, ORRBIT_GETTING_INFO, ORBIT_SAGA_ERROR
} from '../actions/orbitActions';
import { ACCOUNT_CHANGED } from '../actions/userActions';
import { ACCOUNTS_FETCHED } from '../actions/drizzleActions';

let latestAccount;

function* getOrbitDBInfo() {
  yield put({
    type: ORRBIT_GETTING_INFO, ...[]
  });
  const account = yield call(getCurrentAccount);
  if (account !== latestAccount) {
    const txObj1 = yield call(forumContract.methods.hasUserSignedUp,
      ...[account]);
    try {
      const callResult = yield call(txObj1.call, {
        address: account
      });
      if (callResult) {
        const txObj2 = yield call(forumContract.methods.getOrbitIdentityInfo,
          ...[account]);
        const orbitIdentityInfo = yield call(txObj2.call, {
          address: account
        });
        const txObj3 = yield call(forumContract.methods.getOrbitDBInfo,
          ...[account]);
        const orbitDBInfo = yield call(txObj3.call, {
          address: account
        });
        yield call(loadDatabases, orbitIdentityInfo[0], orbitIdentityInfo[1],
          orbitIdentityInfo[2],
          orbitDBInfo[0], orbitDBInfo[1], orbitDBInfo[2], orbitDBInfo[3],
          orbitDBInfo[4]);
      } else {
        yield put({
          type: DATABASES_NOT_READY, ...[]
        });
      }

      latestAccount = account;
    } catch (error) {
      console.error(error);
      yield put({
        type: ORBIT_SAGA_ERROR, ...[]
      });
    }
  }
}

let peerOrbitAddresses = new Set();

function* addPeerDatabase(action) {
  const fullAddress = action.fullAddress;
  const size = peerOrbitAddresses.size;
  peerOrbitAddresses.add(fullAddress);

  if(peerOrbitAddresses.size>size){
    const { orbitdb } = yield select(state => state.orbit);
    if(orbitdb){
      const store = yield call(orbitSagaOpen, orbitdb, fullAddress);
      yield put({
        type: PEER_DATABASE_ADDED, fullAddress, store: store
      });
    }
  }
}

//Keeps track of currently connected pubsub peers in Redux store (for debugging purposes)
function* updatePeersState() {
  const orbit = yield select(state => state.orbit);
  if(orbit.ready){
    const topicsDBAddress = orbit.topicsDB.address.toString();
    const postsDBAddress = orbit.postsDB.address.toString();
    const topicsDBPeers = yield call(orbit.ipfs.pubsub.peers, topicsDBAddress);
    const postsDBPeers = yield call(orbit.ipfs.pubsub.peers, postsDBAddress);
    if(!isEqual(topicsDBPeers.sort(), orbit.pubsubPeers.topicsDBPeers.sort()) ||
      !isEqual(postsDBPeers.sort(), orbit.pubsubPeers.postsDBPeers.sort())){
      yield put({
        type: UPDATE_PEERS, topicsDBPeers, postsDBPeers
      });
    }
  }
}

function* orbitSaga() {
  yield all([
    take(DRIZZLE_UTILS_SAGA_INITIALIZED),
    take(IPFS_INITIALIZED)
  ]);
  yield takeLatest(ACCOUNT_CHANGED, getOrbitDBInfo);
  yield takeEvery(ADD_PEER_DATABASE, addPeerDatabase);
  yield takeEvery(ACCOUNTS_FETCHED, updatePeersState);
}

export default orbitSaga;
