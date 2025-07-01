import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../theme/designTokens';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'image';
type CardSize = 'small' | 'medium' | 'large';

type CardProps = TouchableOpacityProps & {
  variant?: CardVariant;
  size?: CardSize;
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  imageHeader?: ReactNode;
  footer?: ReactNode;
};

export const Card = ({
  variant = 'elevated',
  size = 'medium',
  children,
  onPress,
  style,
  contentStyle,
  fullWidth = false,
  imageHeader,
  footer,
  ...props
}: CardProps) => {
  const theme = useTheme<AppTheme>();

  const getCardStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    };

    const sizeStyles: Record<CardSize, ViewStyle> = {
      small: {
        maxWidth: 160,
      },
      medium: {
        maxWidth: 300,
      },
      large: {
        maxWidth: '100%',
      },
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
      elevated: {
        backgroundColor: theme.colors.surface,
        ...theme.elevation.level1,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outline,
      },
      filled: {
        backgroundColor: theme.colors.surfaceVariant,
      },
      image: {
        backgroundColor: 'transparent',
      },
    };

    const contentPadding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    }[size];

    return StyleSheet.create({
      card: {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      },
      content: {
        padding: contentPadding,
      },
      footer: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
        padding: contentPadding,
      },
    });
  };

  const renderCardContent = () => (
    <>
      {imageHeader}
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  const styles = getCardStyles();

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]} {...props}>
      {renderCardContent()}
    </View>
  );
};

// Card variants
export const ElevatedCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="elevated" {...props} />
);

export const OutlinedCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="outlined" {...props} />
);

export const FilledCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="filled" {...props} />
);

export const ImageCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="image" {...props} />
);

export default Card;
