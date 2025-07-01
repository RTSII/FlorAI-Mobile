/**
 * Plant Identification Service
 * Handles API requests related to plant identification
 */

import { apiClient } from '../apiClient.ts';
import { ENDPOINTS, TIMEOUTS, PLANT_ID_API_URL, API_KEYS } from '../config.ts';
import { 
  PlantIdentificationRequest, 
  PlantIdentificationResponse,
  ApiResponse
} from '../types.ts';

/**
 * Identify plants from images
 * @param request The plant identification request containing images
 * @returns Plant identification results
 */
export const identifyPlant = async (
  request: PlantIdentificationRequest
): Promise<ApiResponse<PlantIdentificationResponse>> => {
  // For plant identification, we use a different base URL and API key
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Api-Key': API_KEYS.PLANT_ID,
    },
  };

  // Construct the full URL for the plant ID API
  const url = `${PLANT_ID_API_URL}${ENDPOINTS.IDENTIFY}`;
  
  try {
    // Use the raw fetch API here since we're not using the standard API_BASE_URL
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data as PlantIdentificationResponse,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: response.headers.get('X-Request-ID') || crypto.randomUUID(),
      },
    };
  } catch (error: any) {
    return {
      error: {
        code: error.code || 'IDENTIFICATION_ERROR',
        message: error.message || 'Failed to identify plant',
      },
    };
  }
};

/**
 * Get similar plants based on an identified plant
 * @param plantId The ID of the identified plant
 * @returns Similar plants
 */
export const getSimilarPlants = async (
  plantId: string
): Promise<ApiResponse<PlantIdentificationResponse>> => {
  return apiClient.get<PlantIdentificationResponse>(
    `${ENDPOINTS.PLANT_DETAILS}/${plantId}/similar`,
    {},
    {},
    TIMEOUTS.DEFAULT
  );
};
