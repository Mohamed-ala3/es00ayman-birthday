// =========================================================
// DATA — photos used across the gallery + timeline
// =========================================================
const GALLERY_PHOTOS = [
  { src: 'assets/images/img06.jpg', caption: 'أحلى ضحكة شفتها ❤️' },
  { src: 'assets/images/img13.jpg', caption: 'كل صورة معاكِ ليها حكاية' },
  { src: 'assets/images/img08.jpg', caption: 'وجودك بيخلي كل حاجة أحلى' },
  { src: 'assets/images/img14.jpg', caption: 'My favorite person ❤️' },
  { src: 'assets/images/img03.jpg', caption: 'إحنا الاتنين بس' },
  { src: 'assets/images/img18.jpg', caption: 'ايدك في ايدي دايمًا' },
  { src: 'assets/images/img16.jpg', caption: 'لحظات بسيطة وحلوة' },
  { src: 'assets/images/img10.jpg', caption: 'قربك بيريحني' },
  { src: 'assets/images/img12.jpg', caption: 'أجمل حاجة تشوفها عيني' },
  { src: 'assets/images/img09.jpg', caption: 'وسخافتنا مع بعض 😄' },
  { src: 'assets/images/img11.jpg', caption: 'خطوة خطوة معاكِ' },
  { src: 'assets/images/img19.jpg', caption: 'قلبي دايمًا هنا' },
];

const TIMELINE_PHOTOS = [
  { src: 'assets/images/img01.jpg', label: 'أول ذكريات', caption: 'من أول ما بقينا احنا الاتنين' },
  { src: 'assets/images/img07.jpg', label: 'لحظة هدوء', caption: 'قربك وحده كفاية' },
  { src: 'assets/images/img17.jpg', label: 'ليلة نحبها', caption: 'خرجة كانت أحلى من اللي قبلها' },
  { src: 'assets/images/img20.jpg', label: 'إحنا سوا', caption: 'أحلى فريق في الدنيا' },
  { src: 'assets/images/img15.jpg', label: 'يوم مفضّل', caption: 'من أحلى أيامنا لحد دلوقتي' },
];

const ALL_LIGHTBOX_PHOTOS = [...GALLERY_PHOTOS, ...TIMELINE_PHOTOS];

// =========================================================
// LOADER
// =========================================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    kickOffHeroReveal();
  }, 900);
});

// Safety: hide loader even if load event is delayed by slow assets
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    kickOffHeroReveal();
  }
}, 3500);

function kickOffHeroReveal(){
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), i * 160);
  });
}

// =========================================================
// SCROLL REVEAL (IntersectionObserver)
// =========================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

function observeReveals(root = document){
  root.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

// =========================================================
// BUILD GALLERY (polaroid field)
// =========================================================
function buildGallery(){
  const field = document.getElementById('polaroidField');
  const frag = document.createDocumentFragment();

  GALLERY_PHOTOS.forEach((photo, idx) => {
    const card = document.createElement('figure');
    card.className = 'polaroid reveal';
    card.style.transitionDelay = `${(idx % 6) * 0.08}s`;
    card.dataset.index = idx;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = 'lazy';
    img.onerror = () => { img.src = fallbackDataURI(); };

    const cap = document.createElement('figcaption');
    cap.className = 'polaroid-caption';
    cap.textContent = photo.caption;

    card.appendChild(img);
    card.appendChild(cap);
    card.addEventListener('click', () => openLightbox(idx));
    frag.appendChild(card);
  });

  field.appendChild(frag);
  observeReveals(field);
}

// =========================================================
// BUILD TIMELINE
// =========================================================
function buildTimeline(){
  const track = document.getElementById('timelineTrack');
  const frag = document.createDocumentFragment();

  TIMELINE_PHOTOS.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'timeline-item';

    const card = document.createElement('div');
    card.className = 'timeline-card reveal';
    card.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;
    img.loading = 'lazy';
    img.onerror = () => { img.src = fallbackDataURI(); };

    const textWrap = document.createElement('div');
    textWrap.className = 'timeline-text';
    textWrap.innerHTML = `<span class="timeline-label">${item.label}</span><p class="timeline-caption">${item.caption}</p>`;

    card.appendChild(img);
    card.appendChild(textWrap);
    card.addEventListener('click', () => openLightbox(GALLERY_PHOTOS.length + idx));

    const node = document.createElement('div');
    node.className = 'timeline-node';

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    row.appendChild(card);
    row.appendChild(node);
    row.appendChild(spacer);
    frag.appendChild(row);
  });

  track.appendChild(frag);
  observeReveals(track);
}

