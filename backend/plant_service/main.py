"""
Plant.id API Integration Microservice
This FastAPI service handles plant identification and health assessment using the Plant.id API.
"""
import os
import base64
import logging
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from plant_id_client import PlantIdClient, PlantIdError

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FlorAI Plant Identification Service",
    description="Microservice for plant identification and health assessment using Plant.id API",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key from environment variables
PLANT_ID_API_KEY = os.getenv("PLANT_ID_API_KEY")
if not PLANT_ID_API_KEY:
    logger.error("PLANT_ID_API_KEY environment variable not set")
    raise ValueError("PLANT_ID_API_KEY environment variable not set")

# Initialize Plant.id client
plant_id_client = PlantIdClient(api_key=PLANT_ID_API_KEY)


# Response models
class HealthAssessment(BaseModel):
    is_healthy: bool
    disease_name: Optional[str] = None
    probability: Optional[float] = None
    treatment: Optional[str] = None


class PlantCareInfo(BaseModel):
    watering: Optional[str] = None
    sunlight: Optional[str] = None
    soil: Optional[str] = None
    propagation: Optional[str] = None
    pruning: Optional[str] = None


class PlantIdentificationResult(BaseModel):
    id: str
    scientific_name: str
    common_name: str
    family: Optional[str] = None
    probability: float
    description: Optional[str] = None
    care_info: Optional[PlantCareInfo] = None
    health_assessment: Optional[HealthAssessment] = None
    image_url: Optional[str] = None


class IdentificationResponse(BaseModel):
    results: List[PlantIdentificationResult]
    is_plant: bool
    submission_id: str


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "FlorAI Plant Identification Service"}


@app.post("/identify", response_model=IdentificationResponse)
async def identify_plant(
    file: UploadFile = File(...),
    include_health_assessment: bool = True,
    detailed_info: bool = True,
):
    """
    Identify a plant from an uploaded image
    
    - **file**: Image file to analyze
    - **include_health_assessment**: Whether to include plant health assessment
    - **detailed_info**: Whether to include detailed plant information
    """
    try:
        # Read image file
        image_data = await file.read()
        
        # Encode image to base64
        encoded_image = base64.b64encode(image_data).decode("ascii")
        
        # Call Plant.id API
        identification_result = await plant_id_client.identify_plant(
            encoded_image,
            include_health_assessment=include_health_assessment,
            detailed_info=detailed_info
        )
        
        return identification_result
    
    except PlantIdError as e:
        logger.error(f"Plant.id API error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@app.get("/plant/{plant_id}", response_model=PlantIdentificationResult)
async def get_plant_details(plant_id: str):
    """
    Get detailed information about a specific plant
    
    - **plant_id**: ID of the plant to retrieve details for
    """
    try:
        plant_details = await plant_id_client.get_plant_details(plant_id)
        return plant_details
    
    except PlantIdError as e:
        logger.error(f"Plant.id API error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
