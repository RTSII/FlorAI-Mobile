import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useUserConsent } from '../contexts/UserConsentContext';

type PrivacyGuideScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PrivacyGuide'
>;

const PrivacyGuideScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<PrivacyGuideScreenNavigationProp>();
  const { consentSettings } = useUserConsent();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.medium,
    },
    section: {
      marginBottom: spacing.large,
    },
    card: {
      marginBottom: spacing.medium,
    },
    buttonContainer: {
      marginTop: spacing.medium,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      width: 40,
      height: 40,
      marginRight: spacing.small,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Typography variant="h1">Your Privacy Matters</Typography>
        <Typography variant="body1" style={{ marginTop: spacing.small }}>
          FlorAI is committed to protecting your privacy while providing powerful plant care features.
          This guide explains how we use data and the controls you have.
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="h2">Data We Collect</Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">Basic Plant Identification</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            • Plant photos you upload
          </Typography>
          <Typography variant="body2">
            • Basic app usage information
          </Typography>
          <Typography variant="caption" style={{ marginTop: spacing.small }}>
            Required for core app functionality
          </Typography>
        </Card>

        <Card style={styles.card}>
          <Typography variant="h3">Advanced Diagnostics (Optional)</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            • EXIF/raw image metadata
          </Typography>
          <Typography variant="body2">
            • Phone sensor data (where available)
          </Typography>
          <Typography variant="body2">
            • Environmental context
          </Typography>
          <Typography variant="caption" style={{ marginTop: spacing.small }}>
            Status: {consentSettings.advancedDiagnostics ? 'Enabled' : 'Disabled'}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button 
              variant="secondary" 
              size="small"
              onPress={() => navigation.navigate('PrivacyDashboard', { initialTab: 'consent' })}
            >
              Manage Settings
            </Button>
            <Button 
              variant="text" 
              size="small"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              Learn More
            </Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <Typography variant="h3">Research Contribution (Optional)</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            • Anonymized plant data
          </Typography>
          <Typography variant="body2">
            • Training our plant identification models
          </Typography>
          <Typography variant="caption" style={{ marginTop: spacing.small }}>
            Status: {consentSettings.dataContribution ? 'Enabled' : 'Disabled'}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button 
              variant="secondary" 
              size="small"
              onPress={() => navigation.navigate('PrivacyDashboard', { initialTab: 'consent' })}
            >
              Manage Settings
            </Button>
            <Button 
              variant="text" 
              size="small"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              Learn More
            </Button>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="h2">How We Use Your Data</Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">Supermemory.ai Integration</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            FlorAI uses Supermemory.ai technology to remember your plants' history and provide personalized care recommendations.
          </Typography>
          <Typography variant="body2" style={{ marginTop: spacing.small }}>
            This helps us:
          </Typography>
          <Typography variant="body2">
            • Remember your plants' care history
          </Typography>
          <Typography variant="body2">
            • Provide personalized recommendations
          </Typography>
          <Typography variant="body2">
            • Improve plant identification accuracy over time
          </Typography>
          <Typography variant="caption" style={{ marginTop: spacing.small }}>
            Status: {consentSettings.supermemoryIntegration ? 'Enabled' : 'Disabled'}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button 
              variant="secondary" 
              size="small"
              onPress={() => navigation.navigate('PrivacyDashboard', { initialTab: 'consent' })}
            >
              Manage Settings
            </Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <Typography variant="h3">Data Integration</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            With your consent, information may be integrated between Supermemory.ai and our Supabase database for:
          </Typography>
          <Typography variant="body2" style={{ marginTop: spacing.small }}>
            • Plant data organization
          </Typography>
          <Typography variant="body2">
            • Image annotation for improved identification
          </Typography>
          <Typography variant="body2">
            • Analysis of plant health patterns
          </Typography>
          <Typography variant="caption" style={{ marginTop: spacing.small }}>
            Status: {consentSettings.dataIntegration ? 'Enabled' : 'Disabled'}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button 
              variant="secondary" 
              size="small"
              onPress={() => navigation.navigate('PrivacyDashboard', { initialTab: 'consent' })}
            >
              Manage Settings
            </Button>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="h2">Your Privacy Controls</Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">Privacy Dashboard</Typography>
          <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
            The Privacy Dashboard gives you complete control over your data:
          </Typography>
          <Typography variant="body2" style={{ marginTop: spacing.small }}>
            • Manage consent settings
          </Typography>
          <Typography variant="body2">
            • View data usage statistics
          </Typography>
          <Typography variant="body2">
            • Access audit logs
          </Typography>
          <Typography variant="body2">
            • Request data export or deletion
          </Typography>
          <View style={styles.buttonContainer}>
            <Button 
              variant="primary" 
              onPress={() => navigation.navigate('PrivacyDashboard')}
            >
              Open Privacy Dashboard
            </Button>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="h2">Our Commitment</Typography>
        <Typography variant="body1">
          We are committed to:
        </Typography>
        <Typography variant="body2" style={{ marginTop: spacing.small }}>
          • Transparency in data collection and use
        </Typography>
        <Typography variant="body2">
          • Strong security measures to protect your data
        </Typography>
        <Typography variant="body2">
          • Giving you control over your information
        </Typography>
        <Typography variant="body2">
          • Never selling your personal information
        </Typography>
        
        <View style={styles.buttonContainer}>
          <Button 
            variant="secondary"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            Read Full Privacy Policy
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default PrivacyGuideScreen;
