import {projects} from './projects.js';
import {openProject} from './project-ui.js';
export function init3D() {
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

    
    const PROJECTS = projects.map((project, index) => ({
        title: project.title, sub: project.tags.slice(0, 3).join(' · '),
        icon: project.category.includes('mobile') ? '📱' : '💻',
        color: ['#818cf8', '#22d3ee', '#c084fc'][index % 3], id: project.id
    }));
    document.querySelector('.canvas-tag-l').textContent = PROJECTS.length + ' projects';

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
                if (hoveredIdx >= 0) cards[hoveredIdx].mesh.scale.setScalar(1);
                hoveredIdx = idx;
                cards[idx].mesh.scale.setScalar(1.08);
            }
            canvas.style.cursor = 'pointer';
        } else {
            if (hoveredIdx >= 0) {
                cards[hoveredIdx].mesh.scale.setScalar(1);
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
                openProject(cards[idx].proj.id, document.getElementById('enable-orbit'));
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
            if (idx >= 0) openProject(cards[idx].proj.id, document.getElementById('enable-orbit'));
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
        if (!isVisible || matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;
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
