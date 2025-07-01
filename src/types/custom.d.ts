// Type definitions for various file imports

type ImageSourcePropType = import('react-native').ImageSourcePropType;

declare module '*.png' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.gif' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Support for importing JSON files
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

// Support for importing TypeScript/JavaScript files
declare module '*.ts' {
  const value: unknown;
  export default value;
}

declare module '*.tsx' {
  const value: unknown;
  export default value;
}

declare module '*.js' {
  const value: unknown;
  export default value;
}

declare module '*.jsx' {
  const value: unknown;
  export default value;
}
