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
        Forum: ['UserSignedUp']
    }
};

export default drizzleOptions