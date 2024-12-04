import os
import json
from pathlib import Path
from PIL import Image
import numpy as np

directory = Path("blocks/")
output = Path("average_colors.json")

# Main function
def calculate(image_path):
    image = Image.open(image_path)
    image = image.convert("RGB")
    pixels = np.array(image)
    color = pixels.mean(axis=(0, 1))
    return tuple(int(c) for c in color)

# Create directory if it doesn't exist
directory.mkdir(parents=True, exist_ok=True)

# Data for the colors to be written to a file
color_data = {}

# Go through each file in the directory
for filename in os.listdir(directory):
    file = os.path.join(directory, filename)
    color = calculate(file)

    # Add to color_data while also removing the file extension (.png)
    color_data[filename[:-4]] = list(color)

# Write output to file
with open(output, "w") as json_file:
    json.dump(color_data, json_file)

print("Done!")