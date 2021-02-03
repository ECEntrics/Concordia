import * as fs from 'fs';
import path from 'path';
import { UPLOADED_CONTRACTS_DIR } from '../constants';

const downloadContracts = async (req, res) => {
  const { params: { hash } } = req;
  const directoryPath = path.join(`${__dirname}/../../${UPLOADED_CONTRACTS_DIR}/${hash}`);
  const contracts = [];

  fs.readdirSync(directoryPath).forEach((contractFilename) => {
    const rawContractData = fs.readFileSync(path.join(`${directoryPath}/${contractFilename}`), 'utf-8');
    const contractJson = JSON.parse(rawContractData);
    contracts.push(contractJson);
  });

  res.send(contracts);
};

export default downloadContracts;
