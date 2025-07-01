/**
 * Dataset Aggregation Script
 *
 * This script aggregates open-source plant datasets for training the
 * proprietary plant identification and disease detection model.
 *
 * Supported datasets:
 * - PlantNet-300K
 * - PlantVillage
 * - Kaggle plant datasets
 * - GBIF (Global Biodiversity Information Facility)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const AdmZip = require('adm-zip');
const csv = require('csv-parser');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { processImage, extractFeatures } = require('../services/dataProcessingPipeline');

// Environment variables (should be in .env file)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const STORAGE_BUCKET = 'plant-contributions';
const PROCESSED_BUCKET = 'processed-data';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Base directories
const DOWNLOAD_DIR = path.join(__dirname, '../data/downloads');
const PROCESSED_DIR = path.join(__dirname, '../data/processed');

// Create directories if they don't exist
[DOWNLOAD_DIR, PROCESSED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Main function to aggregate datasets
 */
async function aggregateDatasets() {
  try {
    console.log('Starting dataset aggregation...');

    // Create dataset record in database
    const datasetId = await createDataset(
      'Aggregated Open-Source Dataset',
      'Combined dataset from multiple open sources',
      'external',
    );

    // Process each dataset
    await processPlantNet300K(datasetId);
    await processPlantVillage(datasetId);
    await processKaggleDatasets(datasetId);
    await processGBIF(datasetId);

    console.log('Dataset aggregation completed successfully!');
    return { success: true, datasetId };
  } catch (error) {
    console.error('Error aggregating datasets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new dataset record
 * @param {string} name - Dataset name
 * @param {string} description - Dataset description
 * @param {string} source - Dataset source
 * @returns {Promise<string>} - Dataset ID
 */
async function createDataset(name, description, source = 'external') {
  try {
    const { data, error } = await supabase
      .from('plant_data.datasets')
      .insert([
        {
          name,
          description,
          source,
          status: 'in_progress',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    console.log(`Created dataset: ${name} (${data.id})`);
    return data.id;
  } catch (error) {
    console.error('Error creating dataset:', error);
    throw new Error(`Failed to create dataset: ${error.message}`);
  }
}

/**
 * Process PlantNet-300K dataset
 * @param {string} datasetId - Dataset ID to associate with
 */
async function processPlantNet300K(datasetId) {
  const PLANTNET_URL = 'https://plantnet-project.github.io/PlantNet-300K/';
  const PLANTNET_DIR = path.join(DOWNLOAD_DIR, 'plantnet-300k');

  console.log('Processing PlantNet-300K dataset...');

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(PLANTNET_DIR)) {
      fs.mkdirSync(PLANTNET_DIR, { recursive: true });
    }

    // This is a placeholder for the actual download and processing logic
    // In a real implementation, you would:
    // 1. Download the dataset (requires academic access)
    // 2. Extract the images and annotations
    // 3. Process each image and save to Supabase

    console.log(
      'Note: PlantNet-300K requires academic access. Please download manually and place in:',
      PLANTNET_DIR,
    );
    console.log('Visit https://plantnet-project.github.io/PlantNet-300K/ for access instructions');

    // Check if dataset files exist locally
    const sampleDir = path.join(PLANTNET_DIR, 'images');
    if (fs.existsSync(sampleDir)) {
      console.log('Found local PlantNet-300K files, processing...');

      // Process sample of images (limit to 1000 for this example)
      const species = fs.readdirSync(sampleDir).slice(0, 20);
      let processedCount = 0;

      for (const speciesDir of species) {
        const speciesPath = path.join(sampleDir, speciesDir);
        if (fs.statSync(speciesPath).isDirectory()) {
          const images = fs.readdirSync(speciesPath).slice(0, 50);

          for (const image of images) {
            const imagePath = path.join(speciesPath, image);
            try {
              await processExternalImage(imagePath, {
                datasetId,
                scientificName: speciesDir.replace('_', ' '),
                source: 'PlantNet-300K',
              });
              processedCount++;
            } catch (err) {
              console.warn(`Error processing ${imagePath}:`, err.message);
            }

            // Limit processing
            if (processedCount >= 1000) break;
          }

          if (processedCount >= 1000) break;
        }
      }

      console.log(`Processed ${processedCount} images from PlantNet-300K`);
    }
  } catch (error) {
    console.error('Error processing PlantNet-300K:', error);
  }
}

/**
 * Process PlantVillage dataset
 * @param {string} datasetId - Dataset ID to associate with
 */
async function processPlantVillage(datasetId) {
  const PLANTVILLAGE_DIR = path.join(DOWNLOAD_DIR, 'plantvillage');

  console.log('Processing PlantVillage dataset...');

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(PLANTVILLAGE_DIR)) {
      fs.mkdirSync(PLANTVILLAGE_DIR, { recursive: true });
    }

    // This is a placeholder for the actual download and processing logic
    // In a real implementation, you would:
    // 1. Download the dataset from Kaggle or other sources
    // 2. Extract the images and annotations
    // 3. Process each image and save to Supabase

    console.log('Note: PlantVillage dataset should be downloaded manually from Kaggle:');
    console.log('https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset');

    // Check if dataset files exist locally
    if (fs.existsSync(path.join(PLANTVILLAGE_DIR, 'raw'))) {
      console.log('Found local PlantVillage files, processing...');

      // Process images
      const categories = fs.readdirSync(path.join(PLANTVILLAGE_DIR, 'raw'));
      let processedCount = 0;

      for (const category of categories) {
        const categoryPath = path.join(PLANTVILLAGE_DIR, 'raw', category);
        if (fs.statSync(categoryPath).isDirectory()) {
          // Parse category name and disease status
          const parts = category.split('___');
          const plant = parts[0].replace('_', ' ');
          const isHealthy = parts.length === 1 || parts[1].includes('healthy');
          const disease = parts.length > 1 ? parts[1].replace('_', ' ') : null;

          const images = fs.readdirSync(categoryPath).slice(0, 50);

          for (const image of images) {
            const imagePath = path.join(categoryPath, image);
            try {
              await processExternalImage(imagePath, {
                datasetId,
                scientificName: plant,
                isHealthy,
                diseaseInfo: disease ? { name: disease } : null,
                source: 'PlantVillage',
              });
              processedCount++;
            } catch (err) {
              console.warn(`Error processing ${imagePath}:`, err.message);
            }

            // Limit processing
            if (processedCount >= 1000) break;
          }

          if (processedCount >= 1000) break;
        }
      }

      console.log(`Processed ${processedCount} images from PlantVillage`);
    }
  } catch (error) {
    console.error('Error processing PlantVillage:', error);
  }
}

/**
 * Process Kaggle datasets
 * @param {string} datasetId - Dataset ID to associate with
 */
async function processKaggleDatasets(datasetId) {
  console.log('Processing Kaggle datasets...');

  // This is a placeholder for processing various Kaggle datasets
  // In a real implementation, you would use the Kaggle API to download datasets

  console.log('Note: Kaggle datasets require API authentication.');
  console.log('Please set up Kaggle API credentials and download datasets manually.');
}

/**
 * Process GBIF data
 * @param {string} datasetId - Dataset ID to associate with
 */
async function processGBIF(datasetId) {
  console.log('Processing GBIF data...');

  // This is a placeholder for GBIF API integration
  // In a real implementation, you would use the GBIF API to download occurrence data

  console.log('Note: GBIF integration requires API setup.');
  console.log('Visit https://www.gbif.org/developer/summary for API documentation.');
}

/**
 * Process an external image and save to database
 * @param {string} imagePath - Path to image file
 * @param {Object} metadata - Image metadata
 * @returns {Promise<Object>} - Processing result
 */
async function processExternalImage(imagePath, metadata) {
  try {
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Generate unique ID
    const id = uuidv4();

    // Process image
    const processedImage = await processImage(imageBuffer);

    // Extract features
    const features = await extractFeatures(processedImage);

    // Save to Supabase storage
    const storagePath = `external/${metadata.source}/${id}.jpg`;
    const processedPath = `external/${metadata.source}/${id}_processed.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { error: processedUploadError } = await supabase.storage
      .from(PROCESSED_BUCKET)
      .upload(processedPath, processedImage.buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (processedUploadError) throw processedUploadError;

    // Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    // Create contribution record
    const { data: contribution, error: contributionError } = await supabase
      .from('plant_data.plant_contributions')
      .insert([
        {
          id,
          user_id: null, // External data has no user
          scientific_name: metadata.scientificName,
          is_healthy: metadata.isHealthy,
          disease_info: metadata.diseaseInfo,
          image_path: storagePath,
          image_url: urlData.publicUrl,
          status: 'approved', // Auto-approve external data
          notes: `Imported from ${metadata.source}`,
        },
      ])
      .select()
      .single();

    if (contributionError) throw contributionError;

    // Save features
    if (features) {
      const featureRecords = [];

      // Save color histogram features
      if (features.color_histogram) {
        featureRecords.push({
          contribution_id: id,
          feature_type: 'color_histogram',
          feature_data: features.color_histogram,
        });
      }

      // Save texture features
      if (features.texture) {
        featureRecords.push({
          contribution_id: id,
          feature_type: 'texture',
          feature_data: features.texture,
        });
      }

      // Save dimension features
      if (features.dimensions) {
        featureRecords.push({
          contribution_id: id,
          feature_type: 'dimensions',
          feature_data: features.dimensions,
        });
      }

      if (featureRecords.length > 0) {
        const { error: featureError } = await supabase
          .from('plant_data.plant_features')
          .insert(featureRecords);

        if (featureError) throw featureError;
      }
    }

    // Add to dataset
    const { error: datasetError } = await supabase.from('plant_data.dataset_items').insert([
      {
        dataset_id: metadata.datasetId,
        contribution_id: id,
        split: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'validation' : 'test') : 'train',
      },
    ]);

    if (datasetError) throw datasetError;

    return { id, success: true };
  } catch (error) {
    console.error(`Error processing external image ${imagePath}:`, error);
    throw error;
  }
}

// Export functions
module.exports = {
  aggregateDatasets,
  processPlantNet300K,
  processPlantVillage,
  processKaggleDatasets,
  processGBIF,
};

// Run if called directly
if (require.main === module) {
  aggregateDatasets()
    .then((result) => {
      console.log('Aggregation complete:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Aggregation failed:', error);
      process.exit(1);
    });
}
