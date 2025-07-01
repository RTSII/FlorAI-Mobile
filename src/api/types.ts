/**
 * API Types
 * Contains TypeScript interfaces for API requests and responses
 */

// Plant identification types
export interface PlantIdentificationRequest {
  images: string[]; // Base64 encoded images
  organs?: string[]; // Plant organs visible in the images (e.g., "leaf", "flower", "fruit")
  includeRelatedSpecies?: boolean;
}

export interface PlantIdentificationResult {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  probability: number; // 0-1 confidence score
  similarSpecies?: Array<{
    scientificName: string;
    commonName: string;
    probability: number;
  }>;
}

export interface PlantIdentificationResponse {
  results: PlantIdentificationResult[];
  isSuccessful: boolean;
  executionTimeMs: number;
}

// Plant details types
export interface PlantDetails {
  id: string;
  scientificName: string;
  commonNames: string[];
  family: string;
  description: string;
  origin: string[];
  climate: string[];
  careLevel: 'easy' | 'medium' | 'difficult';
  images: {
    thumbnail: string;
    regular: string;
    fullsize: string;
  };
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
}

// Plant care types
export interface PlantCareDetails {
  plantId: string;
  watering: {
    frequency: string;
    amount: string;
    notes: string;
  };
  light: {
    level: 'low' | 'medium' | 'bright' | 'direct';
    notes: string;
  };
  soil: {
    type: string;
    pH: string;
    notes: string;
  };
  temperature: {
    min: number; // Celsius
    max: number; // Celsius
    ideal: number; // Celsius
    notes: string;
  };
  humidity: {
    level: 'low' | 'medium' | 'high';
    percentage: string;
    notes: string;
  };
  fertilizing: {
    frequency: string;
    type: string;
    notes: string;
  };
  pruning: {
    frequency: string;
    notes: string;
  };
  propagation: {
    methods: string[];
    notes: string;
  };
  commonProblems: Array<{
    name: string;
    symptoms: string[];
    solutions: string[];
  }>;
}

// Search types
export interface PlantSearchRequest {
  query: string;
  filters?: {
    careLevel?: ('easy' | 'medium' | 'difficult')[];
    light?: ('low' | 'medium' | 'bright' | 'direct')[];
    wateringFrequency?: ('low' | 'medium' | 'high')[];
    petFriendly?: boolean;
    airPurifying?: boolean;
  };
  page?: number;
  pageSize?: number;
}

export interface PlantSearchResponse {
  results: PlantSearchResult[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlantSearchResult {
  id: string;
  scientificName: string;
  commonName: string;
  thumbnail: string;
  careLevel: 'easy' | 'medium' | 'difficult';
  light: 'low' | 'medium' | 'bright' | 'direct';
  wateringFrequency: 'low' | 'medium' | 'high';
  petFriendly: boolean;
  airPurifying: boolean;
}

// API Error Code enum for standardized error handling
export enum ApiErrorCode {
  // HTTP Status Code Errors
  HTTP_400 = 'HTTP_400',
  HTTP_401 = 'HTTP_401',
  HTTP_403 = 'HTTP_403',
  HTTP_404 = 'HTTP_404',
  HTTP_408 = 'HTTP_408',
  HTTP_409 = 'HTTP_409',
  HTTP_422 = 'HTTP_422',
  HTTP_429 = 'HTTP_429',
  HTTP_500 = 'HTTP_500',
  HTTP_502 = 'HTTP_502',
  HTTP_503 = 'HTTP_503',
  HTTP_504 = 'HTTP_504',
  
  // Authentication Errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  
  // Sensor and Device Errors
  SENSOR_ACCESS_ERROR = 'SENSOR_ACCESS_ERROR',
  CAMERA_ERROR = 'CAMERA_ERROR',
  IMAGE_PROCESSING_ERROR = 'IMAGE_PROCESSING_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  
  // Network/Client Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  ABORTED = 'ABORTED',
  OFFLINE = 'OFFLINE',
  PARSE_ERROR = 'PARSE_ERROR',
  
  // Business Logic Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Plant Identification Specific Errors
  NO_PLANT_DETECTED = 'NO_PLANT_DETECTED',
  LOW_CONFIDENCE_MATCH = 'LOW_CONFIDENCE_MATCH',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  IMAGE_TOO_SMALL = 'IMAGE_TOO_SMALL',
  
  // Fallback
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// API Error types
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  status?: number;
  timestamp: string;
}

// API Request Options
export interface ApiRequestOptions {
  timeoutMs?: number;
  retries?: number;
  _retries?: number; // For internal use
  requestId?: string;
  abortPrevious?: boolean;
  headers?: Record<string, string>;
}

// API Request Metadata
export interface ApiRequestMeta {
  timestamp: string;
  requestId: string;
  retryCount?: number;
  endpoint?: string;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: ApiRequestMeta;
}
