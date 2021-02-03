const path = require('path');
const unirest = require('unirest');
const { contracts } = require('../index');
const defaults = require('../constants/config/defaults');

const uploadContractsToProviderUnirest = (versionHash, tag) => {
  const CONTRACTS_PROVIDER_HOST = process.env.CONTRACTS_PROVIDER_HOST || defaults.contractsProviderHost;
  const CONTRACTS_PROVIDER_PORT = process.env.CONTRACTS_PROVIDER_PORT || defaults.contractsProviderPort;

  const uploadPath = `http://${CONTRACTS_PROVIDER_HOST}:${CONTRACTS_PROVIDER_PORT}/contracts/${versionHash}`;
  const req = unirest('POST', uploadPath);

  contracts
    .forEach((contract) => req
      .attach('contracts', path.join(__dirname, '../', 'build/', `${contract.contractName}.json`)));

  console.log(`Uploading to ${uploadPath}`);
  req.end((res) => {
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
