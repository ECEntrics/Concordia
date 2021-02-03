import * as util from 'util';
import * as fs from 'fs';
import multer from 'multer';
import getStorageLocation from '../utils/storageUtils';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { params: { hash } } = req;
    const contractsPath = getStorageLocation(hash);

    fs.mkdirSync(contractsPath, { recursive: true });
    callback(null, contractsPath);
  },
  filename: (req, file, callback) => {
    const match = ['application/json'];

    if (match.indexOf(file.mimetype) === -1) {
      const message = `<strong>${file.originalname}</strong> is invalid. Only JSON files are accepted.`;
      return callback(message, null);
    }

    const filename = `${file.originalname}`;
    callback(null, filename);
  },
});

const uploadFiles = multer({ storage }).array('contracts');
const uploadFilesMiddleware = util.promisify(uploadFiles);

export default uploadFilesMiddleware;
