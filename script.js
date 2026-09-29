

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs,
    query, orderBy, limit, where, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
    getAuth, signInWithPopup, GoogleAuthProvider,
    onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey:            "AIzaSyAJsGuQRpzpfWHszomeg0q_dtUZkeBh0Go",
    authDomain:        "irfan-portfolio-ae62a.firebaseapp.com",
    projectId:         "irfan-portfolio-ae62a",
    storageBucket:     "irfan-portfolio-ae62a.firebasestorage.app",
    messagingSenderId: "220875740206",
    appId:             "1:220875740206:web:4dc00c10fa86784b063bbf",
    measurementId:     "G-FX3Q38PZT6"
};
const FORMSPREE = "https://formspree.io/f/xnnevkrd";

let db, auth;
let currentUser = null;

try {
    const app = initializeApp(firebaseConfig);
    db   = getFirestore(app);
    auth = getAuth(app);
    getAnalytics(app);
    console.log("✅ Firebase connected");
} catch (e) {
    console.warn("⚠️ Firebase failed:", e);
}

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) progressBar.style.transform = `scaleX(${scrolled})`;
}, { passive: true });

function hidePreloader() {
    const pre = document.getElementById('preloader');
    afterLoad();
    if (!pre) return;
    if (typeof gsap !== 'undefined') {
        gsap.to(pre, {
            opacity: 0, duration: 0.35,
            onComplete: () => {
                pre.style.display = 'none';
            }
        });
    } else {
        pre.style.display = 'none';
    }
}

window.addEventListener('load', hidePreloader);

function afterLoad() {
    initThemeManager();
    initAmbientBackground();
    initBackgroundCanvas();
    initTyped();
    initAOS();
    initAnimations();
    initActiveNav();
    fetchTestimonials();
    setTimeout(init3D, 350);
}

function initTyped() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const phrases = [
        'Intelligent Solutions.',
        'Flutter Apps.',
        'MERN Platforms.',
        'AI Integrations.',
        'Real Products.',
        'ERP Systems.',
    ];

    let pIdx = 0, cIdx = 0, deleting = false;

    function tick() {
        const current = phrases[pIdx];

        if (deleting) {
            el.textContent = current.substring(0, cIdx - 1);
            cIdx--;
        } else {
            el.textContent = current.substring(0, cIdx + 1);
            cIdx++;
        }

        let speed = deleting ? 50 : 80;

        if (!deleting && cIdx === current.length) {
            speed = 1800;
            deleting = true;
        } else if (deleting && cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 300;
        }

        setTimeout(tick, speed);
    }
    tick();
}

function initAOS() {
    const els = document.querySelectorAll('[data-aos]');
    if (!els.length) return;

    
    els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
            const delay = parseInt(el.dataset.aosDelay || 0);
            setTimeout(() => el.classList.add('aos-animate'), delay + 100);
        }
    });

    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.aosDelay || 0);
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    els.forEach(el => {
        if (!el.classList.contains('aos-animate')) {
            observer.observe(el);
        }
    });
}

function initAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    
    gsap.set([
        '.hero-chips', '.hero-title', '.hero-sub',
        '.hero-btns', '.hero-socials', '.stack-pills',
        '.profile-card-3d', '.fl-chip', '.hero-content', '.hero-visual'
    ], { opacity: 1, y: 0, x: 0, scale: 1, visibility: 'visible', clearProps: 'transform' });

    
    if (window.innerWidth > 900) {
        gsap.timeline({ delay: 0.1 })
            .from('.hero-chips',      { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 })
            .from('.hero-title',      { opacity: 0, y: 35, duration: 0.8, ease: 'power3.out' }, '-=0.2')
            .from('.hero-sub',        { opacity: 0, y: 18, duration: 0.6 }, '-=0.4')
            .from('.hero-btns',       { opacity: 0, y: 14, duration: 0.5 }, '-=0.3')
            .from('.hero-socials',    { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
            .from('.stack-pills',     { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
            .from('.profile-card-3d', { opacity: 0, scale: 0.88, duration: 1, ease: 'elastic.out(1,0.5)' }, '-=0.9')
            .from('.fl-chip',         { opacity: 0, scale: 0, stagger: 0.12, duration: 0.4, ease: 'back.out(2)' }, '-=0.5');
    }
}
    
    if (window.innerWidth > 600) {
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.from(el, {
                opacity: 0, x: -25, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });
    }

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

function initAmbientBackground() {
    const glowWrap = document.querySelector('.ambient-glows');
    if (!glowWrap) return;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetX = (e.clientX - cx) * 0.025;
        targetY = (e.clientY - cy) * 0.025;

        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                currentX += (targetX - currentX) * 0.08;
                currentY += (targetY - currentY) * 0.08;
                glowWrap.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
                ticking = false;
            });
        }
    }, { passive: true });
}

