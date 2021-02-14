import winston from 'winston';
import fs from 'fs';
import getLogger from 'concordia-shared/src/logging/node/winstonLogUtils';
import constants from '../constants';

export const logsDirectoryPath = process.env.LOGS_PATH || constants.logsPath;
fs.mkdirSync(logsDirectoryPath, { recursive: true });

export const logger = getLogger(winston, logsDirectoryPath, 'concordia-contracts-provider');
