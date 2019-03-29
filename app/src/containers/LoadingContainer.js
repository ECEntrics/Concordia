import React, { Children, Component } from 'react';
import { connect } from 'react-redux';
import ethereum_logo from '../assets/images/ethereum_logo.svg';
import ipfs_logo from '../assets/images/ipfs_logo.svg';
import orbitdb_logo from '../assets/images/orbitdb_logo.png';

class LoadingContainer extends Component {
  render() {
    if (this.props.web3.status === 'failed' || !this.props.web3.networkId) {

      //TODO: wtf is this
      if (this.props.errorComp)
        return this.props.errorComp;

      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <img src={ethereum_logo} alt="ethereum_logo" height="50"/>
              <p><strong>This browser has no connection to the Ethereum network.</strong></p>
              Please make sure that:
              <ul>
                <li>You use MetaMask or a dedicated Ethereum browser (e.g. Mist or Parity)</li>
                <li>They are pointed to the correct network</li>
                <li>Your account is unlocked and the app has the rights to access it</li>
              </ul>
            </div>
          </div>
        </main>
      );
    }

    if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
      return(
        <main className="loading-screen">
          <div>
            <div>
              <img src={ethereum_logo} alt="ethereum_logo" height="50"/>
              <p><strong>We can't find any Ethereum accounts!</strong>.</p>
            </div>
          </div>
        </main>
      )
    }

    if (!this.props.contractInitialized) {
      return(
        <main className="loading-screen">
          <div>
            <div>
              <img src={ethereum_logo} alt="ethereum_logo" height="50"/>
              <p><strong>Initializing contracts...</strong></p>
              <p>If this takes too long please make sure they are deployed to the network
                and you are connected to the correct one.
              </p>
            </div>
          </div>
        </main>
      )
    }

    if (!this.props.ipfsInitialized) {
      return(
        <main className="loading-screen">
          <div>
            <div>
              <img src={ipfs_logo} alt="ipfs_logo" height="50"/>
              <p><strong>Initializing IPFS...</strong></p>
            </div>
          </div>
        </main>
      )
    }

    if (!this.props.orbitReady) {
      return(
        <main className="loading-screen">
          <div>
            <div>
              <img src={orbitdb_logo} alt="orbitdb_logo" height="50"/>
              <p><strong>Preparing OrbitDB...</strong></p>
            </div>
          </div>
        </main>
      )
    }

    //TODO: wtf is this
    if (this.props.drizzleStatus.initialized)
      return Children.only(this.props.children);

    //TODO: wtf is this
    if (this.props.loadingComp)
      return this.props.loadingComp;

    return(
      <main className="container loading-screen">
        <div>
          <div>
            <h1><span role="img" aria-label="Gear">⚙</span></h1>
            <p>Loading dapp...</p>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    ipfsInitialized: state.orbit.ipfsInitialized,
    orbitReady: state.orbit.ready,
    contractInitialized: state.contracts.Forum.initialized
  }
};

export default connect(mapStateToProps)(LoadingContainer);

