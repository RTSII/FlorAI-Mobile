# FlorAI-Mobile End-to-End Integration Testing Plan

## Overview

This document outlines the comprehensive testing plan for validating the end-to-end integration between the React Native frontend, Node.js/Express backend, and Python microservice components of the FlorAI-Mobile application. The goal is to ensure all components work together properly, data flows correctly through the system, and user privacy is maintained throughout.

## Testing Environment Setup

### Prerequisites

1. **Frontend Setup**
   - React Native app installed on test device or emulator
   - Development environment configured with proper environment variables
   - Network access to backend services

2. **Backend Setup**
   - Node.js/Express server running locally or on test environment
   - Environment variables configured (JWT secret, microservice URL, etc.)
   - Logging enabled for debugging

3. **Python Microservice Setup**
   - FastAPI service running locally or on test environment
   - Plant.id API key configured in environment variables
   - Logging enabled for debugging

4. **Test Data**
   - Collection of plant images for identification testing
   - Test user accounts for authentication testing
   - Mock data for collection testing

## Test Cases

### 1. Component Communication Tests

#### 1.1 Frontend to Backend Communication

| Test ID | Description         | Steps                                                                                 | Expected Result                                    |
| ------- | ------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| COM-01  | Basic health check  | 1. Start all services<br>2. Call health endpoint from frontend                        | Backend returns 200 OK with service status         |
| COM-02  | Authentication flow | 1. Register new user<br>2. Login with credentials<br>3. Access protected endpoint     | JWT token received and protected resource accessed |
| COM-03  | Error handling      | 1. Attempt to access protected resource without token<br>2. Observe frontend response | Appropriate error message displayed to user        |

#### 1.2 Backend to Microservice Communication

| Test ID | Description               | Steps                                                                        | Expected Result                                    |
| ------- | ------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| COM-04  | Microservice health check | 1. Call microservice health endpoint from backend                            | 200 OK response with service status                |
| COM-05  | Image forwarding          | 1. Send test image from backend to microservice<br>2. Verify response        | Image successfully processed and response received |
| COM-06  | Error propagation         | 1. Send invalid request to microservice<br>2. Observe backend error handling | Error properly caught and formatted for frontend   |

### 2. Plant Identification Flow Tests

#### 2.1 Camera Capture to Identification

| Test ID | Description                      | Steps                                                                                                             | Expected Result                                                    |
| ------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| PLT-01  | End-to-end camera identification | 1. Open app and navigate to identify screen<br>2. Capture plant image with camera<br>3. Submit for identification | Loading indicator shown, then results displayed with plant details |
| PLT-02  | Gallery selection identification | 1. Open app and navigate to identify screen<br>2. Select image from gallery<br>3. Submit for identification       | Loading indicator shown, then results displayed with plant details |
| PLT-03  | Health assessment                | 1. Capture plant image<br>2. Enable health assessment option<br>3. Submit for identification                      | Results include health assessment information                      |

#### 2.2 Results Display and Storage

| Test ID | Description          | Steps                                                                | Expected Result                                         |
| ------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| PLT-04  | Results accuracy     | 1. Submit known plant image<br>2. Compare results with expected data | Correct plant species identified with high confidence   |
| PLT-05  | Save to collection   | 1. Identify plant<br>2. Save to collection<br>3. Check collection    | Plant appears in user's collection with correct details |
| PLT-06  | Detailed information | 1. Identify plant<br>2. View detailed information                    | Comprehensive plant details displayed                   |

### 3. Privacy and Consent Tests

#### 3.1 Consent Management

| Test ID | Description          | Steps                                                                                | Expected Result                               |
| ------- | -------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| PRV-01  | Initial consent flow | 1. Register new user<br>2. Complete consent screen<br>3. Verify backend storage      | Consent preferences saved and enforced        |
| PRV-02  | Update consent       | 1. Navigate to Privacy Dashboard<br>2. Change consent preferences<br>3. Save changes | Updated preferences saved and enforced        |
| PRV-03  | Consent enforcement  | 1. Disable data usage consent<br>2. Identify plant<br>3. Check backend logs          | Image not used for AI training as per consent |

