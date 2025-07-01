// Simple test to verify Jest is working with detailed logging
console.log('Test file is being loaded');

const sum = (a, b) => a + b;

describe('Simple Test Suite', () => {
  console.log('Test suite is being set up');
  
  beforeAll(() => {
    console.log('Before all tests');
  });

  beforeEach(() => {
    console.log('Before each test');
  });

  it('should add two numbers', () => {
    console.log('Running test...');
    const result = sum(1, 2);
    console.log('Test result:', result);
    expect(result).toBe(3);
    console.log('Test assertion passed');
  });

  afterEach(() => {
    console.log('After each test');
  });

  afterAll(() => {
    console.log('After all tests');
  });
});
