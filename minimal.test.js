// Enhanced minimal test with detailed logging
console.log('Test file is being loaded');

const sum = (a, b) => a + b;

describe('Minimal Test Suite', () => {
  console.log('Test suite is being set up');
  
  beforeAll(() => {
    console.log('Before all tests');
  });

  beforeEach(() => {
    console.log('Before each test');
  });

  test('adds 1 + 2 to equal 3', () => {
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
