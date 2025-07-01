# Testing Guide for FlorAI-Mobile

**Version:** 2.0.0  
**Last Updated:** July 1, 2025  
**Status:** Active Development

## Purpose

This guide outlines the testing approach, best practices, and patterns used in the FlorAI-Mobile application. It serves as a reference for developers to ensure consistent and effective testing practices across the project.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Tools](#testing-tools)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Testing Philosophy

We follow these core principles for testing:

1. **Test Behavior, Not Implementation**: Focus on testing what the code does, not how it does it.
2. **Isolate Components**: Test components in isolation with appropriate mocks.
3. **Prioritize Readability**: Write clear, maintainable test cases.
4. **Follow the Testing Trophy**: Focus on integration tests over unit tests.
5. **Test Accessibility**: Ensure components are accessible by default.

## Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **@testing-library/react-native**: For testing React Native components
- **@testing-library/jest-native**: Additional Jest matchers for React Native
- **TypeScript**: For type safety in tests

## Test Structure

Tests are colocated with their respective components in `__tests__` directories:

```
src/
  components/
    Button/
      __tests__/
        Button.test.tsx
      Button.tsx
```

## Writing Tests

### Component Tests

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Test</Button>);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### Testing User Interactions

```typescript
it('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress}>Press me</Button>);

  fireEvent.press(getByText('Press me'));
  expect(onPress).toHaveBeenCalled();
});
```

### Testing with Context

```typescript
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};
```

## Running Tests

Run all tests:

```bash
npm test
```

Run specific test file:

```bash
npm test path/to/test/file.test.tsx
```

Run with coverage:

```bash
npm test -- --coverage
```

## Best Practices

1. **Test Naming**:
   - Use descriptive test names
   - Follow the pattern: `it('should [expected behavior] when [state/scenario]')`

2. **Test Organization**:
   - Group related tests with `describe`
   - Use `beforeEach` for common setup
   - Keep tests focused and independent

3. **Accessibility**:
   - Test with screen readers in mind
   - Use `getByRole` and other semantic queries

## Common Patterns

### Mocking Native Modules

```typescript
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';

test('should use custom hook', () => {
  const { result } = renderHook(() => useCustomHook());
  // Test hook behavior
});
```

## Troubleshooting

- **Test Hangs**: Ensure all promises are resolved and async operations are handled
- **Type Errors**: Check TypeScript types and mocks
- **UI Changes**: Update snapshots with `npm test -- -u`

## Future Considerations

- Explore Detox for end-to-end testing
- Investigate React Native Testing Library extensions
- Consider implementing visual regression testing

## See Also

- [Documentation Index](../index.md) - Central index of all project documentation
- [Testing Challenges](./testing-challenges.md) - Current testing blockers and recommendations
- [Alternative Testing Strategy](./alternative-testing-strategy.md) - Alternative approaches for ensuring quality
- [Manual QA Checklist](./manual-qa-checklist.md) - Comprehensive checklist for manual testing
- [Project Plan](../project-plan.md) - Comprehensive project plan including testing strategy

### Visual Regression Testing

We recommend implementing visual regression testing to catch unintended UI changes:

1. **Storybook with Chromatic**
   - Set up Storybook for component documentation
   - Use Chromatic for visual regression testing
   - Integrate with CI/CD pipeline

2. **Screenshot Testing**
   - Implement screenshot testing for critical paths
   - Use tools like `react-native-screenshot-test`

### End-to-End Testing

For comprehensive testing, consider adding E2E tests:

1. **Detox**
   - Set up Detox for mobile E2E testing
   - Test critical user flows
   - Run on CI with emulators

2. **Critical Paths**
   - User authentication flow
   - Core application features
   - Error handling scenarios

### Performance Testing

Monitor and improve test performance:

1. **Benchmarking**
   - Add performance benchmarks for critical components
   - Track render times and memory usage

2. **Test Optimization**
   - Parallel test execution
   - Test sharding in CI
   - Mock heavy operations

### Accessibility Testing

Enhance accessibility testing:

1. **Static Analysis**
   - Add `eslint-plugin-jsx-a11y`
   - Enforce accessibility best practices

2. **Automated Testing**
   - Implement `@axe-core/react`
   - Test with screen readers

## Team Practices

### Code Reviews

1. **PR Checklist**
   - [ ] Tests added for new features
   - [ ] Existing tests pass
   - [ ] Test coverage meets requirements
   - [ ] Accessibility tested
   - [ ] Performance considered

2. **Review Guidelines**
   - Focus on test quality, not just quantity
   - Verify edge cases are covered
   - Check for proper cleanup
   - Ensure tests are maintainable

### Knowledge Sharing

1. **Documentation**
   - Keep this guide updated
   - Document patterns and anti-patterns
   - Share learnings from test failures

2. **Pair Programming**
   - Regular pairing on test scenarios
   - Knowledge transfer sessions
   - Test-driven development practices

## Monitoring and Metrics

1. **Test Coverage**
   - Track coverage trends
   - Set and enforce minimum coverage
   - Identify untested code paths

2. **CI/CD**
   - Monitor build times
   - Track flaky tests
   - Set up alerts for failures

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing](https://reactnative.dev/docs/testing)
- [Detox E2E Testing](https://wix.github.io/Detox/)
- [Storybook for React Native](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

_Last Updated: June 28, 2025_
