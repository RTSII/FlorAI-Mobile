const sum = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  console.log('Running test...');
  expect(sum(1, 2)).toBe(3);
});
