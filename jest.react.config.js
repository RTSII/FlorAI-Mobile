// Jest configuration for React component testing
module.exports = {
  testMatch: ['**/simple-react-test.jsx'],
  testEnvironment: 'jsdom',
  verbose: true,
  testTimeout: 10000,
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.test.config.js' }],
  },
  
  // Module resolution
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  
  // Setup files
  setupFiles: [],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  
  // Test runner
  testRunner: 'jest-circus/runner',
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
