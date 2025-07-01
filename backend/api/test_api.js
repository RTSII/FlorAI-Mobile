/**
 * Test script for FlorAI API Server
 * This script tests the functionality of the Node.js/Express backend
 */
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:3000';
const PLANT_SERVICE_URL = 'http://localhost:8000';
let authToken = null;

// Test image path (replace with an actual image path for testing)
const TEST_IMAGE_PATH = path.join(__dirname, 'test_plant.jpg');

// Create a test image if it doesn't exist
if (!fs.existsSync(TEST_IMAGE_PATH)) {
  console.log(`Creating placeholder test image at ${TEST_IMAGE_PATH}`);
  // Create a small placeholder JPEG file
  const placeholderImageData = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xdb, 0x00, 0x43, 0x01, 0x09, 0x09,
    0x09, 0x0c, 0x0b, 0x0c, 0x18, 0x0d, 0x0d, 0x18, 0x32, 0x21, 0x1c, 0x21,
    0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32,
    0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32,
    0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32,
    0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32,
    0x32, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x03,
    0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff, 0xc4, 0x00,
    0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
    0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00,
    0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00,
    0x00, 0x01, 0x7d, 0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21,
    0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81,
    0x91, 0xa1, 0x08
  ]);
  fs.writeFileSync(TEST_IMAGE_PATH, placeholderImageData);
}

// Helper function to log test results
function logResult(testName, success, message) {
  console.log(`${success ? '✓' : '✗'} ${testName}: ${message}`);
}

// Test health check endpoint
async function testHealthCheck() {
  try {
    console.log('\n1. Testing health check endpoint...');
    const response = await axios.get(`${API_URL}/health`);
    
    if (response.status === 200 && response.data.status === 'healthy') {
      logResult('Health check', true, 'API server is healthy');
      return true;
    } else {
      logResult('Health check', false, `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logResult('Health check', false, `Error: ${error.message}`);
    console.log('Is the API server running? Make sure to start it on port 3000.');
    return false;
  }
}

// Test authentication
async function testAuthentication() {
  try {
    console.log('\n2. Testing authentication...');
    
    // Register a test user
    console.log('2.1 Testing user registration...');
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    
    if (registerResponse.status === 201 && registerResponse.data.token) {
      logResult('User registration', true, 'Successfully registered test user');
      authToken = registerResponse.data.token;
    } else {
      logResult('User registration', false, `Unexpected response: ${JSON.stringify(registerResponse.data)}`);
    }
    
    // Login with test user
    console.log('\n2.2 Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      logResult('User login', true, 'Successfully logged in test user');
      authToken = loginResponse.data.token;
      return true;
    } else {
      logResult('User login', false, `Unexpected response: ${JSON.stringify(loginResponse.data)}`);
      return false;
    }
  } catch (error) {
    logResult('Authentication', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Test plant identification
async function testPlantIdentification() {
  try {
    console.log('\n3. Testing plant identification...');
    
    // Create form data with test image
    const formData = new FormData();
    formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('includeHealthAssessment', 'true');
    formData.append('detailedInfo', 'true');
    
    // Send plant identification request
    const headers = {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${authToken}`
    };
    
    const response = await axios.post(
      `${API_URL}/api/plants/identify`,
      formData,
      { headers }
    );
    
    if (response.status === 200 && response.data) {
      logResult('Plant identification', true, 'Successfully identified plant');
      console.log(`Plant data: ${JSON.stringify(response.data, null, 2)}`);
      return true;
    } else {
      logResult('Plant identification', false, `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logResult('Plant identification', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Test privacy consent
async function testPrivacyConsent() {
  try {
    console.log('\n4. Testing privacy consent...');
    
    // Update consent preferences
    const consentResponse = await axios.post(
      `${API_URL}/api/auth/consent`,
      {
        locationConsent: true,
        notificationsConsent: false,
        dataUsageConsent: true
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (consentResponse.status === 200 && consentResponse.data.success) {
      logResult('Privacy consent', true, 'Successfully updated privacy preferences');
      console.log(`Consent data: ${JSON.stringify(consentResponse.data, null, 2)}`);
      return true;
    } else {
      logResult('Privacy consent', false, `Unexpected response: ${JSON.stringify(consentResponse.data)}`);
      return false;
    }
  } catch (error) {
    logResult('Privacy consent', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Test user plant collection
async function testUserPlantCollection() {
  try {
    console.log('\n5. Testing user plant collection...');
    
    // Get user's plant collection
    const collectionResponse = await axios.get(
      `${API_URL}/api/plants/user/collection`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (collectionResponse.status === 200) {
      logResult('User plant collection', true, 'Successfully retrieved user plant collection');
      console.log(`Collection data: ${JSON.stringify(collectionResponse.data, null, 2)}`);
      return true;
    } else {
      logResult('User plant collection', false, `Unexpected response: ${JSON.stringify(collectionResponse.data)}`);
      return false;
    }
  } catch (error) {
    logResult('User plant collection', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Test microservice health check
async function testMicroserviceHealthCheck() {
  try {
    console.log('\n6. Testing microservice health check...');
    const response = await axios.get(`${PLANT_SERVICE_URL}/`);
    
    if (response.status === 200) {
      logResult('Microservice health check', true, 'Plant.id microservice is healthy');
      return true;
    } else {
      logResult('Microservice health check', false, `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logResult('Microservice health check', false, `Error: ${error.message}`);
    console.log('Is the Plant.id microservice running? Make sure to start it on port 8000.');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== FlorAI API Server Tests ===');
  console.log('Starting tests at', new Date().toISOString());
  
  // Run tests in sequence
  const healthCheckSuccess = await testHealthCheck();
  
  if (healthCheckSuccess) {
    const authSuccess = await testAuthentication();
    
    if (authSuccess) {
      await testPrivacyConsent();
      await testUserPlantCollection();
    }
  }
  
  // Test microservice independently
  await testMicroserviceHealthCheck();
  
  if (healthCheckSuccess) {
    await testPlantIdentification();
  }
  
  console.log('\n=== Test Summary ===');
  console.log('Tests completed at', new Date().toISOString());
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
});
