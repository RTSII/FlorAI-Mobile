// Simple React Native component test
import React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const HelloWorld = () => (
  <View testID="test-container">
    <Text>Hello, World!</Text>
  </View>
);

describe('HelloWorld Component', () => {
  it('renders correctly', () => {
    render(<HelloWorld />);
    const element = screen.getByText('Hello, World!');
    expect(element).toBeTruthy();
  });
});
