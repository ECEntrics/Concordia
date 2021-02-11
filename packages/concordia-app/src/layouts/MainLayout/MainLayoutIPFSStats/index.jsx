import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Header, Image, Segment, Table,
} from 'semantic-ui-react';

import ipfsLogo from '../../../assets/images/ipfs_logo.svg';
import './styles.css';

const MainLayoutIPFSStats = () => {
  const ipfsId = useSelector((state) => state.ipfs.id);
  const peerIds = useSelector((state) => state.ipfs.peers);
  const bootstrapPeerIds = useSelector((state) => state.ipfs.bootstrapPeers);
  const peers = useMemo(() => peerIds
    .map((peerId) => (
        <Table.Row className="stat-value">
            <Table.Cell>
                <CopyToClipboard text={peerId}>
                    <span>{peerId}</span>
                </CopyToClipboard>
            </Table.Cell>
        </Table.Row>

    )), [peerIds]);

  const bootstrapPeers = useMemo(() => bootstrapPeerIds
    .map((bootstrapPeerId) => (
        <Table.Row className="stat-value">
            <Table.Cell>
                <CopyToClipboard text={bootstrapPeerId}>
                    <span>{bootstrapPeerId}</span>
                </CopyToClipboard>
            </Table.Cell>
        </Table.Row>

    )), [bootstrapPeerIds]);

  return (
      <Segment padded>
          <Header textAlign="center">
              <Image src={ipfsLogo} size="tiny" />
              IPFS Stats
          </Header>
          <Table compact textAlign="center" columns={1}>
              <Table.Body>
                  <Table.Row>
                      <Table.Cell className="stat-key">Peer ID</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell
                        className="stat-value"
                      >
                          <CopyToClipboard text={ipfsId}>
                              <span>{ipfsId}</span>
                          </CopyToClipboard>
                      </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell className="stat-key">Peers</Table.Cell>
                  </Table.Row>
                  {peers.length === 0
                    ? (
                        <Table.Row>
                            <Table.Cell>-</Table.Cell>
                        </Table.Row>
                    ) : null}
                  {peers}
                  <Table.Row>
                      <Table.Cell className="stat-key">Bootstrap Peers</Table.Cell>
                  </Table.Row>
                  {bootstrapPeers.length === 0
                    ? (
                        <Table.Row>
                            <Table.Cell>-</Table.Cell>
                        </Table.Row>
                    ) : null}
                  {bootstrapPeers}
              </Table.Body>
          </Table>
      </Segment>
  );
};

export default MainLayoutIPFSStats;
