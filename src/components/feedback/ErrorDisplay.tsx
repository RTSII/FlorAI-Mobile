import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../../store/AppContext.tsx';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider.tsx';
import { BodyMedium, TitleMedium } from '../typography/Typography.tsx';
import { Button } from '../buttons/Button.tsx';

interface ErrorDisplayProps {
  onRetry?: () => void;
}

/**
 * Error display component that shows when API calls fail
 * Styled according to the design system
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ onRetry }) => {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  
  // Only show the error when there is an error message in the global state
  if (!state.error) {
    return null;
  }
  
  // Clear the error message
  const handleDismiss = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.errorBox, { backgroundColor: theme.colors.surface }]}>
        <MaterialCommunityIcons 
          name="alert-circle" 
          size={32} 
          color={theme.colors.error} 
        />
        <TitleMedium 
          color={theme.colors.error}
          style={styles.errorTitle}
        >
          Error
        </TitleMedium>
        <BodyMedium 
          color={theme.colors.onSurface}
          style={styles.errorMessage}
        >
          {state.error}
        </BodyMedium>
        
        <View style={styles.buttonContainer}>
          <Button 
            variant="text"
            onPress={handleDismiss}
            style={styles.button}
            label="Dismiss"
          />
          
          {onRetry && (
            <Button 
              variant="primary"
              onPress={() => {
                handleDismiss();
                onRetry();
              }}
              style={styles.button}
              label="Retry"
            />
          )}
        </View>
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
  errorBox: {
    borderRadius: 16, // Using design system border radius
    padding: 24, // Using design system spacing
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // Using design system elevation
  },
  errorTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16, // Using design system spacing
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 8,
  },
});

export default ErrorDisplay;
