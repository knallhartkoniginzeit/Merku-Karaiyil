"""Extract exact layout data from the Merku Karaiyil pitch PDF.

Outputs (all under .freebuff/render/):
- pages.json : for pages 14-25 (1-indexed) -> text spans (bbox, font, size, color),
  image bboxes, drawing lines/rects (with dash info + color), page size
- pdfimg/pageNN_imgMM.png : every embedded image on those pages
- match.json : average-hash match of each embedded image to files in Narrative ref/,
  Film mood/, Tone and Light ref/
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pydeps'))
import fitz  # pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(os.path.expanduser('~'), 'Downloads',
                   'Copy of Merku Karaiyil - Pitchdeck version 2.pdf')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render')
IMGDIR = os.path.join(OUT, 'pdfimg')
os.makedirs(IMGDIR, exist_ok=True)

doc = fitz.open(PDF)
print('pages:', doc.page_count)


def color_hex(c):
    if c is None:
        return None
    if isinstance(c, (int, float)):
        c = (c, c, c) if 0 <= c <= 1 else (c / 255,) * 3
    if len(c) == 1:
        v = int(round(c[0] * 255)); return f'#{v:02x}{v:02x}{v:02x}'
    rgb = [max(0, min(255, int(round(v * 255 if 0 <= v <= 1 else v)))) for v in c[:3]]
    return '#' + ''.join(f'{v:02x}' for v in rgb)


def avg_hash_from_pixmap(pix):
    """8x8 average hash from a pixmap (no PIL)."""
    samp = pix.samples
    n = pix.n
    w, h = pix.width, pix.height
    # downsample to 8x8 by box average
    cells = [[0] * 8 for _ in range(8)]
    counts = [[0] * 8 for _ in range(8)]
    for y in range(0, h, max(1, h // 64)):
        for x in range(0, w, max(1, w // 64)):
            idx = (y * w + x) * n
            r, g, b = samp[idx], samp[idx + 1], samp[idx + 2]
            gray = (r * 299 + g * 587 + b * 114) // 1000
            cells[min(7, y * 8 // h)][min(7, x * 8 // w)] += gray
            counts[min(7, y * 8 // h)][min(7, x * 8 // w)] += 1
    vals = []
    for i in range(8):
        for j in range(8):
            vals.append(cells[i][j] // max(1, counts[i][j]))
    avg = sum(vals) // 64
    return ''.join('1' if v > avg else '0' for v in vals)


def dist(a, b):
    return sum(x != y for x, y in zip(a, b))


# ---- pass 1: disk file hashes ----
disk = {}  # hash -> [relative paths]
folders = ['Narrative ref', 'Film mood', 'Tone and Light ref']
for folder in folders:
    fdir = os.path.join(ROOT, folder)
    for name in sorted(os.listdir(fdir)):
        try:
            pix = fitz.Pixmap(os.path.join(fdir, name))
            if pix.n > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            h = avg_hash_from_pixmap(pix)
            disk.setdefault(h, []).append(f'{folder}/{name}')
        except Exception as e:
            print('skip disk', folder, name, e)

# ---- pass 2: pages ----
pages = {}
match = {}
for pno in range(13, min(25, doc.page_count)):
    page = doc[pno]
    pnum = pno + 1
    data = {'page': pnum, 'width': page.rect.width, 'height': page.rect.height}

    # text spans
    spans = []
    d = page.get_text('dict')
    for block in d['blocks']:
        if block['type'] != 0:
            continue
        for line in block['lines']:
            for span in line['spans']:
                spans.append({
                    'text': span['text'],
                    'bbox': [round(v, 1) for v in span['bbox']],
                    'font': span['font'],
                    'size': round(span['size'], 1),
                    'color': color_hex(span['color']),
                })
    data['text'] = spans

    # images
    imgs = []
    for i, info in enumerate(page.get_image_info(xrefs=True)):
        bbox = [round(v, 1) for v in info['bbox']]
        xref = info['xref']
        entry = {'bbox': bbox, 'xref': xref}
        try:
            pix = fitz.Pixmap(doc, xref)
            if pix.n > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            name = f'page{pnum:02d}_img{i:02d}.png'
            pix.save(os.path.join(IMGDIR, name))
            h = avg_hash_from_pixmap(pix)
            best = min(((dist(h, dh), paths) for dh, paths in disk.items()), key=lambda t: t[0])
            entry['match'] = {'files': best[1], 'hamming': best[0]}
            match[f'p{pnum}i{i}'] = {'bbox': bbox, 'match': best[1], 'hamming': best[0],
                                     'size': [pix.width, pix.height]}
        except Exception as e:
            entry['error'] = str(e)
        imgs.append(entry)
    data['images'] = imgs

    # vector drawings: keep only lines/rects (thin rules), skip huge fills
    shapes = []
    for dr in page.get_drawings():
        r = dr['rect']
        if r.width > page.rect.width * 0.98 and r.height > page.rect.height * 0.98:
            continue  # background
        item = {
            'bbox': [round(v, 1) for v in (r.x0, r.y0, r.x1, r.y1)],
            'type': dr['type'],
            'stroke': color_hex(dr.get('color')),
            'fill': color_hex(dr.get('fill')),
            'dashes': dr.get('dashes'),
            'width': round(dr.get('width') or 0, 2),
        }
        kinds = set(it[0] for it in dr['items'])
        item['kinds'] = sorted(kinds)
        shapes.append(item)
    data['shapes'] = shapes

    pages[pnum] = data

with open(os.path.join(OUT, 'pages.json'), 'w', encoding='utf-8') as f:
    json.dump(pages, f, indent=1, ensure_ascii=False)
with open(os.path.join(OUT, 'match.json'), 'w', encoding='utf-8') as f:
    json.dump(match, f, indent=1, ensure_ascii=False)

print('wrote pages.json with', len(pages), 'pages; matched', len(match), 'images')
for k, v in sorted(match.items()):
    print(k, v['bbox'], '->', v['match'], 'ham', v['hamming'])
