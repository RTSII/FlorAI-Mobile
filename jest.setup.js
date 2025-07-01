// Minimal Jest setup file
console.log('Jest setup file is being loaded');

// Mock any global variables or modules needed for testing
global.__DEV__ = true;

// Mock React Native's Animated implementation
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Add any other global mocks or setup code here
