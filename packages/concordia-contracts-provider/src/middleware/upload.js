import * as util from 'util';
import multer from 'multer';
import { getStorageLocation } from '../utils/storageUtils';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { params: { hash } } = req;
    const contractsPath = getStorageLocation(hash);

    callback(null, contractsPath);
  },
  filename: (req, file, callback) => {
    const match = ['application/json'];

    if (match.indexOf(file.mimetype) === -1) {
      const message = `<strong>${file.originalname}</strong> is invalid. Only JSON files are accepted.`;
      callback(message, null);
    }

    const filename = `${file.originalname}`;
    callback(null, filename);
  },
});

const uploadFiles = multer({ storage }).array('contracts');
const uploadFilesMiddleware = util.promisify(uploadFiles);

export default uploadFilesMiddleware;
