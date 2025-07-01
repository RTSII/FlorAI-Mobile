import 'react-native';
import * as React from 'react';
import {
  ViewStyle as RNViewStyle,
  TextStyle as RNTextStyle,
  ImageStyle as RNImageStyle,
  TextInputProps as RNTextInputProps,
  ViewProps as RNViewProps,
  TextProps as RNTextProps,
  ImageSourcePropType as RNImageSourcePropType,
  StyleProp,
  ImageURISource,
} from 'react-native';

declare module 'react-native-paper' {
  // Theme types
  export interface MD3Theme {
    colors: {
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
    };
    dark: boolean;
    roundness: number;
    animation: {
      scale: number;
    };
  }

  export type Theme = MD3Theme;

  // Add any missing or overridden types here
  export interface ButtonProps extends ViewProps {
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
  }

  export const Button: React.ComponentType<ButtonProps>;

  export interface TextProps extends RNTextProps {
    variant?: keyof typeof variants;
    children?: React.ReactNode;
    style?: TextStyle | TextStyle[];
  }

  export const Text: React.ComponentType<TextProps>;

  export interface DialogProps extends ViewProps {
    visible: boolean;
    onDismiss: () => void;
    dismissable?: boolean;
    children: React.ReactNode;
  }

  // DefaultTheme type
  export const DefaultTheme: Theme;

  // MD3LightTheme constant
  export const MD3LightTheme: Theme;

  // MD3Theme type
  export type MD3Theme = Theme;

  // useTheme hook
  export function useTheme(): Theme;

  // Searchbar component
  export interface SearchbarProps {
    value: string;
    onChangeText?: (query: string) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    theme?: Theme;
    icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
    iconColor?: string;
    elevation?: number;
    mode?: 'bar' | 'view';
    inputStyle?: StyleProp<TextStyle>;
    placeholderTextColor?: string;
    selectionColor?: string;
    underlineColor?: string;
    testID?: string;
  }

  export const Searchbar: React.ComponentType<SearchbarProps>;

  // Chip component
  export interface ChipProps {
    mode?: 'flat' | 'outlined';
    selected?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
    selectedColor?: string;
    testID?: string;
  }

  export const Chip: React.ComponentType<ChipProps>;

  // Card component
  export interface CardProps {
    style?: StyleProp<ViewStyle>;
    theme?: Theme;
    onPress?: () => void;
    onLongPress?: () => void;
    mode?: 'elevated' | 'outlined' | 'contained';
    elevation?: number;
    testID?: string;
  }

  export const Card: React.ComponentType<CardProps> & {
    Content: React.ComponentType<{ style?: StyleProp<ViewStyle>; children: React.ReactNode }>;
    Cover: React.ComponentType<{ source: ImageURISource; style?: StyleProp<ImageStyle> }>;
    Title: React.ComponentType<{ children: React.ReactNode }>;
  };

  // Title component
  export interface TitleProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    theme?: Theme;
    testID?: string;
  }

  export const Title: React.ComponentType<TitleProps>;

  // Paragraph component
  export interface ParagraphProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    theme?: Theme;
    testID?: string;
  }

  export const Paragraph: React.ComponentType<ParagraphProps>;

  // Dialog component
  export const Dialog: React.ComponentType<DialogProps> & {
    Title: React.ComponentType<{ children: React.ReactNode }>;
    Content: React.ComponentType<{ children: React.ReactNode }>;
    Actions: React.ComponentType<{ children: React.ReactNode }>;
  };

  export const Portal: React.ComponentType<{ children: React.ReactNode }>;

  export const useTheme: () => {
    colors: {
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
    };
    dark: boolean;
    roundness: number;
  };
}

// Define variants for text
declare const variants: {
  displayLarge: object;
  displayMedium: object;
  displaySmall: object;
  headlineLarge: object;
  headlineMedium: object;
  headlineSmall: object;
  titleLarge: object;
  titleMedium: object;
  titleSmall: object;
  labelLarge: object;
  labelMedium: object;
  labelSmall: object;
  bodyLarge: object;
  bodyMedium: object;
  bodySmall: object;
};
import { ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';

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
    dark: boolean;
    roundness: number;
    colors: ThemeColors;
    animation: {
      scale: number;
    };
  }

  // Common props
  export interface CommonProps {
    style?: ViewStyle | ViewStyle[];
    theme?: Theme;
    children?: React.ReactNode;
  }

  // Button component
  export interface ButtonProps extends CommonProps {
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
    color?: string;
    contentStyle?: ViewStyle | ViewStyle[];
    labelStyle?: TextStyle | TextStyle[];
    uppercase?: boolean;
    testID?: string;
  }

  export const Button: React.ComponentType<ButtonProps>;

  // Text component
  export interface TextProps extends CommonProps {
    variant?: keyof typeof variants;
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
    onPress?: () => void;
    testID?: string;
  }

  export const Text: React.ComponentType<TextProps>;

  // Dialog components
  export interface DialogProps extends CommonProps {
    visible: boolean;
    onDismiss: () => void;
    dismissable?: boolean;
  }

  export const Dialog: React.ComponentType<DialogProps> & {
    Title: React.ComponentType<CommonProps>;
    Content: React.ComponentType<CommonProps>;
    Actions: React.ComponentType<CommonProps>;
    ScrollArea: React.ComponentType<CommonProps>;
    Icon: React.ComponentType<{ icon: string; color?: string; size?: number }>;
  };

  export const Portal: React.ComponentType<{ children: React.ReactNode }>;
  export const useTheme: () => Theme;
  export const Provider: React.ComponentType<{ theme?: Theme; children: React.ReactNode }>;

  // Add other components as needed...
}

// Helper types
interface variants {
  displayLarge: object;
  displayMedium: object;
  displaySmall: object;
  headlineLarge: object;
  headlineMedium: object;
  headlineSmall: object;
  titleLarge: object;
  titleMedium: object;
  titleSmall: object;
  labelLarge: object;
  labelMedium: object;
  labelSmall: object;
  bodyLarge: object;
  bodyMedium: object;
  bodySmall: object;
}
