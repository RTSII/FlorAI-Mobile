import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import {
  Button as PaperButton,
  ButtonProps as PaperButtonProps,
  Text,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Base button props that extend Paper's ButtonProps
export interface ButtonProps extends Omit<PaperButtonProps, 'theme' | 'children'> {
  /**
   * Button text or child elements
   */
  children?: React.ReactNode;
  /**
   * Whether to show a loading indicator
   */
  loading?: boolean;
  /**
   * Custom style for the button container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Custom style for the button text
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Whether to use the full width of the container
   */
  fullWidth?: boolean;
  /**
   * Left icon name (from MaterialCommunityIcons)
   */
  leftIcon?: string;
  /**
   * Right icon name (from MaterialCommunityIcons)
   */
  rightIcon?: string;
  /**
   * Size of the button
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
}

/**
 * A customizable button component that extends React Native Paper's Button
 * with additional styling and functionality.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  style,
  containerStyle,
  textStyle,
  fullWidth = false,
  leftIcon,
  rightIcon,
  size = 'medium',
  variant = 'primary',
  contentStyle,
  labelStyle,
  ...rest
}) => {
  const theme = useTheme();
  const isOutlined = variant === 'outlined' || variant === 'text';
  const isText = variant === 'text';
  const isDanger = variant === 'danger';

  // Determine button colors based on variant
  const getButtonColors = () => {
    if (isText) return { backgroundColor: 'transparent', textColor: theme.colors.primary };
    if (isOutlined) return { backgroundColor: 'transparent', textColor: theme.colors.primary };
    if (isDanger) return { backgroundColor: theme.colors.error, textColor: theme.colors.onError };
    return {
      backgroundColor: theme.colors.primary,
      textColor: theme.colors.onPrimary,
    };
  };

  const { backgroundColor, textColor } = getButtonColors();

  // Determine button height and padding based on size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { height: 36, paddingHorizontal: 12, iconSize: 18, textSize: 14 };
      case 'large':
        return { height: 56, paddingHorizontal: 24, iconSize: 24, textSize: 16 };
      case 'medium':
      default:
        return { height: 48, paddingHorizontal: 20, iconSize: 20, textSize: 15 };
    }
  };

  const { height, paddingHorizontal, iconSize, textSize } = getButtonSize();

  // Render the left icon if provided
  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    return (
      <MaterialCommunityIcons
        name={leftIcon as any}
        size={iconSize}
        color={textColor}
        style={[styles.leftIcon, { marginRight: 8 }]}
      />
    );
  };

  // Render the right icon if provided
  const renderRightIcon = () => {
    if (!rightIcon) return null;
    return (
      <MaterialCommunityIcons
        name={rightIcon as any}
        size={iconSize}
        color={textColor}
        style={[styles.rightIcon, { marginLeft: 8 }]}
      />
    );
  };

  // Custom content for loading state
  const renderLoadingContent = () => (
    <View style={styles.loadingContent}>
      <MaterialCommunityIcons
        name="loading"
        size={iconSize}
        color={textColor}
        style={styles.loadingIcon}
      />
      <Text
        style={[
          styles.buttonText,
          { color: textColor, fontSize: textSize, marginLeft: 8 },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );

  // Custom content for normal state
  const renderNormalContent = () => (
    <View style={styles.contentContainer}>
      {renderLeftIcon()}
      <Text
        style={[
          styles.buttonText,
          {
            color: textColor,
            fontSize: textSize,
            fontWeight: isText ? '500' : '600',
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
      {renderRightIcon()}
    </View>
  );

  return (
    <View style={[fullWidth && styles.fullWidth, containerStyle]}>
      <PaperButton
        mode={isOutlined ? 'outlined' : 'contained'}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            height,
            minWidth: size === 'large' ? 200 : 120,
            backgroundColor: isOutlined ? 'transparent' : backgroundColor,
            borderColor: isDanger ? theme.colors.error : theme.colors.primary,
            borderRadius: 12,
            elevation: isText ? 0 : 2,
          },
          fullWidth && styles.fullWidthButton,
          style,
        ]}
        contentStyle={[
          styles.contentStyle,
          {
            paddingHorizontal,
            height: '100%',
          },
          contentStyle,
        ]}
        labelStyle={[
          styles.labelStyle,
          {
            color: textColor,
            fontSize: textSize,
            height: '100%',
            textTransform: 'none',
            marginVertical: 0,
            paddingVertical: 0,
          },
          labelStyle,
        ]}
        {...rest}
      >
        {loading ? renderLoadingContent() : renderNormalContent()}
      </PaperButton>
    </View>
  );
};

// Floating Action Button component
export interface FABProps {
  /**
   * Icon name (from MaterialCommunityIcons)
   */
  icon: string;
  /**
   * Button label
   */
  label?: string;
  /**
   * Whether the FAB is visible
   */
  visible?: boolean;
  /**
   * Callback when pressed
   */
  onPress: () => void;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom icon color
   */
  color?: string;
  /**
   * Custom background color
   */
  backgroundColor?: string;
  /**
   * Size of the FAB
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show the label
   */
  showLabel?: boolean;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  visible = true,
  onPress,
  style,
  color,
  backgroundColor,
  size = 'medium',
  showLabel = false,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const getSize = () => {
    switch (size) {
      case 'small':
        return { size: 40, iconSize: 20, padding: 8 };
      case 'large':
        return { size: 72, iconSize: 32, padding: 16 };
      case 'medium':
      default:
        return { size: 56, iconSize: 24, padding: 12 };
    }
  };

  const { size: fabSize, iconSize, padding } = getSize();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.fab,
        {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: backgroundColor || theme.colors.primary,
          padding,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={iconSize}
        color={color || theme.colors.onPrimary}
      />
      {showLabel && label && (
        <Text
          style={[
            styles.fabLabel,
            {
              color: color || theme.colors.onPrimary,
              marginLeft: 8,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  },
  contentStyle: {
    margin: 0,
    padding: 0,
  },
  labelStyle: {
    margin: 0,
    padding: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  buttonText: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fabLabel: {
    marginLeft: 8,
    fontWeight: '600',
  },
});
