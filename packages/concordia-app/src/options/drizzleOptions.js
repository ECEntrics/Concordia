// See also: https://truffleframework.com/docs/drizzle/reference/drizzle-options
import { contracts } from 'concordia-contracts';
import web3Options from './web3Options';
import forumContractEvents from '../constants/ForumContractEvents';
import { FORUM_CONTRACT } from '../constants/ContractNames';

const drizzleOptions = {
  web3: {
    customProvider: web3Options.web3,
  },
  contracts,
  events: {
    [FORUM_CONTRACT]: forumContractEvents,
  },
  reloadWindowOnNetworkChange: true,
  reloadWindowOnAccountChange: true, // We need it to reinitialize breeze and create new Orbit databases
};

export default drizzleOptions;
