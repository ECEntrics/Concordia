import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import IPFS from 'ipfs';
import express from 'express'
import isReachable from 'is-reachable'; //TODO: health checking web3 network and rendezvous
import _ from 'lodash';
import { forumContract } from 'concordia-contracts';
import { createOrbitInstance, getPeerDatabases, openKVDBs } from './utils/orbitUtils';
import ipfsOptions from './options/ipfsOptions';
import { web3ProviderUrl } from './constants';
const API_PORT = process.env.PINNER_API_PORT || 4444;

process.on('unhandledRejection', error => {
  // This happens when attempting to initialize without any available Swarm addresses (e.g. Rendezvous)
  if(error.code === 'ERR_NO_VALID_ADDRESSES'){
    console.error('unhandledRejection', error.message);
    process.exit(1);
  }
});

let ipfs;

async function main () {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3ProviderUrl));
  const networkId = await web3.eth.net.getId();

  const contractAddress = forumContract.networks[networkId].address;

  Contract.setProvider(web3ProviderUrl);
  const contract = new Contract(forumContract.abi, contractAddress);

  ipfs = await IPFS.create(ipfsOptions);
  const orbit = await createOrbitInstance(ipfs, contractAddress);

  // Open & replicate databases of existing users
  const userAddresses = await contract.methods.getUserAddresses().call();
  const peerDBs = await getPeerDatabases(orbit, userAddresses);
  await openKVDBs(orbit, peerDBs);

  // Listen for new users and subscribe to their databases
  const eventJsonInterface = web3.utils._.find(
      contract._jsonInterface,
      obj => obj.name === "UserSignedUp" && obj.type === 'event'
  );
  web3.eth.subscribe('logs', {
    address: contractAddress,
    topics: [eventJsonInterface.signature]
  }, function(error, result){
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          result.data,
          result.topics.slice(1)
      )
      console.log(`User signed up:`, eventObj[1]);
      getPeerDatabases(orbit, userAddresses).then(peerDBs => openKVDBs(orbit, peerDBs));
    }
  });
}

main();

const app = express();

app.get('/', async (req, res) => {
  let responseBody = {peers:[], totalPeers:0};
  const peers = await ipfs.swarm.peers(); //TODO: surround with try
  const uniquePeers = _.uniqBy(peers, 'peer');
  responseBody.peers = uniquePeers;
  responseBody.totalPeers = uniquePeers.length;
  res.send(responseBody);
});

app.listen(API_PORT, () => {
  console.log(`Pinner API at http://localhost:${API_PORT}!`);
});
