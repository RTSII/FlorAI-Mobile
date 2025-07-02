/**
 * Plant Identification Service Types
 * Type definitions for the plant identification service
 */

import { ApiResponse } from '../../api/types';

/**
 * Plant Details interface for type safety
 */
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
  watering?: string;
  sunlight?: string;
  soil?: string;
  images?: string[];
}

/**
 * Plant identification confidence levels
 */
export enum ConfidenceLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Plant identification metadata
 */
export interface PlantIdentificationMetadata {
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  processingTimeMs: number;
  timestamp: string;
  source: string;
  warnings?: string[];
}

/**
 * Plant identification options
 */
export interface PlantIdentificationOptions {
  includeRelatedImages?: boolean;
  includeGbif?: boolean;
  includeSynonyms?: boolean;
  noReject?: boolean;
}

/**
 * Plant identification result from API
 */
export interface PlantIdentificationResult {
  id: string;
  plant_name: string;
  plant_details: {
    common_names?: string[];
    scientific_name: string;
    structured_name: {
      genus: string;
      species: string;
    };
    family?: {
      name: string;
    };
    probability: number;
  };
  similar_images?: Array<{
    id: string;
    url: string;
    similarity: number;
  }>;
}

/**
 * Plant identification response from API
 */
export interface PlantIdentificationResponse {
  results: PlantIdentificationResult[];
  is_plant: boolean;
  is_healthy?: boolean;
  modifiers?: string[];
}

/**
 * Type for plant identification service response
 */
export type PlantIdentificationServiceResponse = ApiResponse<PlantIdentificationResponse>;

/**
 * Type for plant details service response
 */
export type PlantDetailsServiceResponse = ApiResponse<PlantDetails>;
