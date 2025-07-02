# FlorAI-Mobile Directory Structure Guidelines

**Version:** 1.0.0  
**Last Updated:** July 2, 2025  
**Status:** Active Development  
**Repository:** [https://github.com/RTSII/FlorAI-Mobile](https://github.com/RTSII/FlorAI-Mobile)

## Purpose

This document outlines the recommended directory structure and file organization standards for the FlorAI-Mobile project. Following these guidelines ensures consistency, maintainability, and scalability across the codebase.

## Table of Contents

1. [Overall Project Structure](#overall-project-structure)
2. [Component Organization](#component-organization)
3. [Service Organization](#service-organization)
4. [Test Organization](#test-organization)
5. [Configuration Management](#configuration-management)
6. [Best Practices](#best-practices)

## Overall Project Structure

The FlorAI-Mobile project follows a feature-based directory structure with clear separation of concerns:

```
src/
  api/            # API clients and types
  assets/         # Static assets (images, fonts, etc.)
  components/     # Reusable UI components
  config/         # Application configuration
  contexts/       # React context providers
  hooks/          # Custom React hooks
  navigation/     # Navigation configuration
  screens/        # Screen components
  services/       # Business logic and external service integrations
  theme/          # Theme configuration
  types/          # TypeScript type definitions
  utils/          # Utility functions
```

## Component Organization

Components should follow a consistent organization pattern:

### Component Directory Structure

```
components/
  Button/
    Button.tsx         # Main component implementation
    Button.styles.ts   # Component styles
    Button.types.ts    # Component type definitions
    Button.test.tsx    # Component tests
    index.ts           # Re-export for cleaner imports
    README.md          # Component documentation (for complex components)
```

### Component Best Practices

1. **Group Related Files**: Keep all files related to a component in the same directory
2. **Use Index Files**: Create index.ts files to re-export components for cleaner imports
3. **Consistent Naming**: Use PascalCase for component files and directories
4. **Documentation**: Include README.md files for complex components

## Service Organization

Services should be organized by domain and follow a consistent structure:

### Service Directory Structure

```
services/
  plantIdentification/
    index.ts           # Main service exports
    types.ts           # Service-specific types
    api.ts             # API integration
    utils.ts           # Service-specific utilities
    README.md          # Service documentation
    __tests__/         # Service tests
```

### Service Best Practices

1. **Domain-Driven Design**: Organize services by business domain
2. **Clear API Surface**: Export a well-defined API through index.ts
3. **Documentation**: Include README.md files explaining service purpose and usage
4. **Type Safety**: Define service-specific types in types.ts

## Test Organization

FlorAI-Mobile supports two approaches to test organization:

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

### Testing Best Practices

1. **Test Proximity**: Keep tests close to the code they test when possible
2. **Naming Convention**: Use `.test.tsx` or `.test.ts` suffix for test files
3. **Test Categories**: Use descriptive suffixes for different test types:
   - `.test.tsx` - Standard unit tests
   - `.integration.test.tsx` - Integration tests
   - `.snapshot.test.tsx` - Snapshot tests

## Configuration Management

Configuration should be centralized and environment-aware:

### Configuration Best Practices

1. **Centralization**: Use `src/config/` for application configuration
2. **Environment Variables**: Access environment variables through `src/config/env.ts`
3. **Type Safety**: Ensure all configuration is properly typed
4. **Validation**: Validate configuration at startup

## Best Practices

1. **Absolute Imports**: Use absolute imports with the `@/` alias
2. **Consistent Naming**: Follow established naming conventions
3. **Documentation**: Document complex components and services
4. **Encapsulation**: Export only what's necessary from each module
5. **Type Safety**: Leverage TypeScript for type safety across the codebase

## Implementation Plan

The directory structure optimization will be implemented in phases:

1. **Phase 1**: Standardize test organization
2. **Phase 2**: Consolidate Jest configuration
3. **Phase 3**: Improve component organization
4. **Phase 4**: Standardize service structure

Each phase will be implemented with minimal disruption to ongoing development.
