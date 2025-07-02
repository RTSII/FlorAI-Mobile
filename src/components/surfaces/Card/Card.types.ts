import { ReactNode } from 'react';
import { TouchableOpacityProps, ViewStyle, StyleProp } from 'react-native';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'image';
export type CardSize = 'small' | 'medium' | 'large';

export type CardProps = TouchableOpacityProps & {
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
