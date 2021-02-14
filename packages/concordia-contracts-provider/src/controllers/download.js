import { promises as fs, constants } from 'fs';
import path from 'path';
import { getStorageLocation, getTagsDirectory } from '../utils/storageUtils';
import { logger } from '../utils/logger';

const readContractFilesToArray = (contractsDirectoryPath) => fs
  .readdir(contractsDirectoryPath)
  .then((contractFilenames) => contractFilenames
    .map((contractFilename) => fs
      .readFile(path.join(`${contractsDirectoryPath}/${contractFilename}`), 'utf-8')
      .then((rawContractData) => JSON.parse(rawContractData))))
  .then((contractObjectPromises) => Promise.all([...contractObjectPromises]))
  .then((contracts) => {
    logger.info(`Successfully read ${contracts.length} contract(s) from dir: ${contractsDirectoryPath}`);
    return contracts;
  });

const downloadContracts = async (req, res) => {
  const { params: { hash: identifier } } = req;
  const hashBasedDirectoryPath = getStorageLocation(identifier);

  return fs.access(hashBasedDirectoryPath, constants.R_OK)
    .then(() => readContractFilesToArray(hashBasedDirectoryPath))
    .catch(() => {
      const tagsDirectory = getTagsDirectory();

      return fs
        .access(tagsDirectory, constants.R_OK)
        .then(() => {
          const tagFilePath = path.join(tagsDirectory, identifier);

          return fs.readFile(tagFilePath, 'utf-8')
            .then((tagReference) => {
              const tagBasedDirectoryPath = getStorageLocation(tagReference);

              return readContractFilesToArray(tagBasedDirectoryPath);
            });
        });
    }).then((contracts) => res.send(contracts))
    .catch(() => Promise.reject(new Error(`No contracts version or tag found for ${identifier}.`)));
};

export default downloadContracts;
