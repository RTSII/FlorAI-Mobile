// Debug test with detailed logging
console.log('Test file is being loaded');

describe('Debug Test Suite', () => {
  console.log('Test suite is being set up');
  
  beforeAll(() => {
    console.log('Before all tests');
  });

  beforeEach(() => {
    console.log('Before each test');
  });

  test('simple test with logging', () => {
    console.log('Test is running');
    expect(1 + 2).toBe(3);
    console.log('Test assertion passed');
  });

  afterEach(() => {
    console.log('After each test');
  });

  afterAll(() => {
    console.log('After all tests');
  });
});
