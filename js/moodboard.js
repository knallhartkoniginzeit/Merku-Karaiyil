/* --------------------------------------------------------------------------
   SECTION 4: MOOD BOARD — exact reproduction of PDF slides 14-25
   Slides 14-16 : FILM MOOD               -> side-heading + image grid
   Slides 17-19 : NARRATIVE ARC REFERENCE -> side-heading + image grid
   Slides 20-22 : NARRATIVE ARC (Dan Harmon's Story Circle) -> one slide per
                  ACT. Reproduces PDF pages 19-21 exactly: each story step
                  carries its own contextual photo(s), and a solid white
                  story line crosses the page with per-act tick marks and
                  plot-point labels.
   Slides 23-25 : TONE & LIGHT REFERENCE  -> side-heading + image grid
   -------------------------------------------------------------------------- */
(function initMoodBoard() {
  const stage = document.getElementById('polaroidStage');
  if (!stage) return;

  /* ------------------------------------------------------------------
     Polaroid card builder (shared)
     ------------------------------------------------------------------ */
  function makeCard(rel) {
    const card = document.createElement('div');
    card.className = 'polaroid-card mood-card';

    const frame = document.createElement('div');
    frame.className = 'mood-photo-frame';

    const img = document.createElement('img');
    img.src = rel;
    img.loading = 'lazy';
    frame.appendChild(img);

    card.appendChild(frame);
    return card;
  }

  function buildSlideLayout(container, label, files) {
    const slide = document.createElement('div');
    slide.className = 'mood-slide';

    const head = document.createElement('div');
    head.className = 'mood-side-heading';
    head.textContent = 'MOOD BOARD';
    const headLabel = document.createElement('div');
    headLabel.className = 'mood-side-label';
    headLabel.textContent = label;
    head.appendChild(headLabel);
    slide.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'mood-photo-grid';
    files.forEach((rel) => grid.appendChild(makeCard(rel)));
    slide.appendChild(grid);

    container.appendChild(slide);
    return slide;
  }

  /* ------------------------------------------------------------------
     Story Circle (PDF pages 19-21) — data-driven, PDF-exact
     ------------------------------------------------------------------ */
  // photos: array of [path, aspectRatio, widthBasis] (basis = fraction of block)
  function storyBlock(stepClass, title, body, photos) {
    const block = document.createElement('div');
    block.className = 'story-step story-block ' + stepClass;
    const h = document.createElement('h4');
    h.textContent = title;
    const p = document.createElement('p');
    p.textContent = body;
    block.appendChild(h);
    block.appendChild(p);

    if (photos && (photos.length || photos.items)) {
      const row = document.createElement('div');
      row.className = 'step-photos' + (photos.stack ? ' stack' : '') + (photos.overlap ? ' overlap' : '');
      (photos.items || photos).forEach(([rel, aspect, basis]) => {
        const ph = document.createElement('div');
        ph.className = 'act-photo';
        const img = document.createElement('img');
        img.src = rel;
        img.loading = 'lazy';
        img.alt = '';
        ph.style.aspectRatio = String(aspect);
        ph.style.flexBasis = (basis * 100) + '%';
        ph.appendChild(img);
        row.appendChild(ph);
      });
      block.appendChild(row);
    }
    return block;
  }

  function actHeader(title, sub) {
    const el = document.createElement('div');
    el.className = 'story-act-header';
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const s = document.createElement('span');
    s.textContent = sub;
    el.appendChild(h3);
    el.appendChild(s);
    return el;
  }

  // Solid white story line + tick marks + plot-point label (per-act, as the PDF)
  function storyLine(kind) {
    const row = document.createElement('div');
    row.className = 'story-line-row';

    const line = document.createElement('div');
    line.className = 'story-line';
    row.appendChild(line);

    const label = document.createElement('div');
    label.className = 'plot-label';

    if (kind === 'act1') {
      // line from a small left end-tick to the right edge; tall tick at 78%
      // with "(Plot Point 1)" beneath it.
      line.style.left = '0%';
      line.style.right = '0%';
      const small = document.createElement('div');
      small.className = 'tick tick-small';
      small.style.left = '0%';
      const tall = document.createElement('div');
      tall.className = 'tick tick-tall';
      tall.style.left = '78%';
      row.appendChild(small);
      row.appendChild(tall);
      label.textContent = '(Plot Point 1)';
      label.classList.add('below');
      label.style.left = '78%';
    } else if (kind === 'act2') {
      // full-bleed line; tall centre tick with "(The Midpoint)" above.
      line.style.left = '0%';
      line.style.right = '0%';
      const tall = document.createElement('div');
      tall.className = 'tick tick-tall';
      tall.style.left = '50%';
      row.appendChild(tall);
      label.textContent = '(The Midpoint)';
      label.classList.add('above');
      label.style.left = '50%';
    } else {
      // act3: line stops at 68% with a small end-tick; tall bar at the far
      // left with "(Plot point 2)" above it.
      line.style.left = '0%';
      line.style.width = '68%';
      const small = document.createElement('div');
      small.className = 'tick tick-small';
      small.style.left = '68%';
      const tall = document.createElement('div');
      tall.className = 'tick tick-tall';
      tall.style.left = '0%';
      row.appendChild(small);
      row.appendChild(tall);
      label.textContent = '(Plot point 2)';
      label.classList.add('above', 'align-left');
      label.style.left = '0%';
    }

    row.appendChild(label);
    return row;
  }

  function makeStorySlide(container, kind, withHead, blocks) {
    const slide = document.createElement('div');
    slide.className = 'mood-slide story-circle-slide ' + kind;

    // Only the first panel carries the "MOOD BOARD / Narrative Arc Reference"
    // side heading; ACT 2 and ACT 3 continue to the right unlabelled, and
    // their story lines connect edge-to-edge into one continuous line.
    if (withHead) {
      const head = document.createElement('div');
      head.className = 'mood-side-heading';
      head.textContent = 'MOOD BOARD';
      const headLabel = document.createElement('div');
      headLabel.className = 'mood-side-label';
      headLabel.textContent = 'Narrative Arc Reference :';
      head.appendChild(headLabel);
      const sub = document.createElement('div');
      sub.className = 'story-circle-subtitle';
      sub.textContent = "Dan Harmon's Story Circle screenplay structure";
      head.appendChild(sub);
      slide.appendChild(head);
    }

    const actStage = document.createElement('div');
    actStage.className = 'act-stage';
    blocks.forEach((b) => actStage.appendChild(b));
    slide.appendChild(actStage);

    // Acts sit side-by-side in a horizontal scroll-snap track, like slides
    // in a deck: each act is one full-width panel, swiped/paged to the next.
    if (window.__storyTrack) window.__storyTrack.appendChild(slide);
    else container.appendChild(slide);
    return slide;
  }

  function buildStoryCircle(container) {
    // Photo assignments verified against the PDF by pixel matching
    // (aHash + dHash + NCC against every file on disk).
    const A1S1 = [['Narrative ref/1.jpeg', 1.78, 0.9]];
    const A1S2 = [['Film mood/4.png', 2.38, 1]];
    const A1S3 = [['Narrative ref/3.png', 2.7, 0.8]];
    const A2S4 = [['Narrative ref/7.jpeg', 1.78, 0.48], ['Narrative ref/8.jpeg', 1.86, 0.48]];
    const A2S5 = [['Narrative ref/9.jpeg', 2.81, 0.55], ['Narrative ref/10.png', 2.36, 0.42]];
    const A2S6 = {
      overlap: true,
      items: [
        ['Tone and Light ref/14.png', 2.38, 0.49],
        ['Narrative ref/13 (2).png', 2.45, 0.49]
      ]
    };
    const A3S7 = {
      overlap: true,
      items: [
        ['Film mood/2.png', 2.36, 0.5],
        ['Narrative ref/14.jpeg', 2.42, 0.5]
      ]
    };
    const A3S8 = {
      stack: true,
      items: [
        ['Narrative ref/15.jpeg', 1.44, 1],
        ['Narrative ref/16.jpeg', 1.5, 1],
        ['Tone and Light ref/11.jpeg', 1.86, 1]
      ]
    };

    // ---- PDF page 19 : ACT 1 (Setup) — carries the side heading ----
    makeStorySlide(container, 'act-1', true, [
      storyBlock('step-1', '1. YOU (Comfort zone)',
        'Perry, Keeri, and Dhadi are three best friends living ordinary lives, each quietly dealing with struggles at home.',
        A1S1),
      actHeader('ACT 1', '(Setup)'),
      storyBlock('step-3', '3. GO (Enter unfamiliar situation)',
        'A school incident gets them into trouble, and their strict parents forbid them from seeing each other, forcing the three friends to face the pain of separation.',
        A1S3),
      storyBlock('step-2', '2. NEED (Desire)',
        'Their wealthy classmate makes them curious about the sea, turning it into a dream they desperately want to fulfil.',
        A1S2),
      storyLine('act1'),
    ]);

    // ---- PDF page 20 : ACT 2 (The Confrontation) — continues right, no heading ----
    makeStorySlide(container, 'act-2', false, [
      storyBlock('step-4', '4. SEARCH (The Road of Trails)',
        'The boys decide to leave home and fulfil their dream of seeing the sea, while Chandru, a quiet and melancholic man burdened by guilt, chooses to walk away from anything that could bring him joy.',
        A2S4),
      actHeader('ACT 2', '(The Confrontation)'),
      storyBlock('step-6', '6. TAKE (Meeting your maker)',
        'Along the way, they encounter an accident victim, a smuggler, the police, and a broken family they help bring closer, while chaos and clashes grow between Chandru and the boys.',
        A2S6),
      storyBlock('step-5', '5. FIND (Meeting the Goddess)',
        'Their paths cross through an unexpected accident, unknowingly beginning a journey that will change them all.',
        A2S5),
      storyLine('act2'),
    ]);

    // ---- PDF page 21 : ACT 3 (Resolution) — continues right, no heading ----
    makeStorySlide(container, 'act-3', false, [
      storyBlock('step-8', '8. CHANGE (Master of both worlds)',
        'Chandru helps the boys fulfil their dream and finally lets go of his guilt. As they reunite with their families, he quietly leaves, ready to embrace life again. Then, the final twist reveals the truth behind his connection to the boys.',
        A3S8),
      actHeader('ACT 3', '(Resolution)'),
      storyBlock('step-7', '7. RETURN (Bring it Home)',
        'Perry has a frightening encounter with a stranger, pushing the boys to give up on their dream and head home. Meanwhile, their worried parents realise their mistakes and set out to find them.',
        A3S7),
      storyLine('act3'),
    ]);
  }

  /* ------------------------------------------------------------------
     Files on disk (verified with glob)
     ------------------------------------------------------------------ */
  // Horizontal track the three ACT panels snap across (side-by-side,
  // continued to the right like slides).
  const storyTrack = document.createElement('div');
  storyTrack.className = 'story-track';
  window.__storyTrack = storyTrack;

  const FILM_MOOD = [
    'Film mood/1.png', 'Film mood/2.png', 'Film mood/3.png', 'Film mood/4.png',
    'Film mood/5.png', 'Film mood/6.png', 'Film mood/7.png', 'Film mood/8.jpeg',
    'Film mood/9.png', 'Film mood/10.png', 'Film mood/11.png', 'Film mood/12.png'
  ];
  // 18 reference stills for slides 17-19 (as in the PDF). '13 (2).png' is
  // used contextually inside the ACT 2 slide, where the PDF places it.
  const NARRATIVE_REF = [
    'Narrative ref/1.jpeg', 'Narrative ref/2.jpeg', 'Narrative ref/3.png',
    'Narrative ref/4.png', 'Narrative ref/5.jpeg', 'Narrative ref/6.jpeg',
    'Narrative ref/7.jpeg', 'Narrative ref/8.jpeg', 'Narrative ref/9.jpeg',
    'Narrative ref/10.png', 'Narrative ref/11.jpeg', 'Narrative ref/12.png',
    'Narrative ref/13.png', 'Narrative ref/14.jpeg',
    'Narrative ref/15.jpeg', 'Narrative ref/16.jpeg', 'Narrative ref/17.png',
    'Narrative ref/18.png'
  ];
  const TONE_LIGHT = [
    'Tone and Light ref/1.jpeg', 'Tone and Light ref/2.jpeg', 'Tone and Light ref/3.jpeg',
    'Tone and Light ref/4.jpeg', 'Tone and Light ref/5.jpeg', 'Tone and Light ref/6.png',
    'Tone and Light ref/7.png', 'Tone and Light ref/8.jpeg', 'Tone and Light ref/9.jpeg',
    'Tone and Light ref/10.jpeg', 'Tone and Light ref/11.jpeg', 'Tone and Light ref/12.png',
    'Tone and Light ref/13.jpeg', 'Tone and Light ref/14.png', 'Tone and Light ref/15.png',
    'Tone and Light ref/16.png', 'Tone and Light ref/17.jpeg', 'Tone and Light ref/18.jpeg',
    'Tone and Light ref/19.jpeg', 'Tone and Light ref/20.jpeg'
  ];

  // ---------- Build the sections in PDF slide order ----------
  buildSlideLayout(stage, 'Film Mood :', FILM_MOOD);                   // slides 14-16
  buildSlideLayout(stage, 'Narrative Arc Reference :', NARRATIVE_REF); // slides 17-19
  buildStoryCircle(stage);                                             // slides 20-22
  window.__storyTrack = null;
  stage.appendChild(storyTrack);

  // arrows + dots under the ACT track (prev / dots / next)
  const trackTargets = [...storyTrack.querySelectorAll(':scope > .story-circle-slide')];
  const nav = document.createElement('div');
  nav.className = 'story-track-nav';
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-arrow-button';
  prevBtn.setAttribute('aria-label', 'Previous act');
  prevBtn.innerHTML = '&#8592;';
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'story-track-dots';
  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-arrow-button';
  nextBtn.setAttribute('aria-label', 'Next act');
  nextBtn.innerHTML = '&#8594;';
  nav.append(prevBtn, dotsWrap, nextBtn);
  stage.appendChild(nav);

  let actIndex = 0;
  let animating = false;
  function goAct(i) {
    if (animating) return;
    const next = (i + trackTargets.length) % trackTargets.length;
    const el = trackTargets[next];
    if (!el) return;
    actIndex = next;
    dotsWrap.querySelectorAll('.dot-indicator').forEach((d, k) => d.classList.toggle('active', k === next));
    // Animate by JS steps: scroll-snap 'mandatory' cancels smooth scrollTo,
    // so we ease manually to the exact snap offset of the target panel.
    const target = el.offsetLeft - storyTrack.offsetLeft;
    const start = storyTrack.scrollLeft;
    const dist = target - start;
    if (Math.abs(dist) < 2) return;
    animating = true;
    // scroll-snap fights the manual animation — disable it while we ease,
    // restore it on completion so touch/wheel snapping still works.
    storyTrack.style.scrollSnapType = 'none';
    const t0 = performance.now();
    const DUR = 650;
    function frame(t) {
      const p = Math.min(1, (t - t0) / DUR);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
      storyTrack.scrollLeft = start + dist * e;
      if (p < 1) requestAnimationFrame(frame);
      else {
        storyTrack.scrollLeft = target;
        requestAnimationFrame(() => {
          storyTrack.style.scrollSnapType = '';
          animating = false;
        });
      }
    }
    requestAnimationFrame(frame);
  }
  trackTargets.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => goAct(i));
    dotsWrap.appendChild(dot);
  });
  prevBtn.addEventListener('click', () => goAct(actIndex - 1));
  nextBtn.addEventListener('click', () => goAct(actIndex + 1));
  storyTrack.addEventListener('scroll', () => {
    if (animating) return;
    const w = trackTargets[1] ? (trackTargets[1].offsetLeft - trackTargets[0].offsetLeft) : storyTrack.clientWidth;
    const idx = Math.round(storyTrack.scrollLeft / (w || 1));
    if (idx !== actIndex && idx >= 0 && idx < trackTargets.length) {
      actIndex = idx;
      dotsWrap.querySelectorAll('.dot-indicator').forEach((d, k) => d.classList.toggle('active', k === idx));
    }
  }, { passive: true });

  buildSlideLayout(stage, 'Tone & Light reference :', TONE_LIGHT);     // slides 23-25
})();
