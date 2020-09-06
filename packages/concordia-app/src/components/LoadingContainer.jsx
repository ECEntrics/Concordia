import React, { Children, Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/loading-container.css';
import ethereum_logo from '../assets/images/ethereum_logo.svg';
import ipfs_logo from '../assets/images/ipfs_logo.svg';
import orbitdb_logo from '../assets/images/orbitdb_logo.png';
import logo from '../assets/images/logo.png';

class LoadingContainer extends Component {
    render() {
        if (this.props.web3.status === 'failed' || !this.props.web3.networkId) {
            return (
                <main className="loading-screen">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                            <p><strong>This browser has no connection to the Ethereum network</strong></p>
                            Please make sure that:
                            <ul>
                                <li>MetaMask is unlocked and pointed to the correct network</li>
                                <li>The app has been granted the right to connect to your account</li>
                            </ul>
                        </div>
                    </div>
                </main>
            );
        }

        if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
            return (
                <main className="loading-screen">
                    <div>
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>We can't find any Ethereum accounts!</strong></p>
                        <p>Please make sure that MetaMask is unlocked.</p>
                    </div>
                </main>
            );
        }

        if (!this.props.contractDeployed) {
            return (
                <main className="loading-screen">
                    <div>
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>No contracts found on the current network!</strong></p>
                        <p>Please make sure that you are connected to the correct network
                            and the contracts are deployed.</p>
                    </div>
                </main>
            );
        }

        if (!this.props.contractInitialized) {
            return (
                <main className="loading-screen">
                    <div>
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>Initializing contracts...</strong></p>
                    </div>
                </main>
            );
        }

        if (!this.props.ipfsInitialized) {
            return (
                <main className="loading-screen">
                    <div>
                        <img src={ipfs_logo} alt="ipfs_logo" className="loading-img" />
                        <p><strong>Initializing IPFS...</strong></p>
                    </div>
                </main>
            );
        }

        if (!this.props.orbitInitialized) {
            const message = process.env.NODE_ENV === 'development'
                ? 'If needed, please sign the transaction in MetaMask to create the databases.'
                : 'Please sign the transaction in MetaMask to create the databases.';
            return (
                <main className="loading-screen">
                    <div>
                        <img src={orbitdb_logo} alt="orbitdb_logo" className="loading-img" />
                        <p><strong>Preparing OrbitDB...</strong></p>
                        <p>{message}</p>
                    </div>
                </main>
            );
        }

        if (this.props.drizzleStatus.initialized) return Children.only(this.props.children);

        return (
            <main className="loading-screen">
                <div>
                    <img src={logo} alt="app_logo" className="loading-img" />
                    <p><strong>Loading dapp...</strong></p>
                </div>
            </main>
        );
    }
}

const mapStateToProps = (state) => ({
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    breezeStatus: state.breezeStatus,
    web3: state.web3,
    contractInitialized: state.contracts.Forum.initialized,
    contractDeployed: state.contracts.Forum.deployed,
    ipfsInitialized: state.ipfs.initialized,
    orbitInitialized: state.orbit.initialized,
});

export default connect(mapStateToProps)(LoadingContainer);
