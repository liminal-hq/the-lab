import { AudioEngine } from './audio.js';
import { GraphicsEngine } from './graphics.js';

// ~~~ The Great Rat Control Center ~~~
// Where all the squeaking happens.
const canvas = document.getElementById('gameCanvas');

const audio = new AudioEngine();
const graphics = new GraphicsEngine(canvas);

// Resize logic to keep the rat world fitting snugly
//      __             _
//   .-'  `.  _  __  .' `.
//   :      \/ \/  \/     :
//    \                   /
//     `-.._  _  _  _..-'
//          `' `' `'
function resize() {
    const overlay = document.getElementById('overlay');
    // Account for overlay height + margins (10 top + 10 bottom)
    const overlayHeight = overlay ? overlay.offsetHeight + 20 : 100;

    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - overlayHeight - 30; // Extra buffer

    if (canvas.height < 150) canvas.height = 150; // Minimum height for rat activities

    // Update graphics engine dimensions
    if (graphics) {
        graphics.width = canvas.width;
        graphics.height = canvas.height;
    }
}

window.addEventListener('resize', resize);
resize();

// Game State: The Brain of the Rat
//      (\,/)
//      (o.o)
//     ( > < )
const state = {
    rat: { x: 100, y: 0, vx: 0, vy: 0, grounded: true, facingRight: true }, // The protagonist
    buildings: [], // The concrete jungle
    input: { left: false, right: false, jump: false } // The human commands
};

// Procedural Generation: Building the Maze
// "The city is a maze, and we are the masters." - Rat Proverb
function generateCity() {
    let x = 0;
    // Generate a long city (plenty of hiding spots)
    for (let i = 0; i < 200; i++) {
        const w = 100 + Math.random() * 200;
        const h = 100 + Math.random() * (canvas.height - 200);
        // Coloured like the gloom of night
        state.buildings.push({ x, w, h, color: `hsl(${Math.random() * 360}, 20%, 30%)` });
        x += w + Math.random() * 50; // Alleys for scurrying
    }
}

generateCity();

// Input: Translating human fingers to rat paws
window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') state.input.right = true; // Scurry right
    if (e.code === 'ArrowLeft') state.input.left = true;   // Scurry left
    if (e.code === 'Space') {
        state.input.jump = true; // LEAP!
        if (!audio.isPlaying) audio.startMusic(); // Cue the dramatic squeaks
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') state.input.right = false;
    if (e.code === 'ArrowLeft') state.input.left = false;
    if (e.code === 'Space') state.input.jump = false;
});

// Physics Constants (Rat Physics 101)
const GRAVITY = 0.8;      // What goes up, must come down (unless it climbs)
const SPEED = 5;          // Maximum scurrying velocity
const JUMP_FORCE = 15;    // The power of the hind legs

function update() {
    // Movement Logic
    if (state.input.right) {
        state.rat.vx = SPEED;
        state.rat.facingRight = true;
    } else if (state.input.left) {
        state.rat.vx = -SPEED;
        state.rat.facingRight = false;
    } else {
        state.rat.vx = 0; // Resting whiskers
    }

    // Jump Logic
    if (state.input.jump && state.rat.grounded) {
        state.rat.vy = JUMP_FORCE;
        state.rat.grounded = false;
        audio.playTone(660, 0.1, 15); // *Squeak!* (Jump sound)
    }

    // Gravity: The invisible paw pushing us down
    state.rat.vy -= GRAVITY;
    state.rat.x += state.rat.vx;
    state.rat.y += state.rat.vy;

    // Floor collision (The streets)
    if (state.rat.y <= 0) {
        state.rat.y = 0;
        state.rat.vy = 0;
        state.rat.grounded = true;
    }

    // Camera follow (keep our hero in the spotlight)
    // <( )_
    //  (   )
    graphics.cameraX = state.rat.x - canvas.width / 2;
}

// The Game Loop: The Heartbeat of the City
function loop() {
    update();
    graphics.clear();
    graphics.drawCity(state.buildings);
    graphics.drawRat(state.rat.x, state.rat.y, state.rat.facingRight);
    requestAnimationFrame(loop);
}

// Start the chaos
loop();
