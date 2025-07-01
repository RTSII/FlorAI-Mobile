/**
 * Plant Data Service
 * Handles API requests related to plant details, care information, and search
 */

import { apiClient } from '../apiClient.ts';
import { ENDPOINTS, TIMEOUTS, CACHE_DURATIONS } from '../config.ts';
import { 
  PlantDetails,
  PlantCareDetails,
  PlantSearchRequest,
  PlantSearchResponse,
  ApiResponse
} from '../types.ts';

// Simple in-memory cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache: Record<string, CacheItem<any>> = {};

/**
 * Get data from cache if available and not expired
 * @param key Cache key
 * @returns Cached data or null if not found or expired
 */
function getFromCache<T>(key: string): T | null {
  const item = cache[key];
  if (!item) return null;
  
  const now = Date.now();
  if (now > item.expiresAt) {
    // Cache expired, remove it
    delete cache[key];
    return null;
  }
  
  return item.data as T;
}

/**
 * Save data to cache
 * @param key Cache key
 * @param data Data to cache
 * @param duration Cache duration in milliseconds
 */
function saveToCache<T>(key: string, data: T, duration: number): void {
  const now = Date.now();
  cache[key] = {
    data,
    timestamp: now,
    expiresAt: now + duration,
  };
}

/**
 * Get plant details by ID
 * @param plantId The ID of the plant
 * @param forceRefresh Whether to bypass cache and force a fresh API call
 * @returns Plant details
 */
export const getPlantDetails = async (
  plantId: string,
  forceRefresh = false
): Promise<ApiResponse<PlantDetails>> => {
  // Check cache first if not forcing refresh
  const cacheKey = `plant_details_${plantId}`;
  if (!forceRefresh) {
    const cachedData = getFromCache<ApiResponse<PlantDetails>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Fetch from API
  const response = await apiClient.get<PlantDetails>(
    `${ENDPOINTS.PLANT_DETAILS}/${plantId}`,
    {},
    {},
    TIMEOUTS.DEFAULT
  );

  // Cache successful responses
  if (response.data && !response.error) {
    saveToCache(cacheKey, response, CACHE_DURATIONS.PLANT_DETAILS);
  }

  return response;
};

/**
 * Get plant care information by plant ID
 * @param plantId The ID of the plant
 * @param forceRefresh Whether to bypass cache and force a fresh API call
 * @returns Plant care details
 */
export const getPlantCareDetails = async (
  plantId: string,
  forceRefresh = false
): Promise<ApiResponse<PlantCareDetails>> => {
  // Check cache first if not forcing refresh
  const cacheKey = `plant_care_${plantId}`;
  if (!forceRefresh) {
    const cachedData = getFromCache<ApiResponse<PlantCareDetails>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Fetch from API
  const response = await apiClient.get<PlantCareDetails>(
    `${ENDPOINTS.PLANT_CARE}/${plantId}`,
    {},
    {},
    TIMEOUTS.DEFAULT
  );

  // Cache successful responses
  if (response.data && !response.error) {
    saveToCache(cacheKey, response, CACHE_DURATIONS.PLANT_DETAILS);
  }

  return response;
};

/**
 * Search for plants based on query and filters
 * @param request Search request with query and optional filters
 * @returns Search results
 */
export const searchPlants = async (
  request: PlantSearchRequest
): Promise<ApiResponse<PlantSearchResponse>> => {
  // For search, we use query parameters
  const params = {
    query: request.query,
    page: request.page || 1,
    pageSize: request.pageSize || 20,
    ...request.filters,
  };

  // Search results are cached with the full query string as the key
  const cacheKey = `search_${JSON.stringify(params)}`;
  const cachedData = getFromCache<ApiResponse<PlantSearchResponse>>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from API
  const response = await apiClient.get<PlantSearchResponse>(
    ENDPOINTS.SEARCH,
    params,
    {},
    TIMEOUTS.DEFAULT
  );

  // Cache successful responses
  if (response.data && !response.error) {
    saveToCache(cacheKey, response, CACHE_DURATIONS.SEARCH_RESULTS);
  }

  return response;
};
