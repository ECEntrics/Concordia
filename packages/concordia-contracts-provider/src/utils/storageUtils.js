import path from 'path';
import constants from '../constants';

export const getStorageLocation = (hash) => {
  const UPLOADS_DIRECTORY = process.env.UPLOAD_CONTRACTS_DIRECTORY || constants.uploadsDirectory;

  if (hash) {
    return path.join(UPLOADS_DIRECTORY, hash);
  }

  return UPLOADS_DIRECTORY;
};

export const getTagsDirectory = () => {
  const uploadsPath = getStorageLocation();
  return path.join(uploadsPath, '/tags');
};
