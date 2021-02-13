import { CONTRACTS } from 'concordia-shared/src/constants/contracts/ContractNames';
import {
  contractsProviderHost,
  contractsProviderPort,
  contractsVersionHash,
} from 'concordia-shared/src/environment/interpolated/contractsProvider';
import {
  CONCORDIA_HOST_DEFAULT,
  CONCORDIA_PORT_DEFAULT,
} from '../constants/configuration/defaults';

function getContractsDownloadRequest() {
  const HOST = process.env.REACT_APP_CONCORDIA_HOST
      || (window.runtimeEnv && window.runtimeEnv.REACT_APP_CONCORDIA_HOST)
      || CONCORDIA_HOST_DEFAULT;
  const PORT = process.env.REACT_APP_CONCORDIA_PORT
      || (window.runtimeEnv && window.runtimeEnv.REACT_APP_CONCORDIA_PORT)
      || CONCORDIA_PORT_DEFAULT;

  const xhrRequest = new XMLHttpRequest();

  xhrRequest.open('GET',
    `http://${contractsProviderHost}:${contractsProviderPort}/contracts/${contractsVersionHash}`,
    false);
  xhrRequest.setRequestHeader('Access-Control-Allow-Origin', `${HOST}:${PORT}`);
  xhrRequest.setRequestHeader('Access-Control-Allow-Credentials', 'true');

  return xhrRequest;
}

function validateRemoteContracts(remoteContracts) {
  if (remoteContracts.length !== CONTRACTS.length) {
    throw new Error(`Version mismatch detected. Artifacts brought ${remoteContracts.length} contracts but app 
    expected ${CONTRACTS.length}`);
  }

  const contractsPresentStatus = CONTRACTS.map((contract) => ({
    contract,
    present: remoteContracts.includes((remoteContract) => remoteContract.contractName === contract),
  }));

  if (contractsPresentStatus.reduce((accumulator, contract) => accumulator && contract.present, true)) {
    throw new Error(`Contracts missing from artifacts. Provider didn't bring ${contractsPresentStatus
      .filter((contractPresentStatus) => contractPresentStatus.present === false)
      .map((contractPresentStatus) => contractPresentStatus.contract)
      .join(', ')}.`);
  }
}

const downloadContractArtifactsSync = () => {
  const xhrRequest = getContractsDownloadRequest();

  xhrRequest.send(null);

  if (xhrRequest.status === 200) {
    const contractsRawData = xhrRequest.responseText;
    const remoteContracts = JSON.parse(contractsRawData);

    validateRemoteContracts(remoteContracts);

    return remoteContracts;
  }

  throw new Error(`Remote contract artifacts download request failed!\n${xhrRequest.responseText}`);
};

export default downloadContractArtifactsSync;
