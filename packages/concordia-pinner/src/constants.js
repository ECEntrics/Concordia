import breezeOptions, { RENDEZVOUS_URL } from 'concordia-app/src/options/breezeOptions';
import { WEB3_HOST_DEFAULT, WEB3_PORT_DEFAULT } from 'concordia-app/src/constants/configuration/defaults';
import path from 'path';

const { WEB3_HOST, WEB3_PORT } = process.env;

const API_PORT = process.env.PINNER_API_PORT || 4444;

const WEB3_PROVIDER_URL = (WEB3_HOST !== undefined && WEB3_PORT !== undefined)
  ? `ws://${WEB3_HOST}:${WEB3_PORT}`
  : `ws://${WEB3_HOST_DEFAULT}:${WEB3_PORT_DEFAULT}`;

export const swarmAddresses = breezeOptions.ipfs.config.Addresses.Swarm;

export const ORBIT_DIRECTORY_DEFAULT = path.join(__dirname, '..', 'orbitdb');

export { API_PORT, WEB3_PROVIDER_URL, RENDEZVOUS_URL };
