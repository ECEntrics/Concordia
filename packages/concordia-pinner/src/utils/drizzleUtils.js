import unirest from 'unirest';
import {
  contractsProviderHost,
  contractsProviderPort,
  contractsVersionHash,
} from 'concordia-shared/src/environment/interpolated/contractsProvider';
import { pinnerApiHost, pinnerApiPort } from 'concordia-shared/src/environment/interpolated/pinner';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';

function getContractsDownloadRequest() {
  const HOST = pinnerApiHost;
  const PORT = pinnerApiPort;

  return unirest(
    'GET',
    `http://${contractsProviderHost}:${contractsProviderPort}/contracts/${contractsVersionHash}`,
  ).headers({
    'Access-Control-Allow-Origin': `${HOST}:${PORT}`,
    'Access-Control-Allow-Credentials': 'true',
  });
}

const validateRemoteContracts = (remoteContracts) => {
  if (!remoteContracts
    .map((remoteContract) => remoteContract.contractName)
    .includes(FORUM_CONTRACT)) {
    throw new Error('Forum contract is missing from artifacts.');
  }
};

const downloadContractArtifacts = () => {
  const request = getContractsDownloadRequest();

  return new Promise((resolve, reject) => request
    .end((response) => {
      if (response.error) {
        reject(new Error(`Remote contract artifacts download request failed!\n${response.error}`));
      }

      resolve(response.raw_body);
    })).then((contractsRawData) => {
    const remoteContracts = JSON.parse(contractsRawData);

    validateRemoteContracts(remoteContracts);

    return remoteContracts;
  });
};

export default downloadContractArtifacts;
