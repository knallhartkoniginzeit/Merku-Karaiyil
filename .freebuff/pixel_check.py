"""Pixel checks on the 96dpi renders of PDF pages 19-21:
1. Do photos have baked-in white polaroid borders?
2. Where exactly are the white line + ticks (sanity vs shape data)?
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pydeps'))
import pymupdf as fitz

RENDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render')
S = 96 / 72  # pts -> px

PHOTOS = {
    19: [('step1', 116.2, 254.7, 362.4, 393.3), ('step2', 523.6, 550.1, 896.4, 706.5),
         ('step3', 1097.5, 254.8, 1422.2, 375.1)],
    20: [('s4-p1', 48.2, 256.5, 267.1, 379.6), ('s4-p2', 287.2, 259.2, 506.0, 377.0),
         ('s5-p1', 490.3, 626.1, 801.7, 737.0), ('s5-p2', 729.2, 628.7, 984.8, 737.1),
         ('s6-p1', 907.0, 267.8, 1163.7, 375.5), ('s6-p2', 1150.3, 271.8, 1413.8, 379.5)],
    21: [('s7-p1', 36.3, 581.0, 357.9, 717.1), ('s7-p2', 316.5, 581.0, 646.1, 717.1),
         ('s8-p1', 1095.8, 323.4, 1306.8, 470.4), ('s8-p2', 1095.8, 449.5, 1306.8, 590.4),
         ('s8-p3', 1095.8, 616.5, 1306.8, 730.0)],
}


def strip_brightness(pix, x0, y0, x1, y1):
    """mean brightness of a region (px coords)."""
    w, n = pix.width, pix.n
    s = pix.samples
    tot = cnt = 0
    for y in range(max(0, int(y0)), min(pix.height, int(y1))):
        for x in range(max(0, int(x0)), min(w, int(x1))):
            i = (y * w + x) * n
            tot += (s[i] * 299 + s[i + 1] * 587 + s[i + 2] * 114) // 1000
            cnt += 1
    return tot // max(1, cnt)


for pnum, photos in PHOTOS.items():
    pix = fitz.Pixmap(os.path.join(RENDER, f'page{pnum}.png'))
    print(f'=== PAGE {pnum} ===')
    for name, px0, py0, px1, py1 in photos:
        x0, y0, x1, y1 = px0 * S, py0 * S, px1 * S, py1 * S
        wpt, hpt = px1 - px0, py1 - py0
        h = y1 - y0
        edge = max(2, int(h * 0.02))
        top_in = strip_brightness(pix, x0 + 2, y0, x1 - 2, y0 + edge)
        top_deep = strip_brightness(pix, x0 + 2, y0 + h * 0.08, x1 - 2, y0 + h * 0.12)
        bot_in = strip_brightness(pix, x0 + 2, y1 - edge, x1 - 2, y1)
        left_in = strip_brightness(pix, x0, y0 + 2, x0 + edge, y1 - 2)
        right_in = strip_brightness(pix, x1 - edge, y0 + 2, x1, y1 - 2)
        verdict = 'FRAME' if min(top_in, bot_in, left_in, right_in) > 200 else 'plain '
        print(f'  {name:7s} {wpt:5.0f}x{hpt:4.0f}pt aspect={wpt/hpt:4.2f} edges(t{top_in} b{bot_in} l{left_in} r{right_in}) deep{top_deep} -> {verdict}')

# sanity: white line rows on each page (sample column x=700pt*1.333)
for pnum, xpt in ((19, 700), (20, 400), (21, 700)):
    pix = fitz.Pixmap(os.path.join(RENDER, f'page{pnum}.png'))
    x = int(xpt * S)
    col = []
    for y in range(int(390 * S), int(415 * S)):
        i = (y * pix.width + x) * pix.n
        col.append((s := (pix.samples[i] * 299 + pix.samples[i + 1] * 587 + pix.samples[i + 2] * 114) // 1000))
    peak = max(col)
    ys = [390 + k / S for k, v in enumerate(col) if v > 200]
    print(f'page{pnum} col x={xpt}pt: line rows y(pts)={ys[:3]}..{ys[-3:] if len(ys) > 3 else ys} peak={peak}')
