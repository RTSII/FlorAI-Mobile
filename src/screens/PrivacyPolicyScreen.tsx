import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Typography from '../components/Typography';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';

const PrivacyPolicyScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [policyContent, setPolicyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.medium,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      padding: spacing.medium,
      backgroundColor: colors.error,
      borderRadius: 8,
      marginTop: spacing.medium,
    },
    markdownStyles: {
      body: {
        color: colors.text,
        fontSize: 16,
        lineHeight: 24,
      },
      heading1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginVertical: spacing.medium,
      },
      heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginVertical: spacing.small,
      },
      heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: spacing.xsmall,
      },
      paragraph: {
        marginVertical: spacing.xsmall,
      },
      list_item: {
        marginVertical: spacing.xxsmall,
      },
      strong: {
        fontWeight: 'bold',
      },
      em: {
        fontStyle: 'italic',
      },
      link: {
        color: colors.primary,
        textDecorationLine: 'underline',
      },
    },
  });

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        setLoading(true);
        
        // First try to load from bundled assets
        try {
          const policy = await require('../../assets/privacy-policy.md');
          setPolicyContent(policy);
          setLoading(false);
          return;
        } catch (e) {
          // If bundled asset not found, try to load from file system
          console.log('Bundled privacy policy not found, trying file system');
        }
        
        // Try to load from file system
        const fileUri = `${FileSystem.documentDirectory}privacy-policy.md`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(fileUri);
          setPolicyContent(content);
        } else {
          // If not found in file system, use hardcoded fallback
          setPolicyContent(`
# FlorAI Privacy Policy

**Last Updated: July 1, 2025**

## Introduction

Welcome to FlorAI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our mobile application ("FlorAI-Mobile" or the "App").

This Privacy Policy explains our practices regarding the collection, use, and disclosure of information through our App, including our advanced plant diagnostics features. By using FlorAI-Mobile, you agree to the terms of this Privacy Policy.

## Information We Collect

### Information You Provide to Us

- Account Information: When you create an account, we collect your email address, username, and password.
- Plant Information: Information about your plants, including photos, care history, and notes.
- User Preferences: Your settings and preferences within the App.

### Information Collected Automatically

- Device Information: Device type, operating system, unique device identifiers.
- Usage Data: How you interact with our App, features used, time spent.
- Location Data: With your explicit consent, we may collect location data to provide location-specific plant care recommendations.

### Advanced Diagnostics Data (Optional, Consent-Based)

With your explicit consent, we may collect additional data to improve our plant identification and diagnostics capabilities:

- EXIF/Raw Image Metadata: Camera information, capture time, and technical image details.
- Phone Sensor Data: Where available and with consent, data from device sensors including multispectral/hyperspectral sensors, environmental sensors, and other device sensors that may aid in plant analysis.
- Environmental Context: Weather conditions, seasonal information, and other environmental factors.

## How We Use Your Information

### Core App Functionality

- Providing plant identification and care recommendations
- Maintaining your account and preferences
- Improving the App's functionality and user experience

### Advanced Plant Diagnostics (With Consent)

If you opt in to our advanced diagnostics features, we use the additional data to:

- Enhance plant identification accuracy
- Provide early disease detection and health monitoring
- Develop personalized care recommendations
- Improve our proprietary plant identification and diagnostics models

### Research and Development

With your explicit consent, we may use anonymized data to:

- Train and improve our proprietary plant identification models
- Research new plant care techniques and disease prevention methods
- Develop new features and capabilities for the App

## Your Choices and Rights

You can manage your privacy settings at any time through the Privacy Dashboard in the App.

For the complete Privacy Policy, please visit our website at https://florai.app/privacy.
`);
        }
      } catch (err) {
        console.error('Error loading privacy policy:', err);
        setError('Unable to load privacy policy. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="body1" style={{ marginTop: spacing.medium }}>
          Loading Privacy Policy...
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Typography variant="body1" style={{ color: colors.onError }}>
            {error}
          </Typography>
        </View>
      ) : (
        <Markdown style={styles.markdownStyles}>{policyContent}</Markdown>
      )}
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;
