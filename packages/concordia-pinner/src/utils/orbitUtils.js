import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import { EthereumContractIdentityProvider } from '@ezerous/eth-identity-provider';
import Web3 from 'web3';
import ipfsOptions from '../options/ipfsOptions';
import { displayIPFSStats } from './ipfsUtils';

export async function createOrbitInstance(contractAddress){
    Identities.addIdentityProvider(EthereumContractIdentityProvider);

    EthereumContractIdentityProvider.setWeb3(new Web3()); // We need a fully-featured new Web3 for signature verification
    EthereumContractIdentityProvider.setContractAddress(contractAddress);

    const ipfs = await IPFS.create(ipfsOptions);

    displayIPFSStats(ipfs);

    return await OrbitDB.createInstance(ipfs);
}

export async function getPeerDatabases(orbit, userAddresses) {
    const peerDBs = [];
    for (const userAddress of userAddresses) {
        peerDBs.push(await determineKVAddress({ orbit, dbName:'user', userAddress }));
        peerDBs.push(await determineKVAddress({ orbit, dbName:'posts', userAddress }));
        peerDBs.push(await determineKVAddress({ orbit, dbName:'topics', userAddress }));
    }
    return peerDBs;
}

export async function openKVDBs(orbit, databases) {
    for (const db of databases){
        const store = await orbit.keyvalue(db);
        store.events.on('replicated', (address) => console.log(`Replicated ${address}`));
        console.log(`Opened ${db}`);
    }
}

// TODO: share code below with frontend (?)
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
        orbit, dbName, type: 'keyvalue', identityId: userAddress + EthereumContractIdentityProvider.contractAddress,
    });
}


