// Simple React test with minimal dependencies
import React from 'react';

test('simple React test', () => {
  console.log('Running simple React test...');
  const element = React.createElement('div', null, 'Hello, World!');
  expect(element).toBeTruthy();
  expect(element.props.children).toBe('Hello, World!');
});
