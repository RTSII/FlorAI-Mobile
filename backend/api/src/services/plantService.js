/**
 * Plant Service
 * Handles communication with the Plant.id API microservice
 */
const axios = require('axios');
const FormData = require('form-data');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

// Get microservice URL from environment variables
const PLANT_SERVICE_URL = process.env.PLANT_SERVICE_URL || 'http://localhost:8000';

/**
 * Plant service for handling plant identification and related operations
 */
const plantService = {
  /**
   * Identify a plant from an image
   * @param {Buffer} imageBuffer - The image buffer
   * @param {boolean} includeHealthAssessment - Whether to include health assessment
   * @param {boolean} detailedInfo - Whether to include detailed plant information
   * @returns {Promise<Object>} - The identification result
   */
  async identifyPlant(imageBuffer, includeHealthAssessment = true, detailedInfo = true) {
    try {
      // Create form data for the request
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: 'plant.jpg',
        contentType: 'image/jpeg',
      });

      // Make request to the plant identification microservice
      const response = await axios.post(
        `${PLANT_SERVICE_URL}/identify`,
        formData,
        {
          params: {
            include_health_assessment: includeHealthAssessment,
            detailed_info: detailedInfo,
          },
          headers: {
            ...formData.getHeaders(),
            'Accept': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error identifying plant:', error);

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.detail || 'Plant identification service error';
        throw new ApiError(statusCode, errorMessage, 'PLANT_ID_SERVICE_ERROR');
      } else if (error.request) {
        // The request was made but no response was received
        throw new ApiError(503, 'Plant identification service unavailable', 'SERVICE_UNAVAILABLE');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new ApiError(500, 'Error processing plant identification request', 'INTERNAL_ERROR');
      }
    }
  },

  /**
   * Get detailed information about a specific plant
   * @param {string} plantId - The plant ID
   * @returns {Promise<Object>} - The plant details
   */
  async getPlantDetails(plantId) {
    try {
      // Make request to the plant identification microservice
      const response = await axios.get(`${PLANT_SERVICE_URL}/plant/${plantId}`, {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      });

      return response.data;
    } catch (error) {
      logger.error(`Error getting plant details for ID ${plantId}:`, error);

      // Handle different types of errors
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.detail || 'Plant details service error';
        throw new ApiError(statusCode, errorMessage, 'PLANT_DETAILS_SERVICE_ERROR');
      } else if (error.request) {
        throw new ApiError(503, 'Plant details service unavailable', 'SERVICE_UNAVAILABLE');
      } else {
        throw new ApiError(500, 'Error processing plant details request', 'INTERNAL_ERROR');
      }
    }
  },

  /**
   * Get the user's plant collection
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - The user's plant collection
   */
  async getUserPlants(userId) {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll return a mock response
      return {
        plants: [
          {
            id: 'mock-plant-1',
            plantId: 'monstera-deliciosa',
            nickname: 'My Monstera',
            location: 'Living Room',
            notes: 'Bought on June 15, 2025',
            addedAt: new Date().toISOString(),
            lastWatered: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      logger.error(`Error getting plants for user ${userId}:`, error);
      throw new ApiError(500, 'Error retrieving user plants', 'DATABASE_ERROR');
    }
  },

  /**
   * Add a plant to the user's collection
   * @param {string} userId - The user ID
   * @param {Object} plantData - The plant data
   * @returns {Promise<Object>} - The added plant
   */
  async addPlantToCollection(userId, plantData) {
    try {
      // In a real implementation, this would save to a database
      // For now, we'll return a mock response
      return {
        id: 'mock-plant-id',
        ...plantData,
        addedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Error adding plant to collection for user ${userId}:`, error);
      throw new ApiError(500, 'Error adding plant to collection', 'DATABASE_ERROR');
    }
  },
};

module.exports = {
  plantService,
};
