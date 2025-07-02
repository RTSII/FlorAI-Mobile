/**
 * Environment Configuration
 * Centralized management of environment variables for the FlorAI application
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Type definitions for environment variables
interface EnvironmentVariables {
  // API Keys
  PLANT_ID_API_KEY: string;
  PLANT_ID_API_URL: string;
  
  // App Configuration
  APP_ENV: 'development' | 'staging' | 'production';
  DEBUG_MODE: boolean;
}

// Default values for development (never use sensitive keys here)
const developmentDefaults: EnvironmentVariables = {
  PLANT_ID_API_KEY: 'DEVELOPMENT_MODE_KEY',
  PLANT_ID_API_URL: 'https://plant-id-api.example.com/v1',
  APP_ENV: 'development',
  DEBUG_MODE: true,
};

// Helper function to safely access Expo config values
const getExpoConfigValue = (key: string): string | undefined => {
  if (Platform.OS !== 'web') {
    // In React Native environment
    try {
      // @ts-expect-error - Constants.manifest is available in Expo
      return Constants.manifest?.extra?.[key] || Constants.expoConfig?.extra?.[key];
    } catch (e) {
      console.warn(`Error accessing Expo config for ${key}:`, e);
      return undefined;
    }
  }
  return undefined;
};

// Get environment variables from Expo Constants or process.env
// with fallbacks to development defaults
export const env: EnvironmentVariables = {
  // API Keys
  PLANT_ID_API_KEY: getExpoConfigValue('PLANT_ID_API_KEY') || 
    (typeof process !== 'undefined' ? process.env.PLANT_ID_API_KEY : undefined) || 
    developmentDefaults.PLANT_ID_API_KEY,
  
  PLANT_ID_API_URL: getExpoConfigValue('PLANT_ID_API_URL') || 
    (typeof process !== 'undefined' ? process.env.PLANT_ID_API_URL : undefined) || 
    developmentDefaults.PLANT_ID_API_URL,
  
  // App Configuration
  APP_ENV: (getExpoConfigValue('APP_ENV') as EnvironmentVariables['APP_ENV']) || 
    (typeof process !== 'undefined' ? 
      (process.env.APP_ENV as EnvironmentVariables['APP_ENV'])
      : undefined) || 
    developmentDefaults.APP_ENV,
  
  DEBUG_MODE: getExpoConfigValue('DEBUG_MODE') === 'true' || 
    (typeof process !== 'undefined' ? process.env.DEBUG_MODE === 'true' : false) || 
    developmentDefaults.DEBUG_MODE,
};

/**
 * Validate that required environment variables are set
 * Logs warnings for missing variables in development mode
 * Throws errors for missing critical variables in production
 */
export const validateEnvironment = (): void => {
  const missingVars: string[] = [];
  
  // Check for critical API keys
  if (
    env.PLANT_ID_API_KEY === developmentDefaults.PLANT_ID_API_KEY && 
    env.APP_ENV !== 'development'
  ) {
    missingVars.push('PLANT_ID_API_KEY');
  }
  
  // Handle missing variables
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (env.APP_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
};

// Export a function to get environment variables safely
export const getEnv = <K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] => {
  return env[key];
};

// Export a function to check if we're in development mode
export const isDevelopment = (): boolean => env.APP_ENV === 'development';
export const isProduction = (): boolean => env.APP_ENV === 'production';
export const isStaging = (): boolean => env.APP_ENV === 'staging';
