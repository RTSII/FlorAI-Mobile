/**
 * Plant Identification API Integration
 * Handles direct API communication for plant identification
 */

import { apiClient } from '../../api/apiClient';
import { ENDPOINTS, TIMEOUTS, API_KEYS } from '../../api/config';
import { 
  PlantIdentificationResponse,
  ApiResponse,
  ApiErrorCode,
  ApiError
} from '../../api/types';
import { validateEnvironment } from '../../config/env';
import { PlantDetails } from './types';

/**
 * Validate environment variables required for API calls
 * @throws Error if required environment variables are missing
 */
export const validateEnvironmentForApiCalls = (): void => {
  try {
    // Validate that the required environment variables are set
    validateEnvironment([API_KEYS.PLANT_ID]);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error(`Configuration error: ${error instanceof Error ? error.message : 'Missing required API keys'}`);
  }
};

/**
 * Send plant identification request to the API
 * @param imageBase64 Base64 encoded image data
 * @returns Promise resolving to plant identification response
 */
export const identifyPlantApi = async (
  imageBase64: string
): Promise<ApiResponse<PlantIdentificationResponse>> => {
  validateEnvironmentForApiCalls();
  
  try {
    const response = await apiClient.post<PlantIdentificationResponse>(
      ENDPOINTS.PLANT_IDENTIFICATION,
      {
        images: [imageBase64],
        organs: ['leaf', 'flower', 'fruit', 'bark', 'habit'],
        // Include additional parameters for better results
        plant_language: 'en',
        plant_details: [
          'common_names',
          'url',
          'wiki_description',
          'taxonomy',
          'synonyms'
        ],
      },
      {
        timeout: TIMEOUTS.PLANT_IDENTIFICATION,
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': API_KEYS.PLANT_ID
        }
      }
    );

    return {
      success: true,
      data: response.data,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'plant.id API'
      }
    };
  } catch (error) {
    // Handle API errors with detailed error codes and messages
    const apiError: ApiError = {
      code: ApiErrorCode.UNKNOWN_ERROR,
      message: 'An unknown error occurred during plant identification',
      details: error instanceof Error ? error.message : String(error)
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      apiError.code = error.response.status === 401 
        ? ApiErrorCode.AUTHENTICATION_ERROR 
        : ApiErrorCode.API_ERROR;
      apiError.message = `API Error: ${error.response.status} ${error.response.statusText}`;
      apiError.details = JSON.stringify(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      apiError.code = ApiErrorCode.NETWORK_ERROR;
      apiError.message = 'Network error: No response received from server';
    } else if (error.message?.includes('timeout')) {
      apiError.code = ApiErrorCode.TIMEOUT_ERROR;
      apiError.message = 'Request timed out. Please try again.';
    } else if (error.message?.includes('configuration')) {
      apiError.code = ApiErrorCode.CONFIGURATION_ERROR;
      apiError.message = error.message;
    }

    return {
      success: false,
      error: apiError
    };
  }
};

/**
 * Get detailed information about a plant from the API
 * @param plantId ID of the identified plant
 * @returns Promise resolving to plant details
 */
export const getPlantDetailsApi = async (
  plantId: string
): Promise<ApiResponse<PlantDetails>> => {
  validateEnvironmentForApiCalls();
  
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.PLANT_DETAILS}/${plantId}`,
      {
        timeout: TIMEOUTS.PLANT_DETAILS,
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': API_KEYS.PLANT_ID
        }
      }
    );

    return {
      success: true,
      data: response.data,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'plant.id API'
      }
    };
  } catch (error) {
    // Handle API errors with detailed error codes and messages
    const apiError: ApiError = {
      code: ApiErrorCode.UNKNOWN_ERROR,
      message: 'An unknown error occurred while fetching plant details',
      details: error instanceof Error ? error.message : String(error)
    };

    if (error.response) {
      apiError.code = error.response.status === 401 
        ? ApiErrorCode.AUTHENTICATION_ERROR 
        : ApiErrorCode.API_ERROR;
      apiError.message = `API Error: ${error.response.status} ${error.response.statusText}`;
      apiError.details = JSON.stringify(error.response.data);
    } else if (error.request) {
      apiError.code = ApiErrorCode.NETWORK_ERROR;
      apiError.message = 'Network error: No response received from server';
    } else if (error.message?.includes('timeout')) {
      apiError.code = ApiErrorCode.TIMEOUT_ERROR;
      apiError.message = 'Request timed out. Please try again.';
    } else if (error.message?.includes('configuration')) {
      apiError.code = ApiErrorCode.CONFIGURATION_ERROR;
      apiError.message = error.message;
    }

    return {
      success: false,
      error: apiError
    };
  }
};
