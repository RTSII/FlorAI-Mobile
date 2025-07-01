/**
 * Plant routes
 * Handles all plant-related API endpoints
 */
const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorHandler');
const { plantService } = require('../services/plantService');
const { authenticate } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed', 'INVALID_FILE_TYPE'));
    }
  },
});

/**
 * @route POST /api/plants/identify
 * @desc Identify a plant from an image
 * @access Public
 */
router.post(
  '/identify',
  upload.single('image'),
  [
    body('includeHealthAssessment').optional().isBoolean(),
    body('detailedInfo').optional().isBoolean(),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }

      // Check if file exists
      if (!req.file) {
        throw new ApiError(400, 'No image file provided', 'MISSING_FILE');
      }

      // Get options from request
      const includeHealthAssessment = req.body.includeHealthAssessment !== 'false';
      const detailedInfo = req.body.detailedInfo !== 'false';

      // Log the request (excluding the image data)
      logger.info('Plant identification request', {
        fileSize: req.file.size,
        includeHealthAssessment,
        detailedInfo,
      });

      // Call the plant service to identify the plant
      const result = await plantService.identifyPlant(
        req.file.buffer,
        includeHealthAssessment,
        detailedInfo
      );

      // Return the result
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route GET /api/plants/:plantId
 * @desc Get detailed information about a specific plant
 * @access Public
 */
router.get('/:plantId', async (req, res, next) => {
  try {
    const { plantId } = req.params;

    // Validate plant ID
    if (!plantId) {
      throw new ApiError(400, 'Plant ID is required', 'MISSING_PLANT_ID');
    }

    // Log the request
    logger.info(`Plant details request for ID: ${plantId}`);

    // Call the plant service to get plant details
    const result = await plantService.getPlantDetails(plantId);

    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route GET /api/plants/user/collection
 * @desc Get the user's plant collection
 * @access Private
 */
router.get('/user/collection', authenticate, async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const { userId } = req.user;

    // Log the request
    logger.info(`User plant collection request for user ID: ${userId}`);

    // Call the plant service to get the user's plant collection
    const result = await plantService.getUserPlants(userId);

    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route POST /api/plants/user/collection
 * @desc Add a plant to the user's collection
 * @access Private
 */
router.post(
  '/user/collection',
  authenticate,
  [
    body('plantId').notEmpty().withMessage('Plant ID is required'),
    body('nickname').optional().isString(),
    body('location').optional().isString(),
    body('notes').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }

      // Get user ID from authenticated request
      const { userId } = req.user;

      // Get plant data from request
      const { plantId, nickname, location, notes } = req.body;

      // Log the request
      logger.info(`Add plant to collection request for user ID: ${userId}`, {
        plantId,
        nickname,
      });

      // Call the plant service to add the plant to the user's collection
      const result = await plantService.addPlantToCollection(userId, {
        plantId,
        nickname,
        location,
        notes,
      });

      // Return the result
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
