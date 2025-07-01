import { apiClient } from '../api/client';
import { ApiErrorCode } from '../api/types';

/**
 * User consent preferences interface
 */
export interface UserConsentPreferences {
  locationConsent: boolean;
  notificationsConsent: boolean;
  dataUsageConsent: boolean;
  termsAccepted: boolean;
}

/**
 * User data interface
 */
export interface UserData {
  id: string;
  email: string;
  name: string;
  privacyConsent?: {
    location: boolean;
    notifications: boolean;
    dataUsage: boolean;
    terms: boolean;
    lastUpdated: string;
  };
  plants?: Array<{
    id: string;
    name: string;
    species: string;
    addedAt: string;
  }>;
}

/**
 * Save user consent preferences
 * @param consentPreferences User consent preferences
 * @returns Promise with the updated user data
 */
export const saveUserConsent = async (consentPreferences: UserConsentPreferences): Promise<UserData> => {
  try {
    const response = await apiClient.post('/auth/consent', {
      locationConsent: consentPreferences.locationConsent,
      notificationsConsent: consentPreferences.notificationsConsent,
      dataUsageConsent: consentPreferences.dataUsageConsent,
    });

    return response.data.user;
  } catch (error: any) {
    console.error('Error saving user consent:', error);
    throw {
      message: error.message || 'Failed to save consent preferences',
      code: error.code || ApiErrorCode.UNKNOWN_ERROR,
    };
  }
};

/**
 * Get user data including all personal information
 * @returns Promise with the user data
 */
export const getUserData = async (): Promise<UserData> => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  } catch (error: any) {
    console.error('Error getting user data:', error);
    throw {
      message: error.message || 'Failed to retrieve user data',
      code: error.code || ApiErrorCode.UNKNOWN_ERROR,
    };
  }
};

/**
 * Delete user account and all associated data
 * @returns Promise with success status
 */
export const deleteUserAccount = async (): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete('/auth/account');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    throw {
      message: error.message || 'Failed to delete account',
      code: error.code || ApiErrorCode.UNKNOWN_ERROR,
    };
  }
};

/**
 * Update user profile information
 * @param userData User data to update
 * @returns Promise with the updated user data
 */
export const updateUserProfile = async (userData: Partial<UserData>): Promise<UserData> => {
  try {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data.user;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw {
      message: error.message || 'Failed to update profile',
      code: error.code || ApiErrorCode.UNKNOWN_ERROR,
    };
  }
};

/**
 * Request data deletion for specific data types
 * @param dataTypes Array of data types to delete (e.g., ['photos', 'location'])
 * @returns Promise with success status
 */
export const requestDataDeletion = async (dataTypes: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post('/auth/data-deletion', { dataTypes });
    return response.data;
  } catch (error: any) {
    console.error('Error requesting data deletion:', error);
    throw {
      message: error.message || 'Failed to request data deletion',
      code: error.code || ApiErrorCode.UNKNOWN_ERROR,
    };
  }
};
