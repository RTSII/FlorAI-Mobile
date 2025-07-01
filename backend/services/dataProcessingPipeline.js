/**
 * Data Processing Pipeline for Plant Identification Model Training
 *
 * This service handles the collection, processing, and preparation of plant data
 * for training the proprietary plant identification and disease detection model.
 */

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ExifParser = require('exif-parser');
const { v4: uuidv4 } = require('uuid');
const tf = require('@tensorflow/tfjs-node');

// Environment variables (should be in .env file)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const STORAGE_BUCKET = 'plant-contributions';
const PROCESSED_BUCKET = 'processed-data';
const MODEL_BUCKET = 'model-artifacts';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Process a new plant contribution
 * @param {Object} contribution - Plant contribution data
 * @param {Buffer} imageBuffer - Raw image buffer
 * @returns {Promise<Object>} - Processed contribution data
 */
async function processContribution(contribution, imageBuffer) {
  try {
    // Generate unique ID for the contribution
    const contributionId = uuidv4();

    // Extract EXIF metadata if available
    const exifData = await extractExifMetadata(imageBuffer);

    // Process and standardize the image
    const processedImage = await processImage(imageBuffer);

    // Extract features for model training
    const features = await extractFeatures(processedImage);

    // Save processed image to storage
    const imagePath = `${contributionId}/original.jpg`;
    const processedPath = `${contributionId}/processed.jpg`;

    await saveToStorage(STORAGE_BUCKET, imagePath, imageBuffer);
    await saveToStorage(PROCESSED_BUCKET, processedPath, processedImage.buffer);

    // Create database entries
    const dbContribution = await createContributionRecord({
      id: contributionId,
      ...contribution,
      image_path: imagePath,
      image_url: getPublicUrl(STORAGE_BUCKET, imagePath),
    });

    // Save metadata if user consented
    if (await hasUserConsent(contribution.user_id, 'exif_metadata')) {
      await createMetadataRecord(contributionId, exifData, contribution.environmental_data);
    }

    // Save extracted features
    await saveFeatures(contributionId, features);

    // Add to appropriate datasets based on criteria
    await assignToDatasets(contributionId, contribution);

    return {
      id: contributionId,
      status: 'processed',
      image_url: getPublicUrl(STORAGE_BUCKET, imagePath),
    };
  } catch (error) {
    console.error('Error processing contribution:', error);
    throw new Error(`Failed to process plant contribution: ${error.message}`);
  }
}

/**
 * Extract EXIF metadata from image
 * @param {Buffer} imageBuffer - Raw image buffer
 * @returns {Promise<Object>} - Extracted EXIF data
 */
async function extractExifMetadata(imageBuffer) {
  try {
    // Create parser instance
    const parser = ExifParser.create(imageBuffer);
    const result = parser.parse();

    // Format and clean EXIF data
    const exifData = {
      make: result.tags.Make,
      model: result.tags.Model,
      software: result.tags.Software,
      createDate: result.tags.CreateDate,
      modifyDate: result.tags.ModifyDate,
      dateTimeOriginal: result.tags.DateTimeOriginal,
      orientation: result.tags.Orientation,
      xResolution: result.tags.XResolution,
      yResolution: result.tags.YResolution,
      resolutionUnit: result.tags.ResolutionUnit,
      exposureTime: result.tags.ExposureTime,
      fNumber: result.tags.FNumber,
      exposureProgram: result.tags.ExposureProgram,
      iso: result.tags.ISO,
      flash: result.tags.Flash,
      focalLength: result.tags.FocalLength,
      whiteBalance: result.tags.WhiteBalance,
      meteringMode: result.tags.MeteringMode,
      exposureMode: result.tags.ExposureMode,
      gpsLatitude: result.tags.GPSLatitude,
      gpsLongitude: result.tags.GPSLongitude,
      gpsAltitude: result.tags.GPSAltitude,
    };

    // Remove undefined values
    return Object.fromEntries(Object.entries(exifData).filter(([_, v]) => v !== undefined));
  } catch (error) {
    console.warn('Failed to extract EXIF data:', error.message);
    return {}; // Return empty object if extraction fails
  }
}

/**
 * Process and standardize image for model training
 * @param {Buffer} imageBuffer - Raw image buffer
 * @returns {Promise<Object>} - Processed image data
 */
