import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { ConsentSettings, ConsentAuditEntry, DataUsageStats } from '../types/consent';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContext';

interface UserConsentContextType {
  consentSettings: ConsentSettings | null;
  isLoading: boolean;
  error: Error | null;
  auditLog: ConsentAuditEntry[];
  usageStats: DataUsageStats | null;
  updateConsentSettings: (settings: ConsentSettings) => Promise<void>;
  fetchAuditLog: () => Promise<void>;
  fetchUsageStats: () => Promise<void>;
  requestDataDeletion: () => Promise<boolean>;
  isAuditLoading: boolean;
  isUsageLoading: boolean;
}

const defaultConsentSettings: ConsentSettings = {
  basicIdentification: true, // Required for app functionality
  modelTraining: false,
  exifMetadata: false,
  locationData: false,
  advancedSensors: false
};

const UserConsentContext = createContext<UserConsentContextType | undefined>(undefined);

export const UserConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [consentSettings, setConsentSettings] = useState<ConsentSettings | null>(null);
  const [auditLog, setAuditLog] = useState<ConsentAuditEntry[]>([]);
  const [usageStats, setUsageStats] = useState<DataUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuditLoading, setIsAuditLoading] = useState<boolean>(false);
  const [isUsageLoading, setIsUsageLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch consent settings when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConsentSettings();
    } else {
      // Reset state when user logs out
      setConsentSettings(null);
      setAuditLog([]);
      setUsageStats(null);
    }
  }, [isAuthenticated, user]);

  const fetchConsentSettings = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/api/consent');
      
      if (response.data && response.data.success) {
        setConsentSettings(response.data.data);
      } else {
        throw new Error('Failed to fetch consent settings');
      }
    } catch (err) {
      console.error('Error fetching consent settings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      // Use default settings if we can't fetch
      setConsentSettings(defaultConsentSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsentSettings = async (settings: ConsentSettings) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to update consent settings');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put('/api/consent', settings);
      
      if (response.data && response.data.success) {
        setConsentSettings(response.data.data);
        return;
      } else {
        throw new Error(response.data?.message || 'Failed to update consent settings');
      }
    } catch (err) {
      console.error('Error updating consent settings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLog = async () => {
    if (!isAuthenticated) return;
    
    setIsAuditLoading(true);
    
    try {
      const response = await apiClient.get('/api/consent/audit');
      
      if (response.data && response.data.success) {
        setAuditLog(response.data.data);
      } else {
        throw new Error('Failed to fetch audit log');
      }
    } catch (err) {
      console.error('Error fetching audit log:', err);
      // Don't update error state as this is a secondary feature
      Alert.alert('Error', 'Failed to load audit log. Please try again later.');
    } finally {
      setIsAuditLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    if (!isAuthenticated) return;
    
    setIsUsageLoading(true);
    
    try {
      const response = await apiClient.get('/api/consent/usage');
      
      if (response.data && response.data.success) {
        setUsageStats(response.data.data);
      } else {
        throw new Error('Failed to fetch usage statistics');
      }
    } catch (err) {
      console.error('Error fetching usage statistics:', err);
      // Don't update error state as this is a secondary feature
      Alert.alert('Error', 'Failed to load usage statistics. Please try again later.');
    } finally {
      setIsUsageLoading(false);
    }
  };

  const requestDataDeletion = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to delete data');
    }
    
    try {
      const response = await apiClient.delete('/api/consent/data');
      
      if (response.data && response.data.success) {
        // Reset local state after successful deletion
        setConsentSettings(defaultConsentSettings);
        setAuditLog([]);
        setUsageStats(null);
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to delete user data');
      }
    } catch (err) {
      console.error('Error deleting user data:', err);
      Alert.alert('Error', 'Failed to delete user data. Please try again later.');
      return false;
    }
  };

  const value = {
    consentSettings,
    isLoading,
    error,
    auditLog,
    usageStats,
    updateConsentSettings,
    fetchAuditLog,
    fetchUsageStats,
    requestDataDeletion,
    isAuditLoading,
    isUsageLoading
  };

  return <UserConsentContext.Provider value={value}>{children}</UserConsentContext.Provider>;
};

export const useUserConsent = (): UserConsentContextType => {
  const context = useContext(UserConsentContext);
  
  if (context === undefined) {
    throw new Error('useUserConsent must be used within a UserConsentProvider');
  }
  
  return context;
};
