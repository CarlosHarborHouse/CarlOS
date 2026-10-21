# Per-frame person cutouts (RGBA PNG) for text-behind-subject.
import sys, subprocess, io, os
from PIL import Image, ImageFilter
from rembg import remove, new_session
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
tmp = out + "/_f"; os.makedirs(tmp, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, f"{tmp}/%04d.png"], check=True)
s = new_session("u2net_human_seg")
for f in sorted(os.listdir(tmp)):
    im = Image.open(f"{tmp}/{f}").convert("RGB")
    m = remove(im.resize((540, 960)), session=s, only_mask=True).resize(im.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5))
    im.putalpha(m); im.save(f"{out}/{f}", optimize=False, compress_level=3)
    os.remove(f"{tmp}/{f}")
os.rmdir(tmp)
print(len(os.listdir(out)), "frames")
