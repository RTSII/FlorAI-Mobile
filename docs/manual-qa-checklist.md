# FlorAI-Mobile Manual QA Checklist

This document provides comprehensive testing checklists for the core flows and features of the FlorAI-Mobile application. Use these checklists during manual testing to ensure consistent quality across all app functionality.

## General App Testing

### App Launch & Onboarding

- [ ] App launches successfully without crashes
- [ ] Splash screen displays correctly
- [ ] First-time user onboarding flow works as expected
- [ ] Permission requests (camera, notifications, location) display properly
- [ ] User can skip onboarding and access it later from settings
- [ ] Onboarding progress is saved if interrupted

### Navigation & UI

- [ ] Bottom tab navigation works correctly
- [ ] Navigation between all main screens is smooth
- [ ] Back button behavior is consistent
- [ ] UI elements follow the design system specifications
- [ ] Dark/light mode switching works correctly
- [ ] Typography scales appropriately on different devices
- [ ] UI is responsive on various screen sizes
- [ ] Loading states and indicators display properly
- [ ] Error states are handled gracefully with user-friendly messages

## Core Feature Testing

### Plant Identification Flow

#### Camera Functionality

- [ ] Camera permission is requested appropriately
- [ ] Camera preview displays correctly
- [ ] User can switch between front and rear cameras
- [ ] Flash toggle works correctly
- [ ] Camera focus works properly
- [ ] Photo capture button works and provides feedback
- [ ] Captured image preview displays correctly

#### Gallery Selection

- [ ] Gallery access permission is requested appropriately
- [ ] User can select images from gallery
- [ ] Selected image preview displays correctly
- [ ] Multiple image selection works if applicable

#### Identification Process

- [ ] Loading state displays during API call
- [ ] Progress indicator shows identification steps
- [ ] Timeout handling works correctly
- [ ] Error handling for API failures is graceful
- [ ] Network connectivity issues are handled appropriately
- [ ] Cancellation of identification process works

#### Results Display

- [ ] Identified plant information displays correctly
- [ ] Scientific and common names are shown
- [ ] Confidence percentage is displayed
- [ ] Plant image is shown alongside results
- [ ] Similar species are listed when available
- [ ] User can expand/collapse additional information
- [ ] "Add to Collection" button works correctly
- [ ] "Identify Another" option works correctly
- [ ] Share functionality works if implemented

### Collection Management

- [ ] User can view their plant collection
- [ ] Plants are displayed with correct information
- [ ] Collection sorting and filtering works
- [ ] User can create multiple collections if applicable
- [ ] Adding plants to collections works correctly
- [ ] Removing plants from collections works correctly
- [ ] Plant detail view shows comprehensive information
- [ ] Editing plant information works if applicable
- [ ] Collection search functionality works correctly

### Plant Details & Care

- [ ] Plant detail page shows complete information
- [ ] Care instructions are displayed correctly
- [ ] Watering schedule information is accurate
- [ ] Light requirements are displayed
- [ ] Temperature and humidity preferences are shown
- [ ] Seasonal care variations are indicated if applicable
- [ ] Common issues and solutions are provided
- [ ] Additional resources or links work correctly

### AI Plant Doctor (Premium Feature)

- [ ] User can access AI Plant Doctor feature
- [ ] Premium feature indicator is displayed correctly
- [ ] User can upload images of plant issues
- [ ] Diagnosis process works correctly
- [ ] Loading states display appropriately
- [ ] Results provide actionable recommendations
- [ ] History of diagnoses is saved if applicable
- [ ] Non-premium users see appropriate upgrade prompts

## User Account & Settings

### User Account

- [ ] User can create a new account
- [ ] Login with existing credentials works
- [ ] Password reset functionality works
- [ ] Social login options work if implemented
- [ ] User profile information can be viewed and edited
- [ ] Account deletion process works correctly
- [ ] Session handling and token refresh works properly

### Settings

- [ ] All settings options are accessible
- [ ] Theme toggle (light/dark) works correctly
- [ ] Notification preferences can be adjusted
- [ ] App permissions can be reviewed
- [ ] Language selection works if implemented
- [ ] Data usage settings work if applicable
- [ ] About section shows correct app version and info
- [ ] Help and support options are functional

## Premium Features & Subscription

### Premium Features Access

- [ ] Premium features are correctly gated
- [ ] Premium indicators display appropriately
- [ ] Free trial options work if applicable
- [ ] Premium feature previews work correctly

### Subscription Process

- [ ] Subscription options display correctly
- [ ] Pricing information is accurate
- [ ] Payment processing works correctly
- [ ] Receipt/confirmation is provided
- [ ] Subscription status updates appropriately
- [ ] Cancellation process works correctly
- [ ] Renewal notifications work if applicable

## Performance & Reliability

### Performance

- [ ] App startup time is within acceptable range
- [ ] Screen transitions are smooth
- [ ] Scrolling performance is smooth
- [ ] Image loading is optimized
- [ ] App remains responsive during network operations
- [ ] Memory usage remains stable during extended use

### Reliability

- [ ] App recovers gracefully from background state
- [ ] App handles interruptions (calls, notifications) properly
- [ ] Data persistence works correctly
- [ ] App works in airplane mode for offline features
- [ ] App handles poor network conditions gracefully
- [ ] No unexpected crashes during normal operation

## Accessibility

### Screen Reader Support

- [ ] All UI elements are properly labeled for screen readers
- [ ] Navigation flow makes sense with screen reader
- [ ] Custom actions are accessible via screen reader
- [ ] Dynamic content updates are announced appropriately

### Visual Accessibility

- [ ] Color contrast meets accessibility standards
- [ ] Text is readable at different font sizes
- [ ] Touch targets are appropriately sized
- [ ] Focus indicators are visible when using keyboard navigation
- [ ] No critical information is conveyed by color alone

## Test Case Template

For detailed testing of specific features, use the following template:

```
## Test Case ID: [Unique ID]

### Feature: [Feature Name]
### Test Case: [Brief Description]
### Priority: [High/Medium/Low]
### Preconditions:
- [List any prerequisites]

### Steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]
...

### Expected Result:
[What should happen]

### Actual Result:
[What actually happened]

### Status: [Pass/Fail]
### Notes:
[Any observations or issues]

### Environment:
- Device: [Device model]
- OS Version: [iOS/Android version]
- App Version: [App version]
- Network: [WiFi/Cellular/Offline]
```

## Bug Report Template

When issues are found during manual testing, use this template to report bugs:

```
## Bug ID: [Unique ID]

### Summary:
[Brief description of the issue]

### Severity: [Critical/High/Medium/Low]
### Priority: [High/Medium/Low]
### Reproducibility: [Always/Sometimes/Rarely]

### Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
...

### Expected Behavior:
[What should happen]

### Actual Behavior:
[What actually happened]

### Screenshots/Videos:
[Attach if available]

### Environment:
- Device: [Device model]
- OS Version: [iOS/Android version]
- App Version: [App version]
- Network: [WiFi/Cellular/Offline]

### Additional Notes:
[Any other relevant information]
```

## Testing Schedule

For consistent quality assurance, follow this testing schedule:

1. **Daily Testing**: Basic smoke tests of core functionality
2. **Feature Testing**: Complete testing of new features before merge
3. **Regression Testing**: Full checklist review before each release
4. **Post-Release Testing**: Verification of critical paths after deployment

This manual QA checklist should be updated regularly as new features are added or existing features are modified.
