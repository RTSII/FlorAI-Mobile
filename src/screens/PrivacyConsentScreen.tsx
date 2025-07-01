import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { Typography } from '../components/Typography';
import { saveUserConsent } from '../services/userService';
import { ApiErrorCode } from '../api/types';

/**
 * Privacy Consent Screen
 * Allows users to provide granular consent for data usage
 */
const PrivacyConsentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  
  // Consent state
  const [locationConsent, setLocationConsent] = useState(false);
  const [notificationsConsent, setNotificationsConsent] = useState(false);
  const [dataUsageConsent, setDataUsageConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load existing consent settings if available
  useEffect(() => {
    if (state.user?.privacyConsent) {
      const { location, notifications, dataUsage, terms } = state.user.privacyConsent;
      setLocationConsent(location || false);
      setNotificationsConsent(notifications || false);
      setDataUsageConsent(dataUsage || false);
      setTermsAccepted(terms || false);
    }
  }, [state.user]);
  
  // Handle consent submission
  const handleSubmitConsent = async () => {
    if (!termsAccepted) {
      Alert.alert(
        'Terms Required',
        'You must accept the Terms of Service and Privacy Policy to continue.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Save consent to backend
      const result = await saveUserConsent({
        locationConsent,
        notificationsConsent,
        dataUsageConsent,
        termsAccepted
      });
      
      // Update local state
      dispatch({
        type: 'UPDATE_USER_CONSENT',
        payload: {
          location: locationConsent,
          notifications: notificationsConsent,
          dataUsage: dataUsageConsent,
          terms: termsAccepted
        }
      });
      
      // Navigate to next screen
      navigation.navigate('Home' as never);
      
    } catch (error: any) {
      // Handle error
      let message = 'Failed to save privacy preferences. Please try again.';
      
      if (error.code === ApiErrorCode.NETWORK_ERROR) {
        message = 'Network connection error. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error', message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Typography variant="headlineLarge" style={{ color: theme.colors.primary }}>
          Privacy Preferences
        </Typography>
        <Typography variant="bodyLarge" style={styles.subtitle}>
          FlorAI values your privacy. Please review and select your preferences below.
        </Typography>
      </View>
      
      <View style={styles.consentSection}>
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Terms of Service & Privacy Policy
        </Typography>
        <View style={styles.consentItem}>
          <View style={styles.consentText}>
            <Typography variant="bodyMedium">
              I agree to the Terms of Service and have read the Privacy Policy.
            </Typography>
            <Typography variant="bodySmall" style={{ color: theme.colors.outline }}>
              Required to use FlorAI
            </Typography>
          </View>
          <Switch
            value={termsAccepted}
            onValueChange={setTermsAccepted}
            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
      </View>
      
      <View style={styles.consentSection}>
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Optional Permissions
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
      </View>
      
      <View style={styles.privacyInfo}>
        <Typography variant="bodyMedium">
          You can change these settings at any time in the Privacy Dashboard.
        </Typography>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          label="Continue"
          onPress={handleSubmitConsent}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  consentSection: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
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
  privacyInfo: {
    marginBottom: 32,
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

export default PrivacyConsentScreen;
