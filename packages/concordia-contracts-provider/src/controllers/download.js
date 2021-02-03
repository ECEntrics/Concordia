import * as fs from 'fs';
import path from 'path';
import getStorageLocation from '../utils/storageUtils';

const downloadContracts = async (req, res) => {
  const { params: { hash } } = req;
  const directoryPath = getStorageLocation(hash);

  const contracts = [];

  fs.readdirSync(directoryPath).forEach((contractFilename) => {
    const rawContractData = fs.readFileSync(path.join(`${directoryPath}/${contractFilename}`), 'utf-8');
    const contractJson = JSON.parse(rawContractData);
    contracts.push(contractJson);
  });

  res.send(contracts);
};

export default downloadContracts;
