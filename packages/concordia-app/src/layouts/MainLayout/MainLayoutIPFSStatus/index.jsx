import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import StatusSegment from '../../../components/Status/StatusSegment';
import StatusKeyRow from '../../../components/Status/StatusKeyRow';
import StatusValueRow from '../../../components/Status/StatusValueRow';
import ipfsLogo from '../../../assets/images/ipfs_logo.svg';

const MainLayoutIPFSStatus = () => {
  const ipfsId = useSelector((state) => state.ipfs.id);
  const peerIds = useSelector((state) => state.ipfs.peers);
  const bootstrapPeerIds = useSelector((state) => state.ipfs.bootstrapPeers);
  const peers = useMemo(() => peerIds
    .map((peerId) => (
        <StatusValueRow value={peerId} key={peerId} />
    )), [peerIds]);

  const bootstrapPeers = useMemo(() => bootstrapPeerIds
    .map((bootstrapPeerId) => (
        <StatusValueRow value={bootstrapPeerId} key={bootstrapPeerId} />
    )), [bootstrapPeerIds]);

  return (
      <StatusSegment
        headerTitle="IPFS Status"
        headerImage={ipfsLogo}
      >
          <StatusKeyRow value="Peer ID" />
          <StatusValueRow value={ipfsId} />
          <StatusKeyRow value="Peers" />
          {peers.length === 0 ? (<StatusValueRow />) : null}
          {peers}
          <StatusKeyRow value="Bootstrap Peers" />
          {bootstrapPeers.length === 0 ? (<StatusValueRow />) : null}
          {bootstrapPeers}
      </StatusSegment>
  );
};

export default MainLayoutIPFSStatus;
