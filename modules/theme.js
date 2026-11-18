const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const preference = matchMedia('(prefers-color-scheme: dark)');
function savedTheme() {
    try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
}
function apply(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
function applyPreference() {
    apply(savedTheme() || (preference.matches ? 'dark' : 'light'));
}
applyPreference();
preference.addEventListener('change', applyPreference);
toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
