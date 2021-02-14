import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { contractsProviderPort } from 'concordia-shared/src/environment/interpolated/contractsProvider';
import fs from 'fs';
import path from 'path';
import initRoutes from './routes/web';
import constants from './constants';
import { logger, logsDirectoryPath } from './utils/logger';

const accessLogStream = fs.createWriteStream(path.join(logsDirectoryPath, 'access.log'), { flags: 'a' });
logger.info('Service setting up.');

const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(';')
  : constants.corsAllowedOrigins;

logger.info(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);

const app = express();

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

initRoutes(app);

app.listen(contractsProviderPort, () => {
  logger.info(`Contracts provider listening at http://127.0.0.1:${contractsProviderPort}`);
});
