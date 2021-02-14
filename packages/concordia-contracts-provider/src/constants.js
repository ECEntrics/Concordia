import path from 'path';

const UPLOAD_CONTRACTS_DIRECTORY = path.join(__dirname, '..', 'contracts-uploads');
const CORS_ALLOWED_ORIGINS = ['http://127.0.0.1:7000', 'http://localhost:7000'];
const LOGS_PATH = path.join(__dirname, '..', 'logs');

export default {
  uploadsDirectory: UPLOAD_CONTRACTS_DIRECTORY,
  corsAllowedOrigins: CORS_ALLOWED_ORIGINS,
  logsPath: LOGS_PATH,
};
