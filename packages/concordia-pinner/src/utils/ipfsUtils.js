export function displayIPFSStats(ipfs){
    //TODO: investigate occasional printing of duplicate peers
    setInterval(async () => {
        try {
            const peers = await ipfs.swarm.peers()
            console.log(`Number of peers: ${peers.length}`)
            console.dir(peers)
        } catch (err) {
            console.log('IPFS peer logging error:', err)
        }
    }, 3000)
}
