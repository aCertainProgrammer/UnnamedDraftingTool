import os
from PIL import Image

# Function to crop an image
def crop_image(image_path, crop_box):
    # Open the image file
    with Image.open(image_path) as img:
        # Crop the image using the provided crop box (left, upper, right, lower)
        cropped_img = img.crop(crop_box)
        return cropped_img

# Directory where your images are located
input_directory = "./centered/"  # Update this with your directory path
output_directory = "./centered_minified/"  # Update this with your output directory path

# Define the cropping box (left, upper, right, lower)
crop_box = (291, 32, 1002, 442)  # Example crop box, adjust as needed

# Ensure the output directory exists
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Loop through all files in the input directory
for filename in os.listdir(input_directory):
    # Only process image files (you can customize this if needed)
    if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
        # Full path to the input image
        input_image_path = os.path.join(input_directory, filename)

        # Crop the image
        cropped_img = crop_image(input_image_path, crop_box)

        # Save the cropped image to the output directory
        output_image_path = os.path.join(output_directory, filename)
        cropped_img.save(output_image_path)

        print(f"Cropped image saved: {output_image_path}")

print("Cropping completed for all images.")

