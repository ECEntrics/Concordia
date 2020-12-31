import breezeOptions from 'concordia-app/src/options/breezeOptions';
import { WEB3_HOST_DEFAULT, WEB3_PORT_DEFAULT } from 'concordia-app/src/constants/configuration/defaults';
const { WEB3_HOST, WEB3_PORT } = process.env;

export const web3ProviderUrl = (WEB3_HOST !== undefined && WEB3_PORT !== undefined)
    ? `ws://${WEB3_HOST}:${WEB3_PORT}`
    : `ws://${WEB3_HOST_DEFAULT}:${WEB3_PORT_DEFAULT}`;

export const swarmAddresses = breezeOptions.ipfs.config.Addresses.Swarm;
