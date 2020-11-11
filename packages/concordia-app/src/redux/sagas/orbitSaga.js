import {
  call, put, all, take,
} from 'redux-saga/effects';

import { breezeActions } from '@ezerous/breeze';
import { drizzleActions } from '@ezerous/drizzle';

import { forumContract } from 'concordia-contracts';
import EthereumIdentityProvider from '../../orbit/ΕthereumIdentityProvider';

function* initOrbitDatabases(action) {
  const { account, breeze } = action;
  yield put(breezeActions.orbit.orbitInit(breeze, account + EthereumIdentityProvider.contractAddress)); // same as breeze.initOrbit(account);
}

function* orbitSaga() {
  const res = yield all([
    take(drizzleActions.drizzle.DRIZZLE_INITIALIZED),
    take(breezeActions.breeze.BREEZE_INITIALIZED),
    take(drizzleActions.account.ACCOUNTS_FETCHED),
  ]);

  const { drizzle: { web3 } } = res[0];
  const networkId = yield call([web3.eth.net, web3.eth.net.getId]);
  const contractAddress = forumContract.networks[networkId].address;

  EthereumIdentityProvider.setContractAddress(contractAddress);
  EthereumIdentityProvider.setWeb3(web3);

  yield initOrbitDatabases({ breeze: res[1].breeze, account: res[2].accounts[0] });
}

export default orbitSaga;
