import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { render, fireEvent, RenderResult } from '@testing-library/react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Card } from '../Card.tsx';

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
  } as const,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  } as const,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  } as const,
  roundness: 8,
  elevation: {
    level0: 'none',
    level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
    level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
    level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
  } as const,
} as AppTheme;

// Simple test component to verify testing setup
const TestComponent = () => (
  <View testID="test-component">
    <Text>Test Component</Text>
  </View>
);

const renderWithTheme = (component: React.ReactElement): RenderResult => {
  return render(<PaperProvider theme={theme}>{component}</PaperProvider>);
};

// Simple test component to verify testing setup
const TestComponent = () => (
  <View testID="test-component">
    <Text>Test Component</Text>
  </View>
);

describe('Card Integration Tests', () => {
  // Run before each test
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Simple test to verify testing setup
  it('should render a basic component', () => {
    const { getByTestId, getByText } = renderWithTheme(<TestComponent />);
    expect(getByTestId('test-component')).toBeTruthy();
    expect(getByText('Test Component')).toBeTruthy();
  });

  it('renders Card with default props', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <Card testID="test-card">Test Content</Card>,
    );

    const card = getByTestId('test-card');
    expect(card).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();

    // Verify default styles
    expect(card).toHaveStyle({
      elevation: 2,
      borderWidth: 0,
      backgroundColor: theme.colors.surface,
    });
  });

  it('calls onPress handler when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = renderWithTheme(
      <Card testID="test-card" onPress={onPressMock}>
        Test Content
      </Card>,
    );

    fireEvent.press(getByTestId('test-card'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('renders with image header when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        testID="test-card"
        imageHeader={
          <View
            testID="test-image-header"
            style={{ width: '100%', height: 100, backgroundColor: 'red' }}
          />
        }
      >
        Test Content
      </Card>,
    );

    const imageHeader = getByTestId('test-image-header');
    expect(imageHeader).toBeTruthy();
    expect(imageHeader).toHaveStyle({
      width: '100%',
      height: 100,
      backgroundColor: 'red',
    });
  });

  it('renders with footer when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        testID="test-card"
        footer={
          <View testID="test-footer">
            <Text>Footer Content</Text>
          </View>
        }
      >
        Test Content
      </Card>,
    );

    expect(getByTestId('test-footer')).toBeTruthy();
  });

  it('applies correct styles for different variants', () => {
    // Test elevated variant
    const { getByTestId, rerender } = renderWithTheme(
      <Card testID="test-card" variant="elevated">
        Test Content
      </Card>,
    );

    let card = getByTestId('test-card');
    expect(card).toHaveStyle({
      elevation: 2,
      borderWidth: 0,
      backgroundColor: theme.colors.surface,
    });

    // Test outlined variant
    rerender(
      <PaperProvider theme={theme}>
        <Card testID="test-card" variant="outlined">
          Test Content
        </Card>
      </PaperProvider>,
    );

    card = getByTestId('test-card');
    expect(card).toHaveStyle({
      elevation: 0,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    });

    // Test filled variant
    rerender(
      <PaperProvider theme={theme}>
        <Card testID="test-card" variant="filled">
          Test Content
        </Card>
      </PaperProvider>,
    );

    card = getByTestId('test-card');
    expect(card).toHaveStyle({
      elevation: 0,
      borderWidth: 0,
      backgroundColor: theme.colors.surfaceVariant,
    });
  });

  it('applies correct styles for different sizes', () => {
    const { getByTestId, rerender } = renderWithTheme(
      <Card testID="test-card" size="small">
        Small Card
      </Card>,
    );

    let card = getByTestId('test-card');
    expect(card).toHaveStyle({
      padding: 8, // theme.spacing.sm
      borderRadius: 16, // theme.roundness * 2
    });

    // Test medium size (default)
    rerender(
      <PaperProvider theme={theme}>
        <Card testID="test-card" size="medium">
          Medium Card
        </Card>
      </PaperProvider>,
    );

    card = getByTestId('test-card');
    expect(card).toHaveStyle({
      padding: 16, // theme.spacing.md
      borderRadius: 24, // theme.roundness * 3
    });
  });

  it('applies custom styles correctly', () => {
    const customStyle: ViewStyle = {
      margin: 10,
      padding: 20,
      backgroundColor: 'blue',
    };

    const { getByTestId } = renderWithTheme(
      <Card testID="test-card" style={customStyle} contentStyle={{ padding: 30 }}>
        Custom Styled Card
      </Card>,
    );

    const card = getByTestId('test-card');
    expect(card).toHaveStyle(customStyle);

    // Content style is applied to the inner content view
    const contentView = getByTestId('card-content');
    expect(contentView).toHaveStyle({ padding: 30 });
  });

  it('handles fullWidth prop correctly', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="test-card" fullWidth>
        Full Width Card
      </Card>,
    );

    const card = getByTestId('test-card');
    expect(card).toHaveStyle({
      width: '100%',
    });
  });

  it('renders with accessibility props', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="test-card" accessible accessibilityLabel="Test Card" accessibilityRole="button">
        Accessible Card
      </Card>,
    );

    const card = getByTestId('test-card');
    expect(card.props.accessible).toBe(true);
    expect(card.props.accessibilityLabel).toBe('Test Card');
    expect(card.props.accessibilityRole).toBe('button');
  });
});
