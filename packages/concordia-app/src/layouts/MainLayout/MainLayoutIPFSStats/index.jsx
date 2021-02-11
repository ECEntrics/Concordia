import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Header, Image, List, Segment, Table, Transition,
} from 'semantic-ui-react';

import ipfsLogo from '../../../assets/images/ipfs_logo.svg';
import './styles.css';

const MainLayoutIPFSStats = () => {
  const ipfsId = useSelector((state) => state.ipfs.id);
  const peerIds = useSelector((state) => state.ipfs.peers);
  const peers = useMemo(() => peerIds
    .map((peerId) => (
        <List.Item
          key={peerId}
          className="stat-value"
        >
            <CopyToClipboard text={peerId}>
                <span>{peerId}</span>
            </CopyToClipboard>
        </List.Item>

    )), [peerIds]);

  return (
      <Segment>
          <Header textAlign="center">
              <Image src={ipfsLogo} size="tiny" />
              IPFS Stats
          </Header>
          <Table definition>
              <Table.Body>
                  <Table.Row>
                      <Table.Cell className="stat-key" textAlign="center">ID</Table.Cell>
                      <Table.Cell
                        className="stat-value"
                      >
                          <CopyToClipboard text={ipfsId}>
                              <span>{ipfsId}</span>
                          </CopyToClipboard>
                      </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell className="stat-key" textAlign="center">Peers</Table.Cell>
                      <Table.Cell>
                          <Transition.Group
                            as={List}
                            duration={1000}
                          >
                              {peers}
                          </Transition.Group>
                      </Table.Cell>
                  </Table.Row>
              </Table.Body>
          </Table>
      </Segment>
  );
};

export default MainLayoutIPFSStats;
