document.addEventListener("DOMContentLoaded", () => {
    const introContainer = document.getElementById('space-intro-container');
    const canvas = document.getElementById('space-intro-canvas');
    const bzLogo = document.getElementById('intro-bz-logo');

    if (!introContainer || !canvas || !bzLogo) return;

    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    const stars = [];
    const numStars = 400; // Reduced from 800
    let speed = 0.5;

    class Star {
        constructor() {
            this.x = Math.random() * w - w / 2;
            this.y = Math.random() * h - h / 2;
            this.z = Math.random() * w;
            this.pz = this.z;
        }

        update() {
            this.z -= speed;
            if (this.z < 1) {
                this.z = w;
                this.x = Math.random() * w - w / 2;
                this.y = Math.random() * h - h / 2;
                this.pz = this.z;
            }
        }

        draw() {
            const sx = (this.x / this.z) * w + w / 2;
            const sy = (this.y / this.z) * w + h / 2;
            const px = (this.x / this.pz) * w + w / 2;
            const py = (this.y / this.pz) * w + h / 2;
            this.pz = this.z;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 230, 240, ${1 - this.z / w})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }
    }

    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    let animationId;
    function animate() {
        ctx.fillStyle = 'rgba(10, 5, 15, 0.5)';
        ctx.fillRect(0, 0, w, h);
        
        stars.forEach(s => {
            s.update();
            s.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();

    // Sequence
    setTimeout(() => {
        // 1. Warp speed acceleration
        const spdObj = { s: speed };
        gsap.to(spdObj, {
            s: 60,
            duration: 0.8,
            ease: "power2.in",
            onUpdate: () => speed = spdObj.s
        });
    }, 100);

    setTimeout(() => {
        // 2. Sudden brake
        const spdObj = { s: speed };
        gsap.to(spdObj, {
            s: 0.2,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: () => speed = spdObj.s
        });
    }, 1400);

    setTimeout(() => {
        // 3. Show BZ Logo
        bzLogo.classList.add('visible');
    }, 2100);

    setTimeout(() => {
        // 4. Fade out
        introContainer.style.pointerEvents = 'none';
        gsap.to(introContainer, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            onComplete: () => {
                introContainer.style.display = 'none';
                cancelAnimationFrame(animationId);
            }
        });
    }, 3200);

    // FALLBACK: force hide after 5s
    setTimeout(() => {
        if (introContainer.style.display !== 'none') {
            introContainer.style.opacity = '0';
            setTimeout(() => {
                introContainer.style.display = 'none';
                cancelAnimationFrame(animationId);
            }, 400);
        }
    }, 5000); 
});
