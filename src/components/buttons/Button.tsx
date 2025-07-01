import React, { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../theme/designTokens';
import { Text } from '../typography/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'elevated' | 'danger' | 'premium';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = TouchableOpacityProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string | ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
};

export const Button = ({
  variant = 'primary',
  size = 'medium',
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}: ButtonProps) => {
  const theme = useTheme<AppTheme>();

  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled ? 0.5 : 1,
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        height: 32,
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        height: 40,
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        height: 48,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.outline,
      },
      text: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
      },
      elevated: {
        backgroundColor: theme.colors.surface,
        ...theme.elevation.level1,
      },
      danger: {
        backgroundColor: theme.colors.error,
      },
      premium: {
        backgroundColor: theme.colors.premium,
      },
    };

    return StyleSheet.create({
      button: {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      },
      labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      leftIcon: {
        marginRight: 8,
      },
      rightIcon: {
        marginLeft: 8,
      },
    });
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'labelLarge';
      case 'large':
        return 'titleMedium';
      case 'medium':
      default:
        return 'labelLarge';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'premium':
        return theme.colors.onPrimary;
      case 'outlined':
      case 'text':
        return theme.colors.primary;
      case 'elevated':
      default:
        return theme.colors.onSurface;
    }
  };

  const styles = getButtonStyles();
  const textVariant = getTextVariant();
  const textColor = getTextColor();

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={variant === 'text' || variant === 'outlined' ? theme.colors.primary : theme.colors.onPrimary}
        />
      );
    }

    return (
      <>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <Text variant={textVariant} color={textColor} weight="medium">
          {label}
        </Text>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Button variants
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

export const OutlinedButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="outlined" {...props} />
);

export const TextButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="text" {...props} />
);

export const ElevatedButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="elevated" {...props} />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
);

export const PremiumButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="premium" {...props} />
);

export default Button;
