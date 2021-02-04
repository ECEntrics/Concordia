import path from 'path';
import fs from 'fs';
import upload from '../middleware/upload';
import { getTagsDirectory } from '../utils/storageUtils';

const addOrTransferTag = (tag, hash) => {
  const tagsDirectory = getTagsDirectory();
  const tagFilePath = path.join(tagsDirectory, tag);

  fs.mkdirSync(tagsDirectory, { recursive: true });
  fs.writeFileSync(tagFilePath, hash);
};

const uploadContracts = async (req, res) => {
  try {
    await upload(req, res);

    const { body: { tag } } = req;
    const { params: { hash } } = req;

    if (tag) {
      addOrTransferTag(tag, hash);
    }

    if (req.files.length <= 0) {
      return res.send('You must select at least 1 file.');
    }

    return res.send('Files have been uploaded.');
  } catch (error) {
    console.log(error);

    return res.send(`Error when trying upload many files: ${error}`);
  }
};

export default uploadContracts;
