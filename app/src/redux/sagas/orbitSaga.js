import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import isEqual from 'lodash.isequal';
import { forumContract, getCurrentAccount } from './web3UtilsSaga';
import {
  createDatabases,
  loadDatabases,
  orbitSagaOpen
} from '../../utils/orbitUtils';
import { WEB3_UTILS_SAGA_INITIALIZED } from '../actions/web3UtilsActions';
import {
  ADD_PEER_DATABASE, PEER_DATABASE_ADDED,
  DATABASES_CREATED,
  IPFS_INITIALIZED,
  UPDATE_PEERS, ORBIT_INIT, ORBIT_SAGA_ERROR, updateDatabases
} from '../actions/orbitActions';
import { ACCOUNT_CHANGED } from '../actions/userActions';
import { ACCOUNTS_FETCHED } from '../actions/drizzleActions';

let latestAccount;

function* getOrbitDBInfo() {
  yield put.resolve({
    type: ORBIT_INIT, ...[]
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
        yield call(loadDatabases);
      } else {
        const orbit = yield select(state => state.orbit);
        if(!orbit.ready){
          const { orbitdb, topicsDB, postsDB } = yield call(createDatabases);
          yield put(updateDatabases(DATABASES_CREATED, orbitdb, topicsDB, postsDB ));
        }
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
//Feel free to disable it anytime
function* updatePeersState() {
  const orbit = yield select(state => state.orbit);
  if(orbit.ready){
    // This try is here to ignore concurrency errors that arise from times to times
    try{
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
    } catch (e) {
      // No need to catch anything
    }
  }
}

function* orbitSaga() {
  yield all([
    take(WEB3_UTILS_SAGA_INITIALIZED),
    take(IPFS_INITIALIZED)
  ]);
  yield takeLatest(ACCOUNT_CHANGED, getOrbitDBInfo);
  yield takeEvery(ADD_PEER_DATABASE, addPeerDatabase);
  yield takeEvery(ACCOUNTS_FETCHED, updatePeersState);
}

export default orbitSaga;
