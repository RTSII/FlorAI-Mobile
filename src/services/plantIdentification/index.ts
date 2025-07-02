/**
 * Plant Identification Service
 * 
 * Centralized service for plant identification functionality
 * Enhanced with better error handling and environment configuration
 */

import { ApiResponse, ApiErrorCode } from '../../api/types.ts';

import { identifyPlantApi, getPlantDetailsApi, validateEnvironmentForApiCalls } from './api.ts';
import { PlantDetails, PlantIdentificationOptions, PlantIdentificationResponse } from './types.ts';
import { imageUriToBase64 } from './utils.ts';

// Import these functions directly from utils to avoid merged declaration errors
import { mapResultToPlant as mapResultToPlantUtil, saveIdentifiedPlant as saveIdentifiedPlantUtil } from './utils.ts';

/**
 * Identify plant from image with enhanced error handling
 * @param imageUri URI of the captured image
 * @param options Optional identification options
 * @returns Promise resolving to plant identification response
 */
const identifyPlant = async (
  imageUri: string,
  _options?: PlantIdentificationOptions
): Promise<ApiResponse<PlantIdentificationResponse>> => {
  try {
    // Validate environment variables before making API calls
    validateEnvironmentForApiCalls();
    
    // Convert image URI to base64
    const base64Image = await imageUriToBase64(imageUri);
    if (!base64Image) {
      return {
        error: {
          code: ApiErrorCode.IMAGE_PROCESSING_ERROR,
          message: 'Failed to process image. Please try again with a different image.',
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    // Call the API to identify the plant
    const response = await identifyPlantApi(base64Image);
    
    return response;
  } catch (error) {
    console.error('Plant identification error:', error);
    return {
      error: {
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: 'Failed to identify plant. Please try again.',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    };
  }
};

/**
 * Gets detailed information about a specific plant
 * @param plantId ID of the identified plant
 * @returns Promise with plant details response
 */
const getPlantDetails = async (plantId: string): Promise<ApiResponse<PlantDetails>> => {
  try {
    // Validate environment variables before making API calls
    validateEnvironmentForApiCalls();

    if (!plantId) {
      return {
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'No plant ID provided for details lookup',
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Call the API to get plant details
    const response = await getPlantDetailsApi(plantId);

    // Return the response directly
    return response;
  } catch (error) {
    console.error('Error getting plant details:', error);
    
    return {
      error: {
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: 'Failed to get plant details. Please try again.',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    };
  }
};

// These functions are now imported from utils.ts to avoid merged declaration errors

// Export the enhanced plant identification service
export const plantIdentificationService = {
  identifyPlant,
  getPlantDetails,
  mapResultToPlant: mapResultToPlantUtil,
  saveIdentifiedPlant: saveIdentifiedPlantUtil,
  imageUriToBase64
};

export default plantIdentificationService;
