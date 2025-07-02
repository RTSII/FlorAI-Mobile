# FlorAI-Mobile Jest Configuration Guide

**Version:** 1.0.0  
**Last Updated:** July 2, 2025  
**Status:** Active Development  
**Repository:** [https://github.com/RTSII/FlorAI-Mobile](https://github.com/RTSII/FlorAI-Mobile)

## Purpose

This document explains the Jest configuration for the FlorAI-Mobile project, including the unified configuration approach, test organization, and best practices for writing and running tests.

## Table of Contents

1. [Unified Jest Configuration](#unified-jest-configuration)
2. [Test Organization](#test-organization)
3. [Running Tests](#running-tests)
4. [Test Types](#test-types)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Unified Jest Configuration

FlorAI-Mobile uses a unified Jest configuration (`jest.unified.config.js`) that consolidates the various Jest configurations into a single, comprehensive setup. This configuration supports all testing scenarios in the project:

- Component testing with React Testing Library
- Snapshot testing
- Integration testing
- Unit testing

### Key Configuration Features

- **Projects Configuration**: Separate configurations for unit, integration, and snapshot tests
- **Module Aliases**: Support for the `@/` import alias
- **Asset Mocking**: Automatic mocking of static assets
- **Coverage Reporting**: Comprehensive coverage configuration and thresholds
- **TypeScript Support**: Full support for TypeScript tests
- **Expo Integration**: Proper configuration for Expo and React Native

## Test Organization

Tests in FlorAI-Mobile follow a consistent organization pattern:

### Co-located Tests (Preferred for Components)

```
components/
  Button/
    Button.tsx
    Button.test.tsx    # Co-located with implementation
```

### Parallel Test Structure (For Integration Tests)

```
__tests__/
  integration/
    plantIdentification.test.ts
```

### Test Naming Conventions

- **Unit Tests**: `ComponentName.test.tsx`
- **Integration Tests**: `ComponentName.integration.test.tsx`
- **Snapshot Tests**: `ComponentName.snapshot.test.tsx`

## Running Tests

### Running All Tests

```bash
npm test
```

### Running Specific Test Types

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only snapshot tests
npm run test:snapshot
```

### Running Tests in Watch Mode

```bash
npm run test:watch
```

## Test Types

### Unit Tests

Unit tests focus on testing individual components or functions in isolation. They should be fast, reliable, and focused on a single unit of functionality.

```typescript
// Example unit test
import { render, screen } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button title="Press me" />);
    expect(screen.getByText('Press me')).toBeTruthy();
  });
});
```

### Integration Tests

Integration tests verify that multiple components or services work together correctly. They are typically slower than unit tests but provide more confidence in the system's behavior.

```typescript
// Example integration test
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PlantIdentificationScreen } from '../screens';
import { plantIdentificationService } from '../services';

jest.mock('../services/plantIdentification');

describe('PlantIdentificationScreen Integration', () => {
  it('identifies plants when image is submitted', async () => {
    // Test implementation
  });
});
```

### Snapshot Tests

Snapshot tests capture the rendered output of a component and compare it to a stored snapshot to detect unintended changes.

```typescript
// Example snapshot test
import { render } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Snapshot', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(<Button title="Press me" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on testing what the code does, not how it does it.
2. **Keep Tests Simple**: Each test should verify a single aspect of behavior.
3. **Use Descriptive Test Names**: Test names should clearly describe what is being tested.
4. **Mock External Dependencies**: Use Jest's mocking capabilities to isolate the code being tested.
5. **Avoid Testing Implementation Details**: Test the public API of components and services.
6. **Test Edge Cases**: Include tests for error conditions and edge cases.

## Troubleshooting

### Common Issues

1. **Transformation Errors**: If you encounter transformation errors, check the `transformIgnorePatterns` configuration.
2. **Module Resolution Errors**: Ensure that the `moduleNameMapper` configuration is correct.
3. **Timeout Errors**: Increase the `testTimeout` value for slow tests.

### Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing React Native Applications](https://reactnative.dev/docs/testing-overview)
