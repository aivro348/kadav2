from PIL import Image, ImageDraw
import sys

def mask_circle_transparent(im):
    mask = Image.new('L', im.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + im.size, fill=255)
    result = im.copy()
    result.putalpha(mask)
    return result

try:
    im = Image.open('frontend/public/netzero.jpg').convert("RGBA")
    # Make it square first
    min_dim = min(im.size)
    left = (im.size[0] - min_dim)/2
    top = (im.size[1] - min_dim)/2
    right = (im.size[0] + min_dim)/2
    bottom = (im.size[1] + min_dim)/2
    im = im.crop((left, top, right, bottom))
    im = mask_circle_transparent(im)
    im.save('frontend/public/favicon.png')
    print("Success")
except Exception as e:
    print("Error:", e)
