/* Tiny synchronous pre-paint theme bootstrap. No dependencies, no analytics. */
(() => {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    document.documentElement.dataset.theme = saved === 'dark' || saved === 'light'
      ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch { document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
})();
