// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Reveal on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

// Année dynamique footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Hero tri-bandes: interaction mobile (tap pour développer)
function setupHeroSplitInteractions() {
  const heroSplit = document.querySelector('.hero-split');
  if (!heroSplit) return;
  const panels = Array.from(heroSplit.querySelectorAll('.hero-split-panel'));
  const dots = Array.from(document.querySelectorAll('.hero-dots .dot'));
  const swipeHint = document.querySelector('.swipe-hint');

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function activatePanel(targetPanel) {
    panels.forEach(panel => {
      if (panel === targetPanel) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // Initial: activer le premier sur mobile
  if (isMobile() && panels[0]) activatePanel(panels[0]);

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      if (!isMobile()) return; // pas de click sur desktop
      const alreadyActive = panel.classList.contains('active');
      if (alreadyActive) return; // rien à faire
      activatePanel(panel);
    });
  });

  // Réagir aux changements de taille
  window.addEventListener('resize', () => {
    if (isMobile()) {
      const active = heroSplit.querySelector('.hero-split-panel.active');
      if (!active && panels[0]) activatePanel(panels[0]);
    } else {
      panels.forEach(p => p.classList.remove('active'));
    }
  });

  // Sync dots on mobile
  function updateDotsByScroll() {
    if (!isMobile() || panels.length !== dots.length) return;
    const scrollLeft = heroSplit.scrollLeft;
    const width = heroSplit.clientWidth;
    const index = Math.round(scrollLeft / width);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }
  heroSplit.addEventListener('scroll', () => {
    updateDotsByScroll();
    if (swipeHint) swipeHint.style.display = 'none';
  }, { passive: true });

  // Dots click -> scroll
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!isMobile()) return;
      heroSplit.scrollTo({ left: i * heroSplit.clientWidth, behavior: 'smooth' });
    });
  });
}

setupHeroSplitInteractions();

// Hover effect for offer cards (cursor spotlight)
function setupOfferCardHover() {
  document.querySelectorAll('.offer-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });
}

setupOfferCardHover();

// Navbar transparency based on hero visibility
function setupNavbarTransparency() {
  const header = document.querySelector('.site-header');
  const hero = document.getElementById('hero');
  if (!header || !hero) return;

  function updateState() {
    const heroRect = hero.getBoundingClientRect();
    const threshold = 40; // pixels avant d'activer l'état solide
    const atTop = heroRect.top <= 0 && heroRect.bottom > threshold;
    if (atTop) {
      header.classList.remove('is-solid');
    } else {
      header.classList.add('is-solid');
    }
  }

  updateState();
  window.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
}

setupNavbarTransparency();

// Rotation des mots dans le hero tagline
function setupRotatingWords() {
  const words = document.querySelectorAll('.rotating-word');
  if (words.length === 0) return;
  
  let currentIndex = 0;
  
  function rotateWord() {
    // Retirer la classe visible du mot actuel
    words[currentIndex].classList.remove('is-visible');
    
    // Passer au mot suivant
    currentIndex = (currentIndex + 1) % words.length;
    
    // Ajouter la classe visible au nouveau mot
    words[currentIndex].classList.add('is-visible');
  }
  
  // Démarrer la rotation toutes les 3 secondes
  setInterval(rotateWord, 3000);
}

setupRotatingWords();

// Animations avancées — Tilt (3D léger) sur cartes .tilt
function setupTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const maxTilt = 10; // degrés
  tiltElements.forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('pointermove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = (-dy * maxTilt).toFixed(2);
      const ry = (dx * maxTilt).toFixed(2);
      el.style.transition = 'transform 100ms ease-out';
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 300ms ease';
      el.style.transform = 'rotateX(0) rotateY(0)';
    });
  });
}

// Parallax doux sur .parallax (suivant la souris)
function setupParallax() {
  const parallax = document.querySelectorAll('.parallax');
  parallax.forEach(container => {
    container.addEventListener('pointermove', e => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      container.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
    });
    container.addEventListener('pointerleave', () => {
      container.style.transform = 'translate3d(0,0,0)';
    });
  });
}

// Compteurs animés (IntersectionObserver)
function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target') || '0');
      const durationMs = 1400;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = Math.round(eased * target);
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.35 });
  counters.forEach(c => obs.observe(c));
}

