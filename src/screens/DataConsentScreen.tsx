/**
 * Data Consent Screen
 * 
 * This screen allows users to provide consent for data collection
 * for the proprietary plant identification model.
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native-paper';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { theme } from '../theme';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

// Consent option types
interface ConsentOption {
  id: string;
  title: string;
  description: string;
  required: boolean;
  defaultValue: boolean;
}

// Define consent options
const consentOptions: ConsentOption[] = [
  {
    id: 'basic_identification',
    title: 'Basic Plant Identification',
    description: 'Allow us to use your plant images for identification purposes only. Images are processed to identify plants but not stored long-term.',
    required: true,
    defaultValue: true,
  },
  {
    id: 'model_training',
    title: 'Model Training',
    description: 'Allow us to use anonymized plant images to improve our identification model. This helps make the app better for everyone.',
    required: false,
    defaultValue: false,
  },
  {
    id: 'exif_metadata',
    title: 'Image Metadata',
    description: 'Allow us to collect technical image data (EXIF) like camera settings and image quality. This helps improve identification accuracy.',
    required: false,
    defaultValue: false,
  },
  {
    id: 'location_data',
    title: 'Location Data',
    description: 'Allow us to use approximate location data to understand regional plant distribution and growing conditions.',
    required: false,
    defaultValue: false,
  },
  {
    id: 'advanced_sensors',
    title: 'Advanced Sensors',
    description: 'Allow access to additional device sensors for pre-symptomatic plant disease detection (when available).',
    required: false,
    defaultValue: false,
  },
];

// Consent storage keys
const CONSENT_STORAGE_PREFIX = '@FlorAI:consent_';
const CONSENT_COMPLETED_KEY = '@FlorAI:consent_completed';

const DataConsentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { updatePreferences } = useUserPreferences();
  
  // Initialize consent state from defaults
  const [consentState, setConsentState] = useState<Record<string, boolean>>(
    consentOptions.reduce((acc, option) => {
      acc[option.id] = option.defaultValue;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  // Load saved consent settings on mount
  React.useEffect(() => {
    const loadConsentSettings = async () => {
      try {
        // Check if consent flow was previously completed
        const consentCompleted = await AsyncStorage.getItem(CONSENT_COMPLETED_KEY);
        
        if (consentCompleted === 'true') {
          // Load saved consent settings
          const savedSettings: Record<string, boolean> = {};
          
          for (const option of consentOptions) {
            const value = await AsyncStorage.getItem(`${CONSENT_STORAGE_PREFIX}${option.id}`);
            savedSettings[option.id] = value === 'true';
          }
          
          setConsentState(savedSettings);
        }
      } catch (error) {
        console.error('Error loading consent settings:', error);
      }
    };
    
    loadConsentSettings();
  }, []);
  
  // Toggle consent option
  const toggleConsent = (id: string) => {
    // Don't allow toggling required options
    const option = consentOptions.find(opt => opt.id === id);
    if (option?.required) return;
    
    setConsentState(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  // Save consent settings and continue
  const saveAndContinue = async () => {
    try {
      // Save each consent option
      for (const [id, value] of Object.entries(consentState)) {
        await AsyncStorage.setItem(`${CONSENT_STORAGE_PREFIX}${id}`, value.toString());
      }
      
      // Mark consent flow as completed
      await AsyncStorage.setItem(CONSENT_COMPLETED_KEY, 'true');
      
      // Update user preferences context
      updatePreferences({
        dataConsent: consentState,
      });
      
      // Navigate to next screen
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Error saving consent settings:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/images/data-privacy.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        
        <Typography variant="h1" style={styles.title}>
          Data Privacy & Consent
        </Typography>
        
        <Typography variant="body1" style={styles.subtitle}>
          FlorAI is committed to your privacy. Please review how we use your data and choose your preferences below.
        </Typography>
        
        <View style={styles.divider} />
        
        {consentOptions.map((option) => (
          <View key={option.id} style={styles.optionContainer}>
            <View style={styles.optionHeader}>
              <Typography variant="h3" style={styles.optionTitle}>
                {option.title}
              </Typography>
              
              <Switch
                value={consentState[option.id]}
                onValueChange={() => toggleConsent(option.id)}
                disabled={option.required}
                color={theme.colors.primary}
              />
            </View>
            
            <Typography variant="body2" style={styles.optionDescription}>
              {option.description}
            </Typography>
            
            {option.required && (
              <Typography variant="caption" style={styles.requiredText}>
                Required for app functionality
              </Typography>
            )}
          </View>
        ))}
        
        <View style={styles.infoContainer}>
          <Typography variant="caption" style={styles.infoText}>
            You can change these settings anytime in the Privacy Dashboard.
            For more information, please read our{' '}
            <Typography
              variant="caption"
              style={styles.linkText}
              onPress={() => navigation.navigate('PrivacyPolicy' as never)}
            >
              Privacy Policy
            </Typography>.
          </Typography>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button onPress={saveAndContinue} style={styles.continueButton}>
          Save Preferences
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerImage: {
    width: '100%',
    height: 180,
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },
  optionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    flex: 1,
    paddingRight: 16,
  },
  optionDescription: {
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  requiredText: {
    color: theme.colors.primary,
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
  },
  infoText: {
    color: theme.colors.textSecondary,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    width: '100%',
  },
});

export default DataConsentScreen;