/* ==========================================================================
   THEME-AWARE DYNAMIC BACKGROUND CANVAS
   - Dark Mode: Tech/Cybersecurity Constellation & Neural Node Matrix
   - Light Mode: Harmonic Architectural Waves & Floating Pastel Bokeh
   - Performance: 40 FPS cap, Visibility API pause, reduced-motion, mobile scaling
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let animId = null;
    let isRunning = false;
    let lastTime = 0;
    const TARGET_FPS = 40;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    // Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Theme blend tracking: 0 = Dark, 1 = Light
    function isCurrentDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    let themeBlend = isCurrentDark() ? 0 : 1;
    let targetThemeBlend = themeBlend;

    // Responsive setup with capped DPR
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        initEntities();
    }

    // Passive interactive cursor tracking
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
    });

    // 1. Dark Mode: Cybersecurity Neural Nodes & Connecting Links
    let darkNodes = [];
    const DARK_PALETTE = ['#6366f1', '#06b6d4', '#818cf8', '#a855f7', '#10b981'];

    // 2. Light Mode: Floating Soft Pastel Bokeh Discs
    let lightBokeh = [];
    const LIGHT_PALETTE = [
        'rgba(56, 189, 248, 0.16)', // sky azure
        'rgba(129, 140, 248, 0.15)', // soft lavender
        'rgba(251, 146, 60, 0.12)',  // gentle peach
        'rgba(52, 211, 153, 0.14)'   // mint emerald
    ];

    function initEntities() {
        const isMobile = width < 768;

        // Dark mode nodes
        const darkCount = isMobile ? 22 : 46;
        darkNodes = [];
        for (let i = 0; i < darkCount; i++) {
            darkNodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 1.8 + 1.2,
                color: DARK_PALETTE[Math.floor(Math.random() * DARK_PALETTE.length)],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.025
            });
        }

        // Light mode bokeh
        const lightCount = isMobile ? 8 : 16;
        lightBokeh = [];
        for (let i = 0; i < lightCount; i++) {
            lightBokeh.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: -(0.18 + Math.random() * 0.28),
                radius: Math.random() * 30 + 18,
                color: LIGHT_PALETTE[Math.floor(Math.random() * LIGHT_PALETTE.length)],
                sway: Math.random() * Math.PI * 2,
                swaySpeed: 0.015 + Math.random() * 0.015
            });
        }
    }

    // Render Dark Mode Cybersecurity Constellation
    function renderDarkMode(alpha, time) {
        if (alpha <= 0.005) return;
        ctx.save();
        ctx.globalAlpha = alpha;

        const connectDist = width < 768 ? 90 : 125;
        const connectDistSq = connectDist * connectDist;

        // Draw connecting cyber wires
        ctx.lineWidth = 1;
        for (let i = 0; i < darkNodes.length; i++) {
            for (let j = i + 1; j < darkNodes.length; j++) {
                const dx = darkNodes[i].x - darkNodes[j].x;
                const dy = darkNodes[i].y - darkNodes[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < connectDistSq) {
                    const dist = Math.sqrt(distSq);
                    const lineAlpha = (1 - dist / connectDist) * 0.22 * alpha;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha.toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(darkNodes[i].x, darkNodes[i].y);
                    ctx.lineTo(darkNodes[j].x, darkNodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes with cyber glow
        for (let i = 0; i < darkNodes.length; i++) {
            const node = darkNodes[i];

            // Smooth position update
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Interactive mouse repulsion
            const mdx = node.x - mouse.x;
            const mdy = node.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 120 && mDist > 0) {
                const force = (1 - mDist / 120) * 1.5;
                node.x += (mdx / mDist) * force;
                node.y += (mdy / mDist) * force;
            }

            node.pulse += node.pulseSpeed;
            const currentR = node.radius + Math.sin(node.pulse) * 0.6;

            ctx.beginPath();
            ctx.arc(node.x, node.y, Math.max(0.5, currentR), 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.shadowColor = node.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    // Render Light Mode Harmonic Wave Contours & Pastel Bokeh
    function renderLightMode(alpha, time) {
        if (alpha <= 0.005) return;
        ctx.save();
        ctx.globalAlpha = alpha;

        // 1. Soft layered architectural sine ribbon waves
        const waves = [
            { yBase: height * 0.48, amp: 24, freq: 0.0028, speed: 0.0006, color: 'rgba(56, 189, 248, 0.11)', width: 1.5 },
            { yBase: height * 0.66, amp: 30, freq: 0.0022, speed: -0.0005, color: 'rgba(129, 140, 248, 0.09)', width: 2 },
            { yBase: height * 0.82, amp: 20, freq: 0.0035, speed: 0.0008, color: 'rgba(251, 146, 60, 0.07)', width: 1.5 }
        ];

        waves.forEach(w => {
            ctx.strokeStyle = w.color;
            ctx.lineWidth = w.width;
            ctx.beginPath();

            const step = width < 768 ? 16 : 8;
            for (let x = 0; x <= width + step; x += step) {
                const y = w.yBase + Math.sin(x * w.freq + time * w.speed) * w.amp
                                + Math.cos(x * w.freq * 0.6 + time * w.speed * 0.7) * (w.amp * 0.4);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // 2. Floating soft pastel bokeh discs
        for (let i = 0; i < lightBokeh.length; i++) {
            const b = lightBokeh[i];
            b.y += b.vy;
            b.sway += b.swaySpeed;
            b.x += Math.sin(b.sway) * 0.35;

            // Recycle when floated off the top
            if (b.y < -b.radius * 2) {
                b.y = height + b.radius;
                b.x = Math.random() * width;
            }

            // Radial soft gradient
            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
            grad.addColorStop(0, b.color);
            grad.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        ctx.restore();
    }

    // Main animation step with 40 FPS cap
    function frame(now) {
        if (!isRunning) return;

        const delta = now - lastTime;
        if (delta >= FRAME_INTERVAL) {
            lastTime = now - (delta % FRAME_INTERVAL);

            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            // Theme smooth interpolation (blend between 0=Dark and 1=Light)
            targetThemeBlend = isCurrentDark() ? 0 : 1;
            themeBlend += (targetThemeBlend - themeBlend) * 0.08;

            ctx.clearRect(0, 0, width, height);

            // Render both modes with complementary cross-fade opacities
            renderDarkMode(1 - themeBlend, now);
            renderLightMode(themeBlend, now);
        }

        animId = requestAnimationFrame(frame);
    }

    function startLoop() {
        if (!isRunning && !prefersReducedMotion.matches) {
            isRunning = true;
            lastTime = performance.now();
            animId = requestAnimationFrame(frame);
        }
    }

    function stopLoop() {
        if (isRunning) {
            isRunning = false;
            if (animId) cancelAnimationFrame(animId);
        }
    }

    // Page Visibility API - pause completely when tab inactive
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopLoop();
        else startLoop();
    });

    // Handle Resize with debounce
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            if (prefersReducedMotion.matches) {
                renderStaticSnapshot();
            }
        }, 150);
    }, { passive: true });

    // Accessibility: static snapshot when prefers-reduced-motion is active
    function renderStaticSnapshot() {
        stopLoop();
        ctx.clearRect(0, 0, width, height);
        targetThemeBlend = isCurrentDark() ? 0 : 1;
        themeBlend = targetThemeBlend;
        renderDarkMode(1 - themeBlend, 0);
        renderLightMode(themeBlend, 0);
    }

    // Theme toggle observer: smooth transition trigger
    const themeObserver = new MutationObserver(() => {
        targetThemeBlend = isCurrentDark() ? 0 : 1;
        if (prefersReducedMotion.matches) {
            renderStaticSnapshot();
        }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Initialize
    resize();
    if (prefersReducedMotion.matches) {
        renderStaticSnapshot();
    } else {
        startLoop();
    }
}

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const navScrollStyle = document.createElement('style');
navScrollStyle.textContent = `
.navbar.scrolled{
  height:62px;
  background:rgba(3,7,17,.97)!important;
  box-shadow:0 4px 30px rgba(0,0,0,.4);
}
[data-theme="light"] .navbar.scrolled{background:rgba(240,244,255,.98)!important}
`;
document.head.appendChild(navScrollStyle);

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

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;

        document.querySelectorAll('.proj-card').forEach(card => {
            const show = f === 'all' || card.dataset.category === f || (card.dataset.category && card.dataset.category.split(' ').includes(f));
            if (show) {
                card.style.display = 'flex';
                if (typeof gsap !== 'undefined')
                    gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
            } else {
                card.style.display = 'none';
            }
        });
    });
});

window.openModal = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => m.classList.add('active'));
};

window.closeModal = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('active');
    setTimeout(() => { m.style.display = 'none'; document.body.style.overflow = ''; }, 320);
};

document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => {
        if (e.target === m) window.closeModal(m.id);
    });
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const m = btn.closest('.modal-overlay');
        if (m) window.closeModal(m.id);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => window.closeModal(m.id));
        closeLightboxInternal();
    }
});

window.openLightbox = (el) => {
    let src = '';
    if (typeof el === 'string') {
        src = el;
    } else if (el) {
        const img = el.querySelector ? el.querySelector('img') : null;
        src = img ? img.src : (el.src || el.getAttribute('href') || '');
    }
    if (!src) return;
    document.getElementById('lb-img').src = src;
    const lb = document.getElementById('lightbox');
    lb.style.display = 'flex';
    requestAnimationFrame(() => lb.classList.add('active'));
    document.body.style.overflow = 'hidden';
};

function closeLightboxInternal() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    setTimeout(() => { lb.style.display = 'none'; document.body.style.overflow = ''; }, 300);
}
window.closeLightbox = closeLightboxInternal;

const authLoading    = document.getElementById('auth-loading');
const authSection    = document.getElementById('auth-section');
const feedbackFormEl = document.getElementById('feedbackForm');
const loginBtn       = document.getElementById('google-login-btn');
const logoutBtn      = document.getElementById('logout-btn');

if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (authLoading) authLoading.style.display = 'none';
        if (user) { currentUser = user; showFeedbackUI(user); }
        else       { currentUser = null; showLoginUI(); }
    });
}

function showFeedbackUI(user) {
    if (authSection)    authSection.style.display    = 'none';
    if (feedbackFormEl) feedbackFormEl.style.display = 'block';
    const nameEl = document.getElementById('user-name-display');
    const imgEl  = document.getElementById('user-avatar');
    if (nameEl) nameEl.innerText = user.displayName;
    if (imgEl)  imgEl.src        = user.photoURL || '';
}

function showLoginUI() {
    if (feedbackFormEl) feedbackFormEl.style.display = 'none';
    if (authSection)    authSection.style.display    = 'block';
}

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            showToast('Welcome! 👋', 'success');
        } catch (err) {
            console.error(err);
            showToast('Login failed. Please try again.', 'error');
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () =>
        signOut(auth).then(() => showToast('Logged out.', 'success'))
    );
}

const starBtns    = document.querySelectorAll('.star-btn');
const ratingInput = document.getElementById('feedback-rating');

starBtns.forEach(star => {
    star.addEventListener('click', () => {
        const val = parseInt(star.dataset.value);
        if (ratingInput) ratingInput.value = val;
        starBtns.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= val));
    });
    star.addEventListener('mouseover', () => {
        const val = parseInt(star.dataset.value);
        starBtns.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= val));
    });
});
document.querySelector('.star-row')?.addEventListener('mouseleave', () => {
    const current = parseInt(ratingInput?.value || 5);
    starBtns.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= current));
});

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) { showToast('Please sign in first.', 'error'); return; }

        const btn  = e.target.querySelector('button[type="submit"]');
        const orig = btn.innerText;
        btn.innerText = 'Processing...'; btn.disabled = true;

        try {
            const q    = query(collection(db, 'testimonials'),
                               where('uid', '==', currentUser.uid),
                               orderBy('date', 'desc'), limit(1));
            const snap = await getDocs(q);
            let shouldUpdate = false, updateId = null;

            if (!snap.empty) {
                const last = snap.docs[0].data();
                if (last.date) {
                    const diffH = (new Date() - last.date.toDate()) / 3600000;
                    if (diffH < 24 && confirm('Update your existing review from the last 24 hours?')) {
                        shouldUpdate = true;
                        updateId = snap.docs[0].id;
                    }
                }
            }

            const msg    = document.getElementById('feedback-message').value;
            const rating = parseInt(ratingInput?.value || 5);

            if (shouldUpdate && updateId) {
                await updateDoc(doc(db, 'testimonials', updateId), { message: msg, rating, date: new Date() });
                showToast('Review updated! ✅', 'success');
            } else {
                await addDoc(collection(db, 'testimonials'), {
                    uid:   currentUser.uid,
                    name:  currentUser.displayName,
                    photo: currentUser.photoURL,
                    message: msg, rating, date: new Date()
                });
                showToast('Review submitted! Thank you 🎉', 'success');
            }

            e.target.reset();
            ratingInput.value = 5;
            starBtns.forEach((s, i) => s.classList.toggle('active', i === 4));
            window.closeModal('modal-feedback');
            fetchTestimonials();
        } catch (err) {
            console.error(err);
            showToast('Error submitting review.', 'error');
        } finally {
            btn.innerText = orig; btn.disabled = false;
        }
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn  = e.target.querySelector('button[type="submit"]');
        const orig = btn.innerText;
        btn.innerText = 'Sending...'; btn.disabled = true;

        const name    = document.getElementById('name').value;
        const email   = document.getElementById('email').value;
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message').value;

        try {
            if (db) {
                addDoc(collection(db, 'contacts'), {
                    name, email, subject, message, date: new Date()
                });
            }

            const res = await fetch(FORMSPREE, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, subject, message })
            });

            if (res.ok) {
                showToast("Message sent! I'll get back to you soon 📩", 'success');
                e.target.reset();
            } else {
                showToast('Could not send. Email me directly.', 'error');
            }
        } catch {
            showToast('Something went wrong. Try again.', 'error');
        } finally {
            btn.innerText = orig; btn.disabled = false;
        }
    });
}

async function fetchTestimonials() {
    const container = document.getElementById('testimonial-container');
    if (!db || !container) return;

    try {
        const q    = query(collection(db, 'testimonials'), orderBy('date', 'desc'), limit(6));
        const snap = await getDocs(q);

        if (snap.empty) {
            container.innerHTML = `
                <div class="review-card glass" style="grid-column:1/-1;text-align:center;padding:50px 20px">
                    <p style="color:var(--muted);font-size:1.1rem">
                        No reviews yet. Be the first! ⭐
                    </p>
                </div>`;
            return;
        }

        container.innerHTML = '';
        snap.forEach(d => {
            const data = d.data();
            const filled = '★'.repeat(data.rating || 5);
            const empty  = '☆'.repeat(5 - (data.rating || 5));
            container.innerHTML += `
                <div class="review-card glass">
                    <div class="stars">${filled}${empty}</div>
                    <p>"${data.message}"</p>
                    <h5>${data.name}</h5>
                </div>`;
        });
    } catch (err) {
        console.error('Testimonials error:', err);
    }
}

function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className        = `toast-notification ${type}`;
    t.innerText        = msg;
    t.style.background = type === 'success' ? '#10b981' : '#ef4444';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

function init3D() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || typeof THREE === 'undefined') {
        console.warn('Three.js or canvas not available');
        return;
    }

    const W = canvas.offsetWidth  || 900;
    const H = canvas.offsetHeight || 540;

    
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 1000);
    camera.position.set(0, 0, 10.5);

    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));

    const lights = [
        { color: 0x6366f1, pos: [7,  6,  6],  int: 5 },
        { color: 0x06b6d4, pos: [-7, -4, -5], int: 5 },
        { color: 0xa855f7, pos: [0,  -7,  5], int: 3 },
        { color: 0x10b981, pos: [-4,  6, -3], int: 2 },
    ];
    lights.forEach(({ color, pos, int }) => {
        const pl = new THREE.PointLight(color, int, 35);
        pl.position.set(...pos);
        scene.add(pl);
    });

    
    const PROJECTS = [
        { title: 'InterviewMate AI',  sub: 'MERN · FastAPI · Gemini',     icon: '🤖', color: '#6366f1', id: 'm-interviewmate' },
        { title: 'Food Fight',        sub: 'Flutter · Firebase · Maps',    icon: '🍔', color: '#ef4444', id: 'm-foodfight'      },
        { title: 'TarseelX',          sub: 'React Native · Firebase',      icon: '🚚', color: '#f59e0b', id: 'm-tarseelx'      },
        { title: 'Mandi Pro ERP',     sub: 'Flutter · Dart · Firebase',    icon: '📊', color: '#3b82f6', id: 'm-mandi'         },
        { title: 'Itthad Food App',   sub: 'Flutter · Supabase',           icon: '🏭', color: '#10b981', id: 'm-itthad'        },
        { title: 'Saqib Shop POS',    sub: 'Flutter · Dart',               icon: '🛒', color: '#8b5cf6', id: 'm-saqib'         },
        { title: 'Hotel System',      sub: 'Java · Swing · MySQL',         icon: '🏨', color: '#06b6d4', id: 'm-hotel'         },
        { title: 'Quiz Game',         sub: 'HTML · CSS · JavaScript',      icon: '🎮', color: '#ef4444', id: 'm-quiz'          },
        { title: 'Python Logic',      sub: 'Python · Algorithms',          icon: '🐍', color: '#3776AB', id: 'm-python'        },
        { title: 'Portfolio Site',    sub: 'HTML · Three.js · GSAP',       icon: '🌐', color: '#f59e0b', id: 'modal-feedback'  },
    ];

    
    function rr(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y,     x + w, y + r,     r);
        ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h); ctx.arcTo(x,     y + h, x,     y + h - r, r);
        ctx.lineTo(x, y + r);     ctx.arcTo(x,     y,     x + r, y,         r);
        ctx.closePath();
    }

    
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    function buildTexture(proj) {
        const tc   = document.createElement('canvas');
        tc.width   = 560;
        tc.height  = 340;
        const ctx  = tc.getContext('2d');
        const dark = isDark();

        
        ctx.fillStyle = dark ? '#0c1628' : '#ffffff';
        rr(ctx, 0, 0, 560, 340, 24);
        ctx.fill();

        
        const grad = ctx.createLinearGradient(0, 0, 560, 340);
        grad.addColorStop(0, proj.color + (dark ? '22' : '14'));
        grad.addColorStop(1, 'transparent');
        rr(ctx, 0, 0, 560, 340, 24);
        ctx.fillStyle = grad;
        ctx.fill();

        
        const barGrad = ctx.createLinearGradient(0, 0, 560, 0);
        barGrad.addColorStop(0, proj.color);
        barGrad.addColorStop(1, proj.color + '80');
        ctx.fillStyle = barGrad;
        ctx.fillRect(0, 0, 560, 5);

        
        ctx.strokeStyle = proj.color + '55';
        ctx.lineWidth   = 1.5;
        rr(ctx, 1, 1, 558, 338, 23);
        ctx.stroke();

        
        const corners = [[24, 24], [536, 24], [24, 316], [536, 316]];
        corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = proj.color + '60';
            ctx.fill();
        });

        
        ctx.beginPath();
        ctx.arc(280, 100, 44, 0, Math.PI * 2);
        ctx.fillStyle = proj.color + (dark ? '30' : '18');
        ctx.fill();
        ctx.strokeStyle = proj.color + '40';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        
        ctx.font      = '52px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(proj.icon, 280, 100);

        
        ctx.fillStyle    = dark ? '#f1f5f9' : '#0f172a';
        ctx.font         = 'bold 30px "Space Grotesk", Arial, sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(proj.title, 280, 182);

        
        ctx.fillStyle = dark ? '#94a3b8' : '#64748b';
        ctx.font      = '18px "Outfit", Arial, sans-serif';
        ctx.fillText(proj.sub, 280, 214);

        
        ctx.strokeStyle = proj.color + '30';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(100, 238); ctx.lineTo(460, 238);
        ctx.stroke();

        
        ctx.fillStyle = proj.color + '25';
        rr(ctx, 170, 256, 220, 46, 23);
        ctx.fill();
        ctx.strokeStyle = proj.color + '55';
        ctx.lineWidth   = 1.2;
        rr(ctx, 170, 256, 220, 46, 23);
        ctx.stroke();

        ctx.fillStyle = proj.color;
        ctx.font      = 'bold 18px "Outfit", Arial, sans-serif';
        ctx.fillText('View Details →', 280, 284);

        return new THREE.CanvasTexture(tc);
    }

    
    const ORBIT_R  = 5.5;
    const CARD_W   = 3.6;
    const CARD_H   = 2.2;
    const cards    = [];

    PROJECTS.forEach((proj, i) => {
        const angle   = (i / PROJECTS.length) * Math.PI * 2;
        const texture = buildTexture(proj);

        const geo  = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
        const mat  = new THREE.MeshStandardMaterial({
            map:         texture,
            transparent: true,
            opacity:     0.96,
            side:        THREE.DoubleSide,
            roughness:   0.4,
            metalness:   0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
            Math.cos(angle) * ORBIT_R,
            Math.sin(angle * 0.7) * 0.5,
            Math.sin(angle) * ORBIT_R
        );
        mesh.lookAt(0, 0, 0);
        mesh.rotateY(Math.PI);

        scene.add(mesh);
        cards.push({ mesh, mat, angle, proj, texture });
    });

    
    const ringGeo = new THREE.TorusGeometry(ORBIT_R, 0.018, 8, 90);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.1 });
    const ring1   = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(ORBIT_R, 0.008, 8, 90),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.07 })
    );
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    
    const pGeo = new THREE.BufferGeometry();
    const pCount = 320;
    const pPos  = new Float32Array(pCount * 3);
    const pCol  = new Float32Array(pCount * 3);
    const palette = [[0.39,0.40,0.95],[0.02,0.71,0.83],[0.66,0.33,0.97],[0.06,0.73,0.51]];

    for (let i = 0; i < pCount; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 36;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 36;
        const c = palette[Math.floor(Math.random() * palette.length)];
        pCol[i * 3]     = c[0];
        pCol[i * 3 + 1] = c[1];
        pCol[i * 3 + 2] = c[2];
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));

    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.07, vertexColors: true, transparent: true, opacity: 0.6
    }));
    scene.add(particles);

    
    const raycaster = new THREE.Raycaster();
    const mouse2d   = new THREE.Vector2();
    let hoveredIdx  = -1;

    function toNDC(e) {
        const r   = canvas.getBoundingClientRect();
        mouse2d.x = ((e.clientX - r.left) / r.width)  * 2 - 1;
        mouse2d.y = -((e.clientY - r.top) / r.height)  * 2 + 1;
    }

    canvas.addEventListener('mousemove', (e) => {
        toNDC(e);
        raycaster.setFromCamera(mouse2d, camera);
        const hits = raycaster.intersectObjects(cards.map(c => c.mesh));

        if (hits.length > 0) {
            const idx = cards.findIndex(c => c.mesh === hits[0].object);
            if (idx !== hoveredIdx) {
                if (hoveredIdx >= 0) gsap.to(cards[hoveredIdx].mesh.scale, { x:1, y:1, z:1, duration:.3 });
                hoveredIdx = idx;
                gsap.to(cards[idx].mesh.scale, { x:1.08, y:1.08, z:1.08, duration:.3 });
            }
            canvas.style.cursor = 'pointer';
        } else {
            if (hoveredIdx >= 0) {
                gsap.to(cards[hoveredIdx].mesh.scale, { x:1, y:1, z:1, duration:.3 });
                hoveredIdx = -1;
            }
            canvas.style.cursor = 'grab';
        }
    });

    canvas.addEventListener('click', (e) => {
        toNDC(e);
        raycaster.setFromCamera(mouse2d, camera);
        const hits = raycaster.intersectObjects(cards.map(c => c.mesh));
        if (hits.length > 0) {
            const idx = cards.findIndex(c => c.mesh === hits[0].object);
            if (idx >= 0) {
                window.openModal(cards[idx].proj.id);
                if (typeof gsap !== 'undefined')
                    gsap.to(cards[idx].mesh.scale, { x:1.15, y:1.15, z:1.15, duration:.15,
                        yoyo:true, repeat:1 });
            }
        }
    });

    
    let targetRX = 0, targetRY = 0;
    const sec = document.getElementById('showcase');
    if (sec) {
        sec.addEventListener('mousemove', (e) => {
            const r   = canvas.getBoundingClientRect();
            targetRY  = ((e.clientX - r.left) / r.width  - 0.5) * 0.5;
            targetRX  = -((e.clientY - r.top)  / r.height - 0.5) * 0.3;
        });
        sec.addEventListener('mouseleave', () => { targetRX = 0; targetRY = 0; });
    }

    
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const r     = canvas.getBoundingClientRect();
        mouse2d.x   = ((touch.clientX - r.left) / r.width)  * 2 - 1;
        mouse2d.y   = -((touch.clientY - r.top)  / r.height) * 2 + 1;
        raycaster.setFromCamera(mouse2d, camera);
        const hits = raycaster.intersectObjects(cards.map(c => c.mesh));
        if (hits.length > 0) {
            const idx = cards.findIndex(c => c.mesh === hits[0].object);
            if (idx >= 0) window.openModal(cards[idx].proj.id);
        }
    }, { passive: true });

    
    let autoAngle = 0;
    let paused    = false;

    
    let isVisible = false;
    const io = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(canvas);

    const ob = new MutationObserver(() => {
        paused = document.body.style.overflow === 'hidden';
    });
    ob.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const now = Date.now() * 0.001;

        if (!paused) autoAngle += 0.0038;

        
        cards.forEach(({ mesh, angle }, i) => {
            const a  = angle + autoAngle;
            mesh.position.x = Math.cos(a) * ORBIT_R;
            mesh.position.z = Math.sin(a) * ORBIT_R;
            mesh.position.y = Math.sin(now * 0.55 + angle * 1.8) * 0.42;
            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);

            
            const dist  = mesh.position.distanceTo(camera.position);
            mesh.material.opacity = 0.7 + (1 / dist) * 2.5;
        });

        
        camera.rotation.x += (targetRX - camera.rotation.x) * 0.04;
        camera.rotation.y += (targetRY - camera.rotation.y) * 0.04;

        
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        
        ringMat.opacity = 0.07 + Math.sin(now * 1.5) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    
    const ro = new ResizeObserver(() => {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    ro.observe(canvas.parentElement);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id  = a.getAttribute('href').slice(1);
        const el  = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

document.querySelectorAll('.logo').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

const lbStyle = document.createElement('style');
lbStyle.textContent = `
.lightbox.active{display:flex!important}
.modal-overlay.active{display:flex!important}
`;
document.head.appendChild(lbStyle);

console.log('🚀 Portfolio script v3.0 loaded — Muhammad Irfan Waseem');
