/**
 * Unified Jest Configuration for FlorAI-Mobile
 * 
 * This configuration consolidates the various Jest configurations into a single,
 * comprehensive setup that supports all testing scenarios in the project.
 * 
 * Features:
 * - Support for React Native and Expo components
 * - TypeScript support
 * - Component testing with React Testing Library
 * - Snapshot testing
 * - Integration testing
 * - Proper module resolution and mocking
 */

module.exports = {
  // Preset for Expo projects
  preset: 'jest-expo',
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Verbose output for better debugging
  verbose: true,
  silent: false,
  
  // Test timeout
  testTimeout: 15000,
  
  // Test matching patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(test).[jt]s?(x)'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.test.config.js' }],
  },
  
  // Module resolution
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // Module name mapping for cleaner imports and asset mocking
  moduleNameMapper: {
    // Path alias for cleaner imports
    '^@/(.*)$': '<rootDir>/src/$1',
    
    // Mock static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  
  // Setup files
  setupFiles: [],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect'
  ],
  
  // Critical to avoid issues with React Native
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/types/**/*',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  
  // Test runner
  testRunner: 'jest-circus/runner',
  
  // Projects configuration for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
        '**/?(*.)+(test).[jt]s?(x)',
        '!**/?(*.)+(integration|snapshot).test.[jt]s?(x)'
      ],
    },
    {
      displayName: 'integration',
      testMatch: [
        '**/?(*.)+(integration).test.[jt]s?(x)'
      ],
      testTimeout: 30000,
    },
    {
      displayName: 'snapshot',
      testMatch: [
        '**/?(*.)+(snapshot).test.[jt]s?(x)'
      ],
    },
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
