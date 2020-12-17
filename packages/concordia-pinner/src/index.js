import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import { forumContract } from 'concordia-contracts';
import { createOrbitInstance, getPeerDatabases, openKVDBs } from './utils/orbitUtils';

async function main () {
  const web3ProviderUrl = 'ws://127.0.0.1:8545';
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3ProviderUrl));
  const networkId = await web3.eth.net.getId();

  const contractAddress = forumContract.networks[networkId].address;

  Contract.setProvider(web3ProviderUrl);
  const contract = new Contract(forumContract.abi, contractAddress);

  const orbit = await createOrbitInstance(contractAddress);

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
      console.log(`UserSignedUp!`, eventObj[1])
      getPeerDatabases(orbit, userAddresses).then(peerDBs => openKVDBs(orbit, peerDBs));
    }
  });
}

main();
