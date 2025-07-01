import { ComponentType } from 'react';
import { TextProps } from 'react-native';

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextProps['style'];
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}
