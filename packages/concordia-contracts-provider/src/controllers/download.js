import * as fs from 'fs';
import path from 'path';
import { getStorageLocation, getTagsDirectory } from '../utils/storageUtils';

const downloadContracts = async (req, res) => {
  const { params: { hash: hashOrTag } } = req;
  let directoryPath = getStorageLocation(hashOrTag);

  if (!fs.existsSync(directoryPath)) {
    const tagsDirectory = getTagsDirectory();

    if (fs.existsSync(tagsDirectory)) {
      const tagFilePath = path.join(tagsDirectory, hashOrTag);
      const tagReference = fs.readFileSync(tagFilePath, 'utf-8');

      directoryPath = getStorageLocation(tagReference);
    }
  }

  const contracts = [];

  fs.readdirSync(directoryPath).forEach((contractFilename) => {
    const rawContractData = fs.readFileSync(path.join(`${directoryPath}/${contractFilename}`), 'utf-8');
    const contractJson = JSON.parse(rawContractData);
    contracts.push(contractJson);
  });

  res.send(contracts);
};

export default downloadContracts;
