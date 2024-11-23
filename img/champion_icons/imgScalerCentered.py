import os
from PIL import Image

# Define the directory containing images
input_directory = "./centered_minified_converted_to_webp"
output_directory = "./centered_minified_converted_to_webp_scaled"  # Optional: Specify an output directory

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Supported image formats
supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif', '.webp')

# Target size
target_size = (230, 130)

for filename in os.listdir(input_directory):
    if filename.lower().endswith(supported_formats):
        input_path = os.path.join(input_directory, filename)
        output_path = os.path.join(output_directory, f"{os.path.splitext(filename)[0]}.webp")
        
        try:
            with Image.open(input_path) as img:
                # Resize the image to 100x100
                img = img.resize(target_size, Image.ANTIALIAS)  # Use ANTIALIAS for high-quality resizing
                
                # Convert and save to .webp in lossless mode
                img.save(output_path, format="WEBP", quality=85)  # Lossless compression
                print(f"Converted and resized (lossless): {filename} -> {output_path}")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
