/**
 * Data Contribution Routes
 * Handles endpoints for collecting user-contributed plant data for model training
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/contributions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

/**
 * @route   POST /api/contribute/plant
 * @desc    Contribute a plant image for model training
 * @access  Private (requires authentication)
 */
router.post(
  '/plant',
  auth,
  upload.single('image'),
  [
    check('scientificName', 'Scientific name is required').not().isEmpty(),
    check('commonName', 'Common name is required').not().isEmpty(),
    check('dataUsageConsent', 'Data usage consent is required').isBoolean(),
    check('isHealthy', 'Plant health status is required').isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user has consented to data usage
      if (!req.body.dataUsageConsent) {
        return res.status(400).json({
          error: 'Data usage consent is required to contribute plant images',
        });
      }

      // Extract metadata from request
      const {
        scientificName,
        commonName,
        family,
        isHealthy,
        diseaseInfo,
        growingConditions,
        locationConsent,
        latitude,
        longitude,
        notes,
      } = req.body;

      // Only include location if user has explicitly consented
      const locationData = locationConsent && latitude && longitude
        ? { latitude, longitude }
        : null;

      // Get the uploaded file information
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Read the file from disk
      const fileBuffer = fs.readFileSync(file.path);
      
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('plant-contributions')
        .upload(`${req.user.id}/${file.filename}`, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (storageError) {
        logger.error('Error uploading to Supabase Storage', storageError);
        return res.status(500).json({
          error: 'Failed to store image',
          details: process.env.NODE_ENV === 'development' ? storageError : undefined,
        });
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase
        .storage
        .from('plant-contributions')
        .getPublicUrl(`${req.user.id}/${file.filename}`);

      // Store metadata in Supabase Database
      const { data: metadataData, error: metadataError } = await supabase
        .from('plant_contributions')
        .insert([
          {
            user_id: req.user.id,
            scientific_name: scientificName,
            common_name: commonName,
            family: family || null,
            is_healthy: isHealthy,
            disease_info: diseaseInfo || null,
            growing_conditions: growingConditions || null,
            location_data: locationData,
            notes: notes || null,
            image_path: storageData.path,
            image_url: publicUrlData.publicUrl,
            status: 'pending_review', // Initial status
            created_at: new Date(),
          },
        ]);

      if (metadataError) {
        logger.error('Error storing metadata in Supabase', metadataError);
        return res.status(500).json({
          error: 'Failed to store plant metadata',
          details: process.env.NODE_ENV === 'development' ? metadataError : undefined,
        });
      }

      // Clean up the local file after upload
      fs.unlinkSync(file.path);

      // Send success response
      return res.status(201).json({
        message: 'Plant contribution received successfully',
        contributionId: metadataData[0].id,
      });
    } catch (error) {
      logger.error('Error in plant contribution endpoint', error);
      return res.status(500).json({
        error: 'Server error processing plant contribution',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * @route   POST /api/contribute/feedback
 * @desc    Submit feedback on an identification (correct/incorrect)
 * @access  Private (requires authentication)
 */
router.post(
  '/feedback',
  auth,
  [
    check('identificationId', 'Identification ID is required').not().isEmpty(),
    check('isCorrect', 'Feedback on correctness is required').isBoolean(),
    check('dataUsageConsent', 'Data usage consent is required').isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract feedback data
      const {
        identificationId,
        isCorrect,
        dataUsageConsent,
        correctScientificName,
        correctCommonName,
        notes,
      } = req.body;

      // Store feedback in Supabase
      const { data, error } = await supabase
        .from('identification_feedback')
        .insert([
          {
            user_id: req.user.id,
            identification_id: identificationId,
            is_correct: isCorrect,
            data_usage_consent: dataUsageConsent,
            correct_scientific_name: correctScientificName || null,
            correct_common_name: correctCommonName || null,
            notes: notes || null,
            created_at: new Date(),
          },
        ]);

      if (error) {
        logger.error('Error storing feedback in Supabase', error);
        return res.status(500).json({
          error: 'Failed to store feedback',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        });
      }

      // Send success response
      return res.status(201).json({
        message: 'Feedback submitted successfully',
        feedbackId: data[0].id,
      });
    } catch (error) {
      logger.error('Error in feedback submission endpoint', error);
      return res.status(500).json({
        error: 'Server error processing feedback',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * @route   GET /api/contribute/status
 * @desc    Get status of user's contributions
 * @access  Private (requires authentication)
 */
router.get('/status', auth, async (req, res) => {
  try {
    // Query user's contributions from Supabase
    const { data, error } = await supabase
      .from('plant_contributions')
      .select('id, scientific_name, common_name, status, created_at, image_url')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching contribution status', error);
      return res.status(500).json({
        error: 'Failed to fetch contribution status',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }

    // Count contributions by status
    const statusCounts = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    // Send response
    return res.status(200).json({
      contributions: data,
      summary: {
        total: data.length,
        statusCounts,
      },
    });
  } catch (error) {
    logger.error('Error in contribution status endpoint', error);
    return res.status(500).json({
      error: 'Server error fetching contribution status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
