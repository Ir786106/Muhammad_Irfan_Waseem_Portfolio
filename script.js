import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("System Status: Firebase Connected.");
} catch (e) {
    console.warn("System Status: Demo Mode (Firebase config missing).");
}

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        initAnimations(); 
        fetchTestimonials(); 
    }, 1500);
});

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    
    outline.style.left = `${x}px`;
    outline.style.top = `${y}px`;
});

const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    if(mobileMenu.classList.contains('active')) {
        gsap.to(".bar:nth-child(1)", { rotate: 45, y: 8 });
        gsap.to(".bar:nth-child(2)", { rotate: -45, y: -8 });
    } else {
        gsap.to(".bar", { rotate: 0, y: 0 });
    }
});

document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
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
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
                gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
            } else {
                card.style.display = 'none';
            }
        });
    });
});

gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
    gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power4.out" });
    gsap.from(".hero-subtitle", { opacity: 0, y: 30, delay: 0.2, duration: 1 });
    gsap.from(".hero-btns", { opacity: 0, y: 20, delay: 0.4, duration: 1 });
    
    gsap.fromTo(".profile-card", 
        { opacity: 0, scale: 0.9, rotation: -10 },
        { opacity: 1, scale: 1, rotation: 0, delay: 0.5, duration: 1.2, ease: "elastic.out(1, 0.5)" }
    );

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 85%" },
            opacity: 0, y: 30, duration: 0.8
        });
    });
}

window.openModal = (id) => {
    document.getElementById(id).style.display = 'flex';
    setTimeout(() => document.getElementById(id).classList.add('active'), 10);
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
                container.innerHTML += `
                    <div class="review-card glass-panel" style="animation: slideUp 0.5s ease">
                        <div class="stars" style="color:#fbbf24; margin-bottom:10px">★★★★★</div>
                        <p style="font-style:italic; margin-bottom:15px">"${data.message}"</p>
                        <h5 style="font-weight:700">- ${data.name}</h5>
                    </div>
                `;
            });
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Sending...";
    
    const name = document.getElementById('feedback-name').value;
    const msg = document.getElementById('feedback-message').value;

    if (db) {
        try {
            await addDoc(collection(db, "testimonials"), {
                name: name,
                message: msg,
                date: new Date()
            });
            alert("Thanks!");
            e.target.reset();
            document.getElementById('feedback-modal').classList.remove('active');
            setTimeout(() => document.getElementById('feedback-modal').style.display = 'none', 300);
            fetchTestimonials();
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
    btn.innerText = "Submit";
});

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Sending...";
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        date: new Date()
    };

    if (db) {
        try {
            await addDoc(collection(db, "contacts"), data);
            alert("Message Sent!");
            e.target.reset();
        } catch (err) {
            alert("Error sending message.");
        }
    }
    btn.innerText = "Send Message";
});