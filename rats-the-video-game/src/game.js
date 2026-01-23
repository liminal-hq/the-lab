import { AudioEngine } from './audio.js';
import { GraphicsEngine } from './graphics.js';

const canvas = document.getElementById('gameCanvas');
// Make canvas fill the screen or be substantial
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 100;

const audio = new AudioEngine();
const graphics = new GraphicsEngine(canvas);

// Game State
const state = {
    rat: { x: 100, y: 0, vx: 0, vy: 0, grounded: true, facingRight: true },
    buildings: [],
    input: { left: false, right: false, jump: false }
};

// Procedural Generation
function generateCity() {
    let x = 0;
    // Generate a long city
    for (let i = 0; i < 200; i++) {
        const w = 100 + Math.random() * 200;
        const h = 100 + Math.random() * (canvas.height - 200);
        state.buildings.push({ x, w, h, color: `hsl(${Math.random() * 360}, 20%, 30%)` });
        x += w + Math.random() * 50; // Alleys
    }
}

generateCity();

// Input
window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') state.input.right = true;
    if (e.code === 'ArrowLeft') state.input.left = true;
    if (e.code === 'Space') {
        state.input.jump = true;
        if (!audio.isPlaying) audio.startMusic();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') state.input.right = false;
    if (e.code === 'ArrowLeft') state.input.left = false;
    if (e.code === 'Space') state.input.jump = false;
});

// Physics Constants
const GRAVITY = 0.8;
const SPEED = 5;
const JUMP_FORCE = 15;

function update() {
    // Movement
    if (state.input.right) {
        state.rat.vx = SPEED;
        state.rat.facingRight = true;
    } else if (state.input.left) {
        state.rat.vx = -SPEED;
        state.rat.facingRight = false;
    } else {
        state.rat.vx = 0;
    }

    // Jump
    if (state.input.jump && state.rat.grounded) {
        state.rat.vy = JUMP_FORCE;
        state.rat.grounded = false;
        audio.playTone(660, 0.1, 15); // Jump sound
    }

    // Gravity
    state.rat.vy -= GRAVITY;
    state.rat.x += state.rat.vx;
    state.rat.y += state.rat.vy;

    // Floor collision
    if (state.rat.y <= 0) {
        state.rat.y = 0;
        state.rat.vy = 0;
        state.rat.grounded = true;
    }

    // Camera follow (keep rat in center)
    graphics.cameraX = state.rat.x - canvas.width / 2;
}

// Loop
function loop() {
    update();
    graphics.clear();
    graphics.drawCity(state.buildings);
    graphics.drawRat(state.rat.x, state.rat.y, state.rat.facingRight);
    requestAnimationFrame(loop);
}

// Start
loop();
