"""Extract pages 8-14 (characters) — text spans, images, drawings, matches."""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pydeps'))
import pymupdf as fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(os.path.expanduser('~'), 'Downloads',
                   'Copy of Merku Karaiyil - Pitchdeck version 2.pdf')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render')
os.makedirs(os.path.join(OUT, 'pdfimg'), exist_ok=True)

doc = fitz.open(PDF)

# quick disk index for matching (32x32 NCC grid)
N = 32


def grid(pix):
    if pix.n > 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    w, h, n = pix.width, pix.height, pix.n
    s = pix.samples
    g = [[0] * N for _ in range(N)]
    c = [[0] * N for _ in range(N)]
    sx, sy = max(1, w // (N * 4)), max(1, h // (N * 4))
    for y in range(0, h, sy):
        gy = min(N - 1, y * N // h)
        for x in range(0, w, sx):
            gx = min(N - 1, x * N // w)
            i = (y * w + x) * n
            g[gy][gx] += (s[i] * 299 + s[i + 1] * 587 + s[i + 2] * 114) // 1000
            c[gy][gx] += 1
    return [[g[y][x] / max(1, c[y][x]) for x in range(N)] for y in range(N)]


def flat(g):
    v = [x for r in g for x in r]
    m = sum(v) / len(v)
    sd = (sum((x - m) ** 2 for x in v) / len(v)) ** 0.5 or 1.0
    return [(x - m) / sd for x in v]


def ncc(a, b):
    return sum(x * y for x, y in zip(a, b)) / len(a)


disk = []
for folder in ['Narrative ref', 'Film mood', 'Tone and Light ref']:
    fdir = os.path.join(ROOT, folder)
    for name in sorted(os.listdir(fdir)):
        try:
            disk.append((f'{folder}/{name}', flat(grid(fitz.Pixmap(os.path.join(fdir, name))))))
        except Exception:
            pass

pages = {}
for pno in range(7, 14):
    page = doc[pno]
    pnum = pno + 1
    data = {'page': pnum, 'width': page.rect.width, 'height': page.rect.height}

    spans = []
    for block in page.get_text('dict')['blocks']:
        if block['type'] != 0:
            continue
        for line in block['lines']:
            for span in line['spans']:
                if span['text'].strip():
                    spans.append({'text': span['text'],
                                  'bbox': [round(v, 1) for v in span['bbox']],
                                  'size': round(span['size'], 1)})
    data['text'] = spans

    imgs = []
    for i, info in enumerate(page.get_image_info(xrefs=True)):
        bbox = [round(v, 1) for v in info['bbox']]
        entry = {'bbox': bbox}
        try:
            if info['bbox'][3] - info['bbox'][1] > 700:
                entry['match'] = '[background]'
            else:
                pix = fitz.Pixmap(doc, info['xref'])
                t = flat(grid(pix))
                scored = sorted(((ncc(t, v), name) for name, v in disk), reverse=True)
                entry['match'] = [(n, round(s, 3)) for s, n in scored[:2]]
                name = f'page{pnum:02d}_img{i:02d}.png'
                pix.save(os.path.join(OUT, 'pdfimg', name))
        except Exception as e:
            entry['err'] = str(e)
        imgs.append(entry)
    data['images'] = imgs
    pages[pnum] = data

    pix = page.get_pixmap(dpi=96)
    pix.save(os.path.join(OUT, f'page{pnum}.png'))

with open(os.path.join(OUT, 'chars.json'), 'w', encoding='utf-8') as f:
    json.dump(pages, f, indent=1, ensure_ascii=False)

for pnum in sorted(pages, key=int):
    p = pages[pnum]
    print('=' * 20, 'PAGE', pnum, '=' * 20)
    for s in p['text']:
        print(f"  T {s['bbox']} {s['size']}px :: {s['text'][:70]!r}")
    for i, im in enumerate(p['images']):
        print(f"  I{i} {im['bbox']} -> {im.get('match')}")
