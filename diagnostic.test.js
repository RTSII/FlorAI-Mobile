// Super basic Jest test - minimal test that should definitely run

// Explicitly define test function if needed
function simpleTest(name, fn) {
  console.log(`Executing test: ${name}`);
  fn();
}

// Basic test using Jest's built-in functions
test('Absolute minimal test', () => {
  console.log('Running minimal test');
  expect(1 + 1).toBe(2);
  console.log('Minimal test complete');
});

// Backup approach using direct function calls
simpleTest('Manual test', () => {
  console.log('Running manual test');
  const result = 1 + 1;
  if (result !== 2) {
    throw new Error(`Expected 2 but got ${result}`);
  }
  console.log('Manual test passed');
});
