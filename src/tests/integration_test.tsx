/**
 * FlorAI-Mobile Frontend Integration Test
 * 
 * This file contains tests for the React Native frontend integration with the backend services.
 * It tests the plant identification flow, privacy consent, and user authentication.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NavigationContainer } from '@react-navigation/native';

// Import components to test
import IdentifyScreen from '../screens/IdentifyScreen';
import PrivacyConsentScreen from '../screens/PrivacyConsentScreen';
import PrivacyDashboardScreen from '../screens/PrivacyDashboardScreen';

// Import services
import { identifyPlant } from '../services/plantIdentification';
import { saveConsent, getUserData, deleteAccount } from '../services/user';

// Mock axios for API testing
const mock = new MockAdapter(axios);

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock image picker
jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn().mockResolvedValue({
    cancelled: false,
    uri: 'file://test-image.jpg',
    width: 100,
    height: 100,
    type: 'image',
  }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    cancelled: false,
    uri: 'file://test-image.jpg',
    width: 100,
    height: 100,
    type: 'image',
  }),
  MediaTypeOptions: {
    Images: 'Images',
  },
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
}));

// Sample plant identification response
const mockPlantResponse = {
  results: [
    {
      id: 'test-plant-1',
      scientific_name: 'Monstera deliciosa',
      common_name: 'Swiss Cheese Plant',
      family: 'Araceae',
      probability: 0.95,
      description: 'A popular houseplant with large, glossy leaves that develop holes as they mature.',
      care_info: {
        watering: 'Allow soil to dry between waterings',
        sunlight: 'Bright indirect light',
        soil: 'Well-draining potting mix',
        propagation: 'Stem cuttings',
        pruning: 'Remove damaged or yellowing leaves',
      },
      health_assessment: {
        is_healthy: true,
        disease_name: null,
        probability: null,
        treatment: null,
      },
      image_url: 'https://example.com/plant-image.jpg',
    },
  ],
  is_plant: true,
  submission_id: 'test-submission-123',
};

// Test suite for plant identification
describe('Plant Identification Flow', () => {
  beforeEach(() => {
    // Reset mocks
    mock.reset();
    mockNavigate.mockClear();
    
    // Mock API responses
    mock.onPost('/api/plants/identify').reply(200, mockPlantResponse);
  });
  
  it('should identify a plant from camera capture', async () => {
    console.log('TEST: Plant identification from camera capture');
    
    // Mock the identifyPlant service function
    const mockIdentifyFn = jest.fn().mockResolvedValue(mockPlantResponse);
    (identifyPlant as jest.Mock) = mockIdentifyFn;
    
    // Render the IdentifyScreen component
    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <IdentifyScreen />
      </NavigationContainer>
    );
    
    // Find and press the camera button
    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);
    
    // Wait for the identification to complete
    await waitFor(() => {
      expect(mockIdentifyFn).toHaveBeenCalled();
      expect(getByText('Swiss Cheese Plant')).toBeTruthy();
      expect(getByText('Monstera deliciosa')).toBeTruthy();
      expect(queryByText('Loading...')).toBeNull();
    });
    
    console.log('✓ Plant identification from camera successful');
  });
  
  it('should identify a plant from gallery selection', async () => {
    console.log('TEST: Plant identification from gallery selection');
    
    // Mock the identifyPlant service function
    const mockIdentifyFn = jest.fn().mockResolvedValue(mockPlantResponse);
    (identifyPlant as jest.Mock) = mockIdentifyFn;
    
    // Render the IdentifyScreen component
    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <IdentifyScreen />
      </NavigationContainer>
    );
    
    // Find and press the gallery button
    const galleryButton = getByTestId('gallery-button');
    fireEvent.press(galleryButton);
    
    // Wait for the identification to complete
    await waitFor(() => {
      expect(mockIdentifyFn).toHaveBeenCalled();
      expect(getByText('Swiss Cheese Plant')).toBeTruthy();
      expect(getByText('Monstera deliciosa')).toBeTruthy();
      expect(queryByText('Loading...')).toBeNull();
    });
    
    console.log('✓ Plant identification from gallery successful');
  });
  
  it('should handle identification errors gracefully', async () => {
    console.log('TEST: Plant identification error handling');
    
    // Mock the identifyPlant service function to throw an error
    const mockIdentifyFn = jest.fn().mockRejectedValue(new Error('Network error'));
    (identifyPlant as jest.Mock) = mockIdentifyFn;
    
    // Render the IdentifyScreen component
    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <IdentifyScreen />
      </NavigationContainer>
    );
    
    // Find and press the camera button
    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(mockIdentifyFn).toHaveBeenCalled();
      expect(getByText(/error/i)).toBeTruthy();
      expect(queryByText('Loading...')).toBeNull();
    });
    
    console.log('✓ Plant identification error handling successful');
  });
});

// Test suite for privacy consent
describe('Privacy Consent Flow', () => {
  beforeEach(() => {
    // Reset mocks
    mock.reset();
    mockNavigate.mockClear();
    
    // Mock API responses
    mock.onPost('/api/auth/consent').reply(200, { success: true });
  });
  
  it('should save user consent preferences', async () => {
    console.log('TEST: Privacy consent saving');
    
    // Mock the saveConsent service function
    const mockSaveConsentFn = jest.fn().mockResolvedValue({ success: true });
    (saveConsent as jest.Mock) = mockSaveConsentFn;
    
    // Render the PrivacyConsentScreen component
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <PrivacyConsentScreen />
      </NavigationContainer>
    );
    
    // Toggle consent switches
    const locationSwitch = getByTestId('location-consent-switch');
    const notificationsSwitch = getByTestId('notifications-consent-switch');
    const dataUsageSwitch = getByTestId('data-usage-consent-switch');
    const tosCheckbox = getByTestId('tos-checkbox');
    
    fireEvent(locationSwitch, 'valueChange', true);
    fireEvent(notificationsSwitch, 'valueChange', false);
    fireEvent(dataUsageSwitch, 'valueChange', true);
    fireEvent(tosCheckbox, 'valueChange', true);
    
    // Submit the form
    const submitButton = getByText('Accept & Continue');
    fireEvent.press(submitButton);
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockSaveConsentFn).toHaveBeenCalledWith({
        locationConsent: true,
        notificationsConsent: false,
        dataUsageConsent: true,
        tosAccepted: true,
      });
      expect(mockNavigate).toHaveBeenCalled();
    });
    
    console.log('✓ Privacy consent saving successful');
  });
});

// Test suite for privacy dashboard
describe('Privacy Dashboard Flow', () => {
  beforeEach(() => {
    // Reset mocks
    mock.reset();
    mockNavigate.mockClear();
    
    // Mock API responses
    mock.onGet('/api/auth/user').reply(200, {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      consentPreferences: {
        locationConsent: true,
        notificationsConsent: false,
        dataUsageConsent: true,
        tosAccepted: true,
      },
    });
    mock.onDelete('/api/auth/user').reply(200, { success: true });
  });
  
  it('should display user data correctly', async () => {
    console.log('TEST: Privacy dashboard user data display');
    
    // Mock the getUserData service function
    const mockGetUserDataFn = jest.fn().mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      consentPreferences: {
        locationConsent: true,
        notificationsConsent: false,
        dataUsageConsent: true,
        tosAccepted: true,
      },
    });
    (getUserData as jest.Mock) = mockGetUserDataFn;
    
    // Render the PrivacyDashboardScreen component
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <PrivacyDashboardScreen />
      </NavigationContainer>
    );
    
    // Wait for the user data to be displayed
    await waitFor(() => {
      expect(mockGetUserDataFn).toHaveBeenCalled();
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByTestId('location-consent-switch').props.value).toBe(true);
      expect(getByTestId('notifications-consent-switch').props.value).toBe(false);
      expect(getByTestId('data-usage-switch').props.value).toBe(true);
    });
    
    console.log('✓ Privacy dashboard user data display successful');
  });
  
  it('should handle account deletion', async () => {
    console.log('TEST: Account deletion');
    
    // Mock the deleteAccount service function
    const mockDeleteAccountFn = jest.fn().mockResolvedValue({ success: true });
    (deleteAccount as jest.Mock) = mockDeleteAccountFn;
    
    // Render the PrivacyDashboardScreen component
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <PrivacyDashboardScreen />
      </NavigationContainer>
    );
    
    // Find and press the delete account button
    const deleteButton = getByText('Delete My Account');
    fireEvent.press(deleteButton);
    
    // Confirm deletion in the modal
    const confirmButton = getByTestId('confirm-delete-button');
    fireEvent.press(confirmButton);
    
    // Wait for the account deletion to complete
    await waitFor(() => {
      expect(mockDeleteAccountFn).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
    
    console.log('✓ Account deletion successful');
  });
});

// Run the tests
console.log('=== FlorAI-Mobile Frontend Integration Tests ===');
console.log('Starting tests at', new Date().toISOString());
