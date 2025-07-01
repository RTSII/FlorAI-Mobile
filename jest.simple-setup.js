// Simple setup file for testing
console.log('Jest setup file is being loaded');

// Basic Jest setup
import '@testing-library/jest-native/extend-expect';

// Simple mocks
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useSharedValue: jest.fn(),
  withTiming: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
}));
