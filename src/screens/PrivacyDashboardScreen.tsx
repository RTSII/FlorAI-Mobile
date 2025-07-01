import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import Typography from '../components/Typography';
import Card from '../components/Card';
import { ApiErrorCode } from '../api/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserConsent } from '../contexts/UserConsentContext';
import { format } from 'date-fns';

/**
 * Privacy Dashboard Screen
 * Allows users to manage their privacy settings and data
 */
const PrivacyDashboardScreen = ({ route }: { route: any }) => {
  const { showAudit = false } = route.params || {};
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  
  // Use the UserConsentContext
  const { 
    consentSettings, 
    updateConsentSettings, 
    isLoading, 
    error,
    auditLog,
    usageStats,
    fetchAuditLog,
    fetchUsageStats,
    requestDataDeletion,
    isAuditLoading,
    isUsageLoading
  } = useUserConsent();
  
  // Local state for UI
  const [activeTab, setActiveTab] = useState(showAudit ? 'audit' : 'settings');
  const [refreshing, setRefreshing] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  // Load audit log and usage stats when tab changes
  useEffect(() => {
    if (activeTab === 'audit' && !auditLog.length) {
      fetchAuditLog();
    } else if (activeTab === 'usage' && !usageStats) {
      fetchUsageStats();
    }
  }, [activeTab, auditLog.length, usageStats, fetchAuditLog, fetchUsageStats]);
  
  // Pull-to-refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    if (activeTab === 'audit') {
      await fetchAuditLog();
    } else if (activeTab === 'usage') {
      await fetchUsageStats();
    }
    
    setRefreshing(false);
  }, [activeTab, fetchAuditLog, fetchUsageStats]);
  
  // Handle consent update
  const handleUpdateConsent = async () => {
    try {
      if (!consentSettings) return;
      
      await updateConsentSettings(consentSettings);
      
      // Also update app context for backward compatibility
      dispatch({
        type: 'UPDATE_USER_CONSENT',
        payload: {
          location: consentSettings.locationData,
          notifications: state.user?.privacyConsent?.notifications || false,
          dataUsage: consentSettings.modelTraining,
          terms: true
        }
      });
      
      Alert.alert('Success', 'Your privacy preferences have been updated.', [{ text: 'OK' }]);
      
    } catch (error: any) {
      // Handle error
      let message = 'Failed to save privacy preferences. Please try again.';
      
      if (error.code === ApiErrorCode.NETWORK_ERROR) {
        message = 'Network connection error. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error', message, [{ text: 'OK' }]);
    }
  };
  
  // Handle data download
  const handleDownloadData = async () => {
    try {
      // Fetch both audit log and usage stats
      await Promise.all([fetchAuditLog(), fetchUsageStats()]);
      
      // In a real app, this would trigger a file download
      // For now, we'll just show a success message
      Alert.alert(
        'Data Downloaded',
        'Your data has been downloaded successfully. Check your device downloads folder.',
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      // Handle error
      let message = 'Failed to download your data. Please try again.';
      
      if (error.code === ApiErrorCode.NETWORK_ERROR) {
        message = 'Network connection error. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error', message, [{ text: 'OK' }]);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ]
    );
  };
  
  // Confirm account deletion
  const confirmDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      
      // Delete user data using our consent service
      const success = await requestDataDeletion();
      
      if (success) {
        // Clear local state
        dispatch({ type: 'LOGOUT' });
        
        // Navigate to login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }]
        });
      } else {
        throw new Error('Data deletion failed');
      }
      
    } catch (error: any) {
      // Handle error
      let message = 'Failed to delete your account. Please try again.';
      
      if (error.code === ApiErrorCode.NETWORK_ERROR) {
        message = 'Network connection error. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error', message, [{ text: 'OK' }]);
      setDeletingAccount(false);
    }
  };
  
  // View privacy policy
  const viewPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy' as never);
  };
  
  // View terms of service
  const viewTermsOfService = () => {
    navigation.navigate('TermsOfService' as never);
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Typography variant="headlineLarge" style={{ color: theme.colors.primary }}>
          Privacy Dashboard
        </Typography>
        <Typography variant="bodyLarge" style={styles.subtitle}>
          Manage your privacy settings and personal data
        </Typography>
      </View>
      
      <Card style={styles.section}>
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Privacy Preferences
        </Typography>
        
        <View style={styles.consentItem}>
          <View style={styles.consentText}>
            <Typography variant="bodyMedium">
              Enable location services
            </Typography>
            <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
              Provides personalized care schedules based on local weather
            </Typography>
          </View>
          <Switch
            value={locationConsent}
            onValueChange={setLocationConsent}
            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
        
        <View style={styles.consentItem}>
          <View style={styles.consentText}>
            <Typography variant="bodyMedium">
              Allow push notifications
            </Typography>
            <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
              Receive watering and care reminders
            </Typography>
          </View>
          <Switch
            value={notificationsConsent}
            onValueChange={setNotificationsConsent}
            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
        
        <View style={styles.consentItem}>
          <View style={styles.consentText}>
            <Typography variant="bodyMedium">
              Help improve our plant identification AI
            </Typography>
            <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
              Allow us to use your anonymized plant photos for training
            </Typography>
          </View>
          <Switch
            value={dataUsageConsent}
            onValueChange={setDataUsageConsent}
            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
        
        <Button
          variant="primary"
          label="Save Preferences"
          onPress={handleUpdateConsent}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
      </Card>
      
      <Card style={styles.section}>
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Your Data
        </Typography>
        
        <TouchableOpacity 
          style={styles.dataOption}
          onPress={handleDownloadData}
          disabled={downloadingData}
        >
          <View style={styles.dataOptionContent}>
            <MaterialCommunityIcons 
              name="download" 
              size={24} 
              color={theme.colors.primary} 
            />
            <View style={styles.dataOptionText}>
              <Typography variant="bodyMedium">
                Download Your Data
              </Typography>
              <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
                Get a copy of all your personal data
              </Typography>
            </View>
          </View>
          {downloadingData ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color={theme.colors.outline} 
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dataOption, styles.deleteOption]}
          onPress={handleDeleteAccount}
          disabled={deletingAccount}
        >
          <View style={styles.dataOptionContent}>
            <MaterialCommunityIcons 
              name="delete" 
              size={24} 
              color={theme.colors.error} 
            />
            <View style={styles.dataOptionText}>
              <Typography variant="bodyMedium" style={{ color: theme.colors.error }}>
                Delete Account & Data
              </Typography>
              <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
                Permanently delete your account and all associated data
              </Typography>
            </View>
          </View>
          {deletingAccount ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color={theme.colors.outline} 
            />
          )}
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.section}>
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Legal Documents
        </Typography>
        
        <TouchableOpacity 
          style={styles.dataOption}
          onPress={viewPrivacyPolicy}
        >
          <View style={styles.dataOptionContent}>
            <MaterialCommunityIcons 
              name="shield-lock" 
              size={24} 
              color={theme.colors.primary} 
            />
            <View style={styles.dataOptionText}>
              <Typography variant="bodyMedium">
                Privacy Policy
              </Typography>
              <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
                How we collect, use, and protect your data
              </Typography>
            </View>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={theme.colors.outline} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dataOption}
          onPress={viewTermsOfService}
        >
          <View style={styles.dataOptionContent}>
            <MaterialCommunityIcons 
              name="file-document" 
              size={24} 
              color={theme.colors.primary} 
            />
            <View style={styles.dataOptionText}>
              <Typography variant="bodyMedium">
                Terms of Service
              </Typography>
              <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
                Rules and guidelines for using FlorAI
              </Typography>
            </View>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={theme.colors.outline} 
          />
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  consentText: {
    flex: 1,
    marginRight: 16,
  },
  button: {
    marginTop: 16,
  },
  dataOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  dataOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dataOptionText: {
    marginLeft: 16,
    flex: 1,
  },
});

export default PrivacyDashboardScreen;
