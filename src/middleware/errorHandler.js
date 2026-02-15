const logger = require('../config/logger');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method} ${req.path}] Status: ${statusCode}, Message: ${message}`, {
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
    },
  });
};

module.exports = { errorHandler, ApiError };
