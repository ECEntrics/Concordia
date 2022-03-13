import dns from 'dns';
import util from 'util';
import { Multiaddr } from 'multiaddr';
import { rendezvousHost, rendezvousPort } from 'concordia-shared/src/environment/interpolated/rendezvous';
import { logger } from './logger';

const dnsLookup = util.promisify(dns.lookup);

const isMultiaddr = (input) => {
  try {
    // eslint-disable-next-line no-new
    new Multiaddr(input);
    return true;
  } catch (e) {
    logger.error(new Error(`Invalid rendezvous multiaddress ${input}!`));
    return false;
  }
};

// eslint-disable-next-line consistent-return
const getRendezvousMultiaddress = () => {
  const host = rendezvousHost.startsWith('/docker/') ? rendezvousHost.substring('/docker/'.length) : rendezvousHost;

  const multiaddress = `${host}/tcp/${rendezvousPort}/wss/p2p-webrtc-star`;
  if (isMultiaddr(multiaddress)) return new Multiaddr(multiaddress);
  throw Error('Invalid multiaddress');
};

export const getResolvedRendezvousMultiaddress = async () => {
  const rendezvousMultiaddress = getRendezvousMultiaddress();
  const { address } = rendezvousMultiaddress.nodeAddress();

  // Address is a domain to be resolved to IP
  if (rendezvousMultiaddress.toString().includes('/dns4/')) {
    try {
      const resolvedDomain = await dnsLookup(address);
      return Promise.resolve(new Multiaddr(`/ip4/${resolvedDomain.address}/tcp/${rendezvousPort}/wss/p2p-webrtc-star`));
    } catch (error) {
      throw new Error(`DNS lookup of ${address} failed.\n${error}`);
    }
  }
  return Promise.resolve(rendezvousMultiaddress);
};

// TODO: currently this only works for a single rendezvous
export const getSwarmAddresses = async () => getResolvedRendezvousMultiaddress()
  .then((resolvedRendezvousMultiaddress) => [
    resolvedRendezvousMultiaddress.toString(),
  ]).catch((error) => logger.error(new Error(`getSwarmAddresses failed.\n${error}`)));
