// --- 1. Fixed Imports (Version 10.12.2 & Added Missing Functions) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnnevkrd"; 

const firebaseConfig = {
    apiKey: "AIzaSyAJsGuQRpzpfWHszomeg0q_dtUZkeBh0Go",
    authDomain: "irfan-portfolio-ae62a.firebaseapp.com",
    projectId: "irfan-portfolio-ae62a",
    storageBucket: "irfan-portfolio-ae62a.firebasestorage.app",
    messagingSenderId: "220875740206",
    appId: "1:220875740206:web:4dc00c10fa86784b063bbf",
    measurementId: "G-FX3Q38PZT6"
};

let db, auth, analytics;
let currentUser = null;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    analytics = getAnalytics(app);
    console.log("System Status: Firebase Connected.");
} catch (e) {
    console.warn("System Status: Connection Failed.", e);
}

const authLoading = document.getElementById('auth-loading');
const authSection = document.getElementById('auth-section');
const feedbackFormDisplay = document.getElementById('feedbackForm');
const loginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');

if (auth) {
    onAuthStateChanged(auth, (user) => {
        if(authLoading) authLoading.style.display = 'none';
        
        if (user) {
            currentUser = user;
            showFeedbackUI(user);
        } else {
            currentUser = null;
            showLoginUI();
        }
    });
}

function showFeedbackUI(user) {
    if(authSection) authSection.style.display = 'none';
    if(feedbackFormDisplay) {
        feedbackFormDisplay.style.display = 'block';
        const nameEl = document.getElementById('user-name-display');
        const imgEl = document.getElementById('user-avatar');
        if(nameEl) nameEl.innerText = user.displayName;
        if(imgEl) imgEl.src = user.photoURL;
    }
}

function showLoginUI() {
    if(feedbackFormDisplay) feedbackFormDisplay.style.display = 'none';
    if(authSection) authSection.style.display = 'block';
}

if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            showToast("Welcome back!", "success");
        } catch (error) {
            console.error("Login Error:", error);
            showToast("Login Failed.", "error");
        }
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            showToast("Logged out successfully.", "success");
        });
    });
}

// Star Rating Logic
const stars = document.querySelectorAll('.star-btn');
const ratingInput = document.getElementById('feedback-rating');

if (stars.length > 0) {
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            if(ratingInput) ratingInput.value = value;
            
            stars.forEach(s => {
                const sVal = parseInt(s.dataset.value);
                if (sVal <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// --- Feedback Submission Logic (Fixed) ---
const feedbackForm = document.getElementById('feedbackForm');
if(feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            showToast("Please login first.", "error");
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;
        
        const msg = document.getElementById('feedback-message').value;
        const rating = document.getElementById('feedback-rating') ? document.getElementById('feedback-rating').value : 5;

        if (db) {
            try {
                // Check for user's last review
                const q = query(collection(db, "testimonials"), where("uid", "==", currentUser.uid), orderBy("date", "desc"), limit(1));
                const snapshot = await getDocs(q);

                let shouldUpdate = false;
                let docIdToUpdate = null;

                if (!snapshot.empty) {
                    const lastDoc = snapshot.docs[0];
                    const lastData = lastDoc.data();
                    
                    // 24 Hour Check Logic
                    if (lastData.date) {
                        const lastDate = lastData.date.toDate();
                        const now = new Date();
                        const diffMs = now - lastDate;
                        const diffHours = diffMs / (1000 * 60 * 60);

                        if (diffHours < 24) {
                            const userChoice = confirm("You submitted a feedback less than 24 hours ago.\n\nClick OK to UPDATE your last feedback.\nClick CANCEL to submit a NEW feedback.");
                            if (userChoice) {
                                shouldUpdate = true;
                                docIdToUpdate = lastDoc.id;
                            }
                        }
                    }
                }

                if (shouldUpdate && docIdToUpdate) {
                    // Update Existing Review
                    const reviewRef = doc(db, "testimonials", docIdToUpdate);
                    await updateDoc(reviewRef, {
                        message: msg,
                        rating: parseInt(rating),
                        date: new Date()
                    });
                    showToast("Your feedback has been updated!", "success");
                } else {
                    // Create New Review
                    await addDoc(collection(db, "testimonials"), {
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        photo: currentUser.photoURL,
                        message: msg,
                        rating: parseInt(rating),
                        date: new Date()
                    });
                    showToast("Review submitted successfully!", "success");
                }
                
                // Cleanup UI
                e.target.reset();
                if(stars.length > 0) stars.forEach(s => s.classList.add('active'));
                closeFeedbackModal();
                fetchTestimonials();

            } catch (err) {
                showToast("Error processing review.", "error");
                console.error("Firebase Error:", err);
            }
        }
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = "Sending...";
        btn.disabled = true;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            if (db) {
                addDoc(collection(db, "contacts"), {
                    name, email, message, date: new Date()
                }).catch(err => console.warn("Firebase backup failed", err));
            }
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                showToast("Message Sent! I'll contact you soon.", "success");
                e.target.reset();
            } else {
                showToast("Failed to send email. Try again.", "error");
            }

        } catch (err) {
            console.error("Error:", err);
            showToast("Something went wrong.", "error");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

async function fetchTestimonials() {
    if (!db) return;
    const container = document.getElementById('testimonial-container');
    try {
        const q = query(collection(db, "testimonials"), orderBy("date", "desc"), limit(4));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                let starsHTML = '★'.repeat(data.rating || 5);
                container.innerHTML += `
                    <div class="review-card glass-panel" style="animation: slideUp 0.5s ease">
                        <div class="stars">${starsHTML}</div>
                        <p style="font-style:italic; margin-bottom:15px">"${data.message}"</p>
                        <h5 style="font-weight:700">- ${data.name}</h5>
                    </div>`;
            });
        }
    } catch (err) { console.error("Reviews Error:", err); }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerText = message;
    
    // Fallback inline styles
    const bgColor = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#ef4444');
    toast.style.background = bgColor;

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if(preloader) {
        gsap.to(preloader, {
            opacity: 0, duration: 0.8, ease: "power2.inOut",
            onComplete: () => {
                preloader.style.visibility = 'hidden';
                initAnimations(); 
                fetchTestimonials(); 
            }
        });
    }
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Cursor Logic (Desktop Only)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let xTo = gsap.quickTo(cursorOutline, "left", { duration: 0.2, ease: "power3" }),
        yTo = gsap.quickTo(cursorOutline, "top", { duration: 0.2, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        gsap.set(cursorDot, { left: e.clientX, top: e.clientY });
        xTo(e.clientX); yTo(e.clientY);
    });

    const magnets = document.querySelectorAll('.btn-primary, .social-icon, .nav-link');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            gsap.to(cursorOutline, { scale: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(59, 130, 246, 0.1)', duration: 0.3 });
        });
        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, { x: 0, y: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" });
            gsap.to(cursorOutline, { scale: 1, borderColor: 'var(--text-muted)', backgroundColor: 'transparent', duration: 0.3 });
        });
    });
}

