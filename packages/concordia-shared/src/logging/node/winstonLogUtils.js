const path = require('path');

const getLogger = (winston, logsDirectory, serviceName) => {
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({
        filename: path.join(logsDirectory, 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join(logsDirectory, 'combined.log'),
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: path.join(logsDirectory, 'exceptions.log') }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }));
  }

  return logger;
};

module.exports = getLogger;
