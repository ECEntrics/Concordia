// Check out the documentation: https://truffleframework.com/docs/drizzle/reference/drizzle-options
import { contracts } from 'concordia-contracts';
import { getWeb3Configuration } from 'concordia-shared/src/configuration/web3Configuration';
import Web3 from 'web3';
import appEvents from 'concordia-shared/src/constants/contracts/events';
import downloadContractArtifactsSync from '../utils/drizzleUtils';

const drizzleOptions = {
  web3: getWeb3Configuration(Web3),
  events: { ...appEvents },
  reloadWindowOnNetworkChange: true,
  reloadWindowOnAccountChange: true, // We need it to reinitialize breeze and create new Orbit databases
};

if (process.env.REACT_APP_USE_EXTERNAL_CONTRACTS_PROVIDER
    || (window.runtimeEnv && window.runtimeEnv.REACT_APP_USE_EXTERNAL_CONTRACTS_PROVIDER)) {
  console.log('Downloading contracts from external provider');
  drizzleOptions.contracts = downloadContractArtifactsSync();
} else {
  drizzleOptions.contracts = contracts;
}

export default drizzleOptions;
