import dns from 'dns';
import util from 'util';
import { rendezvousHost, rendezvousPort } from 'concordia-shared/src/environment/interpolated/rendezvous';

const dnsLookup = util.promisify(dns.lookup);

export const getResolvedRendezvousUrl = async () => dnsLookup(rendezvousHost, { family: 4 })
  .catch((error) => console.error(new Error(`DNS lookup of ${rendezvousHost} failed.\n${error}`)));

export const getSwarmAddresses = async () => getResolvedRendezvousUrl()
  .then((resolvedRendezvousUrl) => [`/ip4/${resolvedRendezvousUrl.address}/tcp/${rendezvousPort}/wss/p2p-webrtc-star`]);
