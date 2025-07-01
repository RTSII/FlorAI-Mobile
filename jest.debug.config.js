// Debug configuration for Jest to help diagnose test execution issues
module.exports = {
  // Basic test configuration
  testMatch: ['**/minimal.test.js'],
  testEnvironment: 'node',  // Using node environment for simplicity
  verbose: true,
  
  // Disable coverage collection for now
  collectCoverage: false,
  
  // Simple transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Module resolution
  moduleFileExtensions: ['js', 'json', 'node'],
  
  // Disable all mocks and setup files for now
  setupFiles: [],
  setupFilesAfterEnv: [],
  
  // Maximum time a test can run (in milliseconds)
  testTimeout: 10000,
  
  // Show more detailed test output
  reporters: [
    'default',
    ['jest-verbose-reporter', {
      console: true,
      duration: true,
    }],
  ],
  
  // Show individual test results
  testResultsProcessor: 'jest-simple-dot-reporter',
  
  // Enable debug logging
  logHeapUsage: true,
  detectOpenHandles: true,
  forceExit: true,
};
