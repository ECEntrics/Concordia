const path = require('path');

const getLogger = (winston, logsDirectory, serviceName) => {
  const transports = [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, 'combined.log'),
    }),
  ];

  const exceptionHandlers = [
    new winston.transports.File({ filename: path.join(logsDirectory, 'exceptions.log') }),
  ];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }));

    exceptionHandlers.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }));
  }

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service: serviceName },
    transports,
    exceptionHandlers,
  });
};

module.exports = getLogger;
