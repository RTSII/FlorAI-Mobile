/**
 * Authentication routes
 * Handles user authentication and authorization
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Get JWT secret and expiration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }

      // Get user data from request
      const { email, password, name } = req.body;

      // Log the request (excluding the password)
      logger.info('User registration request', {
        email,
        name,
      });

      // In a real implementation, this would save to a database
      // For now, we'll return a mock response with a token
      const token = jwt.sign(
        {
          userId: 'mock-user-id',
          email,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      // Return the token and user data
      return res.status(201).json({
        token,
        user: {
          id: 'mock-user-id',
          email,
          name,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }

      // Get user data from request
      const { email, password } = req.body;

      // Log the request (excluding the password)
      logger.info('User login request', {
        email,
      });

      // In a real implementation, this would verify credentials against a database
      // For now, we'll return a mock response with a token
      const token = jwt.sign(
        {
          userId: 'mock-user-id',
          email,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      // Return the token and user data
      return res.status(200).json({
        token,
        user: {
          id: 'mock-user-id',
          email,
          name: 'Mock User',
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    // Get user data from authenticated request
    const { userId, email } = req.user;

    // Log the request
    logger.info(`Get current user request for user ID: ${userId}`);

    // In a real implementation, this would fetch from a database
    // For now, we'll return a mock response
    return res.status(200).json({
      user: {
        id: userId,
        email,
        name: 'Mock User',
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route POST /api/auth/consent
 * @desc Update user consent preferences
 * @access Private
 */
router.post(
  '/consent',
  authenticate,
  [
    body('locationConsent').isBoolean(),
    body('notificationsConsent').isBoolean(),
    body('dataUsageConsent').isBoolean(),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }

      // Get user data from authenticated request
      const { userId } = req.user;

      // Get consent data from request
      const { locationConsent, notificationsConsent, dataUsageConsent } = req.body;

      // Log the request
      logger.info(`Update consent preferences for user ID: ${userId}`, {
        locationConsent,
        notificationsConsent,
        dataUsageConsent,
      });

      // In a real implementation, this would save to a database
      // For now, we'll return a mock response
      return res.status(200).json({
        success: true,
        consentUpdated: new Date().toISOString(),
        preferences: {
          locationConsent,
          notificationsConsent,
          dataUsageConsent,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
