const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'http';

    logger[logLevel](
      `${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
