// Check out the documentation: https://truffleframework.com/docs/drizzle/reference/drizzle-options
import { contracts } from 'concordia-contracts';
import web3Options from './web3Options';
import appEvents from '../constants/contracts/events';
import downloadContractArtifactsSync from '../utils/drizzleUtils';

const drizzleOptions = {
  web3: web3Options,
  events: { ...appEvents },
  reloadWindowOnNetworkChange: true,
  reloadWindowOnAccountChange: true, // We need it to reinitialize breeze and create new Orbit databases
};

if (process.env.REACT_APP_USE_EXTERNAL_CONTRACTS_SUPPLIER) {
  drizzleOptions.contracts = downloadContractArtifactsSync();
} else {
  drizzleOptions.contracts = contracts;
}

export default drizzleOptions;
