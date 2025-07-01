// Simple test file to verify Jest is working
console.log('1. Test file is being loaded');

// Check if Jest globals are available
console.log('2. Global test function available:', typeof test === 'function');
console.log('2. Global expect function available:', typeof expect === 'function');
console.log('2. Global describe function available:', typeof describe === 'function');

// Check if setup file was loaded
console.log('3. Setup file should have been loaded by now');

describe('Basic Test Suite', () => {
  console.log('4. Inside describe block');
  console.log('Test suite is being set up');
  
  beforeAll(() => {
    console.log('Before all tests');
  });
  
  beforeEach(() => {
    console.log('Before each test');
  });
  
  test('adds 1 + 2 to equal 3', () => {
    console.log('Running test: adds 1 + 2 to equal 3');
    expect(1 + 2).toBe(3);
  });
  
  afterEach(() => {
    console.log('After each test');
  });
  
  afterAll(() => {
    console.log('After all tests');
  });
});
