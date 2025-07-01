import { MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { Platform } from 'react-native';

// Extended color palette type
type ExtendedColors = MD3Theme['colors'] & {
  // Primary Colors
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  // Secondary Colors
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  
  // Tertiary Colors
  tertiary: string;
  tertiaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  
  // Surface & Background Colors
  surface: string;
  surfaceVariant: string;
  background: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  
  // Semantic Colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI Colors
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  
  // Premium Features
  premium: string;
  premiumGradient: [string, string];
};

// Color Palette - From florAI_comprehensive_ux_workflow.md
export const colors: ExtendedColors = {
  // From MD3Theme
  ...MD3LightTheme.colors,
  // Custom colors
  // Primary Colors
  primary: '#2E7D32',
  primaryContainer: '#A8F5A8',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#002204',
  // Secondary Colors
  secondary: '#52634F',
  secondaryContainer: '#D4E8D0',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#101F0F',
  // Tertiary Colors
  tertiary: '#38656A',
  tertiaryContainer: '#BCEBF1',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#002023',
  // Surface & Background Colors
  surface: '#FEFBFF',
  surfaceVariant: '#DFE4D7',
  background: '#FEFBFF',
  onBackground: '#1A1C18',
  onSurface: '#1A1C18',
  onSurfaceVariant: '#43483E',
  // Semantic Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  // UI Colors
  outline: '#73796E',
  outlineVariant: '#C3C8BC',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.5)',
  // Premium Features
  premium: '#FFB300',
  premiumGradient: ['#FFB300', '#FF8F00'],
  // Required MD3Theme colors with default values
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  inverseSurface: '#2F3033',
  inverseOnSurface: '#F1F0F4',
  inversePrimary: '#A8F5A8',
  surfaceDisabled: '#E6E0E9',
  onSurfaceDisabled: '#1C1B1F',
  backdrop: '#6F7970',
};

// Typography - From florAI_comprehensive_ux_workflow.md
export const typography = {
  fontFamily: {
    // Platform-specific fonts with fallbacks
    regular: Platform.select({
      ios: 'System', // SF Pro on iOS
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    light: Platform.select({
      ios: 'System-Light',
      android: 'Roboto-Light',
      default: 'System',
    }),
    thin: Platform.select({
      ios: 'System-Thin',
      android: 'Roboto-Thin',
      default: 'System',
    }),
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    light: '300',
    thin: '200',
  },
  // Typography scale following Material Design 3
  fontSize: {
    // Display
    displayLarge: 57,
    displayMedium: 45,
    displaySmall: 36,
    // Headline
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    // Title
    titleLarge: 22,
    titleMedium: 16,
    titleSmall: 14,
    // Body
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    // Label
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 11,
    // Custom sizes
    button: 14,
    input: 16,
  },
  // Line heights (in points) for optimal readability
  lineHeight: {
    displayLarge: 64,
    displayMedium: 52,
    displaySmall: 44,
    headlineLarge: 40,
    headlineMedium: 36,
    headlineSmall: 32,
    titleLarge: 28,
    titleMedium: 24,
    titleSmall: 20,
    bodyLarge: 24,
    bodyMedium: 20,
    bodySmall: 16,
    labelLarge: 20,
    labelMedium: 16,
    labelSmall: 16,
    button: 20,
    input: 24,
  },
  // Letter spacing for better readability
  letterSpacing: {
    displayLarge: -0.25,
    displayMedium: 0,
    displaySmall: 0,
    headlineLarge: 0,
    headlineMedium: 0,
    headlineSmall: 0,
    titleLarge: 0,
    titleMedium: 0.1,
    titleSmall: 0.1,
    bodyLarge: 0.5,
    bodyMedium: 0.25,
    bodySmall: 0.4,
    labelLarge: 0.1,
    labelMedium: 0.5,
    labelSmall: 0.5,
    button: 0.1,
    input: 0.5,
  },
} as const;

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Elevation
export const elevation = {
  level0: 'none',
  level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
  level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
  level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
} as const;

// Animation
export const animation = {
  scale: 1, // Required by MD3Theme
  timing: {
    short: 150,
    standard: 250,
    long: 300,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
} as const;

// Export theme type
export type AppTheme = typeof MD3LightTheme & {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  elevation: typeof elevation;
  animation: typeof animation;
};

// Create theme
export const createTheme = (): AppTheme => ({
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  roundness: borderRadius.md,
});

// Default theme
export const theme = createTheme();

export default theme;
