import path from 'path';
import { promises as fs } from 'fs';
import upload from '../middleware/upload';
import { getTagsDirectory } from '../utils/storageUtils';

const addOrTransferTag = (tag, hash) => {
  const tagsDirectory = getTagsDirectory();
  const tagFilePath = path.join(tagsDirectory, tag);

  return fs
    .mkdir(tagsDirectory, { recursive: true })
    .then(() => fs.writeFile(tagFilePath, hash, 'utf-8'));
};

const uploadContracts = async (req, res) => upload(req, res)
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
  });

export default uploadContracts;
