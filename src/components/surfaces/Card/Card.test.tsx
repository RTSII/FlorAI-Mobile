import React from 'react';
import { View, Text, ViewStyle, ImageSourcePropType } from 'react-native';
import { render, fireEvent, RenderResult } from '@testing-library/react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { Card } from './Card';
import { CardProps } from './Card.types';

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
  elevation: {
    level0: '0px 0px 0px rgba(0, 0, 0, 0)',
    level1: '0px 1px 2px rgba(0, 0, 0, 0.3)',
    level2: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    level3: '0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    level4: '0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
    level5: '0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  },
};

const renderWithTheme = (component: React.ReactElement): RenderResult => {
  return render(<PaperProvider theme={theme}>{component}</PaperProvider>);
};

describe('Card', () => {
  const defaultProps: CardProps = {
    children: <Text testID="card-content">Card Content</Text>,
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderWithTheme(<Card {...defaultProps} />);
    expect(getByTestId('card-content')).toBeTruthy();
  });

  it('renders as TouchableOpacity when onPress is provided', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = renderWithTheme(
      <Card {...defaultProps} onPress={onPressMock} testID="touchable-card" />
    );
    
    const card = getByTestId('touchable-card');
    fireEvent.press(card);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders as View when onPress is not provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card {...defaultProps} testID="non-touchable-card" />
    );
    
    // This would throw an error if the card was a TouchableOpacity
    expect(() => {
      fireEvent.press(getByTestId('non-touchable-card'));
    }).toThrow();
  });

  it('applies different styles based on variant prop', () => {
    const { rerender, getByTestId } = renderWithTheme(
      <Card {...defaultProps} variant="elevated" testID="card" />
    );
    
    // Check elevated variant
    let card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: theme.colors.surface,
          elevation: 2,
        }),
      ])
    );
    
    // Check outlined variant
    rerender(
      <PaperProvider theme={theme}>
        <Card {...defaultProps} variant="outlined" testID="card" />
      </PaperProvider>
    );
    
    card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        }),
      ])
    );
    
    // Check filled variant
    rerender(
      <PaperProvider theme={theme}>
        <Card {...defaultProps} variant="filled" testID="card" />
      </PaperProvider>
    );
    
    card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: theme.colors.surfaceVariant,
        }),
      ])
    );
  });

  it('applies different styles based on size prop', () => {
    const { rerender, getByTestId } = renderWithTheme(
      <Card {...defaultProps} size="small" testID="card" />
    );
    
    // Check small size
    let card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          maxWidth: 160,
        }),
      ])
    );
    
    // Check medium size
    rerender(
      <PaperProvider theme={theme}>
        <Card {...defaultProps} size="medium" testID="card" />
      </PaperProvider>
    );
    
    card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          maxWidth: 300,
        }),
      ])
    );
    
    // Check large size
    rerender(
      <PaperProvider theme={theme}>
        <Card {...defaultProps} size="large" testID="card" />
      </PaperProvider>
    );
    
    card = getByTestId('card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          maxWidth: '100%',
        }),
      ])
    );
  });

  it('renders imageHeader when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        {...defaultProps}
        imageHeader={<View testID="image-header" />}
      />
    );
    
    expect(getByTestId('image-header')).toBeTruthy();
  });

  it('renders footer when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Card
        {...defaultProps}
        footer={<View testID="footer" />}
      />
    );
    
    expect(getByTestId('footer')).toBeTruthy();
  });
});
