/* --------------------------------------------------------------------------
   SECTION 7: LOCATIONS — exact replica of PDF pages 30-38
   Each location = one full slide: LOCATION side-banner, big title, the
   verbatim description, and the exact reference photos arranged as in the
   deck (masonry-style photo wall). Horizontally scrollable, one per page.
   -------------------------------------------------------------------------- */
(function initLocations() {
  const P = 'images/locations/';

  const LOCATIONS = [
    {
      name: 'Ram aka Perry house setup',
      desc: 'A two-storey, upper-middle-class house in Trichy with an impressive collection of vintage cars.',
      imgs: ['p30_3_x129_y245_832x541.png', 'p30_4_x529_y214_736x552.png', 'p30_5_x896_y249_736x397.png',
             'p30_6_x124_y521_736x491.png', 'p30_7_x529_y513_736x520.png', 'p30_8_x927_y527_735x448.png']
    },
    {
      name: 'Hari aka Keeri & David aka Dhadi house setup',
      desc: 'A modest middle-class family house in Trichy, nestled within a small colony of eight surrounding houses.',
      imgs: ['p31_3_x74_y249_1299x651.png', 'p31_4_x529_y226_736x552.png', 'p31_5_x928_y0_736x1109.png', 'p31_6_x124_y522_735x483.png', 'p31_7_x506_y528_736x414.png', 'p31_8_x934_y525_720x540.png']
    },
    {
      name: 'Boyz School in Trichy',
      desc: 'The three boys are studying in 7th standard at Boyz Higher Secondary School in Trichy.',
      imgs: ['p32_3_x124_y207_282x288.png', 'p32_4_x529_y242_735x490.png', 'p32_5_x928_y242_1120x750.png',
             'p32_6_x124_y526_766x487.png', 'p32_7_x529_y516_1120x750.png', 'p32_8_x934_y520_1120x750.png']
    },
    {
      name: 'Trichy to Trivandrum Highway roads',
      desc: 'Their journey takes them along the Trichy\u2013Madurai and Madurai\u2013Trivandrum highways.',
      imgs: ['p33_3_x63_y401_808x394.png', 'p33_4_x488_y249_913x475.png', 'p33_5_x928_y397_342x222.png', 'p33_6_x529_y523_546x358.png']
    },
    {
      name: 'Varadhan house with Lawn area (Reception setup)',
      desc: 'A beautiful house with a spacious lawn in Vellayani, near Trivandrum. That night, the lawn is set up for a simple, aesthetic reception.',
      imgs: ['p34_3_x103_y246_735x487.png', 'p34_4_x529_y235_580x388.png', 'p34_5_x944_y164_310x273.png',
             'p34_8_x318_y516_819x520.png', 'p34_6_x795_y493_411x309.png']
    },
    {
      name: 'Lake near Varadhan house',
      desc: 'A beautiful house with a spacious lawn in Vellayani, near Trivandrum. That night, the lawn is set up for a simple, aesthetic reception.',
      imgs: ['p35_3_x81_y263_736x981.png', 'p35_4_x399_y289_334x355.png', 'p35_5_x728_y279_430x505.png', 'p35_6_x1052_y254_736x981.png']
    },
    {
      name: 'Lodge in Trivandrum',
      desc: 'After leaving Varadhan\u2019s house, the boys stay at a budget-friendly, slightly old-fashioned lodge in Trivandrum.',
      imgs: ['p36_3_x81_y232_960x1280.png', 'p36_4_x114_y316_841x547.png', 'p36_5_x898_y320_841x397.png', 'p36_7_x986_y194_960x1280.png', 'p36_3_x536_y283_658x535.png']
    },
    {
      name: 'Old theatre setup in Kerala',
      desc: 'Perry watches a movie at an old, slightly worn theatre near their lodge. A place where he later has a traumatic experience.',
      imgs: ['p37_3_x111_y226_735x551.png', 'p37_4_x529_y242_474x316.png', 'p37_5_x879_y249_621x312.png',
             'p37_6_x124_y520_615x412.png', 'p37_7_x529_y525_735x474.png', 'p37_8_x934_y521_735x490.png']
    },
    {
      name: 'Varkala, Kerala',
      desc: 'Varkala South Cliff and Beach with a beautiful sunset view.',
      imgs: ['p38_3_x124_y246_822x532.png', 'p38_4_x462_y249_1017x546.png', 'p38_8_x934_y113_642x678.png',
             'p38_6_x124_y322_736x1308.png', 'p38_7_x529_y521_1120x747.png', 'p38_5_x933_y521_736x490.png']
    }
  ];

  const container = document.getElementById('locationCardsContainer');
  if (!container) return;

  LOCATIONS.forEach((loc) => {
    const slide = document.createElement('div');
    slide.className = 'location-slide';

    const banner = document.createElement('div');
    banner.className = 'location-banner';
    banner.textContent = 'LOCATION';
    slide.appendChild(banner);

    const body = document.createElement('div');
    body.className = 'location-body';

    const title = document.createElement('h3');
    title.className = 'location-title';
    title.textContent = loc.name;
    body.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'location-desc';
    desc.textContent = loc.desc;
    body.appendChild(desc);

    // photo wall — the same set of references as the PDF page.
    // Filenames carry the true pixel size (…_832x541.png); images keep
    // their natural ratio and JS later balances them into columns that
    // fit the fixed-height frame.
    const wall = document.createElement('div');
    wall.className = 'location-wall' + (loc.imgs.length <= 4 ? ' few' : '');
    loc.imgs.forEach((src) => {
      const ph = document.createElement('div');
      ph.className = 'location-photo';
      const dims = src.match(/(\d+)x(\d+)\.png$/);
      if (dims) {
        ph.dataset.w = dims[1];
        ph.dataset.h = dims[2];
        ph.style.aspectRatio = `${dims[1]} / ${dims[2]}`;
      }
      const img = document.createElement('img');
      img.src = P + src;
      img.alt = loc.name;
      img.loading = 'lazy';
      ph.appendChild(img);
      wall.appendChild(ph);
    });
    body.appendChild(wall);

    slide.appendChild(body);
    container.appendChild(slide);
  });

  /* --- carousel: one location per page --- */
  const track = container;
  const targets = [...track.querySelectorAll(':scope > .location-slide')];
  const prevBtn = document.getElementById('prevLocBtn');
  const nextBtn = document.getElementById('nextLocBtn');
  const dotsContainer = document.getElementById('locationDots');
  let currentIndex = 0;
  let animating = false;

  function scrollToTarget(index) {
    const el = targets[index];
    if (!el || animating) return;
    // slides are exactly one track-width wide, so the slide's offsetLeft
    // (relative to the track content) IS the scroll position
    const target = Math.max(0, Math.min(el.offsetLeft, track.scrollWidth - track.clientWidth));
    const start = track.scrollLeft;
    const dist = target - start;
    currentIndex = index;
    dotsContainer.querySelectorAll('.dot-indicator').forEach((d, i) => d.classList.toggle('active', i === index));
    if (Math.abs(dist) < 2) return;
    animating = true;
    track.style.scrollSnapType = 'none';
    const t0 = performance.now();
    const DUR = 550;
    function frame(t) {
      const p = Math.min(1, (t - t0) / DUR);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      track.scrollLeft = start + dist * e;
      if (p < 1) requestAnimationFrame(frame);
      else requestAnimationFrame(() => {
        track.scrollLeft = target;
        track.style.scrollSnapType = '';
        animating = false;
      });
    }
    requestAnimationFrame(frame);
  }

  /* --- fit-to-frame: distribute each wall's photos into balanced columns
         sized so the entire set fits inside the fixed-height frame,
         every photo keeping its natural aspect ratio (no cropping) --- */
  function fitWalls() {
    document.querySelectorAll('.location-wall').forEach((wall) => {
      const photos = [...wall.querySelectorAll('.location-photo')];
      const frameH = wall.clientHeight;
      if (!photos.length || !frameH || !photos[0].dataset.w) return;

      const gap = 16; // 1rem gaps, in px — must match the CSS gap on
                      // .location-wall / .location-col so the fit math and
                      // the rendered spacing stay identical
      const nCols = wall.clientWidth < 700 ? 2 : Math.max(2, Math.min(3, Math.ceil(photos.length / 2)));

      // column width W for a set of photos: heights are W*(h/w) each, and
      // the column must satisfy sum(heights) + (k-1)*gap = frameH
      const colW = (col) => {
        const sumHW = col.reduce((s, p) => s + (+p.dataset.h) / (+p.dataset.w), 0);
        return (frameH - gap * (col.length - 1)) / sumHW;
      };

      // greedy: give each photo the column with the most room (the one
      // where the resulting column width is largest) — this balances them
      const cols = Array.from({ length: nCols }, () => []);
      photos.forEach((ph) => {
        let best = 0;
        let bestW = -Infinity;
        for (let c = 0; c < nCols; c++) {
          const w = colW(cols[c].concat(ph));
          if (w > bestW) { bestW = w; best = c; }
        }
        cols[best].push(ph);
      });

      wall.innerHTML = '';
      const used = cols.filter((c) => c.length);
      // never exceed the available width: scale all columns down together
      const totalW = used.reduce((s, col) => s + colW(col), 0) + gap * (used.length - 1);
      const cap = wall.clientWidth || Infinity;
      const k = totalW > cap ? (cap - gap * (used.length - 1)) / (totalW - gap * (used.length - 1)) : 1;
      used.forEach((col) => {
        const colEl = document.createElement('div');
        colEl.className = 'location-col';
        colEl.style.width = colW(col) * k + 'px';
        col.forEach((ph) => colEl.appendChild(ph));
        wall.appendChild(colEl);
      });
    });
  }

  fitWalls();
  window.addEventListener('load', fitWalls); // re-fit once images/layout settle
  let fitTimer;
  window.addEventListener('resize', () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitWalls, 120);
  });

  targets.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => scrollToTarget(i));
    dotsContainer.appendChild(dot);
  });

  nextBtn.addEventListener('click', () => scrollToTarget(Math.min(currentIndex + 1, targets.length - 1)));
  prevBtn.addEventListener('click', () => scrollToTarget(Math.max(currentIndex - 1, 0)));  const step = () => (targets.length > 1 ? targets[1].offsetLeft - targets[0].offsetLeft : track.clientWidth);

  track.addEventListener('scroll', () => {
    if (animating) return;
    const idx = Math.round(track.scrollLeft / (step() || 1));
    if (idx !== currentIndex && idx >= 0 && idx < targets.length) {
      currentIndex = idx;
      dotsContainer.querySelectorAll('.dot-indicator').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }, { passive: true });
})();
