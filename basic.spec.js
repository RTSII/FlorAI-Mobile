// Basic Jest spec file
const sum = (a, b) => a + b;

describe('Basic math operations', () => {
  test('adds 1 + 2 to equal 3', () => {
    console.log('Running addition test');
    expect(sum(1, 2)).toBe(3);
    console.log('Addition test passed');
  });
});
