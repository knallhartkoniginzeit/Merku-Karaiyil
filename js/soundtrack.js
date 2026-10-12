/* --------------------------------------------------------------------------
   SECTION 8: SOUNDTRACK — PDF pages 39-41
   Nine tracks exactly as the deck: cover art, title, artists, and the
   "on Spotify" label, arranged three per page. Audio sources can be
   attached later (AUDIO_URLS below) — the play controls are wired and
   will drive real playback as soon as URLs are provided.
   -------------------------------------------------------------------------- */
(function initSoundtrack() {
  // Set these when the audio files arrive, e.g. 'audio/song1.mp3'.
  const AUDIO_URLS = {
    'Yealae Yealae Dosthu Da': 'audio/song1.mpeg',
    'Cherathukal (From "Kumbalangi Nights")': 'audio/song2.mpeg',
    'Sanu Ek Pal Chain (From "Raid")': 'audio/song3.mpeg',
    'Ilahi': 'audio/song4.mpeg',
    'K For Kalyanam (From "Guruvayoorambala Nadayil")': 'audio/song5.mpeg',
    'Thaniye': 'audio/song6.mpeg',
    'Kunjikkavil Meghame (From "Aashaan")': 'audio/song7.mpeg',
    'Makane X Koodappirannor': 'audio/bonus1.mpeg',
    'Safarnama': 'audio/bonus2.mpeg'
  };

  const TRACKS = [
    ['Yealae Yealae Dosthu Da', 'Harris Jayaraj, Krishh, Naresh Iyer, Krishna Iyer', 'images/soundtrack/song1.png'],
    ['Cherathukal (From "Kumbalangi Nights")', 'Sushin Shyam, Sithara Krishnakumar, Anwar Ali', 'images/soundtrack/song2.png'],
    ['Sanu Ek Pal Chain (From "Raid")', 'Rahat Fateh Ali Khan, Tanishk Bagchi', 'images/soundtrack/song3.png'],
    ['Ilahi', 'Pritam, Arijit Singh, Amitabh Bhattacharya', 'images/soundtrack/song4.png'],
    ['K For Kalyanam (From "Guruvayoorambala Nadayil")', 'Ankit Menon, Milan, Sharath, Himna Hilari, Aruna Mary George, Indu Deepu', 'images/soundtrack/song5.png'],
    ['Thaniye', 'Vishnu Vijay, Sooraj Santhosh', 'images/soundtrack/song6.png'],
    ['Kunjikkavil Meghame (From "Aashaan")', 'Johnpaul George, Sooraj Santhosh, Vinayak Sasikumar', 'images/soundtrack/song7.png'],
    ['Makane X Koodappirannor', 'Parvatish Pradeep, B.K. Harinarayanan', 'images/soundtrack/bonus1.png'],
    ['Safarnama', 'Lucky Ali', 'images/soundtrack/bonus2.png']
  ];

  const rack = document.getElementById('soundtrackRack');
  if (!rack) return;

  const formatTime = sec => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  TRACKS.forEach(([title, artists, cover], i) => {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.setAttribute('role', 'listitem');

    // "SONG 1" / "SONG 2" … label above each card, as the PDF soundtrack
    // pages do; the last two (bonus tracks) are labelled BONUS 1 / BONUS 2.
    const label = document.createElement('div');
    label.className = 'song-label';
    label.textContent = i < 7 ? 'SONG ' + (i + 1) : 'BONUS ' + (i - 6);
    card.appendChild(label);

    const coverWrap = document.createElement('div');
    coverWrap.className = 'song-cover';
    const img = document.createElement('img');
    img.src = cover;
    img.alt = title + ' — cover';
    img.loading = 'lazy';
    coverWrap.appendChild(img);

    // small spinning disc badge when playing
    const badge = document.createElement('div');
    badge.className = 'song-disc';
    badge.innerHTML = '<div></div>';
    coverWrap.appendChild(badge);

    const meta = document.createElement('div');
    meta.className = 'song-meta';
    const h = document.createElement('h4');
    h.className = 'song-title';
    h.textContent = title;
    const a = document.createElement('p');
    a.className = 'song-artists';
    a.textContent = artists;
    const s = document.createElement('div');
    s.className = 'song-source';
    s.innerHTML = '<span class="spotify-mark">&#9679;&#9679;&#9679;</span> on Spotify';
    meta.append(h, a, s);

    const controls = document.createElement('div');
    controls.className = 'song-controls';
    controls.innerHTML = `
      <button class="control-button play-pause-button" data-idx="${i}" aria-label="Play or Pause ${title}">&#x25B6;</button>
      <div class="song-seek"><div class="song-seek-progress" data-idx="${i}"></div></div>
      <span class="song-time" data-idx="${i}">0:00</span>
    `;

    card.append(coverWrap, meta, controls);
    rack.appendChild(card);
  });

  /* --- playback: activates when AUDIO_URLS entries are filled in --- */
  const audio = TRACKS.map(() => new Audio());
  const durations = TRACKS.map(() => 210);
  const state = TRACKS.map(() => ({ playing: false, seekTo: null }));

  function stopAll(except) {
    state.forEach((st, i) => {
      if (i === except) return;
      st.playing = false;
      audio[i].pause();
      const btn = document.querySelector(`.play-pause-button[data-idx="${i}"]`);
      if (btn) btn.textContent = '\u25B6';
      const card = btn && btn.closest('.song-card');
      if (card) card.classList.remove('playing');
    });
  }

  document.querySelectorAll('.play-pause-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.idx;
      const src = AUDIO_URLS[TRACKS[i][0]];
      if (!src) return; // no audio yet — controls stay decorative
      if (state[i].playing) {
        audio[i].pause();
        state[i].playing = false;
        btn.textContent = '\u25B6';
        btn.closest('.song-card').classList.remove('playing');
      } else {
        stopAll(i);
        if (audio[i].src !== new URL(src, location.href).href) audio[i].src = src;
        audio[i].play();
        state[i].playing = true;
        btn.textContent = '\u23F8';
        btn.closest('.song-card').classList.add('playing');
      }
    });
  });

  audio.forEach((a, i) => {
    a.addEventListener('loadedmetadata', () => { durations[i] = a.duration; });
    a.addEventListener('timeupdate', () => {
      const pct = (a.currentTime / (a.duration || durations[i])) * 100;
      const bar = document.querySelector(`.song-seek-progress[data-idx="${i}"]`);
      if (bar) bar.style.width = pct + '%';
      const t = document.querySelector(`.song-time[data-idx="${i}"]`);
      if (t) t.textContent = formatTime(a.currentTime);
    });
    a.addEventListener('ended', () => {
      state[i].playing = false;
      const btn = document.querySelector(`.play-pause-button[data-idx="${i}"]`);
      if (btn) { btn.textContent = '\u25B6'; btn.closest('.song-card').classList.remove('playing'); }
    });
  });
})();
