import './modules/profile.js';
import { initProjects } from './modules/project-ui.js';
initProjects();
import './modules/contact.js';
const reviewModule = () => import('./modules/firebase.js');
new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    reviewModule().then(module => module.loadReviews()).catch(() => {});
}, {rootMargin:'300px'}).observe(document.getElementById('contact'));
document.querySelectorAll('[data-review-open]').forEach(btn => btn.addEventListener('click', () => {
    document.getElementById('modal-feedback').showModal();
    reviewModule().then(module => module.enableReviewForm()).catch(() => {
        document.getElementById('review-status').textContent = 'Reviews are temporarily unavailable.';
    });
}));
let themeManagerBound = false;
function initThemeManager() {
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

    function getSavedTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        const isDark = theme === 'dark';
        if (themeBtn) {
            themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            themeBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
    }

    const saved = getSavedTheme();
    if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
    } else {
        applyTheme(systemMedia.matches ? 'dark' : 'light');
    }

    
    systemMedia.addEventListener('change', (e) => {
        if (!getSavedTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeBtn && !themeManagerBound) {
        themeManagerBound = true;
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('portfolio-theme', next);
            applyTheme(next);

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(themeBtn,
                    { scale: 0.8, rotate: -45 },
                    { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }
                );
            }
        });
    }
}
initThemeManager();

function initActiveNav() {
    const links    = document.querySelectorAll('.nav-link, .m-link');
    const sections = document.querySelectorAll('section[id]');

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => {
                    const match = l.getAttribute('href') === `#${e.target.id}`;
                    l.classList.toggle('active-link', match);
                });
            }
        });
    }, { rootMargin: '-40% 0px -52% 0px' });

    sections.forEach(s => io.observe(s));
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER CONTROLLER
   ========================================================================== */
const hamburger       = document.getElementById('hamburger');
const mobileMenu      = document.getElementById('mobileMenu');
const mobileBackdrop  = document.getElementById('mobileBackdrop');
const mobileMenuClose = document.getElementById('mobileMenuClose');
let lastFocusedElement = null;

function openMobileDrawer() {
    if (!mobileMenu) return;
    lastFocusedElement = document.activeElement;
    
    mobileMenu.classList.add('open');
    mobileMenu.inert = false;
    mobileMenu.setAttribute('aria-hidden', 'false');
    
    if (mobileBackdrop) {
        mobileBackdrop.classList.add('open');
        mobileBackdrop.setAttribute('aria-hidden', 'false');
    }
    
    if (hamburger) {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
    }
    
    document.body.style.overflow = 'hidden';
    
    if (mobileMenuClose) {
        setTimeout(() => mobileMenuClose.focus(), 80);
    }
}

function closeMobileDrawer() {
    if (!mobileMenu) return;
    
    mobileMenu.classList.remove('open');
    mobileMenu.inert = true;
    mobileMenu.setAttribute('aria-hidden', 'true');
    
    if (mobileBackdrop) {
        mobileBackdrop.classList.remove('open');
        mobileBackdrop.setAttribute('aria-hidden', 'true');
    }
    
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    document.body.style.overflow = '';
    
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    } else if (hamburger) {
        hamburger.focus();
    }
}

if (hamburger && mobileMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobileMenu');
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            closeMobileDrawer();
        } else {
            openMobileDrawer();
        }
    });

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileDrawer();
        });
    }

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => {
            closeMobileDrawer();
        });
    }

    document.querySelectorAll('.m-link, .mobile-cta-btn, .mobile-drawer-logo').forEach(l => {
        l.addEventListener('click', () => {
            closeMobileDrawer();
        });
    });

    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMobileDrawer();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileDrawer();
        }
    });

    // Keyboard focus trap inside mobile drawer
    mobileMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusable = mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && mobileMenu.classList.contains('open')) {
            closeMobileDrawer();
        }
    }, { passive: true });
}

document.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(`tab-${btn.dataset.tab}`);
        if (panel) panel.classList.add('active');
    });
});


initActiveNav();
const lightbox = document.getElementById('lightbox');
for (const trigger of document.querySelectorAll('.gal-item')) {
    trigger.addEventListener('click', () => {
        const image = trigger.querySelector('img');
        Object.assign(document.getElementById('lb-img'), {src:image.src, alt:image.alt, width:image.width, height:image.height});
        document.getElementById('lb-title').textContent = image.alt;
        lightbox.showModal();
    });
}
for (const popup of [lightbox, document.getElementById('modal-feedback')]) {
    popup.querySelector('button').addEventListener('click', () => popup.close());
    popup.addEventListener('click', event => { if (event.target === popup) popup.close(); });
}

const showcase = document.getElementById('showcase');
const motion = matchMedia('(min-width:768px) and (prefers-reduced-motion:no-preference)');
if (motion.matches) {
    new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting || !motion.matches) return;
        observer.disconnect();
        const library = document.createElement('script');
        library.src = 'vendor/three/three.min.js';
        library.onload = async () => {
            try {
                const module = await import('./modules/three-showcase.js');
                showcase.classList.add('orbit-ready');
                module.init3D();
            } catch { showcase.classList.remove('orbit-ready'); }
        };
        document.head.append(library);
    }, {rootMargin:'240px'}).observe(showcase);
}
