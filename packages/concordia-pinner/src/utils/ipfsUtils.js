import dns from 'dns';
import util from 'util';
import { rendezvousHost, rendezvousPort } from 'concordia-shared/src/environment/interpolated/rendezvous';
import { logger } from './logger';

const dnsLookup = util.promisify(dns.lookup);

export const getResolvedRendezvousUrl = async () => {
  if (rendezvousHost.startsWith('/docker/')) {
    return dnsLookup(rendezvousHost.substring('/docker/'.length), { family: 4 })
      .then((resolvedDomain) => `/ip4/${resolvedDomain.address}`)
      .catch((error) => logger.error(new Error(`DNS lookup of ${rendezvousHost} failed.\n${error}`)));
  }

  return Promise.resolve(rendezvousHost);
};

export const getSwarmAddresses = async () => getResolvedRendezvousUrl()
  .then((resolvedRendezvousHost) => [
    `${resolvedRendezvousHost}/tcp/${rendezvousPort}/wss/p2p-webrtc-star`,
  ]);
