// ═══════════════════════════════════════════════════════════
//  MUHAMMAD IRFAN WASEEM — PORTFOLIO SCRIPT v3.0
//  Firebase · Three.js 3D · GSAP · Typed · AOS · All Logic
// ═══════════════════════════════════════════════════════════

// ── 1. FIREBASE IMPORTS ───────────────────────────────────
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

// ── 2. FIREBASE CONFIG ────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
//  SKY SYSTEM — TIME-BASED LIVING SKY
// ═══════════════════════════════════════════════════════════

const OWM_KEY = '378224a95a195d4c7614a47c633867aa'; // Get free key from https://openweathermap.org/api

const SKY_MODES = {
    dawn:      { start: 4,    end: 6,    label: '🌠 Dawn',     id: 'dawn'      },
    morning:   { start: 6,    end: 10.5, label: '🌅 Morning',  id: 'morning'   },
    afternoon: { start: 10.5, end: 16.5, label: '☀️ Day',     id: 'afternoon' },
    evening:   { start: 16.5, end: 20,   label: '🌇 Evening',  id: 'evening'   },
    night:     { start: 20,   end: 28,   label: '🌙 Night',    id: 'night'     },
};

let activeSkyMode = 'night';
let manualOverride = false;
let skyAnimationFrameId = null;
let weatherData = null;
let currentWeather = null;

const SKY_TOKENS = {
    dawn:      { bg:'#0d0520', text:'#f1e8ff', primary:'#a855f7', accent:'#e8650a', card:'rgba(20,8,40,0.75)' },
    morning:   { bg:'#fff3e0', text:'#1a1a2e', primary:'#e8650a', accent:'#f59e0b', card:'rgba(255,255,255,0.82)' },
    afternoon: { bg:'#e8f4ff', text:'#0f172a', primary:'#2563eb', accent:'#06b6d4', card:'rgba(255,255,255,0.85)' },
    evening:   { bg:'#1a0533', text:'#fef3c7', primary:'#a855f7', accent:'#f97316', card:'rgba(30,5,55,0.78)' },
    night:     { bg:'#000814', text:'#e2e8f0', primary:'#6366f1', accent:'#06b6d4', card:'rgba(8,12,35,0.80)' },
};

function getCurrentSkyMode() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    if (h >= 4   && h < 6)    return 'dawn';
    if (h >= 6   && h < 10.5) return 'morning';
    if (h >= 10.5 && h < 16.5) return 'afternoon';
    if (h >= 16.5 && h < 20)  return 'evening';
    return 'night';
}

function applySkyTokens(mode) {
    const root = document.documentElement;
    const tokens = SKY_TOKENS[mode];
    if (!tokens) return;
    
    root.style.setProperty('--bg',      tokens.bg);
    root.style.setProperty('--text',    tokens.text);
    root.style.setProperty('--primary', tokens.primary);
    root.style.setProperty('--accent',  tokens.accent);
    root.style.setProperty('--bg-card', tokens.card);
    
    document.body.style.transition = 'background 2s ease, color 1s ease';
    document.body.style.background = tokens.bg;
    document.body.style.color = tokens.text;
}

function setSkyMode(mode, isManual = false) {
    if (isManual) {
        manualOverride = true;
        setTimeout(() => {
            manualOverride = false;
            setSkyMode(getCurrentSkyMode());
        }, 30 * 60 * 1000);
    }
    activeSkyMode = mode;
    applySkyTokens(mode);
    document.documentElement.setAttribute('data-sky-mode', mode);
    
    if (skyAnimationFrameId) cancelAnimationFrame(skyAnimationFrameId);
    renderSkyCanvas(mode);
    updateModeIndicator(mode);
}

function updateModeIndicator(mode) {
    const btn = document.getElementById('skyModeBtn');
    if (!btn) return;
    const modeData = SKY_MODES[mode];
    const icon = modeData.label.split(' ')[0];
    const label = document.querySelector('.sky-mode-label');
    btn.querySelector('.sky-mode-icon').textContent = icon;
    if (label) label.textContent = modeData.label.split(' ').slice(1).join(' ');
}

// ── SKY CANVAS ──────────────────────────────────────────
const skyCanvas = document.getElementById('sky-canvas');
const skyCtx = skyCanvas ? skyCanvas.getContext('2d') : null;

function resizeSkyCanvas() {
    if (!skyCanvas) return;
    skyCanvas.width = window.innerWidth;
    skyCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeSkyCanvas, { passive: true });
resizeSkyCanvas();

// ── STARS ──────────────────────────────────────────────
function generateStars(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random() * 0.85,
        r: Math.random() * 0.8 + 0.2,
        baseOpacity: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinklePhase: Math.random() * Math.PI * 2,
        colorTint: ['255,255,255','200,220,255','255,255,200'][Math.floor(Math.random()*3)]
    }));
}

const STARS = generateStars(window.innerWidth < 768 ? 150 : 300);

function drawStars(ctx, W, H, alpha = 1, t = 0) {
    if (!ctx) return;
    STARS.forEach(s => {
        const twinkle = Math.sin(t * s.twinkleSpeed * 1000 + s.twinklePhase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.colorTint},${s.baseOpacity * twinkle * alpha})`;
        ctx.fill();
    });
}

// ── BIRDS — REALISTIC WITH PHYSICS ──────────────────────
// Birds removed - using dynamic sun positioning instead

// ── CLOUDS — PHOTOREALISTIC ────────────────────────────
function drawRealisticCloud(ctx, x, y, scale, shade, depth = 0.5) {
    if (!ctx) return;
    
    // Main cloud body with layered puffs
    const puffs = [
        [0, 0, 1.2],           // Center large puff
        [-1.2, 0.05, 0.95],    // Left puff
        [1.2, 0.08, 0.95],     // Right puff
        [-0.6, -0.35, 0.8],    // Upper left
        [0.6, -0.35, 0.8],     // Upper right
        [-1.8, 0.15, 0.7],     // Far left
        [1.8, 0.15, 0.7],      // Far right
        [0, -0.6, 0.75],       // Top center
    ];
    
    // Draw shadows first (darker layer)
    puffs.forEach(([px, py, ps]) => {
        ctx.beginPath();
        ctx.arc(x + px * scale * 35, y + py * scale * 35 + scale * 8, scale * 35 * ps, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.max(0, shade - 60)},${Math.max(0, shade - 60)},${Math.max(0, shade - 60)},${0.15 * depth})`;
        ctx.fill();
    });
    
    // Draw bright cloud puffs
    puffs.forEach(([px, py, ps], idx) => {
        ctx.beginPath();
        ctx.arc(x + px * scale * 35, y + py * scale * 35, scale * 35 * ps, 0, Math.PI * 2);
        
        // Add gradient for depth
        const cloudGradient = ctx.createRadialGradient(
            x + px * scale * 35 - scale * 10, 
            y + py * scale * 35 - scale * 10, 
            0,
            x + px * scale * 35, 
            y + py * scale * 35, 
            scale * 35 * ps
        );
        cloudGradient.addColorStop(0, `rgba(255,255,255,${0.95 * depth})`);
        cloudGradient.addColorStop(0.5, `rgba(${shade},${shade},${shade},${0.85 * depth})`);
        cloudGradient.addColorStop(1, `rgba(${Math.max(0, shade - 40)},${Math.max(0, shade - 40)},${Math.max(0, shade - 40)},${0.4 * depth})`);
        
        ctx.fillStyle = cloudGradient;
        ctx.fill();
    });
}

