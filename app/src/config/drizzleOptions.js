import Forum from '../contracts/Forum.json';
import Posting from '../contracts/Posting.json';

const drizzleOptions = {
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
  },
  contracts: [Forum, Posting],
  events: {
    Forum: ['UserSignedUp', 'UsernameUpdated'],
    Posting: ['TopicCreated', 'PostCreated']
  },
  polls: {
    accounts: 2000,
    blocks: 2000
  }
};

export default drizzleOptions;
