import os
from PIL import Image

# Define the directory containing images
input_directory = "./tiles"
output_directory = "./tiles_converted_to_webp"  # Optional: Specify an output directory

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Supported image formats
supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif')

for filename in os.listdir(input_directory):
    if filename.lower().endswith(supported_formats):
        input_path = os.path.join(input_directory, filename)
        output_path = os.path.join(output_directory, f"{os.path.splitext(filename)[0]}.webp")
        
        try:
            with Image.open(input_path) as img:
                # Convert and save to .webp
                img.save(output_path, format="WEBP", quality=85)  # Adjust quality as needed
                print(f"Converted: {filename} -> {output_path}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
