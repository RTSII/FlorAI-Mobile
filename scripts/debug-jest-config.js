const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Working config (from jest.debug.config.js)
const workingConfig = {
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/simple.test.js'],
  verbose: true,
  testTimeout: 10000,
  testRunner: 'jest-circus/runner',
  detectOpenHandles: true,
  forceExit: true,
  logHeapUsage: true,
  silent: false,
  transform: {},
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  resetMocks: true,
  resetModules: true,
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '\\node_modules\\',
    '\\lib\\',
    '\\dist\\',
    '\\build\\',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};

// Potentially problematic config options
const problematicOptions = [
  'preset',
  'transformIgnorePatterns',
  'setupFiles',
  'setupFilesAfterEnv',
  'moduleNameMapper',
  'collectCoverage',
  'collectCoverageFrom',
  'transform',
];

// Test if a config works
function testConfig(config) {
  const tempConfigPath = path.join(__dirname, '../jest.temp.config.js');
  fs.writeFileSync(tempConfigPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
  
  try {
    const output = execSync(`npx jest --config ${tempConfigPath} --runInBand --no-coverage`, {
      stdio: 'pipe',
      encoding: 'utf-8',
      cwd: __dirname + '/..',
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.output ? error.output.map(o => o?.toString() || '').join('\n') : error.message 
    };
  } finally {
    try { fs.unlinkSync(tempConfigPath); } catch (e) {}
  }
}

// Binary search to find the problematic option
async function findProblematicOption() {
  let currentConfig = { ...workingConfig };
  let lastWorkingConfig = { ...workingConfig };
  
  for (const option of problematicOptions) {
    console.log(`\nTesting with option: ${option}`);
    
    // Add the option to the current config
    if (option === 'preset') {
      currentConfig.preset = 'jest-expo';
    } else if (option === 'transformIgnorePatterns') {
      currentConfig.transformIgnorePatterns = [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
      ];
    } else if (option === 'setupFiles') {
      currentConfig.setupFiles = [
        './node_modules/react-native-gesture-handler/jestSetup.js',
        './jest.setup.js',
      ];
    } else if (option === 'setupFilesAfterEnv') {
      currentConfig.setupFilesAfterEnv = ['@testing-library/jest-native/extend-expect'];
    } else if (option === 'moduleNameMapper') {
      currentConfig.moduleNameMapper = {
        '^@/(.*)$': '<rootDir>/$1',
      };
    } else if (option === 'collectCoverage') {
      currentConfig.collectCoverage = true;
    } else if (option === 'collectCoverageFrom') {
      currentConfig.collectCoverageFrom = [
        '**/*.{js,jsx,ts,tsx}',
        '!**/coverage/**',
        '!**/node_modules/**',
        '!**/babel.config.js',
        '!**/jest.setup.js',
      ];
    } else if (option === 'transform') {
      currentConfig.transform = {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      };
    }
    
    // Test the current config
    const result = testConfig(currentConfig);
    
    if (result.success) {
      console.log(`✅ ${option} works`);
      lastWorkingConfig = { ...currentConfig };
    } else {
      console.log(`❌ ${option} breaks test execution`);
      console.log('Error output:', result.output.slice(0, 500) + '...');
      currentConfig = { ...lastWorkingConfig }; // Revert to last working config
    }
  }
  
  console.log('\nFinal working config:');
  console.log(JSON.stringify(lastWorkingConfig, null, 2));
}

// Run the debugger
findProblematicOption().catch(console.error);
