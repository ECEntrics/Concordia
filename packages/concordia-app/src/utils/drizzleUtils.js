import {
  REACT_APP_CONCORDIA_HOST_DEFAULT,
  REACT_APP_CONCORDIA_PORT_DEFAULT,
  REACT_APP_CONTRACTS_SUPPLIER_HOST_DEFAULT,
  REACT_APP_CONTRACTS_SUPPLIER_PORT_DEFAULT,
  REACT_APP_CONTRACTS_VERSION_HASH_DEFAULT,
} from '../constants/configuration/defaults';
import CONTRACTS from '../constants/contracts/ContractNames';

function getContractsDownloadRequest() {
  const CONTRACTS_SUPPLIER_HOST = process.env.REACT_APP_CONTRACTS_SUPPLIER_HOST
      || REACT_APP_CONTRACTS_SUPPLIER_HOST_DEFAULT;
  const CONTRACTS_SUPPLIER_PORT = process.env.REACT_APP_CONTRACTS_SUPPLIER_PORT
      || REACT_APP_CONTRACTS_SUPPLIER_PORT_DEFAULT;
  const CONTRACTS_VERSION_HASH = process.env.REACT_APP_CONTRACTS_VERSION_HASH
      || REACT_APP_CONTRACTS_VERSION_HASH_DEFAULT;
  const HOST = process.env.REACT_APP_CONCORDIA_HOST || REACT_APP_CONCORDIA_HOST_DEFAULT;
  const PORT = process.env.REACT_APP_CONCORDIA_PORT || REACT_APP_CONCORDIA_PORT_DEFAULT;

  const xhrRequest = new XMLHttpRequest();

  xhrRequest.open('GET',
    `http://${CONTRACTS_SUPPLIER_HOST}:${CONTRACTS_SUPPLIER_PORT}/contracts/${CONTRACTS_VERSION_HASH}`,
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
    throw new Error(`Contracts missing from artifacts. Supplier didn't bring ${contractsPresentStatus
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
