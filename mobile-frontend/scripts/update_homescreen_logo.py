import os
from PIL import Image

src_path = r'C:\Users\User\.gemini\antigravity-ide\brain\5b4a48ba-6c45-4759-89f6-6e0efcd9c1b0\.user_uploaded\media_1792484218040.jpg'
public_dir = r'c:\Users\User\OneDrive\Desktop\SESI SRS\mobile-frontend\public'
assets_dir = os.path.join(public_dir, 'assets')

os.makedirs(public_dir, exist_ok=True)
os.makedirs(assets_dir, exist_ok=True)

img = Image.open(src_path)
print(f"Loaded source image: {img.size}, {img.mode}")

# 1. Save full-res logo.png in public/assets/
logo_path = os.path.join(assets_dir, 'logo.png')
img.save(logo_path, 'PNG', optimize=True)
print(f"Saved: {logo_path}")

# Also update strategy_sustainability_logo.jpg if it exists
ss_logo_path = os.path.join(assets_dir, 'strategy_sustainability_logo.jpg')
img.save(ss_logo_path, 'JPEG', quality=95)
print(f"Saved: {ss_logo_path}")

# 2. Save pwa-512x512.png
pwa_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
pwa_512_path = os.path.join(public_dir, 'pwa-512x512.png')
pwa_512.save(pwa_512_path, 'PNG', optimize=True)
print(f"Saved: {pwa_512_path}")

# 3. Save pwa-192x192.png
pwa_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
pwa_192_path = os.path.join(public_dir, 'pwa-192x192.png')
pwa_192.save(pwa_192_path, 'PNG', optimize=True)
print(f"Saved: {pwa_192_path}")

# 4. Save apple-touch-icon.png (180x180)
apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon_path = os.path.join(public_dir, 'apple-touch-icon.png')
apple_icon.save(apple_icon_path, 'PNG', optimize=True)
print(f"Saved: {apple_icon_path}")

# 5. Save favicon.png (64x64) and favicon.ico
fav_png = img.resize((64, 64), Image.Resampling.LANCZOS)
fav_png_path = os.path.join(public_dir, 'favicon.png')
fav_png.save(fav_png_path, 'PNG', optimize=True)
print(f"Saved: {fav_png_path}")

fav_ico = img.resize((32, 32), Image.Resampling.LANCZOS)
fav_ico_path = os.path.join(public_dir, 'favicon.ico')
fav_ico.save(fav_ico_path, format='ICO')
print(f"Saved: {fav_ico_path}")

print("All homescreen icons successfully generated and saved!")
