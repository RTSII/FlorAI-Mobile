// Enhanced minimal Jest configuration - Step 2: Add test environment setup
module.exports = {
  testMatch: ['**/test.js', '**/test-ts.test.ts', '**/__tests__/**/*.test.{js,ts,tsx}'],
  testEnvironment: 'jsdom',
  verbose: true,
  testTimeout: 10000,
  
  // Module resolution
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  
  // Basic transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Ignore patterns for transform
  setupFilesAfterEnv: ['<rootDir>/jest.simple-setup.js'],
  
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
