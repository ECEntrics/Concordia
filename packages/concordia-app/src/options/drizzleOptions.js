// Check out the documentation: https://truffleframework.com/docs/drizzle/reference/drizzle-options
import { contracts } from 'concordia-contracts';
import web3Options from './web3Options';
import appEvents from '../constants/contracts/events';
import { downloadContractArtifactsSync } from '../utils/drizzleUtils';

const drizzleOptions = {
  web3: web3Options,
  events: { ...appEvents },
  reloadWindowOnNetworkChange: true,
  reloadWindowOnAccountChange: true, // We need it to reinitialize breeze and create new Orbit databases
};

const CONTRACTS_SUPPLIER_URL = process.env.REACT_APP_CONTRACTS_SUPPLIER;

if (!CONTRACTS_SUPPLIER_URL) {
  drizzleOptions.contracts = contracts;
} else {
  const remoteContracts = downloadContractArtifactsSync();
  console.log(remoteContracts);
  drizzleOptions.contracts = remoteContracts;
}

export default drizzleOptions;
