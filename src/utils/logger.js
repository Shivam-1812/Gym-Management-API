const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Custom format for console logs
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: { service: 'gym-management-api' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to combined.log
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, add a colorized console transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    )
  }));
}

// Add a stream object for Morgan middleware
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

module.exports = logger;