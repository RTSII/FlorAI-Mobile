// Debug test with detailed logging
console.log('Test file is being loaded');

test('simple test with logging', () => {
  console.log('Test is running');
  expect(true).toBe(true);
  console.log('Test completed');
});
