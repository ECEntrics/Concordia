import React, { Children } from 'react';
import { breezeConstants } from '@ezerous/breeze';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import CustomLoader from './CustomLoader';

// CSS
import '../../assets/css/loading-component.css';

const InitializationLoader = ({ children }) => {
  const initializing = useSelector((state) => state.drizzleStatus.initializing);
  const failed = useSelector((state) => state.drizzleStatus.failed);
  const ipfsStatus = useSelector((state) => state.ipfs.status);
  const orbitStatus = useSelector((state) => state.orbit.status);
  const web3Status = useSelector((state) => state.web3.status);
  const web3NetworkId = useSelector((state) => state.web3.networkId);
  const web3NetworkFailed = useSelector((state) => state.web3.networkFailed);
  const web3AccountsFailed = useSelector((state) => state.web3.accountsFailed);
  const contractInitialized = useSelector((state) => state.contracts[FORUM_CONTRACT].initialized);
  const contractDeployed = useSelector((state) => state.contracts[FORUM_CONTRACT].deployed);
  const userFetched = useSelector((state) => state.user.address);

  if (!window.ethereum) {
    return (
        <CustomLoader
          title="Couldn't detect MetaMask!"
          message={['Please make sure to install ', <a href="https://metamask.io/">MetaMask</a>, ' first.']}
          imageType="metamask"
          progress={10}
          progressType="error"
        />
    );
  }

  if ((web3Status === 'initializing' || !web3NetworkId) && !web3NetworkFailed) {
    return (
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
          title="We can't find any Ethereum accounts!"
          message="Please make sure that MetaMask is unlocked."
          imageType="ethereum"
          progress={20}
          progressType="error"
        />
    );
  }

  if (initializing || (!failed && !contractInitialized && contractDeployed)) {
    return (
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
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
        <CustomLoader
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

export default InitializationLoader;