const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        gsap.fromTo(themeBtn.querySelector('i'), { rotate: -90, scale: 0 }, { rotate: 0, scale: 1, duration: 0.4 });
    });
}

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if(mobileMenu.classList.contains('active')) {
            gsap.to(".bar:nth-child(1)", { rotate: 45, y: 8, duration: 0.3 });
            gsap.to(".bar:nth-child(2)", { rotate: -45, y: -8, duration: 0.3 });
            gsap.fromTo(".mobile-links li", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2 });
        } else {
            gsap.to(".bar", { rotate: 0, y: 0, duration: 0.3 });
        }
    });
}
document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        gsap.to(".bar", { rotate: 0, y: 0 });
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
                gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
            } else { card.style.display = 'none'; }
        });
    });
});

window.openModal = (id) => {
    const modal = document.getElementById(id);
    if(modal) { modal.style.display = 'flex'; requestAnimationFrame(() => modal.classList.add('active')); }
};
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    });
});
window.openLightbox = (el) => {
    const src = el.querySelector('img').src;
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').style.display = 'flex';
};
window.closeLightbox = () => document.getElementById('lightbox').style.display = 'none';

gsap.registerPlugin(ScrollTrigger);

// --- 3. Animation Fix (Safety Check for Mobile) ---
function initAnimations() {
    // Check if device is larger than 900px
    if (window.innerWidth > 900) {
        const tl = gsap.timeline();
        tl.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power3.out" })
          .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
          .from(".hero-btns", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
          .from(".profile-card", { opacity: 0, scale: 0.9, rotation: -5, duration: 1, ease: "back.out(1.7)" }, "-=0.8");
        
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, { scrollTrigger: { trigger: title, start: "top 85%" }, opacity: 0, y: 40, duration: 0.8, ease: "power3.out" });
        });
        
        gsap.utils.toArray('.projects-grid, .skills-showcase, .gallery-grid').forEach(grid => {
            gsap.from(grid.children, { scrollTrigger: { trigger: grid, start: "top 85%" }, opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power3.out" });
        });
    } else {
        // Mobile Safe Mode: Force visibility so nothing stays hidden
        console.log("Mobile detected: Animations skipped to ensure data visibility.");
        gsap.set(".hero-title, .hero-subtitle, .hero-btns, .profile-card, .section-title, .skill-box, .project-card, .gallery-item", { 
            opacity: 1, visibility: "visible", y: 0 
        });
    }
}