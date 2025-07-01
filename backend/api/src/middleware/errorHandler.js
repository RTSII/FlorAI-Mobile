/**
 * Error handling middleware
 * Provides consistent error responses for the API
 */
const { logger } = require('../utils/logger');

/**
 * Custom API error class
 */
class ApiError extends Error {
  constructor(statusCode, message, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    error: err,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // If it's an ApiError, use its properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp,
      },
    });
  }

  // For validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.array(),
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Default error response
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  ApiError,
  errorHandler,
};
