// const downloadContractArtifacts = async () => {
import { NUMBER_OF_CONTRACTS } from '../constants/contracts/ContractNames';

export const downloadContractArtifacts = async () => {
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', 'http://localhost:7000');
  headers.append('Access-Control-Allow-Credentials', 'true');

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers,
  };

  const remoteContracts = await fetch('http://127.0.0.1:8400/contracts/asdf', requestOptions)
    .then((response) => response.text())
    .then((contractsRawData) => JSON.parse(contractsRawData));

  if (remoteContracts.length !== NUMBER_OF_CONTRACTS) {
    throw new Error(`Version mismatch detected. Artifacts brought ${remoteContracts.length} contracts but app 
    expected ${NUMBER_OF_CONTRACTS}`);
  }

  return remoteContracts;
};

export const downloadContractArtifactsSync = () => {
  const xhrRequest = new XMLHttpRequest();
  // xhrRequest.withCredentials = true;
  xhrRequest.open('GET', 'http://127.0.0.1:8400/contracts/asdf', false);
  xhrRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:7000');
  xhrRequest.setRequestHeader('Access-Control-Allow-Credentials', 'true');
  xhrRequest.send(null);

  if (xhrRequest.status === 200) {
    const contractsRawData = xhrRequest.responseText;
    const remoteContracts = JSON.parse(contractsRawData);

    if (remoteContracts.length !== NUMBER_OF_CONTRACTS) {
      throw new Error(`Version mismatch detected. Artifacts brought ${remoteContracts.length} contracts but app 
    expected ${NUMBER_OF_CONTRACTS}`);
    }

    return remoteContracts;
  }
  throw new Error(`Remote contract artifacts download request failed!\n${xhrRequest.responseText}`);
};
