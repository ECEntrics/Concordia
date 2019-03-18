import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserAvatar from 'react-user-avatar';
import { drizzle } from '../index';

import epochTimeConverter from '../helpers/EpochTimeConverter';

import UsernameFormContainer from '../containers/UsernameFormContainer';

const callsInfo = [
  {
    contract: 'Forum',
    method: 'getUserDateOfRegister'
  }, {
    contract: 'Forum',
    method: 'getOrbitDBId'
  }];

class ProfileInformation extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);
    this.dataKey = [];

    this.state = {
      pageStatus: 'initialized',
      dateOfRegister: '',
      orbitDBId: ''
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    const { pageStatus, dateOfRegister, orbitDBId } = this.state;
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
    }
  }

  render() {
    const { orbitDBId, dateOfRegister } = this.state;
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
        <table className="highlight centered responsive-table">
          <tbody>
            <tr>
              <td><strong>Username:</strong></td>
              <td>{username}</td>
            </tr>
            <tr>
              <td><strong>Account address:</strong></td>
              <td>{address}</td>
            </tr>
            <tr>
              <td><strong>OrbitDB:</strong></td>
              <td>{orbitDBId}</td>
            </tr>
            <tr>
              <td><strong>Number of topics created:</strong></td>
              <td>{numberOfTopics}</td>
            </tr>
            <tr>
              <td><strong>Number of posts:</strong></td>
              <td>{numberOfPosts}</td>
            </tr>
            {dateOfRegister
            && (
            <tr>
              <td><strong>Member since:</strong></td>
              <td>{epochTimeConverter(dateOfRegister)}</td>
            </tr>
            )
            }
          </tbody>
        </table>
        {self && <UsernameFormContainer />}
      </div>
    );
  }
}

ProfileInformation.propTypes = {
  drizzleStatus: PropTypes.object.isRequired,
  contracts: PropTypes.array.isRequired,
  avatarUrl: PropTypes.string,
  username: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  numberOfTopics: PropTypes.number.isRequired,
  numberOfPosts: PropTypes.number.isRequired,
  self: PropTypes.bool
};

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  contracts: state.contracts,
  user: state.user
});

export default connect(mapStateToProps)(ProfileInformation);
