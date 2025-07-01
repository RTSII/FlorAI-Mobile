import React from 'react';
import { View, Text, ViewStyle, ImageSourcePropType } from 'react-native';
import { render, fireEvent, RenderResult } from '@testing-library/react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { Card, CardProps } from '../Card.tsx';

// Augment CardProps to include imageSource for tests
interface ExtendedCardProps extends CardProps {
  imageSource?: ImageSourcePropType;
}

// Type declarations for Jest globals
type JestMockFn = {
  (...args: unknown[]): unknown;
  mockClear(): void;
  mockImplementation(fn: (...args: unknown[]) => unknown): JestMockFn;
  mockImplementationOnce(fn: (...args: unknown[]) => unknown): JestMockFn;
  mockReturnValue(value: unknown): JestMockFn;
  mockReturnValueOnce(value: unknown): JestMockFn;
};

declare const jest: {
  fn: (implementation?: (...args: unknown[]) => unknown) => JestMockFn;
  // Add other Jest globals as needed
};

// Extend the default theme to include our custom properties
type CustomTheme = typeof DefaultTheme & {
  colors: typeof DefaultTheme.colors & {
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
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};

// Create theme with our custom properties
const theme: CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
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
    lg: 12,
    full: 9999,
  },
  elevation: {
    level0: 'none',
    level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
    level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
    level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
  },
  roundness: 8,
};

const renderWithTheme = (component: React.ReactElement): RenderResult => {
  return render(<PaperProvider theme={theme}>{component}</PaperProvider>);
};

describe('Card', () => {
  const defaultProps: CardProps = {
    children: <Text testID="card-content">Card Content</Text>,
  };

  it('renders default card with content', () => {
    const { getByTestId } = renderWithTheme(<Card {...defaultProps} />);
    expect(getByTestId('card-content')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    // Test implementation
    const onPressMock = jest.fn();
    const { getByTestId } = renderWithTheme(
      <Card onPress={onPressMock} testID="pressable-card">
        <Text>Press Me</Text>
      </Card>,
    );

    fireEvent.press(getByTestId('pressable-card'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { getByTestId, rerender } = renderWithTheme(
      <Card variant="elevated" testID="elevated-card">
        <Text>Elevated</Text>
      </Card>,
    );
    expect(getByTestId('elevated-card')).toHaveStyle({ elevation: 1 });

    rerender(
      <PaperProvider theme={theme}>
        <Card variant="outlined" testID="outlined-card">
          <Text>Outlined</Text>
        </Card>
      </PaperProvider>,
    );
    expect(getByTestId('outlined-card')).toHaveStyle({ borderWidth: 1 });

    rerender(
      <PaperProvider theme={theme}>
        <Card variant="filled" testID="filled-card">
          <Text>Filled</Text>
        </Card>
      </PaperProvider>,
    );
    expect(getByTestId('filled-card')).toHaveStyle({
      backgroundColor: theme.colors.surfaceVariant,
    });
  });

  it('renders with accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <Card testID="accessible-card" accessibilityLabel="Test Card">
        <Text>Accessible Card</Text>
      </Card>,
    );
    expect(getByLabelText('Test Card')).toBeTruthy();
  });

  it('renders with image header when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        testID="image-card"
        variant="image"
        imageHeader={<View testID="card-image" />}
      >
        <Text>Card with Image</Text>
      </Card>,
    );
    expect(getByTestId('card-image')).toBeTruthy();
  });

  it('renders with header and footer', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="complete-card">
        <View testID="card-header">
          <Text>Header</Text>
        </View>
        <Text>Content</Text>
        <View testID="card-footer" style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
          <Text>Footer</Text>
        </View>
      </Card>,
    );
    expect(getByTestId('card-header')).toBeTruthy();
    expect(getByTestId('card-footer')).toBeTruthy();
  });

  it('renders footer when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        footer={
          <View testID="card-footer" style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
            <Text>Footer Content</Text>
          </View>
        }
      >
        <Text>Card with Footer</Text>
      </Card>,
    );

    expect(getByTestId('card-footer')).toBeTruthy();
  });

  it('applies custom styles when provided', () => {
    const customStyle: ViewStyle = { backgroundColor: 'red', margin: 16 };
    const { getByTestId } = renderWithTheme(
      <Card testID="styled-card" style={customStyle}>
        <Text>Styled Card</Text>
      </Card>,
    );

    const card = getByTestId('styled-card');
    expect(card).toHaveStyle(customStyle);
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = renderWithTheme(
      <Card fullWidth testID="full-width-card">
        <Text>Full Width Card</Text>
      </Card>,
    );

    expect(getByTestId('full-width-card')).toHaveStyle({ alignSelf: 'stretch' });
  });

  it('applies correct styles for outlined variant', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="outlined-card" variant="outlined">
        <Text>Outlined Card</Text>
      </Card>,
    );
    const card = getByTestId('outlined-card');
    expect(card).toHaveStyle({ borderColor: theme.colors.outline });
    expect(card).toHaveStyle({ borderRadius: theme.roundness * 2 });
  });
});