function fallbackDataURI(){
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="100%" height="100%" fill="#241226"/><text x="50%" y="50%" fill="#ff7a9c" font-size="60" text-anchor="middle" dy=".3em" font-family="sans-serif">❤</text></svg>`
  );
}

// =========================================================
// LIGHTBOX
// =========================================================
let lbIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(index){
  lbIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function renderLightbox(){
  const photo = ALL_LIGHTBOX_PHOTOS[lbIndex];
  lightboxImg.src = photo.src;
  lightboxImg.alt = photo.caption || '';
  lightboxCaption.textContent = photo.caption || '';
  lightboxImg.onerror = () => { lightboxImg.src = fallbackDataURI(); };
}
function nextLightbox(){ lbIndex = (lbIndex + 1) % ALL_LIGHTBOX_PHOTOS.length; renderLightbox(); }
function prevLightbox(){ lbIndex = (lbIndex - 1 + ALL_LIGHTBOX_PHOTOS.length) % ALL_LIGHTBOX_PHOTOS.length; renderLightbox(); }

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxNext').addEventListener('click', nextLightbox);
document.getElementById('lightboxPrev').addEventListener('click', prevLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') prevLightbox(); // RTL feel
  if (e.key === 'ArrowLeft') nextLightbox();
});

// =========================================================
// DOT NAV — active state on scroll
// =========================================================
function setupDotNav(){
  const dots = document.querySelectorAll('.dot-nav .dot');
  const sections = Array.from(dots).map(d => document.querySelector(d.getAttribute('href')));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = '#' + entry.target.id;
        dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => { if (s) navObserver.observe(s); });
}

// =========================================================
// SPARKLES
// =========================================================
function spawnSparkles(count = 26){
  const field = document.getElementById('sparkle-field');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDelay = (Math.random() * 3) + 's';
    s.style.animationDuration = (2 + Math.random() * 2.5) + 's';
    frag.appendChild(s);
  }
  field.appendChild(frag);
}

// =========================================================
// FALLING PETALS / HEARTS — canvas
// =========================================================
function setupPetals(){
  const canvas = document.getElementById('petals');
  const ctx = canvas.getContext('2d');
  let w, h;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = window.innerWidth < 700 ? 14 : 24;
  const colors = ['#ff7a9c', '#ff3f6c', '#b48bff', '#ffcf8a'];

  function makePetal(){
    return {
      x: Math.random() * w,
      y: Math.random() * -h,
      size: 6 + Math.random() * 8,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.6,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  const petals = Array.from({ length: count }, makePetal);

  function drawHeart(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(p.size / 10, p.size / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-6, -4, -12, 2, 0, 10);
    ctx.bezierCurveTo(12, 2, 6, -4, 0, 3);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.restore();
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    petals.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y > h + 20){ Object.assign(p, makePetal(), { y: -20 }); }
      drawHeart(p);
    });
    requestAnimationFrame(tick);
  }

  if (!reduceMotion) tick();
}

// =========================================================
// SURPRISE BUTTON
// =========================================================
function setupSurprise(){
  const btn = document.getElementById('surpriseBtn');
  const msg = document.getElementById('surpriseMessage');
  let used = false;

  btn.addEventListener('click', () => {
    burstHearts(46);
    msg.textContent = 'بحبك أكتر مما الكلام يقدر يوصف ❤️';
    msg.classList.add('show');
    if (!used){
      used = true;
      btn.querySelector('.btn-text').textContent = 'كمان مرة؟ 🥹';
    }
  });
}

function burstHearts(count = 40){
  const layer = document.getElementById('heartBurstLayer');
  const glyphs = ['❤️', '💗', '💖', '✨', '💕'];
  for (let i = 0; i < count; i++){
    const el = document.createElement('span');
    el.className = 'burst-heart';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const left = Math.random() * 100;
    el.style.left = left + 'vw';
    el.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
    el.style.setProperty('--spin', (Math.random() * 360) + 'deg');
    el.style.fontSize = (14 + Math.random() * 18) + 'px';
    el.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
    el.style.animationDelay = (Math.random() * 0.4) + 's';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 4600);
  }
}

// =========================================================
// MUSIC PLAYER
// =========================================================
function setupMusic(){
  const toggle = document.getElementById('musicToggle');
  const audio = document.getElementById('bgAudio');

  toggle.addEventListener('click', async () => {
    if (audio.paused){
      try{
        await audio.play();
        toggle.classList.add('playing');
      } catch(err){
        toggle.classList.remove('playing');
        // No audio file added yet, or autoplay blocked — fail gracefully.
        console.info('تقدر تضيفي الأغنية في assets/audio/our-song.mp3');
      }
    } else {
      audio.pause();
      toggle.classList.remove('playing');
    }
  });
}

// =========================================================
// GENTLE PARALLAX ON HERO PHOTO
// =========================================================
function setupParallax(){
  const photo = document.getElementById('heroPhoto');
  if (!photo || window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    photo.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  });
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  buildTimeline();
  setupDotNav();
  spawnSparkles();
  setupPetals();
  setupSurprise();
  setupMusic();
  setupParallax();
  observeReveals();
});
