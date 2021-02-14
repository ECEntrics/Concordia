import path from 'path';
import { constants, promises as fs } from 'fs';
import uploadFilesUsingMiddleware from '../middleware/upload';
import { getStorageLocation, getTagsDirectory } from '../utils/storageUtils';
import { logger } from '../utils/logger';

const provisionContractsDirectory = (req) => {
  const { params: { hash } } = req;
  const contractsPath = getStorageLocation(hash);

  return fs
    .access(contractsPath, constants.W_OK)
    .then(() => fs.rmdir(contractsPath, { recursive: true }))
    .catch(() => Promise.resolve())
    .then(() => fs.mkdir(contractsPath, { recursive: true }))
    .then((ignored) => {
      logger.info(`Provisioned new contracts directory: ${contractsPath}`);
      return ignored;
    });
};

const addOrTransferTag = (tag, hash) => {
  const tagsDirectory = getTagsDirectory();
  const tagFilePath = path.join(tagsDirectory, tag);

  return fs
    .mkdir(tagsDirectory, { recursive: true })
    .then(() => fs.writeFile(tagFilePath, hash, 'utf-8'))
    .then((ignored) => {
      logger.info(`Tag modified: ${tag} -> ${hash}`);
      return ignored;
    });
};

const uploadContracts = async (req, res) => provisionContractsDirectory(req)
  .then(() => uploadFilesUsingMiddleware(req, res)
    .then(() => {
      if (req.files.length <= 0) {
        return Promise.reject(new Error('You must select at least 1 file.'));
      }

      const { body: { tag } } = req;
      const { params: { hash } } = req;

      if (tag) {
        return addOrTransferTag(tag, hash)
          .then(() => res.send('Files have been uploaded and tagged.'));
      }

      return res.send('Files have been uploaded.');
    }));

export default uploadContracts;
