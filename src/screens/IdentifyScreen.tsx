import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Button, IconButton, useTheme, Surface, Card } from 'react-native-paper';
import { Camera, CameraType } from 'expo-camera';
import { plantIdentificationService } from '../services/plantIdentification/index.ts';
import { Plant } from '../types/state.ts';
import { useSubscription } from '../contexts/SubscriptionContext.tsx';

const IdentifyScreen = () => {
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identificationResults, setIdentificationResults] = useState<Plant | null>(null);
  const [identificationError, setIdentificationError] = useState<string | null>(null);
  const { isPremium } = useSubscription();
  let camera: Camera | null = null;

  // Request camera permission on component mount
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);
  
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => {
    if (!camera || !cameraReady) return;

    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setIdentificationResults(null);
    setIdentificationError(null);
  };

  const analyzePlant = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setIdentificationError(null);
    
    try {
      const response = await plantIdentificationService.identifyPlant(capturedImage);
      
      if (response.error) {
        setIdentificationError(response.error.message);
        setIdentificationResults(null);
      } else if (response.data && response.data.results && response.data.results.length > 0) {
        // Map the first result to our Plant type
        const topResult = response.data.results[0];
        const plant = plantIdentificationService.mapResultToPlant(topResult);
        setIdentificationResults(plant);
      } else {
        setIdentificationError('No plants were identified in this image. Please try a clearer photo.');
      }
    } catch (error) {
      console.error('Error identifying plant:', error);
      setIdentificationError('Failed to identify plant. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera</Text>
        <Button mode="contained" onPress={requestCameraPermission}>
          Grant Camera Permission
        </Button>
      </View>
    );
  }

  // Render the results view
  const renderResults = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.analysisContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.analysisText, { color: theme.colors.onSurface }]}>
            Analyzing plant...
          </Text>
          <Text style={[styles.analysisSubtext, { color: theme.colors.onSurfaceVariant }]}>
            Our AI is identifying your plant
          </Text>
        </View>
      );
    }
    
    if (identificationError) {
      return (
        <View style={styles.analysisContainer}>
          <IconButton icon="alert-circle" size={48} iconColor={theme.colors.error} />
          <Text style={[styles.analysisText, { color: theme.colors.onSurface }]}>
            {identificationError}
          </Text>
          <Button 
            mode="contained" 
            onPress={retakePicture}
            style={styles.actionButton}
          >
            Take New Photo
          </Button>
        </View>
      );
    }
    
    if (identificationResults) {
      return (
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
          <Card style={styles.resultCard}>
            <Image source={{ uri: capturedImage || '' }} style={styles.resultImage} />
            <Card.Content>
              <View style={styles.confidenceRow}>
                <View style={[styles.chipContainer, styles.confidenceChip]}>
                  <IconButton icon="check-circle" size={18} style={styles.chipIcon} />
                  <Text style={styles.chipText}>
                    {identificationResults.probability ? Math.round(identificationResults.probability * 100) : 90}% Match
                  </Text>
                </View>
                {!isPremium && (
                  <View style={[styles.chipContainer, styles.premiumChip]}>
                    <IconButton icon="star" size={18} style={styles.chipIcon} />
                    <Text style={styles.chipText}>Premium</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.plantName}>{identificationResults.commonName || identificationResults.name}</Text>
              <Text style={styles.scientificName}>{identificationResults.scientificName}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.sectionTitle}>About this plant</Text>
              <Text style={styles.description}>
                {identificationResults.description || 'No description available.'}
              </Text>
              
              {isPremium && identificationResults.careInstructions && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Care Instructions</Text>
                  
                  {identificationResults.careInstructions.wateringFrequency && (
                    <View style={styles.careItem}>
                      <IconButton icon="water" size={24} />
                      <Text style={styles.careText}>{identificationResults.careInstructions.wateringFrequency}</Text>
                    </View>
                  )}
                  
                  {identificationResults.careInstructions.sunlightNeeds && (
                    <View style={styles.careItem}>
                      <IconButton icon="white-balance-sunny" size={24} />
                      <Text style={styles.careText}>{identificationResults.careInstructions.sunlightNeeds}</Text>
                    </View>
                  )}
                  
                  {identificationResults.careInstructions.soilType && (
                    <View style={styles.careItem}>
                      <IconButton icon="flower" size={24} />
                      <Text style={styles.careText}>{identificationResults.careInstructions.soilType}</Text>
                    </View>
                  )}
                </>
              )}
              
              {!isPremium && (
                <View style={styles.premiumPrompt}>
                  <Text style={styles.premiumText}>
                    Upgrade to Premium for detailed care instructions and more features
                  </Text>
                  <Button mode="contained" onPress={() => {}} style={styles.upgradeButton}>
                    Upgrade to Premium
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
          
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={retakePicture}
              style={[styles.actionButton, styles.retakeButton]}
              icon="camera"
            >
              Take New Photo
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => {}}
              style={styles.actionButton}
              icon="bookmark-outline"
            >
              Save to Collection
            </Button>
          </View>
        </ScrollView>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => (camera = ref)}
            style={styles.camera}
            type={cameraType}
            ratio="16:9"
            onCameraReady={() => setCameraReady(true)}
          >
            <View style={styles.overlay}>
              <View style={styles.overlayTop} />
              <View style={styles.overlayMiddle}>
                <View style={styles.overlayMiddleLeft} />
                <View style={styles.focusBox} />
                <View style={styles.overlayMiddleRight} />
              </View>
              <View style={styles.overlayBottom}>
                <Text style={[styles.helperText, { color: theme.colors.onSurface }]}>
                  Center the plant in the frame
                </Text>
              </View>
            </View>
          </Camera>

          <View style={styles.cameraControls}>
            <IconButton
              icon="flash"
              size={28}
              onPress={() => {}}
              iconColor={theme.colors.onSurface}
            />
            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <IconButton
              icon="camera-flip"
              size={28}
              onPress={toggleCameraType}
              iconColor={theme.colors.onSurface}
            />
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          {!identificationResults && !isAnalyzing && !identificationError ? (
            <>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              <View style={styles.previewControls}>
                <Button mode="outlined" onPress={retakePicture} style={styles.previewButton}>
                  Retake
                </Button>
                <Button 
                  mode="contained" 
                  onPress={analyzePlant} 
                  style={styles.previewButton}
                  loading={isAnalyzing}
                  disabled={isAnalyzing}
                >
                  Identify Plant
                </Button>
              </View>
            </>
          ) : (
            renderResults()
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipIcon: {
    margin: 0,
    padding: 0,
  },
  chipText: {
    fontSize: 14,
    marginLeft: -4,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayTop: {
    flex: 1,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 300,
  },
  overlayMiddleLeft: {
    flex: 1,
  },
  overlayMiddleRight: {
    flex: 1,
  },
  focusBox: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  overlayBottom: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  helperText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  previewButton: {
    flex: 1,
    margin: 10,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  analysisText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  analysisSubtext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  resultCard: {
    marginBottom: 16,
    elevation: 4,
  },
  resultImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  confidenceRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  confidenceChip: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  premiumChip: {
    backgroundColor: '#fff8e1',
    borderColor: '#FFD700',
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  careItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  careText: {
    flex: 1,
    fontSize: 16,
  },
  premiumPrompt: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeButton: {
    width: '100%',
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  retakeButton: {
    marginBottom: 16,
  },
});

export default IdentifyScreen;