#### 3.2 Data Management

| Test ID | Description        | Steps                                                                        | Expected Result                                      |
| ------- | ------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| PRV-04  | Download user data | 1. Request data download from Privacy Dashboard<br>2. Verify downloaded data | Complete user data provided in accessible format     |
| PRV-05  | Delete account     | 1. Request account deletion<br>2. Confirm deletion<br>3. Attempt to login    | Account and all associated data removed, login fails |
| PRV-06  | Data minimization  | 1. Identify plant<br>2. Check backend storage                                | Raw images deleted after processing as per policy    |

### 4. Error Handling and Edge Cases

#### 4.1 Network and Service Failures

| Test ID | Description           | Steps                                                                                         | Expected Result                                          |
| ------- | --------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| ERR-01  | Network disconnection | 1. Enable airplane mode<br>2. Attempt plant identification<br>3. Restore connection and retry | Appropriate offline message shown, retry succeeds        |
| ERR-02  | Backend service down  | 1. Stop backend service<br>2. Attempt operations in app<br>3. Restart service                 | Graceful error handling with retry options               |
| ERR-03  | Microservice failure  | 1. Stop Python microservice<br>2. Attempt plant identification<br>3. Check error handling     | User-friendly error message with troubleshooting options |

#### 4.2 Input Validation and Security

| Test ID | Description           | Steps                                                               | Expected Result                                  |
| ------- | --------------------- | ------------------------------------------------------------------- | ------------------------------------------------ |
| ERR-04  | Invalid image format  | 1. Submit non-image file for identification                         | Appropriate validation error shown               |
| ERR-05  | Oversized image       | 1. Submit extremely large image file                                | Image is properly resized or error message shown |
| ERR-06  | Authentication expiry | 1. Manipulate token to be expired<br>2. Attempt protected operation | Token refresh or re-authentication prompt        |

### 5. Cross-Platform Compatibility

| Test ID | Description            | Steps                                              | Expected Result                                   |
| ------- | ---------------------- | -------------------------------------------------- | ------------------------------------------------- |
| CPT-01  | iOS testing            | Run all core test cases on iOS device/simulator    | Consistent behavior across all tests              |
| CPT-02  | Android testing        | Run all core test cases on Android device/emulator | Consistent behavior across all tests              |
| CPT-03  | Different device sizes | Test on various screen sizes and orientations      | UI adapts appropriately to different form factors |

## Test Execution

### Testing Process

1. **Setup Phase**
   - Prepare test environment with all components running
   - Create test user accounts and data
   - Document initial state

2. **Execution Phase**
   - Execute test cases in logical order
   - Document results, including screenshots and logs
   - Note any deviations from expected behavior

3. **Analysis Phase**
   - Categorize issues by severity and component
   - Identify patterns in failures
   - Document workarounds for critical issues

### Issue Tracking

For each issue found, document:

- Test case ID and description
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or logs
- Severity (Critical, High, Medium, Low)
- Component(s) involved

## Performance Metrics

During testing, monitor and record:

1. **Response Times**
   - Time from image submission to identification results
   - API response times for key operations
   - UI rendering performance

2. **Resource Usage**
   - Memory consumption on mobile device
   - CPU usage during intensive operations
   - Backend server load

3. **Error Rates**
   - Percentage of failed requests
   - Most common error types
   - Recovery success rate

## Security Verification

Verify that:

1. All API keys are stored securely on the backend
2. All communications use HTTPS/TLS
3. JWT tokens are properly validated
4. User data is properly encrypted
5. Privacy consent settings are enforced throughout the system

## Test Reporting

After completing the testing, prepare a report including:

1. Executive summary of test results
2. Detailed test case results
3. List of identified issues with severity
4. Performance metrics summary
5. Recommendations for improvements

## Next Steps After Testing

Based on test results:

1. Prioritize bug fixes by severity
2. Address performance bottlenecks
3. Implement security improvements if needed
4. Document lessons learned for future development
5. Update project plan with insights from testing

---

This testing plan will be updated as needed throughout the testing process to address new scenarios or edge cases discovered during testing.
