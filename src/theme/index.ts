import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

// Light Theme Colors
export const lightColors = {
  ...PaperDefaultTheme.colors,
  ...NavigationDefaultTheme.colors,
  primary: '#2E7D32',
  primaryContainer: '#A5D6A7',
  secondary: '#558B2F',
  secondaryContainer: '#C5E1A5',
  tertiary: '#33691E',
  tertiaryContainer: '#B9F6CA',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceVariant: '#E8F5E9',
  error: '#B00020',
  errorContainer: '#FFCDD2',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1B5E20',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1B5E20',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#1B5E20',
  onBackground: '#212121',
  onSurface: '#212121',
  onSurfaceVariant: '#424242',
  onError: '#FFFFFF',
  onErrorContainer: '#B00020',
  outline: '#757575',
  outlineVariant: '#BDBDBD',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#212121',
  inverseOnSurface: '#FFFFFF',
  inversePrimary: '#81C784',
  surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
  onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  elevation: {
    level0: 'transparent',
    level1: '#F5F5F5',
    level2: '#EEEEEE',
    level3: '#E0E0E0',
    level4: '#BDBDBD',
    level5: '#9E9E9E',
  },
};

// Dark Theme Colors
export const darkColors = {
  ...PaperDarkTheme.colors,
  ...NavigationDarkTheme.colors,
  primary: '#81C784',
  primaryContainer: '#2E7D32',
  secondary: '#A5D6A7',
  secondaryContainer: '#1B5E20',
  tertiary: '#B9F6CA',
  tertiaryContainer: '#33691E',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',
  error: '#CF6679',
  errorContainer: '#B00020',
  onPrimary: '#000000',
  onPrimaryContainer: '#E8F5E9',
  onSecondary: '#000000',
  onSecondaryContainer: '#E8F5E9',
  onTertiary: '#000000',
  onTertiaryContainer: '#E8F5E9',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#E0E0E0',
  onError: '#000000',
  onErrorContainer: '#FFCDD2',
  outline: '#9E9E9E',
  outlineVariant: '#424242',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E0E0E0',
  inverseOnSurface: '#212121',
  inversePrimary: '#2E7D32',
  surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
  onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
  backdrop: 'rgba(0, 0, 0, 0.7)',
  elevation: {
    level0: 'transparent',
    level1: '#1E1E1E',
    level2: '#2D2D2D',
    level3: '#424242',
    level4: '#616161',
    level5: '#757575',
  },
};

// Common theme properties
const commonTheme = {
  roundness: 12,
  animation: {
    scale: 1.0,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
};

// Light Theme
export const lightTheme = {
  ...PaperDefaultTheme,
  ...commonTheme,
  colors: lightColors,
  dark: false,
};

// Dark Theme
export const darkTheme = {
  ...PaperDarkTheme,
  ...commonTheme,
  colors: darkColors,
  dark: true,
};

// Export the theme type
export type AppTheme = typeof lightTheme;

// Default theme (can be changed based on user preference)
export const defaultTheme = lightTheme;

// Helper function to get theme colors with type safety
export const getThemeColors = (theme: AppTheme) => theme.colors;

// Helper function to get theme spacing
export const getSpacing = (theme: AppTheme, size: keyof typeof commonTheme.spacing) =>
  theme.spacing[size];

// Helper function to get border radius
export const getBorderRadius = (theme: AppTheme, size: keyof typeof commonTheme.borderRadii) =>
  theme.borderRadii[size];
