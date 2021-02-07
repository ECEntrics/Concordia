const path = require('path');
const unirest = require('unirest');
const { contractsProviderHost } = require('concordia-shared/src/environment/interpolated/contractsProvider');
const { contractsProviderPort } = require('concordia-shared/src/environment/interpolated/contractsProvider');
const { contracts } = require('../index');

const uploadContractsToProviderUnirest = (versionHash, tag) => {
  const uploadPath = `http://${contractsProviderHost}:${contractsProviderPort}/contracts/${versionHash}`;
  const request = unirest('POST', uploadPath)
    .field('tag', tag);

  contracts
    .forEach((contract) => request
      .attach('contracts', path.join(__dirname, '../', 'build/', `${contract.contractName}.json`)));

  console.log(`Uploading to ${uploadPath}`);
  request.end((res) => {
    if (res.error) {
      throw new Error(`Failed to upload contracts to provider: ${res.error}`);
    }

    console.log('Contracts uploaded to provider.');
  });
};

const main = () => {
  uploadContractsToProviderUnirest(process.argv[2], process.argv[3]);
};

main();
