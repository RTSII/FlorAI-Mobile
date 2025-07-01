// Absolute minimal Jest configuration for FlorAI-Mobile

module.exports = {
  // Necessary basics
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  verbose: true,
  
  // Display test output
  silent: false,

  // Critical to avoid issues with React Native
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],

  // Simple, direct module mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
