import winston from 'winston';
import fs from 'fs';
import getLogger from 'concordia-shared/src/logging/node/winstonLogUtils';
import { LOGS_PATH } from '../constants';

export const logsDirectoryPath = process.env.LOGS_PATH || LOGS_PATH;
fs.mkdirSync(logsDirectoryPath, { recursive: true });

export const logger = getLogger(winston, logsDirectoryPath, 'concordia-pinner');
