// OrbitDB uses Pubsub which is an experimental feature and need to be turned on manually.
const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    }, config: {
        Addresses: {
            Swarm: [
            ]
        }
    },
};

export default ipfsOptions;