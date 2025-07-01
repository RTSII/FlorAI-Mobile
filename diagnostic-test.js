// Diagnostic test file to debug Jest issues
console.log('*** DIAGNOSTIC TEST STARTING ***');

// Verify Jest is loaded
if (typeof jest === 'undefined') {
  console.log('CRITICAL ERROR: Jest is not defined');
} else {
  console.log('Jest is defined and available');
}

// Verify Jest globals
console.log('test function available:', typeof test === 'function');
console.log('expect function available:', typeof expect === 'function');
console.log('describe function available:', typeof describe === 'function');

// Simple test that should definitely pass
describe('Diagnostic Test Suite', () => {
  console.log('Inside describe block');
  
  test('Basic diagnostic test', () => {
    console.log('Running diagnostic test');
    expect(true).toBe(true);
    console.log('Diagnostic test assertions complete');
  });
});

console.log('*** DIAGNOSTIC TEST FINISHED ***');
