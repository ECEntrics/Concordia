import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import IPFS from 'ipfs';
import { forumContract } from 'concordia-contracts';
import { createOrbitInstance, getPeerDatabases, openKVDBs } from './utils/orbitUtils';
import ipfsOptions from './options/ipfsOptions';
import { WEB3_PROVIDER_URL } from './constants';
import { startAPI } from './app';

process.on('unhandledRejection', error => {
  // This happens when attempting to initialize without any available Swarm addresses (e.g. Rendezvous)
  if(error.code === 'ERR_NO_VALID_ADDRESSES'){
    console.error('unhandledRejection', error.message);
    process.exit(1);
  }
});

async function main () {
  console.log('Initializing...');
  const web3 = new Web3(new Web3.providers.WebsocketProvider(WEB3_PROVIDER_URL));
  const networkId = await web3.eth.net.getId();

  const contractAddress = forumContract.networks[networkId].address;

  Contract.setProvider(WEB3_PROVIDER_URL);
  const contract = new Contract(forumContract.abi, contractAddress);

  const ipfs = await IPFS.create(ipfsOptions);
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

  startAPI(orbit);
}

main();
