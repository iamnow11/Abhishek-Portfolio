// --- Theme Switcher ---

const lightThemeButton = document.getElementById('theme-toggle-light');
const darkThemeButton = document.getElementById('theme-toggle-dark');

function applyTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  highlightActiveThemeButton(theme);
}

function highlightActiveThemeButton(theme: string): void {
  lightThemeButton?.classList.toggle('active', theme === 'light');
  darkThemeButton?.classList.toggle('active', theme === 'dark');
}

lightThemeButton?.addEventListener('click', () => applyTheme('light'));
darkThemeButton?.addEventListener('click', () => applyTheme('dark'));

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
highlightActiveThemeButton(savedTheme);

// --- Active Nav Link Tracking ---

const pageSections = document.querySelectorAll('section[id]');
const navigationLinks = document.querySelectorAll('#site-nav .nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navigationLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`#site-nav .nav-link[href="#${entry.target.id}"]`);
      activeLink?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -60% 0px' });

pageSections.forEach(section => sectionObserver.observe(section));

// --- Smooth Scroll ---

document.querySelectorAll('#site-nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    const targetSection = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!);
    targetSection?.scrollIntoView({ behavior: 'smooth' });
  });
});

// --- Auto-Hide Nav on Scroll ---

const SCROLL_DELTA_THRESHOLD = 5;
const NAV_VISIBLE_ZONE = 80;

let previousScrollY = window.scrollY;
let isScrollHandlerScheduled = false;
const navElement = document.getElementById('site-nav');

// Clear entrance animation so CSS transitions can take over
navElement?.addEventListener('animationend', () => {
  navElement.style.animation = 'none';
}, { once: true });

function updateNavVisibility(): void {
  const currentScrollY = window.scrollY;

  if (currentScrollY > NAV_VISIBLE_ZONE) {
    if (currentScrollY - previousScrollY > SCROLL_DELTA_THRESHOLD) {
      navElement?.classList.add('nav-hidden');
    } else if (previousScrollY - currentScrollY > SCROLL_DELTA_THRESHOLD) {
      navElement?.classList.remove('nav-hidden');
    }
  } else {
    navElement?.classList.remove('nav-hidden');
  }

  previousScrollY = currentScrollY;
  isScrollHandlerScheduled = false;
}

window.addEventListener('scroll', () => {
  if (!isScrollHandlerScheduled) {
    requestAnimationFrame(updateNavVisibility);
    isScrollHandlerScheduled = true;
  }
}, { passive: true });