async function processImage(imageBuffer) {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();

    // Resize image to standard dimensions while preserving aspect ratio
    const MAX_DIM = 1024;
    const resizeOptions = {};

    if (metadata.width > metadata.height && metadata.width > MAX_DIM) {
      resizeOptions.width = MAX_DIM;
    } else if (metadata.height > MAX_DIM) {
      resizeOptions.height = MAX_DIM;
    }

    // Process image: resize, normalize, enhance
    const processedBuffer = await sharp(imageBuffer)
      .resize(resizeOptions)
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    // Get processed metadata
    const processedMetadata = await sharp(processedBuffer).metadata();

    return {
      buffer: processedBuffer,
      width: processedMetadata.width,
      height: processedMetadata.height,
      format: processedMetadata.format,
      channels: processedMetadata.channels,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Extract features from image for model training
 * @param {Object} processedImage - Processed image data
 * @returns {Promise<Object>} - Extracted features
 */
async function extractFeatures(processedImage) {
  try {
    // Convert image to tensor
    const tensor = tf.node.decodeImage(processedImage.buffer);

    // Normalize pixel values
    const normalized = tensor.toFloat().div(tf.scalar(255));

    // Resize to standard input size for feature extraction
    const resized = tf.image.resizeBilinear(normalized, [224, 224]);

    // Extract basic color features
    const rgbMean = tf.mean(resized, [0, 1]).arraySync();

    // Extract texture features (simple implementation)
    const grayscale = tf.mean(resized, 2);
    const sobelH = tf.conv2d(
      grayscale.reshape([1, 224, 224, 1]),
      tf.tensor4d(
        [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ],
        [3, 3, 1, 1],
      ),
      1,
      'same',
    );
    const sobelV = tf.conv2d(
      grayscale.reshape([1, 224, 224, 1]),
      tf.tensor4d(
        [
          [-1, -2, -1],
          [0, 0, 0],
          [1, 2, 1],
        ],
        [3, 3, 1, 1],
      ),
      1,
      'same',
    );

    const gradientMagnitude = tf.sqrt(tf.add(tf.square(sobelH), tf.square(sobelV)));

    const textureFeatures = tf.mean(gradientMagnitude, [1, 2]).arraySync()[0];

    // Clean up tensors
    tensor.dispose();
    normalized.dispose();
    resized.dispose();
    grayscale.dispose();
    sobelH.dispose();
    sobelV.dispose();
    gradientMagnitude.dispose();

    return {
      color_histogram: {
        mean_rgb: rgbMean,
      },
      texture: {
        mean_gradient: textureFeatures,
      },
      dimensions: {
        width: processedImage.width,
        height: processedImage.height,
        aspect_ratio: processedImage.width / processedImage.height,
      },
    };
  } catch (error) {
    console.error('Error extracting features:', error);
    return {
      error: `Feature extraction failed: ${error.message}`,
      dimensions: {
        width: processedImage.width,
        height: processedImage.height,
        aspect_ratio: processedImage.width / processedImage.height,
      },
    };
  }
}

/**
 * Save file to Supabase storage
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - Path within bucket
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<Object>} - Upload result
 */
async function saveToStorage(bucket, filePath, buffer) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: 'image/jpeg',
      upsert: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error saving to ${bucket}/${filePath}:`, error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }
}

/**
 * Get public URL for a stored file
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - Path within bucket
 * @returns {string} - Public URL
 */
function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Create contribution record in database
 * @param {Object} contribution - Contribution data
 * @returns {Promise<Object>} - Created record
 */
async function createContributionRecord(contribution) {
  try {
    const { data, error } = await supabase
      .from('plant_data.plant_contributions')
      .insert([contribution])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating contribution record:', error);
    throw new Error(`Database insert failed: ${error.message}`);
  }
}

/**
 * Create metadata record in database
 * @param {string} contributionId - Contribution ID
 * @param {Object} exifData - EXIF metadata
 * @param {Object} environmentalData - Environmental data
 * @returns {Promise<Object>} - Created record
 */
async function createMetadataRecord(contributionId, exifData, environmentalData) {
  try {
    const metadata = {
      contribution_id: contributionId,
      exif_data: exifData || {},
      environmental_data: environmentalData || {},
    };

    const { data, error } = await supabase
      .from('plant_data.image_metadata')
      .insert([metadata])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating metadata record:', error);
    throw new Error(`Metadata insert failed: ${error.message}`);
  }
}

/**
 * Save extracted features to database
 * @param {string} contributionId - Contribution ID
 * @param {Object} features - Extracted features
 * @returns {Promise<Object>} - Created records
 */
async function saveFeatures(contributionId, features) {
  try {
    const featureRecords = [];

    // Save color histogram features
    if (features.color_histogram) {
      featureRecords.push({
        contribution_id: contributionId,
        feature_type: 'color_histogram',
        feature_data: features.color_histogram,
      });
    }

    // Save texture features
    if (features.texture) {
      featureRecords.push({
        contribution_id: contributionId,
        feature_type: 'texture',
        feature_data: features.texture,
      });
    }

    // Save dimension features
    if (features.dimensions) {
      featureRecords.push({
        contribution_id: contributionId,
        feature_type: 'dimensions',
        feature_data: features.dimensions,
      });
    }

    if (featureRecords.length > 0) {
      const { data, error } = await supabase
        .from('plant_data.plant_features')
        .insert(featureRecords)
        .select();

      if (error) throw error;
      return data;
    }

    return [];
  } catch (error) {
    console.error('Error saving features:', error);
    throw new Error(`Feature insert failed: ${error.message}`);
  }
}

/**
 * Check if user has given consent for a specific data type
 * @param {string} userId - User ID
 * @param {string} consentType - Type of consent to check
 * @returns {Promise<boolean>} - Whether consent was given
 */
async function hasUserConsent(userId, consentType) {
  try {
    const { data, error } = await supabase
      .from('plant_data.user_consent')
      .select(consentType)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn(`Error checking consent for ${userId}:`, error);
      return false;
    }

    return data && data[consentType] === true;
  } catch (error) {
    console.error('Error checking user consent:', error);
    return false; // Default to no consent on error
  }
}

/**
 * Assign contribution to appropriate datasets
 * @param {string} contributionId - Contribution ID
 * @param {Object} contribution - Contribution data
 * @returns {Promise<Array>} - Dataset assignments
 */
async function assignToDatasets(contributionId, contribution) {
  try {
    // Get active datasets
    const { data: datasets, error } = await supabase
      .from('plant_data.datasets')
      .select('id, name')
      .in('status', ['in_progress', 'ready'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If no datasets exist, create a default one
    if (!datasets || datasets.length === 0) {
      const { data: newDataset, error: createError } = await supabase
        .from('plant_data.datasets')
        .insert([
          {
            name: 'Default Dataset',
            description: 'Automatically created dataset',
            source: 'user_contributed',
            status: 'in_progress',
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      datasets = [newDataset];
    }

    // Determine which dataset(s) to add to
    // For now, add to the most recent active dataset
    const targetDataset = datasets[0];

    // Determine split (80% train, 10% validation, 10% test)
    const random = Math.random();
    let split = 'train';
    if (random > 0.9) {
      split = 'test';
    } else if (random > 0.8) {
      split = 'validation';
    }

    // Create dataset item
    const { data, error: insertError } = await supabase
      .from('plant_data.dataset_items')
      .insert([
        {
          dataset_id: targetDataset.id,
          contribution_id: contributionId,
          split,
        },
      ])
      .select();

    if (insertError) throw insertError;
    return data;
  } catch (error) {
    console.error('Error assigning to datasets:', error);
    throw new Error(`Dataset assignment failed: ${error.message}`);
  }
}

/**
 * Process a batch of contributions
 * @param {number} batchSize - Number of contributions to process
 * @returns {Promise<Object>} - Processing results
 */
async function processBatch(batchSize = 10) {
  try {
    // Get pending contributions
    const { data: contributions, error } = await supabase
      .from('plant_data.plant_contributions')
      .select('*')
      .eq('status', 'pending_review')
      .limit(batchSize);

    if (error) throw error;

    if (!contributions || contributions.length === 0) {
      return { processed: 0, message: 'No pending contributions found' };
    }

    // Process each contribution
    const results = [];
    for (const contribution of contributions) {
      try {
        // Download image
        const { data: imageData, error: downloadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .download(contribution.image_path);

        if (downloadError) throw downloadError;

        // Process contribution
        const result = await processContribution(contribution, imageData);

        // Update status
        await supabase
          .from('plant_data.plant_contributions')
          .update({ status: 'processed' })
          .eq('id', contribution.id);

        results.push({
          id: contribution.id,
          status: 'success',
        });
      } catch (error) {
        console.error(`Error processing contribution ${contribution.id}:`, error);

        // Update status to error
        await supabase
          .from('plant_data.plant_contributions')
          .update({
            status: 'error',
            notes: `${contribution.notes || ''}\nProcessing error: ${error.message}`,
          })
          .eq('id', contribution.id);

        results.push({
          id: contribution.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    return {
      processed: contributions.length,
      successful: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      results,
    };
  } catch (error) {
    console.error('Error processing batch:', error);
    throw new Error(`Batch processing failed: ${error.message}`);
  }
}

/**
 * Train or update model with latest data
 * @param {Object} options - Training options
 * @returns {Promise<Object>} - Training results
 */
async function trainModel(options = {}) {
  // This is a placeholder for the actual model training logic
  // In a real implementation, this would:
  // 1. Load data from the database
  // 2. Preprocess the data for training
  // 3. Train the model using TensorFlow.js or call an external ML service
  // 4. Save the model artifacts
  // 5. Update the model version in the database

  console.log('Model training initiated with options:', options);

  return {
    status: 'initiated',
    message: 'Model training initiated. This is a placeholder for actual training logic.',
  };
}

module.exports = {
  processContribution,
  processBatch,
  trainModel,
  extractExifMetadata,
  processImage,
  extractFeatures,
  hasUserConsent,
};
