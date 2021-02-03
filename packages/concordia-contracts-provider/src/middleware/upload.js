import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import multer from 'multer';
import { UPLOADED_CONTRACTS_DIR } from '../constants';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { params: { hash } } = req;
    const contractsPath = path.join(`${__dirname}/../../${UPLOADED_CONTRACTS_DIR}/${hash}`);

    fs.mkdirSync(contractsPath, { recursive: true });
    callback(null, contractsPath);
    // callback(null, UPLOADED_CONTRACTS_DIR);
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
