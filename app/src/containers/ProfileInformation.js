import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserAvatar from 'react-user-avatar';
import { drizzle } from '../index';

import epochTimeConverter from '../helpers/EpochTimeConverter';

import ContentLoader from 'react-content-loader';
import UsernameFormContainer from './UsernameFormContainer';
import { Table } from 'semantic-ui-react'

const callsInfo = [
  {
    contract: 'Forum',
    method: 'getUserDateOfRegister'
  }, {
    contract: 'Forum',
    method: 'getOrbitDBId'
  }, {
    contract: 'Forum',
    method: 'getOrbitTopicsDB'
  }, {
    contract: 'Forum',
    method: 'getOrbitPostsDB'
  }];

class ProfileInformation extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);
    this.dataKey = [];

    this.state = {
      pageStatus: 'initialized',
      dateOfRegister: '',
      orbitDBId: '',
      topicsDBId: '',
      postsDBId: ''
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    const { pageStatus, dateOfRegister, orbitDBId, topicsDBId, postsDBId } = this.state;
    const { drizzleStatus, address, contracts } = this.props;

    if (pageStatus === 'initialized'
        && drizzleStatus.initialized) {
      callsInfo.forEach((call, index) => {
        this.dataKey[index] = drizzle.contracts[call.contract].methods[call.method].cacheCall(
          address,
        );
      });
      this.setState({
        pageStatus: 'loading'
      });
    }

    if (pageStatus === 'loading') {
      let pageStatusUpdate = 'loaded';
      callsInfo.forEach((call, index) => {
        if (!contracts[call.contract][call.method][this.dataKey[index]]) {
          pageStatusUpdate = 'loading';
        }
      });

      if (pageStatusUpdate === 'loaded') {
        this.setState({
          pageStatus: pageStatusUpdate
        });
      }
    }

    if (pageStatus === 'loaded') {
      if (dateOfRegister === '') {
        const transaction = contracts[callsInfo[0].contract][callsInfo[0].method][this.dataKey[0]];
        if (transaction) {
          this.setState({
            dateOfRegister: transaction.value
          });
        }
      }
      if (orbitDBId === '') {
        const transaction = contracts[callsInfo[1].contract][callsInfo[1].method][this.dataKey[1]];
        if (transaction) {
          this.setState({
            orbitDBId: transaction.value
          });
        }
      }

      if (topicsDBId === '') {
        const transaction = contracts[callsInfo[2].contract][callsInfo[2].method][this.dataKey[2]];
        if (transaction) {
          this.setState({
            topicsDBId: transaction.value
          });
        }
      }

      if (postsDBId === '') {
        const transaction = contracts[callsInfo[3].contract][callsInfo[3].method][this.dataKey[3]];
        if (transaction) {
          this.setState({
            postsDBId: transaction.value
          });
        }
      }
    }
  }

  render() {
    const { orbitDBId, topicsDBId, postsDBId, dateOfRegister } = this.state;
    const { avatarUrl, username, address, numberOfTopics, numberOfPosts, self } = this.props;

    return (
      <div className="user-info">
        {avatarUrl && (
          <UserAvatar
            size="40"
            className="inline user-avatar"
            src={avatarUrl}
            name={username}
          />
        )}
        <Table basic='very' singleLine>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Username:</strong></Table.Cell>
              <Table.Cell>{username}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Account address:</strong></Table.Cell>
              <Table.Cell>{address}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>OrbitDB:</strong></Table.Cell>
              <Table.Cell>{orbitDBId ? orbitDBId
                : <ContentLoader height={5.8} width={300} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="80" height="5.5" />
                  </ContentLoader>
              }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>TopicsDB:</strong></Table.Cell>
              <Table.Cell>{topicsDBId ? topicsDBId
                : <ContentLoader height={5.8} width={300} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="80" height="5.5" />
                  </ContentLoader>
              }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>PostsDB:</strong></Table.Cell>
              <Table.Cell>{postsDBId ? postsDBId
                : <ContentLoader height={5.8} width={300} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="80" height="5.5" />
                  </ContentLoader>
              }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Number of topics created:</strong></Table.Cell>
              <Table.Cell>{numberOfTopics !== -1 ? numberOfTopics
                : <ContentLoader height={5.8} width={300} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="15" height="5.5" />
                  </ContentLoader>
              }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Number of posts:</strong></Table.Cell>
              <Table.Cell>{numberOfPosts !== -1 ? numberOfPosts
                : <ContentLoader height={5.8} width={300} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="15" height="5.5" />
                  </ContentLoader>
              }</Table.Cell>
            </Table.Row>
            {dateOfRegister
            && (
            <Table.Row>
              <Table.Cell><strong>Member since:</strong></Table.Cell>
              <Table.Cell>{epochTimeConverter(dateOfRegister)}</Table.Cell>
            </Table.Row>
            )
            }
          </Table.Body>
        </Table>
        {self && <UsernameFormContainer />}
      </div>
    );
  }
}

ProfileInformation.propTypes = {
  drizzleStatus: PropTypes.object.isRequired,
  contracts: PropTypes.PropTypes.objectOf(PropTypes.object).isRequired,
  avatarUrl: PropTypes.string,
  username: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  numberOfTopics: PropTypes.number.isRequired,
  numberOfPosts: PropTypes.number.isRequired,
  self: PropTypes.bool
};

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  contracts: state.contracts
});

export default connect(mapStateToProps)(ProfileInformation);