// Hover spotlight réutilisé pour solution/pillar cards
function setupSpotlightHover() {
  document.querySelectorAll('.solution-card, .pillar-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });
}

setupTiltEffect();
setupParallax();
setupCounters();
setupSpotlightHover();

// === Graphiques boursiers dynamiques ===
async function fetchYahooHistory(symbol, startISO, endISO) {
  const period1 = Math.floor(new Date(startISO).getTime() / 1000);
  const period2 = Math.floor(new Date(endISO).getTime() / 1000);
  const base = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d&events=history&includeAdjustedClose=true`;
  const urls = [
    base,
    // Proxies pour contourner CORS si nécessaire
    `https://cors.isomorphic-git.org/${base}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(base)}`
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const txt = await res.text();
      // Certains proxies renvoient text/plain
      const data = JSON.parse(txt);
      const result = data?.chart?.result?.[0];
      const timestamps = result?.timestamp || [];
      const closes = result?.indicators?.quote?.[0]?.close || [];
      const points = timestamps.map((t, i) => ({ x: t * 1000, y: closes[i] }));
      const filtered = points.filter(p => Number.isFinite(p.y));
      if (filtered.length) return filtered;
    } catch (e) {
      // Essayer l'URL suivante
      console.warn('Yahoo/proxy échec', url, e);
    }
  }
  return null;
}

async function fetchStooqCSV(symbol, startISO) {
  // Stooq format CSV: date,open,high,low,close,volume — tenter avec suffixe .pa
  const s = symbol.toLowerCase();
  const candidates = [s, s.replace('.pa', '') + '.pa'];
  for (const c of candidates) {
    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(c)}&i=d`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const csv = await res.text();
      const lines = csv.trim().split(/\r?\n/);
      if (lines.length < 2) continue;
      const out = [];
      for (let i = 1; i < lines.length; i++) {
        const [date, open, high, low, close] = lines[i].split(',');
        const t = new Date(date).getTime();
        if (!isFinite(t)) continue;
        if (t < new Date(startISO).getTime()) continue;
        const y = Number(close);
        if (Number.isFinite(y)) out.push({ x: t, y });
      }
      if (out.length) return out;
    } catch (e) {
      console.warn('Stooq échec', e);
    }
  }
  return null;
}

function drawLineChart(canvas, points) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.scale(dpr, dpr);
  // Padding
  const pad = 12;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  if (!points || points.length === 0) return;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scaleX = x => pad + ((x - minX) / (maxX - minX || 1)) * plotW;
  const scaleY = y => pad + plotH - ((y - minY) / (maxY - minY || 1)) * plotH;
  // Background gradient subtle
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, 'rgba(232,217,196,0.15)');
  grad.addColorStop(1, 'rgba(232,217,196,0.02)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  // Line path
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#785D32';
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = scaleX(p.x);
    const y = scaleY(p.y);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  // Fill under curve
  ctx.lineTo(scaleX(points[points.length - 1].x), pad + plotH);
  ctx.lineTo(scaleX(points[0].x), pad + plotH);
  ctx.closePath();
  ctx.fillStyle = 'rgba(120, 93, 50, 0.10)';
  ctx.fill();
}

async function setupStockCharts() {
  const cards = document.querySelectorAll('.stock-card');
  if (cards.length === 0) return;
  const onVisible = new IntersectionObserver(async entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const card = entry.target;
      const symbol = card.getAttribute('data-symbol');
      const start = card.getAttribute('data-start');
      const end = card.getAttribute('data-end');
      const canvas = card.querySelector('canvas');
      let points = await fetchYahooHistory(symbol, start, end);
      if (!points || !points.length) points = await fetchStooqCSV(symbol, start);
      if (points && points.length) {
        drawLineChart(canvas, points);
        // Redessiner au resize
        let last = points;
        const onResize = () => drawLineChart(canvas, last);
        window.addEventListener('resize', onResize);
      } else {
        const ctx = canvas.getContext('2d');
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#E8D9C4';
        ctx.fillText('Données indisponibles pour ce symbole.', 8, 24);
      }
      onVisible.unobserve(card);
    }
  }, { threshold: 0.3 });
  cards.forEach(c => onVisible.observe(c));
}

setupStockCharts();
