// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Dynamic Title Animation
const heroChars = document.querySelectorAll('.hero-text .char');
const heroSubtitle = document.querySelector('.hero-subtitle');

if (heroChars.length > 0) {
    // Set initial state — chars hidden with fade
    gsap.set(heroChars, {
        opacity: 0,
        y: 30,
    });

    // Entrance timeline — clean fade in
    const heroTL = gsap.timeline({ delay: 0.3 });

    heroTL.to(heroChars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: {
            each: 0.04,
            from: 'start',
        },
        ease: 'power3.out',
    });

    // Magnetic wave on hover — neighboring chars also react
    heroChars.forEach((char, i) => {
        char.addEventListener('mouseenter', () => {
            // Current char
            gsap.to(char, {
                y: -14,
                scale: 1.15,
                duration: 0.25,
                ease: 'back.out(2)',
            });
            // Neighbors
            const prev = heroChars[i - 1];
            const next = heroChars[i + 1];
            if (prev) gsap.to(prev, { y: -6, scale: 1.05, duration: 0.25, ease: 'power2.out' });
            if (next) gsap.to(next, { y: -6, scale: 1.05, duration: 0.25, ease: 'power2.out' });
        });
        char.addEventListener('mouseleave', () => {
            gsap.to(char, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
            const prev = heroChars[i - 1];
            const next = heroChars[i + 1];
            if (prev) gsap.to(prev, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
            if (next) gsap.to(next, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
        });
    });
}

// Header fade out on scroll
gsap.to('header', {
    opacity: 0,
    y: -20,
    duration: 0.3,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '40% top',
        scrub: true,
    }
});

// Bento Grid Animation (Scoped by Section)
const sections = document.querySelectorAll('.content');

sections.forEach(section => {
    // Select both the title and the grid items within this section
    const elements = section.querySelectorAll('.section-title, .bento-box');

    gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
        }
    });
});

