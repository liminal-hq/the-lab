// --------------------------------------------------------------------------
//  THE GRAPHICS ENGINE (or "The Rat Vision 3000")
// --------------------------------------------------------------------------
//  Painting the world one pixel at a time.
//  Usually brown. Or grey. Occasionally pizza-colored.
//
//      (\_/)
//      (x.x)  <-- "I stayed up all night coding this shader!"
//      (> <)
// --------------------------------------------------------------------------

export class GraphicsEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.cameraX = 0; // The all-seeing eye
        this.level = 'SURFACE'; // Default level
    }

    clear() {
        if (this.level === 'SUBWAY') {
            this.ctx.fillStyle = '#111'; // Pitch black tunnel
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            // Red sky apocalypse! (The lyrics said "apocalypse man-made")
            const progress = this.levelProgress || 0;
            const r = Math.floor(139 * (1 - progress));
            const b = Math.floor(34 * progress);

            const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
            grad.addColorStop(0, `rgb(${r}, 0, ${b})`); // Fading to night
            grad.addColorStop(1, '#222');    // Dark city horizon
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    drawCity(buildings) {
        if (this.level === 'SURFACE') {
            // Draw moon/sun (The big cheese in the sky)
            const progress = this.levelProgress || 0;
            const sunY = 100 + (progress * 300); // Sun sets

            this.ctx.fillStyle = '#ff4444'; // Red sun for the apocalypse
            this.ctx.beginPath();
            this.ctx.arc(this.width - 100, sunY, 40, 0, Math.PI * 2);
            this.ctx.fill();
        }

        for (const b of buildings) {
            const screenX = b.x - this.cameraX;
            // Cull off-screen buildings (If a tree falls and no rat hears it...)
            if (screenX + b.w > -100 && screenX < this.width + 100) {
                this.ctx.fillStyle = b.color || '#444';

                if (this.level === 'SUBWAY') {
                    // Tunnel walls / pillars
                    this.ctx.fillRect(screenX, 0, b.w, this.height);
                    // Add some detail
                    this.ctx.fillStyle = '#222';
                    this.ctx.fillRect(screenX + 10, 10, b.w - 20, this.height - 20);
                } else {
                    // Regular buildings
                    this.ctx.fillRect(screenX, this.height - b.h, b.w, b.h);

                    // Windows (Human cages)
                    this.ctx.fillStyle = '#FFD700'; // Yellow lights
                    // Simple window logic
                    for (let wx = screenX + 5; wx < screenX + b.w - 5; wx += 20) {
                        for (let wy = this.height - b.h + 10; wy < this.height - 10; wy += 30) {
                            if ((wx * wy) % 3 !== 0) {
                                this.ctx.fillRect(wx, wy, 10, 20);
                            }
                        }
                    }
                }
            }
        }

        // Ground (The floor is lava? No, the floor is concrete.)
        this.ctx.fillStyle = this.level === 'SUBWAY' ? '#222' : '#333';
        this.ctx.fillRect(0, this.height - 20, this.width, 20);

        // Subway Tracks
        if (this.level === 'SUBWAY') {
            this.ctx.strokeStyle = '#555';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height - 15);
            this.ctx.lineTo(this.width, this.height - 15);
            this.ctx.stroke();

            // Ties
            for (let i = -(this.cameraX % 40); i < this.width; i += 40) {
                this.ctx.fillStyle = '#3d2e1e';
                this.ctx.fillRect(i, this.height - 18, 10, 6);
            }
        }
    }

    drawObstacles(obstacles) {
        // Drawing the dangers of the modern world.
        //      !
        //    (o.o)
        //    ( > )
        for (const obs of obstacles) {
            const screenX = obs.x - this.cameraX;
            // Cull off-screen
            if (screenX + obs.w > -100 && screenX < this.width + 100) {
                 const screenY = this.height - 20 - obs.h; // On the ground

                 if (obs.type === 'BOX') {
                     // A delicious cardboard box
                     this.ctx.fillStyle = '#A0522D'; // Sienna
                     this.ctx.fillRect(screenX, screenY, obs.w, obs.h);

                     // Tape details
                     this.ctx.fillStyle = '#D2B48C'; // Tan tape
                     this.ctx.fillRect(screenX, screenY + obs.h/2 - 2, obs.w, 4);

                 } else if (obs.type === 'TRAP') {
                     // A nasty trap
                     this.ctx.fillStyle = '#708090'; // SlateGrey
                     this.ctx.beginPath();
                     // Spikes
                     this.ctx.moveTo(screenX, screenY + obs.h);
                     this.ctx.lineTo(screenX + obs.w * 0.25, screenY);
                     this.ctx.lineTo(screenX + obs.w * 0.5, screenY + obs.h);
                     this.ctx.lineTo(screenX + obs.w * 0.75, screenY);
                     this.ctx.lineTo(screenX + obs.w, screenY + obs.h);
                     this.ctx.fill();

                     // Danger colour
                     this.ctx.fillStyle = '#FF4500'; // OrangeRed
                     this.ctx.fillRect(screenX + obs.w/2 - 2, screenY + obs.h - 5, 4, 4);

                 } else if (obs.type === 'PRIUS') {
                     // The Prius - Silent but deadly (for the back seat)
                     this.ctx.fillStyle = '#5A9BD4'; // Blueish
                     this.ctx.beginPath();
                     this.ctx.moveTo(screenX, screenY + obs.h);
                     this.ctx.lineTo(screenX, screenY + 15); // Bumper
                     this.ctx.lineTo(screenX + 15, screenY + 5); // Hood
                     this.ctx.lineTo(screenX + 30, screenY); // Windshield
                     this.ctx.lineTo(screenX + obs.w - 20, screenY); // Roof
                     this.ctx.lineTo(screenX + obs.w, screenY + 15); // Hatch
                     this.ctx.lineTo(screenX + obs.w, screenY + obs.h);
                     this.ctx.fill();

                     // Wheels
                     this.ctx.fillStyle = '#111';
                     this.ctx.beginPath();
                     this.ctx.arc(screenX + 15, screenY + obs.h, 7, 0, Math.PI*2);
                     this.ctx.arc(screenX + obs.w - 15, screenY + obs.h, 7, 0, Math.PI*2);
                     this.ctx.fill();

                 } else if (obs.type === 'BARZINIS') {
                     // Background Storefront - Barzini's
                     // Note: We draw this 'behind' normally, but here it's an object.
                     // We should draw it relative to ground but it might look like a cutout. That's fine! 8-bit charm.
                     const storeH = 120;
                     const storeY = this.height - 20 - storeH;

                     this.ctx.fillStyle = '#8B4513'; // Brick
                     this.ctx.fillRect(screenX, storeY, obs.w, storeH);

                     // Awning
                     this.ctx.fillStyle = '#006400'; // Green
                     this.ctx.beginPath();
                     this.ctx.moveTo(screenX, storeY + 40);
                     this.ctx.lineTo(screenX + obs.w, storeY + 40);
                     this.ctx.lineTo(screenX + obs.w - 5, storeY + 60);
                     this.ctx.lineTo(screenX + 5, storeY + 60);
                     this.ctx.fill();

                     // Sign
                     this.ctx.fillStyle = '#FFF';
                     this.ctx.font = '16px serif';
                     this.ctx.fillText("BARZINI'S", screenX + 10, storeY + 30);

                 } else if (obs.type === 'SIGN_CITY') {
                     // "Welcome to my City" Sign
                     this.ctx.fillStyle = '#888'; // Pole
                     this.ctx.fillRect(screenX + obs.w/2 - 2, screenY, 4, obs.h);

                     this.ctx.fillStyle = '#008000'; // Green Sign
                     this.ctx.fillRect(screenX - 20, screenY - 30, 80, 40);
                     this.ctx.lineWidth = 2;
                     this.ctx.strokeStyle = '#fff';
                     this.ctx.strokeRect(screenX - 20, screenY - 30, 80, 40);

                     this.ctx.fillStyle = '#fff';
                     this.ctx.font = '10px sans-serif';
                     this.ctx.fillText("WELCOME TO", screenX - 15, screenY - 18);
                     this.ctx.fillText("MY CITY", screenX - 10, screenY - 5);

                 } else if (obs.type === 'SUBWAY_ENTRANCE') {
                     // Subway Entrance
                     this.ctx.fillStyle = '#222';
                     this.ctx.fillRect(screenX, screenY, obs.w, obs.h);

                     // Railing
                     this.ctx.strokeStyle = '#555';
                     this.ctx.beginPath();
                     this.ctx.moveTo(screenX, screenY);
                     this.ctx.lineTo(screenX + obs.w, screenY + obs.h);
                     this.ctx.stroke();

                     // M Sign
                     this.ctx.fillStyle = '#ffcc00';
                     this.ctx.beginPath();
                     this.ctx.arc(screenX + obs.w/2, screenY - 20, 15, 0, Math.PI*2);
                     this.ctx.fill();
                     this.ctx.fillStyle = '#000';
                     this.ctx.font = 'bold 20px sans-serif';
                     this.ctx.fillText("M", screenX + obs.w/2 - 8, screenY - 13);

                 } else if (obs.type === 'THIRD_RAIL') {
                     // The Third Rail
                     this.ctx.fillStyle = '#FF0000'; // Danger!
                     this.ctx.fillRect(screenX, screenY + obs.h - 5, obs.w, 5);

                     // Sparks
                     if (Math.random() > 0.7) {
                         this.ctx.fillStyle = '#FFFF00';
                         const sparkX = screenX + Math.random() * obs.w;
                         this.ctx.fillRect(sparkX, screenY - 5, 3, 3);
                     }
                 } else if (obs.type === 'TRASH_PILE') {
                     // Trash
                     this.ctx.fillStyle = '#555';
                     this.ctx.beginPath();
                     this.ctx.arc(screenX + obs.w/2, screenY + obs.h, obs.w/2, Math.PI, 0);
                     this.ctx.fill();

                     // Flies
                     this.ctx.fillStyle = '#000';
                     if (Math.random() > 0.5) this.ctx.fillRect(screenX + Math.random()*obs.w, screenY - 5, 2, 2);
                 }
            }
        }
    }

    drawRat(x, y, facingRight) {
        const screenX = x - this.cameraX;
        const screenY = this.height - 20 - y; // y is height from ground
        const now = Date.now();

        // Animations
        const breathe = Math.sin(now / 200) * 0.5; // Slight expansion/contraction
        const tailWag = Math.sin(now / 300) * 5;   // Tail swinging

        this.ctx.save();
        this.ctx.translate(screenX, screenY);
        if (!facingRight) this.ctx.scale(-1, 1);

        // Simple Rat Shape (A masterpiece of biological engineering)
        this.ctx.fillStyle = '#8B4513'; // Brown rat. Classic.
        this.ctx.beginPath();
        this.ctx.ellipse(0, -10, 20 + breathe, 10 + breathe, 0, 0, Math.PI * 2); // Body (filled with determination)
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(15, -12, 8, 0, Math.PI * 2); // Head (filled with schemes)
        this.ctx.fill();

        this.ctx.fillStyle = 'pink';
        this.ctx.beginPath();
        this.ctx.arc(10, -20, 4, 0, Math.PI * 2); // Ear (for hearing wrappers crinkle)
        this.ctx.fill();

        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(18, -14, 2, 0, Math.PI * 2); // Eye (watching YOU)
        this.ctx.fill();

        // Tail (The counterbalance of justice)
        this.ctx.strokeStyle = 'pink';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-15, -10);
        // Animate the control point and end point slightly
        this.ctx.quadraticCurveTo(-30, -5 + tailWag, -35, -15 + tailWag);
        this.ctx.stroke();

        this.ctx.restore();
    }
}
