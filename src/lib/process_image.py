# src/lib/process_image.py
import sys
import easyocr

def process_image(image_path):
    reader = easyocr.Reader(['en'], gpu=False, verbose=False)  # Initialize the reader with English language and disable verbose
    result = reader.readtext(image_path)
    text = ' '.join([res[1] for res in result])  # Extract text from the result
    return text

if __name__ == "__main__":
    image_path = sys.argv[1]
    result = process_image(image_path)
    print(result)