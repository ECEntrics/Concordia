import path from 'path';
import getBreezeConfiguration from 'concordia-shared/src/configuration/breezeConfiguration';

export const swarmAddresses = getBreezeConfiguration().ipfs.config.Addresses.Swarm;

export const ORBIT_DIRECTORY_DEFAULT = path.join(__dirname, '..', 'orbitdb');
