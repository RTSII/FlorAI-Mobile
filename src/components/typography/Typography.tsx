import React, { ReactNode } from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../theme/designTokens';

type TextVariant = keyof typeof variantStyles;

type TextProps = RNTextProps & {
  variant?: TextVariant;
  children: ReactNode;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'regular' | 'medium' | 'light' | 'thin';
  style?: any;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
};

const variantStyles = {
  // Display
  displayLarge: 'displayLarge',
  displayMedium: 'displayMedium',
  displaySmall: 'displaySmall',
  // Headline
  headlineLarge: 'headlineLarge',
  headlineMedium: 'headlineMedium',
  headlineSmall: 'headlineSmall',
  // Title
  titleLarge: 'titleLarge',
  titleMedium: 'titleMedium',
  titleSmall: 'titleSmall',
  // Body
  bodyLarge: 'bodyLarge',
  bodyMedium: 'bodyMedium',
  bodySmall: 'bodySmall',
  // Label
  labelLarge: 'labelLarge',
  labelMedium: 'labelMedium',
  labelSmall: 'labelSmall',
} as const;

export const Text = ({
  variant = 'bodyMedium',
  children,
  color,
  align = 'left',
  weight = 'regular',
  style,
  numberOfLines,
  ellipsizeMode,
  ...props
}: TextProps) => {
  const theme = useTheme<AppTheme>();
  
  const getFontFamily = () => {
    switch (weight) {
      case 'medium':
        return theme.typography.fontFamily.medium;
      case 'light':
        return theme.typography.fontFamily.light;
      case 'thin':
        return theme.typography.fontFamily.thin;
      case 'regular':
      default:
        return theme.typography.fontFamily.regular;
    }
  };

  const getStyles = () => {
    const variantStyle = {
      // Display
      displayLarge: {
        fontSize: theme.typography.fontSize.displayLarge,
        lineHeight: theme.typography.lineHeight.displayLarge,
        fontFamily: getFontFamily(),
      },
      displayMedium: {
        fontSize: theme.typography.fontSize.displayMedium,
        lineHeight: theme.typography.lineHeight.displayMedium,
        fontFamily: getFontFamily(),
      },
      displaySmall: {
        fontSize: theme.typography.fontSize.displaySmall,
        lineHeight: theme.typography.lineHeight.displaySmall,
        fontFamily: getFontFamily(),
      },
      // Headline
      headlineLarge: {
        fontSize: theme.typography.fontSize.headlineLarge,
        lineHeight: theme.typography.lineHeight.headlineLarge,
        fontFamily: getFontFamily(),
      },
      headlineMedium: {
        fontSize: theme.typography.fontSize.headlineMedium,
        lineHeight: theme.typography.lineHeight.headlineMedium,
        fontFamily: getFontFamily(),
      },
      headlineSmall: {
        fontSize: theme.typography.fontSize.headlineSmall,
        lineHeight: theme.typography.lineHeight.headlineSmall,
        fontFamily: getFontFamily(),
      },
      // Title
      titleLarge: {
        fontSize: theme.typography.fontSize.titleLarge,
        lineHeight: theme.typography.lineHeight.titleLarge,
        fontFamily: getFontFamily(),
      },
      titleMedium: {
        fontSize: theme.typography.fontSize.titleMedium,
        lineHeight: theme.typography.lineHeight.titleMedium,
        fontFamily: getFontFamily(),
      },
      titleSmall: {
        fontSize: theme.typography.fontSize.titleSmall,
        lineHeight: theme.typography.lineHeight.titleSmall,
        fontFamily: getFontFamily(),
      },
      // Body
      bodyLarge: {
        fontSize: theme.typography.fontSize.bodyLarge,
        lineHeight: theme.typography.lineHeight.bodyLarge,
        fontFamily: getFontFamily(),
      },
      bodyMedium: {
        fontSize: theme.typography.fontSize.bodyMedium,
        lineHeight: theme.typography.lineHeight.bodyMedium,
        fontFamily: getFontFamily(),
      },
      bodySmall: {
        fontSize: theme.typography.fontSize.bodySmall,
        lineHeight: theme.typography.lineHeight.bodySmall,
        fontFamily: getFontFamily(),
      },
      // Label
      labelLarge: {
        fontSize: theme.typography.fontSize.labelLarge,
        lineHeight: theme.typography.lineHeight.labelLarge,
        fontFamily: getFontFamily(),
      },
      labelMedium: {
        fontSize: theme.typography.fontSize.labelMedium,
        lineHeight: theme.typography.lineHeight.labelMedium,
        fontFamily: getFontFamily(),
      },
      labelSmall: {
        fontSize: theme.typography.fontSize.labelSmall,
        lineHeight: theme.typography.lineHeight.labelSmall,
        fontFamily: getFontFamily(),
      },
    }[variant];

    return StyleSheet.create({
      text: {
        ...variantStyle,
        color: color || theme.colors.onBackground,
        textAlign: align,
      },
    });
  };

  const styles = getStyles();

  return (
    <RNText
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Typography component variants
export const DisplayLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="displayLarge" {...props} />
);

export const DisplayMedium = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="displayMedium" {...props} />
);

export const DisplaySmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="displaySmall" {...props} />
);

export const HeadlineLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="headlineLarge" {...props} />
);

export const HeadlineMedium = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="headlineMedium" {...props} />
);

export const HeadlineSmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="headlineSmall" {...props} />
);

export const TitleLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="titleLarge" {...props} />
);

export const TitleMedium = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="titleMedium" {...props} />
);

export const TitleSmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="titleSmall" {...props} />
);

export const BodyLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="bodyLarge" {...props} />
);

export const BodyMedium = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="bodyMedium" {...props} />
);

export const BodySmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="bodySmall" {...props} />
);

export const LabelLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="labelLarge" {...props} />
);

export const LabelMedium = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="labelMedium" {...props} />
);

export const LabelSmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="labelSmall" {...props} />
);

export default Text;
