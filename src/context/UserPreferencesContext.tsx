/**
 * User Preferences Context
 * 
 * Provides access to user preferences including data consent settings
 * throughout the application.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Consent storage keys
const CONSENT_STORAGE_PREFIX = '@FlorAI:consent_';
const CONSENT_COMPLETED_KEY = '@FlorAI:consent_completed';

// User preferences interface
interface UserPreferences {
  dataConsent: {
    basic_identification: boolean;
    model_training: boolean;
    exif_metadata: boolean;
    location_data: boolean;
    advanced_sensors: boolean;
    [key: string]: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    reminders: boolean;
    updates: boolean;
    tips: boolean;
  };
}

// Default preferences
const defaultPreferences: UserPreferences = {
  dataConsent: {
    basic_identification: true, // Required for app functionality
    model_training: false,
    exif_metadata: false,
    location_data: false,
    advanced_sensors: false,
  },
  theme: 'system',
  notifications: {
    enabled: true,
    reminders: true,
    updates: true,
    tips: true,
  },
};

// Context interface
interface UserPreferencesContextType {
  preferences: UserPreferences;
  isConsentCompleted: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  updateConsentOption: (optionId: string, value: boolean) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

// Create context
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Provider component
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isConsentCompleted, setIsConsentCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Check if consent flow was completed
        const consentCompleted = await AsyncStorage.getItem(CONSENT_COMPLETED_KEY);
        setIsConsentCompleted(consentCompleted === 'true');

        // Load consent settings
        const dataConsent = { ...defaultPreferences.dataConsent };
        for (const key of Object.keys(dataConsent)) {
          const value = await AsyncStorage.getItem(`${CONSENT_STORAGE_PREFIX}${key}`);
          if (value !== null) {
            dataConsent[key] = value === 'true';
          }
        }

        // Load theme preference
        const theme = await AsyncStorage.getItem('@FlorAI:theme');
        
        // Load notification preferences
        const notificationsStr = await AsyncStorage.getItem('@FlorAI:notifications');
        const notifications = notificationsStr 
          ? JSON.parse(notificationsStr) 
          : defaultPreferences.notifications;

        // Update state with loaded preferences
        setPreferences({
          dataConsent,
          theme: (theme as 'light' | 'dark' | 'system') || defaultPreferences.theme,
          notifications,
        });
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Update preferences
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...preferences };

      // Update data consent if provided
      if (updates.dataConsent) {
        newPreferences.dataConsent = {
          ...newPreferences.dataConsent,
          ...updates.dataConsent,
        };

        // Save each consent option
        for (const [key, value] of Object.entries(newPreferences.dataConsent)) {
          await AsyncStorage.setItem(`${CONSENT_STORAGE_PREFIX}${key}`, value.toString());
        }
      }

      // Update theme if provided
      if (updates.theme) {
        newPreferences.theme = updates.theme;
        await AsyncStorage.setItem('@FlorAI:theme', updates.theme);
      }

      // Update notifications if provided
      if (updates.notifications) {
        newPreferences.notifications = {
          ...newPreferences.notifications,
          ...updates.notifications,
        };
        await AsyncStorage.setItem('@FlorAI:notifications', JSON.stringify(newPreferences.notifications));
      }

      // Update state
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Update a single consent option
  const updateConsentOption = async (optionId: string, value: boolean) => {
    try {
      // Don't allow changing required options
      if (optionId === 'basic_identification') return;

      // Update state
      const newPreferences = { 
        ...preferences,
        dataConsent: {
          ...preferences.dataConsent,
          [optionId]: value,
        }
      };
      
      setPreferences(newPreferences);

      // Save to storage
      await AsyncStorage.setItem(`${CONSENT_STORAGE_PREFIX}${optionId}`, value.toString());
    } catch (error) {
      console.error('Error updating consent option:', error);
      throw error;
    }
  };

  // Reset preferences to defaults
  const resetPreferences = async () => {
    try {
      // Reset state
      setPreferences(defaultPreferences);

      // Clear storage (except for required consent)
      const keys = await AsyncStorage.getAllKeys();
      const preferencesKeys = keys.filter(key => 
        key.startsWith('@FlorAI:') && 
        key !== `${CONSENT_STORAGE_PREFIX}basic_identification`
      );
      
      await AsyncStorage.multiRemove(preferencesKeys);

      // Set required consent
      await AsyncStorage.setItem(
        `${CONSENT_STORAGE_PREFIX}basic_identification`, 
        'true'
      );
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    preferences,
    isConsentCompleted,
    updatePreferences,
    updateConsentOption,
    resetPreferences,
  };

  // Show loading state or children
  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook for using the context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  return context;
};

// Helper hook for checking specific consent
export const useDataConsent = (optionId: string) => {
  const { preferences } = useUserPreferences();
  return preferences.dataConsent[optionId] || false;
};

// Helper hook for checking if all advanced features are consented
export const useAdvancedFeaturesConsent = () => {
  const { preferences } = useUserPreferences();
  const { exif_metadata, location_data, advanced_sensors } = preferences.dataConsent;
  
  return {
    allConsented: exif_metadata && location_data && advanced_sensors,
    anyConsented: exif_metadata || location_data || advanced_sensors,
    exifConsented: exif_metadata,
    locationConsented: location_data,
    sensorsConsented: advanced_sensors,
  };
};
