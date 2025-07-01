import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Button, IconButton, useTheme, Surface } from 'react-native-paper';
import { Camera, CameraType } from 'expo-camera';

const IdentifyScreen = () => {
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  let camera: Camera | null = null;

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
  };

  const analyzePlant = () => {
    // TODO: Implement plant identification logic
    console.log('Analyzing plant...');
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
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewActions}>
            <Button mode="outlined" onPress={retakePicture} style={styles.actionButton}>
              Retake
            </Button>
            <Button
              mode="contained"
              onPress={analyzePlant}
              style={[styles.actionButton, { marginLeft: 16 }]}
            >
              Identify Plant
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayMiddle: {
    flex: 2,
    flexDirection: 'row',
  },
  overlayMiddleLeft: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  focusBox: {
    flex: 8,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  overlayMiddleRight: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  actionButton: {
    minWidth: 120,
  },
});

export default IdentifyScreen;
