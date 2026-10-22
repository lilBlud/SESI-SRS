from PIL import Image
import numpy as np

for name in ['media_1792558275470.png', 'media_1792557904937.png', 'media_1792557077548.png']:
    p = rf"C:\Users\User\.gemini\antigravity-ide\brain\ecbf3160-5df9-4863-97d6-1a033d295d7e\.user_uploaded\{name}"
    try:
        img = Image.open(p)
        arr = np.array(img)
        h, w, c = arr.shape
        # Sample non-white, non-black pixels from top header
        # Let's inspect a center patch of header
        patch = arr[int(h*0.3):int(h*0.7), int(w*0.1):int(w*0.9)]
        # Filter for blue shades
        mask = (patch[:,:,2] > patch[:,:,0]) & (patch[:,:,2] > patch[:,:,1]) & (patch[:,:,0] < 80)
        blue_pixels = patch[mask]
        if len(blue_pixels) > 0:
            med = np.median(blue_pixels, axis=0)
            hex_val = "#{:02X}{:02X}{:02X}".format(int(med[0]), int(med[1]), int(med[2]))
            print(f"{name}: shape {arr.shape}, median header blue: {hex_val}, RGB: {med[:3]}")
    except Exception as e:
        print(f"Error {name}: {e}")