// Theme Toggle
const themeToggleBtn = document.querySelector('.theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// =============================================
// Particle System — Canvas + Physics (High Performance)
// =============================================
const canvas = document.getElementById('particleCanvas');
const heroSection = document.querySelector('.hero');
const heroTexts = document.querySelectorAll('.hero-text');

if (canvas && heroSection) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const particleCount = 400;

    let mouseX = -9999, mouseY = -9999;
    const repulsionRadius = 180;
    const repulsionRadiusSq = repulsionRadius * repulsionRadius;
    const repulsionStrength = 0.8;

    let heroW = 0, heroH = 0;
    let textColliders = [];
    // Circle logic removed

    // Particle data (struct-of-arrays for cache performance)
    const px = new Float32Array(particleCount);
    const py = new Float32Array(particleCount);
    const pvx = new Float32Array(particleCount);
    const pvy = new Float32Array(particleCount);
    const pSize = new Float32Array(particleCount);
    const pAlpha = new Float32Array(particleCount);

    function getAccentColor() {
        const style = getComputedStyle(document.body);
        return style.getPropertyValue('--accent-color').trim() || '#03C75A';
    }
    let accentColor = getAccentColor();

    function resizeCanvas() {
        heroW = heroSection.offsetWidth;
        heroH = heroSection.offsetHeight;
        canvas.width = heroW * dpr;
        canvas.height = heroH * dpr;
        canvas.style.width = heroW + 'px';
        canvas.style.height = heroH + 'px';
        ctx.scale(dpr, dpr);

        // Circle logic removed

        // Text colliders
        const heroRect = heroSection.getBoundingClientRect();
        textColliders = [];
        heroTexts.forEach(t => {
            const r = t.getBoundingClientRect();
            textColliders.push({
                x: r.left - heroRect.left,
                y: r.top - heroRect.top,
                w: r.width,
                h: r.height
            });
        });
    }

    // Init particles
    function initParticles() {
        const w = heroW || 1400;
        const h = heroH || 800;
        for (let i = 0; i < particleCount; i++) {
            px[i] = Math.random() * w;
            py[i] = Math.random() * h;
            const speed = 0.2 + Math.random() * 0.6;
            const angle = Math.random() * Math.PI * 2;
            pvx[i] = Math.cos(angle) * speed;
            pvy[i] = Math.sin(angle) * speed;
            pSize[i] = [0.5, 1, 1.5, 2, 2.5][Math.floor(Math.random() * 5)];
            pAlpha[i] = Math.random() * 0.5 + 0.1;
        }
    }

    resizeCanvas();
    initParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        accentColor = getAccentColor();
    });
    window.addEventListener('load', () => setTimeout(resizeCanvas, 200));

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    // Theme observer — update accent color when theme changes
    const themeObserver = new MutationObserver(() => {
        accentColor = getAccentColor();
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    // --- Main loop ---
    function simulate() {
        const damping = 0.997;
        const bounce = 0.5;
        const pad = 3;
        const tcLen = textColliders.length;

        // Pulse logic removed

        // Physics
        for (let i = 0; i < particleCount; i++) {
            let x = px[i], y = py[i], vx = pvx[i], vy = pvy[i];

            // 1) Mouse repulsion (cubic falloff)
            const mdx = x - mouseX;
            const mdy = y - mouseY;
            const mDistSq = mdx * mdx + mdy * mdy;
            if (mDistSq < repulsionRadiusSq && mDistSq > 1) {
                const mDist = Math.sqrt(mDistSq);
                const t = 1 - mDist / repulsionRadius;
                const force = t * t * t * repulsionStrength;
                const invD = 1 / mDist;
                vx += mdx * invD * force;
                vy += mdy * invD * force;
            }

            // 2) Random drift
            vx += (Math.random() - 0.5) * 0.03;
            vy += (Math.random() - 0.5) * 0.03;

            // 3) Integrate
            x += vx;
            y += vy;

            // 4) Damping
            vx *= damping;
            vy *= damping;

            // 5) Boundary
            if (x < 0) { x = 0; vx = Math.abs(vx) * bounce; }
            if (x > heroW) { x = heroW; vx = -Math.abs(vx) * bounce; }
            if (y < 0) { y = 0; vy = Math.abs(vy) * bounce; }
            if (y > heroH) { y = heroH; vy = -Math.abs(vy) * bounce; }

            // Circle boundary removed

            // 7) Text collision
            for (let j = 0; j < tcLen; j++) {
                const tc = textColliders[j];
                if (x > tc.x - pad && x < tc.x + tc.w + pad &&
                    y > tc.y - pad && y < tc.y + tc.h + pad) {
                    const oL = (x + pad) - tc.x;
                    const oR = (tc.x + tc.w) - (x - pad);
                    const oT = (y + pad) - tc.y;
                    const oB = (tc.y + tc.h) - (y - pad);
                    const min = Math.min(oL, oR, oT, oB);
                    if (min === oL) { x = tc.x - pad; vx = -Math.abs(vx) * bounce; }
                    else if (min === oR) { x = tc.x + tc.w + pad; vx = Math.abs(vx) * bounce; }
                    else if (min === oT) { y = tc.y - pad; vy = -Math.abs(vy) * bounce; }
                    else { y = tc.y + tc.h + pad; vy = Math.abs(vy) * bounce; }
                }
            }

            px[i] = x; py[i] = y; pvx[i] = vx; pvy[i] = vy;
        }

        // Render (single Canvas draw pass)
        ctx.clearRect(0, 0, heroW, heroH);

        // Draw ring removed

        // Draw particles (grouped by alpha for fewer state changes)
        ctx.fillStyle = accentColor;
        for (let i = 0; i < particleCount; i++) {
            ctx.globalAlpha = pAlpha[i];
            ctx.beginPath();
            ctx.arc(px[i], py[i], pSize[i], 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(simulate);
    }

    simulate();
}
