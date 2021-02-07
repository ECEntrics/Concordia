import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import IPFS from 'ipfs';
import { contracts } from 'concordia-contracts';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import getWeb3ProviderUrl from 'concordia-shared/src/utils/web3';
import { createOrbitInstance, getPeerDatabases, openKVDBs } from './utils/orbitUtils';
import startAPI from './app';
import downloadContractArtifacts from './utils/drizzleUtils';
import getIpfsOptions from './options/ipfsOptions';

process.on('unhandledRejection', (error) => {
  // This happens when attempting to initialize without any available Swarm addresses (e.g. Rendezvous)
  if (error.code === 'ERR_NO_VALID_ADDRESSES') {
    console.error('unhandledRejection', error.message);
    process.exit(1);
  }

  // Don't swallow other errors
  console.error(error);
  throw error;
});

const getDeployedContract = async (web3) => {
  let forumContractPromise;

  if (process.env.USE_EXTERNAL_CONTRACTS_PROVIDER) {
    console.log('Downloading contracts.');
    forumContractPromise = downloadContractArtifacts()
      .then((remoteContracts) => remoteContracts
        .find((remoteContract) => remoteContract.contractName === FORUM_CONTRACT));
  } else {
    forumContractPromise = Promise.resolve(contracts.find((contract) => contract.contractName === FORUM_CONTRACT));
  }

  return forumContractPromise
    .then((forumContract) => web3.eth.net.getId()
      .then((networkId) => forumContract.networks[networkId].address)
      .then((contractAddress) => {
        Contract.setProvider(getWeb3ProviderUrl());
        const contract = new Contract(forumContract.abi, contractAddress);

        return { contract, contractAddress };
      }));
};

// Open & replicate databases of existing users
const openExistingUsersDatabases = async (contract, orbit) => contract.methods.getUserAddresses().call()
  .then((userAddresses) => getPeerDatabases(orbit, userAddresses))
  .then((peerDBs) => openKVDBs(orbit, peerDBs));

const handleWeb3LogEvent = (web3, eventJsonInterface, orbit) => (error, result) => {
  if (!error) {
    const eventObj = web3.eth.abi.decodeLog(
      eventJsonInterface.inputs,
      result.data,
      result.topics.slice(1),
    );
    const userAddress = eventObj[1];
    console.log('User signed up:', userAddress);
    getPeerDatabases(orbit, [userAddress])
      .then((peerDBs) => openKVDBs(orbit, peerDBs));
  }
};

const main = async () => {
  console.log('Initializing...');
  const web3 = new Web3(new Web3.providers.WebsocketProvider(getWeb3ProviderUrl()));

  getDeployedContract(web3)
    .then(({ contract, contractAddress }) => getIpfsOptions()
      .then((ipfsOptions) => IPFS.create(ipfsOptions))
      .then((ipfs) => createOrbitInstance(ipfs, contractAddress))
      .then((orbit) => openExistingUsersDatabases(contract, orbit)
        .then(() => {
          // Listen for new users and subscribe to their databases
          const eventJsonInterface = web3.utils._.find(
            // eslint-disable-next-line no-underscore-dangle
            contract._jsonInterface,
            (obj) => obj.name === 'UserSignedUp' && obj.type === 'event',
          );

          web3.eth.subscribe('logs', {
            address: contractAddress,
            topics: [eventJsonInterface.signature],
          }, handleWeb3LogEvent(web3, eventJsonInterface, orbit));

          startAPI(orbit);
        })));
};

main();
