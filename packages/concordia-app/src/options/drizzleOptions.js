// Check out the documentation: https://truffleframework.com/docs/drizzle/reference/drizzle-options
import { contracts } from 'concordia-contracts';
import web3Options from './web3Options';
import appEvents from '../constants/contracts/events';

const drizzleOptions = {
  web3: web3Options,
  contracts,
  events: { ...appEvents },
  reloadWindowOnNetworkChange: true,
  reloadWindowOnAccountChange: true, // We need it to reinitialize breeze and create new Orbit databases
};

export default drizzleOptions;
