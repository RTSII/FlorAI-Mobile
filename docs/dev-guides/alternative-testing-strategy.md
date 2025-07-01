# FlorAI-Mobile Alternative Testing Strategy

## Overview

Due to the current challenges with Jest testing in the Expo environment, this document outlines alternative testing approaches for ensuring the quality and reliability of the FlorAI-Mobile application. These strategies will be implemented while core development continues, with the option to revisit Jest unit testing in the future as the Expo/React Native ecosystem evolves.

## Testing Approaches

### 1. Manual Testing

#### Core User Flows

- **Plant Identification Flow**
  - Camera capture functionality
  - Image selection from gallery
  - API integration for plant identification
  - Results display and error handling
- **Collection Management**
  - Adding plants to collections
  - Viewing plant details
  - Organizing collections
  - Search and filtering

- **Care Assistant Features** (Premium)
  - Care schedule setup
  - Notification system
  - Care tracking

#### Testing Checklist Template

```
[ ] Feature: [Feature Name]
[ ] Test Case: [Description]
[ ] Prerequisites: [Any required setup]
[ ] Steps:
    1. [Step 1]
    2. [Step 2]
    3. ...
[ ] Expected Result: [What should happen]
[ ] Actual Result: [What actually happened]
[ ] Pass/Fail: [Pass/Fail]
[ ] Notes: [Any observations]
```

### 2. End-to-End Testing with Detox

[Detox](https://github.com/wix/Detox) is a gray box end-to-end testing and automation framework for mobile apps, designed specifically for React Native.

#### Setup Instructions

1. Install Detox:

```bash
npm install detox --save-dev
```

2. Install Detox CLI:

```bash
npm install -g detox-cli
```

3. Add Detox configuration to package.json:

```json
"detox": {
  "configurations": {
    "ios.sim.debug": {
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/FlorAIMobile.app",
      "build": "xcodebuild -workspace ios/FlorAIMobile.xcworkspace -scheme FlorAIMobile -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 12"
      }
    }
  },
  "test-runner": "jest"
}
```

4. Create a basic E2E test:

```javascript
// e2e/firstTest.spec.js
describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to identify screen', async () => {
    await element(by.id('identify-tab')).tap();
    await expect(element(by.id('identify-screen'))).toBeVisible();
  });
});
```

#### Key E2E Test Scenarios

- User onboarding flow
- Navigation between main screens
- Plant identification process
- Collection management
- Settings and preferences

### 3. Component Visual Testing with Storybook

[Storybook](https://storybook.js.org/) allows for visual testing of UI components in isolation.

#### Setup Instructions

1. Install Storybook:

```bash
npx -p @storybook/cli sb init --type react_native
```

2. Create stories for key components:

```javascript
// stories/Button.stories.js
import React from 'react';
import { Button } from '../src/components/Button';
import { storiesOf } from '@storybook/react-native';

storiesOf('Button', module)
  .add('primary', () => <Button mode="contained" onPress={() => {}} label="Primary Button" />)
  .add('outlined', () => <Button mode="outlined" onPress={() => {}} label="Outlined Button" />)
  .add('disabled', () => (
    <Button mode="contained" disabled onPress={() => {}} label="Disabled Button" />
  ));
```

3. Run Storybook:

```bash
npm run storybook
```

#### Components to Test

- Buttons and interactive elements
- Cards and information displays
- Form inputs
- Navigation components
- Custom UI elements

### 4. API Integration Testing

#### Setup with Supertest

1. Install Supertest:

```bash
npm install supertest --save-dev
```

2. Create API tests:

```javascript
// tests/api/plantIdentification.test.js
const request = require('supertest');
const baseUrl = 'https://api.florai.com';

describe('Plant Identification API', () => {
  it('should identify a plant from a valid image', async () => {
    const response = await request(baseUrl)
      .post('/identify')
      .set('Authorization', `Bearer ${process.env.API_KEY}`)
      .attach('image', 'tests/fixtures/plant.jpg')
      .expect(200);

    expect(response.body).toHaveProperty('results');
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});
```

#### Key API Test Scenarios

- Plant identification endpoints
- User authentication
- Collection management
- Care recommendations
- Error handling and edge cases

### 5. Accessibility Testing

#### Manual Accessibility Checks

- Screen reader compatibility
- Color contrast ratios
- Touch target sizes
- Keyboard navigation (for web views)
- Text scaling

#### Tools

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- iOS Accessibility Inspector
- Android Accessibility Scanner

### 6. Performance Testing

#### Key Metrics to Monitor

- App startup time
- Screen transition times
- Image processing speed
- API response times
- Memory usage

#### Tools

- [React Native Performance Monitor](https://github.com/oblador/react-native-performance)
- Xcode Instruments
- Android Profiler

## Implementation Plan

### Phase 1: Immediate Implementation

1. Create manual testing checklists for core features
2. Set up Storybook for component visual testing
3. Implement basic API integration tests

### Phase 2: Expanded Testing

1. Set up Detox for E2E testing of critical flows
2. Implement accessibility testing guidelines
3. Create performance testing benchmarks

### Phase 3: Continuous Improvement

1. Automate regular E2E test runs
2. Integrate visual testing into CI/CD pipeline
3. Revisit Jest unit testing as ecosystem evolves

## Conclusion

This alternative testing strategy provides a comprehensive approach to ensuring the quality of the FlorAI-Mobile application while development continues. By combining manual testing, E2E testing, component visual testing, API integration testing, accessibility testing, and performance testing, we can maintain high quality standards without being blocked by the current Jest testing challenges.

As the React Native and Expo ecosystem evolves, we will revisit the possibility of implementing Jest unit tests, but this strategy ensures that testing can proceed effectively in the meantime.
