import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorDisplay from '../components/ErrorDisplay';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useSubscription } from '../contexts/SubscriptionContext';
import PremiumFeatureModal from '../components/PremiumFeatureModal';
import { usePremiumFeaturePrompt } from '../hooks/usePremiumFeaturePrompt';
import * as ImagePicker from 'expo-image-picker';
import advancedSensorsService from '../services/advancedSensors';
import { ApiError } from '../api/types';

type AdvancedDiagnosticsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdvancedDiagnostics'
>;

interface DiagnosticResult {
  id: string;
  condition: string;
  confidence: number;
  description: string;
  treatmentRecommendations: string[];
  detectedAt: string;
}

const AdvancedDiagnosticsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<AdvancedDiagnosticsScreenNavigationProp>();
  const { isPremium } = useSubscription();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[] | null>(null);
  const [useSensorData, setUseSensorData] = useState<boolean>(true);
  const [useEnvironmentalContext, setUseEnvironmentalContext] = useState<boolean>(true);

  // Premium feature prompt configuration
  const premiumFeaturePrompt = usePremiumFeaturePrompt('advanced_diagnostics', {
    featureName: 'Advanced Plant Diagnostics',
    featureDescription: 'Detect plant diseases and health issues before visible symptoms appear using advanced AI analysis.',
    featureIcon: require('../../assets/feature-icons/advanced-diagnostics.png'),
    benefitsList: [
      'Early disease detection before visible symptoms',
      'Multispectral analysis using phone sensors',
      'Environmental context integration',
      'Personalized treatment recommendations',
      'Unlimited diagnostic scans'
    ]
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.medium,
    },
    header: {
      marginBottom: spacing.medium,
    },
    imageContainer: {
      aspectRatio: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.medium,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
    },
    placeholderIcon: {
      width: 80,
      height: 80,
      opacity: 0.5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.medium,
    },
    optionsCard: {
      marginBottom: spacing.medium,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.small,
    },
    switch: {
      width: 50,
      height: 24,
      borderRadius: 12,
      padding: 2,
    },
    switchEnabled: {
      backgroundColor: colors.primary,
    },
    switchDisabled: {
      backgroundColor: colors.border,
    },
    switchThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surface,
    },
    switchThumbEnabled: {
      alignSelf: 'flex-end',
    },
    switchThumbDisabled: {
      alignSelf: 'flex-start',
    },
    resultsContainer: {
      marginTop: spacing.medium,
    },
    resultCard: {
      marginBottom: spacing.medium,
    },
    confidenceBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginVertical: spacing.small,
    },
    confidenceFill: {
      height: '100%',
      borderRadius: 4,
    },
    treatmentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.xsmall,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 8,
      marginRight: spacing.small,
    },
    premiumBanner: {
      backgroundColor: colors.primaryLight,
      padding: spacing.medium,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.medium,
    },
    premiumIcon: {
      width: 40,
      height: 40,
      marginRight: spacing.medium,
    },
  });

  useEffect(() => {
    // Check camera permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is required for advanced diagnostics.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const handleSelectImage = async () => {
    try {
      // Check if user has premium access
      const hasAccess = await premiumFeaturePrompt.checkFeatureAccess();
      
      if (!hasAccess) {
        // Premium modal will be shown by the hook
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        exif: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosticResults(null);
        setError(null);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      setError('Failed to select image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Check if user has premium access
      const hasAccess = await premiumFeaturePrompt.checkFeatureAccess();
      
      if (!hasAccess) {
        // Premium modal will be shown by the hook
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        exif: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosticResults(null);
        setError(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to take photo. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    try {
      // Check if user has premium access
      const hasAccess = await premiumFeaturePrompt.checkFeatureAccess();
      
      if (!hasAccess) {
        // Premium modal will be shown by the hook
        return;
      }
      
      setIsAnalyzing(true);
      setError(null);
      
      // Call the advanced diagnostics service
      const results = await advancedSensorsService.analyzePlantHealth({
        imageUri: selectedImage,
        useSensorData,
        useEnvironmentalContext,
      });
      
      setDiagnosticResults(results);
    } catch (error) {
      console.error('Error analyzing image:', error);
      if (error instanceof ApiError) {
        setError(`Analysis failed: ${error.message}`);
      } else {
        setError('Failed to analyze image. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return colors.success;
    if (confidence >= 0.6) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="h1">Advanced Plant Diagnostics</Typography>
          <Typography variant="body1" style={{ marginTop: spacing.small }}>
            Detect plant diseases and health issues before visible symptoms appear using advanced AI analysis.
          </Typography>
        </View>

        {!isPremium && (
          <View style={styles.premiumBanner}>
            <Image 
              source={require('../../assets/icons/premium.png')} 
              style={styles.premiumIcon}
            />
            <View style={{ flex: 1 }}>
              <Typography variant="h3" style={{ color: colors.primary }}>
                Premium Feature
              </Typography>
              <Typography variant="body2">
                Unlock advanced diagnostics with a premium subscription.
              </Typography>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.imageContainer} 
          onPress={handleSelectImage}
          activeOpacity={0.8}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="cover" />
          ) : (
            <Image 
              source={require('../../assets/icons/image-placeholder.png')} 
              style={styles.placeholderIcon}
            />
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button 
            variant="secondary" 
            onPress={handleTakePhoto}
            style={{ flex: 1, marginRight: spacing.small }}
          >
            Take Photo
          </Button>
          <Button 
            variant="secondary" 
            onPress={handleSelectImage}
            style={{ flex: 1, marginLeft: spacing.small }}
          >
            Select Image
          </Button>
        </View>

        <Card style={styles.optionsCard}>
          <Typography variant="h3" style={{ marginBottom: spacing.small }}>
            Diagnostic Options
          </Typography>
          
          <View style={styles.optionRow}>
            <View>
              <Typography variant="body1">Use Sensor Data</Typography>
              <Typography variant="caption">
                Utilize available device sensors for enhanced analysis
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => setUseSensorData(!useSensorData)}
              style={[
                styles.switch,
                useSensorData ? styles.switchEnabled : styles.switchDisabled
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  useSensorData ? styles.switchThumbEnabled : styles.switchThumbDisabled
                ]}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionRow}>
            <View>
              <Typography variant="body1">Environmental Context</Typography>
              <Typography variant="caption">
                Include weather and seasonal data in analysis
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => setUseEnvironmentalContext(!useEnvironmentalContext)}
              style={[
                styles.switch,
                useEnvironmentalContext ? styles.switchEnabled : styles.switchDisabled
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  useEnvironmentalContext ? styles.switchThumbEnabled : styles.switchThumbDisabled
                ]}
              />
            </TouchableOpacity>
          </View>
        </Card>

        <Button 
          variant="primary" 
          onPress={handleAnalyze}
          disabled={!selectedImage || isAnalyzing}
        >
          Analyze Plant Health
        </Button>

        {error && (
          <ErrorDisplay message={error} style={{ marginTop: spacing.medium }} />
        )}

        {diagnosticResults && diagnosticResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Typography variant="h2" style={{ marginBottom: spacing.medium }}>
              Diagnostic Results
            </Typography>
            
            {diagnosticResults.map((result) => (
              <Card key={result.id} style={styles.resultCard}>
                <Typography variant="h3">{result.condition}</Typography>
                
                <View style={styles.confidenceBar}>
                  <View 
                    style={[
                      styles.confidenceFill, 
                      { 
                        width: `${result.confidence * 100}%`,
                        backgroundColor: getConfidenceColor(result.confidence)
                      }
                    ]} 
                  />
                </View>
                
                <Typography variant="caption">
                  Confidence: {Math.round(result.confidence * 100)}%
                </Typography>
                
                <Typography variant="body1" style={{ marginTop: spacing.small }}>
                  {result.description}
                </Typography>
                
                <Typography variant="h3" style={{ marginTop: spacing.medium, marginBottom: spacing.small }}>
                  Treatment Recommendations
                </Typography>
                
                {result.treatmentRecommendations.map((treatment, index) => (
                  <View key={index} style={styles.treatmentItem}>
                    <View style={styles.bulletPoint} />
                    <Typography variant="body2" style={{ flex: 1 }}>
                      {treatment}
                    </Typography>
                  </View>
                ))}
              </Card>
            ))}
          </View>
        )}

        {diagnosticResults && diagnosticResults.length === 0 && (
          <Card style={{ marginTop: spacing.medium, padding: spacing.medium, alignItems: 'center' }}>
            <Image 
              source={require('../../assets/icons/healthy.png')} 
              style={{ width: 60, height: 60, marginBottom: spacing.small }}
            />
            <Typography variant="h3" style={{ color: colors.success }}>
              No Issues Detected
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'center', marginTop: spacing.small }}>
              Your plant appears to be healthy! Continue with your current care routine.
            </Typography>
          </Card>
        )}
      </ScrollView>

      {isAnalyzing && (
        <LoadingOverlay message="Analyzing plant health..." />
      )}

      <PremiumFeatureModal
        visible={premiumFeaturePrompt.showModal}
        onClose={premiumFeaturePrompt.closeModal}
        featureName={premiumFeaturePrompt.featureConfig.featureName}
        featureDescription={premiumFeaturePrompt.featureConfig.featureDescription}
        featureIcon={premiumFeaturePrompt.featureConfig.featureIcon}
        benefitsList={premiumFeaturePrompt.featureConfig.benefitsList}
      />
    </View>
  );
};

export default AdvancedDiagnosticsScreen;
