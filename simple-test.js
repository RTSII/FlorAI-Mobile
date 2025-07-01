// Simple test file with minimal dependencies
console.log('Simple test file is being executed');

test('simple test that should always pass', () => {
  console.log('Running simple test...');
  expect(1 + 1).toBe(2);
});

// Add a simple test with a timeout
test('test with timeout', async () => {
  console.log('Running test with timeout...');
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(true).toBe(true);
}, 1000); // 1 second timeout
