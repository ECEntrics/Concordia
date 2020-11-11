// https://github.com/orbitdb/orbit-db/blob/master/GUIDE.md#address
import EthereumIdentityProvider from './ΕthereumIdentityProvider';

async function determineDBAddress({
  orbit, dbName, type, identityId,
}) {
  const ipfsMultihash = (await orbit.determineAddress(dbName, type, {
    accessController: { write: [identityId] },
  })).root;
  return `/orbitdb/${ipfsMultihash}/${dbName}`;
}

async function determineKVAddress({ orbit, dbName, userAddress }) {
  return determineDBAddress({
    orbit, dbName, type: 'keyvalue', identityId: userAddress + EthereumIdentityProvider.contractAddress,
  });
}

export default determineKVAddress;
