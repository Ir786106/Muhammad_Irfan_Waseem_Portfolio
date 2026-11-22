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
        const candidates = mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const focusable = [...candidates].filter(el => el.getClientRects().length);
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

const tabList = document.querySelector('.skills-tabs');
const tabs = [...document.querySelectorAll('.stab')];
const panels = [...document.querySelectorAll('.skills-panel')];
if (tabList && tabs.length) {
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', 'Technology categories');
    function activateTab(tab, focus=false) {
        tabs.forEach(button => {
            const selected = button === tab;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });
        panels.forEach(panel => {
            const selected = panel.id === `tab-${tab.dataset.tab}`;
            panel.classList.toggle('active', selected);
            panel.hidden = !selected;
        });
        if (focus) tab.focus();
    }
    tabs.forEach((button, index) => {
        const panel=document.getElementById(`tab-${button.dataset.tab}`);
        const id=`technology-tab-${button.dataset.tab}`;
        button.id=id;
        button.setAttribute('role','tab');
        button.setAttribute('aria-controls', `tab-${button.dataset.tab}`);
        if (panel) { panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',id); }
        button.addEventListener('click',()=>activateTab(button));
        button.addEventListener('keydown',event=>{
            const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            let destination = step ? (index + step + tabs.length) % tabs.length : null;
            if (event.key === 'Home') destination=0;
            if (event.key === 'End') destination=tabs.length-1;
            if (destination === null) return;
            event.preventDefault();
            activateTab(tabs[destination],true);
        });
    });
    activateTab(tabs.find(b=>b.classList.contains('active')) || tabs[0]);
}


initActiveNav();
