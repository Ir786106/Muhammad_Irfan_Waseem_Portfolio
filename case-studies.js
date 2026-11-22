/* Lightweight theme controller for static case-study pages (no framework or WebGL). */
const root = document.documentElement;
const button = document.getElementById('case-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
let stored;
try { stored = localStorage.getItem('portfolio-theme'); } catch { stored = null; }
const setTheme = (theme) => {
  root.dataset.theme = theme;
  button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
};
setTheme(stored === 'light' || stored === 'dark' ? stored : (prefersDark.matches ? 'dark' : 'light'));
button.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try { localStorage.setItem('portfolio-theme',next); } catch { /* preference is optional */ }
});
prefersDark.addEventListener('change', event => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch { /* continue */ }
  setTheme(event.matches ? 'dark' : 'light');
});
