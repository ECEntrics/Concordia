import React, { Children, Component } from 'react';
import { connect } from 'react-redux';

import { breezeConstants } from '@ezerous/breeze'

import LoadingComponent from './LoadingComponent';

// CSS
import '../assets/css/loading-component.css';

class LoadingContainer extends Component {
    render() {
        if ((this.props.web3.status === 'initializing' || !this.props.web3.networkId)
            && !this.props.web3.networkFailed) {
            return <LoadingComponent
                title="Connecting to the Ethereum network..."
                message="Please make sure to unlock MetaMask and grant the app the right to connect to your account."
                image_type="ethereum"
                progress={20}
                progress_type="indicating"
            />
        }

        if (this.props.web3.status === 'failed' || this.props.web3.networkFailed) {
            return <LoadingComponent
                title="No connection to the Ethereum network!"
                message="Please make sure that:"
                message_list={['MetaMask is unlocked and pointed to the correct, available network',
                    'The app has been granted the right to connect to your account']}
                image_type="ethereum"
                progress={20}
                progress_type="error"
            />
        }

        if (this.props.web3.status === 'initialized' && this.props.web3.accountsFailed) {
            return <LoadingComponent
                title="We can't find any Ethereum accounts!"
                message="Please make sure that MetaMask is unlocked."
                image_type="ethereum"
                progress={20}
                progress_type="error"
            />
        }

        if (this.props.drizzleStatus.initializing
            || (!this.props.drizzleStatus.failed && !this.props.contractInitialized && this.props.contractDeployed )){
            return <LoadingComponent
                title="Initializing contracts..."
                message=""
                image_type="ethereum"
                progress={40}
                progress_type="indicating"
            />
        }

        if (!this.props.contractDeployed) {
            return <LoadingComponent
                title="No contracts found on the current network!"
                message="Please make sure that you are connected to the correct network and the contracts are deployed."
                image_type="ethereum"
                progress={40}
                progress_type="error"
            />
        }

        if (this.props.ipfsStatus === breezeConstants.STATUS_INITIALIZING) {
            return <LoadingComponent
                title="Initializing IPFS..."
                message=""
                image_type="ipfs"
                progress={60}
                progress_type="indicating"
            />
        }

        if (this.props.ipfsStatus === breezeConstants.STATUS_FAILED) {
            return <LoadingComponent
                title="IPFS initialization failed!"
                message=""
                image_type="ipfs"
                progress={60}
                progress_type="error"
            />
        }

        if (this.props.orbitStatus === breezeConstants.STATUS_INITIALIZING) {
            const message = process.env.NODE_ENV === 'development'
                ? 'If needed, please sign the transaction in MetaMask to create the databases.'
                : 'Please sign the transaction in MetaMask to create the databases.';
            return <LoadingComponent
                title="Preparing OrbitDB..."
                message={message}
                image_type="orbit"
                progress={80}
                progress_type="indicating"
            />
        }

        if (this.props.orbitStatus === breezeConstants.STATUS_FAILED) {
            return <LoadingComponent
                title="OrbitDB initialization failed!"
                message=""
                image_type="orbit"
                progress={80}
                progress_type="error"
            />
        }

        if (!this.props.userFetched){
            return <LoadingComponent
                title="Loading dapp..."
                message=""
                image_type="app"
                progress={90}
                progress_type="indicating"
            />
        }

        return Children.only(this.props.children);
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
    userFetched: state.user.address
});

export default connect(mapStateToProps)(LoadingContainer);
