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
    obstacles: [], // The things in our way
    input: { left: false, right: false, jump: false, chew: false } // The human commands
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

        // Random Obstacles in the alleys
        //      _  _
        //     ( \/ )  <-- "Watch your step!"
        //      \  /
        const gap = Math.random() * 50 + 50; // Ensure enough space
        if (Math.random() < 0.4) {
            const obsX = x + w + gap / 2 - 15; // Center in the gap
            if (Math.random() < 0.5) {
                // A Box to chew
                state.obstacles.push({ x: obsX, w: 30, h: 30, type: 'BOX' });
            } else {
                // A Trap to jump
                state.obstacles.push({ x: obsX, w: 40, h: 10, type: 'TRAP' });
            }
        }
        x += w + gap;
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
    if (e.code === 'Enter' || e.code === 'KeyC') state.input.chew = true; // GNAW!
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') state.input.right = false;
    if (e.code === 'ArrowLeft') state.input.left = false;
    if (e.code === 'Space') state.input.jump = false;
    if (e.code === 'Enter' || e.code === 'KeyC') state.input.chew = false;
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

    // Obstacle Collision
    const ratL = state.rat.x - 15; // Body width approx
    const ratR = state.rat.x + 15;
    const ratB = state.rat.y;
    const ratT = state.rat.y + 20;

    for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        const obsL = obs.x;
        const obsR = obs.x + obs.w;
        const obsT = obs.h;

        // Simple AABB overlap check
        if (ratR > obsL && ratL < obsR && ratB < obsT) {
             if (obs.type === 'BOX') {
                 if (state.input.chew) {
                     // Nom nom nom
                     state.obstacles.splice(i, 1);
                     audio.playChew();
                 } else {
                     // Solid wall
                     if (state.rat.vx > 0 && ratR > obsL && ratL < obsL) {
                         state.rat.x = obsL - 15;
                         state.rat.vx = 0;
                     } else if (state.rat.vx < 0 && ratL < obsR && ratR > obsR) {
                         state.rat.x = obsR + 15;
                         state.rat.vx = 0;
                     }
                 }
             } else if (obs.type === 'TRAP') {
                 // SNAP!
                 //      \ | /
                 //     - X -  <-- Pain
                 //      / | \
                 audio.playSnap();
                 // Bounce back
                 state.rat.vy = 10;
                 state.rat.vx = state.rat.facingRight ? -10 : 10;
                 state.rat.grounded = false;
             }
        }
    }

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
    graphics.drawObstacles(state.obstacles);
    graphics.drawRat(state.rat.x, state.rat.y, state.rat.facingRight);
    requestAnimationFrame(loop);
}

// Start the chaos
loop();
