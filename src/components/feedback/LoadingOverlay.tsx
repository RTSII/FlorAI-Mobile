import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAppContext } from '../../store/AppContext.tsx';
import { useTheme } from '../../providers/ThemeProvider.tsx';
import { BodyMedium } from '../typography/Typography.tsx';

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Loading overlay component that displays when API calls are in progress
 * Styled according to the design system
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...' 
}) => {
  const { state } = useAppContext();
  const theme = useTheme();
  
  // Only show the overlay when the global loading state is true
  if (!state.isLoading) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <View style={[styles.loadingBox, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
        />
        <BodyMedium 
          style={styles.loadingText}
          color={theme.colors.onSurface}
        >
          {message}
        </BodyMedium>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    borderRadius: 16, // Using design system border radius
    padding: 24, // Using design system spacing
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // Using design system elevation
  },
  loadingText: {
    marginTop: 16, // Using design system spacing
  },
});

export default LoadingOverlay;
