import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import {
  Card as PaperCard,
  Title,
  Paragraph,
  useTheme,
  Text,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'contained';

export interface CardProps {
  /**
   * The content to display inside the card
   */
  children: ReactNode;
  /**
   * Style for the card container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the card content
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the card is clickable
   */
  onPress?: () => void;
  /**
   * Variant of the card
   * @default 'elevated'
   */
  variant?: CardVariant;
  /**
   * Whether the card has rounded corners
   * @default true
   */
  rounded?: boolean;
  /**
   * Whether the card has a shadow
   * @default true
   */
  shadow?: boolean;
  /**
   * Elevation level (Android only)
   * @default 2
   */
  elevation?: number;
  /**
   * Border radius
   * @default 12
   */
  borderRadius?: number;
  /**
   * Background color of the card
   */
  backgroundColor?: string;
}

/**
 * A customizable card component with multiple variants
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  onPress,
  variant = 'elevated',
  rounded = true,
  shadow = true,
  elevation = 2,
  borderRadius = 12,
  backgroundColor,
  ...rest
}) => {
  const theme = useTheme();

  // Determine card style based on variant
  const getCardStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      borderRadius: rounded ? borderRadius : 0,
      backgroundColor: backgroundColor || theme.colors.surface,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          elevation: 0,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceVariant,
          elevation: 0,
        };
      case 'contained':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primaryContainer,
          elevation: elevation,
        };
      case 'elevated':
      default:
        return {
          ...baseStyle,
          elevation: shadow ? elevation : 0,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadow ? 0.1 : 0,
          shadowRadius: 8,
        };
    }
  };

  const cardContent = (
    <PaperCard
      style={[styles.card, getCardStyle(), style]}
      contentStyle={[styles.content, contentStyle]}
      {...rest}
    >
      {children}
    </PaperCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

export interface CardHeaderProps {
  /**
   * Title of the card
   */
  title?: string;
  /**
   * Subtitle of the card
   */
  subtitle?: string;
  /**
   * Avatar source or element
   */
  avatar?: ReactNode | string;
  /**
   * Action elements to display on the right side
   */
  action?: ReactNode;
  /**
   * Style for the header container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the title
   */
  titleStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the subtitle
   */
  subtitleStyle?: StyleProp<ViewStyle>;
  /**
   * Whether to show a divider below the header
   * @default false
   */
  divider?: boolean;
}

/**
 * Card header component with title, subtitle, avatar, and action
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  style,
  titleStyle,
  subtitleStyle,
  divider = false,
}) => {
  const theme = useTheme();

  const renderAvatar = () => {
    if (!avatar) return null;

    if (typeof avatar === 'string') {
      return <Avatar.Image size={40} source={{ uri: avatar }} style={styles.avatar} />;
    }

    return <View style={styles.avatar}>{avatar}</View>;
  };

  return (
    <View>
      <View style={[styles.header, style]}>
        <View style={styles.headerContent}>
          {renderAvatar()}
          <View style={styles.headerTextContainer}>
            {title && (
              <Title
                style={[styles.title, { color: theme.colors.onSurface }, titleStyle]}
                numberOfLines={1}
              >
                {title}
              </Title>
            )}
            {subtitle && (
              <Text
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }, subtitleStyle]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {action && <View style={styles.action}>{action}</View>}
      </View>
      {divider && (
        <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
      )}
    </View>
  );
};

export interface CardMediaProps {
  /**
   * Image source
   */
  source: ImageSourcePropType;
  /**
   * Height of the media
   * @default 200
   */
  height?: number;
  /**
   * Style for the media container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the image
   */
  imageStyle?: StyleProp<ImageStyle>;
  /**
   * Whether to show a gradient overlay
   * @default false
   */
  withGradient?: boolean;
  /**
   * Content to display over the media
   */
  overlayContent?: ReactNode;
}

/**
 * Card media component for displaying images with optional overlay
 */
export const CardMedia: React.FC<CardMediaProps> = ({
  source,
  height = 200,
  style,
  imageStyle,
  withGradient = false,
  overlayContent,
}) => {
  return (
    <View style={[styles.mediaContainer, { height }, style]}>
      <Image source={source} style={[styles.media, { height }, imageStyle]} resizeMode="cover" />
      {withGradient && <View style={styles.gradient} />}
      {overlayContent && <View style={styles.overlayContent}>{overlayContent}</View>}
    </View>
  );
};

export interface CardContentProps {
  /**
   * Content to display
   */
  children: ReactNode;
  /**
   * Style for the content container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether to add padding
   * @default true
   */
  padded?: boolean;
}

/**
 * Card content container with consistent padding
 */
export const CardContent: React.FC<CardContentProps> = ({ children, style, padded = true }) => (
  <View style={[padded && styles.contentPadding, style]}>{children}</View>
);

export interface CardActionsProps {
  /**
   * Action buttons or elements
   */
  children: ReactNode;
  /**
   * Style for the actions container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Alignment of the actions
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /**
   * Whether to add top padding
   * @default true
   */
  paddingTop?: boolean;
}

/**
 * Card actions container for buttons and other interactive elements
 */
export const CardActions: React.FC<CardActionsProps> = ({
  children,
  style,
  align = 'end',
  paddingTop = true,
}) => {
  const getJustifyContent = () => {
    switch (align) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      case 'space-between':
        return 'space-between';
      case 'space-around':
        return 'space-around';
      default:
        return 'flex-end';
    }
  };

  return (
    <View
      style={[
        styles.actions,
        {
          justifyContent: getJustifyContent(),
          paddingTop: paddingTop ? 8 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export interface CardFooterProps {
  /**
   * Left side content
   */
  leftContent?: ReactNode;
  /**
   * Right side content
   */
  rightContent?: ReactNode;
  /**
   * Style for the footer container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether to show a divider above the footer
   * @default false
   */
  divider?: boolean;
}

/**
 * Card footer with left and right content areas
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  leftContent,
  rightContent,
  style,
  divider = false,
}) => {
  const theme = useTheme();

  return (
    <View>
      {divider && (
        <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
      )}
      <View style={[styles.footer, style]}>
        <View style={styles.footerLeft}>{leftContent}</View>
        <View style={styles.footerRight}>{rightContent}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    margin: 0,
    padding: 0,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  action: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  media: {
    width: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  contentPadding: {
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    marginLeft: 'auto',
  },
});
