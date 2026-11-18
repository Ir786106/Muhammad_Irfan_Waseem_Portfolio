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
                const module = await import('./three-showcase.js');
                showcase.classList.add('orbit-ready');
                module.init3D();
            } catch { showcase.classList.remove('orbit-ready'); }
        };
        document.head.append(library);
    }, {rootMargin:'240px'}).observe(showcase);
}

const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (range > 0 ? scrollY / range : 0) + ')';
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 40);
}, {passive: true});
