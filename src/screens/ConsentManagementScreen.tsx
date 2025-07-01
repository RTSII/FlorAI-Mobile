import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeProvider';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorDisplay from '../components/ErrorDisplay';
import { useUserConsent } from '../contexts/UserConsentContext';
import { ConsentSettings } from '../types/consent';

type ConsentManagementScreenProps = {
  route: {
    params?: {
      isOnboarding?: boolean;
    };
  };
};

const ConsentManagementScreen: React.FC<ConsentManagementScreenProps> = ({ route }) => {
  const { isOnboarding = false } = route.params || {};
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useTheme();
  const { 
    consentSettings, 
    updateConsentSettings, 
    isLoading, 
    error 
  } = useUserConsent();

  const [localSettings, setLocalSettings] = useState<ConsentSettings>({
    basicIdentification: true, // Always required
    modelTraining: false,
    exifMetadata: false,
    locationData: false,
    advancedSensors: false
  });

  useEffect(() => {
    if (consentSettings) {
      setLocalSettings(consentSettings);
    }
  }, [consentSettings]);

  const handleToggle = (key: keyof ConsentSettings) => {
    // Don't allow toggling basic identification as it's required
    if (key === 'basicIdentification') return;

    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      await updateConsentSettings(localSettings);
      
      if (isOnboarding) {
        // If we're in onboarding flow, navigate to the next screen
        navigation.navigate('OnboardingComplete');
      } else {
        Alert.alert(
          'Settings Saved',
          'Your privacy settings have been updated successfully.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Failed to save consent settings:', err);
      Alert.alert(
        'Error',
        'Failed to save your privacy settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    if (isOnboarding) {
      // In onboarding, we need at least basic consent
      Alert.alert(
        'Required Settings',
        'Basic plant identification consent is required to use the app. You can update advanced settings later.',
        [
          { 
            text: 'Continue with Basic Only', 
            onPress: () => {
              setLocalSettings({
                basicIdentification: true,
                modelTraining: false,
                exifMetadata: false,
                locationData: false,
                advancedSensors: false
              });
              handleSave();
            }
          }
        ]
      );
    } else {
      // Reset to saved settings
      setLocalSettings(consentSettings || {
        basicIdentification: true,
        modelTraining: false,
        exifMetadata: false,
        locationData: false,
        advancedSensors: false
      });
    }
  };

  const renderConsentItem = (
    title: string,
    description: string,
    key: keyof ConsentSettings,
    required: boolean = false
  ) => {
    return (
      <Card style={styles.consentCard}>
        <View style={styles.consentHeader}>
          <Typography variant="h3" style={{ flex: 1 }}>
            {title} {required && <Typography variant="caption" color={theme.colors.error}>*Required</Typography>}
          </Typography>
          <Button 
            mode={localSettings[key] ? 'contained' : 'outlined'}
            onPress={() => handleToggle(key)}
            disabled={required}
            style={styles.toggleButton}
          >
            {localSettings[key] ? 'Enabled' : 'Disabled'}
          </Button>
        </View>
        <Typography variant="body" style={styles.consentDescription}>
          {description}
        </Typography>
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading privacy settings..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="h1" style={styles.title}>
          Privacy & Data Collection
        </Typography>
        
        <Typography variant="body" style={styles.intro}>
          FlorAI uses plant data to provide identification and care recommendations. 
          Control what data you share and how it's used below.
        </Typography>

        {error && (
          <ErrorDisplay 
            error={{ message: 'Failed to load privacy settings. Please try again.' }} 
            retry={() => {}} 
          />
        )}

        {renderConsentItem(
          'Basic Plant Identification',
          'Required for core app functionality. We use your plant photos to identify species and provide care recommendations.',
          'basicIdentification',
          true
        )}

        {renderConsentItem(
          'Model Training',
          'Allow your plant photos to be used to improve our identification algorithms. All data is anonymized.',
          'modelTraining'
        )}

        {renderConsentItem(
          'EXIF Metadata',
          'Share photo metadata (camera settings, time) to improve identification accuracy. No personal information is extracted.',
          'exifMetadata'
        )}

        {renderConsentItem(
          'Location Data',
          'Share approximate location to improve recommendations based on your climate and growing conditions.',
          'locationData'
        )}

        {renderConsentItem(
          'Advanced Sensors',
          'Share data from advanced phone sensors (if available) to enable premium diagnostic features and improve disease detection.',
          'advancedSensors'
        )}

        <Typography variant="caption" style={styles.privacyNote}>
          You can change these settings at any time from the Privacy Dashboard.
          For more information, please read our Privacy Policy.
        </Typography>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleCancel}
            style={styles.button}
          >
            {isOnboarding ? 'Basic Only' : 'Cancel'}
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.button}
          >
            {isOnboarding ? 'Continue' : 'Save Settings'}
          </Button>
        </View>

        {!isOnboarding && (
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('PrivacyDashboard', { showAudit: true })}
            style={styles.linkButton}
          >
            View Data Usage & Audit Log
          </Button>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  intro: {
    marginBottom: 24,
    textAlign: 'center',
  },
  consentCard: {
    marginBottom: 16,
    padding: 16,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consentDescription: {
    marginTop: 8,
  },
  toggleButton: {
    minWidth: 100,
  },
  privacyNote: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  linkButton: {
    marginTop: 8,
  }
});

export default ConsentManagementScreen;
