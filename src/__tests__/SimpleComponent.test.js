import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Simple test component
const SimpleComponent = () => (
  <View testID="test-container">
    <Text testID="test-text">Hello, Jest!</Text>
  </View>
);

describe('SimpleComponent', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const container = getByTestId('test-container');
    const text = getByTestId('test-text');
    
    expect(container).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text.props.children).toBe('Hello, Jest!');
  });
});
