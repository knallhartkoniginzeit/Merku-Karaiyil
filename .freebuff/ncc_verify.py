"""Decisive NCC (normalized cross-correlation) match: crop the photo region
from the 96dpi page render (exactly what the PDF displays, incl. cropping)
and compare against every disk image on a 32x32 grayscale grid."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pydeps'))
import pymupdf as fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(os.path.expanduser('~'), 'Downloads',
                   'Copy of Merku Karaiyil - Pitchdeck version 2.pdf')
N = 32


def grid_from_pix(pix, size=N):
    if pix.n > 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    w, h, n = pix.width, pix.height, pix.samples and pix.n
    s = pix.samples
    w, h, n = pix.width, pix.height, pix.n
    g = [[0] * size for _ in range(size)]
    c = [[0] * size for _ in range(size)]
    sx = max(1, w // (size * 4))
    sy = max(1, h // (size * 4))
    for y in range(0, h, sy):
        gy = min(size - 1, y * size // h)
        for x in range(0, w, sx):
            gx = min(size - 1, x * size // w)
            i = (y * w + x) * n
            g[gy][gx] += (s[i] * 299 + s[i + 1] * 587 + s[i + 2] * 114) // 1000
            c[gy][gx] += 1
    return [[g[y][x] / max(1, c[y][x]) for x in range(size)] for y in range(size)]


def flatten(g):
    v = [x for row in g for x in row]
    m = sum(v) / len(v)
    sd = (sum((x - m) ** 2 for x in v) / len(v)) ** 0.5 or 1.0
    return [(x - m) / sd for x in v]


def ncc(a, b):
    return sum(x * y for x, y in zip(a, b)) / len(a)


doc = fitz.open(PDF)

# disk library
disk = []
for folder in ['Narrative ref', 'Film mood', 'Tone and Light ref']:
    fdir = os.path.join(ROOT, folder)
    for name in sorted(os.listdir(fdir)):
        try:
            pix = fitz.Pixmap(os.path.join(fdir, name))
            disk.append((f'{folder}/{name}', flatten(grid_from_pix(pix))))
        except Exception as e:
            print('skip', folder, name, e)

# ambiguous items: (page, bbox in pdf pts, label)
ITEMS = [
    (19, (523.6, 550.1, 896.4, 706.5), 'p19 under step2'),
    (20, (907.0, 267.8, 1163.7, 375.5), 'p20 under step6 left'),
    (21, (316.5, 581.0, 646.1, 717.1), 'p21 under step7 right'),
    (21, (36.3, 581.0, 357.9, 717.1), 'p21 under step7 left'),
    (21, (1095.8, 616.5, 1306.8, 730.0), 'p21 stacked right bottom'),
]

ZOOM = 96 / 72
for pnum, bbox, label in ITEMS:
    page = doc[pnum - 1]
    clip = fitz.Rect(*bbox)
    pix = page.get_pixmap(dpi=96, clip=clip)
    target = flatten(grid_from_pix(pix))
    scored = sorted(((ncc(target, v), name) for name, v in disk), reverse=True)
    top = [(n, round(s, 3)) for s, n in scored[:3]]
    print(f'{label:32s} -> {top}')
