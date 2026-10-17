/* --------------------------------------------------------------------------
   SECTION 6: COLOR PALETTE — exact reproduction of PDF pages 26-29
   Four palettes, verbatim from the deck (description + swatch strips sampled
   from the PDF itself). Each palette block is: title + description + swatch
   strip, with that palette's four cinematic stills directly below it (as in
   the PDF, where each palette page pairs its colours with four film stills).
   Hover a swatch / the card to highlight the matching stills.
   -------------------------------------------------------------------------- */
(function initColorPalette() {
  /* --- the four PDF palettes: exact text + extracted swatch colours --- */
  const PALETTES = [
    {
      id: 'boys',
      label: 'The Boys',
      title: 'Warm, Saturated, Red, Yellow, Green',
      desc: 'The boyz portions should carry a warm, sun soaked summer palette that evokes the nostalgia and innocence of childhood.',
      swatches: ['#1B1F08', '#393E02', '#45554B', '#565C17', '#777939', '#918A6A', '#8C9D98', '#7EA0AE', '#A9B8B8', '#ACBEC0', '#293035', '#3F444B', '#80111D', '#63382D', '#564D4F', '#595120'],
      stills: ['images/palette/p26_i3.png', 'images/palette/p26_i5.png', 'images/palette/p26_i6.png', 'images/palette/p26_i7.png']
    },
    {
      id: 'chandru',
      label: 'Chandru — First Half',
      title: 'Cool, Desaturated, Blue, Cyan, Green',
      desc: 'Chandru\u2019s portions in the first half should carry cool, dark tones that evoke his loneliness and emotional isolation. The palette reflects how he remains trapped in guilt and sadness, keeping himself detached from the people and life around him.',
      swatches: ['#23191D', '#292A26', '#183244', '#244664', '#264A5D', '#416988', '#5C87A9', '#222221', '#242629', '#3B4047', '#5A6360', '#7B8189', '#99A2A8', '#546449', '#366B70', '#395E82'],
      stills: ['images/palette/p27_i3.png', 'images/palette/p27_i4.png', 'images/palette/p27_i5.png', 'images/palette/p27_i6.png']
    },
    {
      id: 'secondhalf',
      label: 'Second Half',
      title: 'Mixed, Blue, Cyan, Green, Yellow and White',
      desc: 'The second half embraces a mixed colour palette, moving between cool and warm tones, as well as saturated and desaturated treatments. The palette evolves organically with the mood and emotional state of each sequence, reflecting the journey through travel, chaos, emotional highs and lows, and moments of wholesomeness.',
      swatches: ['#1C2126', '#232F24', '#2F391A', '#475223', '#4C5A61', '#656C35', '#939F92', '#A49C8C', '#DCD6C9', '#EBF0EE', '#121618', '#1E2620', '#4A432B', '#728C70', '#8DA090', '#54637E'],
      stills: ['images/palette/p28_i3.png', 'images/palette/p28_i4.png', 'images/palette/p28_i5.png', 'images/palette/p28_i6.png']
    },
    {
      id: 'climax',
      label: 'Climax',
      title: 'Mixed, Saturated Yellow, Blue, Pink and White',
      desc: 'The climax carries a warm, saturated sunset palette that evokes emotion, warmth, and wholesomeness. It should feel like a warm hug to the audience, while maintaining a subtle sense of curiosity as the final twist unfolds.',
      swatches: ['#2E3429', '#4D4534', '#603E28', '#76826F', '#978663', '#B49F6D', '#E9C870', '#1B1E1D', '#2A1F21', '#212B30', '#34404E', '#4B5760', '#795D59', '#59665D', '#6D6151', '#546369'],
      stills: ['images/palette/p29_i3.png', 'images/palette/p29_i4.png', 'images/palette/p29_i5.png', 'images/palette/p29_i6.png']
    }
  ];

  const container = document.getElementById('colorPalettes');
  if (!container) return;

  PALETTES.forEach((pal) => {
    /* --- one palette block: card (text + swatches) + its stills below --- */
    const group = document.createElement('div');
    group.className = 'palette-group';
    group.dataset.palette = pal.id;

    const card = document.createElement('div');
    card.className = 'palette-card';

    const h = document.createElement('h5');
    h.className = 'palette-card-title';
    h.innerHTML = '<span class="palette-word">Color :</span> ' + pal.title;
    card.appendChild(h);

    const d = document.createElement('p');
    d.className = 'palette-card-desc';
    d.textContent = pal.desc;
    card.appendChild(d);

    const strip = document.createElement('div');
    strip.className = 'palette-strip';
    pal.swatches.forEach(hex => {
      const sw = document.createElement('div');
      sw.className = 'palette-swatch';
      sw.style.background = hex;
      sw.title = hex;
      sw.dataset.hex = hex;
      sw.dataset.palette = pal.id;
      sw.addEventListener('mouseenter', () => highlight(pal, hex));
      sw.addEventListener('mouseleave', clear);
      strip.appendChild(sw);
    });
    card.appendChild(strip);

    card.addEventListener('mouseenter', () => highlight(pal));
    card.addEventListener('mouseleave', clear);
    group.appendChild(card);

    /* --- this palette's four cinematic stills, directly below its card --- */
    const row = document.createElement('div');
    row.className = 'palette-stills';
    pal.stills.forEach((src) => {
      const cell = document.createElement('div');
      cell.className = 'scene-image-cell';
      cell.dataset.palette = pal.id;
      cell.setAttribute('role', 'listitem');
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      cell.appendChild(img);
      row.appendChild(cell);
    });
    group.appendChild(row);

    container.appendChild(group);
  });

  /* --- highlight logic: hovering a card/swatch lights its stills and
         dims the other palettes' stills --- */
  function highlight(pal) {
    document.querySelectorAll('.scene-image-cell').forEach(cell => {
      const on = cell.dataset.palette === pal.id;
      cell.classList.toggle('highlighted', on);
      cell.classList.toggle('dimmed', !on);
    });
    document.querySelectorAll('.palette-swatch').forEach(sw => {
      sw.classList.toggle('active', sw.dataset.palette === pal.id);
    });
    document.querySelectorAll('.palette-card').forEach(c => {
      c.classList.toggle('active', c.dataset.palette === pal.id);
    });
  }

  function clear() {
    document.querySelectorAll('.scene-image-cell').forEach(c => c.classList.remove('highlighted', 'dimmed'));
    document.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('active'));
  }
})();
