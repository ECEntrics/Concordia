import React, { Children, Component } from 'react';
import { connect } from 'react-redux';
import { Progress } from 'semantic-ui-react'

// CSS
import '../assets/css/loading-container.css';

// Images
import ethereum_logo from '../assets/images/ethereum_logo.svg';
import ipfs_logo from '../assets/images/ipfs_logo.svg';
import orbitdb_logo from '../assets/images/orbitdb_logo.png';
import logo from '../assets/images/logo.png';

class LoadingContainer extends Component {
    render() {
        if (this.props.web3.status === 'initializing') {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>Connecting to the Ethereum network...</strong></p>
                        <p>Please make sure to unlock MetaMask.</p>
                        <Progress percent="20" size='tiny' active />
                    </div>
                </main>
            );
        }

        if (this.props.web3.status === 'failed' || this.props.web3.networkFailed) {
            return (
                <main className="loading-screen">
                        <div className="ui container">
                            <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                            <p><strong>No connection to the Ethereum network!</strong></p>
                            Please make sure that:
                            <ul>
                                <li>MetaMask is unlocked and pointed to the correct network</li>
                                <li>The app has been granted the right to connect to your account</li>
                            </ul>
                            <Progress percent="20" size='tiny' error />
                        </div>
                </main>
            );
        }

        if (this.props.web3.status === 'initialized' && this.props.web3.accountsFailed) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>We can't find any Ethereum accounts!</strong></p>
                        <p>Please make sure that MetaMask is unlocked.</p>
                        <Progress percent="20" size='tiny' error />
                    </div>
                </main>
            );
        }

        if (!this.props.contractInitialized) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>Initializing contracts...</strong></p><p/>
                        <Progress percent="40" size='tiny' active />
                    </div>
                </main>
            );
        }

        if (!this.props.contractDeployed) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ethereum_logo} alt="ethereum_logo" className="loading-img" />
                        <p><strong>No contracts found on the current network!</strong></p>
                        <p>Please make sure that you are connected to the correct network
                            and the contracts are deployed.</p>
                        <Progress percent="40" size='tiny' error />
                    </div>
                </main>
            );
        }

        if (!this.props.ipfsInitialized && !this.props.ipfsFailed) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ipfs_logo} alt="ipfs_logo" className="loading-img" />
                        <p><strong>Initializing IPFS...</strong></p><p/>
                        <Progress percent="60" size='tiny' active />
                    </div>
                </main>
            );
        }

        if (this.props.ipfsFailed) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={ipfs_logo} alt="ipfs_logo" className="loading-img" />
                        <p><strong>IPFS initialization failed!</strong></p><p/>
                        <Progress percent="60" size='tiny' error />
                    </div>
                </main>
            );
        }

        if (!this.props.orbitInitialized  && !this.props.orbitFailed) {
            const message = process.env.NODE_ENV === 'development'
                ? 'If needed, please sign the transaction in MetaMask to create the databases.'
                : 'Please sign the transaction in MetaMask to create the databases.';
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={orbitdb_logo} alt="orbitdb_logo" className="loading-img" />
                        <p><strong>Preparing OrbitDB...</strong></p>
                        <p>{message}</p>
                        <Progress percent="80" size='tiny' active />
                    </div>
                </main>
            );
        }

        if (this.props.orbitFailed) {
            return (
                <main className="loading-screen">
                    <div className="ui container">
                        <img src={orbitdb_logo} alt="orbitdb_logo" className="loading-img" />
                        <p><strong>OrbitDB initialization failed!</strong></p><p/>
                        <Progress percent="80" size='tiny' error />
                    </div>
                </main>
            );
        }

        if (this.props.drizzleStatus.initialized) return Children.only(this.props.children);

        return (
            <main className="loading-screen">
                <div className="ui container">
                    <img src={logo} alt="app_logo" className="loading-img" />
                    <p><strong>Loading dapp...</strong></p><p/>
                    <Progress percent="90" size='tiny' error />
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
    ipfsFailed: state.ipfs.failed,
    orbitInitialized: state.orbit.initialized,
    orbitFailed: state.orbit.failed
});

export default connect(mapStateToProps)(LoadingContainer);