const CLOUDS = Array.from({ length: window.innerWidth < 768 ? 3 : 6 }, (_, i) => ({
    x: Math.random(),
    y: 0.08 + Math.random() * 0.45,
    scale: 0.6 + Math.random() * 0.8,
    speed: 0.00003 + Math.random() * 0.00006,
    shade: 240 + Math.floor(Math.random() * 12),
    depth: 0.4 + Math.random() * 0.6,
}));

function updateClouds(ctx, W, H, opacity = 1) {
    if (!ctx) return;
    CLOUDS.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.3) cloud.x = -0.3;
        drawRealisticCloud(ctx, cloud.x * W, cloud.y * H, cloud.scale * W * 0.018, cloud.shade, opacity);
    });
}

// ── MOON ────────────────────────────────────────────
function drawMoon(ctx, cx, cy, R, phase) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    
    if (phase > 0.55) {
        const shadowOffset = Math.cos(phase * Math.PI * 2) * R * 1.8;
        ctx.beginPath();
        ctx.arc(cx + shadowOffset, cy, R * 1.02, 0, Math.PI * 2);
        ctx.fillStyle = '#000814';
        ctx.fill();
    }
    
    [[0.3, 0.3, 0.1], [-0.2, 0.4, 0.07], [0.1, -0.3, 0.08]].forEach(([dx, dy, cr]) => {
        ctx.beginPath();
        ctx.arc(cx + dx * R, cy + dy * R, cr * R, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fill();
    });
}

function getLunarPhase() {
    const lunarPhase = ((Date.now() / 86400000 - 2451550.1) % 29.53058770576) / 29.53058770576;
    return lunarPhase;
}

// ── SHOOTING STARS ────────────────────────────────────
let shootingStar = null;

function maybeSpawnShootingStar(t) {
    if (!shootingStar && Math.random() < 0.002) {
        shootingStar = {
            x: Math.random() * 1.5,
            y: Math.random() * 0.6,
            len: 0.15,
            dur: 400,
            start: t
        };
    }
}

