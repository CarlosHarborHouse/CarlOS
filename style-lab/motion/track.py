# Head position per frame from the cutouts: top of the silhouette and the centre of the head below it.
import sys, os, json
from PIL import Image
d = sys.argv[1]; pts = []
for f in sorted(x for x in os.listdir(d) if x.endswith('.png')):
    a = Image.open(f'{d}/{f}').getchannel('A').resize((270, 480))
    px = a.load(); W, H = a.size
    top = next((y for y in range(H) if sum(1 for x in range(W) if px[x, y] > 128) > 3), 0)
    xs = [x for y in range(top, min(H, top + 35)) for x in range(W) if px[x, y] > 128]
    pts.append([sum(xs) / len(xs) * 4 if xs else 540, top * 4])
cut = int(sys.argv[2]) if len(sys.argv) > 2 else None
def smooth(seg):
    return [[sum(p[i] for p in seg[max(0, j - 4):j + 5]) / len(seg[max(0, j - 4):j + 5]) for i in (0, 1)] for j in range(len(seg))]
out = smooth(pts[:cut]) + smooth(pts[cut:]) if cut else smooth(pts)
json.dump([[round(x, 1), round(y, 1)] for x, y in out], open(d + '.track.json', 'w'))
print(out[0], out[cut - 1] if cut else '', out[-1])
