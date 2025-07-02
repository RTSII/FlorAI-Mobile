import React, { ReactNode } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../theme/designTokens';
import { styles } from './Card.styles';
import { CardProps, CardVariant, CardSize } from './Card.types';

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
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        backgroundColor: theme.colors.surface,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const cardStyles = getCardStyles();

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[cardStyles, style]}
      onPress={onPress}
      activeOpacity={0.8}
      {...(onPress ? props : {})}
    >
      {imageHeader && <View>{imageHeader}</View>}
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </CardContainer>
  );
};

// Card variants
export const ElevatedCard = (props: Omit<CardProps, 'variant'>) => {
  return <Card {...props} variant="elevated" />;
};

export const OutlinedCard = (props: Omit<CardProps, 'variant'>) => {
  return <Card {...props} variant="outlined" />;
};

export const FilledCard = (props: Omit<CardProps, 'variant'>) => {
  return <Card {...props} variant="filled" />;
};

export const ImageCard = (props: Omit<CardProps, 'variant'>) => {
  return <Card {...props} variant="image" />;
};

export default Card;
