// Enhanced configuration for React Native testing
module.exports = {
  testMatch: ['**/simple-test.js', '**/simple-react-test-2.js', '**/simple-react-test.jsx', '**/debug-test.js'],
  testEnvironment: 'jsdom',
  verbose: true,
  testTimeout: 10000,
  
  // Basic transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module resolution
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  
  // Setup files
  setupFiles: [
    './node_modules/react-native/jest/setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
  
  // Test runner
  testRunner: 'jest-circus/runner',
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
