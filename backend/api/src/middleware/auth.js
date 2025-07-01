/**
 * Authentication middleware
 * Handles user authentication for protected routes
 */
const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const { logger } = require('../utils/logger');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Authenticate middleware
 * Verifies JWT token and adds user data to request
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required', 'UNAUTHORIZED');
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Authentication token required', 'UNAUTHORIZED');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Add user data to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
      
      // Continue to next middleware
      next();
    } catch (error) {
      logger.error('JWT verification error:', error);
      throw new ApiError(401, 'Invalid authentication token', 'INVALID_TOKEN');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
