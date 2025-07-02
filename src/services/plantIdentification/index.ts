/**
 * Plant Identification Service
 * Handles plant identification using the API client
 * Enhanced with better error handling and context integration
 * Uses centralized environment configuration for API keys
 */

import { apiClient } from '../../api/apiClient.ts';
import { ENDPOINTS, TIMEOUTS, API_KEYS } from '../../api/config.ts';
import { 
  PlantIdentificationResponse,
  PlantIdentificationResult,
  ApiResponse,
  ApiErrorCode,
  ApiError
} from '../../api/types.ts';
import { Plant, AppAction } from '../../types/state.ts';
import { validateEnvironment } from '../../config/env.ts';

/**
 * Convert image URI to base64
 * @param uri Image URI (file:// or content://)
 * @returns Promise resolving to base64 string
 */
export const imageUriToBase64 = async (uri: string): Promise<string> => {
  try {
    // For React Native, we need to fetch the image and convert it to base64
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data:image/jpeg;base64, prefix
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};

/**
 * Identify plant from image with enhanced error handling
 * @param imageUri URI of the captured image
 * @returns Promise resolving to plant identification results
 */
/**
 * Validates that required environment variables are set before making API calls
 * @returns true if validation passes, false otherwise
 */
const validateEnvironmentForApiCalls = (): boolean => {
  try {
    validateEnvironment();
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};

export const identifyPlant = async (
  imageUri: string
): Promise<ApiResponse<PlantIdentificationResponse>> => {
  try {
    // Validate environment variables before making API calls
    if (!validateEnvironmentForApiCalls()) {
      return {
        error: {
          code: ApiErrorCode.CONFIGURATION_ERROR,
          message: 'API configuration error. Please check environment variables.',
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    if (!imageUri) {
      throw new Error('No image provided for plant identification');
    }
    
    // Convert image to base64
    const base64Image = await imageUriToBase64(imageUri);
    
    // Prepare request payload
    const requestData = {
      images: [base64Image],
      organs: ['auto'], // Auto-detect plant organs
      includeRelatedSpecies: true,
      similar_images: true, // Get similar images for better accuracy
      details: ['common_names', 'url', 'description', 'taxonomy', 'rank', 'gbif_id', 'inaturalist_id', 'image', 'synonyms', 'edible_parts', 'watering', 'propagation_methods']
    } as unknown as Record<string, unknown>; // Cast to match API client parameter type
    
    // Make API request with custom options for plant ID API
    // Use API key from centralized config, which is already loaded in API_KEYS
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Api-Key': API_KEYS.PLANT_ID,
      },
    };
    
    // Use the plant identification API
    const response = await apiClient.post<PlantIdentificationResponse>(
      ENDPOINTS.IDENTIFY,
      requestData,
      options,
      TIMEOUTS.IDENTIFY
    );
    
    // Additional validation of response data
    if (!response.data) {
      return {
        error: {
          code: ApiErrorCode.PARSE_ERROR,
          message: 'Unable to process the server response. Please try again.',
          details: { source: 'response_validation' },
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    if (!response.data.results || response.data.results.length === 0) {
      return {
        error: {
          code: ApiErrorCode.NO_PLANT_DETECTED,
          message: 'No plants were identified in this image. Please try a clearer photo with better lighting.',
          details: { source: 'empty_results' },
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    // Check for low confidence results
    const highestConfidenceResult = response.data.results[0];
    if (highestConfidenceResult && highestConfidenceResult.probability < 0.5) {
      console.warn('Low confidence plant identification:', highestConfidenceResult.probability);
      // Still return the results but include a warning in the metadata
      return {
        data: response.data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: response.meta?.requestId || `plant-id-${Date.now()}`,
          warning: 'Low confidence identification. Results may not be accurate.',
          confidenceLevel: highestConfidenceResult.probability,
          endpoint: response.meta?.endpoint,
          retryCount: response.meta?.retryCount
        }
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error identifying plant:', error);
    
    // Enhanced error handling with more specific error codes and detailed information
    let apiError: ApiError;
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (error instanceof TypeError && errorMessage.includes('Network')) {
      apiError = {
        code: ApiErrorCode.NETWORK_ERROR,
        message: 'Network connection error. Please check your internet connection and try again.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('timeout')) {
      apiError = {
        code: ApiErrorCode.TIMEOUT,
        message: 'The request timed out. The plant identification service may be experiencing high traffic. Please try again later.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('No image')) {
      apiError = {
        code: ApiErrorCode.INVALID_IMAGE_FORMAT,
        message: 'No valid image was provided. Please take a new photo with good lighting and focus.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('too large')) {
      apiError = {
        code: ApiErrorCode.IMAGE_TOO_LARGE,
        message: 'The image file is too large. Please use a smaller image or reduce its resolution.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('format')) {
      apiError = {
        code: ApiErrorCode.INVALID_IMAGE_FORMAT,
        message: 'The image format is not supported. Please use a JPEG or PNG image.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else {
      apiError = {
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred during plant identification. Please try again.',
        details: { originalError: errorMessage },
        timestamp,
      };
    }
    
    return { error: apiError };
  }
};

/**
 * Get detailed information about a plant with enhanced error handling
 * @param plantId ID of the identified plant
 * @returns Promise resolving to plant details
 */
// Define the PlantDetails interface for type safety
export interface PlantDetails {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  description?: string;
  careInstructions?: {
    watering?: string;
    sunlight?: string;
    soil?: string;
  };
  images?: string[];
}

/**
 * Get detailed information about a specific plant
 * @param plantId ID of the identified plant
 * @returns Promise resolving to plant details
 */
export const getPlantDetails = async (plantId: string): Promise<ApiResponse<PlantDetails>> => {
  try {
    // Validate environment variables before making API calls
    if (!validateEnvironmentForApiCalls()) {
      return {
        error: {
          code: ApiErrorCode.CONFIGURATION_ERROR,
          message: 'API configuration error. Please check environment variables.',
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    if (!plantId) {
      throw new Error('No plant ID provided for details lookup');
    }
    
    // Define response type inline for clarity
    interface PlantDetailsResponse {
      plant: PlantDetails;
    }
    
    const response = await apiClient.get<PlantDetailsResponse>(`/plants/${plantId}`,
      {},
      {
        headers: {
          'Accept': 'application/json',
          'Api-Key': API_KEYS.PLANT_ID, // Using the same API key as plant identification
        },
      },
      TIMEOUTS.DEFAULT
    );
    
    // Additional validation of response data
    if (!response.data) {
      return {
        error: {
          code: ApiErrorCode.PARSE_ERROR,
          message: 'Unable to process the server response. Please try again.',
          details: { source: 'response_validation' },
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    if (!response.data.plant) {
      return {
        error: {
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          message: 'Plant details not found. The plant may not exist in our database or may have been removed.',
          details: { plantId },
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    // Transform the response to match the expected PlantDetails type
    // We've already checked that response.data exists and has a plant property above
    return {
      data: response.data!.plant
    };
  } catch (error) {
    console.error('Error getting plant details:', error);

    // Enhanced error handling with more specific error codes and detailed information
    let apiError: ApiError;
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (error instanceof TypeError && errorMessage.includes('Network')) {
      apiError = {
        code: ApiErrorCode.NETWORK_ERROR,
        message: 'Network connection error. Please check your internet connection and try again.',
        details: { originalError: errorMessage, plantId },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('timeout')) {
      apiError = {
        code: ApiErrorCode.TIMEOUT,
        message: 'The request timed out. The plant database service may be experiencing high traffic. Please try again later.',
        details: { originalError: errorMessage, plantId },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('No plant ID')) {
      apiError = {
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'No plant ID was provided. Please select a plant first.',
        details: { originalError: errorMessage },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('404')) {
      apiError = {
        code: ApiErrorCode.RESOURCE_NOT_FOUND,
        message: 'The requested plant information could not be found. It may have been removed from our database.',
        details: { originalError: errorMessage, plantId },
        timestamp,
      };
    } else if (error instanceof Error && errorMessage.includes('403')) {
      apiError = {
        code: ApiErrorCode.AUTH_INVALID,
        message: 'Access to this plant information is restricted. Your API key may not have sufficient permissions.',
        details: { originalError: errorMessage, plantId },
        timestamp,
      };
    } else {
      apiError = {
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while retrieving plant details. Please try again.',
        details: { originalError: errorMessage, plantId },
        timestamp,
      };
    }

    return { error: apiError };
  }
};

/**
 * Convert plant identification result to app Plant type
 * @param result The plant identification result from API
 * @returns Plant object formatted for the app state
 */
export const mapResultToPlant = (result: PlantIdentificationResult): Plant => {
  return {
    id: result.id || `plant-${Date.now()}`,
    name: result.scientificName, // Use scientific name as fallback
    scientificName: result.scientificName,
    commonName: result.commonName || 'Unknown',
    family: result.family || 'Unknown',
    probability: result.probability || 0,
    identifiedAt: new Date().toISOString(),
    imageUrl: '', // Will be populated from separate API if available
    description: 'No description available', // Will be populated from separate API if available
    careInstructions: {
      wateringFrequency: 'Regular watering recommended',
      sunlightNeeds: 'Moderate sunlight recommended',
      soilType: 'Well-draining soil recommended',
    },
  };
};

/**
 * Save identified plant to app state
 * @param plant The plant to save
 * @param dispatch The app context dispatch function
 */
export const saveIdentifiedPlant = (plant: Plant, dispatch: React.Dispatch<AppAction>): void => {
  try {
    // Add to identified plants list
    dispatch({ type: 'ADD_IDENTIFIED_PLANT', payload: plant });
  } catch (error) {
    console.error('Error saving identified plant:', error);
  }
};

// Export the enhanced plant identification service
export const plantIdentificationService = {
  identifyPlant,
  getPlantDetails,
  imageUriToBase64,
  mapResultToPlant,
  saveIdentifiedPlant,
};

export default plantIdentificationService;
