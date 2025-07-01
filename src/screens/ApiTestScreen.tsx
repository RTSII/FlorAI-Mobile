import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApiPlantData } from '../hooks/useApiPlantData.ts';
import { useApiUserPlants } from '../hooks/useApiUserPlants.ts';
import { useApiPlantIdentification } from '../hooks/useApiPlantIdentification.ts';
import { useAppContext } from '../store/AppContext.tsx';

/**
 * Test screen to demonstrate API integration with state management
 */
const ApiTestScreen: React.FC = () => {
  const { state } = useAppContext();
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // API hooks
  const plantData = useApiPlantData();
  const userPlants = useApiUserPlants();
  const plantIdentification = useApiPlantIdentification();
  
  // Add a log entry
  const addLog = (message: string) => {
    setTestResults(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };
  
  // Test plant search
  const testPlantSearch = async () => {
    addLog('Testing plant search...');
    const result = await plantData.searchForPlants({ 
      query: 'monstera', 
      page: 1,
      pageSize: 5
    });
    if (result) {
      addLog(`Search successful! Found ${result.results.length} plants.`);
    } else {
      addLog('Search failed.');
    }
  };
  
  // Test plant details
  const testPlantDetails = async () => {
    addLog('Testing plant details fetch...');
    const result = await plantData.fetchPlantDetails('monstera-deliciosa');
    if (result) {
      addLog(`Details fetch successful! Plant: ${result.scientificName}`);
    } else {
      addLog('Details fetch failed.');
    }
  };
  
  // Test adding a user plant
  const testAddUserPlant = async () => {
    addLog('Testing add user plant...');
    const mockPlant = {
      name: 'Test Plant',
      scientificName: 'Testus Plantus',
      addedDate: new Date().toISOString(),
      healthStatus: 'healthy' as const,
    };
    
    const result = await userPlants.addPlantToCollection(mockPlant);
    if (result) {
      addLog(`Plant added successfully! ID: ${result.id}`);
    } else {
      addLog('Adding plant failed.');
    }
  };
  
  // Test plant identification
  const testPlantIdentification = async () => {
    addLog('Testing plant identification...');
    const mockRequest = {
      images: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...'], // Mock base64 image
      organs: ['leaf'],
    };
    
    const result = await plantIdentification.identifyPlantFromImages(mockRequest);
    if (result) {
      addLog(`Identification successful! Found ${result.results.length} matches.`);
    } else {
      addLog('Identification failed.');
    }
  };
  
  // Test error handling
  const testErrorHandling = async () => {
    addLog('Testing error handling...');
    // Force an error by using an invalid plant ID
    try {
      const result = await plantData.fetchPlantDetails('invalid-plant-id-that-doesnt-exist');
      if (!result) {
        addLog('Error handling worked correctly - no result returned');
      }
    } catch (error) {
      addLog(`Error caught: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    addLog('Error handling test complete.');
  };
  
  // Clear logs
  const clearLogs = () => {
    setTestResults([]);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testPlantSearch}>
          <Text style={styles.buttonText}>Test Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testPlantDetails}>
          <Text style={styles.buttonText}>Test Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testAddUserPlant}>
          <Text style={styles.buttonText}>Test Add Plant</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testPlantIdentification}>
          <Text style={styles.buttonText}>Test Identification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={testErrorHandling}>
          <Text style={styles.buttonText}>Test Error</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearLogs}>
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stateContainer}>
        <Text style={styles.sectionTitle}>Current State:</Text>
        <Text>Loading: {state.isLoading ? 'Yes' : 'No'}</Text>
        <Text>Error: {state.error || 'None'}</Text>
        <Text>User Plants: {state.userPlants.length}</Text>
        <Text>Identified Plants: {state.identifiedPlants.length}</Text>
      </View>
      
      <View style={styles.logContainer}>
        <Text style={styles.sectionTitle}>Test Logs:</Text>
        <ScrollView style={styles.logs}>
          {testResults.map((log, index) => (
            <Text key={index} style={styles.logEntry}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
  },
  errorButton: {
    backgroundColor: '#F44336',
  },
  clearButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stateContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  logs: {
    flex: 1,
  },
  logEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
});

export default ApiTestScreen;
