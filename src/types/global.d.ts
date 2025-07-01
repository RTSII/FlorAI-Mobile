// Global type definitions for the FlorAI-Mobile app

// Import React Native types
import type { ViewStyle, TextStyle, TextProps as RNTextProps } from 'react-native';
import { ComponentType } from 'react';

// Type definitions for React Native Paper
declare module 'react-native-paper' {

  // Theme types
  export interface ThemeColors {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
    surfaceDisabled: string;
    onSurfaceDisabled: string;
    backdrop: string;
  }

  export interface Theme {
    colors: ThemeColors;
    dark: boolean;
    roundness: number;
    animation: {
      scale: number;
    };
  }

  // Common props for all components
  export interface CommonProps {
    style?: ViewStyle | ViewStyle[];
    theme?: Theme;
    children?: React.ReactNode;
    testID?: string;
    key?: string | number;
  }

  // Button component
  export interface ButtonProps {
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
    color?: string;
    contentStyle?: ViewStyle | ViewStyle[];
    labelStyle?: TextStyle | TextStyle[];
    uppercase?: boolean;
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
  }

  export const Button: ComponentType<ButtonProps>;

  // Text component
  export interface TextProps extends RNTextProps, CommonProps {
    variant?: string;
    children?: React.ReactNode;
  }

  export const Text: ComponentType<TextProps>;

  // Dialog components
  export interface DialogProps {
    visible: boolean;
    onDismiss: () => void;
    dismissable?: boolean;
    children?: React.ReactNode;
  }

  export const Dialog: ComponentType<DialogProps> & {
    Title: ComponentType<CommonProps>;
    Content: ComponentType<CommonProps>;
    Actions: ComponentType<CommonProps>;
    ScrollArea: ComponentType<CommonProps>;
  };

  // Theme provider
  export const PaperProvider: ComponentType<{
    theme?: Theme;
    children: React.ReactNode;
  }>;

  // Theme hook
  export const useTheme: () => Theme;

  // Portal component
  export const Portal: ComponentType<{ children: React.ReactNode }>;

  // Theme variants
  export const MD3LightTheme: Theme;
  export const MD3DarkTheme: Theme;

  // UI Components
  export interface SearchbarProps {
    placeholder?: string;
    value: string;
    onChangeText?: (query: string) => void;
    onIconPress?: () => void;
    icon?: string | ((props: { color: string; size: number }) => React.ReactNode);
    style?: ViewStyle | ViewStyle[];
    inputStyle?: TextStyle | TextStyle[];
    theme?: Theme;
  }

  export const Searchbar: ComponentType<SearchbarProps>;

  export interface ChipProps {
    mode?: 'flat' | 'outlined';
    selected?: boolean;
    onPress?: () => void;
    icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
    selectedColor?: string;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
  }

  export const Chip: ComponentType<ChipProps>;

  export interface CardProps extends CommonProps {
    mode?: 'elevated' | 'outlined' | 'contained';
    style?: ViewStyle | ViewStyle[];
    contentStyle?: ViewStyle | ViewStyle[];
    onPress?: () => void;
  }

  export const Card: ComponentType<CardProps> & {
    Title: ComponentType<CommonProps & { title: string; subtitle?: string }>;
    Content: ComponentType<CommonProps>;
    Actions: ComponentType<CommonProps>;
    Cover: ComponentType<{ source: { uri: string } }>;
  };

  export interface TitleProps extends CommonProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
  }

  export const Title: ComponentType<TitleProps>;

  export interface ParagraphProps extends CommonProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
  }

  export const Paragraph: ComponentType<ParagraphProps>;
}

// Add global type augmentations if needed
