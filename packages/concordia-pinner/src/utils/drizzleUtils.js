import unirest from 'unirest';
import {
  contractsProviderHost,
  contractsProviderPort,
  contractsVersionHash,
} from 'concordia-shared/src/environment/interpolated/contractsProvider';
import { pinnerApiHost, pinnerApiPort } from 'concordia-shared/src/environment/interpolated/pinner';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { logger } from './logger';

function getContractsDownloadRequest() {
  const HOST = pinnerApiHost;
  const PORT = pinnerApiPort;

  const contractsProviderAddress = `${contractsProviderHost}:${contractsProviderPort}/contracts/`
      + `${contractsVersionHash}`;
  const selfAddress = `${HOST}:${PORT}`;

  logger.info(`Trying contracts provider address: ${contractsProviderAddress}`);
  logger.info(`Sending with CORS address: ${selfAddress}`);

  return unirest(
    'GET',
    contractsProviderAddress,
  ).headers({
    'Access-Control-Allow-Origin': selfAddress,
    'Access-Control-Allow-Credentials': 'true',
  });
}

const validateRemoteContracts = (remoteContracts) => {
  logger.info('Validating remote contracts.');

  if (!remoteContracts
    .map((remoteContract) => remoteContract.contractName)
    .includes(FORUM_CONTRACT)) {
    throw new Error('Forum contract is missing from artifacts.');
  }

  logger.info('Remote contracts valid.');
};

const downloadContractArtifacts = () => {
  logger.info('Downloading contracts.');
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
