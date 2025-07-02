import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AppProviders } from './src/contexts';

// Import AppNavigator
import AppNavigator from './src/navigation/AppNavigator';

// Import theme
import { colors } from './src/theme/designTokens';

// Extend the theme with our custom colors
const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
} as const;

// Create navigation theme with proper type safety
const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: appTheme.colors.primary,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    text: appTheme.colors.onSurface,
    border: appTheme.colors.outlineVariant,
    notification: appTheme.colors.error,
  },
} as const;

const App = (): JSX.Element => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <AppProviders>
          <StatusBar barStyle="dark-content" backgroundColor={appTheme.colors.surface} />
          <AppNavigator theme={navigationTheme} />
        </AppProviders>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
