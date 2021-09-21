import {
  call, put, all, take,
} from 'redux-saga/effects';

import { breezeActions } from '@ecentrics/breeze';
import { drizzleActions } from '@ecentrics/drizzle';

import { EthereumContractIdentityProvider } from '@ecentrics/eth-identity-provider';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import drizzleOptions from '../../options/drizzleOptions';

function* initOrbitDatabases(action) {
  const { account, breeze } = action;
  // same as breeze.initOrbit(account);
  yield put(breezeActions.orbit.orbitInit(breeze, account + EthereumContractIdentityProvider.contractAddress));
}

function* orbitSaga() {
  const res = yield all([
    take(drizzleActions.drizzle.DRIZZLE_INITIALIZED),
    take(breezeActions.breeze.BREEZE_INITIALIZED),
    take(drizzleActions.account.ACCOUNTS_FETCHED),
  ]);

  const { drizzle: { web3 } } = res[0];
  const networkId = yield call([web3.eth.net, web3.eth.net.getId]);
  const contractAddress = drizzleOptions.contracts
    .find((contract) => contract.contractName === FORUM_CONTRACT)
    .networks[networkId].address;

  EthereumContractIdentityProvider.setContractAddress(contractAddress);
  EthereumContractIdentityProvider.setWeb3(web3);

  yield initOrbitDatabases({ breeze: res[1].breeze, account: res[2].accounts[0] });
}

export default orbitSaga;
