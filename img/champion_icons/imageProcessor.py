import os
from PIL import Image

def normalize_filename(name: str) -> str:
    # Remove apostrophes and spaces
    name = name.replace("'", "").replace(" ", "")

    # Manual mapping overrides (case-insensitive match)
    name_map = {
        "monkeyking": "Wukong",
        "jarvaniv": "Jarvan"
    }

    key = name.lower()
    if key in name_map:
        return name_map[key]

    # Default formatting: capitalize first, lowercase the rest
    return name[0] + name[1:].lower() if len(name) > 1 else name.upper()

# Centered
input_directory = "./centered/"  
output_directory = "./centered_minified_converted_to_webp_scaled/"  

crop_box = (291, 32, 1002, 442)  
target_size = (230, 130)

if not os.path.exists(output_directory):
    os.makedirs(output_directory)

for filename in os.listdir(input_directory):
    if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
        input_image_path = os.path.join(input_directory, filename)

        img = Image.open(input_image_path)
        cropped_img = img.crop(crop_box)
        resized_img = cropped_img.resize(target_size)

        base_name = os.path.splitext(filename)[0]
        normalized_name = normalize_filename(base_name)
        output_image_path = os.path.join(output_directory, f"{normalized_name}.webp")

        resized_img.save(output_image_path, format="WEBP", quality=85)

print("Processing completed for all centered images.")

# Small
input_directory = "./small/"  
output_directory = "./small_converted_to_webp_scaled/"  

target_size = (100, 100)

if not os.path.exists(output_directory):
    os.makedirs(output_directory)

for filename in os.listdir(input_directory):
    if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
        input_image_path = os.path.join(input_directory, filename)

        img = Image.open(input_image_path)
        resized_img = img.resize(target_size)

        base_name = os.path.splitext(filename)[0]
        normalized_name = normalize_filename(base_name)
        output_image_path = os.path.join(output_directory, f"{normalized_name}.webp")

        resized_img.save(output_image_path, format="WEBP", quality=85)

print("Processing completed for all small images.")

# Tiles 
input_directory = "./tiles/"  
output_directory = "./tiles_converted_to_webp_scaled/"  

target_size = (100, 100)

if not os.path.exists(output_directory):
    os.makedirs(output_directory)

for filename in os.listdir(input_directory):
    if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
        input_image_path = os.path.join(input_directory, filename)

        img = Image.open(input_image_path)
        resized_img = img.resize(target_size)

        base_name = os.path.splitext(filename)[0]
        normalized_name = normalize_filename(base_name)
        output_image_path = os.path.join(output_directory, f"{normalized_name}.webp")

        resized_img.save(output_image_path, format="WEBP", quality=85)

print("Processing completed for all tiled images.")
