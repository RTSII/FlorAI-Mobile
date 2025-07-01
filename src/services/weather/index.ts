/**
 * Weather Service
 * 
 * Provides weather data for environmental context in plant health analysis
 * Uses OpenWeatherMap API (requires API key)
 */
import { ApiError, ApiErrorCode } from '../api/types';

// API key should be stored in environment variables or secure storage
// For development, we're using a placeholder
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temperature: number | null; // Celsius
  humidity: number | null; // Percentage
  conditions: string | null; // Description
  uvIndex: number | null;
  windSpeed: number | null; // m/s
  precipitation: number | null; // mm
  timestamp: string;
}

/**
 * Get current weather data for a location
 * @param latitude Location latitude
 * @param longitude Location longitude
 * @returns Weather data for the location
 */
export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  try {
    // Build API URL
    const url = `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
    
    // Make API request
    const response = await fetch(url);
    
    // Check for errors
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Extract relevant data
    return {
      temperature: data.main?.temp ?? null,
      humidity: data.main?.humidity ?? null,
      conditions: data.weather?.[0]?.description ?? null,
      uvIndex: data.uvi ?? null, // Not available in basic API response
      windSpeed: data.wind?.speed ?? null,
      precipitation: data.rain?.['1h'] ?? 0, // mm in last hour, 0 if no rain
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Return null values if API fails
    // This allows the app to continue functioning without weather data
    return {
      temperature: null,
      humidity: null,
      conditions: null,
      uvIndex: null,
      windSpeed: null,
      precipitation: null,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get historical weather data for a location
 * Note: This requires a paid API plan with OpenWeatherMap
 * @param latitude Location latitude
 * @param longitude Location longitude
 * @param timestamp Timestamp for historical data (Unix timestamp)
 * @returns Historical weather data for the location
 */
export async function getHistoricalWeatherData(
  latitude: number,
  longitude: number,
  timestamp: number
): Promise<WeatherData> {
  try {
    // Build API URL for historical data
    // Note: This endpoint requires a paid subscription
    const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${timestamp}&units=metric&appid=${WEATHER_API_KEY}`;
    
    // Make API request
    const response = await fetch(url);
    
    // Check for errors
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Extract relevant data
    return {
      temperature: data.current?.temp ?? null,
      humidity: data.current?.humidity ?? null,
      conditions: data.current?.weather?.[0]?.description ?? null,
      uvIndex: data.current?.uvi ?? null,
      windSpeed: data.current?.wind_speed ?? null,
      precipitation: data.current?.rain?.['1h'] ?? 0,
      timestamp: new Date(timestamp * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    
    // Return null values if API fails
    return {
      temperature: null,
      humidity: null,
      conditions: null,
      uvIndex: null,
      windSpeed: null,
      precipitation: null,
      timestamp: new Date(timestamp * 1000).toISOString(),
    };
  }
}

/**
 * Get growing conditions assessment based on weather data
 * @param weatherData Current weather data
 * @returns Assessment of growing conditions
 */
export function assessGrowingConditions(weatherData: WeatherData): {
  isIdeal: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Temperature assessment
  if (weatherData.temperature !== null) {
    if (weatherData.temperature > 35) {
      issues.push('Extreme heat');
      recommendations.push('Provide shade and increase watering');
    } else if (weatherData.temperature < 5) {
      issues.push('Cold conditions');
      recommendations.push('Consider moving sensitive plants indoors');
    }
  }
  
  // Humidity assessment
  if (weatherData.humidity !== null) {
    if (weatherData.humidity > 85) {
      issues.push('High humidity');
      recommendations.push('Ensure good air circulation to prevent fungal diseases');
    } else if (weatherData.humidity < 30) {
      issues.push('Low humidity');
      recommendations.push('Consider misting plants or using a humidifier');
    }
  }
  
  // UV index assessment
  if (weatherData.uvIndex !== null && weatherData.uvIndex > 8) {
    issues.push('High UV exposure');
    recommendations.push('Provide shade during peak sunlight hours');
  }
  
  // Wind assessment
  if (weatherData.windSpeed !== null && weatherData.windSpeed > 8) {
    issues.push('Strong winds');
    recommendations.push('Protect plants from wind damage with barriers');
  }
  
  // Overall assessment
  const isIdeal = issues.length === 0;
  
  return {
    isIdeal,
    issues,
    recommendations,
  };
}

/**
 * Get plant stress risk based on weather forecast
 * Note: This would require a forecast API call (not implemented)
 * @param latitude Location latitude
 * @param longitude Location longitude
 * @returns Risk assessment for plant stress
 */
export async function getPlantStressRisk(
  latitude: number,
  longitude: number
): Promise<{
  riskLevel: 'low' | 'moderate' | 'high';
  stressFactors: string[];
  forecast: string;
}> {
  try {
    // This would make a forecast API call in a real implementation
    // For now, we'll return mock data
    
    // Random risk level for demonstration
    const riskLevels = ['low', 'moderate', 'high'] as const;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    // Mock stress factors based on risk level
    const stressFactors: string[] = [];
    if (riskLevel === 'moderate' || riskLevel === 'high') {
      stressFactors.push('Temperature fluctuations expected');
    }
    if (riskLevel === 'high') {
      stressFactors.push('Drought conditions forecasted');
      stressFactors.push('High UV index expected');
    }
    
    return {
      riskLevel,
      stressFactors,
      forecast: 'This is a mock forecast. In production, this would contain actual weather forecast data.',
    };
  } catch (error) {
    console.error('Error getting plant stress risk:', error);
    
    // Return default low risk if API fails
    return {
      riskLevel: 'low',
      stressFactors: [],
      forecast: 'Forecast data unavailable',
    };
  }
}
