"""
Test script for Plant.id API client
This script tests the functionality of the Plant.id API client
"""
import os
import sys
import base64
import asyncio
from dotenv import load_dotenv
from plant_id_client import PlantIdClient, PlantIdError

# Load environment variables
load_dotenv()

# Get API key from environment variables
PLANT_ID_API_KEY = os.getenv("PLANT_ID_API_KEY")
if not PLANT_ID_API_KEY:
    print("Error: PLANT_ID_API_KEY environment variable not set")
    sys.exit(1)

# Test image path (replace with an actual image path for testing)
TEST_IMAGE_PATH = "test_plant.jpg"

# Function to read and encode image
def get_image_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")
    except FileNotFoundError:
        print(f"Error: Test image not found at {image_path}")
        print("Creating a placeholder test file for demonstration purposes.")
        # Create a small placeholder image file
        with open(image_path, "wb") as f:
            f.write(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342\xff\xdb\x00C\x01\t\t\t\x0c\x0b\x0c\x18\r\r\x182!\x1c!22222222222222222222222222222222222222222222222222\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01\"\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07\"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xc4\x00\x1f\x01\x00\x03\x01\x01\x01\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x11\x00\x02\x01\x02\x04\x04\x03\x04\x07\x05\x04\x04\x00\x01\x02w\x00\x01\x02\x03\x11\x04\x05!1\x06\x12AQ\x07aq\x13\"2\x81\x08\x14B\x91\xa1\xb1\xc1\t#3R\xf0\x15br\xd1\n\x16$4\xe1%\xf1\x17\x18\x19\x1a&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xfe\xfe(\xa2\x8a\x00\xff\xd9")
        return get_image_base64(image_path)

# Main test function
async def test_plant_id_client():
    print("Testing Plant.id API client...")
    
    # Initialize client
    client = PlantIdClient(api_key=PLANT_ID_API_KEY)
    
    try:
        # Get image data
        image_base64 = get_image_base64(TEST_IMAGE_PATH)
        
        print("1. Testing plant identification...")
        identification_result = await client.identify_plant(
            image_base64=image_base64,
            include_health_assessment=True,
            detailed_info=True
        )
        
        # Check if we got results
        if 'result' in identification_result and 'classification' in identification_result['result']:
            print("✓ Plant identification successful")
            
            # Get the submission ID for plant details test
            submission_id = identification_result.get('id')
            if submission_id:
                print(f"Submission ID: {submission_id}")
                
                print("\n2. Testing plant details retrieval...")
                plant_details = await client.get_plant_details(submission_id)
                
                if plant_details:
                    print("✓ Plant details retrieval successful")
                    print(f"Plant name: {plant_details.get('name', 'Unknown')}")
                else:
                    print("✗ Plant details retrieval failed")
            else:
                print("✗ No submission ID found in identification result")
        else:
            print("✗ Plant identification failed or returned unexpected format")
            print(f"Response: {identification_result}")
            
    except PlantIdError as e:
        print(f"✗ API Error: {e.message} (Status code: {e.status_code})")
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        
    print("\nTest completed.")

# Run the test
if __name__ == "__main__":
    asyncio.run(test_plant_id_client())
