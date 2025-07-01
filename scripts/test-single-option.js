const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Working config (from jest.debug.config.js)
const baseConfig = {
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/simple.test.js'],
  verbose: true,
  testTimeout: 10000,
};

// Test a single option
function testOption(optionName, optionValue) {
  const config = { ...baseConfig, [optionName]: optionValue };
  const tempConfigPath = path.join(__dirname, '../jest.temp.config.js');
  
  console.log(`\n=== Testing option: ${optionName} ===`);
  console.log('Config:', JSON.stringify(config, null, 2));
  
  fs.writeFileSync(tempConfigPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
  
  try {
    console.log('Running test...');
    const output = execSync(`npx jest --config ${tempConfigPath} --runInBand --no-coverage`, {
      stdio: 'pipe',
      encoding: 'utf-8',
      cwd: __dirname + '/..',
    });
    console.log('✅ Test passed with output:');
    console.log(output);
    return true;
  } catch (error) {
    console.log('❌ Test failed with error:');
    const errorOutput = error.output ? error.output.map(o => o?.toString() || '').join('\n') : error.message;
    console.log(errorOutput);
    return false;
  } finally {
    try { fs.unlinkSync(tempConfigPath); } catch (e) {}
  }
}

// Test each option one by one
const optionsToTest = [
  // Start with base config
  ['base', {}],
  
  // Test preset
  ['preset', 'jest-expo'],
  
  // Test transformIgnorePatterns
  ['transformIgnorePatterns', [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]],
  
  // Test setupFiles
  ['setupFiles', [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ]],
  
  // Test setupFilesAfterEnv
  ['setupFilesAfterEnv', ['@testing-library/jest-native/extend-expect']],
  
  // Test moduleNameMapper
  ['moduleNameMapper', {
    '^@/(.*)$': '<rootDir>/$1',
  }],
  
  // Test collectCoverage
  ['collectCoverage', true],
  
  // Test collectCoverageFrom
  ['collectCoverageFrom', [
    '**/*.{js,jsx,ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
  ]],
  
  // Test transform
  ['transform', {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  }],
];

// Run tests
console.log('Starting Jest config debugger...\n');

for (const [name, value] of optionsToTest) {
  const success = testOption(name, value);
  console.log(`\n${success ? '✅' : '❌'} ${name} ${success ? 'works' : 'fails'}`);
  console.log('='.repeat(50));
  
  if (!success && name !== 'base') {
    console.log('\n🔥 Found problematic option!');
    break;
  }
}
