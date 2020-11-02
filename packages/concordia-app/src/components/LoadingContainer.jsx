import React, { Children, Component } from 'react';
import { connect } from 'react-redux';

import { breezeConstants } from '@ezerous/breeze';

import LoadingComponent from './LoadingComponent';

// CSS
import '../assets/css/loading-component.css';

class LoadingContainer extends Component {
  render() {
    const {
      web3: {
        status, networkId, networkFailed, accountsFailed,
      },
      drizzleStatus: {
        initializing,
        failed,
      },
      contractInitialized, contractDeployed, ipfsStatus, orbitStatus, userFetched, children,
    } = this.props;

    if ((status === 'initializing' || !networkId)
            && !networkFailed) {
      return (
          <LoadingComponent
            title="Connecting to the Ethereum network..."
            message="Please make sure to unlock MetaMask and grant the app the right to connect to your account."
            imageType="ethereum"
            progress={20}
            progressType="indicating"
          />
      );
    }

    if (status === 'failed' || networkFailed) {
      return (
          <LoadingComponent
            title="No connection to the Ethereum network!"
            message="Please make sure that:"
            message_list={['MetaMask is unlocked and pointed to the correct, available network',
              'The app has been granted the right to connect to your account']}
            imageType="ethereum"
            progress={20}
            progressType="error"
          />
      );
    }

    if (status === 'initialized' && accountsFailed) {
      return (
          <LoadingComponent
            title="We can't find any Ethereum accounts!"
            message="Please make sure that MetaMask is unlocked."
            imageType="ethereum"
            progress={20}
            progressType="error"
          />
      );
    }

    if (initializing
            || (!failed && !contractInitialized && contractDeployed)) {
      return (
          <LoadingComponent
            title="Initializing contracts..."
            message=""
            imageType="ethereum"
            progress={40}
            progressType="indicating"
          />
      );
    }

    if (!contractDeployed) {
      return (
          <LoadingComponent
            title="No contracts found on the current network!"
            message="Please make sure that you are connected to the correct network and the contracts are deployed."
            imageType="ethereum"
            progress={40}
            progressType="error"
          />
      );
    }

    if (ipfsStatus === breezeConstants.STATUS_INITIALIZING) {
      return (
          <LoadingComponent
            title="Initializing IPFS..."
            message=""
            imageType="ipfs"
            progress={60}
            progressType="indicating"
          />
      );
    }

    if (ipfsStatus === breezeConstants.STATUS_FAILED) {
      return (
          <LoadingComponent
            title="IPFS initialization failed!"
            message=""
            imageType="ipfs"
            progress={60}
            progressType="error"
          />
      );
    }

    if (orbitStatus === breezeConstants.STATUS_INITIALIZING) {
      const message = process.env.NODE_ENV === 'development'
        ? 'If needed, please sign the transaction in MetaMask to create the databases.'
        : 'Please sign the transaction in MetaMask to create the databases.';
      return (
          <LoadingComponent
            title="Preparing OrbitDB..."
            message={message}
            imageType="orbit"
            progress={80}
            progressType="indicating"
          />
      );
    }

    if (orbitStatus === breezeConstants.STATUS_FAILED) {
      return (
          <LoadingComponent
            title="OrbitDB initialization failed!"
            message=""
            imageType="orbit"
            progress={80}
            progressType="error"
          />
      );
    }

    if (!userFetched) {
      return (
          <LoadingComponent
            title="Loading dapp..."
            message=""
            imageType="app"
            progress={90}
            progressType="indicating"
          />
      );
    }

    return Children.only(children);
  }
}

const mapStateToProps = (state) => ({
  drizzleStatus: state.drizzleStatus,
  breezeStatus: state.breezeStatus,
  ipfsStatus: state.ipfs.status,
  orbitStatus: state.orbit.status,
  web3: state.web3,
  accounts: state.accounts,
  contractInitialized: state.contracts.Forum.initialized,
  contractDeployed: state.contracts.Forum.deployed,
  userFetched: state.user.address,
});

export default connect(mapStateToProps)(LoadingContainer);
