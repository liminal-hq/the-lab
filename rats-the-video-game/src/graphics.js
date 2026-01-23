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
    }

    clear() {
        this.ctx.fillStyle = '#222'; // Dark city night. Perfect for sneaking.
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawCity(buildings) {
        // Draw moon (The big cheese in the sky)
        this.ctx.fillStyle = '#ddd';
        this.ctx.beginPath();
        this.ctx.arc(this.width - 100, 100, 40, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#555';
        for (const b of buildings) {
            const screenX = b.x - this.cameraX;
            // Cull off-screen buildings (If a tree falls and no rat hears it...)
            if (screenX + b.w > -100 && screenX < this.width + 100) {
                this.ctx.fillStyle = b.color || '#444';
                this.ctx.fillRect(screenX, this.height - b.h, b.w, b.h);

                // Windows (Human cages)
                this.ctx.fillStyle = '#FFD700'; // Yellow lights (They waste so much energy)
                // Simple window logic (Are they watching TV?)
                for (let wx = screenX + 5; wx < screenX + b.w - 5; wx += 20) {
                    for (let wy = this.height - b.h + 10; wy < this.height - 10; wy += 30) {
                        // Procedurally decide if window is lit based on position hash/random
                        if ((wx * wy) % 3 !== 0) {
                             this.ctx.fillRect(wx, wy, 10, 20);
                        }
                    }
                }
            }
        }

        // Ground (The floor is lava? No, the floor is concrete.)
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, this.height - 20, this.width, 20);
    }

    drawRat(x, y, facingRight) {
        const screenX = x - this.cameraX;
        const screenY = this.height - 20 - y; // y is height from ground

        this.ctx.save();
        this.ctx.translate(screenX, screenY);
        if (!facingRight) this.ctx.scale(-1, 1);

        // Simple Rat Shape (A masterpiece of biological engineering)
        this.ctx.fillStyle = '#8B4513'; // Brown rat. Classic.
        this.ctx.beginPath();
        this.ctx.ellipse(0, -10, 20, 10, 0, 0, Math.PI * 2); // Body (filled with determination)
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
        this.ctx.quadraticCurveTo(-30, -5, -35, -15);
        this.ctx.stroke();

        this.ctx.restore();
    }
}
