// Simple TypeScript test
function sum(a: number, b: number): number {
  return a + b;
}

test('adds 1 + 2 to equal 3 in TypeScript', () => {
  console.log('Running TypeScript test...');
  expect(sum(1, 2)).toBe(3);
});
