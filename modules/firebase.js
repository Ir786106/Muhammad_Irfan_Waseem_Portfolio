import { initializeApp } from '../vendor/firebase-10.12.2/firebase-app.js';
import { getFirestore, collection, doc, getDocs, query, limit, where, orderBy, setDoc, serverTimestamp } from '../vendor/firebase-10.12.2/firebase-firestore-lite.js';

const config = {
    apiKey:            "AIzaSyAJsGuQRpzpfWHszomeg0q_dtUZkeBh0Go",
    authDomain:        "irfan-portfolio-ae62a.firebaseapp.com",
    projectId:         "irfan-portfolio-ae62a",
    storageBucket:     "irfan-portfolio-ae62a.firebasestorage.app",
    messagingSenderId: "220875740206",
    appId:             "1:220875740206:web:4dc00c10fa86784b063bbf",
    measurementId:     "G-FX3Q38PZT6"
};
const app = initializeApp(config);
// Set this public key after registering the website in Firebase App Check.
const enterpriseSiteKey = '';
if (enterpriseSiteKey) {
    const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import('../vendor/firebase-10.12.2/firebase-app-check.js');
    initializeAppCheck(app, {provider: new ReCaptchaEnterpriseProvider(enterpriseSiteKey), isTokenAutoRefreshEnabled: true});
}
const db = getFirestore(app);
const section = document.getElementById('testimonials');
const status = document.getElementById('review-status');
function avatar(value) {
    try {
        const url = new URL(value);
        if (url.protocol === 'https:' && url.hostname === 'lh3.googleusercontent.com') return url.href;
    } catch {}
    return '';
}

export async function loadReviews() {
    const snapshot = await getDocs(query(collection(db, 'testimonials'), where('approved', '==', true), where('publicationPermission', '==', true), orderBy('date', 'desc'), limit(6)));
    section.hidden = true;
    document.querySelectorAll('[data-review-nav]').forEach(link => link.hidden = true);
    if (snapshot.size < 3) return;
    const container = document.getElementById('testimonial-container');
    container.replaceChildren();
    snapshot.forEach(row => {
        const data = row.data();
        const card = document.createElement('article');
        card.className = 'review-card glass';
        const name = document.createElement('strong');
        const quote = document.createElement('p');
        const rating = document.createElement('span');
        const stars = Math.max(1, Math.min(5, Math.trunc(Number(data.rating)) || 1));
        rating.textContent = stars + ' out of 5 stars';
        quote.textContent = data.message;
        name.textContent = data.name;
        const src = avatar(data.photo);
        if (src) {
            const image = document.createElement('img');
            Object.assign(image, { src, alt: '', width: 40, height: 40, loading: 'lazy' });
            card.append(image);
        }
        card.append(rating, quote, name);
        container.append(card);
    });
    section.hidden = false;
    document.querySelectorAll('[data-review-nav]').forEach(link => link.hidden = false);
}

export async function enableReviewForm() {
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import('../vendor/firebase-10.12.2/firebase-auth.js');
    const auth = getAuth(app);
    const login = document.getElementById('google-login-btn');
    const form = document.getElementById('feedbackForm');
    onAuthStateChanged(auth, user => {
        login.hidden = Boolean(user);
        form.hidden = !user;
        if (user) document.getElementById('review-user').textContent = user.displayName;
    });
    login.addEventListener('click', async () => {
        try { await signInWithPopup(auth, new GoogleAuthProvider()); }
        catch { status.textContent = 'Google sign-in did not finish. Please try again.'; }
    });
    document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const user = auth.currentUser;
        const message = form.elements.message.value.trim();
        if (!user || !message || !form.reportValidity() || !form.elements.consentToPublish.checked) return;
        const button = form.querySelector('[type=submit]');
        button.disabled = true;
        try {
            await setDoc(doc(db, 'testimonials', user.uid), { uid: user.uid, name: (user.displayName || 'Reviewer').slice(0, 80), message, photo: avatar(user.photoURL), rating: Number(form.elements.rating.value), approved: false, publicationPermission: false, consentToPublish: true, date: serverTimestamp() });
            status.textContent = 'Thank you. Your review is awaiting moderation.';
            form.reset();
        } catch { status.textContent = 'Could not submit. Each Google account can submit once.'; }
        finally { button.disabled = false; }
    });
}
