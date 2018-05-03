import Forum from './build/contracts/Forum.json'

const drizzleOptions = {
    web3: {
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545'
        }
    },
    contracts: [
        Forum
    ],
    events: {
        Forum: ['UserSignedUp', 'UsernameUpdated']
    },
    polls: {
        accounts: 3000,
        blocks: 3000
    },
};

export default drizzleOptions