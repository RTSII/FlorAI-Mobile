"""
Plant.id API Client
Handles communication with the Plant.id API for plant identification and health assessment.
"""
import json
import logging
from typing import Dict, Any, List, Optional
import requests
import asyncio
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
PLANT_ID_API_BASE_URL = "https://api.plant.id/v2"


class PlantIdError(Exception):
    """Custom exception for Plant.id API errors"""
    
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class PlantIdClient:
    """Client for interacting with the Plant.id API"""
    
    def __init__(self, api_key: str):
        """
        Initialize the Plant.id API client
        
        Args:
            api_key: Plant.id API key
        """
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Api-Key": api_key
        }
    
    async def identify_plant(
        self, 
        image_base64: str,
        include_health_assessment: bool = True,
        detailed_info: bool = True
    ) -> Dict[str, Any]:
        """
        Identify a plant from a base64-encoded image
        
        Args:
            image_base64: Base64-encoded image data
            include_health_assessment: Whether to include plant health assessment
            detailed_info: Whether to include detailed plant information
            
        Returns:
            Plant identification results
        """
        # Prepare request payload
        payload = {
            "images": [image_base64],
            "modifiers": ["similar_images"],
            "plant_details": [
                "common_names",
                "url",
                "wiki_description",
                "taxonomy",
                "synonyms"
            ]
        }
        
        # Add health assessment if requested
        if include_health_assessment:
            payload["health"] = "all"
            
        # Add detailed info if requested
        if detailed_info:
            payload["plant_details"].extend([
                "watering",
                "sunlight",
                "propagation",
                "soil",
                "pruning",
                "growth_rate"
            ])
        
        try:
            # Make the request in a non-blocking way
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(
                    f"{PLANT_ID_API_BASE_URL}/identify",
                    json=payload,
                    headers=self.headers,
                    timeout=30
                )
            )
            
            # Check for errors
            if response.status_code != 200:
                logger.error(f"Plant.id API error: {response.text}")
                raise PlantIdError(
                    f"Plant.id API error: {response.text}",
                    status_code=response.status_code
                )
            
            # Parse response
            result = response.json()
            
            # Transform response to match our API schema
            transformed_result = self._transform_identification_result(result)
            
            return transformed_result
            
        except requests.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise PlantIdError(f"Request error: {str(e)}", status_code=503)
        
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            raise PlantIdError(f"Invalid response format: {str(e)}", status_code=500)
        
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise PlantIdError(f"Unexpected error: {str(e)}", status_code=500)
    
    async def get_plant_details(self, plant_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific plant
        
        Args:
            plant_id: ID of the plant to retrieve details for
            
        Returns:
            Plant details
        """
        try:
            # Make the request in a non-blocking way
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.get(
                    f"{PLANT_ID_API_BASE_URL}/plants/{plant_id}",
                    headers=self.headers,
                    timeout=30
                )
            )
            
            # Check for errors
            if response.status_code != 200:
                logger.error(f"Plant.id API error: {response.text}")
                raise PlantIdError(
                    f"Plant.id API error: {response.text}",
                    status_code=response.status_code
                )
            
            # Parse response
            result = response.json()
            
            # Transform response to match our API schema
            transformed_result = self._transform_plant_details(result)
            
            return transformed_result
            
        except requests.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise PlantIdError(f"Request error: {str(e)}", status_code=503)
        
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            raise PlantIdError(f"Invalid response format: {str(e)}", status_code=500)
        
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise PlantIdError(f"Unexpected error: {str(e)}", status_code=500)
    
    def _transform_identification_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform Plant.id API identification result to match our API schema
        
        Args:
            result: Raw Plant.id API response
            
        Returns:
            Transformed result
        """
        # Extract suggestions
        suggestions = result.get("suggestions", [])
        
        # Transform suggestions to our format
        transformed_suggestions = []
        for suggestion in suggestions:
            plant_details = suggestion.get("plant_details", {})
            
            # Extract care information
            care_info = {
                "watering": self._extract_care_info(plant_details, "watering"),
                "sunlight": self._extract_care_info(plant_details, "sunlight"),
                "soil": self._extract_care_info(plant_details, "soil"),
                "propagation": self._extract_care_info(plant_details, "propagation"),
                "pruning": self._extract_care_info(plant_details, "pruning")
            }
            
            # Extract health assessment if available
            health_assessment = None
            if "health_assessment" in suggestion:
                health = suggestion["health_assessment"]
                diseases = health.get("diseases", [])
                
                if diseases:
                    top_disease = diseases[0]
                    health_assessment = {
                        "is_healthy": health.get("is_healthy", True),
                        "disease_name": top_disease.get("name"),
                        "probability": top_disease.get("probability"),
                        "treatment": top_disease.get("treatment", {}).get("overview")
                    }
                else:
                    health_assessment = {
                        "is_healthy": health.get("is_healthy", True)
                    }
            
            # Create transformed suggestion
            transformed_suggestion = {
                "id": suggestion.get("id", ""),
                "scientific_name": suggestion.get("name", ""),
                "common_name": self._get_common_name(suggestion),
                "family": plant_details.get("taxonomy", {}).get("family"),
                "probability": suggestion.get("probability", 0.0),
                "description": plant_details.get("wiki_description", {}).get("value"),
                "care_info": care_info,
                "health_assessment": health_assessment,
                "image_url": self._get_image_url(suggestion)
            }
            
            transformed_suggestions.append(transformed_suggestion)
        
        # Create final response
        return {
            "results": transformed_suggestions,
            "is_plant": result.get("is_plant", True),
            "submission_id": result.get("id", "")
        }
    
    def _transform_plant_details(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform Plant.id API plant details result to match our API schema
        
        Args:
            result: Raw Plant.id API response
            
        Returns:
            Transformed result
        """
        plant = result.get("plant", {})
        plant_details = plant.get("plant_details", {})
        
        # Extract care information
        care_info = {
            "watering": self._extract_care_info(plant_details, "watering"),
            "sunlight": self._extract_care_info(plant_details, "sunlight"),
            "soil": self._extract_care_info(plant_details, "soil"),
            "propagation": self._extract_care_info(plant_details, "propagation"),
            "pruning": self._extract_care_info(plant_details, "pruning")
        }
        
        # Create transformed result
        return {
            "id": plant.get("id", ""),
            "scientific_name": plant.get("name", ""),
            "common_name": self._get_common_name(plant),
            "family": plant_details.get("taxonomy", {}).get("family"),
            "probability": 1.0,  # Direct lookup has 100% confidence
            "description": plant_details.get("wiki_description", {}).get("value"),
            "care_info": care_info,
            "image_url": self._get_image_url(plant)
        }
    
    def _extract_care_info(self, plant_details: Dict[str, Any], care_type: str) -> Optional[str]:
        """Extract care information from plant details"""
        if care_type in plant_details:
            care_info = plant_details[care_type]
            if isinstance(care_info, dict) and "text" in care_info:
                return care_info["text"]
            return str(care_info)
        return None
    
    def _get_common_name(self, plant_data: Dict[str, Any]) -> str:
        """Extract common name from plant data"""
        common_names = plant_data.get("common_names", [])
        if common_names and len(common_names) > 0:
            return common_names[0]
        
        plant_details = plant_data.get("plant_details", {})
        if "common_names" in plant_details and plant_details["common_names"]:
            return plant_details["common_names"][0]
            
        return plant_data.get("name", "")
    
    def _get_image_url(self, plant_data: Dict[str, Any]) -> Optional[str]:
        """Extract image URL from plant data"""
        similar_images = plant_data.get("similar_images", [])
        if similar_images and len(similar_images) > 0:
            return similar_images[0].get("url")
        return None
