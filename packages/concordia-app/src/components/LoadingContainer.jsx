import React, { Children } from 'react';
import { breezeConstants } from '@ezerous/breeze';
import { useSelector } from 'react-redux';
import LoadingComponent from './LoadingComponent';

// CSS
import '../assets/css/loading-component.css';

const LoadingContainer = ({ children }) => {
  const initializing = useSelector((state) => state.drizzleStatus.initializing);
  const failed = useSelector((state) => state.drizzleStatus.failed);
  const ipfsStatus = useSelector((state) => state.ipfs.status);
  const orbitStatus = useSelector((state) => state.orbit.status);
  const web3Status = useSelector((state) => state.web3.status);
  const web3NetworkId = useSelector((state) => state.web3.networkId);
  const web3NetworkFailed = useSelector((state) => state.web3.networkFailed);
  const web3AccountsFailed = useSelector((state) => state.web3.accountsFailed);
  const contractInitialized = useSelector((state) => state.contracts.Forum.initialized);
  const contractDeployed = useSelector((state) => state.contracts.Forum.deployed);
  const userFetched = useSelector((state) => state.user.address);

  if ((web3Status === 'initializing' || !web3NetworkId)
            && !web3NetworkFailed) {
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

  if (web3Status === 'failed' || web3NetworkFailed) {
    return (
        <LoadingComponent
          title="No connection to the Ethereum network!"
          message="Please make sure that:"
          messageList={['MetaMask is unlocked and pointed to the correct, available network',
            'The app has been granted the right to connect to your account']}
          imageType="ethereum"
          progress={20}
          progressType="error"
        />
    );
  }

  if (web3Status === 'initialized' && web3AccountsFailed) {
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
};

export default LoadingContainer;
