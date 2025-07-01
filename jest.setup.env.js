// Jest globals setup for TypeScript tests
// This file provides the Jest global variables to TypeScript files

// Make sure the globals are correctly typed for TypeScript
globalThis.expect = expect;
globalThis.jest = jest;
globalThis.test = test;
globalThis.describe = describe;
globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;
globalThis.beforeAll = beforeAll;
globalThis.afterAll = afterAll;
globalThis.it = test; // Alias for test

// Fix for TypeScript tests that use explicit imports
// The 'it' function is just an alias for 'test'
if (typeof globalThis.it === 'undefined') {
  globalThis.it = globalThis.test;
}
