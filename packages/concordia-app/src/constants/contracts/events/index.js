import { FORUM_CONTRACT } from '../ContractNames';
import forumContractEvents from './ForumContractEvents';

const appEvents = {
  [FORUM_CONTRACT]: forumContractEvents,
};

export default appEvents;