function drawShootingStar(ctx, W, H, t) {
    if (!ctx || !shootingStar) return;
    const age = t - shootingStar.start;
    if (age > shootingStar.dur) {
        shootingStar = null;
        return;
    }
    const progress = age / shootingStar.dur;
    const opacity = Math.sin(progress * Math.PI) * 0.8;
    ctx.beginPath();
    ctx.moveTo(shootingStar.x * W, shootingStar.y * H);
    ctx.lineTo((shootingStar.x - shootingStar.len * progress) * W, (shootingStar.y + shootingStar.len * progress * 0.6) * H);
    ctx.strokeStyle = `rgba(200,220,255,${opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

// ── SKY RENDERING ──────────────────────────────────────
function drawDawnSky(ctx, W, H, t) {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const dawnProgress = Math.max(0, Math.min(1, (h - 4) / 2));
    
    // Pre-dawn to early sunrise gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    
    if (dawnProgress < 0.3) {
        // Deep night to twilight (4:00-4:36)
        const p = dawnProgress / 0.3;
        gradient.addColorStop(0, `rgb(10, 5, 24)`);
        gradient.addColorStop(0.2, `rgb(${Math.floor(20 + p * 40)}, ${Math.floor(10 + p * 30)}, ${Math.floor(40 + p * 80)})`);
        gradient.addColorStop(0.4, `rgb(${Math.floor(40 + p * 60)}, ${Math.floor(30 + p * 60)}, ${Math.floor(90 + p * 90)})`);
        gradient.addColorStop(0.6, `rgb(${Math.floor(80 + p * 80)}, ${Math.floor(50 + p * 80)}, ${Math.floor(120 + p * 90)})`);
        gradient.addColorStop(0.85, `rgb(${Math.floor(140 + p * 100)}, ${Math.floor(100 + p * 100)}, ${Math.floor(180 + p * 60)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(200 + p * 30)}, ${Math.floor(130 + p * 80)}, ${Math.floor(220 - p * 40)})`);
    } else if (dawnProgress < 0.7) {
        // Twilight to pre-sunrise (4:36-5:24)
        const p = (dawnProgress - 0.3) / 0.4;
        gradient.addColorStop(0, `rgb(${Math.floor(60 - p * 30)}, ${Math.floor(40 - p * 20)}, ${Math.floor(120 - p * 40)})`);
        gradient.addColorStop(0.15, `rgb(${Math.floor(100 - p * 40)}, ${Math.floor(90 - p * 40)}, ${Math.floor(180 + p * 40)})`);
        gradient.addColorStop(0.35, `rgb(${Math.floor(140 - p * 30)}, ${Math.floor(130 - p * 50)}, ${Math.floor(200 + p * 20)})`);
        gradient.addColorStop(0.55, `rgb(${Math.floor(200 - p * 30)}, ${Math.floor(160 - p * 60)}, ${Math.floor(220 + p * 10)})`);
        gradient.addColorStop(0.8, `rgb(${Math.floor(230 - p * 40)}, ${Math.floor(180 - p * 50)}, ${Math.floor(180 + p * 40)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(255 - p * 50)}, ${Math.floor(200 - p * 80)}, ${Math.floor(150 + p * 50)})`);
    } else {
        // Early sunrise (5:24-6:00)
        const p = (dawnProgress - 0.7) / 0.3;
        gradient.addColorStop(0, `rgb(30, 20, 80)`);
        gradient.addColorStop(0.15, `rgb(${Math.floor(60 + p * 80)}, ${Math.floor(50 + p * 60)}, ${Math.floor(160)}`);
        gradient.addColorStop(0.35, `rgb(${Math.floor(110 + p * 80)}, ${Math.floor(80 + p * 100)}, ${Math.floor(200)})`);
        gradient.addColorStop(0.55, `rgb(${Math.floor(170 + p * 60)}, ${Math.floor(120 + p * 80)}, ${Math.floor(220)}`);
        gradient.addColorStop(0.8, `rgb(${Math.floor(215 + p * 30)}, ${Math.floor(130 + p * 100)}, ${Math.floor(200 - p * 100)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(255)}, ${Math.floor(160 + p * 40)}, ${Math.floor(100 - p * 80)})`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Stars fading gradually during dawn (transition from night to day)
    drawStars(ctx, W, H, 1 - dawnProgress * 0.8, t);
    
    // Crescent moon setting (left side)
    const moonX = W * (0.15 - dawnProgress * 0.15);
    const moonY = H * (0.2 + dawnProgress * 0.1);
    
    if (dawnProgress < 0.9) {
        // Calculate moon phase for realistic crescent
        const moonPhase = 0.75 + dawnProgress * 0.2;
        
        // Main moon circle
        ctx.beginPath();
        ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 240, 220, ${1 - dawnProgress * 0.8})`;
        ctx.fill();
        
        // Shadow for crescent
        const shadowOffsetX = Math.cos(moonPhase * Math.PI * 2) * 50 * 1.5;
        ctx.beginPath();
        ctx.arc(moonX + shadowOffsetX, moonY, 52, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.floor(10 + dawnProgress * 50)}, ${Math.floor(5 + dawnProgress * 40)}, ${Math.floor(24 + dawnProgress * 80)})`;
        ctx.fill();
        
        // Moon crater details
        if (dawnProgress > 0.3) {
            ctx.beginPath();
            ctx.arc(moonX - 10, moonY - 15, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(moonX + 8, moonY + 12, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
            ctx.fill();
        }
    }
    
    // Aurora shimmer effect in early dawn
    if (dawnProgress < 0.5) {
        for (let i = 0; i < 5; i++) {
            const auroraY = H * (0.3 + i * 0.1);
            const auroraGradient = ctx.createLinearGradient(0, auroraY - 20, 0, auroraY + 20);
            const auroraOpacity = Math.sin(t * 0.001 + i) * 0.5 + 0.3;
            auroraGradient.addColorStop(0, `rgba(150, 100, 200, 0)`);
            auroraGradient.addColorStop(0.5, `rgba(180, 120, 220, ${auroraOpacity * (0.5 - dawnProgress * 2)})`);
            auroraGradient.addColorStop(1, `rgba(150, 100, 200, 0)`);
            
            ctx.fillStyle = auroraGradient;
            ctx.fillRect(0, auroraY, W, 40);
        }
    }
    
    // Stars fading out
    drawStars(ctx, W, H, 1 - dawnProgress, t);
    
    // Atmospheric haze at horizon
    const hazeGradient = ctx.createLinearGradient(0, H * 0.8, 0, H);
    hazeGradient.addColorStop(0, `rgba(255, 150, 80, 0)`);
    hazeGradient.addColorStop(1, `rgba(255, 150, 80, ${0.08 * dawnProgress})`);
    ctx.fillStyle = hazeGradient;
    ctx.fillRect(0, H * 0.8, W, H * 0.2);
}

function drawMorningSky(ctx, W, H, t) {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const morningProgress = Math.max(0, Math.min(1, (h - 6) / 4.5));
    
    // Create realistic sunrise gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    
    if (morningProgress < 0.3) {
        // Early morning (6:00-7:24) - Deep amber to golden
        const p = morningProgress / 0.3;
        gradient.addColorStop(0, `rgb(${Math.floor(30 + p * 100)}, ${Math.floor(20 + p * 80)}, ${Math.floor(80 + p * 60)}`);
        gradient.addColorStop(0.15, `rgb(${Math.floor(180 + p * 60)}, ${Math.floor(80 + p * 100)}, ${Math.floor(20 + p * 80)})`);
        gradient.addColorStop(0.35, `rgb(${Math.floor(220 + p * 30)}, ${Math.floor(140 + p * 80)}, ${Math.floor(50 + p * 100)})`);
        gradient.addColorStop(0.55, `rgb(${Math.floor(230 + p * 20)}, ${Math.floor(170 + p * 50)}, ${Math.floor(120 + p * 80)})`);
        gradient.addColorStop(0.75, `rgb(${Math.floor(240, p * 15)}, ${Math.floor(185 + p * 40)}, ${Math.floor(150 + p * 70)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(200 - p * 20)}, ${Math.floor(220 - p * 40)}, ${Math.floor(255)})`);
    } else if (morningProgress < 0.6) {
        // Mid morning (7:24-8:48) - Golden to bright
        const p = (morningProgress - 0.3) / 0.3;
        gradient.addColorStop(0, `rgb(${Math.floor(130 - p * 30)}, ${Math.floor(100 - p * 40)}, ${Math.floor(140 - p * 60)})`);
        gradient.addColorStop(0.15, `rgb(${Math.floor(240 - p * 40)}, ${Math.floor(180 - p * 30)}, ${Math.floor(100 - p * 50)})`);
        gradient.addColorStop(0.35, `rgb(${Math.floor(250 - p * 30)}, ${Math.floor(220 - p * 40)}, ${Math.floor(150 - p * 30)})`);
        gradient.addColorStop(0.55, `rgb(${Math.floor(250 - p * 20)}, ${Math.floor(220 - p * 20)}, ${Math.floor(190 - p * 20)})`);
        gradient.addColorStop(0.8, `rgb(${Math.floor(245 - p * 15)}, ${Math.floor(225 - p * 15)}, ${Math.floor(240 - p * 15)})`);
        gradient.addColorStop(1, `rgb(135, 206, 235)`);
    } else {
        // Late morning (8:48-10:30) - Full daylight
        gradient.addColorStop(0, `rgb(100, 150, 200)`);
        gradient.addColorStop(0.25, `rgb(150, 180, 220)`);
        gradient.addColorStop(0.5, `rgb(180, 210, 240)`);
        gradient.addColorStop(0.8, `rgb(200, 230, 255)`);
        gradient.addColorStop(1, `rgb(135, 206, 235)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Stars fading out as sun rises (morning transition from night)
    const starAlpha = Math.max(0, 1 - morningProgress * 1.3); // Fade out stars
    if (starAlpha > 0.05) {
        drawStars(ctx, W, H, starAlpha, t);
    }
    
    // Draw sun with realistic positioning based on sunrise arc
    // Sun rises from southeast (left) to south (center) during morning
    const sunProgress = morningProgress;
    const sunX = W * (0.15 + sunProgress * 0.6); // Left to center
    const sunY = H * (0.95 - Math.pow(sunProgress, 0.8) * 0.65); // Horizon to high arc
    
    // Sun rays (god rays effect)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.0001;
        const rayLength = H * (0.3 + morningProgress * 0.2);
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(angle) * rayLength, sunY + Math.sin(angle) * rayLength);
        ctx.strokeStyle = `rgba(255, 220, 100, ${0.05 - morningProgress * 0.03})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Main sun
    const sunGradient = ctx.createRadialGradient(sunX - 20, sunY - 20, 0, sunX, sunY, 100);
    sunGradient.addColorStop(0, `rgba(255, 255, 180, ${0.9 - morningProgress * 0.2})`);
    sunGradient.addColorStop(0.4, `rgba(255, 200, 80, ${0.8 - morningProgress * 0.1})`);
    sunGradient.addColorStop(0.8, `rgba(255, 140, 20, ${0.4})`);
    sunGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
    
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();
    
    // Bright sun core
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 230, 150, ${1 - morningProgress * 0.3})`;
    ctx.fill();
    
    // Lens flare streaks
    ctx.beginPath();
    ctx.moveTo(sunX, sunY - 120);
    ctx.lineTo(sunX, sunY - 200);
    ctx.strokeStyle = `rgba(255, 255, 200, 0.1)`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(sunX - 120, sunY);
    ctx.lineTo(sunX - 200, sunY);
    ctx.strokeStyle = `rgba(255, 255, 200, 0.1)`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Atmospheric haze layer
    const hazeGradient = ctx.createLinearGradient(0, H * 0.7, 0, H);
    hazeGradient.addColorStop(0, `rgba(255, 200, 100, 0)`);
    hazeGradient.addColorStop(1, `rgba(255, 200, 100, 0.08)`);
    ctx.fillStyle = hazeGradient;
    ctx.fillRect(0, H * 0.7, W, H * 0.3);
    
    // Clouds with proper depth
    updateClouds(ctx, W, H, 0.7 + morningProgress * 0.3);
}

function drawAfternoonSky(ctx, W, H, t) {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const afternoonProgress = Math.max(0, Math.min(1, (h - 10.5) / 6));
    
    // Create deep sky gradient (peak daylight)
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    
    // Sky gets slightly warmer as afternoon progresses
    const skyTopR = Math.floor(37 + afternoonProgress * 40);
    const skyTopG = Math.floor(149 + afternoonProgress * 40);
    const skyTopB = Math.floor(235 - afternoonProgress * 30);
    
    const skyMidR = Math.floor(96 + afternoonProgress * 60);
    const skyMidG = Math.floor(165 + afternoonProgress * 40);
    const skyMidB = Math.floor(250 - afternoonProgress * 50);
    
    const horizonR = Math.floor(191 + afternoonProgress * 50);
    const horizonG = Math.floor(219 + afternoonProgress * 30);
    const horizonB = Math.floor(255 - afternoonProgress * 40);
    
    gradient.addColorStop(0, `rgb(${skyTopR}, ${skyTopG}, ${skyTopB})`);
    gradient.addColorStop(0.3, `rgb(${Math.floor(skyTopR * 0.8 + skyMidR * 0.2)}, ${Math.floor(skyTopG * 0.8 + skyMidG * 0.2)}, ${Math.floor(skyTopB * 0.8 + skyMidB * 0.2)})`);
    gradient.addColorStop(0.6, `rgb(${skyMidR}, ${skyMidG}, ${skyMidB})`);
    gradient.addColorStop(0.85, `rgb(${Math.floor(skyMidR * 0.6 + horizonR * 0.4)}, ${Math.floor(skyMidG * 0.6 + horizonG * 0.4)}, ${Math.floor(skyMidB * 0.6 + horizonB * 0.4)})`);
    gradient.addColorStop(1, `rgb(${horizonR}, ${horizonG}, ${horizonB})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Pure daylight - NO STARS OR MOON during afternoon
    
    // Sun position - realistic arc from south-center to southwest
    // At 10:30 AM sun is near zenith, by 4:30 PM it's descending toward west
    const hourInAfternoon = Math.max(0, h - 10.5);
    const sunProgress = hourInAfternoon / 6;
    const sunX = W * (0.5 + sunProgress * 0.35); // Center to right
    const sunY = H * (0.15 + Math.pow(sunProgress, 1.2) * 0.5); // Zenith down to horizon
    
    // Atmospheric perspective - sun haze
    const sunHaze = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 250);
    sunHaze.addColorStop(0, `rgba(255, 255, 200, 0.15)`);
    sunHaze.addColorStop(0.5, `rgba(255, 230, 150, 0.05)`);
    sunHaze.addColorStop(1, `rgba(255, 200, 100, 0)`);
    ctx.fillStyle = sunHaze;
    ctx.fillRect(0, 0, W, H);
    
    // Sun disc with realistic gradient
    const sunGradient = ctx.createRadialGradient(sunX - 15, sunY - 15, 0, sunX, sunY, 100);
    sunGradient.addColorStop(0, `rgba(255, 255, 200, 0.95)`);
    sunGradient.addColorStop(0.3, `rgba(255, 245, 180, 0.9)`);
    sunGradient.addColorStop(0.7, `rgba(255, 200, 100, 0.5)`);
    sunGradient.addColorStop(1, `rgba(255, 150, 50, 0.1)`);
    
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();
    
    // Bright sun core
    ctx.beginPath();
    ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 250, 200, 0.95)`;
    ctx.fill();
    
    // Subtle sun flickering/shimmer effect
    const shimmer = Math.sin(t * 0.002) * 3;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 60 + shimmer, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 220, ${0.1 + shimmer * 0.02})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Crepuscular rays (god rays) - afternoon effect
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 - Math.PI / 2;
        const rayX = sunX + Math.cos(angle) * 120;
        const rayY = sunY + Math.sin(angle) * 120;
        
        const rayGradient = ctx.createLinearGradient(sunX, sunY, rayX * 2, rayY * 2);
        rayGradient.addColorStop(0, `rgba(255, 220, 150, 0.08)`);
        rayGradient.addColorStop(0.5, `rgba(255, 200, 100, 0.03)`);
        rayGradient.addColorStop(1, `rgba(255, 180, 50, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(rayX * 2.5, rayY * 2.5);
        ctx.strokeStyle = rayGradient;
        ctx.lineWidth = 40;
        ctx.stroke();
    }
    
    // Enhanced cloud rendering for afternoon
    updateClouds(ctx, W, H, 0.85 + afternoonProgress * 0.15);
    
    // Atmospheric dust/haze at bottom
    const dustGradient = ctx.createLinearGradient(0, H * 0.65, 0, H);
    dustGradient.addColorStop(0, `rgba(200, 200, 200, 0)`);
    dustGradient.addColorStop(1, `rgba(180, 180, 200, 0.08)`);
    ctx.fillStyle = dustGradient;
    ctx.fillRect(0, H * 0.65, W, H * 0.35);
}

function drawEveningSky(ctx, W, H, t) {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const eveningProgress = Math.max(0, Math.min(1, (h - 16.5) / 3.5));
    
    // Stars appearing gradually as sun sets (evening transition to night)
    const starAlpha = Math.min(1, eveningProgress * 1.2);
    if (starAlpha > 0.05) {
        drawStars(ctx, W, H, starAlpha * 0.8, t);
    }
    
    // Dramatic sunset gradient progression
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    
    if (eveningProgress < 0.4) {
        // Early sunset (4:30-5:54) - Golden to orange
        const p = eveningProgress / 0.4;
        gradient.addColorStop(0, `rgb(${Math.floor(26 + p * 100)}, ${Math.floor(5 + p * 80)}, ${Math.floor(51 + p * 100)})`);
        gradient.addColorStop(0.25, `rgb(${Math.floor(180 + p * 60)}, ${Math.floor(60 + p * 60)}, ${Math.floor(20 + p * 50)})`);
        gradient.addColorStop(0.5, `rgb(${Math.floor(220 + p * 30)}, ${Math.floor(100 + p * 50)}, ${Math.floor(40 + p * 40)})`);
        gradient.addColorStop(0.75, `rgb(${Math.floor(240 + p * 10)}, ${Math.floor(140 + p * 40)}, ${Math.floor(100 + p * 40)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(255)}, ${Math.floor(160 + p * 40)}, ${Math.floor(100)})`);
    } else if (eveningProgress < 0.7) {
        // Mid sunset (5:54-7:18) - Deep orange to purple
        const p = (eveningProgress - 0.4) / 0.3;
        gradient.addColorStop(0, `rgb(${Math.floor(126 - p * 80)}, ${Math.floor(85 - p * 50)}, ${Math.floor(151 - p * 100)})`);
        gradient.addColorStop(0.2, `rgb(${Math.floor(240 - p * 80)}, ${Math.floor(120 - p * 50)}, ${Math.floor(60 + p * 40)})`);
        gradient.addColorStop(0.4, `rgb(${Math.floor(250 - p * 60)}, ${Math.floor(150 - p * 60)}, ${Math.floor(80 + p * 60)})`);
        gradient.addColorStop(0.65, `rgb(${Math.floor(255 - p * 80)}, ${Math.floor(180 - p * 80)}, ${Math.floor(140 + p * 20)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(255 - p * 120)}, ${Math.floor(200 - p * 100)}, ${Math.floor(170 + p * 50)})`);
    } else {
        // Late sunset (7:18-8:00) - Deep blue to night
        const p = (eveningProgress - 0.7) / 0.3;
        gradient.addColorStop(0, `rgb(${Math.floor(46 - p * 30)}, ${Math.floor(35 - p * 30)}, ${Math.floor(51 - p * 40)})`);
        gradient.addColorStop(0.25, `rgb(${Math.floor(160 - p * 120)}, ${Math.floor(70 - p * 50)}, ${Math.floor(100 - p * 80)})`);
        gradient.addColorStop(0.45, `rgb(${Math.floor(190 - p * 140)}, ${Math.floor(90 - p * 70)}, ${Math.floor(140 - p * 120)})`);
        gradient.addColorStop(0.7, `rgb(${Math.floor(175 - p * 140)}, ${Math.floor(120 - p * 100)}, ${Math.floor(190 - p * 160)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(135 - p * 100)}, ${Math.floor(160 - p * 140)}, ${Math.floor(220 - p * 180)})`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Sun position - realistic sunset arc from south-center to southwest horizon
    // Sunset moves from center toward west as evening progresses
    const hourInEvening = Math.max(0, h - 16.5);
    const sunProgress = hourInEvening / 3.5;
    const sunX = W * (0.5 + sunProgress * 0.4); // Center to right/west
    const sunY = H * (0.25 + Math.pow(sunProgress, 0.9) * 0.65); // High to horizon
    
    // Setting sun with atmospheric distortion
    const sunGradient = ctx.createRadialGradient(sunX - 20, sunY - 20, 0, sunX, sunY, 120);
    sunGradient.addColorStop(0, `rgba(${Math.floor(255 - eveningProgress * 100)}, ${Math.floor(200 - eveningProgress * 150)}, ${Math.floor(150 - eveningProgress * 120)})`);
    sunGradient.addColorStop(0.35, `rgba(${Math.floor(255 - eveningProgress * 80)}, ${Math.floor(100 - eveningProgress * 50)}, ${Math.floor(30 - eveningProgress * 20)})`);
    sunGradient.addColorStop(0.7, `rgba(${Math.floor(200 - eveningProgress * 100)}, ${Math.floor(50 - eveningProgress * 40)}, ${Math.floor(10)})`);
    sunGradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
    
    ctx.beginPath();
    ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();
    
    // Sun core - slightly deformed at horizon
    const sunCoreGradient = ctx.createRadialGradient(sunX, sunY - 10, 0, sunX, sunY, 85);
    sunCoreGradient.addColorStop(0, `rgba(255, ${Math.floor(220 - eveningProgress * 150)}, ${Math.floor(150 - eveningProgress * 100)})`);
    sunCoreGradient.addColorStop(1, `rgba(255, ${Math.floor(120 - eveningProgress * 80)}, ${Math.floor(40 - eveningProgress * 30)})`);
    
    ctx.beginPath();
    ctx.ellipse(sunX, sunY, 80, 85 - eveningProgress * 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = sunCoreGradient;
    ctx.fill();
    
    // Dramatic sky rays from sun
    const rayGradient = ctx.createLinearGradient(sunX, sunY - 200, sunX, sunY - 400);
    rayGradient.addColorStop(0, `rgba(255, ${Math.floor(180 - eveningProgress * 150)}, 50, 0.1)`);
    rayGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
    
    ctx.beginPath();
    ctx.moveTo(sunX - 150, sunY - 100);
    ctx.quadraticCurveTo(sunX - 200, sunY - 250, sunX - 100, sunY - 400);
    ctx.lineTo(sunX + 100, sunY - 350);
    ctx.quadraticCurveTo(sunX + 200, sunY - 200, sunX + 150, sunY - 100);
    ctx.fillStyle = rayGradient;
    ctx.fill();
    
    // Clouds with evening color cast
    CLOUDS.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.3) cloud.x = -0.3;
        
        // Color shift clouds to match sunset
        const sunsetShade = Math.floor(200 + eveningProgress * 50);
        drawRealisticCloud(ctx, cloud.x * W, cloud.y * H, cloud.scale * W * 0.018, sunsetShade, 0.8 - eveningProgress * 0.2);
    });
    
    // Evening horizon glow
    const horizonGradient = ctx.createLinearGradient(0, H * 0.85, 0, H);
    horizonGradient.addColorStop(0, `rgba(255, ${Math.floor(150 - eveningProgress * 100)}, 50, 0)`);
    horizonGradient.addColorStop(1, `rgba(255, ${Math.floor(100 - eveningProgress * 80)}, 30, ${0.15 * (1 - eveningProgress)})`);
    ctx.fillStyle = horizonGradient;
    ctx.fillRect(0, H * 0.85, W, H * 0.15);
}

function drawNightSky(ctx, W, H, t) {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#000008');
    gradient.addColorStop(0.25, '#020015');
    gradient.addColorStop(0.5, '#030318');
    gradient.addColorStop(0.75, '#060b2e');
    gradient.addColorStop(1, '#0d1040');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Draw twinkling stars with realistic physics
    drawStars(ctx, W, H, 1, t);
    
    // Add Milky Way band
    const milkyWayGradient = ctx.createLinearGradient(W * 0.1, H * 0.2, W * 0.9, H * 0.8);
    milkyWayGradient.addColorStop(0, `rgba(200, 200, 220, 0)`);
    milkyWayGradient.addColorStop(0.3, `rgba(180, 200, 255, 0.03)`);
    milkyWayGradient.addColorStop(0.5, `rgba(200, 220, 255, 0.04)`);
    milkyWayGradient.addColorStop(0.7, `rgba(180, 200, 255, 0.03)`);
    milkyWayGradient.addColorStop(1, `rgba(150, 180, 220, 0)`);
    ctx.fillStyle = milkyWayGradient;
    ctx.fillRect(0, 0, W, H);
    
    // Add micro dust particles for depth
    ctx.fillStyle = `rgba(255, 255, 255, 0.01)`;
    for (let i = 0; i < 100; i++) {
        const x = Math.sin(i * 73 + t * 0.0001) * W;
        const y = Math.cos(i * 137 + t * 0.00008) * H;
        const size = (i % 3) * 0.3 + 0.1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Moonrise with realistic lunar phases
    const lunarPhase = getLunarPhase();
    
    // Calculate moon position (arc across sky)
    const moonX = W * (0.1 + lunarPhase * 0.8);
    const moonY = H * (0.75 - Math.sin(lunarPhase * Math.PI) * 0.5);
    
    drawMoon(ctx, moonX, moonY, 80, lunarPhase);
    
    // Moon glow/halo
    const moonGlowGradient = ctx.createRadialGradient(moonX, moonY, 80, moonX, moonY, 200);
    moonGlowGradient.addColorStop(0, `rgba(220, 220, 255, 0.15)`);
    moonGlowGradient.addColorStop(0.5, `rgba(150, 150, 200, 0.05)`);
    moonGlowGradient.addColorStop(1, `rgba(100, 100, 150, 0)`);
    ctx.fillStyle = moonGlowGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // Light from moon illuminating clouds (if any nearby)
    const moonLightGradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 600);
    moonLightGradient.addColorStop(0, `rgba(200, 200, 220, 0.08)`);
    moonLightGradient.addColorStop(1, `rgba(100, 100, 150, 0)`);
    ctx.fillStyle = moonLightGradient;
    ctx.fillRect(0, 0, W, H);
    
    // Shooting stars with more drama
    maybeSpawnShootingStar(t);
    if (shootingStar) {
        const age = t - shootingStar.start;
        if (age > shootingStar.dur) {
            shootingStar = null;
        } else {
            const progress = age / shootingStar.dur;
            const opacity = Math.sin(progress * Math.PI) * 0.9;
            
            // Shooting star trail
            const startX = shootingStar.x * W;
            const startY = shootingStar.y * H;
            const endX = (shootingStar.x - shootingStar.len * progress) * W;
            const endY = (shootingStar.y + shootingStar.len * progress * 0.6) * H;
            
            // Gradient trail
            const trailGradient = ctx.createLinearGradient(startX, startY, endX, endY);
            trailGradient.addColorStop(0, `rgba(255, 255, 220, ${opacity})`);
            trailGradient.addColorStop(0.5, `rgba(220, 220, 255, ${opacity * 0.7})`);
            trailGradient.addColorStop(1, `rgba(150, 150, 255, 0)`);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = trailGradient;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            // Head glow
            ctx.beginPath();
            ctx.arc(startX, startY, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 220, ${opacity * 1.5})`;
            ctx.fill();
        }
    }
    
    // City lights at horizon
    const cityGradient = ctx.createLinearGradient(0, H * 0.92, 0, H);
    cityGradient.addColorStop(0, `rgba(255, 200, 100, 0)`);
    cityGradient.addColorStop(1, `rgba(255, 180, 50, 0.12)`);
    ctx.fillStyle = cityGradient;
    ctx.fillRect(0, H * 0.92, W, H * 0.08);
    
    // Random city lights (simplified)
    ctx.fillStyle = `rgba(255, 200, 80, 0.6)`;
    for (let i = 0; i < 15; i++) {
        const x = Math.sin(i * 47 + t * 0.00005) * W * 0.5 + W * 0.25;
        const y = H * (0.94 + Math.random() * 0.04);
        const size = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawWeatherEffect(ctx, W, H, t) {
    if (!currentWeather) return;
    
    const { main } = currentWeather;
    
    if (main === 'Rain') {
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(t * 0.004 + i) * W + W) % W;
            const y = (t * 4 + i * 20) % H;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 2, y + 8);
            ctx.strokeStyle = 'rgba(100,150,200,0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    } else if (main === 'Snow') {
        for (let i = 0; i < 30; i++) {
            const x = (Math.sin(t * 0.002 + i) * W + W) % W;
            const y = (t * 1.5 + i * 30) % H;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.6 - Math.sin(t * 0.003 + i) * 0.3})`;
            ctx.fill();
        }
    } else if (main === 'Thunderstorm') {
        if ((t % 25000) > 24900) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(0, 0, W, H);
        }
    } else if (main === 'Mist' || main === 'Fog') {
        for (let i = 0; i < 3; i++) {
            const y = H * (0.3 + i * 0.2);
            const x = (t * 0.02 + i * 200) % W;
            ctx.beginPath();
            ctx.ellipse(x, y, 300, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fill();
        }
    }
}

function renderSkyCanvas(mode) {
    if (!skyCtx || !skyCanvas) return;
    
    const startTime = Date.now();
    
    function animate() {
        if (document.hidden) {
            skyAnimationFrameId = requestAnimationFrame(animate);
            return;
        }
        
        const t = Date.now() - startTime;
        const W = skyCanvas.width;
        const H = skyCanvas.height;
        
        skyCtx.clearRect(0, 0, W, H);
        
        switch (mode) {
            case 'dawn':      drawDawnSky(skyCtx, W, H, t); break;
            case 'morning':   drawMorningSky(skyCtx, W, H, t); break;
            case 'afternoon': drawAfternoonSky(skyCtx, W, H, t); break;
            case 'evening':   drawEveningSky(skyCtx, W, H, t); break;
            case 'night':     drawNightSky(skyCtx, W, H, t); break;
        }
        
        drawWeatherEffect(skyCtx, W, H, t);
        
        skyAnimationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
}

// ═══════════════════════════════════════════════════════════
//  SKY MODE DROPDOWN & LIVE CLOCK
// ═══════════════════════════════════════════════════════════

function initSkyModeDropdown() {
    const btn = document.getElementById('skyModeBtn');
    const dropdown = document.getElementById('skyModeDropdown');
    const autoToggle = document.getElementById('skyAutoToggle');
    
    if (!btn || !dropdown) return;
    
    btn.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });
    
    document.querySelectorAll('.sky-mode-option').forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            setSkyMode(mode, true);
            
            document.querySelectorAll('.sky-mode-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            dropdown.classList.remove('open');
        });
    });
    
    if (autoToggle) {
        autoToggle.addEventListener('change', () => {
            manualOverride = !autoToggle.checked;
            if (!manualOverride) {
                setSkyMode(getCurrentSkyMode());
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = (h % 12 || 12).toString().padStart(2, '0');
    
    const timeEl = document.getElementById('clockTime');
    const ampmEl = document.getElementById('clockAMPM');
    if (timeEl) timeEl.textContent = `${h12}:${m}`;
    if (ampmEl) ampmEl.textContent = ampm;
}

setInterval(updateClock, 30000);
updateClock();

// ═══════════════════════════════════════════════════════════
//  WEATHER INTEGRATION
// ═══════════════════════════════════════════════════════════

async function fetchWeather() {
    const widget = document.getElementById('weatherWidget');
    if (!widget) return;
    
    function getWeatherIconClass(id) {
        if (id >= 200 && id < 233) return 'fa-bolt stormy';
        if (id >= 300 && id < 532) return 'fa-cloud-rain rainy';
        if (id >= 600 && id < 623) return 'fa-snowflake snowy';
        if (id >= 700 && id < 782) return 'fa-smog cloudy';
        if (id === 800) {
            const h = new Date().getHours();
            return h >= 6 && h < 20 ? 'fa-sun sunny' : 'fa-moon night';
        }
        if (id > 800) return 'fa-cloud cloudy';
        return 'fa-cloud cloudy';
    }
    
    try {
        if (!OWM_KEY || OWM_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            widget.innerHTML = '<div style="padding:10px;font-size:0.8rem;color:var(--muted)">⚠️ Weather API not configured</div>';
            return;
        }
        
        const success = (pos) => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${OWM_KEY}&units=metric`)
                .then(r => r.json())
                .then(data => {
                    currentWeather = data;
                    const iconClass = getWeatherIconClass(data.weather[0].id);
                    const [icon, condition] = iconClass.split(' ');
                    
                    document.getElementById('wwTemp').textContent = `${Math.round(data.main.temp)}°C`;
                    document.getElementById('wwCity').textContent = data.name;
                    document.querySelector('.ww-icon').className = `ww-icon ww-icon-${condition} fas ${icon}`;
                    document.getElementById('wwCondition').textContent = data.weather[0].main;
                    document.getElementById('wwHumidity').textContent = `${data.main.humidity}%`;
                    document.getElementById('wwWind').textContent = `${data.wind.speed.toFixed(1)}m/s`;
                })
                .catch(() => {
                    widget.innerHTML = '<div style="padding:10px;font-size:0.8rem;color:var(--muted)">⚠️ Weather unavailable</div>';
                });
        };
        
        const error = () => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Sahiwal,PK&appid=${OWM_KEY}&units=metric`)
                .then(r => r.json())
                .then(data => {
                    currentWeather = data;
                    const iconClass = getWeatherIconClass(data.weather[0].id);
                    const [icon, condition] = iconClass.split(' ');
                    
                    document.getElementById('wwTemp').textContent = `${Math.round(data.main.temp)}°C`;
                    document.getElementById('wwCity').textContent = data.name;
                    document.querySelector('.ww-icon').className = `ww-icon ww-icon-${condition} fas ${icon}`;
                    document.getElementById('wwCondition').textContent = data.weather[0].main;
                    document.getElementById('wwHumidity').textContent = `${data.main.humidity}%`;
                    document.getElementById('wwWind').textContent = `${data.wind.speed.toFixed(1)}m/s`;
                });
        };
        
        navigator.geolocation.getCurrentPosition(success, error);
    } catch (e) {
        console.warn('Weather fetch failed:', e);
    }
}

// Weather widget collapse toggle
const wwCollapse = document.getElementById('wwCollapse');
const weatherWidget = document.getElementById('weatherWidget');
if (wwCollapse && weatherWidget) {
    wwCollapse.addEventListener('click', () => {
        weatherWidget.classList.toggle('collapsed');
        const icon = wwCollapse.querySelector('i');
        icon.className = weatherWidget.classList.contains('collapsed') ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    });
}

// ═══════════════════════════════════════════════════════════
//  SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) progressBar.style.transform = `scaleX(${scrolled})`;
}, { passive: true });

// ═══════════════════════════════════════════════════════════
//  SKY SYSTEM INITIALIZATION
// ═══════════════════════════════════════════════════════════
function initSkySystem() {
    resizeSkyCanvas();
    setSkyMode(getCurrentSkyMode());
    fetchWeather();
    initSkyModeDropdown();
    
    // Auto-update sky mode every minute
    setInterval(() => {
        if (!manualOverride) {
            const newMode = getCurrentSkyMode();
            if (newMode !== activeSkyMode) {
                // Smooth transition
                setSkyMode(newMode);
            }
        }
    }, 60000);
    
    // Refresh weather every 30 minutes
    setInterval(() => {
        fetchWeather();
    }, 30 * 60 * 1000);
}
function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    if (typeof gsap !== 'undefined') {
        gsap.to(pre, {
            opacity: 0, duration: 0.8, delay: 0.3,
            onComplete: () => {
                pre.style.display = 'none';
                afterLoad();
            }
        });
    } else {
        setTimeout(() => { pre.style.display = 'none'; afterLoad(); }, 500);
    }
}

window.addEventListener('load', hidePreloader);

function afterLoad() {
    initSkySystem();
    initTyped();
    initAOS();
    initAnimations();
    initActiveNav();
    fetchTestimonials();
    setTimeout(init3D, 350);
}

// ═══════════════════════════════════════════════════════════
//  §2  TYPED ANIMATION
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §3  AOS — ANIMATE ON SCROLL (FIXED)
// ═══════════════════════════════════════════════════════════
function initAOS() {
    const els = document.querySelectorAll('[data-aos]');
    if (!els.length) return;

    // Immediately show elements already in viewport
    els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
            const delay = parseInt(el.dataset.aosDelay || 0);
            setTimeout(() => el.classList.add('aos-animate'), delay + 100);
        }
    });

    // Watch remaining elements
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
// ═══════════════════════════════════════════════════════════
//  §4  GSAP ANIMATIONS
// ═══════════════════════════════════════════════════════════
function initAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    // Force hero visible first — no matter what
    gsap.set([
        '.hero-chips', '.hero-title', '.hero-sub',
        '.hero-btns', '.hero-socials', '.stack-pills',
        '.profile-card-3d', '.fl-chip', '.hero-content', '.hero-visual'
    ], { opacity: 1, y: 0, x: 0, scale: 1, visibility: 'visible', clearProps: 'transform' });

    // Then animate on desktop
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
    // Scroll pin for showcase canvas
    if (window.innerWidth > 600) {
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.from(el, {
                opacity: 0, x: -25, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });
    }

// ═══════════════════════════════════════════════════════════
//  §5  THEME TOGGLE
// ═══════════════════════════════════════════════════════════
const htmlEl   = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

htmlEl.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        const next   = isDark ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(themeBtn,
                { scale: 0.8, rotate: -30 },
                { scale: 1,   rotate: 0, duration: 0.4, ease: 'back.out(2)' }
            );
        }
    });
}

// ═══════════════════════════════════════════════════════════
//  §6  NAVBAR — SCROLL SHRINK + ACTIVE LINK
// ═══════════════════════════════════════════════════════════
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Inject scrolled style
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

// ═══════════════════════════════════════════════════════════
//  §7  HAMBURGER / MOBILE MENU
// ═══════════════════════════════════════════════════════════
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.m-link').forEach(l => {
        l.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ═══════════════════════════════════════════════════════════
//  §8  CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════
(function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (typeof gsap === 'undefined') return;

    const dot     = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;

    const xTo = gsap.quickTo(outline, 'left', { duration: 0.16, ease: 'power3' });
    const yTo = gsap.quickTo(outline, 'top',  { duration: 0.16, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
        gsap.set(dot, { left: e.clientX, top: e.clientY });
        xTo(e.clientX); yTo(e.clientY);
    });

    // Magnetic effect on interactive elements
    const magnets = document.querySelectorAll('.btn-primary, .btn-outline, .soc-btn, .nav-link');
    magnets.forEach(m => {
        m.addEventListener('mousemove', (e) => {
            const r  = m.getBoundingClientRect();
            const xP = (e.clientX - r.left - r.width  / 2) * 0.28;
            const yP = (e.clientY - r.top  - r.height / 2) * 0.28;
            gsap.to(m, { x: xP, y: yP, duration: 0.3, ease: 'power2.out' });
            gsap.to(outline, { scale: 1.6, borderColor: 'transparent', backgroundColor: 'rgba(99,102,241,.12)', duration: 0.3 });
        });
        m.addEventListener('mouseleave', () => {
            gsap.to(m, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
            gsap.to(outline, { scale: 1, borderColor: 'rgba(99,102,241,.5)', backgroundColor: 'transparent', duration: 0.3 });
        });
    });

    // Scale up on clickable elements
    document.querySelectorAll('button, a, [onclick]').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(outline, { scale: 1.4, duration: 0.25 }));
        el.addEventListener('mouseleave', () => gsap.to(outline, { scale: 1,   duration: 0.25 }));
    });
})();

// ═══════════════════════════════════════════════════════════
//  §9  SKILLS TABS
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(`tab-${btn.dataset.tab}`);
        if (panel) panel.classList.add('active');
    });
});

// ═══════════════════════════════════════════════════════════
//  §10  PROJECT FILTERS
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;

        document.querySelectorAll('.proj-card').forEach(card => {
            const show = f === 'all' || card.dataset.category === f;
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

// ═══════════════════════════════════════════════════════════
//  §11  MODALS
// ═══════════════════════════════════════════════════════════
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

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => {
        if (e.target === m) window.closeModal(m.id);
    });
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const m = btn.closest('.modal-overlay');
        if (m) window.closeModal(m.id);
    });
});

// Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => window.closeModal(m.id));
        closeLightboxInternal();
    }
});

// ═══════════════════════════════════════════════════════════
//  §12  LIGHTBOX
// ═══════════════════════════════════════════════════════════
window.openLightbox = (el) => {
    const img = el.querySelector('img');
    if (!img) return;
    document.getElementById('lb-img').src = img.src;
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

// ═══════════════════════════════════════════════════════════
//  §13  FIREBASE AUTH
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §14  STAR RATING
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §15  FEEDBACK FORM
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §16  CONTACT FORM
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §17  FETCH TESTIMONIALS
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §18  TOAST
// ═══════════════════════════════════════════════════════════
function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className        = `toast-notification ${type}`;
    t.innerText        = msg;
    t.style.background = type === 'success' ? '#10b981' : '#ef4444';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

// ═══════════════════════════════════════════════════════════
//  §19  THREE.JS — 3D SHOWCASE
// ═══════════════════════════════════════════════════════════
function init3D() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || typeof THREE === 'undefined') {
        console.warn('Three.js or canvas not available');
        return;
    }

    const W = canvas.offsetWidth  || 900;
    const H = canvas.offsetHeight || 540;

    // ── Scene & Camera ────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 1000);
    camera.position.set(0, 0, 10.5);

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Lights ────────────────────────────────────────────
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

    // ── Project Data (9 projects) ─────────────────────────
    const PROJECTS = [
        { title: 'InterviewMate AI',  sub: 'MERN · FastAPI · Gemini',     icon: '🤖', color: '#6366f1', id: 'm-interviewmate' },
        { title: 'TarseelX',          sub: 'React Native · Firebase',      icon: '🚚', color: '#f59e0b', id: 'm-tarseelx'      },
        { title: 'Mandi Pro ERP',     sub: 'Flutter · Dart · Firebase',    icon: '📊', color: '#3b82f6', id: 'm-mandi'         },
        { title: 'Itthad Food App',   sub: 'Flutter · Supabase',           icon: '🏭', color: '#10b981', id: 'm-itthad'        },
        { title: 'Saqib Shop POS',    sub: 'Flutter · Dart',               icon: '🛒', color: '#8b5cf6', id: 'm-saqib'         },
        { title: 'Hotel System',      sub: 'Java · Swing · MySQL',         icon: '🏨', color: '#06b6d4', id: 'm-hotel'         },
        { title: 'Quiz Game',         sub: 'HTML · CSS · JavaScript',      icon: '🎮', color: '#ef4444', id: 'm-quiz'          },
        { title: 'Python Logic',      sub: 'Python · Algorithms',          icon: '🐍', color: '#3776AB', id: 'm-python'        },
        { title: 'Portfolio Site',    sub: 'HTML · Three.js · GSAP',       icon: '🌐', color: '#f59e0b', id: 'modal-feedback'  },
    ];

    // ── Helper — rounded rect ─────────────────────────────
    function rr(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y,     x + w, y + r,     r);
        ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h); ctx.arcTo(x,     y + h, x,     y + h - r, r);
        ctx.lineTo(x, y + r);     ctx.arcTo(x,     y,     x + r, y,         r);
        ctx.closePath();
    }

    // ── Build card textures ───────────────────────────────
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    function buildTexture(proj) {
        const tc   = document.createElement('canvas');
        tc.width   = 560;
        tc.height  = 340;
        const ctx  = tc.getContext('2d');
        const dark = isDark();

        // Background
        ctx.fillStyle = dark ? '#0c1628' : '#ffffff';
        rr(ctx, 0, 0, 560, 340, 24);
        ctx.fill();

        // Gradient overlay
        const grad = ctx.createLinearGradient(0, 0, 560, 340);
        grad.addColorStop(0, proj.color + (dark ? '22' : '14'));
        grad.addColorStop(1, 'transparent');
        rr(ctx, 0, 0, 560, 340, 24);
        ctx.fillStyle = grad;
        ctx.fill();

        // Top accent bar
        const barGrad = ctx.createLinearGradient(0, 0, 560, 0);
        barGrad.addColorStop(0, proj.color);
        barGrad.addColorStop(1, proj.color + '80');
        ctx.fillStyle = barGrad;
        ctx.fillRect(0, 0, 560, 5);

        // Border
        ctx.strokeStyle = proj.color + '55';
        ctx.lineWidth   = 1.5;
        rr(ctx, 1, 1, 558, 338, 23);
        ctx.stroke();

        // Corner dot accents
        const corners = [[24, 24], [536, 24], [24, 316], [536, 316]];
        corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = proj.color + '60';
            ctx.fill();
        });

        // Icon background circle
        ctx.beginPath();
        ctx.arc(280, 100, 44, 0, Math.PI * 2);
        ctx.fillStyle = proj.color + (dark ? '30' : '18');
        ctx.fill();
        ctx.strokeStyle = proj.color + '40';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Emoji icon
        ctx.font      = '52px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(proj.icon, 280, 100);

        // Title
        ctx.fillStyle    = dark ? '#f1f5f9' : '#0f172a';
        ctx.font         = 'bold 30px "Space Grotesk", Arial, sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(proj.title, 280, 182);

        // Subtitle
        ctx.fillStyle = dark ? '#94a3b8' : '#64748b';
        ctx.font      = '18px "Outfit", Arial, sans-serif';
        ctx.fillText(proj.sub, 280, 214);

        // Divider line
        ctx.strokeStyle = proj.color + '30';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(100, 238); ctx.lineTo(460, 238);
        ctx.stroke();

        // CTA pill
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

    // ── Create card meshes ────────────────────────────────
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

    // ── Edge glow rings ───────────────────────────────────
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

    // ── Floating particles ────────────────────────────────
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

    // ── Raycaster (click + hover) ─────────────────────────
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

    // ── Mouse parallax ────────────────────────────────────
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

    // Touch support
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

    // ── Animation loop ────────────────────────────────────
    let autoAngle = 0;
    let paused    = false;

    // Pause rotation when modal is open
    const ob = new MutationObserver(() => {
        paused = document.body.style.overflow === 'hidden';
    });
    ob.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now() * 0.001;

        if (!paused) autoAngle += 0.0038;

        // Orbit cards
        cards.forEach(({ mesh, angle }, i) => {
            const a  = angle + autoAngle;
            mesh.position.x = Math.cos(a) * ORBIT_R;
            mesh.position.z = Math.sin(a) * ORBIT_R;
            mesh.position.y = Math.sin(now * 0.55 + angle * 1.8) * 0.42;
            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);

            // Slight tilt towards center
            const dist  = mesh.position.distanceTo(camera.position);
            mesh.material.opacity = 0.7 + (1 / dist) * 2.5;
        });

        // Camera parallax
        camera.rotation.x += (targetRX - camera.rotation.x) * 0.04;
        camera.rotation.y += (targetRY - camera.rotation.y) * 0.04;

        // Rotate particles
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        // Pulse rings
        ringMat.opacity = 0.07 + Math.sin(now * 1.5) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    // ── Resize ────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
//  §20  SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  §21  BACK TO TOP ON LOGO CLICK
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.logo').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ═══════════════════════════════════════════════════════════
//  §22  LIGHTBOX CSS INJECT (active state)
// ═══════════════════════════════════════════════════════════
const lbStyle = document.createElement('style');
lbStyle.textContent = `
.lightbox.active{display:flex!important}
.modal-overlay.active{display:flex!important}
`;
document.head.appendChild(lbStyle);

console.log('🚀 Portfolio script v3.0 loaded — Muhammad Irfan Waseem');
