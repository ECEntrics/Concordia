import path from 'path';
import constants from '../constants';

const getStorageLocation = (hash) => {
  const UPLOADS_DIRECTORY = process.env.UPLOAD_CONTRACTS_DIRECTORY || constants.uploadsDirectory;

  return path.join(UPLOADS_DIRECTORY, hash);
};

export default getStorageLocation;
