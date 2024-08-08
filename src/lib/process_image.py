# src/lib/process_image.py
import sys
import time
import easyocr
import json
import google.generativeai as genai

genai.configure(api_key='AIzaSyBLm5Xpxgr-5lS6HfNUXj9s4GUXkEIjr0U')

def process_image(image_path):
    start_time = time.time()
    imgToProcess = genai.upload_file(path=image_path)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
[imgToProcess, "\n\n",
    "You will receive an image that might contain a serial number, possibly with visual noise or overlaid with other elements. If you identify a serial number, extract it accurately. In case it's an image of a car, it might be at different angles, with parts obscured, partial logos or with brands of other companies. Prioritize the identification and extraction of the main vehicle brand, considering that the logo might be in different locations of the car (hood, trunk, wheels, etc.). If the serial number is alphanumeric, specify the format (e.g., XXX-1234567). If the image is of low quality, indicate if extraction is possible or if a higher resolution image is required.Analyze the image and provide the following information in a concise format:* **Serial number:** If you find a serial number, extract it and specify if it's alphanumeric. If no serial number is found, respond: SERIAL_NUMBER_NULL* **Vehicle brand:** If you identify the brand, indicate it. If not found, respond: BRAND_NULL* **Vehicle model:** Extract the vehicle model. If not found, respond: MODEL_NULL* **Output format:*** If only the serial number is found: SERIAL_NUMBER* If only the brand is found: BRAND* If only the model is found: MODEL* If both brand and model are found: MODEL BRAND (e.g., COROLLA TOYOTA)"]
    )
    
    # Check if the response was blocked
    if hasattr(response, 'safety_ratings') and response.safety_ratings:
        raise ValueError("The response was blocked due to safety ratings.")
    
    # Extract the relevant text from the response
    text = response.text if hasattr(response, 'text') else str(response)
    
    end_time = time.time()
    processing_time = end_time - start_time
    return text, processing_time

if __name__ == "__main__":
    image_path = sys.argv[1]
    try:
        text, processing_time = process_image(image_path)
        output = {
            "text": text,
            "processing_time": processing_time
        }
        print(json.dumps(output))  # Output the result as a JSON string
    except ValueError as e:
        output = {
            "error": str(e)
        }
        print(json.dumps(output))  # Output the error as a JSON string