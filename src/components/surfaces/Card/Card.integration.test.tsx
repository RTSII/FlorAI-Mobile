import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { render, fireEvent, RenderResult } from '@testing-library/react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Card } from './Card';

// Extend the theme type to include our custom properties
type CustomTheme = typeof MD3LightTheme & {
  colors: typeof MD3LightTheme.colors & {
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  roundness: number;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};

// Extend Jest matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      toHaveStyle(style: StyleProp<ViewStyle>): R;
    }
  }
}

// Extend the theme with our custom properties
const theme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  roundness: 4,
  elevation: {
    level0: '0px 0px 0px rgba(0, 0, 0, 0)',
    level1: '0px 1px 2px rgba(0, 0, 0, 0.3)',
    level2: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    level3: '0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    level4: '0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
    level5: '0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  },
};

// Simple test component to verify testing setup
const TestComponent = () => {
  return (
    <View>
      <Text>Test Component</Text>
    </View>
  );
};

const renderWithTheme = (component: React.ReactElement): RenderResult => {
  return render(<PaperProvider theme={theme}>{component}</PaperProvider>);
};

describe('Card Integration Tests', () => {
  it('integrates with other components correctly', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <TestComponent />
      </Card>
    );
    
    expect(getByText('Test Component')).toBeTruthy();
  });

  it('handles complex content structures', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <View>
          <Text>Header</Text>
          <View>
            <Text>Nested Content</Text>
          </View>
        </View>
      </Card>
    );
    
    expect(getByText('Header')).toBeTruthy();
    expect(getByText('Nested Content')).toBeTruthy();
  });

  it('integrates with image header and footer', () => {
    const { getByText } = renderWithTheme(
      <Card
        imageHeader={<View><Text>Image Header</Text></View>}
        footer={<View><Text>Footer Content</Text></View>}
      >
        <Text>Main Content</Text>
      </Card>
    );
    
    expect(getByText('Image Header')).toBeTruthy();
    expect(getByText('Main Content')).toBeTruthy();
    expect(getByText('Footer Content')).toBeTruthy();
  });
});
