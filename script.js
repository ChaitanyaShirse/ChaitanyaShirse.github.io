(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const stored = (() => { try { return localStorage.getItem('nq-theme'); } catch (_) { return null; } })();
  if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;
  function updateTheme() {
    const isLight = root.dataset.theme === 'light';
    icon.textContent = isLight ? '☾' : '☼';
    label.textContent = isLight ? 'Dark mode' : 'Light mode';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    metaTheme.setAttribute('content', isLight ? '#f2f5fb' : '#070b17');
  }
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('nq-theme', root.dataset.theme); } catch (_) {}
    updateTheme();
  });
  updateTheme();
  document.getElementById('year').textContent = new Date().getFullYear();

  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuToggle.textContent = open ? '×' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); menuToggle.textContent = '☰';
  }));

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) card.classList.add('in-view');
    });
  }));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('in-view'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navItems = [...navLinks.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  let scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      backTop.classList.toggle('visible', window.scrollY > 500);
      scheduled = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
})();
