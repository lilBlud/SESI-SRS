from PIL import Image
import os

p = r'C:\Users\User\.gemini\antigravity-ide\brain\ecbf3160-5df9-4863-97d6-1a033d295d7e\.user_uploaded\media_1792557904937.png'
im = Image.open(p)
print('Template dimensions:', im.size)
