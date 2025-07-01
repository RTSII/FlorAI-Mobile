/**
 * Types for the FlorAI application state
 */

// Plant data types
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  commonName?: string;
  family?: string;
  probability?: number;
  identifiedAt?: string;
  imageUrl?: string;
  description?: string;
  careInstructions?: PlantCareInstructions;
}

export interface PlantCareInstructions {
  wateringFrequency: string;
  sunlightNeeds: string;
  soilType: string;
  fertilizingSchedule?: string;
  temperatureRange?: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  humidity?: string;
  additionalNotes?: string;
}

// User collection types
export interface UserPlant extends Plant {
  addedDate: string;
  lastWatered?: string;
  nextWateringDate?: string;
  location?: string;
  notes?: string;
  healthStatus?: 'healthy' | 'needsAttention' | 'sick';
}

// App state types
export interface AppState {
  theme: 'light' | 'dark' | 'system';
  userPlants: UserPlant[];
  identifiedPlants: Plant[]; // Renamed from recentlyIdentified for consistency
  isLoading: boolean;
  error: string | null;
}

export type ThemeType = 'light' | 'dark' | 'system';

// Action types
export type AppAction =
  | { type: 'SET_THEME'; payload: ThemeType }
  | { type: 'SET_USER_PLANTS'; payload: UserPlant[] }
  | { type: 'ADD_USER_PLANT'; payload: UserPlant }
  | { type: 'REMOVE_USER_PLANT'; payload: string } // plant id
  | { type: 'UPDATE_USER_PLANT'; payload: UserPlant }
  | { type: 'SET_IDENTIFIED_PLANTS'; payload: Plant[] }
  | { type: 'ADD_IDENTIFIED_PLANT'; payload: Plant }
  | { type: 'CLEAR_IDENTIFIED_PLANTS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
