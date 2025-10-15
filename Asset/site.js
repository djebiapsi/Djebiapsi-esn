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


