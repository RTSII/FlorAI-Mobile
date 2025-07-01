/**
 * API Configuration
 * Contains base URLs, endpoints, and other configuration for API services
 */

// API Base URLs
export const API_BASE_URL = 'https://api.florai.example.com/v1';
export const PLANT_ID_API_URL = 'https://plant-id-api.example.com/v1';

// Endpoints
export const ENDPOINTS = {
  // Plant identification endpoints
  IDENTIFY: '/identify',
  PLANT_DETAILS: '/plants',
  PLANT_CARE: '/plants/care',
  
  // User endpoints
  USER_PLANTS: '/user/plants',
  USER_COLLECTIONS: '/user/collections',
  
  // Search endpoints
  SEARCH: '/search',
};

// Request timeouts (in milliseconds)
export const TIMEOUTS = {
  IDENTIFY: 30000, // Plant identification can take longer
  DEFAULT: 10000,
  UPLOAD: 60000, // Image uploads can take longer
  QUICK: 5000, // For lightweight requests
};

// Retry configuration
export const MAX_RETRIES = 3;
export const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  PLANT_DETAILS: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH_RESULTS: 60 * 60 * 1000, // 1 hour
  USER_DATA: 5 * 60 * 1000, // 5 minutes
};

// Request batch sizes
export const BATCH_SIZES = {
  IMAGES: 5, // Maximum number of images to send in one identification request
  SEARCH_RESULTS: 20, // Default page size for search results
};

// API Keys (these would be loaded from environment variables in a real app)
// For development purposes only - in production, use secure environment variables
export const API_KEYS = {
  PLANT_ID: process.env.PLANT_ID_API_KEY || 'DEMO_API_KEY',
};
