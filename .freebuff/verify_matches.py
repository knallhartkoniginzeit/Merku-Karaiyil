"""Re-verify suspicious PDF-image -> disk-image matches with aHash + dHash + avg color,
and render ACT pages 19-21 to full-page PNGs for visual reference."""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pydeps'))
import pymupdf as fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMGDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render', 'pdfimg')
OUTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render')
PDF = os.path.join(os.path.expanduser('~'), 'Downloads',
                   'Copy of Merku Karaiyil - Pitchdeck version 2.pdf')


def norm_pix(pix):
    if pix.n > 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    return pix


def dhash(pix, hash_size=8):
    """Difference hash: horizontal gradient between 9x8 downsample."""
    w, h, n = pix.width, pix.height, pix.n
    s = pix.samples
    # box-downsample to 9x8 grayscale
    gw, gh = 9, 8
    grid = [[0] * gw for _ in range(gh)]
    cnt = [[0] * gw for _ in range(gh)]
    step_x = max(1, w // 48)
    step_y = max(1, h // 48)
    for y in range(0, h, step_y):
        gy = min(gh - 1, y * gh // h)
        for x in range(0, w, step_x):
            gx = min(gw - 1, x * gw // w)
            idx = (y * w + x) * n
            gray = (s[idx] * 299 + s[idx + 1] * 587 + s[idx + 2] * 114) // 1000
            grid[gy][gx] += gray
            cnt[gy][gx] += 1
    vals = [[grid[y][x] // max(1, cnt[y][x]) for x in range(gw)] for y in range(gh)]
    bits = ''
    for y in range(gh):
        for x in range(gw - 1):
            bits += '1' if vals[y][x] > vals[y][x + 1] else '0'
    return bits


def avg_color(pix):
    w, h, n = pix.width, pix.height, pix.n
    s = pix.samples
    step = max(1, (w * h) // 5000)
    total = [0, 0, 0]
    count = 0
    for i in range(0, w * h, step):
        idx = i * n
        total[0] += s[idx]; total[1] += s[idx + 1]; total[2] += s[idx + 2]
        count += 1
    return tuple(t // count for t in total)


def ham(a, b):
    return sum(x != y for x, y in zip(a, b)) if len(a) == len(b) else 99


def cdist(a, b):
    return sum(abs(x - y) for x, y in zip(a, b))


doc = fitz.open(PDF)

# index disk images
disk = []
for folder in ['Narrative ref', 'Film mood', 'Tone and Light ref']:
    fdir = os.path.join(ROOT, folder)
    for name in sorted(os.listdir(fdir)):
        try:
            pix = norm_pix(fitz.Pixmap(os.path.join(fdir, name)))
            disk.append((f'{folder}/{name}', dhash(pix), avg_color(pix)))
        except Exception as e:
            print('skip', folder, name, e)

# re-verify every image on pages 19-21
for pnum in (19, 20, 21):
    page = doc[pnum - 1]
    print(f'=== PAGE {pnum} ===')
    for i, info in enumerate(page.get_image_info(xrefs=True)):
        bbox = [round(v, 1) for v in info['bbox']]
        if info['bbox'][3] - info['bbox'][1] > 700:
            print(f'  i{i} {bbox} -> [page background]')
            continue
        try:
            pix = norm_pix(fitz.Pixmap(doc, info['xref']))
            dh = dhash(pix)
            ac = avg_color(pix)
            scored = sorted(((ham(dh, d), cdist(ac, c), name) for name, d, c in disk))
            top3 = [(n, h, c) for h, c, n in scored[:3]]
            print(f'  i{i} {bbox} size={pix.width}x{pix.height} -> {top3}')
        except Exception as e:
            print(f'  i{i} {bbox} ERROR {e}')

# render pages 19-21 to PNG for visual reference
for pnum in (19, 20, 21):
    page = doc[pnum - 1]
    pix = page.get_pixmap(dpi=96)
    out = os.path.join(OUTDIR, f'page{pnum}.png')
    pix.save(out)
    print('rendered', out)
