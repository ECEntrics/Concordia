import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import { EthereumContractIdentityProvider } from '@ezerous/eth-identity-provider';
import Web3 from 'web3';
import ORBIT_DIRECTORY_DEFAULT from '../constants';

// TODO: share code below with frontend (?)
const determineDBAddress = async ({
  orbit, dbName, type, identityId,
}) => orbit.determineAddress(dbName, type, { accessController: { write: [identityId] } })
  .then((orbitAddress) => {
    const ipfsMultihash = orbitAddress.root;
    return `/orbitdb/${ipfsMultihash}/${dbName}`;
  });

const determineKVAddress = async ({ orbit, dbName, userAddress }) => determineDBAddress({
  orbit, dbName, type: 'keyvalue', identityId: userAddress + EthereumContractIdentityProvider.contractAddress,
});

export const createOrbitInstance = async (ipfs, contractAddress) => {
  Identities.addIdentityProvider(EthereumContractIdentityProvider);

  EthereumContractIdentityProvider.setWeb3(new Web3()); // We need a fully-featured new Web3 for signature verification
  EthereumContractIdentityProvider.setContractAddress(contractAddress);

  const ORBIT_DIRECTORY = process.env.ORBIT_DIRECTORY || ORBIT_DIRECTORY_DEFAULT;

  return OrbitDB.createInstance(ipfs, { directory: ORBIT_DIRECTORY });
};

export const getPeerDatabases = async (orbit, userAddresses) => Promise.all(userAddresses
  .flatMap((userAddress) => [
    determineKVAddress({ orbit, dbName: 'user', userAddress }),
    determineKVAddress({ orbit, dbName: 'posts', userAddress }),
    determineKVAddress({ orbit, dbName: 'topics', userAddress }),
  ]));

export const openKVDBs = async (orbit, databases) => {
  databases
    .forEach((database) => {
      orbit
        .keyvalue(database)
        .then((store) => store.events.on('replicated', (address) => console.log(`Replicated ${address}`)));
      console.log(`Opened ${database}`);
    });
};
