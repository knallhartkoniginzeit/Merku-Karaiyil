/* --------------------------------------------------------------------------
   SECTION 6: CHARACTERS — PDF pages 8-13
   MAIN (pages 8-9): Perry / Keeri / Dhadi cards + Chandru feature.
     - one character card per slide (page-by-page carousel)
     - Chandru: NO hover image swap; hovering reveals a cast panel to the
       right of the bio (no title text, larger portraits).
   SUPPORTING (pages 10-13): Kavya & Varipuli, Perry's parents, Keeri's
     parents, Varadhan & Amul — same layout style as the PDF pages.
   -------------------------------------------------------------------------- */
(function initCharacters() {
  const track = document.getElementById('characterTrack');
  if (!track) return;

  // Characters WITHOUT a second photo in the PDF: no hover change for them.
  // Everyone else (boys, Chandru, Kavya, Varipuli) swaps to their portrait.
  const NO_SWAP = new Set(['Shruthi (35)', 'Ragupathi (40)', 'Banumathi (32)', 'Dinesh (38)', 'Varadhan (50)', 'Amul Doss (45)']);

  /* --- exact text and photos from PDF pages 8-9 --- */
  const BOYS = [
    {
      name: 'Perry (13)',
      square: 'images/characters/perry-square.png',
      portrait: 'images/characters/perry-portrait.png',
      actor: 'Rithvik',
      desc: 'Perry is a curious, energetic, and above-average boy who values friendship above everything else. He has done something he keeps to himself, maintaining a quiet, almost mysterious nature much like Perry the Platypus from Phineas and Ferb. He is deeply afraid of his mother and tends to overthink things. More than anything, Perry wants to make memories with his friends and hold on to the moments that matter.'
    },
    {
      name: 'Keeri (13)',
      square: 'images/characters/keeri-square.png',
      portrait: 'images/characters/keeri-portrait.png',
      actor: 'Athrey Baiju',
      desc: 'Keeri is an average student, a fun-loving and carefree boy who rarely takes things too seriously. He is always cracking jokes and trying to make everyone around him laugh. But beneath that cheerful nature is a sensitive side shaped by his parents\u2019 constant fights at home, which affects him deeply, especially at night. Despite everything, Keeri always stands by his friends and never hesitates to be there for them.'
    },
    {
      name: 'Dhadi (13)',
      square: 'images/characters/dhadi-square.png',
      portrait: 'images/characters/dhadi-portrait.png',
      actor: 'Kamalesh Jagan',
      desc: 'Dhadi is a fun-loving, responsible, and above-average kid. He has a habit of asking silly questions, even when the answer seems obvious. At an age when he should be carefree, he takes on many household responsibilities because of his father\u2019s drinking and irresponsibility. He has a short temper but has learned to keep it under control. Above all, Dhadi is deeply loyal to his friends and always makes sure they are okay.'
    }
  ];

  const CHANDRU = {
    name: 'Chandru (26)',
    head: 'images/characters/chandru.png',
    portrait: 'images/characters/ashok-selvan.png',
    actor: 'Ashok Selvan',
    desc: 'Three years ago, one incident changed the way Chandru sees life. Consumed by guilt and regret, he has never been able to forgive himself for what happened. He believes he no longer deserves happiness or anything good in life. He wants to apologize to the people affected by his actions, but they are no longer in his life. While life moves forward around him, Chandru remains trapped in the past, unable to let himself live in the present.'
  };

  /* --- supporting characters, exact PDF pages 10-13 --- */
  const SUPPORT = [
    {
      name: 'Kavya (26)', actor: 'Kavya Anil',
      img: 'images/characters/support/kavya.png',
      actorImg: 'images/characters/support/kavya-actor.png',
      desc: 'Kavya is a mature, fun, and practical woman with an independent mind and ambitions of her own. She has loved Chandru since their college days. She believes love is what gives life meaning and keeps us going. Even though Chandru is trapped in his past, she continues to wait for the person he used to be and stands by him through everything.'
    },
    {
      name: 'Varipuli (25)', actor: 'Maurish Dass',
      img: 'images/characters/support/varipuli.png',
      actorImg: 'images/characters/support/varipuli-actor.png',
      desc: 'Varipuli is a gentle, innocent man with mild ADHD and Tourette syndrome who deeply craves love and acceptance. He often does silly things to get noticed\u2014trying to speak broken English, constantly tucking in his un-ironed clothes, and attempting to look respectable. He is deeply afraid of his uncle, for whom he works, and is often treated disrespectfully by the people around him. The three boys are the only ones who genuinely accept him without judgment, making their friendship especially meaningful to him.'
    },
    {
      name: 'Shruthi (35)', actor: 'Perry\u2019s Mother',
      img: 'images/characters/support/shruthi.png',
      desc: 'Shruthi is Ragu\u2019s wife and Perry\u2019s mother. She is a bold, hardworking woman who believes strictness and discipline are essential to raising her son. Though she can be harsh with Perry, her actions come from a deep concern for his future. She rarely shows affection in front of him, but secretly worries and breaks down when she feels she has been too harsh. Beneath her strict exterior is a deeply caring mother who simply struggles to express her love.'
    },
    {
      name: 'Ragupathi (40)', actor: 'Perry\u2019s Father',
      img: 'images/characters/support/ragu.png',
      desc: 'Ragu is Perry\u2019s father, working as a project manager for a car company in Mumbai. He is hardworking and loving, but his demanding job keeps him away from his family. A passionate car enthusiast, he always brings vintage car model collections for his son whenever he visits. Though he struggles to build a strong bond with Perry, he genuinely wants to be a better father and be more present in his life.'
    },
    {
      name: 'Banumathi (32)', actor: 'Keeri\u2019s Mother',
      img: 'images/characters/support/banumathi.png',
      desc: 'Banumathi is Dinesh\u2019s wife and Keeri\u2019s mother, a working woman struggling to keep her middle-class family together. Frustrated by her husband\u2019s behaviour and the pressures of everyday life, she easily loses her temper and often takes it out on her children. She rarely shows affection, carrying her own resentment quietly, especially towards Perry\u2019s mother. She believes that one day, when life gets better, she will finally become calm\u2014but she fails to realise that kindness and peace can exist even within her present circumstances.'
    },
    {
      name: 'Dinesh (38)', actor: 'Keeri\u2019s Father',
      img: 'images/characters/support/dinesh.png',
      desc: 'Dinesh is Keeri\u2019s father, a hardworking man who leaves home early and returns late every day. Burdened by work pressure and family responsibilities, he is easily irritated and often gets into arguments with his wife. He loves her but never learned how to express it, and over time, that love has faded beneath their constant conflicts. Detached from his children, Dinesh longs for a peaceful life but never truly tries to create one.'
    },
    {
      name: 'Varadhan (50)', actor: 'The Guide',
      img: 'images/characters/support/varadhan.png',
      desc: 'Varadhan is a former student of the three boys\u2019 school and a successful textile businessman. A kind and gentle man, he runs a trust for abandoned children with organisations in Trichy and Kerala. Varadhan is a reflection of Chandru, carrying a similar guilt from his past. Though he has never completely overcome it, he has learned to live with it and continues to seek forgiveness for his mistakes. He believes the world belongs to children, and that it is our responsibility to make it a better place for them.'
    },
    {
      name: 'Amul Doss (45)', actor: 'Dhadi\u2019s Father',
      img: 'images/characters/support/amul.png',
      desc: 'Amul is Dhadi\u2019s father, a working-class man who runs a small ready-made clothing shop in the bazaar. After losing his wife four years ago, he has struggled to cope with the grief and turns to drinking every day. He comes home late, avoids household responsibilities, and remains emotionally distant from his son. Disliked and judged by the people in the colony, Amul no longer cares about what they think of him. His unresolved grief and drinking have deeply affected both his life and Dhadi\u2019s childhood.'
    }
  ];

  const CAST = [
    ['Basil Joseph', 'images/characters/basil-joseph.png'],
    ['Ashok Selvan', 'images/characters/ashok-selvan.png'],
    ['Kishen Das', 'images/characters/kishen-das.png'],
    ['Rishikanth', 'images/characters/rishikanth.png'],
    ['Hashir', 'images/characters/hashir.png']
  ];

  // hover-swap photo (boys only): base image, second image revealed on hover
  function photoSwap(base, hover, alt) {
    const wrap = document.createElement('div');
    wrap.className = 'character-photo-swap';
    const a = document.createElement('img');
    a.src = base;
    a.alt = alt || '';
    a.className = 'photo-base';
    const b = document.createElement('img');
    b.src = hover;
    b.alt = '';
    b.className = 'photo-hover';
    wrap.append(a, b);
    return wrap;
  }

  function staticPhoto(src, alt, cls) {
    const wrap = document.createElement('div');
    wrap.className = 'character-photo-swap' + (cls ? ' ' + cls : '');
    const a = document.createElement('img');
    a.src = src;
    a.alt = alt || '';
    a.className = 'photo-base';
    wrap.appendChild(a);
    return wrap;
  }

  function textBlock(name, desc, actor) {
    const frag = document.createDocumentFragment();
    const h = document.createElement('h3');
    h.className = 'character-heading';
    h.textContent = name;
    const p = document.createElement('p');
    p.className = 'character-desc';
    p.textContent = desc;
    const a = document.createElement('div');
    a.className = 'character-actor';
    a.innerHTML = '<span>as</span> ' + actor;
    frag.append(h, p, a);
    return frag;
  }

  /* --- PDF page 8: the three boys (one card per slide) —
         each swaps to his portrait photo on hover --- */
  BOYS.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'character-card main-character-card';
    const sw = photoSwap(c.square, c.portrait, c.name);
    sw.classList.add('can-swap');
    card.appendChild(sw);
    card.appendChild(textBlock(c.name, c.desc, c.actor));
    track.appendChild(card);
  });

  /* --- PDF page 9: Chandru feature panel + hover cast panel --- */
  const feature = document.createElement('div');
  feature.className = 'character-card chandru-feature';
  const chandruSwap = photoSwap(CHANDRU.head, CHANDRU.portrait, CHANDRU.name);
  chandruSwap.classList.add('can-swap', 'chandru-photo');
  feature.appendChild(chandruSwap);

  const bio = document.createElement('div');
  bio.className = 'chandru-bio';
  bio.appendChild(textBlock(CHANDRU.name, CHANDRU.desc, CHANDRU.actor));
  feature.appendChild(bio);

  /* Floating cast panel: appears to the RIGHT of the bio on Chandru hover.
     No heading text (per request) — just the five larger portraits. */
  const castPanel = document.createElement('div');
  castPanel.className = 'chandru-cast-panel';
  CAST.forEach(([actor, img]) => {
    const cell = document.createElement('div');
    cell.className = 'cast-panel-card';
    const im = document.createElement('img');
    im.src = img;
    im.alt = actor;
    const nm = document.createElement('span');
    nm.textContent = actor;
    cell.append(im, nm);
    castPanel.appendChild(cell);
  });
  bio.appendChild(castPanel);

  track.appendChild(feature);

  /* --- PDF pages 10-13: supporting characters ---
     Kavya & Varipuli get the hover swap (they have a second photo in the
     PDF); everyone else shows their single photo statically. --- */
  const supportHead = document.createElement('div');
  supportHead.className = 'support-heading';
  supportHead.innerHTML = '<span class="support-rule"></span>SUPPORTING CHARACTERS<span class="support-rule"></span>';
  track.appendChild(supportHead);

  SUPPORT.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'character-card support-character-card';
    if (!NO_SWAP.has(c.name) && c.actorImg) {
      const sw = photoSwap(c.img, c.actorImg, c.name);
      sw.classList.add('can-swap');
      card.appendChild(sw);
    } else {
      card.appendChild(staticPhoto(c.img, c.name));
    }
    card.appendChild(textBlock(c.name, c.desc, c.actor));
    track.appendChild(card);
  });

  /* --- carousel controls: one character per slide --- */
  const targets = [...track.querySelectorAll(':scope > .character-card')];
  const dotsContainer = document.getElementById('characterDots');
  let currentIndex = 0;
  let animating = false;

  function cardStep() {
    if (targets.length < 2) return track.clientWidth;
    return targets[1].offsetLeft - targets[0].offsetLeft;
  }

  function scrollToTarget(index) {
    const el = targets[index];
    if (!el || animating) return;
    // full-width slides: the slide's offsetLeft IS the scroll position
    const target = Math.max(0, Math.min(el.offsetLeft, track.scrollWidth - track.clientWidth));
    const start = track.scrollLeft;
    const dist = target - start;
    currentIndex = index;
    dotsContainer.querySelectorAll('.dot-indicator').forEach((d, i) => d.classList.toggle('active', i === index));
    if (Math.abs(dist) < 2) return;
    // scroll-snap cancels smooth scrolling — animate manually, snap off
    animating = true;
    track.style.scrollSnapType = 'none';
    const t0 = performance.now();
    const DUR = 500;
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

  targets.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => scrollToTarget(i));
    dotsContainer.appendChild(dot);
  });

  document.getElementById('nextCharBtn').addEventListener('click', () => {
    scrollToTarget(Math.min(currentIndex + 1, targets.length - 1));
  });
  document.getElementById('prevCharBtn').addEventListener('click', () => {
    scrollToTarget(Math.max(currentIndex - 1, 0));
  });

  // keep dots in sync with manual (wheel/drag) scrolling
  track.addEventListener('scroll', () => {
    if (animating) return;
    const step = cardStep();
    const idx = Math.round(track.scrollLeft / (step || 1));
    if (idx !== currentIndex && idx >= 0 && idx < targets.length) {
      currentIndex = idx;
      dotsContainer.querySelectorAll('.dot-indicator').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }, { passive: true });
})();
