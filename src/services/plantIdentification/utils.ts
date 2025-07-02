/**
 * Plant Identification Service Utils
 * Helper functions for the plant identification service
 */

import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

import { Plant, AppAction } from '../../types/state';
import { ConfidenceLevel, PlantIdentificationResult } from './types';

/**
 * Convert image URI to base64
 * @param uri Image URI to convert
 * @returns Promise resolving to base64 string
 */
export const imageUriToBase64 = async (uri: string): Promise<string | null> => {
  try {
    // Handle different URI formats based on platform
    const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Determine confidence level based on probability
 * @param probability Probability value (0-1)
 * @returns Confidence level enum
 */
export const getConfidenceLevel = (probability: number): ConfidenceLevel => {
  if (probability >= 0.85) {
    return ConfidenceLevel.HIGH;
  } if (probability >= 0.6) {
    return ConfidenceLevel.MEDIUM;
  }
  return ConfidenceLevel.LOW;
};

/**
 * Convert plant identification result to app Plant type
 * @param result The plant identification result from API
 * @returns Plant object formatted for the app state
 */
export const mapResultToPlant = (result: PlantIdentificationResult): Plant => {
  const confidence = result.probability || 0;
  
  return {
    id: result.id || `plant-${Date.now()}`,
    scientificName: result.plant_name || 'Unknown species',
    commonName: result.plant_details?.common_names?.[0] || 'Unknown',
    family: result.plant_details?.taxonomy?.family || 'Unknown',
    probability: confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    imageUrl: result.similar_images?.[0]?.url || '',
    thumbnailUrl: result.similar_images?.[0]?.url_small || '',
    description: result.plant_details?.wiki_description?.value || '',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Save identified plant to app state
 * @param plant The plant to save
 * @param dispatch The app context dispatch function
 */
export const saveIdentifiedPlant = (plant: Plant, dispatch: React.Dispatch<AppAction>): void => {
  dispatch({
    type: 'ADD_IDENTIFIED_PLANT',
    payload: plant
  });
};
