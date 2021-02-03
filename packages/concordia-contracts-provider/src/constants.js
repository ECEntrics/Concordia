import path from 'path';

const PROVIDER_PORT = '8400';
const UPLOAD_CONTRACTS_DIRECTORY = path.join(__dirname, '..', 'contracts-uploads');
const CORS_ALLOWED_ORIGINS = ['localhost:7000', '127.0.0.1:7000'];

export default {
  port: PROVIDER_PORT,
  uploadsDirectory: UPLOAD_CONTRACTS_DIRECTORY,
  corsAllowedOrigins: CORS_ALLOWED_ORIGINS,
};
