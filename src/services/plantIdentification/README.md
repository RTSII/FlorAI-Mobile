# Plant Identification Service

## Overview

The Plant Identification Service is a core component of the FlorAI Mobile application that handles plant identification using image recognition. This service integrates with external plant identification APIs to provide users with accurate plant information and follows the standardized service structure pattern.

## Features

- Image-based plant identification
- Detailed plant information retrieval
- Confidence level assessment
- Enhanced error handling with user-friendly messages
- Centralized environment configuration validation
- Secure API key management
- TypeScript type safety throughout the service

## Directory Structure

```
plantIdentification/
├── api.ts              # API integration layer
├── index.ts            # Main service exports
├── types.ts            # Type definitions
├── utils.ts            # Utility functions
├── README.md           # This documentation
└── __tests__/          # Test files
```

## Usage

```typescript
import { plantIdentificationService } from '../../services/plantIdentification';
import { useAppContext } from '../../contexts';

// Identify a plant from an image
const identifyPlant = async (imageUri: string) => {
  const { dispatch } = useAppContext();
  const response = await plantIdentificationService.identifyPlant(imageUri);
  
  if (response.data) {
    // Map API result to app Plant type
    const plant = plantIdentificationService.mapResultToPlant(response.data.results[0]);
    
    // Save to app state
    plantIdentificationService.saveIdentifiedPlant(plant, dispatch);
    return plant;
  } else if (response.error) {
    console.error('Plant identification error:', response.error.message);
    // Handle specific error codes
    switch (response.error.code) {
      case 'NETWORK_ERROR':
        // Handle network error
        break;
      case 'VALIDATION_ERROR':
        // Handle validation error
        break;
      // Handle other error types
    }
  }
  
  return null;
};

// Get detailed information about a plant
const getPlantDetails = async (plantId: string) => {
  const response = await plantIdentificationService.getPlantDetails(plantId);
  
  if (response.data) {
    return response.data;
  } else if (response.error) {
    console.error('Get plant details error:', response.error.message);
  }
  
  return null;
};
```

## API Reference

### `identifyPlant(imageUri: string, options?: PlantIdentificationOptions)`

Identifies a plant from an image URI.

**Parameters:**
- `imageUri`: URI of the captured image
- `options`: Optional identification options

**Returns:**
- `Promise<ApiResponse<PlantIdentificationResponse>>`

### `getPlantDetails(plantId: string)`

Gets detailed information about a specific plant.

**Parameters:**
- `plantId`: ID of the identified plant

**Returns:**
- `Promise<ApiResponse<PlantDetails>>`

### `mapResultToPlant(result: PlantIdentificationResult)`

Converts plant identification result to app Plant type.

**Parameters:**
- `result`: The plant identification result from API

**Returns:**
- `Plant`: Plant object formatted for the app state

### `saveIdentifiedPlant(plant: Plant, dispatch: React.Dispatch<AppAction>)`

Saves identified plant to app state.

**Parameters:**
- `plant`: The plant to save
- `dispatch`: The app context dispatch function

## Error Handling

The service provides detailed error handling with specific error codes and user-friendly messages for various scenarios:

- Network errors
- Authentication errors
- Timeout errors
- Configuration errors
- Image processing errors
- Invalid response errors

## Dependencies

- API Client
- Environment Configuration
- Plant Types
