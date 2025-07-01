// Custom Jest configuration for FlorAI-Mobile
module.exports = {
  // Start with expo preset
  preset: 'jest-expo',
  
  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  
  // Test environment and runner
  testEnvironment: 'jsdom',
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module resolution
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  
  // Setup files
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  
  // Test configuration
  verbose: true,
  testTimeout: 10000,
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup*.js',
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
  
  // Module name mapper for assets
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  
  // Coverage report
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  
  // Setup files after environment is loaded
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
