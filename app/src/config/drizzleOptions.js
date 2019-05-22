import Forum from '../contracts/Forum.json';
// Docs: https://truffleframework.com/docs/drizzle/reference/drizzle-options

const drizzleOptions = {
  contracts: [Forum],
  events: {
    Forum: ['UserSignedUp', 'UsernameUpdated', 'TopicCreated', 'PostCreated']
  },
  polls: {
    accounts: 2000,
    blocks: 2000
  }
};

export default drizzleOptions;
