let formReady;
const reviewModule = () => import('./firebase.js');
new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    reviewModule().then(module => module.loadReviews()).catch(() => {});
}, {rootMargin:'300px'}).observe(document.getElementById('contact'));
document.querySelectorAll('[data-review-open]').forEach(btn => btn.addEventListener('click', () => {
    document.getElementById('modal-feedback').showModal();
    (formReady ??= reviewModule().then(module => module.enableReviewForm())).catch(() => {
        formReady = null;
        document.getElementById('review-status').textContent = 'Reviews are temporarily unavailable.';
    });
}));
